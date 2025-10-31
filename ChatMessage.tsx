import React from 'react';
import { type ChatMessage, MessageRole } from '../types';
import { UserIcon, BotIcon } from './icons';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  if (!message.content && message.role === MessageRole.MODEL) {
    return null; // Don't render empty model messages (placeholders)
  }

  const messageContainerClasses = isUser
    ? 'flex items-end justify-end gap-2'
    : 'flex items-end gap-2';

  const messageBubbleClasses = isUser
    ? 'bg-indigo-600 rounded-2xl rounded-br-none'
    : 'bg-gray-700 rounded-2xl rounded-bl-none';

  return (
    <div className={messageContainerClasses}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          <BotIcon />
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl p-3 px-4 text-white ${messageBubbleClasses}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
          <UserIcon />
        </div>
      )}
    </div>
  );
};