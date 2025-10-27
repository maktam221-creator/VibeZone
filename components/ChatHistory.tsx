import React, { useRef, useEffect } from 'react';
import { type ChatMessage, MessageRole } from '../types';
import { Message } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      {isLoading && messages[messages.length-1]?.role === MessageRole.USER && <TypingIndicator />}
      <div ref={endOfMessagesRef} />
    </div>
  );
};