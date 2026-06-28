import { OPENROUTER_API_URL, DEFAULT_MODEL } from "../config/api";
import type { ChatMessage, OpenRouterResponse } from "../types";

let apiKey = "";

export function setApiKey(key: string) {
  apiKey = key;
}

export function getApiKey(): string {
  return apiKey;
}

export async function sendMessage(
  messages: ChatMessage[],
  model: string = DEFAULT_MODEL,
  onStream?: (chunk: string) => void
): Promise<string> {
  if (!apiKey) {
    throw new Error("API key not set. Please enter your Open Router API key.");
  }

  const apiMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const useStream = !!onStream;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://github.com/yourusername/ai-chatbot",
      "X-Title": "AI Chatbot",
    },
    body: JSON.stringify({
      model,
      messages: apiMessages,
      stream: useStream,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `OpenRouter API error (${response.status}): ${errorBody}`
    );
  }

  if (useStream) {
    return handleStreamResponse(response, onStream!);
  }

  const data: OpenRouterResponse = await response.json();
  return data.choices[0]?.message?.content || "";
}

async function handleStreamResponse(
  response: Response,
  onStream: (chunk: string) => void
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Stream not supported");

  const decoder = new TextDecoder();
  let fullContent = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

      for (const line of lines) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || "";
          if (content) {
            fullContent += content;
            onStream(content);
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullContent;
}
