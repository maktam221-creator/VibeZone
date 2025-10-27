import React, { useState, useEffect } from 'react';
import type { VideoPost, User } from '../types';
import { GridIcon, HeartIcon, LockIcon, PlayIcon, MenuIcon, SettingsIcon, ShieldIcon, TrashIcon } from '../components/icons';
import { api } from '../services/apiService';

const formatCount = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'ألف';
  return num.toString();
};

const Stat: React.FC<{ value: string; label: string; onClick?: () => void }> = ({ value, label, onClick }) => (
  <button disabled={!onClick} onClick={onClick} className="text-center disabled:cursor-default">
    <p className="font-bold text-lg">{value}</p>
    <p className="text-sm text-gray-400 dark:text-gray-400">{label}</p>
  </button>
);

const PostGridItem: React.FC<{ post: VideoPost }> = ({ post }) => {
    const isVideo = post.mimeType?.startsWith('video/');
    const displayUrl = isVideo ? post.thumbnailUrl : post.videoUrl;

    if (displayUrl?.startsWith('archived:')) {
      return (
        <div className="relative aspect-square bg-gray-900 w-full h-full flex items-center justify-center text-center p-2">
            <div className="text-xs text-gray-400">🗄️ تمت أرشفة الوسائط</div>
        </div>
      );
    }

    return (
        <div className="relative aspect-square bg-gray-900 w-full h-full overflow-hidden">
            {displayUrl ? (
                <img src={displayUrl} alt={post.caption} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
                <div className={`absolute inset-0 ${post.videoUrl}`}></div>
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute bottom-1 right-1 flex items-center gap-1 text-white text-xs font-bold bg-black/30 px-1 rounded">
                {isVideo && <PlayIcon className="w-3 h-3"/>}
                <span>{formatCount(post.likes)}</span>
            </div>
        </div>
    );
};

const GridLoadingSkeleton: React.FC = () => (
    <div className="grid grid-cols-3 gap-0.5 animate-pulse">
        {Array(9).fill(0).map((_, i) => (
             <div key={i} className="aspect-square bg-gray-800 dark:bg-gray-800"></div>
        ))}
    </div>
);

type ActiveTab = 'posts' | 'liked' | 'private';

interface ProfileScreenProps {
  user: User & {
    bio: string;
    stats: {
      following: number;
      followers: number;
      likes: number;
    };
    posts: VideoPost[];
  };
  onEditProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onNavigateToSettings: () => void;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  onViewPost: (post: VideoPost, allUserPosts: VideoPost[]) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onEditProfile, onLogout, onDeleteAccount, onNavigateToSettings, onOpenFollowers, onOpenFollowing, onViewPost }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('posts');
    const [likedPosts, setLikedPosts] = useState<VideoPost[]>([]);
    const [isLoadingLiked, setIsLoadingLiked] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        if (activeTab === 'liked') {
            setIsLoadingLiked(true);
            const posts = api.getLikedPosts();
            setLikedPosts(posts);
            setIsLoadingLiked(false);
        }
    }, [activeTab]);

    const handleSettingsClick = () => {
        setShowSettings(false);
        onNavigateToSettings();
    };

    const renderGridContent = () => {
        if (activeTab === 'posts') {
             if (user.posts.length === 0) {
                return (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-500 text-center p-4">
                        <div className="text-4xl mb-2">📸</div>
                        <p className="font-semibold">لا يوجد منشورات بعد</p>
                        <p className="text-sm">ابدأ في إنشاء ومشاركة المحتوى الخاص بك!</p>
                    </div>
                );
            }
            return (
                 <div className="grid grid-cols-3 gap-0.5">
                    {user.posts.map((post) => (
                       <button key={post.id} onClick={() => onViewPost(post, user.posts)} className="group">
                           <PostGridItem post={post} />
                       </button>
                    ))}
                </div>
            );
        }
        if (activeTab === 'liked') {
            if (isLoadingLiked) return <GridLoadingSkeleton />;
            if (likedPosts.length === 0) {
                 return (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-500 text-center p-4">
                        <div className="text-4xl mb-2">❤️</div>
                        <p className="font-semibold">لا يوجد منشورات أعجبتك بعد</p>
                        <p className="text-sm">ستظهر الفيديوهات التي تعجبك هنا.</p>
                    </div>
                );
            }
            return (
                <div className="grid grid-cols-3 gap-0.5">
                    {likedPosts.map((post) => (
                       <button key={post.id} onClick={() => onViewPost(post, likedPosts)} className="group">
                            <PostGridItem post={post} />
                       </button>
                    ))}
                </div>
            )
        }
        return (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-500 text-center p-4">
                <div className="text-4xl mb-2">🚧</div>
                <p className="font-semibold">المحتوى غير متوفر بعد</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-white dark:bg-black pb-16">
            <header className="flex items-center justify-between p-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-20 border-b border-gray-200 dark:border-gray-800">
                <div className="w-8 h-8"></div> {/* Spacer */}
                <h1 className="text-lg font-bold">ملفي</h1>
                <button onClick={() => setShowSettings(true)} aria-label="الإعدادات">
                    <MenuIcon className="w-6 h-6" />
                </button>
            </header>

            <div className="pt-4 p-4 flex flex-col items-center">
                <img src={user.avatarUrl} alt={user.username} className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-800 shadow-lg mb-3" />
                <h1 className="text-xl font-bold">@{user.username}</h1>
            </div>

            <div className="flex justify-around items-center px-4 py-3 bg-gray-100 dark:bg-gray-900/50 rounded-lg mx-4">
                <Stat value={formatCount(user.stats.following)} label="متابَعة" onClick={onOpenFollowing} />
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
                <Stat value={formatCount(user.stats.followers)} label="متابعون" onClick={onOpenFollowers} />
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
                <Stat value={formatCount(user.stats.likes)} label="الإعجابات" />
            </div>

            <div className="px-6 py-4 text-center flex items-center justify-center gap-2">
                <button 
                    onClick={onEditProfile}
                    className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors duration-200 text-sm"
                >
                    تعديل الملف الشخصي
                </button>
                 <button 
                    onClick={onLogout}
                    className="bg-red-500/10 dark:bg-red-800/50 hover:bg-red-500/20 dark:hover:bg-red-700/60 text-red-600 dark:text-red-400 font-semibold py-2 px-6 rounded-lg transition-colors duration-200 text-sm"
                >
                    تسجيل الخروج
                </button>
            </div>
             <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center px-6">{user.bio}</p>

            <div className="flex justify-around border-t border-b border-gray-200 dark:border-gray-800 sticky top-[68px] bg-white dark:bg-black z-10">
                <button 
                    onClick={() => setActiveTab('posts')}
                    className={`flex-1 py-3 transition-colors duration-200 ${activeTab === 'posts' ? 'text-black dark:text-white border-b-2 border-black dark:border-white' : 'text-gray-500 dark:text-gray-500'}`}
                    aria-label="منشوراتي"
                >
                    <GridIcon className="w-6 h-6 mx-auto" />
                </button>
                <button 
                    onClick={() => setActiveTab('liked')}
                    className={`flex-1 py-3 transition-colors duration-200 ${activeTab === 'liked' ? 'text-black dark:text-white border-b-2 border-black dark:border-white' : 'text-gray-500 dark:text-gray-500'}`}
                    aria-label="أعجبني"
                >
                    <HeartIcon className="w-6 h-6 mx-auto" />
                </button>
                <button 
                    onClick={() => setActiveTab('private')}
                    className={`flex-1 py-3 transition-colors duration-200 ${activeTab === 'private' ? 'text-black dark:text-white border-b-2 border-black dark:border-white' : 'text-gray-500 dark:text-gray-500'}`}
                    aria-label="خاص"
                >
                    <LockIcon className="w-6 h-6 mx-auto" />
                </button>
            </div>

            {renderGridContent()}

            {showSettings && (
                <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end" onClick={() => setShowSettings(false)} role="dialog" aria-modal="true">
                    <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-t-2xl animate-slide-up p-4 pb-8" onClick={e => e.stopPropagation()}>
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                        <button className="w-full flex items-center gap-4 text-left p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-base" onClick={handleSettingsClick}>
                            <SettingsIcon className="w-6 h-6 text-gray-500" />
                            <span>الإعدادات</span>
                        </button>
                        <button onClick={() => { setShowSettings(false); onDeleteAccount(); }} className="w-full flex items-center gap-4 text-left p-3 text-red-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-base">
                            <TrashIcon className="w-6 h-6" />
                            <span>إلغاء تنشيط الحساب</span>
                        </button>
                        <button onClick={() => setShowSettings(false)} className="w-full mt-4 bg-gray-200 dark:bg-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                            إلغاء
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};