import React, { useRef } from 'react';
import InteractionBar from './InteractionBar';

interface Video {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  url: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
}

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoPress = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div style={styles.container}>
      <video
        ref={videoRef}
        style={styles.video}
        src={video.url}
        loop
        muted
        playsInline
        onClick={handleVideoPress}
      />
      <div style={styles.overlay}>
        <div style={styles.bottomSection}>
          <div style={styles.userInfo}>
            <p style={styles.username}>@{video.user.name}</p>
            <p style={styles.description}>{video.description}</p>
          </div>
          <InteractionBar
            likes={video.likes}
            comments={video.comments}
            shares={video.shares}
          />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    scrollSnapAlign: 'start',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '20px',
    paddingBottom: '80px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
  },
  bottomSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    margin: 0,
    fontSize: '16px',
  },
  description: {
    margin: '5px 0 0 0',
    fontSize: '14px',
  },
};

export default VideoPlayer;
