import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message } from "@/lib/interfaces";

type ChatBubbleProps = {
  message: Message;
  isLoading: boolean;
};

type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  children?: ReactNode;
};

export function ChatBubble({ message, isLoading }: ChatBubbleProps) {
  const isUser = message.role === "user";
  if (message.role === "system") return null;

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
        {isLoading ? (
          <LoaderDots />
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                code: CodeBlock,
                a: ({ children, ...props }) => (
                  <a
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
                p: ({ children, ...props }) => (
                  <p className="my-1" {...props}>
                    {children}
                  </p>
                ),
                h1: ({ children, ...props }) => (
                  <h1 className="text-xl font-bold my-2" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2 className="text-lg font-bold my-2" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ children, ...props }) => (
                  <h3 className="text-md font-bold my-1" {...props}>
                    {children}
                  </h3>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="list-disc ml-6 my-2" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal ml-6 my-2" {...props}>
                    {children}
                  </ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="my-1" {...props}>
                    {children}
                  </li>
                ),
                blockquote: ({ children, ...props }) => (
                  <blockquote
                    className="border-l-4 border-gray-300 dark:border-gray-500 pl-4 my-2 italic"
                    {...props}
                  >
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function CodeBlock({ inline, children, ...props }: CodeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (inline) {
    return (
      <code
        className="bg-gray-100 dark:bg-gray-700 dark:text-white px-1 py-0.5 rounded text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded p-2 my-2 overflow-x-auto relative group">
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 bg-white dark:bg-gray-800"
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <Check className="h-2 w-2 text-green-500 dark:text-green-300" />
                ) : (
                  <Clipboard className="h-2 w-2" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isCopied ? "Copié!" : "Copier le code"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <code className="text-sm block" {...props}>
        {children}
      </code>
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
