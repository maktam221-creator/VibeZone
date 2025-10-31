import React, { useState } from 'react';
import type { VideoPost, User, Screen, StatsModalType } from '../types';
import { GridIcon, HeartIcon, LockIcon, PlayIcon, SettingsIcon, LogoutIcon, UserCircleIcon, ShieldIcon, ChevronLeftIcon, ViewsIcon } from '../components/icons';

const formatCount = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'ألف';
  return num.toString();
};

const Stat: React.FC<{ value: string; label: string; onClick?: () => void }> = ({ value, label, onClick }) => (
  <button onClick={onClick} className="text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-md p-1 -m-1 disabled:opacity-70" disabled={!onClick}>
    <p className="font-bold text-lg">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </button>
);

type ActiveTab = 'posts' | 'liked' | 'private';

interface ProfileScreenProps {
  user: {
    username: string;
    avatarUrl: string;
    name: string;
    bio: string;
    stats: {
      following: number;
      followers: number;
      likes: number;
    };
    posts: VideoPost[];
  };
  onNavigate: (screen: Extract<Screen, 'editProfile' | 'account' | 'privacy'>) => void;
  onLogout: () => void;
  isCurrentUser: boolean;
  onBack?: () => void;
  onViewPost: (post: VideoPost) => void;
  onOpenStatsModal: (type: StatsModalType) => void;
  likedPosts: VideoPost[];
  onToggleFollow: (username: string) => void;
  followedUsers: Set<string>;
}

interface SettingsModalProps {
    onNavigate: (screen: Extract<Screen, 'account' | 'privacy'>) => void;
    onLogout: () => void;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onNavigate, onLogout, onClose }) => (
    <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}>
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl p-4 pt-2 animate-slide-up z-50" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-4"></div>
            <ul className="flex flex-col">
                <li>
                    <button
                        onClick={() => onNavigate('account')}
                        className="w-full flex items-center gap-4 text-left p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <UserCircleIcon className="w-6 h-6 text-gray-400"/>
                        <span className="font-semibold">الحساب</span>
                    </button>
                </li>
                 <li>
                    <button
                        onClick={() => onNavigate('privacy')}
                        className="w-full flex items-center gap-4 text-left p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <ShieldIcon className="w-6 h-6 text-gray-400"/>
                        <span className="font-semibold">الخصوصية</span>
                    </button>
                </li>
                 <div className="h-px bg-gray-700 my-2"></div>
                <li>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-4 text-left text-red-400 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <LogoutIcon className="w-6 h-6"/>
                        <span className="font-semibold">تسجيل الخروج</span>
                    </button>
                </li>
            </ul>
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


