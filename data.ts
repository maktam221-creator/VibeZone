import { UserProfile, VideoItem } from './types';

export const mockVideos: VideoItem[] = [
  { 
    id: '1', 
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    user: { username: '@user1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    description: 'قصة رائعة عن أرنب شجاع في مغامرة مثيرة',
    likesCount: 12345,
    commentsCount: 1234,
    sharesCount: 567,
  },
  { 
    id: '2', 
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    user: { username: '@user2', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }, 
    description: 'حلم فيل، قصة خيالية عن عالم غريب ومدهش',
    likesCount: 890,
    commentsCount: 112,
    sharesCount: 45,
  },
  { 
    id: '3', 
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    user: { username: '@user3', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' }, 
    description: 'مغامرة مشوقة جداً في الغابة مع أصدقاء جدد',
    likesCount: 23456,
    commentsCount: 2300,
    sharesCount: 812,
  },
    { 
    id: '4', 
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    user: { username: '@user1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    description: 'خطة هروب ذكية ومبتكرة',
    likesCount: 9876,
    commentsCount: 456,
    sharesCount: 123,
  },
   { 
    id: '5', 
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    user: { username: '@user1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    description: 'لحظات من المرح والسعادة التي لا تنسى',
    likesCount: 54321,
    commentsCount: 3456,
    sharesCount: 987,
  },
  { 
    id: '6', 
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    user: { username: '@user1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    description: 'جولة بالسيارة مع مناظر طبيعية خلابة',
    likesCount: 11223,
    commentsCount: 888,
    sharesCount: 444,
  }
];

export const mockUserProfile: UserProfile = {
  id: '1',
  username: '@user1',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  bio: 'صانع محتوى | أحب استكشاف العالم ومشاركة القصص القصيرة 🌍✨',
  website: 'https://user1.example.com',
  stats: {
    followers: 125000,
    following: 250,
    likes: 1200000
  },
  videos: mockVideos.filter(v => v.user.username === '@user1'),
};
