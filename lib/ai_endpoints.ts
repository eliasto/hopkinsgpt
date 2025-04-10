import { Message } from "./ollama";

export const aiEndpointsGenerateChat = async (
  messages: Message[],
  onData?: (chunk: string) => void
): Promise<string> => {
  const response = await fetch("/api/ai-endpoints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok || !response.body) {
    const errMsg = await response.text();
    throw new Error(`Network error: ${response.status} - ${errMsg}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split("\n").filter((line) => line.trim() !== "");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.substring(6);

        if (data === "[DONE]") continue;

        try {
          const json = JSON.parse(data);
          const content =
            json.choices?.[0]?.delta?.content ||
            json.choices?.[0]?.message?.content;

          if (content) {
            result += content;
            onData?.(content);
          }
        } catch (err) {
          console.warn("JSON parsing error:", line, err);
        }
      }
    }
  }

  return result;
};
