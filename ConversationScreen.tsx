import React, { useState, useRef, useEffect } from 'react';
import type { Conversation, User, UserMessage } from '../types';
import { ChevronLeftIcon, PaperPlaneIcon } from '../components/icons';

const MessageBubble: React.FC<{ message: UserMessage; isCurrentUser: boolean; user: User }> = ({ message, isCurrentUser, user }) => {
    const messageContainerClasses = isCurrentUser
        ? 'flex items-end justify-end'
        : 'flex items-start justify-start gap-2';
    
    const messageBubbleClasses = isCurrentUser
        ? 'bg-indigo-600 rounded-2xl rounded-br-none'
        : 'bg-gray-700 rounded-2xl rounded-bl-none';

    return (
        <div className={messageContainerClasses}>
             {!isCurrentUser && (
                <img src={user.avatarUrl} alt={user.username} className="w-8 h-8 rounded-full" />
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-2xl p-3 px-4 text-white ${messageBubbleClasses}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};


interface ConversationScreenProps {
    conversation: Conversation;
    currentUser: User;
    onSendMessage: (conversationId: string, text: string) => void;
    onBack: () => void;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({ conversation, currentUser, onSendMessage, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(conversation.id, newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            <header className="flex items-center p-3 border-b border-gray-800 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
                <button onClick={onBack} aria-label="العودة" className="p-2 -ml-2">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <img src={conversation.user.avatarUrl} alt={conversation.user.username} className="w-10 h-10 rounded-full" />
                    <span className="font-bold text-lg">{conversation.user.name || conversation.user.username}</span>
                </div>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.messages.map(msg => (
                    <MessageBubble 
                        key={msg.id} 
                        message={msg} 
                        isCurrentUser={msg.senderId === currentUser.username} 
                        user={conversation.user}
                    />
                ))}
                <div ref={endOfMessagesRef} />
            </div>
            
            <footer className="p-3 border-t border-gray-800 bg-gray-900">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        className="flex-1 bg-gray-800 text-white rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" disabled={!newMessage.trim()} className="w-11 h-11 bg-indigo-600 rounded-full flex items-center justify-center text-white transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 flex-shrink-0" aria-label="إرسال">
                        <PaperPlaneIcon className="w-5 h-5" />
                    </button>
                </form>
            </footer>
        </div>
    );
};
