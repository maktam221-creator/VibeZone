export interface User {
  name: string;
  avatar: string;
}

export interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Video {
  id: number;
  user: User;
  src: string;
  poster: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  commentsList: Comment[];
}
