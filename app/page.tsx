"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChatBubble } from "@/components/chat-bubble";
import { generatePrompt } from "@/lib/ollama";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ModelSelector } from "@/components/model-selector";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState("deepseek-r1");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      await generatePrompt(
        input,
        model,
        (chunk) => {
          assistantMsg.content += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...assistantMsg };
            return updated;
          });
        },
        false
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      assistantMsg.content = "❌ Erreur lors de la génération.";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...assistantMsg };
        return updated;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-background flex flex-col h-screen">
      <div className="border">
        <h1 className="text-3xl font-bold text-center mt-4">HopkinsGPT</h1>
        <p className="text-center text-gray-500 mb-4">
          Posez vos questions, je suis là pour vous aider !
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div
          ref={containerRef}
          className="h-full overflow-y-auto space-y-4 p-4 max-w-2xl mx-auto"
        >
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              isLoading={msg.content.length < 1}
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Textarea
              placeholder="Tape ton message ici…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[120px] pr-20 bg-white"
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <ThemeToggle />
              <ModelSelector model={model} setModel={setModel} />
              <Button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="px-4 text-sm"
              >
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
