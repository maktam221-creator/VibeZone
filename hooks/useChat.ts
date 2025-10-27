import { useState, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession } from '../services/geminiService';
import { type ChatMessage, MessageRole } from '../types';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const initializeChat = useCallback(() => {
    if (!chatRef.current) {
      chatRef.current = createChatSession();
    }
  }, []);

  const sendMessage = async (userMessage: string) => {
    if (isLoading) return;

    setError(null);
    setIsLoading(true);
    initializeChat();

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: MessageRole.USER,
      content: userMessage,
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const modelMessageId = `model-${Date.now()}`;
    // Add a placeholder for the model's response
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: modelMessageId, role: MessageRole.MODEL, content: '' },
    ]);

    try {
      if (!chatRef.current) {
        throw new Error("Chat session is not initialized.");
      }
      const stream = await chatRef.current.sendMessageStream({ message: userMessage });
      
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === modelMessageId ? { ...msg, content: fullResponse } : msg
            )
          );
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(e);
      setError(`فشل في جلب الرد: ${errorMessage}`);
      setMessages((prev) => prev.filter(msg => msg.id !== modelMessageId)); // remove placeholder on error
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading, error };
};