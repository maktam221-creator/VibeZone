
import type { User, VideoPost, Comment, DirectMessage, Notification, ConversationPreview, NotificationType } from '../types';

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
    const dbString = localStorage.getItem(DB_KEY);
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
      .sort((a: VideoPost, b: VideoPost) => new Date(b.id.split('-')[1]).getTime() - new Date(a.id.split('-')[1]).getTime())
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
    let tokenString = localStorage.getItem(TOKEN_KEY); 
    if (!tokenString) {
      tokenString = sessionStorage.getItem(TOKEN_KEY);
    }
    if (!tokenString) return null;

    const token = JSON.parse(tokenString);
    if (!token || !token.userId || !token.expires) return null;

    if (new Date().getTime() > token.expires) {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      dbCache = null;
      return null;
    }
    
    const db = getDb();
    const user = db.users.find(u => u.id === token.userId);
    if (!user) {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(TOKEN_KEY);
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
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
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
      
      // Create a static test user for consistent testing
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
        
        const { password: _p1, ...artUserPublic } = db.users.find(u => u.id === 'user-fallback-1')!;
        const { password: _p2, ...coffeeUserPublic } = db.users.find(u => u.id === 'user-fallback-2')!;
        const { password: _p3, ...travelUserPublic } = db.users.find(u => u.id === 'user-fallback-3')!;
        const { password: _p4, ...foodieUserPublic } = db.users.find(u => u.id === 'user-fallback-4')!;
        const { password: _p5, ...techUserPublic } = db.users.find(u => u.id === 'user-fallback-5')!;

        const fallbackPosts: VideoPost[] = [
            { id: `video-${new Date(Date.now() - 10000).toISOString()}`, user: artUserPublic, videoUrl: 'https://videos.pexels.com/video-files/4784098/4784098-hd_720_1366_25fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/4784098/pexels-photo-4784098.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'السكينة على الشاطئ... 🌊✨ #بحر #غروب #هدوء', songName: 'Sunset Vibes - Chillwave', likes: 12500, commentsCount: 340, shares: 850 },
            { id: `video-${new Date(Date.now() - 20000).toISOString()}`, user: coffeeUserPublic, videoUrl: 'https://videos.pexels.com/video-files/5495833/5495833-hd_720_1366_24fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/5495833/pexels-photo-5495833.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'أضواء المدينة لا تنام. 🌃 #مدينة #ليل #استكشاف', songName: 'Night Drive - Synthwave', likes: 89000, commentsCount: 1200, shares: 1500 },
            { id: `video-${new Date(Date.now() - 30000).toISOString()}`, user: travelUserPublic, videoUrl: 'https://videos.pexels.com/video-files/8053678/8053678-hd_720_1280_25fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/8053678/pexels-photo-8053678.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'الطبيعة تنادي! 🌲⛰️ #طبيعة #مغامرة #هدوء', songName: 'Into The Wild - Folk', likes: 45200, commentsCount: 780, shares: 950 },
            { id: `video-${new Date(Date.now() - 40000).toISOString()}`, user: foodieUserPublic, videoUrl: 'https://videos.pexels.com/video-files/7578542/7578542-hd_720_1366_25fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/7578542/pexels-photo-7578542.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'تحضير ألذ باستا 🍝 #طبخ #وصفات #أكل', songName: 'Italian Summer - Acoustic', likes: 150000, commentsCount: 2100, shares: 1800 },
            { id: `video-${new Date(Date.now() - 50000).toISOString()}`, user: techUserPublic, videoUrl: 'https://videos.pexels.com/video-files/5992285/5992285-hd_720_1366_25fps.mp4', thumbnailUrl: 'https://images.pexels.com/videos/5992285/pexels-photo-5992285.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', mimeType: 'video/mp4', caption: 'نظرة على المستقبل! 🤖 #تقنية #مستقبل #ابتكار', songName: 'Cyberpunk - Electronic', likes: 73000, commentsCount: 990, shares: 1200 },
        ];

        db.posts.push(...fallbackPosts);
    }

    // Ensure streamer user exists for both fresh install and existing users
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

  // --- Auth ---
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
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    sessionStorage.removeItem(TOKEN_KEY);

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
    
    // Reactivate account if deactivated
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
    
    tokenStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    otherStorage.removeItem(TOKEN_KEY);
    
    dbCache = null;

    const { password: _, ...userToReturn } = user;
    return { user: userToReturn, error: null };
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
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
    
    // Deactivate for 30 days instead of deleting immediately
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

    if (updates.username && updates.username !== db.users[userIndex].username) {
        if (db.users.some(u => u.username.toLowerCase() === updates.username!.toLowerCase())) {
            return { user: null, error: 'اسم المستخدم محجوز بالفعل.' };
        }
    }
    
    const originalUser = db.users[userIndex];
    const updatedUser = { ...originalUser, ...updates };
    db.users[userIndex] = updatedUser;

    const { password, ...publicUser } = updatedUser;
    db.posts.forEach(post => {
        if (post.user.id === userId) {
            post.user = publicUser;
        }
    });
    db.comments.forEach(comment => {
        if (comment.user.id === userId) {
            comment.user = publicUser;
        }
    });

    saveDb(db);
    return { user: publicUser, error: null };
},

changePassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    const userId = _getAuthenticatedUserId();
    if (!userId) {
        return { success: false, error: 'الجلسة غير صالحة. الرجاء تسجيل الدخول مرة أخرى.' };
    }

    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        return { success: false, error: 'المستخدم غير موجود.' };
    }

    const user = db.users[userIndex];
    if (user.password !== oldPassword) {
        return { success: false, error: 'كلمة المرور الحالية غير صحيحة.' };
    }

    user.password = newPassword;
    db.users[userIndex] = user;
    saveDb(db);

    return { success: true };
},


  // --- Data Fetching ---
  getUserProfile(userId: string) {
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;

    const { password, ...publicUser } = user;
    const posts = this.getUserPosts(userId);
    const stats = this.getUserStats(userId);

    return {
      user: publicUser,
      posts,
      stats,
    };
  },
  
  getForYouFeed(): VideoPost[] {
    const db = getDb();
    const now = Date.now();

    const getPostViews = (postId: string) => {
        return db.views.filter(v => v.postId === postId).length;
    };

    const sortedPosts = [...db.posts].sort((a, b) => {
      const GRAVITY = 1.8;
      const getScore = (post: VideoPost) => {
        const ageInHours = (now - Date.parse(post.id.split('-')[1])) / (1000 * 60 * 60);
        const views = getPostViews(post.id);
        const baseScore = (post.likes * 1.2) + (post.commentsCount * 2) + (views * 0.8);
        return baseScore / Math.pow(ageInHours + 2, GRAVITY);
      };

      return getScore(b) - getScore(a);
    });
    
    return sortedPosts;
  },

  getFollowingFeed(): VideoPost[] {
    const userId = _getAuthenticatedUserId();
    if (!userId) return [];
    
    const db = getDb();
    const followedUsernames = new Set(db.follows.filter(f => f.followerId === userId).map(f => f.followingUsername));
    
    return [...db.posts]
      .filter(p => followedUsernames.has(p.user.username))
      .reverse(); 
  },

  getLikedPosts(): VideoPost[] {
    const userId = _getAuthenticatedUserId();
    if (!userId) return [];
    
    const db = getDb();
    const likedPostIds = new Set(db.likes.filter(l => l.userId === userId).map(l => l.postId));

    return [...db.posts]
      .filter(p => likedPostIds.has(p.id))
      .reverse();
  },
  
  getPostById(postId: string): VideoPost | undefined {
    const db = getDb();
    return db.posts.find(p => p.id === postId);
  },
  
  getUserPosts(userId: string): VideoPost[] {
    const db = getDb();
    return [...db.posts].filter(p => p.user.id === userId).reverse();
  },

  getCommentsForPost(postId: string): Comment[] {
    const db = getDb();
    const usersById = new Map(db.users.map(u => [u.id, u]));
    
    return db.comments
      .filter(c => c.postId === postId)
      .map(comment => {
        const author = usersById.get(comment.user.id);
        if (!author) return comment; 
        const { password, ...authorToReturn } = author;
        return {
          ...comment,
          user: authorToReturn,
        };
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  getUserStats(userId: string): { following: number; followers: number; likes: number } {
    const db = getDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return { following: 0, followers: 0, likes: 0 };
    }
    const followingCount = db.follows.filter(f => f.followerId === userId).length;
    const followersCount = db.follows.filter(f => f.followingUsername === user.username).length;
    const likesCount = db.posts
      .filter(p => p.user.id === userId)
      .reduce((acc, post) => acc + post.likes, 0);

    return { following: followingCount, followers: followersCount, likes: likesCount };
  },

  getFollowers(userId: string): User[] {
    const db = getDb();
    const targetUser = db.users.find(u => u.id === userId);
    if (!targetUser) return [];

    const followerIds = new Set(
      db.follows
        .filter(f => f.followingUsername === targetUser.username)
        .map(f => f.followerId)
    );

    return db.users
      .filter(u => followerIds.has(u.id))
      .map(user => {
        const { password, ...publicUser } = user;
        return publicUser;
      });
  },

  getFollowing(userId: string): User[] {
    const db = getDb();
    const followingUsernames = new Set(
      db.follows
        .filter(f => f.followerId === userId)
        .map(f => f.followingUsername)
    );
    
    return db.users
      .filter(u => followingUsernames.has(u.username))
      .map(user => {
        const { password, ...publicUser } = user;
        return publicUser;
      });
  },

  // --- Data Mutation ---
  addVideoPost(postData: { caption: string; songName: string; videoUrl: string; thumbnailUrl?: string; mimeType: string | null; }): VideoPost | null {
    const currentUserId = _getAuthenticatedUserId();
    if (!currentUserId) return null;

    const db = getDb();
    const author = db.users.find(u => u.id === currentUserId);
    if (!author) return null;
    const { password, ...authorToReturn } = author;

    const newPost: VideoPost = {
      id: `video-${new Date().toISOString()}`,
      user: authorToReturn,
      caption: postData.caption,
      songName: postData.songName,
      videoUrl: postData.videoUrl,
      thumbnailUrl: postData.thumbnailUrl,
      mimeType: postData.mimeType ?? undefined,
      likes: 0,
      commentsCount: 0,
      shares: 0,
    };
    db.posts.push(newPost);
    saveDb(db);
    return newPost;
  },

  deleteVideoPost(postId: string): { success: boolean, error?: string } {
    const userId = _getAuthenticatedUserId();
    if (!userId) return { success: false, error: 'الجلسة غير صالحة. الرجاء تسجيل الدخول مرة أخرى.' };

    const db = getDb();
    const postIndex = db.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return { success: false, error: 'المنشور غير موجود' };
    }
    const post = db.posts[postIndex];
    if (post.user.id !== userId) {
      return { success: false, error: 'غير مصرح لك بحذف هذا المنشور' };
    }

    db.posts.splice(postIndex, 1);
    db.likes = db.likes.filter(l => l.postId !== postId);
    db.comments = db.comments.filter(c => c.postId !== postId);
    db.views = db.views.filter(v => v.postId !== postId);

    saveDb(db);
    return { success: true };
  },

  addComment(postId: string, text: string): Comment {
    const userId = _getAuthenticatedUserId();
    if (!userId) throw new Error("User not authenticated");

    const db = getDb();
    const author = db.users.find(u => u.id === userId);
    if (!author) throw new Error("Author not found for comment");

    const post = db.posts.find(p => p.id === postId);
    if (!post) throw new Error("Post not found for comment");
    
    const { password, ...authorToReturn } = author;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      postId,
      user: authorToReturn,
      text,
      timestamp: new Date().toISOString(),
    };
    
    db.comments.push(newComment);
    post.commentsCount = (post.commentsCount || 0) + 1;
    
    if (userId !== post.user.id) {
        this._createNotification({
            type: 'comment',
            recipientId: post.user.id,
            actorId: userId,
            postId: post.id,
            commentText: text,
        });
    }

    saveDb(db);
    return newComment;
  },

  logView(postId: string): void {
    const userId = _getAuthenticatedUserId();
    if (!userId) return;

    const db = getDb();
    const alreadyViewed = db.views.some(v => v.userId === userId && v.postId === postId);
    if (!alreadyViewed) {
        db.views.push({ userId, postId, timestamp: Date.now() });
        saveDb(db);
    }
  },

  // --- Interactions ---
  toggleLike(postId: string): { newLikesCount: number, isLiked: boolean } {
    const userId = _getAuthenticatedUserId();
    if (!userId) throw new Error("User not authenticated. Please log in.");
    
    const db = getDb();
    const likeIndex = db.likes.findIndex(l => l.userId === userId && l.postId === postId);
    const post = db.posts.find(p => p.id === postId);
    if (!post) throw new Error("Post not found");

    let isLiked: boolean;
    if (likeIndex > -1) {
      db.likes.splice(likeIndex, 1);
      post.likes = Math.max(0, post.likes - 1);
      isLiked = false;
    } else {
      db.likes.push({ userId, postId });
      post.likes += 1;
      isLiked = true;
      if (userId !== post.user.id) {
        this._createNotification({
            type: 'like',
            recipientId: post.user.id,
            actorId: userId,
            postId: post.id,
        });
      }
    }
    
    saveDb(db);
    return { 
        newLikesCount: post.likes, 
        isLiked, 
    };
  },

  toggleFollow(followingUsername: string): { isFollowing: boolean } {
      const followerId = _getAuthenticatedUserId();
      if (!followerId) throw new Error("User not authenticated. Please log in.");

      const db = getDb();
      const followIndex = db.follows.findIndex(f => f.followerId === followerId && f.followingUsername === followingUsername);
      const followingUser = db.users.find(u => u.username === followingUsername);
      if(!followingUser) throw new Error("User to follow not found");

      let isFollowing: boolean;
      if (followIndex > -1) {
          db.follows.splice(followIndex, 1);
          isFollowing = false;
      } else {
          db.follows.push({ followerId, followingUsername });
          isFollowing = true;
           this._createNotification({
                type: 'follow',
                recipientId: followingUser.id,
                actorId: followerId,
           });
      }
      
      saveDb(db);

      return { 
          isFollowing,
      };
  },

  getInteractions(): { likedVideos: Set<string>, followedUsers: Set<string> } {
      const userId = _getAuthenticatedUserId();
      if (!userId) return { likedVideos: new Set(), followedUsers: new Set() };
      
      const db = getDb();
      const likedVideos = new Set(db.likes.filter(l => l.userId === userId).map(l => l.postId));
      const followedUsers = new Set(db.follows.filter(f => f.followerId === userId).map(f => f.followingUsername));
      return { likedVideos, followedUsers };
  },
  
  // --- Chat & Notifications ---
  _createNotification(data: { type: NotificationType, recipientId: string, actorId: string, postId?: string, commentText?: string, messageText?: string }): void {
      const db = getDb();
      const actor = db.users.find(u => u.id === data.actorId);
      if (!actor || data.recipientId === data.actorId) return;
      
      const { password, ...publicActor } = actor;

      const newNotif: Notification & { recipientId: string } = {
          id: `notif-${Date.now()}`,
          type: data.type,
          user: publicActor,
          post: data.postId ? db.posts.find(p => p.id === data.postId) : undefined,
          commentText: data.commentText,
          timestamp: new Date().toISOString(),
          isRead: false,
          recipientId: data.recipientId,
      };
      
      db.notifications.unshift(newNotif);
      saveDb(db);
  },
  
  getNotifications(): Notification[] {
      const userId = _getAuthenticatedUserId();
      if (!userId) return [];
      const db = getDb();
      return db.notifications
          .filter(n => n.recipientId === userId)
          .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  
  getConversations(): ConversationPreview[] {
    const userId = _getAuthenticatedUserId();
    if (!userId) return [];
    
    const db = getDb();
    const currentUser = db.users.find(u => u.id === userId);
    if (!currentUser) return [];
    
    const allMessages = db.direct_messages.filter(m => m.senderId === userId || m.recipientId === userId);
    const otherUserIds = new Set(allMessages.map(m => m.senderId === userId ? m.recipientId : m.senderId));
    
    // Add mutuals who haven't chatted yet
    const following = new Set(db.follows.filter(f => f.followerId === userId).map(f => f.followingUsername));
    const followers = new Set(db.follows.filter(f => f.followingUsername === currentUser.username).map(f => {
        const followerUser = db.users.find(u => u.id === f.followerId);
        return followerUser?.username;
    }));
    const mutualsUsernames = [...following].filter(u => followers.has(u));
    mutualsUsernames.forEach(username => {
        const mutualUser = db.users.find(u => u.username === username);
        if(mutualUser) otherUserIds.add(mutualUser.id);
    });


    const conversations = Array.from(otherUserIds).map(otherId => {
        const user = db.users.find(u => u.id === otherId);
        if (!user) return null;
        
        const messages = allMessages.filter(
            m => m.senderId === otherId || m.recipientId === otherId
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const lastMessage = messages[0];
        const { password, ...publicUser } = user;
        
        return {
            user: publicUser,
            lastMessage: lastMessage?.text || `ابدأ محادثة مع ${publicUser.username}`,
            timestamp: lastMessage?.timestamp || user.id, // Use user ID for stable sorting of new chats
            isRead: lastMessage ? (lastMessage.senderId === userId || lastMessage.isRead) : true,
        };
    }).filter(Boolean) as ConversationPreview[];
    
    return conversations.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  
  getChatHistory(otherUserId: string): DirectMessage[] {
      const userId = _getAuthenticatedUserId();
      if (!userId) return [];
      
      const db = getDb();
      return db.direct_messages.filter(
          m => (m.senderId === userId && m.recipientId === otherUserId) || (m.senderId === otherUserId && m.recipientId === userId)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },
  
  sendMessage(recipientId: string, text: string): DirectMessage {
      const senderId = _getAuthenticatedUserId();
      if(!senderId) throw new Error("User not authenticated");
      
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
      
       this._createNotification({
            type: 'message',
            recipientId: recipientId,
            actorId: senderId,
            messageText: text,
       });

      saveDb(db);
      return newMessage;
  },
  
  getConversationTheme(otherUserId: string): string | null {
    const userId = _getAuthenticatedUserId();
    if (!userId) return null;
    const db = getDb();
    const conversationId = getConversationId(userId, otherUserId);
    return db.conversation_themes[conversationId] || null;
  },

  setConversationTheme(otherUserId: string, themeClass: string): void {
    const userId = _getAuthenticatedUserId();
    if (!userId) return;
    const db = getDb();
    const conversationId = getConversationId(userId, otherUserId);
    db.conversation_themes[conversationId] = themeClass;
    saveDb(db);
  },

};
