import React from 'react';
import type { StatsModalType, User, VideoPost } from '../types';
import { ChevronLeftIcon, PlayIcon } from '../components/icons';

const UserRow: React.FC<{ user: User; isFollowing: boolean; onToggleFollow: (username: string) => void; onViewProfile: (user: User) => void; isCurrentUser: boolean }> = ({ user, isFollowing, onToggleFollow, onViewProfile, isCurrentUser }) => (
    <div className="flex items-center p-2 rounded-lg hover:bg-gray-800 transition-colors">
        <button onClick={() => onViewProfile(user)} className="flex items-center gap-3 flex-1 text-left">
            <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full" />
            <span className="font-semibold">{user.username}</span>
        </button>
        {!isCurrentUser && (
            <button
                onClick={() => onToggleFollow(user.username)}
                className={`text-sm font-semibold py-1.5 px-4 rounded-md transition-colors ${isFollowing ? 'bg-gray-700 text-white' : 'bg-purple-600 text-white'}`}
            >
                {isFollowing ? 'أتابع' : 'متابعة'}
            </button>
        )}
    </div>
);

interface DetailModalProps {
    type: StatsModalType;
    user: User & { posts: VideoPost[] };
    currentUser: User;
    followedUsers: Set<string>;
    likedPosts: VideoPost[];
    allUsers: User[];
    onClose: () => void;
    onViewProfile: (user: User) => void;
    onToggleFollow: (username: string) => void;
    onViewPost: (post: VideoPost) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
    type,
    user,
    currentUser,
    followedUsers,
    likedPosts,
    allUsers,
    onClose,
    onViewProfile,
    onToggleFollow,
    onViewPost,
}) => {
    
    const titles = {
        following: 'متابَعة',
        followers: 'متابعون',
        likes: 'الإعجابات'
    };
    
    const renderContent = () => {
        switch (type) {
            case 'following': {
                 const followingList = allUsers.filter(u => followedUsers.has(u.username));
                 if (followingList.length === 0) return <p className="text-center text-gray-500 mt-8">لا تتابع أي شخص بعد.</p>;
                 return (
                    <div className="space-y-2">
                        {followingList.map(u => (
                            <UserRow 
                                key={u.username} 
                                user={u} 
                                isFollowing={followedUsers.has(u.username)}
                                onToggleFollow={onToggleFollow}
                                onViewProfile={onViewProfile}
                                isCurrentUser={u.username === currentUser.username}
                            />
                        ))}
                    </div>
                );
            }
            case 'followers': {
                // Mock data for followers
                const followersList = allUsers.slice(0, 2).filter(u => u.username !== user.username);
                 if (followersList.length === 0) return <p className="text-center text-gray-500 mt-8">لا يوجد متابعون بعد.</p>;
                return (
                    <div className="space-y-2">
                         {followersList.map(u => (
                            <UserRow 
                                key={u.username} 
                                user={u}
                                isFollowing={followedUsers.has(u.username)}
                                onToggleFollow={onToggleFollow}
                                onViewProfile={onViewProfile}
                                isCurrentUser={u.username === currentUser.username}
                             />
                        ))}
                    </div>
                );
            }
            case 'likes':
                if (likedPosts.length === 0) return <p className="text-center text-gray-500 mt-8">لم يتم الإعجاب بأي فيديوهات بعد.</p>;
                return (
                    <div className="grid grid-cols-3 gap-0.5">
                        {likedPosts.map((post) => (
                             <button 
                                key={post.id} 
                                onClick={() => {
                                  onViewPost(post);
                                  onClose();
                                }}
                                className={`relative aspect-square group bg-gray-900`}
                                aria-label={`مشاهدة منشور: ${post.caption}`}
                            >
                                 {post.thumbnailUrl ? (
                                    <img src={post.thumbnailUrl} alt={post.caption} className="w-full h-full object-cover" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PlayIcon className="w-10 h-10 text-gray-500" />
                                    </div>
                                 )}
                            </button>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in">
            <header className="flex items-center p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
                <button onClick={onClose} aria-label="العودة" className="p-2 -ml-2">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold flex-1 text-center -ml-6">{titles[type]}</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-2">
                {renderContent()}
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.2s ease-out; }
            `}</style>
        </div>
    );
};