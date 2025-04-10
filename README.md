![Illustration](.github/illustration.png)

## HopkinsGPT

Petit test d'utilisation d'ollama pour discuter avec mon chien !

## Installation

Suivre les instructions sur le site de [Ollama](https://ollama.com/) pour installer Ollama.
Installez ensuite les différents modèles avec `ollama pull <model>`.

Créez un fichier `.env` à la racine du projet contenant l'URL de l'API de votre instance Ollama :

```bash
NEXT_PUBLIC_API_URL=http://localhost:11434/api/
NEXT_PUBLIC_AI_ENDPOINTS_TOKEN=your_token
```

Pour obtenir votre token de AI Endpoints, rendez-vous sur le site de [OVHCloud](https://endpoints.ai.cloud.ovh.net/).
