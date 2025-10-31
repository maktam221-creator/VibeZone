import React, { useState, useMemo } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatHistory } from '../components/ChatHistory';
import { MessageInput } from '../components/MessageInput';
import type { Conversation, User } from '../types';
import { BotIcon, ChevronLeftIcon, DiscoverIcon, PencilIcon } from '../components/icons';
import { formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale/ar';

interface GeminiChatViewProps {
  onBack: () => void;
}

const GeminiChatView: React.FC<GeminiChatViewProps> = ({ onBack }) => {
    const { messages, sendMessage, isLoading, error } = useChat();
    return (
        <div className="flex flex-col h-full bg-gray-900 text-white">
            <header className="flex items-center p-4 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700 shadow-lg">
                <button onClick={onBack} aria-label="العودة" className="p-2 -ml-2">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-center flex-1 -ml-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                    مساعد Gemini
                </h1>
            </header>
            <div className="flex-1 overflow-hidden">
                <ChatHistory messages={messages} isLoading={isLoading} />
            </div>
            <div className="p-4 bg-gray-900 border-t border-gray-800">
                {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
                <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
        </div>
    );
};


interface ConversationListItemProps {
    conversation: Conversation;
    onClick: () => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, onClick }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    const timeAgo = lastMessage ? formatDistanceToNowStrict(new Date(lastMessage.timestamp), { addSuffix: true, locale: ar }) : '';

    return (
        <button onClick={onClick} className="w-full flex items-center gap-4 p-3 text-left hover:bg-gray-800 transition-colors rounded-lg">
            <div className="relative flex-shrink-0">
                <img src={conversation.user.avatarUrl} alt={conversation.user.username} className="w-14 h-14 rounded-full" />
                {conversation.unreadCount > 0 && 
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-purple-500 border-2 border-gray-900" />
                }
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <p className="font-bold text-white truncate">{conversation.user.name || conversation.user.username}</p>
                    <p className="text-xs text-gray-500 flex-shrink-0">{timeAgo}</p>
                </div>
                <p className="text-sm text-gray-400 truncate">{lastMessage?.text || 'لا توجد رسائل بعد'}</p>
            </div>
        </button>
    );
};

interface NewConversationViewProps {
    allUsers: User[];
    onBack: () => void;
    onSelectUser: (user: User) => void;
}

const NewConversationView: React.FC<NewConversationViewProps> = ({ allUsers, onBack, onSelectUser }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return allUsers;
        return allUsers.filter(u =>
            u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allUsers, searchQuery]);

    return (
        <div className="flex flex-col h-full bg-black text-white pb-16">
            <header className="p-4 pt-6 sticky top-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col gap-4">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-1 -ml-2" aria-label="العودة">
                        <ChevronLeftIcon className="w-7 h-7" />
                    </button>
                    <h1 className="text-2xl font-bold text-center flex-1">رسالة جديدة</h1>
                    <div className="w-6"></div> {/* Spacer */}
                </div>
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="ابحث عن مستخدم..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-800 text-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <DiscoverIcon className="w-5 h-5" />
                    </div>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-2">
                {filteredUsers.map(user => (
                    <button key={user.username} onClick={() => onSelectUser(user)} className="w-full flex items-center gap-4 p-3 text-left hover:bg-gray-800 transition-colors rounded-lg">
                        <img src={user.avatarUrl} alt={user.username} className="w-14 h-14 rounded-full" />
                        <div className="flex-1 overflow-hidden">
                             <p className="font-bold text-white truncate">{user.name || user.username}</p>
                             <p className="text-sm text-gray-400 truncate">@{user.username}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

interface ChatScreenProps {
  conversations: Conversation[];
  onOpenConversation: (user: User) => void;
  currentUser: User;
  allUsers: User[];
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ conversations, onOpenConversation, currentUser, allUsers }) => {
    const [view, setView] = useState<'list' | 'gemini' | 'new'>('list');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredConversations = useMemo(() => {
        return conversations
            .filter(c => 
                c.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.user.username.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                const lastMsgA = a.messages[a.messages.length - 1];
                const lastMsgB = b.messages[b.messages.length - 1];
                if (!lastMsgA) return 1;
                if (!lastMsgB) return -1;
                return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
            });
    }, [conversations, searchQuery]);

    if (view === 'gemini') {
        return <div className="flex flex-col h-full pb-16"><GeminiChatView onBack={() => setView('list')} /></div>;
    }

    if (view === 'new') {
        return <NewConversationView 
            allUsers={allUsers}
            onBack={() => setView('list')}
            onSelectUser={onOpenConversation}
        />
    }

    return (
        <div className="flex flex-col h-full bg-black text-white pb-16">
            <header className="p-4 pt-6 sticky top-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                    <div className="w-8"></div> {/* Spacer for alignment */}
                    <h1 className="text-2xl font-bold">الدردشات</h1>
                    <button onClick={() => setView('new')} className="p-1" aria-label="رسالة جديدة">
                        <PencilIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="ابحث عن دردشة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-800 text-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <DiscoverIcon className="w-5 h-5" />
                    </div>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-2">
                <button onClick={() => setView('gemini')} className="w-full flex items-center gap-4 p-3 text-left hover:bg-gray-800 transition-colors rounded-lg">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <BotIcon />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-white">مساعد Gemini</p>
                        <p className="text-sm text-gray-400">اسألني أي شيء!</p>
                    </div>
                </button>
                <div className="h-px bg-gray-800 my-2 mx-3"></div>
                {filteredConversations.map(conv => (
                    <ConversationListItem key={conv.id} conversation={conv} onClick={() => onOpenConversation(conv.user)} />
                ))}
            </div>
        </div>
    );
};