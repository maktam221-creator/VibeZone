import React, { useRef, useEffect, useState } from 'react';
import { videos as initialVideos } from '../data';
import { HeartIcon, CommentIcon, ShareIcon, PlayIcon } from '../components/icons';
import CommentsSheet from '../components/CommentsSheet';
import ShareSheet from '../components/ShareSheet';
import type { Video } from '../types';

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    return num.toString();
};

interface VideoPlayerProps {
    video: Video;
    isVisible: boolean;
    isPausedExternally: boolean;
    onOpenComments: (videoId: number) => void;
    onOpenShare: (videoId: number) => void;
}

const VideoPlayer = ({ video, isVisible, isPausedExternally, onOpenComments, onOpenShare }: VideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (isPausedExternally) {
            if (!videoElement.paused) {
                videoElement.pause();
                setIsPlaying(false);
            }
            return; 
        }

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
    }, [isVisible, isPausedExternally]);

    const handleVideoPress = () => {
        if (isPausedExternally) return; 
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
    
    const handleLikePress = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLiked(prev => !prev);
    }
    
    const handleCommentPress = (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpenComments(video.id);
    };
    
    const handleSharePress = (e: React.MouseEvent) => {
        e.stopPropagation();
        onOpenShare(video.id);
    };

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
                <button className="flex flex-col items-center" onClick={handleCommentPress} aria-label="Comment on video">
                    <CommentIcon />
                    <span className="text-sm font-bold mt-1">{formatNumber(video.comments)}</span>
                </button>
                <button className="flex flex-col items-center" onClick={handleSharePress} aria-label="Share video">
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
    const [videos, setVideos] = useState<Video[]>(initialVideos);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [activeCommentsVideoId, setActiveCommentsVideoId] = useState<number | null>(null);
    const [activeShareVideoId, setActiveShareVideoId] = useState<number | null>(null);
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

        const container = containerRef.current;
        if (container) {
            // FIX: Use forEach directly on the NodeList from querySelectorAll to avoid type inference issues.
            const videoElements = container.querySelectorAll('[data-index]');
            videoElements.forEach(el => observer.observe(el));

            return () => {
                 videoElements.forEach(el => observer.unobserve(el));
            };
        }
    }, []);

    const handleOpenComments = (videoId: number) => {
        setActiveCommentsVideoId(videoId);
    };
    
    const handleCloseComments = () => {
        setActiveCommentsVideoId(null);
    };

    const handleOpenShare = (videoId: number) => {
        setActiveShareVideoId(videoId);
    };

    const handleCloseShare = () => {
        setActiveShareVideoId(null);
    };
    
    const handleAddComment = (videoId: number) => {
        setVideos(currentVideos => 
            currentVideos.map(video => 
                video.id === videoId ? { ...video, comments: video.comments + 1 } : video
            )
        );
    };

    const videoForComments = videos.find(v => v.id === activeCommentsVideoId);
    const videoForShare = videos.find(v => v.id === activeShareVideoId);

    return (
        <div className="h-screen w-full">
            <div ref={containerRef} className="h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
                {videos.map((video, index) => (
                    <div key={video.id} data-index={index} className="h-full w-full flex-shrink-0">
                        <VideoPlayer 
                          video={video} 
                          isVisible={index === currentVideoIndex}
                          isPausedExternally={activeCommentsVideoId !== null || activeShareVideoId !== null}
                          onOpenComments={handleOpenComments}
                          onOpenShare={handleOpenShare}
                        />
                    </div>
                ))}
            </div>
            {videoForComments && (
                <CommentsSheet 
                    video={videoForComments} 
                    onClose={handleCloseComments} 
                    onAddComment={handleAddComment}
                />
            )}
            {videoForShare && (
                <ShareSheet 
                    video={videoForShare}
                    onClose={handleCloseShare}
                />
            )}
        </div>
    );
};

export default FeedScreen;