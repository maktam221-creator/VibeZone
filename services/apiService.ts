import type { User, VideoPost, Comment, DirectMessage, Notification, ConversationPreview, NotificationType } from '../types';

// --- Helper Functions ---
const getDateFromPostId = (id: string): Date => {
    // ID format is "video-ISO_DATE_STRING"
    const dateString = id.substring(id.indexOf('-') + 1);
    const date = new Date(dateString);
    // Return a valid but old date if parsing fails, so it doesn't crash sorting
    return isNaN(date.getTime()) ? new Date(0) : date;
};


// --- Database Simulation ---
const DB_KEY = 'vibezone_db';

interface Database {
  users: (User & { password: string })[];
  posts: VideoPost[];
  likes: { userId: string; postId: string }[];
  follows: { followerId: string; followingUsername: string }[];
  comments: Comment[];
  views: { userId: string; postId: string; timestamp: number }[];
  direct_messages: DirectMessage[];
  notifications: (Notification & { recipientId: string })[];
  conversation_themes: { [conversationId: string]: string }; // key: 'userId1-userId2', value: 'theme-class-name'
}

// In-memory cache for performance
let dbCache: Database | null = null;

const getDb = (): Database => {
  if (dbCache) {
    return dbCache;
  }
  try {
    let dbString: string | null = null;
    try {
        dbString = localStorage.getItem(DB_KEY);
    } catch(e) {
        console.warn("Could not access localStorage to get DB", e);
    }
    const db: Database = dbString ? JSON.parse(dbString) : { users: [], posts: [], likes: [], follows: [], comments: [], views: [], direct_messages: [], notifications: [], conversation_themes: {} };
    // Ensure new tables exist for older DB versions
    if (!db.views) db.views = [];
    if (!db.direct_messages) db.direct_messages = [];
    if (!db.notifications) db.notifications = [];
    if (!db.conversation_themes) db.conversation_themes = {};
    
    dbCache = db;
    return db;
  } catch (e) {
    console.error("Failed to parse DB from localStorage", e);
    const freshDb = { users: [], posts: [], likes: [], follows: [], comments: [], views: [], direct_messages: [], notifications: [], conversation_themes: {} };
    dbCache = freshDb;
    return freshDb;
  }
};

const saveDb = (db: Database) => {
  // Deep copy the database object to avoid mutating the live cache (dbCache),
  // which may contain temporary blob URLs needed for immediate playback.
  const dbToSave = JSON.parse(JSON.stringify(db));

  // Replace any blob URLs in the copy with a placeholder, as they are invalid after a page reload.
  dbToSave.posts.forEach((post: VideoPost) => {
    if (post.videoUrl.startsWith('blob:')) {
      post.videoUrl = `archived:unsavable-media`;
    }
  });

  // Smart Media Archiving to prevent localStorage quota errors from large thumbnail data URLs
  const MAX_MEDIA_POSTS = 5;
  if(dbToSave.posts.length > MAX_MEDIA_POSTS) {
    const postsToArchive = dbToSave.posts
      .sort((a: VideoPost, b: VideoPost) => getDateFromPostId(b.id).getTime() - getDateFromPostId(a.id).getTime())
      .slice(MAX_MEDIA_POSTS);

    for(const post of postsToArchive) {
      if(post.videoUrl.startsWith('data:')) {
        post.videoUrl = `archived:${post.videoUrl.substring(0, 30)}`;
      }
      if(post.thumbnailUrl?.startsWith('data:')) {
        post.thumbnailUrl = `archived:${post.thumbnailUrl.substring(0, 30)}`;
      }
    }
  }

  try {
    localStorage.setItem(DB_KEY, JSON.stringify(dbToSave));
    dbCache = db; // Keep the original cache with live blob URLs in sync
  } catch (error) {
    console.error("Could not save DB to localStorage", error);
  }
};

// --- Session Management (JWT Simulation) ---
const TOKEN_KEY = 'vibezone_token';

