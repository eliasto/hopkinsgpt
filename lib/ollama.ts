import { MODEL_THINKING, THINKING } from "./constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const generateChat = async (
  messages: Message[],
  model = "deepseek-r1",
  onData?: (chunk: string) => void,
  debug: boolean = false
): Promise<string> => {
  const response = await fetch(API_URL + "chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: messages,
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
  const response = await fetch(API_URL + "tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur réseau: ${response.status}`);
  }

  const data: ModelsResponse = await response.json();
  const models = data.models.map((model) => model.name);
  console.log("Models:", models);
  return models;
};

interface ModelDetails {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

interface Model {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: ModelDetails;
}

interface ModelsResponse {
  models: Model[];
}

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};
