
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

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('feed');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [loginPrompt, setLoginPrompt] = useState(false);
  
  // Data state
  const [videos, setVideos] = useState<VideoPost[]>(mockVideos);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [allUsers, setAllUsers] = useState<User[]>(mockAllUsers);

  // Navigation and view state
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(['feed']);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewingPostFromProfile, setViewingPostFromProfile] = useState<VideoPost | null>(null);
  const [viewingConversationUser, setViewingConversationUser] = useState<User | null>(null);
  const [viewingStream, setViewingStream] = useState<LiveStream | null>(null);
  
  // Modal state
  const [commentsModalPost, setCommentsModalPost] = useState<VideoPost | null>(null);
  const [likesModalPost, setLikesModalPost] = useState<VideoPost | null>(null);
  const [detailModalType, setDetailModalType] = useState<StatsModalType | null>(null);
  const [detailModalUser, setDetailModalUser] = useState<User | null>(null);

  // Handle auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        const loggedInUser = allUsers.find(u => u.username === 'نور') || initialUser;
        setCurrentUser(loggedInUser);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(initialUser); // Reset to guest state
        setLikedPosts(new Set()); // Clear likes on logout
        setFollowedUsers(new Set()); // Clear follows on logout
      }
      setActiveScreen('feed');
      setLoginPrompt(false);
    });

    return () => unsubscribe();
  }, [allUsers]);

  const navigateTo = (screen: Screen) => {
    if ((screen === 'profile' || screen === 'chat' || screen === 'create' || screen === 'live') && !isAuthenticated) {
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
        setActiveScreen(newHistory[newHistory.length-1]);
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
      text: `Check out this video from @${post.user.username}: ${post.caption}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        const updatedVideos = videos.map(v => v.id === post.id ? {...v, shares: v.shares + 1} : v);
        setVideos(updatedVideos);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleViewProfile = (user: User) => {
    if (user.username === currentUser.username && isAuthenticated) {
        navigateTo('profile');
    } else {
        setViewingUser(user);
    }
  };

  const handleViewPostFromProfile = (post: VideoPost) => {
    setViewingPostFromProfile(post);
  }

  const handleIncrementView = (postId: string) => {
    console.log("Post viewed", postId);
    setVideos(prevVideos => {
        return prevVideos.map(video => {
            if (video.id === postId) {
                return { ...video, views: (video.views || 0) + 1 };
            }
            return video;
        });
    });
  }
  
  const handleAddComment = (postId: string, commentText: string) => {
     const newComment: Comment = {
        id: `c-${Date.now()}`,
        user: currentUser,
        text: commentText,
        timestamp: new Date().toISOString()
     };
     
     if (commentsModalPost?.id === postId) {
         setCommentsModalPost(prev => prev ? {...prev, comments: [...prev.comments, newComment]} : null);
     }
     
     const videoToUpdate = videos.find(v => v.id === postId);
     if (videoToUpdate) {
         videoToUpdate.comments.push(newComment);
         setVideos([...videos]);
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
  
  const handleOpenStatsModal = (type: StatsModalType) => {
    setDetailModalUser(viewingUser || currentUser);
    setDetailModalType(type);
  };
  
  const handleOpenConversation = (user: User) => {
      setViewingConversationUser(user);
      setActiveScreen('chat');
  };
  
  const handleSendMessage = (conversationId: string, text: string) => {
     const newMessage: UserMessage = {
        id: `m-${Date.now()}`,
        senderId: currentUser.username,
        text,
        timestamp: new Date().toISOString()
     };
     setConversations(prev => {
        return prev.map(c => {
            if (c.id === conversationId) {
                return {...c, messages: [...c.messages, newMessage]};
            }
            return c;
        });
     });
  };

  const renderScreen = () => {
    if (viewingUser) {
        const userProfileData = {
            ...viewingUser,
            posts: videos.filter(v => v.user.username === viewingUser.username),
            stats: viewingUser.stats || { followers: 1, following: 1, likes: 1 },
            bio: viewingUser.bio || '',
            name: viewingUser.name || viewingUser.username
        };
        return <ProfileScreen 
            user={userProfileData} 
            isCurrentUser={false} 
            onBack={() => setViewingUser(null)} 
            onViewPost={handleViewPostFromProfile} 
            onOpenStatsModal={handleOpenStatsModal}
            likedPosts={[]}
            onToggleFollow={handleToggleFollow}
            followedUsers={followedUsers}
            onNavigate={() => {}} 
            onLogout={() => {}}
        />
    }

    if(viewingConversationUser) {
        const conversation = conversations.find(c => c.user.username === viewingConversationUser.username) || {
            id: `conv-${viewingConversationUser.username}`,
            user: viewingConversationUser,
            messages: [],
            unreadCount: 0,
        };
        return <ConversationScreen 
            conversation={conversation}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onBack={() => setViewingConversationUser(null)}
        />
    }

    switch (activeScreen) {
      case 'feed':
        return <FeedScreen 
                    videos={videos} 
                    likedPosts={likedPosts}
                    followedUsers={followedUsers}
                    onToggleLike={handleToggleLike}
                    onToggleFollow={handleToggleFollow}
                    onNavigate={navigateTo}
                    onOpenComments={setCommentsModalPost}
                    onOpenLikes={setLikesModalPost}
                    onSharePost={handleSharePost}
                    onViewProfile={handleViewProfile}
                    onIncrementView={handleIncrementView}
                    isAuthenticated={isAuthenticated}
                    onLoginPrompt={() => setLoginPrompt(true)}
                />;
      case 'discover':
        return <DiscoverScreen videos={videos} onViewPost={handleViewPostFromProfile} />;
      case 'create':
        return <CreateScreen 
            onPostCreated={() => navigateTo('feed')} 
            addVideoPost={handleAddVideoPost}
            currentUser={currentUser}
            onGoLive={() => setViewingStream(mockStreams[0])}
            />;
      case 'chat':
        return <ChatScreen 
            conversations={conversations} 
            onOpenConversation={handleOpenConversation}
            currentUser={currentUser}
            allUsers={allUsers}
            />;
      case 'profile': {
        if (!isAuthenticated) return null;
        const userProfileData = {
            ...currentUser,
            posts: videos.filter(v => v.user.username === currentUser.username),
            stats: currentUser.stats || { followers: 1, following: 1, likes: 1 },
            bio: currentUser.bio || '',
            name: currentUser.name || currentUser.username
        };
        return <ProfileScreen 
                    user={userProfileData} 
                    isCurrentUser={true} 
                    onLogout={handleLogout} 
                    onNavigate={navigateTo} 
                    onViewPost={handleViewPostFromProfile}
                    onOpenStatsModal={handleOpenStatsModal}
                    likedPosts={videos.filter(v => likedPosts.has(v.id))}
                    onToggleFollow={handleToggleFollow}
                    followedUsers={followedUsers}
                />;
      }
      case 'live':
        return <LiveScreen onViewStream={setViewingStream} />;
      case 'editProfile': {
        if (!isAuthenticated) return null;
        const userToEdit = {
          ...currentUser,
          name: currentUser.name || '',
          bio: currentUser.bio || '',
          stats: currentUser.stats || { followers: 0, following: 0, likes: 0 }
        };
        return <EditProfileScreen user={userToEdit} onCancel={goBack} onSave={(updatedUser) => {
            setCurrentUser(updatedUser);
            goBack();
        }} />;
      }
      case 'account':
        return <AccountScreen user={currentUser} onBack={goBack} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'privacy':
        return <PrivacyScreen onBack={goBack} />;
      case 'changePassword':
        return <ChangePasswordScreen onBack={goBack} />;
      default:
        return <FeedScreen videos={videos} likedPosts={likedPosts} followedUsers={followedUsers} onToggleLike={handleToggleLike} onToggleFollow={handleToggleFollow} onNavigate={navigateTo} onOpenComments={setCommentsModalPost} onOpenLikes={setLikesModalPost} onSharePost={handleSharePost} onViewProfile={handleViewProfile} onIncrementView={handleIncrementView} isAuthenticated={isAuthenticated} onLoginPrompt={() => setLoginPrompt(true)} />;
    }
  };

  if (loginPrompt) {
    return <LoginScreen onCancel={() => setLoginPrompt(false)} />
  }

  if (viewingPostFromProfile) {
    return <FeedScreen
        videos={[viewingPostFromProfile]}
        likedPosts={likedPosts}
        followedUsers={followedUsers}
        onToggleLike={handleToggleLike}
        onToggleFollow={handleToggleFollow}
        onNavigate={navigateTo}
        onOpenComments={setCommentsModalPost}
        onOpenLikes={setLikesModalPost}
        onSharePost={handleSharePost}
        onViewProfile={handleViewProfile}
        onBack={goBack}
        onIncrementView={handleIncrementView}
        isAuthenticated={isAuthenticated}
        onLoginPrompt={() => setLoginPrompt(true)}
    />
  }
  
  if (viewingStream) {
    return <LiveStreamView stream={viewingStream} onClose={() => setViewingStream(null)} currentUser={currentUser}/>
  }
  
  if (!isAuthenticated) {
      // Guest users can browse the feed. The login prompt will appear for protected actions.
  }
  
  return (
    <div className="h-screen w-screen bg-black">
      <main className="h-full">
        {renderScreen()}
      </main>
      
      {commentsModalPost && (
        <CommentsModal 
            post={commentsModalPost} 
            currentUser={currentUser}
            onClose={() => setCommentsModalPost(null)}
            onAddComment={handleAddComment}
        />
      )}
      
      {likesModalPost && (
        <LikesModal 
            users={allUsers.slice(0, 5)} // Mock likers
            onClose={() => setLikesModalPost(null)}
            currentUser={currentUser}
            followedUsers={followedUsers}
            onToggleFollow={handleToggleFollow}
            onViewProfile={(user) => {
                setLikesModalPost(null);
                handleViewProfile(user);
            }}
        />
      )}
      
      {detailModalType && detailModalUser && (
        <DetailModal 
            type={detailModalType}
            user={{...detailModalUser, posts: videos.filter(v => v.user.username === detailModalUser.username), ...detailModalUser}}
            currentUser={currentUser}
            followedUsers={followedUsers}
            likedPosts={videos.filter(v => likedPosts.has(v.id))}
            allUsers={allUsers}
            onClose={() => setDetailModalType(null)}
            onViewProfile={(user) => {
                setDetailModalType(null);
                handleViewProfile(user);
            }}
            onToggleFollow={handleToggleFollow}
            onViewPost={(post) => {
                setDetailModalType(null);
                handleViewPostFromProfile(post);
            }}
        />
      )}
      
      {!(viewingUser || viewingConversationUser) && (
        <BottomNav activeScreen={activeScreen} setActiveScreen={navigateTo} />
      )}
    </div>
  );
}

export default App;
