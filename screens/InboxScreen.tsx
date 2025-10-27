import React, { useState, useEffect } from 'react';
import type { ConversationPreview, User, Screen } from '../types';
import { api } from '../services/apiService';
import { SparklesIcon } from '../components/icons';

const ConversationItem: React.FC<{ conversation: ConversationPreview, onClick: () => void }> = ({ conversation, onClick }) => {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-4 p-3 hover:bg-gray-900 rounded-lg transition-colors text-left">
            <div className="relative flex-shrink-0">
                <img src={conversation.user.avatarUrl} alt={conversation.user.username} className="w-14 h-14 rounded-full" />
                {!conversation.isRead && (
                    <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full bg-purple-500 border-2 border-black"></span>
                )}
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex items-baseline justify-between">
                    <p className="font-bold truncate">{conversation.user.username}</p>
                    <p className="text-xs text-gray-400 flex-shrink-0">
                         {new Date(conversation.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <p className={`text-sm truncate ${conversation.isRead ? 'text-gray-400' : 'text-white font-medium'}`}>
                    {conversation.lastMessage}
                </p>
            </div>
        </button>
    );
};


export const InboxScreen: React.FC<{ 
    onOpenConversation: (user: User) => void;
    onNavigate: (screen: Screen) => void; 
}> = ({ onOpenConversation, onNavigate }) => {
    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        try {
            const convos = api.getConversations();
            setConversations(convos);
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="space-y-2 p-2 animate-pulse">
                    {Array(6).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3">
                           <div className="w-14 h-14 rounded-full bg-gray-800"></div>
                           <div className="flex-1 space-y-2">
                               <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                               <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                           </div>
                        </div>
                    ))}
                </div>
            )
        }
        if (conversations.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-128px)] text-gray-500 text-center">
                    <div className="text-5xl mb-4">📨</div>
                    <h2 className="text-xl font-bold">لا توجد رسائل</h2>
                    <p className="text-gray-400 mt-2 max-w-sm">عندما تتابع شخصًا ويتابعك، ستتمكن من بدء محادثة معه من هنا.</p>
                </div>
            )
        }
        return (
            <div className="divide-y divide-gray-800">
                {conversations.map((convo) => (
                    <ConversationItem key={convo.user.id} conversation={convo} onClick={() => onOpenConversation(convo.user)} />
                ))}
            </div>
        );
    }

  return (
    <div className="h-full overflow-y-auto pb-16 bg-black text-white">
        <header className="flex items-center justify-between p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10 border-b border-gray-800">
            <div className="w-8"></div> {/* Spacer */}
            <h1 className="text-xl font-bold text-center">صندوق الوارد</h1>
            <button onClick={() => onNavigate('ai_chat')} aria-label="مساعد VibeZone الذكي" className="text-gray-300 hover:text-white">
                <SparklesIcon className="w-6 h-6" />
            </button>
        </header>
        <div className="p-2">
            {renderContent()}
        </div>
    </div>
  );
};