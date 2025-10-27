import React from 'react';
import { type ChatMessage, MessageRole } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';

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
    : 'bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-bl-none';

    const messageTextClasses = isUser ? 'text-white' : 'text-gray-900 dark:text-white';
    
    const iconContainerClasses = 'flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center';

  return (
    <div className={messageContainerClasses}>
      {!isUser && (
        <div className={iconContainerClasses}>
          <BotIcon />
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl p-3 px-4 ${messageBubbleClasses}`}>
        <p className={`whitespace-pre-wrap ${messageTextClasses}`}>{message.content}</p>
      </div>
       {isUser && (
        <div className={iconContainerClasses}>
          <UserIcon />
        </div>
      )}
    </div>
  );
};