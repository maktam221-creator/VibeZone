import React from 'react';
import { useChat } from '../hooks/useChat';
import { ChatHistory } from '../components/ChatHistory';
import { MessageInput } from '../components/MessageInput';
import { XIcon } from '../components/icons';

interface ChatScreenProps {
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onBack }) => {
  const { messages, sendMessage, isLoading, error } = useChat();

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <header className="flex items-center p-4 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700 shadow-lg flex-shrink-0">
        <div className="w-8">
            <button onClick={onBack} aria-label="إغلاق" className="text-gray-400 hover:text-white">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        <h1 className="flex-1 text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            مساعد VibeZone الذكي
        </h1>
        <div className="w-8"></div>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatHistory messages={messages} isLoading={isLoading} />
      </div>
      <div className="p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};