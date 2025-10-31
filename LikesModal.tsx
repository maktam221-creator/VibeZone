import React from 'react';
import type { User } from '../types';
import { XIcon } from '../components/icons';

const UserRow: React.FC<{ user: User; isFollowing: boolean; onToggleFollow: (username: string) => void; onViewProfile: (user: User) => void; isCurrentUser: boolean }> = ({ user, isFollowing, onToggleFollow, onViewProfile, isCurrentUser }) => (
    <div className="flex items-center p-3">
        <button onClick={() => onViewProfile(user)} className="flex items-center gap-3 flex-1 text-left">
            <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full" />
            <div>
                <p className="font-semibold">{user.username}</p>
                {user.name && <p className="text-sm text-gray-400">{user.name}</p>}
            </div>
        </button>
        {!isCurrentUser && (
            <button
                onClick={() => onToggleFollow(user.username)}
                className={`text-sm font-semibold py-1.5 px-5 rounded-md transition-colors ${isFollowing ? 'bg-gray-700 text-white' : 'bg-purple-600 text-white'}`}
            >
                {isFollowing ? 'أتابع' : 'متابعة'}
            </button>
        )}
    </div>
);

interface LikesModalProps {
    users: User[];
    onClose: () => void;
    currentUser: User;
    followedUsers: Set<string>;
    onToggleFollow: (username: string) => void;
    onViewProfile: (user: User) => void;
}

export const LikesModal: React.FC<LikesModalProps> = ({
    users,
    onClose,
    currentUser,
    followedUsers,
    onToggleFollow,
    onViewProfile,
}) => {
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[60] flex items-end"
            onClick={onClose}
        >
             <div 
                className="w-full h-[60vh] bg-gray-900 rounded-t-2xl flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 text-center border-b border-gray-700 relative">
                    <h2 className="font-bold">الإعجابات</h2>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 left-4 p-2" aria-label="إغلاق">
                        <XIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-y-auto px-4">
                    {users.length > 0 ? (
                        users.map(user => (
                            <UserRow 
                                key={user.username} 
                                user={user} 
                                isFollowing={followedUsers.has(user.username)}
                                onToggleFollow={onToggleFollow}
                                onViewProfile={onViewProfile}
                                isCurrentUser={user.username === currentUser.username}
                            />
                        ))
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            <p>لا توجد إعجابات لعرضها.</p>
                        </div>
                    )}
                </div>
            </div>
             <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </div>
    );
};
