export interface User {
  username: string;
  name?: string;
  avatarUrl: string;
  bio?: string;
  stats?: {
    following: number;
    followers: number;
    likes: number;
  };
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface VideoPost {
  id: string;
  user: User;
  videoUrl: string;
  caption: string;
  songName: string;
  likes: number;
  comments: Comment[];
  shares: number;
  thumbnailUrl?: string;
  views?: number;
}

export interface LiveStream {
  id: string;
  user: User;
  thumbnailUrl: string;
  title: string;
  viewers: number;
  comments?: Comment[];
}

export type Screen = 'feed' | 'discover' | 'chat' | 'create' | 'live' | 'profile' | 'editProfile' | 'account' | 'privacy' | 'changePassword' | 'generateVideo';

export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

export interface UserMessage {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
}

export interface Conversation {
  id: string;
  user: User;
  messages: UserMessage[];
  unreadCount: number;
}

export type StatsModalType = 'following' | 'followers' | 'likes';