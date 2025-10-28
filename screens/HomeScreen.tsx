import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import InteractionBar from '../components/InteractionBar';
import { VideoItem } from '../types';
import { mockVideos } from '../data';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);
  const flatListRef = useRef<FlatList<VideoItem>>(null);
  
  useEffect(() => {
    // In a real app, you would fetch this data from an API
    setVideos(mockVideos);
  }, []);

  const renderVideo = ({ item, index }: { item: VideoItem; index: number }) => (
    <View style={{ height }}>
      <VideoPlayer 
        video={item}
        isActive={index === currentVideo}
      />
      <InteractionBar video={item} />
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].isViewable) {
      setCurrentVideo(viewableItems[0].index);
    }
  }).current;

  if (videos.length === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideo}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;