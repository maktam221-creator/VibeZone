import React from 'react';
import type { VideoPost, User } from '../types';
import { GridIcon, PlayIcon, ChevronLeftIcon, PaperPlaneIcon, PlusIcon, CheckIcon } from '../components/icons';

const formatCount = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'ألف';
  return num.toString();
};

const Stat: React.FC<{ value: string; label: string; onClick?: () => void }> = ({ value, label, onClick }) => (
  <button disabled={!onClick} onClick={onClick} className="text-center disabled:cursor-default">
    <p className="font-bold text-lg">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
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

interface UserProfile {
  user: User;
  stats: {
    following: number;
    followers: number;
    likes: number;
  };
  posts: VideoPost[];
}

interface UserProfileScreenProps {
  userProfile: UserProfile;
  onBack: () => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onMessage: () => void;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  onViewPost: (post: VideoPost, allUserPosts: VideoPost[]) => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ userProfile, onBack, isFollowing, onToggleFollow, onMessage, onOpenFollowers, onOpenFollowing, onViewPost }) => {
    const { user, stats, posts } = userProfile;

    return (
        <div className="h-full overflow-y-auto bg-black text-white pb-20">
            <header className="flex items-center p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
                <button onClick={onBack} aria-label="رجوع">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold mx-auto">@{user.username}</h1>
                <div className="w-6"></div>
            </header>
            
            <div className="pt-4 p-4 flex flex-col items-center">
                 <div className="relative mb-3">
                    <img src={user.avatarUrl} alt={user.username} className="w-24 h-24 rounded-full border-4 border-gray-800 shadow-lg" />
                    <button
                        onClick={onToggleFollow}
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95 focus:outline-none"
                        aria-label={isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
                    >
                        {isFollowing ? (
                            <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-white">
                                <CheckIcon className="w-4 h-4" strokeWidth="3" />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-purple-600 rounded-full flex items-center justify-center text-white">
                                <PlusIcon className="w-4 h-4" strokeWidth="3" />
                            </div>
                        )}
                    </button>
                </div>
                <h2 className="text-xl font-bold mt-2">@{user.username}</h2>
            </div>

            <div className="flex justify-around items-center px-4 py-3 bg-gray-900/50 rounded-lg mx-4">
                <Stat value={formatCount(stats.following)} label="متابَعة" onClick={onOpenFollowing} />
                <div className="h-8 w-px bg-gray-700"></div>
                <Stat value={formatCount(stats.followers)} label="متابعون" onClick={onOpenFollowers} />
                <div className="h-8 w-px bg-gray-700"></div>
                <Stat value={formatCount(stats.likes)} label="الإعجابات" />
            </div>

            <div className="px-6 py-4 text-center flex items-center justify-center gap-2">
                <button 
                    onClick={onMessage}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
                    aria-label={`Message ${user.username}`}
                 >
                    رسالة
                 </button>
            </div>
             <p className="text-sm text-gray-300 mb-4 text-center px-6">{user.bio || 'لا يوجد نبذة تعريفية'}</p>

            <div className="flex justify-around border-t border-b border-gray-800 sticky top-[60px] bg-black z-10">
                <button 
                    className="flex-1 py-3 text-white border-b-2 border-white"
                    aria-label="منشورات المستخدم"
                >
                    <GridIcon className="w-6 h-6 mx-auto" />
                </button>
            </div>

            {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-0.5">
                    {posts.map((post) => (
                       <button key={post.id} onClick={() => onViewPost(post, posts)} className="group">
                           <PostGridItem post={post} />
                       </button>
                    ))}
                </div>
            ) : (
                 <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-center p-4">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="font-semibold">لا يوجد منشورات بعد</p>
                </div>
            )}
        </div>
    );
};