import React, { useState, useEffect, useRef } from 'react';
import type { VideoPost, Screen, User, FeedTab } from '../types';
import { HeartIcon, CommentIcon, ShareIcon, MusicIcon, PlayIcon, MuteIcon, UnmuteIcon, ChevronLeftIcon, PlusIcon, CheckIcon, DiscoverIcon } from '../components/icons';

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
  isAuthenticated: boolean;
  onAuthAction: () => void;
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
    isAuthenticated, 
    onAuthAction,
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
  const isImagePost = post.mimeType ? post.mimeType.startsWith('image/') : post.videoUrl.startsWith('data:image/');
  const isArchived = post.videoUrl.startsWith('archived:');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayable, setIsPlayable] = useState(!!post.videoUrl && !isImagePost && !isArchived);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const viewCountedRef = useRef(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [animateLike, setAnimateLike] = useState(false);
  const prevLikedRef = useRef(isLiked);


  useEffect(() => {
      if (isLiked && !prevLikedRef.current) {
          setAnimateLike(true);
          const timer = setTimeout(() => setAnimateLike(false), 300); // Animation duration matches CSS
          return () => clearTimeout(timer);
      }
      prevLikedRef.current = isLiked;
  }, [isLiked]);

  // Effect to handle blob URL cleanup
  useEffect(() => {
    const url = post.videoUrl;
    // Cleanup blob URL when the component unmounts to prevent memory leaks
    return () => {
        if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
        }
    };
  }, [post.videoUrl]);


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
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleError = () => {
      console.warn(`Failed to load video: ${post.videoUrl}`);
      setIsPlayable(false);
      setIsPlaying(false);
    };

    setIsPlayable(!!post.videoUrl && !isImagePost && !isArchived);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [post.videoUrl, isImagePost, isArchived]);

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
    if (!video || !isPlayable || isNaN(duration) || duration === 0) return;
    const newTime = (Number(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(Number(e.target.value));
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const handleAction = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
        onAuthAction();
    } else {
        action();
    }
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
          src={isPlayable ? post.videoUrl : undefined}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
      )}
      
      {!isPlayable && !isImagePost && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white text-center p-4 z-10">
            {post.thumbnailUrl && !post.thumbnailUrl.startsWith('archived:') && <img src={post.thumbnailUrl} alt={post.caption} className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10" />}
            <p className="text-lg font-semibold">{isArchived ? 'تمت أرشفة الوسائط' : 'لا يمكن تشغيل الفيديو'}</p>
            <p className="text-sm text-gray-300 mt-1">
                {isArchived
                    ? 'تمت أرشفة هذا المحتوى القديم تلقائيًا لتوفير المساحة.'
                    : 'قد يكون الفيديو الذي تم تحميله لم يعد متاحًا.'}
            </p>
        </div>
      )}

      {isPlayable && !isPlaying && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 pointer-events-none z-10">
            <PlayIcon className="w-24 h-24 text-white/60 drop-shadow-lg" />
        </div>
      )}
      
      {!isImagePost && (
        <button 
          onClick={toggleMute} 
          className={`absolute top-4 right-4 bg-black/40 p-2 rounded-full z-20 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`} 
          aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
        >
          {isMuted ? <MuteIcon className="w-6 h-6 text-white" /> : <UnmuteIcon className="w-6 h-6 text-white" />}
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 text-white bg-gradient-to-t from-black/60 to-transparent">
        {isPlayable && (
           <div 
            className={`absolute bottom-[80px] left-0 right-0 px-4 z-20 pointer-events-auto transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
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
      
      <div className="absolute bottom-24 left-2 flex flex-col items-center gap-4 text-white">
        <div className="flex flex-col items-center">
            <button
              onClick={handleAction(() => onToggleFollow(post.user.username))}
              className="relative w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95 focus:outline-none"
              aria-label={isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
            >
              <img src={post.user.avatarUrl} alt={`${post.user.username} avatar`} className="w-full h-full object-cover rounded-full" />
              {isFollowing ? (
                  <div className="absolute -bottom-2 w-5 h-5 bg-gray-500 border-2 border-black rounded-full flex items-center justify-center text-white">
                      <CheckIcon className="w-3 h-3" strokeWidth="3" />
                  </div>
              ) : (
                <div className="absolute -bottom-2 w-5 h-5 bg-pink-500 border-2 border-black rounded-full flex items-center justify-center text-white">
                  <PlusIcon className="w-3 h-3" strokeWidth="3" />
                </div>
              )}
            </button>
        </div>
        <div className="flex flex-col items-center">
            <button onClick={handleAction(() => onToggleLike(post.id))} className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95" aria-label="إعجاب">
                <HeartIcon className={`w-8 h-8 ${animateLike ? 'animate-pop' : ''}`} filled={isLiked} />
            </button>
            <button onClick={handleAction(() => onOpenLikes(post))} className="px-2 py-1 -my-1" aria-label={`View ${post.likes} likes`}>
              <span className="text-sm font-semibold">{formatCount(post.likes)}</span>
            </button>
        </div>
         <div className="flex flex-col items-center">
            <button onClick={handleAction(() => onOpenComments(post))} className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95" aria-label="تعليق">
                <CommentIcon className="w-8 h-8"/>
            </button>
            <span className="text-sm font-semibold">{formatCount(post.commentsCount)}</span>
        </div>
         <div className="flex flex-col items-center">
            <button onClick={handleAction(() => onSharePost(post))} className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95" aria-label="مشاركة">
                <ShareIcon className="w-8 h-8"/>
            </button>
            <span className="text-sm font-semibold">{formatCount(post.shares)}</span>
        </div>
      </div>
    </div>
  );
};

interface FeedHeaderProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  onNavigate: (screen: Screen) => void;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({ activeTab, onTabChange, onNavigate }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex justify-center items-center h-16 text-white pt-safe-top">
      <div className="flex items-center gap-6 text-lg font-semibold text-gray-300">
        <button 
          onClick={() => onNavigate('live')} 
          className="relative text-base transition-colors hover:text-white"
          aria-label="مشاهدة البث المباشر"
        >
          بث مباشر
          <span className="absolute top-0 -right-2 block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>
        <div className="h-4 w-px bg-gray-500"></div>
        <button 
          onClick={() => onTabChange('following')}
          className={`relative transition-all duration-200 ${activeTab === 'following' ? 'text-white text-xl' : 'hover:text-white'}`}
        >
          متابَعة
          {activeTab === 'following' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full transition-all duration-300"></div>}
        </button>
        <button 
          onClick={() => onTabChange('foryou')}
          className={`relative transition-all duration-200 ${activeTab === 'foryou' ? 'text-white text-xl' : 'hover:text-white'}`}
        >
          لك
          {activeTab === 'foryou' && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-full transition-all duration-300"></div>}
        </button>
      </div>
    </header>
  );
};

interface FeedScreenProps {
  videos: VideoPost[];
  isAuthenticated: boolean;
  onAuthAction: () => void;
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
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

export const FeedScreen: React.FC<FeedScreenProps> = ({ 
    videos, 
    isAuthenticated, 
    onAuthAction,
    likedPosts,
    followedUsers,
    onToggleLike,
    onToggleFollow,
    onOpenComments,
    onOpenLikes,
    onSharePost,
    onViewProfile,
    onBack,
    onIncrementView,
    activeTab,
    onTabChange,
    onNavigate,
}) => {
  
  if (videos.length === 0) {
     let message = isAuthenticated ? 'لا يوجد شيء في هذا الخلاص حاليًا. استكشف المزيد من الحسابات!' : 'سجل الدخول لترى المنشورات.';
    if(activeTab === 'foryou') {
        message = "لا يوجد محتوى جديد الآن. حاول مرة أخرى لاحقًا!"
    } else if (activeTab === 'following' && !isAuthenticated) {
        message = "سجل الدخول لرؤية منشورات الأشخاص الذين تتابعهم.";
    } else if (activeTab === 'following' && isAuthenticated) {
        message = "لا توجد منشورات من الأشخاص الذين تتابعهم. ابحث عن أصدقاء جدد!";
    }
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-black text-white text-center p-4">
            {!onBack && <FeedHeader activeTab={activeTab} onTabChange={onTabChange} onNavigate={onNavigate} />}
            <div className="flex flex-col items-center justify-center flex-1">
                <DiscoverIcon className="w-24 h-24 text-gray-700 mb-4" />
                <h2 className="text-xl font-bold">لا يوجد منشورات جديدة</h2>
                <p className="text-gray-400 mt-2 max-w-sm">
                    {message}
                </p>
                {activeTab === 'following' && isAuthenticated && (
                    <button 
                        onClick={() => onNavigate('discover')}
                        className="mt-6 bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-500 transition-colors"
                    >
                        اكتشف المبدعين
                    </button>
                )}
            </div>
        </div>
    );
  }

  return (
    <div className="relative h-screen overflow-y-auto scroll-snap-type-y-mandatory">
       {!onBack && <FeedHeader activeTab={activeTab} onTabChange={onTabChange} onNavigate={onNavigate} />}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-30 bg-black/40 p-2 rounded-full transition-opacity hover:opacity-80"
          aria-label="العودة"
        >
          <ChevronLeftIcon className="w-6 h-6 text-white" />
        </button>
      )}
      {videos.map((video) => (
        <VideoPostComponent 
            key={video.id} 
            post={video} 
            isAuthenticated={isAuthenticated} 
            onAuthAction={onAuthAction}
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
      ))}
    </div>
  );
};