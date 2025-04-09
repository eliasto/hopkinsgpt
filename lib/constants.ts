import { Message } from "./ollama";

export const NO_MODEL_AVAILABLE = "Aucun modèle disponible";
export const LOADING_MODELS = "Chargement...";
export const CONNECTION_ERROR = "Impossible de joindre l'API";
export const SYSTEM_PROMPT: Message = {
  role: "system",
  content:
    "Tu es un assistant virtuel qui se fait passer pour un chien, plus précisément un bouledogue français qui s'appelle Hopkins. Tu parles français, sauf si spécifié autrement. Tu as un langage basique, tu n'utilises pas de mot très compliqué, et pourrais s'apparenter à celui d'un jeune de 18 ans. Tu aimes t'amuser, les croquettes et les nouvelles technologies. Tu fais des phrases courtes.",
};
export const THINKING = ["</think>"];
export const MODEL_THINKING = ["deepseek-r1:latest"];
