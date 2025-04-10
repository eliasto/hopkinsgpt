import { Message } from "@/lib/ollama";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  message: Message;
  isLoading: boolean;
};

export function ChatBubble({ message, isLoading }: ChatBubbleProps) {
  const isUser = message.role === "user";
  if (message.role === "system") return;

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl shadow",
          isUser
            ? "bg-slate-700 dark:bg-gray-600 text-white rounded-br-none"
            : "bg-gray-200 dark:bg-gray-300 text-black rounded-bl-none"
        )}
      >
        {isLoading ? <LoaderDots /> : message.content}
      </div>
    </div>
  );
}

function LoaderDots() {
  return (
    <div className="flex space-x-1 h-4 items-center justify-center">
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );
}
