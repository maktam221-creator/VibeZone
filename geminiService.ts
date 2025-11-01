import { GoogleGenAI, Chat } from "@google/genai";

// The API key is securely sourced from the environment variable.
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
