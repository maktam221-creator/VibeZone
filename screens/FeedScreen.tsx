import React, { useRef, useEffect } from 'react';
import { videos } from '../data';
import { Video } from '../types';

const VideoPlayer = ({ video, isVisible }: { video: Video; isVisible: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVisible) {
      videoRef.current?.play().catch(error => {
        // Autoplay was prevented.
        console.log("Autoplay prevented: ", error);
      });
    } else {
      videoRef.current?.pause();
    }
  }, [isVisible]);

  return (
    <div className="relative h-full w-full snap-start flex-shrink-0">
      <video
        ref={videoRef}
        src={video.videoUrl}
        loop
        className="h-full w-full object-cover"
        playsInline // Important for mobile browsers
        muted // Muted autoplay is usually allowed
      />
      <div className="absolute bottom-16 left-0 p-4 text-white z-10 w-full bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center mb-2">
            <img src={video.user.avatarUrl} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            <p className="font-bold ml-3">@{video.user.username}</p>
        </div>
        <p className="text-sm">{video.description}</p>
      </div>
      <InteractionBar stats={video.stats} />
    </div>
  );
};

const InteractionBar = ({ stats }: { stats: Video['stats'] }) => {
    const [liked, setLiked] = React.useState(false);
    
    const formatCount = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    return (
        <div className="absolute bottom-20 right-2 flex flex-col items-center space-y-4 z-10">
            <button className="flex flex-col items-center" onClick={() => setLiked(!liked)}>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-7 h-7 ${liked ? 'text-red-500' : 'text-white'}`} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>
                <span className="text-xs font-semibold mt-1">{formatCount(stats.likes + (liked ? 1 : 0))}</span>
            </button>
            <button className="flex flex-col items-center">
                 <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
                    </svg>
                 </div>
                <span className="text-xs font-semibold mt-1">{formatCount(stats.comments)}</span>
            </button>
            <button className="flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                </div>
                <span className="text-xs font-semibold mt-1">{formatCount(stats.shares)}</span>
            </button>
        </div>
    );
}

const FeedScreen = () => {
  const [visibleVideo, setVisibleVideo] = React.useState<string | null>(videos[0]?.id || null);
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
      { threshold: 0.5 } // 50% of the video must be visible
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
