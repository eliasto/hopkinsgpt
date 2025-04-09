import React from "react";
import { ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 my-3 overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <code className="font-mono text-sm text-gray-800 dark:text-gray-200">
          {code}
        </code>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="ml-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Copier dans le presse-papier"
        >
          <ClipboardCopy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface NoModelAvailableProps {
  preferredModel?: string;
}

export function NoModelAvailable({
  preferredModel = "mistral",
}: NoModelAvailableProps) {
  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center border-b pb-4">
        <CardTitle className="text-xl font-semibold">
          Aucun modèle disponible
        </CardTitle>
        <CardDescription>
          Oh oh... Il semble qu&apos;aucun modèle ne soit disponible pour
          discuter.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Veuillez vérifier que{" "}
            <a
              href="https://ollama.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Ollama
            </a>{" "}
            est correctement installé et fonctionne sur votre système.
          </p>

          <div>
            <p className="text-sm font-medium mb-2">
              Pour installer mistral, utilisez la commande suivante :
            </p>
            <CodeBlock code={`ollama pull ${preferredModel}`} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex justify-center">
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="w-full"
        >
          Rafraîchir la page
        </Button>
      </CardFooter>
    </Card>
  );
}
