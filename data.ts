import type { Video } from './types';

export const videos: Video[] = [
  {
    id: 1,
    user: {
      name: '@مستكشف_الطبيعة',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    caption: 'استكشاف الطبيعة الخلابة 🌳 #سفر #طبيعة #مغامرة',
    likes: 12345,
    comments: 2,
    shares: 176,
    commentsList: [
      { id: 101, user: '@أحمد', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', text: 'منظر رائع! أين هذا المكان؟', timestamp: 'منذ 5 دقائق' },
      { id: 102, user: '@فاطمة', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026709d', text: 'جميل جداً! 💖', timestamp: 'منذ 10 دقائق' },
    ],
  },
  {
    id: 2,
    user: {
      name: '@صانع_السعادة',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    },
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    caption: 'لحظات من المرح والسعادة 🎉 #ضحك #سعادة #أصدقاء',
    likes: 54321,
    comments: 1,
    shares: 832,
    commentsList: [
      { id: 201, user: '@خالد', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026710d', text: 'أجواء رائعة!', timestamp: 'منذ ساعة' },
    ],
  },
  {
    id: 3,
    user: {
      name: '@عاشق_السرعة',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    },
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
    caption: 'جولة سريعة في السيارة 🚗 #سيارات #سرعة #قيادة',
    likes: 23456,
    comments: 0,
    shares: 211,
    commentsList: [],
  },
    {
    id: 4,
    user: {
      name: '@صانع_الأفلام',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    },
    src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    poster: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
    caption: 'مشهد درامي مؤثر 😢 #فيلم #دراما #تمثيل',
    likes: 98765,
    comments: 3,
    shares: 1500,
    commentsList: [
      { id: 401, user: '@علي', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026711d', text: 'أداء مذهل!', timestamp: 'منذ 30 دقيقة' },
      { id: 402, user: '@منى', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026712d', text: 'مؤثر جداً.', timestamp: 'منذ 45 دقيقة' },
      { id: 403, user: '@سعيد', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026713d', text: '👍👍👍', timestamp: 'منذ ساعتين' },
    ],
  },
];