export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onNavigate, onLogout, isCurrentUser, onBack, onViewPost, onOpenStatsModal, likedPosts, onToggleFollow, followedUsers }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('posts');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const isFollowing = followedUsers.has(user.username);

    const renderGridContent = () => {
        let postsToShow: VideoPost[] = [];
        let emptyState: React.ReactNode | null = null;
        
        switch (activeTab) {
            case 'posts':
                postsToShow = user.posts;
                if (postsToShow.length === 0) {
                    emptyState = (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500 col-span-3">
                            <GridIcon className="w-12 h-12 mb-2" />
                            <p className="font-semibold">لا توجد منشورات بعد</p>
                        </div>
                    );
                }
                break;
            case 'liked':
                 if (!isCurrentUser) {
                    return (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500 col-span-3">
                            <LockIcon className="w-12 h-12 mb-2" />
                            <p className="font-semibold">فيديوهات أعجبت المستخدم</p>
                            <p className="text-sm">هذا القسم خاص.</p>
                        </div>
                    );
                }
                postsToShow = likedPosts;
                if (postsToShow.length === 0) {
                    emptyState = (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-500 col-span-3">
                            <HeartIcon className="w-12 h-12 mb-2" />
                            <p className="font-semibold">لا توجد فيديوهات أعجبتك بعد</p>
                            <p className="text-sm">اضغط على القلب في الفيديوهات لإضافتها هنا.</p>
                        </div>
                    );
                }
                break;
            case 'private':
                 return (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500 col-span-3">
                        <LockIcon className="w-12 h-12 mb-2" />
                        <p className="font-semibold">المحتوى الخاص</p>
                        <p className="text-sm">هذا القسم لك فقط.</p>
                    </div>
                );
            default:
                return null;
        }

        return (
            <div className="grid grid-cols-3 gap-0.5">
                {emptyState}
                {postsToShow.map((post, index) => (
                    <button 
                        key={`${post.id}-${index}`} 
                        onClick={() => onViewPost(post)}
                        className={`relative aspect-square group bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-500`}
                        aria-label={`مشاهدة منشور: ${post.caption}`}
                    >
                         {post.thumbnailUrl ? (
                            <img src={post.thumbnailUrl} alt={post.caption} className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <PlayIcon className="w-10 h-10 text-gray-500" />
                            </div>
                         )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                        <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-xs font-bold bg-black/40 px-1.5 py-0.5 rounded">
                            <ViewsIcon className="w-4 h-4"/>
                            <span>{formatCount(post.views || 0)}</span>
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-black text-white pb-16">
            <header className="flex items-center justify-between p-4 sticky top-0 bg-black z-20">
                {onBack ? (
                    <button onClick={onBack} aria-label="العودة" className="p-1">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                ) : <div className="w-8 h-8"></div> }
                
                <h1 className="text-lg font-bold">
                    {user.name}
                </h1>

                {isCurrentUser ? (
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSettingsOpen(true)} aria-label="الإعدادات" className="p-1">
                            <SettingsIcon className="w-6 h-6" />
                        </button>
                        <button onClick={onLogout} aria-label="تسجيل الخروج" className="p-1">
                            <LogoutIcon className="w-6 h-6" />
                        </button>
                    </div>
                ) : <div className="w-16"></div>}
            </header>

            <div className="pt-2 p-4 flex flex-col items-center">
                <img src={user.avatarUrl} alt={user.username} className="w-24 h-24 rounded-full border-4 border-gray-800 shadow-lg mb-3" />
                <h2 className="text-xl font-bold">@{user.username}</h2>
            </div>

            <div className="flex justify-around items-center px-4 py-3 bg-gray-900/50 rounded-lg mx-4">
                <Stat value={formatCount(user.stats.following)} label="متابَعة" onClick={() => onOpenStatsModal('following')} />
                <div className="h-8 w-px bg-gray-700"></div>
                <Stat value={formatCount(user.stats.followers)} label="متابعون" onClick={() => onOpenStatsModal('followers')} />
                <div className="h-8 w-px bg-gray-700"></div>
                <Stat value={formatCount(user.stats.likes)} label="الإعجابات" />
            </div>

            <div className="px-6 py-4 text-center">
                <p className="text-sm text-gray-300 mb-4">{user.bio}</p>
                {isCurrentUser ? (
                    <button 
                        onClick={() => onNavigate('editProfile')}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 text-sm"
                    >
                        تعديل الملف الشخصي
                    </button>
                ) : (
                     <button 
                        onClick={() => onToggleFollow(user.username)}
                        className={`${isFollowing ? 'bg-gray-800 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-500'} text-white font-semibold py-2 px-10 rounded-lg transition-colors duration-200 text-sm`}
                    >
                        {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
                    </button>
                )}
            </div>

            <div className="flex justify-around border-t border-b border-gray-800 sticky top-[68px] bg-black z-10">
                <button 
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 py-3 transition-colors duration-200 ${activeTab === 'posts' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
                    aria-label="منشوراتي"
                >
                    <GridIcon className="w-6 h-6 mx-auto" filled={activeTab === 'posts'} />
                </button>
                <button 
                    onClick={() => setActiveTab('liked')}
                    className={`flex-1 py-3 transition-colors duration-200 ${activeTab === 'liked' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
                    aria-label="أعجبني"
                >
                    <HeartIcon className="w-6 h-6 mx-auto" filled={activeTab === 'liked'} />
                </button>
                <button 
                    onClick={() => setActiveTab('private')}
                    className={`flex-1 py-3 transition-colors duration-200 ${activeTab === 'private' ? 'text-white border-b-2 border-white' : 'text-gray-500'}`}
                    aria-label="خاص"
                >
                    <LockIcon className="w-6 h-6 mx-auto" filled={activeTab === 'private'} />
                </button>
            </div>

            {renderGridContent()}
            
            {isCurrentUser && isSettingsOpen && <SettingsModal 
                onNavigate={(screen) => { setIsSettingsOpen(false); onNavigate(screen); }} 
                onLogout={() => { setIsSettingsOpen(false); onLogout(); }} 
                onClose={() => setIsSettingsOpen(false)} 
            />}
        </div>
    );
};