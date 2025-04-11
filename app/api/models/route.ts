import { NextResponse } from "next/server";

export async function GET() {
  try {
    const OLLAMA_API_URL = process.env.OLLAMA_API_URL;

    const response = await fetch(`${OLLAMA_API_URL}tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const models = data.models.map((model: { name: string }) => model.name);

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json({ models: [] });
  }
}
