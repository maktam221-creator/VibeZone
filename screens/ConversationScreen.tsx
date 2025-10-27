import React, { useState, useRef, useEffect } from 'react';
import type { DirectMessage, User } from '../types';
import { ChevronLeftIcon, PaintBrushIcon } from '../components/icons';
import { SendIcon } from '../components/icons/SendIcon';


const MessageBubble: React.FC<{ message: DirectMessage; isCurrentUser: boolean }> = ({ message, isCurrentUser }) => {
    const bubbleClasses = isCurrentUser
        ? 'bg-purple-600 text-white self-end rounded-2xl rounded-br-none'
        : 'bg-gray-700 text-white self-start rounded-2xl rounded-bl-none';

    return (
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 px-4 ${bubbleClasses}`}>
                <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
             <p className="text-xs text-gray-200 mt-1 px-1">
                {new Date(message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    );
};

interface ConversationScreenProps {
    currentUser: User;
    otherUser: User;
    history: DirectMessage[];
    onSendMessage: (text: string) => void;
    onBack: () => void;
    themeClass: string | null;
    onOpenThemes: () => void;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({ currentUser, otherUser, history, onSendMessage, onBack, themeClass, onOpenThemes }) => {
    const [message, setMessage] = useState('');
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };
    
    return (
        <div className={`h-full flex flex-col text-white transition-colors duration-500 ${themeClass || 'bg-black'}`}>
            <header className="flex items-center p-4 border-b border-white/20 sticky top-0 bg-black/30 backdrop-blur-sm z-10 flex-shrink-0">
                <button onClick={onBack} aria-label="رجوع">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 mx-auto">
                    <img src={otherUser.avatarUrl} alt={otherUser.username} className="w-8 h-8 rounded-full" />
                    <h1 className="text-lg font-bold">{otherUser.username}</h1>
                </div>
                <button onClick={onOpenThemes} aria-label="تغيير السمة">
                    <PaintBrushIcon className="w-6 h-6" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.map(msg => (
                    <MessageBubble key={msg.id} message={msg} isCurrentUser={msg.senderId === currentUser.id} />
                ))}
                <div ref={endOfMessagesRef} />
            </div>

            <footer className="p-3 border-t border-white/20 bg-black/30 backdrop-blur-sm flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        className="flex-1 bg-gray-800 text-white rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button type="submit" disabled={!message.trim()} className="w-11 h-11 bg-purple-600 rounded-full flex items-center justify-center text-white transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-500 flex-shrink-0">
                        <SendIcon />
                    </button>
                </form>
            </footer>
        </div>
    );
};