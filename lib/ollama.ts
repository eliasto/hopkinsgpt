const apiUrl = "http://localhost:11434/api/generate";

export const generatePrompt = async (
  prompt: string,
  model = "deepseek-r1",
  onData?: (chunk: string) => void,
  debug: boolean = false
): Promise<string> => {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const errMsg = await response.text();
    throw new Error(`Erreur réseau: ${response.status} - ${errMsg}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let result = "";
  let isThinkDone = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split("\n").filter((line) => line.trim() !== "");
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.response) {
          console.log("Réponse:", json.response, debug);
          if (debug || isThinkDone) {
            result += json.response;
            onData?.(json.response);
          }
          if (!isThinkDone && json.response === "</think>") {
            isThinkDone = true;
          }
        }
      } catch (err) {
        console.warn("Erreur de parsing JSON:", line, err);
      }
    }
  }

  return result;
};
