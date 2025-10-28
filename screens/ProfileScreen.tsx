import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { mockUserProfile } from '../data';
import { VideoItem } from '../types';

const ProfileScreen = () => {
  const user = mockUserProfile;
  const [activeTab, setActiveTab] = useState('videos');

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}m`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const StatItem = ({ label, value }: { label: string; value: number }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{formatCount(value)}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
  
  const renderVideoThumbnail = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatItem label="متابع" value={user.stats.followers} />
          <StatItem label="متابَع" value={user.stats.following} />
          <StatItem label="إعجاب" value={user.stats.likes} />
        </View>

        {/* Bio */}
        <View style={styles.bioContainer}>
          <Text style={styles.bio}>{user.bio}</Text>
          <Text style={styles.website}>{user.website}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
                onPress={() => setActiveTab('videos')}
            >
                <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>🎬</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
                onPress={() => setActiveTab('liked')}
            >
                <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>❤️</Text>
            </TouchableOpacity>
        </View>
        
        {/* Video Grid */}
        <FlatList
            data={user.videos}
            renderItem={renderVideoThumbnail}
            keyExtractor={(item) => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 20 },
  header: { alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  username: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  editButton: { backgroundColor: '#333', paddingVertical: 8, paddingHorizontal: 25, borderRadius: 8 },
  editButtonText: { color: '#FFF', fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  statItem: { alignItems: 'center' },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 14, marginTop: 4 },
  bioContainer: { alignItems: 'center', marginBottom: 20 },
  bio: { color: '#FFF', textAlign: 'center' },
  website: { color: '#FF6B35', marginTop: 5 },
  tabsContainer: { flexDirection: 'row', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#333', marginBottom: 2 },
  tab: { padding: 10, flex: 1, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#FFF' },
  tabText: { color: '#888', fontSize: 20 },
  activeTabText: { color: '#FFF' },
  thumbnailContainer: { flex: 1/3, aspectRatio: 1, padding: 1 },
  thumbnail: { width: '100%', height: '100%', borderRadius: 4 },
});

export default ProfileScreen;
