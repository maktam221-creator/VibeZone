import { GoogleGenAI, Chat } from "@google/genai";

// The API key is expected to be available in the environment.
// The check is removed to prevent crashes in browser environments where `process` might not be defined.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'أنت مساعد ودود ومفيد. أجب باللغة العربية.',
    },
  });
  return chat;
};