import React from 'react';
import type { VideoPost, User } from '../types';
import { DiscoverIcon, PlayIcon } from '../components/icons';
import { api } from '../services/apiService';

const formatCount = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'ألف';
  return num.toString();
};

const PostGridItem: React.FC<{ post: VideoPost }> = ({ post }) => {
    const isVideo = post.mimeType?.startsWith('video/') || post.videoUrl.endsWith('.mp4');
    const displayUrl = post.thumbnailUrl || post.videoUrl;

    if (displayUrl?.startsWith('archived:')) {
      return (
        <div className="relative aspect-[9/16] bg-gray-900 w-full h-full flex items-center justify-center text-center p-2">
            <div className="text-xs text-gray-400">🗄️ تمت أرشفة الوسائط</div>
        </div>
      );
    }

    return (
        <div className="relative aspect-[9/16] bg-gray-900 w-full h-full overflow-hidden rounded-lg">
            {displayUrl ? (
                <img src={displayUrl} alt={post.caption} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
                <div className={`absolute inset-0 bg-gray-700`}></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 text-white">
                <div className="flex items-center gap-1.5">
                    <img src={post.user.avatarUrl} alt={post.user.username} className="w-6 h-6 rounded-full border border-white/50" />
                    <span className="text-xs font-semibold truncate">@{post.user.username}</span>
                </div>
            </div>
             {isVideo && <PlayIcon className="absolute top-2 right-2 w-5 h-5 text-white/80 drop-shadow-md"/>}
        </div>
    );
};


export const DiscoverScreen: React.FC<{ onViewPost: (post: VideoPost, allUserPosts: VideoPost[]) => void }> = ({ onViewPost }) => {
    const [posts, setPosts] = React.useState<VideoPost[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        setIsLoading(true);
        const trendingPosts = api.getForYouFeed();
        setPosts(trendingPosts);
        setIsLoading(false);
    }, []);
    
    return (
        <div className="h-full overflow-y-auto bg-black text-white pb-16">
            <header className="p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="ابحث عن المبدعين أو الفيديوهات..."
                        className="w-full bg-gray-800 text-white rounded-full py-2.5 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400">
                        <DiscoverIcon className="w-5 h-5" />
                    </div>
                </div>
            </header>
            
            {isLoading ? (
                <div className="p-2 grid grid-cols-2 gap-2 animate-pulse">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="aspect-[9/16] bg-gray-800 rounded-lg"></div>
                    ))}
                </div>
            ) : (
                <div className="p-2 grid grid-cols-2 gap-2">
                    {posts.map(post => (
                        <button key={post.id} onClick={() => onViewPost(post, posts)} className="group">
                           <PostGridItem post={post} />
                       </button>
                    ))}
                </div>
            )}

        </div>
    );
};
