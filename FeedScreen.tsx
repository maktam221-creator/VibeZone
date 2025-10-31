
import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { VideoPost, Screen, User } from '../types';
import { HeartIcon, CommentIcon, ShareIcon, MusicIcon, PlayIcon, ChevronLeftIcon, PlusIcon, CheckIcon, DiscoverIcon } from '../components/icons';

const formatCount = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'م';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'ألف';
  return num.toString();
};

const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) {
    return '0:00';
  }
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

interface VideoPostProps {
  post: VideoPost;
  isLiked: boolean;
  isFollowing: boolean;
  onToggleLike: (postId: string) => void;
  onToggleFollow: (username: string) => void;
  onOpenComments: (post: VideoPost) => void;
  onOpenLikes: (post: VideoPost) => void;
  onSharePost: (post: VideoPost) => void;
  onViewProfile: (user: User) => void;
  onIncrementView: (postId: string) => void;
}

const VideoPostComponent: React.FC<VideoPostProps> = ({ 
    post, 
    isLiked,
    isFollowing,
    onToggleLike,
    onToggleFollow,
    onOpenComments,
    onOpenLikes,
    onSharePost,
    onViewProfile,
    onIncrementView,
}) => {
  const isImagePost = post.videoUrl.startsWith('data:image/');
  const [isPlaying, setIsPlaying] = useState(true && !isImagePost);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayable, setIsPlayable] = useState(!!post.videoUrl && !isImagePost);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const viewCountedRef = useRef(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const hideControls = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(false);
  };

  const showControlsWithTimeout = () => {
    if(isImagePost) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        if (isPlayable) {
          setIsPlaying(isVisible);
        }
        if(isVisible) {
          showControlsWithTimeout();
          if(!viewCountedRef.current) {
              onIncrementView(post.id);
              viewCountedRef.current = true;
          }
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isPlayable, post.id, onIncrementView]);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlayable) return;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => {
              if (error.name !== 'AbortError') {
                  console.warn("Video autoplay prevented:", error);
                  setIsPlaying(false);
              }
          });
      }
      showControlsWithTimeout();
    } else {
      video.pause();
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }
  }, [isPlaying, isPlayable]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isImagePost) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleError = () => {
      console.warn(`Failed to load video: ${post.videoUrl}`);
      setIsPlayable(false);
      setIsPlaying(false);
    };

    setIsPlayable(!!post.videoUrl && !isImagePost);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [post.videoUrl, isImagePost]);

  const handleContainerClick = () => {
    if (isPlayable) {
        setIsPlaying(prev => !prev);
    }
  };
  
  const handleMouseMove = () => {
    if (isPlaying) {
      showControlsWithTimeout();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !isPlayable) return;
    const newTime = (Number(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(Number(e.target.value));
  };
  
  const handleViewProfileClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onViewProfile(post.user);
  };


  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full scroll-snap-align-start flex items-center justify-center bg-black" 
      onClick={handleContainerClick} 
      onMouseMove={handleMouseMove}
      role="button" 
      tabIndex={0} 
      aria-label={isPlaying ? "إيقاف الفيديو مؤقتاً" : "تشغيل الفيديو"}
    >
      {isImagePost ? (
        <img src={post.videoUrl} alt={post.caption} className="w-full h-full object-cover" />
      ) : (
        <video
          ref={videoRef}
          src={post.videoUrl}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      )}
      
      {!isPlayable && !isImagePost && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white text-center p-4 z-10">
            {post.thumbnailUrl && <img src={post.thumbnailUrl} alt={post.caption} className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10" />}
            <p className="text-lg font-semibold">لا يمكن تشغيل الفيديو</p>
            <p className="text-sm text-gray-300 mt-1">قد يكون الفيديو الذي تم تحميله لم يعد متاحًا.</p>
        </div>
      )}

      {isPlayable && !isPlaying && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 pointer-events-none z-10">
            <PlayIcon className="w-24 h-24 text-white/60 drop-shadow-lg" />
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-24 text-white bg-gradient-to-t from-black/60 to-transparent">
        {isPlayable && (
           <div 
            className={`absolute bottom-[92px] left-0 right-0 px-4 z-20 pointer-events-auto transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tabular-nums">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer accent-white"
                style={{
                  background: `linear-gradient(to right, white ${progress}%, rgba(255, 255, 255, 0.3) ${progress}%)`
                }}
              />
              <span className="text-xs font-mono tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <div className="flex items-end gap-3 flex-row-reverse pointer-events-auto">
          <div className="flex-1">
            <div className="flex items-center gap-2">
                <button onClick={handleViewProfileClick} className="flex items-center gap-2">
                    <img src={post.user.avatarUrl} alt={post.user.username} className="w-10 h-10 rounded-full border-2 border-white" />
                    <h3 className="font-bold text-lg">@{post.user.username}</h3>
                </button>
            </div>
            <p className="mt-2 text-sm">{post.caption}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
                <MusicIcon className="w-4 h-4" />
                <span>{post.songName}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
             <div className={`w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center ${isPlaying && isPlayable ? 'animate-spin-reverse' : ''}`}>
                <img src={post.user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
             </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-28 left-4 flex flex-col items-center gap-6 text-white">
        <div className="flex flex-col items-center">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFollow(post.user.username); }}
              className="relative w-14 h-14 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95 focus:outline-none"
              aria-label={isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
            >
              <img src={post.user.avatarUrl} alt={`${post.user.username} avatar`} className="w-full h-full object-cover rounded-full" />
              {isFollowing ? (
                  <div className="absolute -bottom-2 w-6 h-6 bg-gray-500 border-2 border-black rounded-full flex items-center justify-center text-white">
                      <CheckIcon className="w-4 h-4" strokeWidth="3" />
                  </div>
              ) : (
                <div className="absolute -bottom-2 w-6 h-6 bg-pink-500 border-2 border-black rounded-full flex items-center justify-center text-white">
                  <PlusIcon className="w-4 h-4" strokeWidth="3" />
                </div>
              )}
            </button>
        </div>
        <div className="flex flex-col items-center">
            <button onClick={(e) => { e.stopPropagation(); onToggleLike(post.id); }} className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95" aria-label="إعجاب">
                <HeartIcon className="w-9 h-9" filled={isLiked} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onOpenLikes(post); }} className="px-2 py-1 -my-1" aria-label={`View ${post.likes} likes`}>
              <span className="text-base font-semibold">{formatCount(post.likes)}</span>
            </button>
        </div>
         <div className="flex flex-col items-center">
            <button onClick={(e) => { e.stopPropagation(); onOpenComments(post); }} className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95" aria-label="تعليق">
                <CommentIcon className="w-9 h-9"/>
            </button>
            <span className="text-base font-semibold">{formatCount(post.comments.length)}</span>
        </div>
         <div className="flex flex-col items-center">
            <button onClick={(e) => { e.stopPropagation(); onSharePost(post); }} className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95" aria-label="مشاركة">
                <ShareIcon className="w-9 h-9"/>
            </button>
            <span className="text-base font-semibold">{formatCount(post.shares)}</span>
        </div>
      </div>
    </div>
  );
};

interface FeedScreenProps {
  videos: VideoPost[];
  likedPosts: Set<string>;
  followedUsers: Set<string>;
  onToggleLike: (postId: string) => void;
  onToggleFollow: (username: string) => void;
  onNavigate: (screen: Screen) => void;
  onOpenComments: (post: VideoPost) => void;
  onOpenLikes: (post: VideoPost) => void;
  onSharePost: (post: VideoPost) => void;
  onViewProfile: (user: User) => void;
  onBack?: () => void;
  onIncrementView: (postId: string) => void;
  isAuthenticated: boolean;
  onLoginPrompt: () => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ 
    videos, 
    likedPosts,
    followedUsers,
    onToggleLike,
    onToggleFollow,
    onNavigate,
    onOpenComments,
    onOpenLikes,
    onSharePost,
    onViewProfile,
    onBack,
    onIncrementView,
    isAuthenticated,
    onLoginPrompt
}) => {
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');

  const handleTabChange = (tab: 'foryou' | 'following') => {
      if (tab === 'following' && !isAuthenticated) {
          onLoginPrompt();
          return;
      }
      setActiveTab(tab);
  };

  const videosToDisplay = useMemo(() => {
    if (activeTab === 'following') {
      if (!isAuthenticated) return [];
      return videos.filter(video => followedUsers.has(video.user.username));
    }
    return videos;
  }, [videos, activeTab, followedUsers, isAuthenticated]);

  return (
    <div className="relative h-screen bg-black">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 pt-6 flex items-center justify-center text-white bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center text-lg font-bold space-x-6 rtl:space-x-reverse">
          <button 
            onClick={() => handleTabChange('following')} 
            className={`transition-colors duration-200 ${activeTab === 'following' ? 'text-white' : 'text-gray-400'}`}
          >
            متابعة
          </button>
          <div className="h-6 w-px bg-gray-600"></div>
          <button 
            onClick={() => handleTabChange('foryou')} 
            className={`transition-colors duration-200 ${activeTab === 'foryou' ? 'text-white' : 'text-gray-400'}`}
          >
            لك
          </button>
        </div>
        <button 
          onClick={() => onNavigate('discover')} 
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 mt-2 rtl:left-auto rtl:right-4"
          aria-label="بحث"
        >
          <DiscoverIcon className="w-6 h-6 text-white" />
        </button>
      </header>
      
      {/* Main content */}
      <div className="h-full overflow-y-auto scroll-snap-type-y-mandatory">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-4 left-4 z-30 bg-black/40 p-2 rounded-full transition-opacity hover:opacity-80"
            aria-label="العودة"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
        )}
        
        {videosToDisplay.length > 0 ? videosToDisplay.map((video) => (
          <VideoPostComponent 
              key={`${activeTab}-${video.id}`} // Add activeTab to key to force remount on tab change
              post={video} 
              isLiked={likedPosts.has(video.id)}
              isFollowing={followedUsers.has(video.user.username)}
              onToggleLike={onToggleLike}
              onToggleFollow={onToggleFollow}
              onOpenComments={onOpenComments}
              onOpenLikes={onOpenLikes}
              onSharePost={onSharePost}
              onViewProfile={onViewProfile}
              onIncrementView={onIncrementView}
          />
        )) : (
          <div className="h-screen w-full flex flex-col items-center justify-center text-center text-gray-400 scroll-snap-align-start">
             <h2 className="text-2xl font-bold mb-2">لا يوجد شيء هنا بعد</h2>
             {activeTab === 'following' && isAuthenticated && <p>تابع بعض الحسابات لترى فيديوهاتهم هنا!</p>}
             {activeTab === 'following' && !isAuthenticated && <p>سجل الدخول لترى فيديوهات من الحسابات التي تتابعها.</p>}
          </div>
        )}
      </div>
    </div>
  );
};
