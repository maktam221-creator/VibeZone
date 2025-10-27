import React, { useRef, useEffect, useState } from 'react';
import { videos } from '../data';
import { HeartIcon, CommentIcon, ShareIcon, PlayIcon } from '../components/icons';

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    return num.toString();
};

const VideoPlayer = ({ video, isVisible }) => {
    // FIX: Explicitly type the ref to ensure proper type inference for video element properties and methods.
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (isVisible) {
            videoElement.play().then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.error("Video play failed:", error);
                setIsPlaying(false);
            });
        } else {
            videoElement.pause();
            videoElement.currentTime = 0;
            setIsPlaying(false);
        }
    }, [isVisible]);

    const handleVideoPress = () => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (isPlaying) {
            videoElement.pause();
            setIsPlaying(false);
        } else {
            videoElement.play();
            setIsPlaying(true);
        }
    };
    
    const handleLikePress = (e) => {
        e.stopPropagation();
        setIsLiked(prev => !prev);
    }

    return (
        <div className="h-full w-full relative snap-start" onClick={handleVideoPress}>
            <video
                ref={videoRef}
                src={video.src}
                poster={video.poster}
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                aria-label={`Video by ${video.user.name}: ${video.caption}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                    <PlayIcon className="w-20 h-20 text-white/70" />
                </div>
            )}

            <div className="absolute bottom-24 right-2 text-white flex flex-col items-center space-y-6">
                <button className="flex flex-col items-center" onClick={handleLikePress} aria-label="Like video">
                    <div className={`transition-transform duration-200 ease-in-out transform ${isLiked ? 'text-red-500 animate-pop' : 'text-white'}`}>
                        <HeartIcon filled={isLiked}/>
                    </div>
                    <span className="text-sm font-bold mt-1">{formatNumber(video.likes + (isLiked ? 1 : 0))}</span>
                </button>
                <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()} aria-label="Comment on video">
                    <CommentIcon />
                    <span className="text-sm font-bold mt-1">{formatNumber(video.comments)}</span>
                </button>
                <button className="flex flex-col items-center" onClick={(e) => e.stopPropagation()} aria-label="Share video">
                    <ShareIcon />
                    <span className="text-sm font-bold mt-1">{formatNumber(video.shares)}</span>
                </button>
            </div>
            
            <div className="absolute bottom-24 left-4 text-white max-w-[calc(100%-80px)]">
                <div className="flex items-center space-x-2 mb-2">
                    <img src={video.user.avatar} className="w-10 h-10 rounded-full border-2 border-white" alt={`${video.user.name}'s avatar`} />
                    <span className="font-bold text-lg">{video.user.name}</span>
                </div>
                <p className="text-base leading-relaxed">{video.caption}</p>
            </div>
        </div>
    );
};


const FeedScreen = () => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    // FIX: Explicitly type the ref to ensure proper type inference for DOM element children, resolving errors with IntersectionObserver.
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-index') || '0', 10);
                        setCurrentVideoIndex(index);
                    }
                });
            },
            { threshold: 0.7 }
        );

        const videoElements = Array.from(containerRef.current?.children || []);
        videoElements.forEach(el => observer.observe(el));

        return () => {
             videoElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <div ref={containerRef} className="h-screen w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
            {videos.map((video, index) => (
                <div key={video.id} data-index={index} className="h-full w-full flex-shrink-0">
                    <VideoPlayer video={video} isVisible={index === currentVideoIndex} />
                </div>
            ))}
        </div>
    );
};

export default FeedScreen;