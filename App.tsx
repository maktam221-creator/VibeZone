import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { Screen, User, VideoPost, LiveStream, Comment, Conversation, UserMessage, StatsModalType } from './types';
import { mockVideos, initialUser, mockAllUsers, mockConversations, mockStreams } from './data';
import { FeedScreen } from './screens/FeedScreen';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { CreateScreen } from './screens/CreateScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { LiveScreen } from './screens/LiveScreen';
import { LoginScreen } from './screens/LoginScreen';
import { CommentsModal } from './screens/CommentsModal';
import { LikesModal } from './screens/LikesModal';
import { LiveStreamView } from './screens/LiveStreamView';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { AccountScreen } from './screens/AccountScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { ConversationScreen } from './screens/ConversationScreen';
import { DetailModal } from './screens/DetailModal';
import { auth } from './services/firebase';
import { ChangePasswordScreen } from './screens/ChangePasswordScreen';
import { GenerateVideoScreen } from './screens/GenerateVideoScreen';

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('feed');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [loginPrompt, setLoginPrompt] = useState(false);
  
  const [videos, setVideos] = useState<VideoPost[]>(mockVideos);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [allUsers, setAllUsers] = useState<User[]>(mockAllUsers);

  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['feed']);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingPostFromProfile, setViewingPostFromProfile] = useState<VideoPost | null>(null);
  const [viewingConversationUser, setViewingConversationUser] = useState<User | null>(null);
  const [viewingStream, setViewingStream] = useState<LiveStream | null>(null);
  
  const [commentsModalPost, setCommentsModalPost] = useState<VideoPost | null>(null);
  const [likesModalPost, setLikesModalPost] = useState<VideoPost | null>(null);
  const [detailModalType, setDetailModalType] = useState<StatsModalType | null>(null);
  const [detailModalUser, setDetailModalUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        const loggedInUser = allUsers.find(u => u.username === 'نور') || initialUser;
        setCurrentUser(loggedInUser);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(initialUser);
        setLikedPosts(new Set());
        setFollowedUsers(new Set());
      }
      setActiveScreen('feed');
      setLoginPrompt(false);
    });

    return () => unsubscribe();
  }, [allUsers]);

  const navigateTo = (screen: Screen) => {
    if ((screen === 'profile' || screen === 'chat' || screen === 'create' || screen === 'live' || screen === 'generateVideo') && !isAuthenticated) {
      setLoginPrompt(true);
      return;
    }
    setNavigationHistory(prev => [...prev, screen]);
    setActiveScreen(screen);
  };

  const goBack = () => {
    if (viewingPostFromProfile) {
      setViewingPostFromProfile(null);
      return;
    }
    if (viewingUser) {
      setViewingUser(null);
      return;
    }
    if (viewingConversationUser) {
      setViewingConversationUser(null);
      return;
    }

    setNavigationHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = [...prev];
      newHistory.pop();
      setActiveScreen(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleToggleLike = (postId: string) => {
    if (!isAuthenticated) {
      setLoginPrompt(true);
      return;
    }
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      const post = videos.find(v => v.id === postId);
      if (!post) return prev;

      if (newSet.has(postId)) {
        newSet.delete(postId);
        post.likes--;
      } else {
        newSet.add(postId);
        post.likes++;
      }
      setVideos([...videos]);
      return newSet;
    });
  };

  const handleToggleFollow = (username: string) => {
    if (!isAuthenticated) {
      setLoginPrompt(true);
      return;
    }
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
  };

  const handleSharePost = async (post: VideoPost) => {
    const shareData = {
      title: 'VibeZone Video',
      text: `شاهد هذا الفيديو من @${post.user.username}: ${post.caption}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        const updatedVideos = videos.map(v => v.id === post.id ? { ...v, shares: v.shares + 1 } : v);
        setVideos(updatedVideos);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('تم نسخ الرابط!');
      }
    } catch (error) {
      console.error('خطأ في المشاركة:', error);
    }
  };

  const handleViewProfile = (user: User) => {
    if (user.username === currentUser.username && isAuthenticated) {
      navigateTo('profile');
    } else {
      setViewingUser(user);
    }
  };

  const handleAddVideoPost = (postData: { caption: string; songName: string; videoUrl: string; thumbnailUrl?: string; }) => {
    const newPost: VideoPost = {
      id: `v-${Date.now()}`,
      user: currentUser,
      caption: postData.caption,
      songName: postData.songName,
      videoUrl: postData.videoUrl,
      thumbnailUrl: postData.thumbnailUrl,
      likes: 0,
      comments: [],
      shares: 0,
      views: 0,
    };
    setVideos(prev => [newPost, ...prev]);
  };

  const renderScreen = () => {
    if (viewingUser) {
      const userProfileData = {
        ...viewingUser,
        posts: videos.filter(v => v.user.username === viewingUser.username),
        stats: viewingUser.stats || { followers: 1, following: 1, likes: 1 },
      };
      return (
        <ProfileScreen
          user={userProfileData}
          isCurrentUser={false}
          onBack={() => setViewingUser(null)}
          onViewPost={() => {}}
          onOpenStatsModal={() => {}}
          likedPosts={[]}
          onToggleFollow={handleToggleFollow}
          followedUsers={followedUsers}
          onNavigate={() => {}}
          onLogout={() => {}}
        />
      );
    }

    switch (activeScreen) {
      case 'feed':
        return <FeedScreen videos={videos} likedPosts={likedPosts} followedUsers={followedUsers} onToggleLike={handleToggleLike} onToggleFollow={handleToggleFollow} onNavigate={navigateTo} onOpenComments={setCommentsModalPost} onOpenLikes={setLikesModalPost} onSharePost={handleSharePost} onViewProfile={handleViewProfile} isAuthenticated={isAuthenticated} onLoginPrompt={() => setLoginPrompt(true)} />;
      case 'discover':
        return <DiscoverScreen videos={videos} onViewPost={() => {}} />;
      case 'create':
        return <CreateScreen onPostCreated={() => navigateTo('feed')} addVideoPost={handleAddVideoPost} currentUser={currentUser} onGoLive={() => setViewingStream(mockStreams[0])} onGenerateVideo={() => navigateTo('generateVideo')} />;
      case 'profile':
        if (!isAuthenticated) return null;
        const userProfileData = {
          ...currentUser,
          posts: videos.filter(v => v.user.username === currentUser.username),
          stats: currentUser.stats || { followers: 1, following: 1, likes: 1 },
        };
        return <ProfileScreen user={userProfileData} isCurrentUser={true} onLogout={handleLogout} onNavigate={navigateTo} onViewPost={() => {}} onOpenStatsModal={() => {}} likedPosts={videos.filter(v => likedPosts.has(v.id))} onToggleFollow={handleToggleFollow} followedUsers={followedUsers} />;
      case 'chat':
        return <ChatScreen conversations={conversations} onOpenConversation={() => {}} currentUser={currentUser} allUsers={allUsers} />;
      default:
        return <FeedScreen videos={videos} likedPosts={likedPosts} followedUsers={followedUsers} onToggleLike={handleToggleLike} onToggleFollow={handleToggleFollow} onNavigate={navigateTo} onOpenComments={setCommentsModalPost} onOpenLikes={setLikesModalPost} onSharePost={handleSharePost} onViewProfile={handleViewProfile} isAuthenticated={isAuthenticated} onLoginPrompt={() => setLoginPrompt(true)} />;
    }
  };

  if (loginPrompt) {
    return <LoginScreen onCancel={() => setLoginPrompt(false)} />;
  }

  return (
    <div className="h-screen w-screen bg-black">
      <main className="h-full">{renderScreen()}</main>
      {!(viewingUser || viewingConversationUser || activeScreen === 'generateVideo') && (
        <BottomNav activeScreen={activeScreen} setActiveScreen={navigateTo} />
      )}
    </div>
  );
}

export default App;
