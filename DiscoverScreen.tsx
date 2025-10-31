import React, { useState, useMemo } from 'react';
import type { VideoPost } from '../types';
import { DiscoverIcon, ViewsIcon, PlayIcon } from '../components/icons';

const formatCount = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'ألف';
  return num.toString();
};

const categories = ['ألعاب 🎮', 'كوميديا 😂', 'طبخ 🍳', 'سفر ✈️', 'رياضة ⚽️', 'فن 🎨'];

interface DiscoverScreenProps {
  videos: VideoPost[];
  onViewPost: (post: VideoPost) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ videos, onViewPost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Memoize the shuffled video list so it doesn't re-shuffle on every render
  const shuffledVideos = useMemo(() => {
    // A simple shuffle function (Fisher-Yates)
    const array = [...videos];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return shuffledVideos.filter(video => {
        const query = searchQuery.toLowerCase();
        return video.caption.toLowerCase().includes(query) || video.user.username.toLowerCase().includes(query) || video.songName.toLowerCase().includes(query);
    });
  }, [shuffledVideos, searchQuery]);

  return (
    <div className="h-full overflow-y-auto bg-black text-white">
        <header className="p-4 pt-6 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
            <div className="relative">
                <input
                    type="text"
                    placeholder="ابحث عن فيديوهات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <DiscoverIcon className="w-5 h-5" />
                </div>
            </div>
        </header>

        <div className="px-4 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
                {categories.map(category => (
                     <button 
                        key={category}
                        onClick={() => setSelectedCategory(cat => cat === category ? null : category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${selectedCategory === category ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>

        <main className="grid grid-cols-3 gap-0.5 pb-20">
            {filteredVideos.map((post) => (
                <button 
                    key={post.id} 
                    onClick={() => onViewPost(post)}
                    className="relative aspect-square group bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-500"
                    aria-label={`مشاهدة منشور: ${post.caption}`}
                >
                    {post.thumbnailUrl ? (
                        <img src={post.thumbnailUrl} alt={post.caption} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <PlayIcon className="w-10 h-10 text-gray-500" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
                    <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-xs font-bold bg-black/40 px-1.5 py-0.5 rounded">
                        <ViewsIcon className="w-4 h-4"/>
                        <span>{formatCount(post.views || 0)}</span>
                    </div>
                </button>
            ))}
        </main>
    </div>
  );
};