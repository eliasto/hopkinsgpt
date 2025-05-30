"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChatBubble } from "@/components/chat-bubble";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ModelSelector } from "@/components/model-selector";
import Image from "next/image";
import { LOADING_MODELS, PET_NAME } from "@/lib/constants";
import { LucideGithub, Send } from "lucide-react";
import { NoModelAvailable } from "@/components/no-model-available";
import { motion, AnimatePresence } from "framer-motion";
import { Loading } from "@/components/loading";
import { chat } from "@/lib/api";
import { Message, Model } from "@/lib/interfaces";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState(LOADING_MODELS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
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
      await chat(
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

  const noModel = false;
  const isLoading = model === LOADING_MODELS;

  return (
    <div className="bg-background flex flex-col h-dvh">
      <header className="border-b bg-gradient-to-r from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-sm transition-colors duration-300">
        <div className="max-w-4xl mx-auto w-full">
          <div className="absolute top-4 right-4 space-x-2">
            <ThemeToggle />
            <a href="https://github.com/eliasto/hopkinsgpt" target="_blank">
              <Button variant="outline" size="icon" className="cursor-pointer">
                <LucideGithub className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                <span className="sr-only">Go to the Github project</span>
              </Button>
            </a>
          </div>
          <div className="p-1 flex items-center justify-center sm:p-4 gap-3">
            <h1 className="text-xl font-bold bg-clip-text sm:text-3xl mt-2">
              {PET_NAME}GPT
            </h1>
          </div>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-4 italic">
            Ouaf Ouaf ! {PET_NAME} s&apos;il pouvait discuter.
          </p>
          {apiError && (
            <div className="pb-4 text-center">
              <p className="text-red-500 text-center">
                Impossible de se connecter à <strong>ollama</strong>.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Llama 3.7 utilisant AI Endpoints (OVHcloud) est disponible.
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

          {messages.length === 0 && !noModel && !isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 rounded-lg max-w-md">
                <Image
                  className="inline-flex p-3 mb-4"
                  src="/hopkins_round.png"
                  alt={PET_NAME}
                  width={96}
                  height={96}
                />
                <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Prêt à discuter
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Posez une question ou discutez avec {PET_NAME}, ton chien
                  virtuel.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {!noModel && !isLoading && (
        <footer className="border-t bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300">
          <div className=" p-1 max-w-2xl mx-auto sm:p-4">
            <div className="relative rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all">
              <Textarea
                disabled={noModel || isGenerating}
                placeholder="Tape ton message ici…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="sm:min-h-[100px] min-h-[80px] max-h-[200px] pb-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-blue-500 transition-all resize-none shadow-none"
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-2">
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
                    <Send className="h-4 w-4 sm:mr-1" />
                  )}
                  <span className="hidden sm:inline">Envoyer</span>
                </Button>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 sm:hidden p-2">
              Certaines des réponses peuvent être inexactes.
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 hidden sm:block pt-2">
              {PET_NAME} ne connaissant pas très bien la langue des humains,
              certaines de ses réponses peuvent être inexactes.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
