import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { VideoItem } from '../types';

interface InteractionBarProps {
    video: VideoItem;
}

const InteractionBar: React.FC<InteractionBarProps> = ({ video }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(video.likesCount || 0);

  useEffect(() => {
    setLikes(video.likesCount || 0);
    setIsLiked(false);
    setIsSaved(false);
  }, [video]);

  const handleLike = () => {
    setIsLiked(prev => {
      setLikes(prev ? likes - 1 : likes + 1);
      return !prev;
    });
  };
  
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}m`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileButton}>
        <Image source={{ uri: video.user.avatar }} style={styles.profileAvatar}/>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleLike}>
        <Text style={styles.icon}>{isLiked ? '❤️' : '🤍'}</Text>
        <Text style={styles.count}>{formatCount(likes)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.count}>{formatCount(video.commentsCount || 0)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.icon}>🔗</Text>
        <Text style={styles.count}>{formatCount(video.sharesCount || 0)}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => setIsSaved(!isSaved)}
      >
        <Text style={styles.icon}>{isSaved ? '🔖' : '📑'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    bottom: 80,
    alignItems: 'center',
  },
  profileButton: {
    marginBottom: 25,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  button: {
    alignItems: 'center',
    marginBottom: 25,
  },
  icon: {
    fontSize: 32,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  count: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default InteractionBar;