const _getAuthenticatedUserId = (): string | null => {
  try {
    let tokenString: string | null = null;
    try {
        tokenString = localStorage.getItem(TOKEN_KEY); 
        if (!tokenString) {
          tokenString = sessionStorage.getItem(TOKEN_KEY);
        }
    } catch (e) {
        console.warn("Could not access storage to get token", e);
    }

    if (!tokenString) return null;

    const token = JSON.parse(tokenString);
    if (!token || !token.userId || !token.expires) return null;

    if (new Date().getTime() > token.expires) {
      try {
          localStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(TOKEN_KEY);
      } catch(e) { console.warn("Could not remove expired token from storage", e); }
      dbCache = null;
      return null;
    }
    
    const db = getDb();
    const user = db.users.find(u => u.id === token.userId);
    if (!user) {
        try {
            localStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(TOKEN_KEY);
        } catch(e) { console.warn("Could not remove invalid user token from storage", e); }
        dbCache = null;
        return null;
    }
    
    // Check if account is deactivated
    if(user.deactivatedUntil && new Date(user.deactivatedUntil) > new Date()){
        return null;
    }


    return token.userId;
  } catch (e) {
    console.error("Failed to parse token", e);
    try {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
    } catch (storageError) { console.warn("Could not remove corrupt token from storage", storageError); }
    return null;
  }
};

const isEmail = (input: string) => input.includes('@');

const getConversationId = (userId1: string, userId2: string): string => {
    return [userId1, userId2].sort().join('-');
};

// --- API Functions ---

