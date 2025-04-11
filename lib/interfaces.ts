export class Model {
  name: string;
  source: ModelSource;

  constructor(name: string, source: ModelSource) {
    this.name = name;
    this.source = source;
  }
}

export enum ModelSource {
  OLLAMA = "ollama",
  AI_ENDPOINTS = "ai_endpoints",
}

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};
