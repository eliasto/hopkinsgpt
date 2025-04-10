"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChatBubble } from "@/components/chat-bubble";
import { generateChat, Message } from "@/lib/ollama";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ModelSelector } from "@/components/model-selector";
import Image from "next/image";
import {
  AI_ENDPOINTS_NAME,
  LOADING_MODELS,
  NO_MODEL_AVAILABLE,
  SYSTEM_PROMPT,
} from "@/lib/constants";
import { Dog, Send } from "lucide-react";
import { NoModelAvailable } from "@/components/no-model-available";
import { motion, AnimatePresence } from "framer-motion";
import { Loading } from "@/components/loading";
import { aiEndpointsGenerateChat } from "@/lib/ai_endpoints";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([SYSTEM_PROMPT]);
  const [model, setModel] = useState(LOADING_MODELS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (containerRef.current) {
      const { scrollHeight } = containerRef.current;
      containerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev: Message[]) => [...prev, assistantMsg]);

    try {
      if (model === AI_ENDPOINTS_NAME) {
        await aiEndpointsGenerateChat([...messages, userMessage], (chunk) => {
          assistantMsg.content += chunk;
          setMessages((prev: Message[]) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...assistantMsg };
            return updated;
          });
        });
      } else {
        await generateChat(
          [...messages, userMessage],
          model,
          (chunk) => {
            assistantMsg.content += chunk;
            setMessages((prev: Message[]) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...assistantMsg };
              return updated;
            });
          },
          false
        );
      }
    } catch (err) {
      console.error("Error generating response:", err);
      assistantMsg.content = "❌ Erreur lors de la génération.";
      setMessages((prev: Message[]) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...assistantMsg };
        return updated;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const noModel = model === NO_MODEL_AVAILABLE;
  const isLoading = model === LOADING_MODELS;

  return (
    <div className="bg-background flex flex-col h-dvh">
      <header className="border-b bg-gradient-to-r from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-sm transition-colors duration-300">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-center p-4 gap-3">
            <div className="relative group">
              <div className="absolute transition duration-300 group-hover:duration-200"></div>
              <div className="relative">
                <Image
                  src="/hopkins.png"
                  alt="Hopkins"
                  width={48}
                  height={48}
                  className="rounded-full transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text">HopkinsGPT</h1>
          </div>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-4 italic">
            Ouaf Ouaf ! Hopkins s&apos;il pouvait discuter.
          </p>
          {apiError && (
            <div className="pb-4 text-center">
              <p className="text-red-500 text-center">
                Impossible de se connecter à <strong>ollama</strong>. Seulement
                AI Endpoints est disponible.
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div
          ref={containerRef}
          className="h-full overflow-y-auto p-4 md:p-6 max-w-2xl mx-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
        >
          {isLoading && (
            <Loading
              model={model}
              setModel={setModel}
              availableModels={availableModels}
              setAvailableModels={setAvailableModels}
              setApiError={setApiError}
            />
          )}

          {noModel && <NoModelAvailable preferredModel="mistral" />}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <ChatBubble message={msg} isLoading={msg.content.length < 1} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add bottom space to ensure last message is fully visible */}
          {messages.length > 0 && <div className="h-4"></div>}

          {messages.length === 1 && !noModel && !isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 rounded-lg max-w-md">
                <div className="inline-flex p-3 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  <Dog className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Prêt à discuter
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Posez une question ou discutez avec Hopkins, votre chien
                  virtuel.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {!noModel && !isLoading && (
        <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300">
          <div className="max-w-2xl mx-auto p-4">
            <div className="relative rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all">
              <Textarea
                disabled={noModel || isGenerating}
                placeholder="Tape ton message ici…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[100px] pr-24 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-none"
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                <ThemeToggle />
                <ModelSelector
                  model={model}
                  setModel={setModel}
                  availableModels={availableModels}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isGenerating}
                  className="px-4 text-sm transition-all duration-300 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:text-white"
                >
                  {isGenerating ? (
                    <div className="h-4 w-4 border-2 border-white dark:border-gray-200 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1" />
                      Envoyer
                    </>
                  )}
                </Button>{" "}
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              Hopkins ne connaissant pas très bien la langue des humains,
              certaines de ses réponses peuvent être inexactes.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
