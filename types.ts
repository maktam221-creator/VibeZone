export interface VideoItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  user: {
    username: string;
    avatar: string;
  };
  description: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  website: string;
  stats: {
    followers: number;
    following: number;
    likes: number;
  };
  videos: VideoItem[];
}
