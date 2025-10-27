import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { VideoPost, LiveComment } from '../types';

// Singleton instance, lazily initialized
let ai: GoogleGenAI | null = null;

function getAiInstance(): GoogleGenAI {
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}


export const createChatSession = (): Chat => {
  const ai = getAiInstance();
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'أنت "مساعد VibeZone الذكي"، مساعد ودود ومبدع في تطبيق فيديوهات قصيرة اسمه VibeZone. تخصصك هو مساعدة المستخدمين في الحصول على أفكار للمحتوى، كتابة أوصاف جذابة، واقتراح أغاني رائجة. كن إيجابياً ومشجعاً. أجب دائماً باللغة العربية.',
    },
  });
  return chat;
};

export const suggestCaption = async (context?: string): Promise<string> => {
    const ai = getAiInstance();
    const prompt = `اقترح وصفاً قصيراً وجذاباً ورائجاً باللغة العربية لفيديو على تطبيق VibeZone. قم بتضمين 1-3 هاشتاجات ذات صلة. ${context ? `الفيديو يدور حول: "${context}"` : ''}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const generateLiveComments = async (topic: string): Promise<LiveComment[]> => {
    const ai = getAiInstance();
    const prompt = `أنت مشاهد في بث مباشر على تطبيق VibeZone. موضوع البث هو "${topic}". قم بإنشاء قائمة من 15 تعليقًا متنوعًا قد يكتبها الجمهور. يجب أن تكون التعليقات قصيرة، واقعية، وباللهجة العامية العربية (خليط من اللهجات). اجعلها متنوعة بين الأسئلة، الإطراءات، النكات، والتعليقات العشوائية.
قدم الإجابة كـ JSON array. يجب أن يمثل كل كائن في الـ array تعليقًا واحدًا ويجب أن يكون له البنية التالية:
- id: سلسلة فريدة.
- user: كائن يحتوي على username (اسم مستخدم عربي عشوائي) و avatarUrl (رابط صورة رمزية عشوائي من https://i.pravatar.cc/150?u= متبوعًا بسلسلة عشوائية).
- text: نص التعليق.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            user: {
                                type: Type.OBJECT,
                                properties: {
                                    username: { type: Type.STRING },
                                    avatarUrl: { type: Type.STRING },
                                },
                                required: ['username', 'avatarUrl']
                            },
                            text: { type: Type.STRING },
                        },
                        required: ['id', 'user', 'text']
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as LiveComment[];
    } catch (error) {
        console.error("Failed to generate live comments:", error);
        // Return fallback comments on error
        return [
            { id: 'fallback-1', user: { username: 'متابع', avatarUrl: 'https://i.pravatar.cc/150?u=fallback1' }, text: 'منور البث! 🔥' },
            { id: 'fallback-2', user: { username: 'مشاهد', avatarUrl: 'https://i.pravatar.cc/150?u=fallback2' }, text: 'أفضل ستريمر والله' },
            { id: 'fallback-3', user: { username: 'متحمس', avatarUrl: 'https://i.pravatar.cc/150?u=fallback3' }, text: 'كمل يا أسطورة!' },
        ];
    }
};