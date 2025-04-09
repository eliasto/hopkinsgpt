const apiUrl = "http://localhost:11434/api/";
const systemPrompt =
  "Tu es un assistant virtuel qui se fait passer pour un chien qui s'appelle Hopkins.";
const thinking = ["</think>"];
const modelThinking = ["deepseek-r1:latest"];

export const generatePrompt = async (
  prompt: string,
  model = "deepseek-r1",
  onData?: (chunk: string) => void,
  debug: boolean = false
): Promise<string> => {
  const response = await fetch(apiUrl + "generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
      system: systemPrompt,
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
        if (json.response) {
          if (debug || isThinkingDone || !modelThinking.includes(model)) {
            result += json.response;
            onData?.(json.response);
          }
          if (!isThinkingDone && thinking.includes(json.response)) {
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
  const response = await fetch(apiUrl + "tags", {
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
