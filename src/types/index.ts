export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface OpenRouterRequest {
  model: string;
  messages: { role: string; content: string }[];
  stream?: boolean;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterStreamChunk {
  id: string;
  choices: {
    delta: { content?: string; role?: string };
    finish_reason: string | null;
  }[];
}
