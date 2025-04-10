import { AI_ENDPOINTS, SYSTEM_PROMPT } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();
    const messagesWithSystemPrompt = [SYSTEM_PROMPT, ...messages];

    if (
      !messagesWithSystemPrompt ||
      !Array.isArray(messagesWithSystemPrompt) ||
      !model
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    let originalResponse;

    if (model === AI_ENDPOINTS) {
      const API_KEY = process.env.AI_ENDPOINTS_TOKEN;
      const modelEndpoint =
        "https://llama-3-3-70b-instruct.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v1/chat/completions";

      originalResponse = await fetch(modelEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          messages: messagesWithSystemPrompt,
          stream: true,
        }),
      });
    } else {
      const OLLAMA_API_URL = process.env.OLLAMA_API_URL;

      originalResponse = await fetch(`${OLLAMA_API_URL}chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: messagesWithSystemPrompt,
        }),
      });
    }

    if (!originalResponse.ok || !originalResponse.body) {
      const errorText = await originalResponse.text();
      return NextResponse.json(
        { error: errorText },
        { status: originalResponse.status }
      );
    }

    const transformStream = new TransformStream({
      transform: async (chunk, controller) => {
        const decoder = new TextDecoder();
        const text = decoder.decode(chunk, { stream: true });

        if (model === AI_ENDPOINTS) {
          const lines = text.split("\n").filter((line) => line.trim() !== "");

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
                  const ollamaFormatted =
                    JSON.stringify({
                      message: {
                        content: content,
                      },
                    }) + "\n";

                  const encoder = new TextEncoder();
                  controller.enqueue(encoder.encode(ollamaFormatted));
                }
              } catch (err) {
                console.warn("Error parsing JSON:", err);
              }
            }
          }
        } else {
          controller.enqueue(chunk);
        }
      },
    });

    return new Response(originalResponse.body.pipeThrough(transformStream), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
