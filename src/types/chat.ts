import { OpenAIModel } from "./openai";

export interface Message {
  user: string;
  text: string;
  }

export type Role = "assistant" | "user";

export interface Conversation {
    id: string;
    name: string;
    messages: Message[];
    model: OpenAIModel;
    prompt: string;
    folderId: string | null;
  }
  