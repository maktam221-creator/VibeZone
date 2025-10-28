export interface User {
  username: string;
  avatarUrl: string;
}

export interface Video {
  id: string;
  user: User;
  videoUrl: string;
  description: string;
  songTitle: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
}
