import { MODEL_THINKING, THINKING } from "./constants";

export const chat = async (
  messages: Message[],
  model: string,
  onData?: (chunk: string) => void,
  debug: boolean = false
): Promise<string> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!response.ok || !response.body) {
    const errMsg = await response.text();
    throw new Error(`Erreur réseau: ${response.status} - ${errMsg}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let result = "";
  let isThinkingDone = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      try {
        // All responses now follow the Ollama format
        const json = JSON.parse(line);
        const response = json.message.content;

        if (response) {
          if (debug || isThinkingDone || !MODEL_THINKING.includes(model)) {
            result += response;
            onData?.(response);
          }
          if (!isThinkingDone && THINKING.includes(response)) {
            isThinkingDone = true;
          }
        }
      } catch (err) {
        console.warn("Erreur de parsing JSON:", line, err);
      }
    }
  }

  return result;
};

export const getModels = async (): Promise<string[]> => {
  const response = await fetch("/api/models", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Erreur réseau: ${response.status}`);
  }

  const data = await response.json();
  return data.models;
};

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};
