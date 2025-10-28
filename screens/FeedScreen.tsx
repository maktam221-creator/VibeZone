import React, { useRef, useEffect, useState } from 'react';
import { videos } from '../data';
import { Video } from '../types';
import { HeartIcon, CommentIcon, ShareIcon, MusicIcon } from '../components/icons';

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-70" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const VideoPlayer = ({ video, isVisible }: { video: Video; isVisible: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setIsPaused(false);
      } else {
        videoElement.pause();
        setIsPaused(true);
      }
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isVisible) {
        videoElement.play()
          .then(() => setIsPaused(false))
          .catch(() => setIsPaused(true)); // If autoplay fails, show play icon
      } else {
        videoElement.pause();
        setIsPaused(true);
      }
    }
  }, [isVisible]);

  return (
    <div className="relative h-full w-full snap-start flex-shrink-0" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.user.avatarUrl}
        loop
        className="h-full w-full object-cover bg-black"
        playsInline
        muted
      />
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PlayIcon />
        </div>
      )}
      <div className="absolute bottom-16 left-0 p-4 text-white z-10 w-full bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center mb-2">
            <img src={video.user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            <p className="font-bold ml-3">@{video.user.username}</p>
        </div>
        <p className="text-sm mb-2">{video.description}</p>
        <div className="flex items-center">
            <MusicIcon className="w-5 h-5" />
            <p className="text-sm ml-2 truncate">{video.songTitle}</p>
        </div>
      </div>
      <InteractionBar stats={video.stats} />
    </div>
  );
};

const InteractionBar = ({ stats }: { stats: Video['stats'] }) => {
    const [liked, setLiked] = useState(false);
    
    const formatCount = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    return (
        <div className="absolute bottom-20 right-2 flex flex-col items-center space-y-4 z-10">
            <button className="flex flex-col items-center" onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-50">
                    <HeartIcon className={`w-7 h-7 ${liked ? 'text-red-500' : 'text-white'}`} />
                </div>
                <span className="text-xs font-semibold mt-1">{formatCount(stats.likes + (liked ? 1 : 0))}</span>
            </button>
            <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                 <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-50">
                    <CommentIcon className="w-7 h-7 text-white" />
                 </div>
                <span className="text-xs font-semibold mt-1">{formatCount(stats.comments)}</span>
            </button>
            <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-50">
                    <ShareIcon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-semibold mt-1">{formatCount(stats.shares)}</span>
            </button>
        </div>
    );
}

const FeedScreen = () => {
  const [visibleVideo, setVisibleVideo] = useState<string | null>(videos[0]?.id || null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleVideo(entry.target.getAttribute('data-video-id'));
          }
        });
      },
      { threshold: 0.7 } // 70% of the video must be visible to trigger
    );

    const videoElements = containerRef.current?.querySelectorAll('[data-video-id]');
    videoElements?.forEach((el) => observer.observe(el));

    return () => {
      videoElements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full overflow-y-scroll snap-y snap-mandatory">
      {videos.map((video) => (
        <div key={video.id} data-video-id={video.id} className="h-full w-full snap-start flex-shrink-0">
             <VideoPlayer video={video} isVisible={visibleVideo === video.id} />
        </div>
      ))}
    </div>
  );
};

export default FeedScreen;