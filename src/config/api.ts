export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const DEFAULT_MODEL = "openai/gpt-3.5-turbo";

export const SUPPORTED_MODELS = [
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini" },
  { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
  { id: "google/gemini-pro", name: "Gemini Pro" },
  { id: "meta-llama/llama-3-70b-instruct", name: "Llama 3 70B" },
  { id: "mistralai/mistral-7b-instruct", name: "Mistral 7B" },
];
