import { GoogleGenAI, Chat } from "@google/genai";

// هام: استبدل "YOUR_GEMINI_API_KEY" بمفتاح API الحقيقي الخاص بك من Google AI Studio.
// ميزة الدردشة مع Gemini لن تعمل بدون مفتاح API صالح.
const GEMINI_API_KEY = "AIzaSyBX61P3Tv1qbNpccDd2IfhIjTKD9pmwwZE";

// The check for the API key is removed to prevent crashes in browser environments.
// It's crucial that the user replaces the placeholder above.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const createChatSession = (): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'أنت مساعد ودود ومفيد. أجب باللغة العربية.',
    },
  });
  return chat;
};