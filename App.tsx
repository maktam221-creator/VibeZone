import React, { useState, useEffect, useCallback } from 'react';
import { type Screen, type VideoPost, type User, type Comment, type FeedTab, type Theme, type ConversationPreview, type DirectMessage } from './types';
import { BottomNav } from './components/BottomNav';
import { FeedScreen } from './screens/FeedScreen';
import { InboxScreen } from './screens/InboxScreen';
import { CreateScreen } from './screens/CreateScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LoginScreen } from './screens/LoginScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { CommentsScreen } from './screens/CommentsScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { ChangePasswordScreen } from './screens/ChangePasswordScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ConversationScreen } from './screens/ConversationScreen';
import { ChatThemeScreen } from './screens/ChatThemeScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';
import { api } from './services/apiService';
import { FollowListScreen } from './screens/FollowListScreen';
import { LiveScreen } from './screens/LiveScreen';
import { Logo } from './components/Logo';
import { DiscoverScreen } from './screens/DiscoverScreen';

const UserProfileSkeleton: React.FC = () => (
    <div className="h-full overflow-y-auto bg-black text-white pb-20 animate-pulse">
        <header className="flex items-center p-4 border-b border-gray-800">
            <div className="w-6 h-6 bg-gray-800 rounded"></div>
            <div className="h-6 w-32 bg-gray-800 rounded mx-auto"></div>
            <div className="w-6"></div>
        </header>
        <div className="pt-4 p-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 mb-3"></div>
            <div className="h-6 w-40 bg-gray-800 rounded"></div>
        </div>
        <div className="flex justify-around items-center px-4 py-3 bg-gray-900/50 rounded-lg mx-4">
            <div className="text-center space-y-2"> <div className="h-5 w-12 mx-auto bg-gray-800 rounded"></div> <div className="h-4 w-16 mx-auto bg-gray-800 rounded"></div> </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="text-center space-y-2"> <div className="h-5 w-12 mx-auto bg-gray-800 rounded"></div> <div className="h-4 w-16 mx-auto bg-gray-800 rounded"></div> </div>
            <div className="h-8 w-px bg-gray-700"></div>
            <div className="text-center space-y-2"> <div className="h-5 w-12 mx-auto bg-gray-800 rounded"></div> <div className="h-4 w-16 mx-auto bg-gray-800 rounded"></div> </div>
        </div>
        <div className="px-6 py-4 flex items-center justify-center gap-2">
            <div className="flex-1 h-10 bg-gray-800 rounded-lg"></div>
            <div className="w-12 h-10 bg-gray-800 rounded-lg"></div>
        </div>
        <div className="h-4 w-3/4 bg-gray-800 rounded mx-auto mb-4"></div>
        <div className="border-b border-gray-800 mt-4"></div>
        <div className="grid grid-cols-3 gap-0.5">
            {Array(9).fill(0).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-800"></div>
            ))}
        </div>
    </div>
);


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>('feed');
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const getInitialTheme = (): Theme => {
    try {
      const storedTheme = localStorage.getItem('vibezone-theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
    } catch (e) {
      console.warn('Could not access localStorage to get theme.', e);
    }
    return 'dark'; // Default theme
  };
  const [theme, setTheme] = useState<Theme>(getInitialTheme());

  // Screen states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [viewingProfileData, setViewingProfileData] = useState<any | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [activeConversationUser, setActiveConversationUser] = useState<User | null>(null);
  const [chatHistory, setChatHistory] = useState<DirectMessage[]>([]);
  const [activeConversationTheme, setActiveConversationTheme] = useState<string | null>(null);
  const [isSelectingChatTheme, setIsSelectingChatTheme] = useState(false);
  const [viewingFollowList, setViewingFollowList] = useState<{ userId: string; type: 'followers' | 'following' } | null>(null);
  const [followListData, setFollowListData] = useState<User[]>([]);
  const [viewingUserPostsFeed, setViewingUserPostsFeed] = useState<VideoPost[] | null>(null);


  // Feed state
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [followingVideos, setFollowingVideos] = useState<VideoPost[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [activeFeedTab, setActiveFeedTab] = useState<FeedTab>('foryou');
  
  // Interaction state
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [userStats, setUserStats] = useState({ following: 0, followers: 0, likes: 0 });

  // Comments state
  const [commentingPost, setCommentingPost] = useState<VideoPost | null>(null);
  const [activeComments, setActiveComments] = useState<Comment[]>([]);

  // --- Theme Management ---
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
        localStorage.setItem('vibezone-theme', theme);
    } catch (e) {
        console.warn('Could not save theme to localStorage.', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const fetchUserStats = useCallback(() => {
    if (currentUser) {
        const stats = api.getUserStats(currentUser.id);
        setUserStats(stats);
    } else {
        setUserStats({ following: 0, followers: 0, likes: 0 });
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserStats();
  }, [currentUser, fetchUserStats]);


  // --- Data Fetching ---
  const fetchForYouFeed = useCallback(() => {
    const feed = api.getForYouFeed();
    setVideos(feed);
  }, []);

  const fetchFollowingFeed = useCallback(() => {
    if (currentUser) {
      const feed = api.getFollowingFeed();
      setFollowingVideos(feed);
    }
  }, [currentUser]);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoadingFeed(true);
      await api.initialize();
      
      const user = api.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const { likedVideos, followedUsers } = api.getInteractions();
        setLikedVideos(likedVideos);
        setFollowedUsers(followedUsers);
      }
      
      fetchForYouFeed();
      setIsLoadingFeed(false);
    };
    initializeApp();
  }, [fetchForYouFeed]);

  const fetchViewingProfile = useCallback((profileId: string) => {
    setIsLoadingProfile(true);
    const profileData = api.getUserProfile(profileId);
    if (profileData) {
      setViewingProfileData(profileData);
    } else {
      alert("User not found");
      setViewingProfileId(null);
    }
    setIsLoadingProfile(false);
  }, []);

  useEffect(() => {
    if (viewingProfileId) {
        fetchViewingProfile(viewingProfileId);
    } else {
        setViewingProfileData(null);
    }
  }, [viewingProfileId, fetchViewingProfile]);

  useEffect(() => {
    if (activeFeedTab === 'following' && currentUser) {
      fetchFollowingFeed();
    }
    if (activeFeedTab === 'foryou') {
      fetchForYouFeed();
    }
  }, [activeFeedTab, fetchFollowingFeed, fetchForYouFeed, currentUser]);

  // --- Handlers ---
  const addVideoPost = (postData: { caption: string; songName: string; videoUrl: string; thumbnailUrl?: string; mimeType: string | null; }) => {
    const newPost = api.addVideoPost(postData);
    if (!newPost) {
        setShowLoginScreen(true);
    }
  };

  const handlePostCreated = () => {
      fetchForYouFeed();
      setActiveScreen('feed');
      setActiveFeedTab('foryou');
  };

  const handleDeletePost = (postId: string) => {
    const result = api.deleteVideoPost(postId);
    if (result.success) {
      setVideos(prevVideos => prevVideos.filter(v => v.id !== postId));
      setFollowingVideos(prevVideos => prevVideos.filter(v => v.id !== postId));
      fetchUserStats();
    } else {
      console.error("Failed to delete post:", result.error);
      if(result.error?.includes('الجلسة')) {
        setShowLoginScreen(true);
      } else {
        alert(result.error || 'فشل حذف المنشور');
      }
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const { likedVideos, followedUsers } = api.getInteractions();
    setLikedVideos(likedVideos);
    setFollowedUsers(followedUsers);
    setShowLoginScreen(false);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setLikedVideos(new Set());
    setFollowedUsers(new Set());
    setFollowingVideos([]);
    setActiveScreen('feed');
    setActiveFeedTab('foryou');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('هل أنت متأكد؟ سيتم إلغاء تنشيط حسابك لمدة 30 يومًا. يمكنك تسجيل الدخول مرة أخرى خلال هذه الفترة لاستعادته.')) {
        const result = api.deleteCurrentUserAccount();
        if (result.success) {
          setCurrentUser(null);
          setLikedVideos(new Set());
          setFollowedUsers(new Set());
          setFollowingVideos([]);
          setActiveScreen('feed');
          setActiveFeedTab('foryou');
          setViewingProfileId(null);
          setIsEditingProfile(false);
          setShowLoginScreen(false);
          fetchForYouFeed();
        } else {
          alert(result.error || 'فشل حذف الحساب.');
          handleLogout();
        }
    }
  };
  
  const handleNavigation = (screen: Screen) => {
    // Reset any sub-screens when using the main nav
    if (viewingUserPostsFeed || viewingProfileId || isEditingProfile || activeConversationUser || commentingPost || viewingFollowList || ['settings', 'security', 'changePassword', 'notifications', 'conversation', 'chatTheme', 'privacy', 'live', 'ai_chat'].includes(activeScreen)) {
      setViewingUserPostsFeed(null);
      setViewingProfileId(null);
      setIsEditingProfile(false);
      setActiveConversationUser(null);
      setIsSelectingChatTheme(false);
      setCommentingPost(null);
      setViewingFollowList(null);
    }
    
    if (!currentUser && ['create', 'inbox', 'profile', 'live'].includes(screen)) {
        setShowLoginScreen(true);
    } else {
        setActiveScreen(screen);
        if (screen === 'feed' && activeScreen !== 'feed') {
          setActiveFeedTab('foryou');
        }
    }
  };

  const handleGenericError = (error: unknown, actionName: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to ${actionName}:`, error);

    if (errorMessage.includes("not authenticated")) {
        handleLogout();
        setShowLoginScreen(true);
    } else {
        alert(`حدث خطأ أثناء ${actionName}. يرجى المحاولة مرة أخرى.\nالخطأ: ${errorMessage}`);
    }
  };
  
  const handleToggleLike = (videoId: string) => {
    if (!currentUser) {
        setShowLoginScreen(true);
        return;
    }
    try {
      const post = api.getPostById(videoId);
      if (!post) return;

      const { newLikesCount, isLiked } = api.toggleLike(videoId);
      
      const mapLikes = (video: VideoPost) => 
          video.id === videoId ? { ...video, likes: newLikesCount } : video;
      
      setVideos(prev => prev.map(mapLikes));
      setFollowingVideos(prev => prev.map(mapLikes));
      if (viewingUserPostsFeed) {
        setViewingUserPostsFeed(prev => prev!.map(mapLikes));
      }
      
      setLikedVideos(currentLiked => {
          const newLiked = new Set(currentLiked);
          if (isLiked) newLiked.add(videoId); else newLiked.delete(videoId);
          return newLiked;
      });

      fetchUserStats();
      if (viewingProfileId && post.user.id === viewingProfileId) {
          fetchViewingProfile(viewingProfileId);
      }
      
    } catch (error) {
        handleGenericError(error, 'محاولة الإعجاب');
    }
  };

  const handleOpenComments = (post: VideoPost) => {
     if (!currentUser) {
        setShowLoginScreen(true);
        return;
    }
    const comments = api.getCommentsForPost(post.id);
    setActiveComments(comments);
    setCommentingPost(post);
  };

  const handleCloseComments = () => {
    setCommentingPost(null);
    setActiveComments([]);
  };

  const handleAddComment = (text: string) => {
      if (!commentingPost || !currentUser) return;
      try {
        const newComment = api.addComment(commentingPost.id, text);
        setActiveComments(prev => [...prev, newComment]);
        
        const updatedPost = { ...commentingPost, commentsCount: commentingPost.commentsCount + 1 };
        setCommentingPost(updatedPost);

        const updateCommentCount = (videoList: VideoPost[]) =>
            videoList.map(video => 
                video.id === commentingPost.id ? { ...video, commentsCount: video.commentsCount + 1 } : video
            );
        setVideos(updateCommentCount);
        setFollowingVideos(updateCommentCount);
        if (viewingUserPostsFeed) {
          setViewingUserPostsFeed(prev => prev!.map(p => p.id === commentingPost.id ? { ...p, commentsCount: p.commentsCount + 1 } : p));
        }

      } catch(error) {
        handleGenericError(error, 'إضافة تعليق');
      }
  };
  
  const handleToggleFollow = (username: string) => {
    if (!currentUser) {
      setShowLoginScreen(true);
      return;
    }
    try {
      const { isFollowing } = api.toggleFollow(username);
      
      setFollowedUsers(currentFollowed => {
        const newFollowed = new Set(currentFollowed);
        if (isFollowing) newFollowed.add(username); else newFollowed.delete(username);
        return newFollowed;
      });

      fetchUserStats();
      if (viewingProfileData && viewingProfileData.user.username === username) {
        fetchViewingProfile(viewingProfileData.user.id);
      }

      if (viewingFollowList) {
        if (viewingFollowList.type === 'followers') {
            const followers = api.getFollowers(viewingFollowList.userId);
            setFollowListData(followers);
        } else {
            const following = api.getFollowing(viewingFollowList.userId);
            setFollowListData(following);
        }
      }

      if (activeFeedTab === 'following') {
        fetchFollowingFeed();
      }
    } catch (error) {
      handleGenericError(error, 'المتابعة أو إلغائها');
    }
  };
  
  const handleIncrementView = useCallback((postId: string) => {
    api.logView(postId);
  }, []);

  const handleViewProfile = (user: User) => {
    if (user.id === currentUser?.id) {
        setViewingUserPostsFeed(null);
        setActiveScreen('profile');
        setViewingProfileId(null);
    } else {
        setViewingUserPostsFeed(null);
        setViewingProfileId(user.id);
    }
  };

  const handleSaveProfile = (updatedData: { name?: string, username?: string, bio?: string, avatarUrl?: string }) => {
    const result = api.updateUserProfile(updatedData);
    if (result.user) {
        setCurrentUser(result.user);
        setIsEditingProfile(false);
        fetchForYouFeed();
        if (activeFeedTab === 'following') {
            fetchFollowingFeed();
        }
    } else {
        alert(result.error);
    }
  };

  const handleChangePassword = (oldPass: string, newPass: string): Promise<{success: boolean; error?: string}> => {
    return new Promise((resolve) => {
        const result = api.changePassword(oldPass, newPass);
        resolve(result);
    });
  };
  
  const handleOpenConversation = (user: User) => {
    const history = api.getChatHistory(user.id);
    const theme = api.getConversationTheme(user.id);
    setChatHistory(history);
    setActiveConversationTheme(theme);
    setActiveConversationUser(user);
    setActiveScreen('conversation');
  };

  const handleSendMessage = (text: string) => {
      if(!activeConversationUser) return;
      try {
        const newMessage = api.sendMessage(activeConversationUser.id, text);
        setChatHistory(prev => [...prev, newMessage]);
      } catch (error) {
        handleGenericError(error, 'إرسال رسالة');
      }
  };
  
  const handleOpenChatTheme = () => {
    if(activeConversationUser) {
      setIsSelectingChatTheme(true);
    }
  };

  const handleSetConversationTheme = (themeClass: string) => {
    if(activeConversationUser) {
      api.setConversationTheme(activeConversationUser.id, themeClass);
      setActiveConversationTheme(themeClass);
      setIsSelectingChatTheme(false);
    }
  };
  
  const handleOpenLikes = (post: VideoPost) => {
      alert(`Viewing likes for post "${post.caption}" is not implemented yet.`);
  };

  const handleSharePost = (post: VideoPost) => {
      alert(`Sharing post "${post.caption}" is not implemented yet.`);
  };

  const handleOpenFollowers = (userId: string) => {
    const followers = api.getFollowers(userId);
    setFollowListData(followers);
    setViewingFollowList({ userId, type: 'followers' });
  };

  const handleOpenFollowing = (userId: string) => {
    const following = api.getFollowing(userId);
    setFollowListData(following);
    setViewingFollowList({ userId, type: 'following' });
  };

  const handleCloseFollowList = () => {
    setViewingFollowList(null);
    setFollowListData([]);
  };

  const handleViewUserPost = (post: VideoPost, allUserPosts: VideoPost[]) => {
    const postIndex = allUserPosts.findIndex(p => p.id === post.id);
    if (postIndex > -1) {
      const reorderedPosts = [
        ...allUserPosts.slice(postIndex),
        ...allUserPosts.slice(0, postIndex)
      ];
      setViewingUserPostsFeed(reorderedPosts);
    }
  };

  const handleCloseUserPostsFeed = () => {
    setViewingUserPostsFeed(null);
  };


  // --- Screen Rendering ---
  const renderScreen = () => {
    if (viewingUserPostsFeed) {
        return (
            <FeedScreen
                videos={viewingUserPostsFeed}
                isAuthenticated={!!currentUser}
                onAuthAction={() => setShowLoginScreen(true)}
                likedPosts={likedVideos}
                followedUsers={followedUsers}
                onToggleLike={handleToggleLike}
                onToggleFollow={handleToggleFollow}
                onNavigate={handleNavigation}
                onOpenComments={handleOpenComments}
                onOpenLikes={handleOpenLikes}
                onSharePost={handleSharePost}
                onViewProfile={handleViewProfile}
                onIncrementView={handleIncrementView}
                activeTab={'foryou'}
                onTabChange={() => {}}
                onBack={handleCloseUserPostsFeed}
            />
        );
    }

    if (viewingFollowList && currentUser) {
      return (
        <FollowListScreen
          title={viewingFollowList.type === 'followers' ? 'المتابعون' : 'المتابَعة'}
          users={followListData}
          currentUser={currentUser}
          followedUsers={followedUsers}
          onBack={handleCloseFollowList}
          onToggleFollow={handleToggleFollow}
          onViewProfile={(user) => {
            handleCloseFollowList();
            handleViewProfile(user);
          }}
        />
      );
    }
    
    if (activeScreen === 'live' && currentUser) {
      return <LiveScreen onBack={() => setActiveScreen('feed')} currentUser={currentUser} />;
    }

    if (activeScreen === 'conversation' && activeConversationUser && currentUser) {
        return <ConversationScreen
            currentUser={currentUser}
            otherUser={activeConversationUser}
            history={chatHistory}
            onSendMessage={handleSendMessage}
            onBack={() => {
                setActiveConversationUser(null);
                setActiveScreen('inbox');
            }}
            themeClass={activeConversationTheme}
            onOpenThemes={handleOpenChatTheme}
        />;
    }
    if (activeScreen === 'ai_chat') {
        return <ChatScreen onBack={() => setActiveScreen('inbox')} />;
    }
    if (activeScreen === 'notifications') {
        return <NotificationsScreen onBack={() => setActiveScreen('feed')} />;
    }
    if (activeScreen === 'changePassword') {
        return <ChangePasswordScreen onBack={() => setActiveScreen('security')} onChangePassword={handleChangePassword} />
    }
    if (activeScreen === 'security') {
        return <SecurityScreen onBack={() => setActiveScreen('settings')} onNavigate={setActiveScreen} />
    }
    if (activeScreen === 'privacy') {
        return <PrivacyScreen onBack={() => setActiveScreen('settings')} />
    }
    if (activeScreen === 'settings') {
      return <SettingsScreen onBack={() => setActiveScreen('profile')} theme={theme} onToggleTheme={toggleTheme} onNavigate={setActiveScreen} />
    }
    if (viewingProfileId) {
        if (isLoadingProfile || !viewingProfileData) {
            return <UserProfileSkeleton />
        }
        return <UserProfileScreen 
            userProfile={viewingProfileData}
            onBack={() => setViewingProfileId(null)}
            isFollowing={followedUsers.has(viewingProfileData.user.username)}
            onToggleFollow={() => handleToggleFollow(viewingProfileData.user.username)}
            onMessage={() => handleOpenConversation(viewingProfileData.user)}
            onOpenFollowers={() => handleOpenFollowers(viewingProfileData.user.id)}
            onOpenFollowing={() => handleOpenFollowing(viewingProfileData.user.id)}
            onViewPost={handleViewUserPost}
        />
    }
     if (isEditingProfile && activeScreen === 'profile') {
        const userProfileData = {
          ...currentUser!,
          stats: userStats,
          bio: currentUser!.bio || '✨ أعيش الحياة بإيجابية | 📸 تصوير | ✈️ سفر',
        };
        return <EditProfileScreen 
            user={userProfileData} 
            onSave={handleSaveProfile}
            onCancel={() => setIsEditingProfile(false)}
        />
     }

    switch (activeScreen) {
      case 'feed':
        const videosForFeed = activeFeedTab === 'foryou' 
            ? videos 
            : (currentUser ? followingVideos : []);
         return (
          <FeedScreen
            videos={videosForFeed}
            isAuthenticated={!!currentUser}
            onAuthAction={() => setShowLoginScreen(true)}
            likedPosts={likedVideos}
            followedUsers={followedUsers}
            onToggleLike={handleToggleLike}
            onToggleFollow={handleToggleFollow}
            onNavigate={handleNavigation}
            onOpenComments={handleOpenComments}
            onOpenLikes={handleOpenLikes}
            onSharePost={handleSharePost}
            onViewProfile={handleViewProfile}
            onIncrementView={handleIncrementView}
            activeTab={activeFeedTab}
            onTabChange={setActiveFeedTab}
          />
        );
      case 'inbox':
        return <InboxScreen onOpenConversation={handleOpenConversation} onNavigate={setActiveScreen} />;
      case 'discover':
        return <DiscoverScreen onViewPost={handleViewUserPost} />;
      case 'create':
        if (!currentUser) return null;
        return (
            <CreateScreen 
                addVideoPost={addVideoPost}
                onPostCreated={handlePostCreated}
                currentUser={currentUser}
            />
        );
      case 'profile':
         if (!currentUser) return null;
         const userPosts = api.getUserPosts(currentUser.id);
         const userProfileData = { ...currentUser, posts: userPosts, stats: userStats, bio: currentUser.bio || '✨ أعيش الحياة بإيجابية | 📸 تصوير | ✈️ سفر' };
        return <ProfileScreen 
            user={userProfileData} 
            onEditProfile={() => setIsEditingProfile(true)} 
            onLogout={handleLogout} 
            onDeleteAccount={handleDeleteAccount} 
            onNavigateToSettings={() => setActiveScreen('settings')} 
            onOpenFollowers={() => handleOpenFollowers(currentUser.id)}
            onOpenFollowing={() => handleOpenFollowing(currentUser.id)}
            onViewPost={handleViewUserPost}
        />;
      default:
         return (
          <FeedScreen
            videos={videos}
            isAuthenticated={!!currentUser}
            onAuthAction={() => setShowLoginScreen(true)}
            likedPosts={likedVideos}
            followedUsers={followedUsers}
            onToggleLike={handleToggleLike}
            onToggleFollow={handleToggleFollow}
            onNavigate={handleNavigation}
            onOpenComments={handleOpenComments}
            onOpenLikes={handleOpenLikes}
            onSharePost={handleSharePost}
            onViewProfile={handleViewProfile}
            onIncrementView={handleIncrementView}
            activeTab={activeFeedTab}
            onTabChange={setActiveFeedTab}
          />
        );
    }
  };

  const shouldShowNav = !viewingUserPostsFeed && !['settings', 'security', 'changePassword', 'notifications', 'conversation', 'chatTheme', 'privacy', 'live', 'ai_chat'].includes(activeScreen) && !isEditingProfile && !viewingFollowList;

  if (isLoadingFeed) {
    return (
        <div className={`h-screen w-full flex flex-col items-center justify-center ${theme === 'dark' ? 'dark bg-black' : 'bg-gray-50'}`}>
            <div className="animate-zoom-in-fade">
                <Logo />
            </div>
            <p className={`mt-4 text-gray-500 ${theme === 'dark' ? 'dark:text-gray-400' : 'text-gray-500'}`}>جاري التحميل...</p>
        </div>
    );
  }

  return (
    <div className={`h-screen w-full ${theme === 'dark' ? 'dark bg-black' : 'bg-gray-50'}`}>
      <main className="h-full">
        {renderScreen()}
      </main>
      {shouldShowNav && <BottomNav activeScreen={viewingProfileId ? 'userProfile' : activeScreen} setActiveScreen={handleNavigation} />}
      {showLoginScreen && (
        <LoginScreen onLoginSuccess={handleLogin} onCancel={() => setShowLoginScreen(false)} />
      )}
      {commentingPost && (
        <CommentsScreen postCommentsCount={commentingPost.commentsCount} comments={activeComments} currentUser={currentUser} onClose={handleCloseComments} onAddComment={handleAddComment} />
      )}
      {isSelectingChatTheme && (
        <ChatThemeScreen 
            onClose={() => setIsSelectingChatTheme(false)}
            onSelectTheme={handleSetConversationTheme}
        />
      )}
    </div>
  );
};

export default App;