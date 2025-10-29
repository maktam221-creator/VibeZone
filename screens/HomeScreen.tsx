import React, { useRef, useEffect } from 'react';
import { videoData } from '../data';
import VideoPlayer from '../components/VideoPlayer';

const HomeScreen: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.8,
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          target.play().catch(error => console.log("Autoplay was prevented: ", error));
        } else {
          target.pause();
          target.currentTime = 0;
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    const videos = containerRef.current?.querySelectorAll('video');
    videos?.forEach(video => observer.observe(video));

    return () => {
      videos?.forEach(video => observer.unobserve(video));
    };
  }, []);

  return (
    <div ref={containerRef} style={styles.container}>
      {videoData.map((video) => (
        <VideoPlayer key={video.id} video={video} />
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
    overflowY: 'scroll',
    scrollSnapType: 'y mandatory',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};

export default HomeScreen;