export const api = {
  // --- Initialization ---
  async initialize(): Promise<void> {
    const db = getDb();
    if (db.posts.length === 0 && db.users.length === 0) {
      console.log("Database is empty, generating initial content...");
      
      const testUser: User & { password: string } = {
        id: 'user-tester',
        username: 'tester',
        name: 'Tester Account',
        avatarUrl: `https://i.pravatar.cc/150?u=tester`,
        email: 'test@vibezone.app',
        password: 'password',
        bio: 'This is a persistent test account.',
      };
      db.users.push(testUser);
      
      console.log("Generating static feed data for initial launch.");
        
        const fallbackUsers: (User & { password: string })[] = [
            { id: 'user-fallback-1', username: 'ArtLover', name: 'فنان مبدع', avatarUrl: 'https://i.pravatar.cc/150?u=artlover', email: 'art@vibezone.app', password: 'password123', bio: 'أرسم عالمي الخاص' },
            { id: 'user-fallback-2', username: 'CoffeeTime', name: 'قهوة و مزاج', avatarUrl: 'https://i.pravatar.cc/150?u=coffee', email: 'coffee@vibezone.app', password: 'password123', bio: 'يومي يبدأ بفنجان قهوة' },
            { id: 'user-fallback-3', username: 'TravelJunkie', name: 'رحالة', avatarUrl: 'https://i.pravatar.cc/150?u=travel', email: 'travel@vibezone.app', password: 'password123', bio: 'أكتشف العالم في كل رحلة' },
            { id: 'user-fallback-4', username: 'FoodieLife', name: 'ذواقة', avatarUrl: 'https://i.pravatar.cc/150?u=foodie', email: 'food@vibezone.app', password: 'password123', bio: 'الحياة قصيرة، استمتع بالطعام' },
            { id: 'user-fallback-5', username: 'TechGuru', name: 'خبير تقني', avatarUrl: 'https://i.pravatar.cc/150?u=tech', email: 'tech@vibezone.app', password: 'password123', bio: 'كل ما هو جديد في عالم التكنولوجيا' },
        ];
        
        fallbackUsers.forEach(fallbackUser => {
            if (!db.users.some(u => u.id === fallbackUser.id)) {
                db.users.push(fallbackUser);
            }
        });
        
        // Robustly find users and prepare them for post creation
        const userMap: { [key: string]: User } = {};
        const requiredUserIds = ['user-fallback-1', 'user-fallback-2', 'user-fallback-3', 'user-fallback-4', 'user-fallback-5'];
        let allUsersFound = true;
        
        for (const userId of requiredUserIds) {
            const user = db.users.find(u => u.id === userId);
            if (!user) {
                console.error(`Critical error: fallback user '${userId}' not found during initialization.`);
                allUsersFound = false;
                break;
            }
            const { password, ...publicUser } = user;
            userMap[userId] = publicUser;
        }

        if (allUsersFound) {
            const fallbackPosts: VideoPost[] = [
                { id: `video-${new Date(Date.now() - 10000).toISOString()}`, user: userMap['user-fallback-1'], videoUrl: 'https://videos.pexels.com/video-files/4784098/4784098-hd_720_1366_25fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/4784098/pexels-photo-4784098.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'السكينة على الشاطئ... 🌊✨ #بحر #غروب #هدوء', songName: 'Sunset Vibes - Chillwave', likes: 12500, commentsCount: 340, shares: 850 },
                { id: `video-${new Date(Date.now() - 20000).toISOString()}`, user: userMap['user-fallback-2'], videoUrl: 'https://videos.pexels.com/video-files/5495833/5495833-hd_720_1366_24fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/5495833/pexels-photo-5495833.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'أضواء المدينة لا تنام. 🌃 #مدينة #ليل #استكشاف', songName: 'Night Drive - Synthwave', likes: 89000, commentsCount: 1200, shares: 1500 },
                { id: `video-${new Date(Date.now() - 30000).toISOString()}`, user: userMap['user-fallback-3'], videoUrl: 'https://videos.pexels.com/video-files/8053678/8053678-hd_720_1280_25fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/8053678/pexels-photo-8053678.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'الطبيعة تنادي! 🌲⛰️ #طبيعة #مغامرة #هدوء', songName: 'Into The Wild - Folk', likes: 45200, commentsCount: 780, shares: 950 },
                { id: `video-${new Date(Date.now() - 40000).toISOString()}`, user: userMap['user-fallback-4'], videoUrl: 'https://videos.pexels.com/video-files/7578542/7578542-hd_720_1366_25fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/7578542/pexels-photo-7578542.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'تحضير ألذ باستا 🍝 #طبخ #وصفات #أكل', songName: 'Italian Summer - Acoustic', likes: 150000, commentsCount: 2100, shares: 1800 },
                { id: `video-${new Date(Date.now() - 50000).toISOString()}`, user: userMap['user-fallback-5'], videoUrl: 'https://videos.pexels.com/video-files/5992285/5992285-hd_720_1366_25fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/5992285/pexels-photo-5992285.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'نظرة على المستقبل! 🤖 #تقنية #مستقبل #ابتكار', songName: 'Cyberpunk - Electronic', likes: 73000, commentsCount: 990, shares: 1200 },
            ];
            db.posts.push(...fallbackPosts);
        } else {
            // Avoid creating posts if users are missing to prevent crashes.
            console.warn("Skipping post generation due to missing fallback users.");
        }
    }

    const streamerExists = db.users.some(u => u.id === 'user-streamer-1');
    if (!streamerExists) {
        const streamerUser: User & { password: string } = {
            id: 'user-streamer-1',
            username: 'ProGamerX',
            name: 'أحمد برو',
            avatarUrl: 'https://i.pravatar.cc/150?u=progamerx',
            email: 'pro@gamer.x',
            password: 'password123',
            bio: 'بث مباشر يومي لأقوى الألعاب! انضموا للمرح 🔥',
        };
        db.users.push(streamerUser);
    }
    
    saveDb(db);
  },

  // --- Auth & User ---
  signup(username: string, emailOrPhone: string, password: string): { user: User; error: null } | { user: null; error: string } {
    const db = getDb();
    const loginMethod = isEmail(emailOrPhone) ? 'email' : 'phone';

    if (loginMethod === 'email' && db.users.some(u => u.email?.toLowerCase() === emailOrPhone.toLowerCase())) {
        return { user: null, error: 'البريد الإلكتروني مستخدم بالفعل' };
    }
    if (loginMethod === 'phone' && db.users.some(u => u.phone === emailOrPhone)) {
        return { user: null, error: 'رقم الهاتف مستخدم بالفعل' };
    }
    if (db.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { user: null, error: 'اسم المستخدم محجوز' };
    }
    
    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      username,
      email: loginMethod === 'email' ? emailOrPhone : `${username}@vibezone.app`,
      phone: loginMethod === 'phone' ? emailOrPhone : undefined,
      password,
      avatarUrl: `https://i.pravatar.cc/150?u=${username}`,
      name: username,
      bio: 'مستخدم جديد في VibeZone!',
    };
    db.users.push(newUser);
    
    const TOKEN_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000;
    const token = {
      userId: newUser.id,
      expires: new Date().getTime() + TOKEN_EXPIRATION_MS,
    };
    try {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
        sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {
        console.warn("Could not save token to storage on signup", e);
    }

    saveDb(db);
    const { password: _, ...userToReturn } = newUser;
    return { user: userToReturn, error: null };
  },

  login(emailOrPhone: string, password: string, rememberMe: boolean): { user: User; error: null } | { user: null; error: string } {
    const db = getDb();
    
    const userIndex = db.users.findIndex(u => 
        u.email?.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );
    
    const user = userIndex !== -1 ? db.users[userIndex] : null;

    if (!user || user.password !== password) {
      return { user: null, error: 'البريد الإلكتروني / الهاتف أو كلمة المرور غير صحيحة' };
    }
    
    if(user.deactivatedUntil && new Date(user.deactivatedUntil) > new Date()){
        delete user.deactivatedUntil;
        db.users[userIndex] = user;
    }

    const long_expiry = 30 * 24 * 60 * 60 * 1000;
    const short_expiry = 3 * 60 * 60 * 1000;
    
    const token = {
      userId: user.id,
      expires: new Date().getTime() + (rememberMe ? long_expiry : short_expiry),
    };

    const tokenStorage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;
    
    try {
        tokenStorage.setItem(TOKEN_KEY, JSON.stringify(token));
        otherStorage.removeItem(TOKEN_KEY);
    } catch(e) {
        console.warn("Could not save token to storage on login", e);
    }
    
    dbCache = null;

    const { password: _, ...userToReturn } = user;
    return { user: userToReturn, error: null };
  },

  logout(): void {
    try {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
    } catch(e) { console.warn("Could not remove token from storage on logout", e); }
    dbCache = null;
  },

  getCurrentUser(): User | null {
    const userId = _getAuthenticatedUserId();
    if (!userId) return null;
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;
    const { password, ...userToReturn } = user;
    return userToReturn;
  },
  
  getInteractions(): { likedVideos: Set<string>; followedUsers: Set<string> } {
    const userId = _getAuthenticatedUserId();
    if (!userId) {
      return { likedVideos: new Set(), followedUsers: new Set() };
    }
    const db = getDb();
    
    const likedVideos = new Set(
      db.likes.filter(like => like.userId === userId).map(like => like.postId)
    );

    const followedUsers = new Set(
      db.follows.filter(follow => follow.followerId === userId).map(follow => follow.followingUsername)
    );

    return { likedVideos, followedUsers };
  },

  deleteCurrentUserAccount(): { success: boolean; error?: string } {
    const userId = _getAuthenticatedUserId();
    if (!userId) {
      return { success: false, error: 'الجلسة غير صالحة. الرجاء تسجيل الدخول مرة أخرى.' };
    }

    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      this.logout();
      return { success: false, error: 'المستخدم غير موجود.' };
    }
    
    const deactivationDate = new Date();
    deactivationDate.setDate(deactivationDate.getDate() + 30);
    db.users[userIndex].deactivatedUntil = deactivationDate.toISOString();

    this.logout();
    saveDb(db);
    
    return { success: true };
  },

  updateUserProfile(updates: { name?: string, username?: string, bio?: string, avatarUrl?: string }): { user: User, error: null } | { user: null, error: string } {
    const userId = _getAuthenticatedUserId();
    if (!userId) {
        return { user: null, error: 'الجلسة غير صالحة.' };
    }

    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { user: null, error: 'المستخدم غير موجود.' };
    }

    const currentUser = db.users[userIndex];
    const oldUsername = currentUser.username;

    if (updates.username && updates.username !== currentUser.username) {
        if (db.users.some(u => u.username.toLowerCase() === updates.username!.toLowerCase() && u.id !== userId)) {
            return { user: null, error: 'اسم المستخدم محجوز بالفعل.' };
        }
    }
    
    const updatedUser = { ...currentUser, ...updates };
    db.users[userIndex] = updatedUser;

    if (updates.username && updates.username !== oldUsername) {
        db.posts.forEach(post => { if (post.user.id === userId) post.user.username = updates.username!; });
        db.comments.forEach(comment => { if (comment.user.id === userId) comment.user.username = updates.username!; });
        db.follows.forEach(follow => { if (follow.followingUsername === oldUsername) follow.followingUsername = updates.username!; });
        db.notifications.forEach(n => { if (n.user.id === userId) n.user.username = updates.username!; });
    }

     if (updates.avatarUrl) {
        db.posts.forEach(post => { if (post.user.id === userId) post.user.avatarUrl = updates.avatarUrl!; });
        db.comments.forEach(comment => { if (comment.user.id === userId) comment.user.avatarUrl = updates.avatarUrl!; });
        db.notifications.forEach(n => { if (n.user.id === userId) n.user.avatarUrl = updates.avatarUrl!; });
    }

    saveDb(db);
    const { password, ...userToReturn } = updatedUser;
    return { user: userToReturn, error: null };
  },

  changePassword(oldPass: string, newPass: string): { success: boolean; error?: string } {
    const userId = _getAuthenticatedUserId();
    if (!userId) {
        return { success: false, error: 'الجلسة غير صالحة.' };
    }
    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, error: 'المستخدم غير موجود.' };
    }
    const user = db.users[userIndex];
    if (user.password !== oldPass) {
        return { success: false, error: 'كلمة المرور الحالية غير صحيحة.' };
    }
    db.users[userIndex].password = newPass;
    saveDb(db);
    return { success: true };
  },

  getUserProfile(profileId: string) {
    const db = getDb();
    const user = db.users.find(u => u.id === profileId);
    if (!user) return null;

    const { password, ...userPublic } = user;
    const posts = this.getUserPosts(profileId);
    const stats = this.getUserStats(profileId);
    
    return { user: userPublic, posts, stats };
  },

  getUserStats(userId: string) {
      const db = getDb();
      const user = db.users.find(u => u.id === userId);
      if (!user) return { following: 0, followers: 0, likes: 0 };
      
      const following = db.follows.filter(f => f.followerId === userId).length;
      const followers = db.follows.filter(f => f.followingUsername === user.username).length;
      const likes = db.posts.filter(p => p.user.id === userId).reduce((sum, post) => sum + post.likes, 0);
      
      return { following, followers, likes };
  },

  // --- Feeds ---
  getForYouFeed(): VideoPost[] {
    const db = getDb();
    return [...db.posts].sort(() => 0.5 - Math.random());
  },

  getFollowingFeed(): VideoPost[] {
    const userId = _getAuthenticatedUserId();
    if (!userId) return [];
    
    const db = getDb();
    const followedUsernames = new Set(db.follows.filter(f => f.followerId === userId).map(f => f.followingUsername));

    return db.posts
        .filter(p => followedUsernames.has(p.user.username))
        .sort((a, b) => getDateFromPostId(b.id).getTime() - getDateFromPostId(a.id).getTime());
  },
  
  getUserPosts(userId: string): VideoPost[] {
    const db = getDb();
    return db.posts.filter(p => p.user.id === userId)
        .sort((a, b) => getDateFromPostId(b.id).getTime() - getDateFromPostId(a.id).getTime());
  },
  
  getLikedPosts(): VideoPost[] {
      const userId = _getAuthenticatedUserId();
      if (!userId) return [];
      const db = getDb();
      const likedPostIds = new Set(db.likes.filter(l => l.userId === userId).map(l => l.postId));
      return db.posts.filter(p => likedPostIds.has(p.id))
          .sort((a, b) => getDateFromPostId(b.id).getTime() - getDateFromPostId(a.id).getTime());
  },
  
  getPostById(postId: string): VideoPost | undefined {
      const db = getDb();
      return db.posts.find(p => p.id === postId);
  },

  // --- Post Management ---
  addVideoPost(postData: { caption: string; songName: string; videoUrl: string; thumbnailUrl?: string; mimeType: string | null; }): VideoPost | null {
    const userId = _getAuthenticatedUserId();
    if (!userId) return null;
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;

    const { password, ...userPublic } = user;
    const newPost: VideoPost = {
        id: `video-${new Date().toISOString()}`,
        user: userPublic,
        ...postData,
        likes: 0,
        commentsCount: 0,
        shares: 0,
    };
    db.posts.unshift(newPost);
    saveDb(db);
    return newPost;
  },
  
  deleteVideoPost(postId: string): { success: boolean, error?: string } {
    const userId = _getAuthenticatedUserId();
    if (!userId) return { success: false, error: 'الجلسة غير صالحة.' };

    const db = getDb();
    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return { success: false, error: 'المنشور غير موجود.' };

    if (db.posts[postIndex].user.id !== userId) {
        return { success: false, error: 'لا تملك صلاحية حذف هذا المنشور.' };
    }
    
    db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(c => c.postId !== postId);
    db.likes = db.likes.filter(l => l.postId !== postId);
    db.notifications = db.notifications.filter(n => n.post?.id !== postId);

    saveDb(db);
    return { success: true };
  },

  logView(postId: string): void {
      // This is a simple view counter for demonstration. A real app would have more complex logic.
      const userId = _getAuthenticatedUserId() || 'anonymous';
      const db = getDb();
      if (!db.views.some(v => v.userId === userId && v.postId === postId)) {
          db.views.push({ userId, postId, timestamp: Date.now() });
          // Note: In this simulation, view count on the post object isn't updated to avoid constant DB writes.
          saveDb(db);
      }
  },

  // --- Interactions ---
  toggleLike(postId: string): { newLikesCount: number; isLiked: boolean } {
    const userId = _getAuthenticatedUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const db = getDb();
    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) throw new Error("Post not found");
    
    const post = db.posts[postIndex];
    const likeIndex = db.likes.findIndex(l => l.userId === userId && l.postId === postId);
    
    if (likeIndex > -1) {
      db.likes.splice(likeIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
      db.posts[postIndex] = post;
      saveDb(db);
      return { newLikesCount: post.likes, isLiked: false };
    } else {
      db.likes.push({ userId, postId });
      post.likes += 1;
      db.posts[postIndex] = post;
      this.createNotification(post.user.id, userId, 'like', postId);
      saveDb(db);
      return { newLikesCount: post.likes, isLiked: true };
    }
  },

  toggleFollow(usernameToFollow: string): { isFollowing: boolean } {
    const userId = _getAuthenticatedUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const db = getDb();
    const userToFollow = db.users.find(u => u.username === usernameToFollow);
    if (!userToFollow || userToFollow.id === userId) throw new Error("Invalid user to follow");

    const followIndex = db.follows.findIndex(f => f.followerId === userId && f.followingUsername === usernameToFollow);
    
    if (followIndex > -1) {
      db.follows.splice(followIndex, 1);
      saveDb(db);
      return { isFollowing: false };
    } else {
      db.follows.push({ followerId: userId, followingUsername: usernameToFollow });
      this.createNotification(userToFollow.id, userId, 'follow');
      saveDb(db);
      return { isFollowing: true };
    }
  },

  getFollowers(userId: string): User[] {
    const db = getDb();
    const targetUser = db.users.find(u => u.id === userId);
    if (!targetUser) return [];
    
    const followerUsernames = new Set(db.follows.filter(f => f.followingUsername === targetUser.username).map(f => f.followerId));
    return db.users
        .filter(u => followerUsernames.has(u.id))
        .map(({ password, ...userPublic }) => userPublic);
  },
  
  getFollowing(userId: string): User[] {
    const db = getDb();
    const followingUsernames = new Set(db.follows.filter(f => f.followerId === userId).map(f => f.followingUsername));
    return db.users
        .filter(u => followingUsernames.has(u.username))
        .map(({ password, ...userPublic }) => userPublic);
  },

  // --- Comments ---
  getCommentsForPost(postId: string): Comment[] {
    const db = getDb();
    return db.comments.filter(c => c.postId === postId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  addComment(postId: string, text: string): Comment {
    const userId = _getAuthenticatedUserId();
    if (!userId) throw new Error("User not authenticated");
    
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");

    const post = db.posts.find(p => p.id === postId);
    if (!post) throw new Error("Post not found");

    const { password, ...userPublic } = user;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      user: userPublic,
      text,
      timestamp: new Date().toISOString(),
    };
    db.comments.push(newComment);

    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      db.posts[postIndex].commentsCount += 1;
    }
    
    this.createNotification(post.user.id, userId, 'comment', postId, text);
    saveDb(db);
    return newComment;
  },

  // --- DMs & Inbox ---
  getConversations(): ConversationPreview[] {
    const userId = _getAuthenticatedUserId();
    if (!userId) return [];
    const db = getDb();
    const conversationsMap = new Map<string, ConversationPreview>();

    db.direct_messages
        .filter(dm => dm.senderId === userId || dm.recipientId === userId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .forEach(dm => {
            const otherUserId = dm.senderId === userId ? dm.recipientId : dm.senderId;
            const otherUser = db.users.find(u => u.id === otherUserId);
            if (!otherUser) return;
            
            const { password, ...otherUserPublic } = otherUser;
            const isRead = dm.senderId === userId ? true : dm.isRead;

            conversationsMap.set(otherUserId, {
                user: otherUserPublic,
                lastMessage: dm.text,
                timestamp: dm.timestamp,
                isRead: isRead,
            });
        });
        
    return Array.from(conversationsMap.values()).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getChatHistory(otherUserId: string): DirectMessage[] {
    const userId = _getAuthenticatedUserId();
    if (!userId) return [];
    const db = getDb();
    return db.direct_messages.filter(
        dm => (dm.senderId === userId && dm.recipientId === otherUserId) || (dm.senderId === otherUserId && dm.recipientId === userId)
    ).sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage(recipientId: string, text: string): DirectMessage {
    const senderId = _getAuthenticatedUserId();
    if (!senderId) throw new Error("User not authenticated");
    
    const db = getDb();
    const newMessage: DirectMessage = {
        id: `dm-${Date.now()}`,
        senderId,
        recipientId,
        text,
        timestamp: new Date().toISOString(),
        isRead: false,
    };
    db.direct_messages.push(newMessage);
    this.createNotification(recipientId, senderId, 'message');
    saveDb(db);
    return newMessage;
  },
  
  getConversationTheme(otherUserId: string): string | null {
    const userId = _getAuthenticatedUserId();
    if (!userId) return null;
    const db = getDb();
    const convId = getConversationId(userId, otherUserId);
    return db.conversation_themes[convId] || null;
  },

  setConversationTheme(otherUserId: string, themeClass: string): void {
    const userId = _getAuthenticatedUserId();
    if (!userId) return;
    const db = getDb();
    const convId = getConversationId(userId, otherUserId);
    db.conversation_themes[convId] = themeClass;
    saveDb(db);
  },

  // --- Notifications ---
  createNotification(recipientId: string, actorId: string, type: NotificationType, postId?: string, commentText?: string): void {
      if (recipientId === actorId) return;
      const db = getDb();
      const actor = db.users.find(u => u.id === actorId);
      if (!actor) return;

      const { password, ...actorPublic } = actor;
      const newNotification: Notification & { recipientId: string } = {
          id: `notif-${Date.now()}`, recipientId, type, user: actorPublic,
          post: postId ? db.posts.find(p => p.id === postId) : undefined,
          commentText, timestamp: new Date().toISOString(), isRead: false,
      };
      db.notifications.unshift(newNotification);
      saveDb(db);
  },

  getNotifications(): Notification[] {
    const userId = _getAuthenticatedUserId();
    if (!userId) return [];
    const db = getDb();
    return db.notifications.filter(n => n.recipientId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
};