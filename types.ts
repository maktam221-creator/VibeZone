export interface User {
  id: string;
  username: string;
  name?: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  bio?: string;
  deactivatedUntil?: string; // ISO string
}

export interface VideoPost {
  id: string;
  user: User;
  videoUrl: string; // Placeholder for video source/color
  thumbnailUrl?: string; // For video thumbnails to improve performance
  mimeType?: string; // To distinguish between video and image blob URLs
  caption: string;
  songName: string;
  likes: number;
  commentsCount: number;
  shares: number;
}

export interface ConversationPreview {
  user: User;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'message';

export interface Notification {
  id: string;
  type: NotificationType;
  user: User;
  post?: VideoPost;
  commentText?: string; // For comment
  timestamp: string; // ISO String
  isRead: boolean;
}


export type Screen = 'feed' | 'discover' | 'create' | 'inbox' | 'profile' | 'userProfile' | 'settings' | 'security' | 'changePassword' | 'notifications' | 'conversation' | 'chatTheme' | 'privacy' | 'followList' | 'live' | 'ai_chat';

export type FeedTab = 'foryou' | 'following';

export interface Comment {
  id: string;
  postId: string;
  user: User;
  text: string;
  timestamp: string; // ISO String
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

export interface DirectMessage {
    id: string;
    senderId: string;
    recipientId: string;
    text: string;
    timestamp: string; // ISO String
    isRead: boolean;
}

export type Theme = 'light' | 'dark';

export interface LiveComment {
  id: string;
  user: {
    username: string;
    avatarUrl: string;
  };
  text: string;
}