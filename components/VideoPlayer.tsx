import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Video from 'react-native-video';
import { VideoItem } from '../types';

interface VideoPlayerProps {
  video: VideoItem;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive }) => {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.seek(0);
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: video.url }}
        style={styles.video}
        paused={!isActive}
        repeat={true}
        resizeMode="cover"
        muted={false}
      />
      
      <View style={styles.videoInfo}>
        <View style={styles.userInfo}>
            <Image source={{ uri: video.user.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{video.user.username}</Text>
        </View>
        <Text style={styles.caption}>{video.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 80,
    left: 15,
    right: 80, 
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#FFF',
      marginRight: 8,
  },
  username: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  caption: {
    color: '#FFF',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default VideoPlayer;