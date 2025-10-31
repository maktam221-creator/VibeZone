import type { VideoPost, LiveStream, Comment, User, Conversation } from './types';

export const mockVideos: VideoPost[] = [
  {
    id: '1',
    user: { username: 'نور', name: 'نور', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    videoUrl: 'https://videos.pexels.com/video-files/4690326/4690326-hd_1080_1920_25fps.mp4',
    caption: 'أجواء خيالية في الصحراء! ✨ #سفر #مغامرة',
    songName: 'موسيقى تصويرية - فنان غير معروف',
    likes: 12300,
    comments: [],
    shares: 789,
    views: 150000,
  },
  {
    id: '2',
    user: { username: 'شيف_علي', name: 'علي', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    videoUrl: 'https://videos.pexels.com/video-files/4784400/4784400-hd_1080_1920_25fps.mp4',
    caption: 'أسرع وصفة حلى ممكن تجربوها 😋 #طبخ #وصفات',
    songName: 'إيقاع شرقي - موسيقى',
    likes: 34500,
    comments: [],
    shares: 2345,
    views: 450000,
  },
    {
    id: '3',
    user: { username: 'قطط_كيوت', name: 'قطط كيوت', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    videoUrl: 'https://videos.pexels.com/video-files/7578535/7578535-hd_1080_1920_30fps.mp4',
    caption: 'عندما يقرر القط أن يصبح بطل الفيلم 😹 #حيوانات #قطط',
    songName: 'Funny Song - Bensound',
    likes: 89100,
    comments: [],
    shares: 9101,
    views: 1200000,
  },
];

export const initialUser = {
  username: 'نور',
  name: 'نور العبدالله',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  bio: '✨ أعيش الحياة بإيجابية | 📸 تصوير | ✈️ سفر',
  stats: {
    following: 150,
    followers: 125000,
    likes: 1200000,
  },
};

const mockUsers: User[] = [
    { username: 'أحمد', avatarUrl: 'https://i.pravatar.cc/150?u=user1' },
    { username: 'فاطمة', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
    { username: 'سعيد', avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
    { username: 'مريم', avatarUrl: 'https://i.pravatar.cc/150?u=user4' },
];

const mockComments: Comment[] = [
    { id: 'c1', user: mockUsers[0], text: 'بث رائع!', timestamp: new Date().toISOString() },
    { id: 'c2', user: mockUsers[1], text: 'مرحبا 👋', timestamp: new Date().toISOString() },
    { id: 'c3', user: mockUsers[2], text: 'استمر يا بطل', timestamp: new Date().toISOString() },
    { id: 'c4', user: mockUsers[3], text: 'محتوى جميل جدا', timestamp: new Date().toISOString() },
];


export const mockStreams: LiveStream[] = [
  {
    id: '1',
    user: { username: 'خالد_جيمنج', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    thumbnailUrl: 'bg-gradient-to-br from-red-500 to-orange-500',
    title: 'بث مباشر للعبة جديدة!',
    viewers: 7200,
    comments: mockComments.slice(0, 2)
  },
  {
    id: '2',
    user: { username: 'فنون_الطبخ', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    thumbnailUrl: 'bg-gradient-to-br from-green-400 to-teal-500',
    title: 'نتعلم وصفة الكيك اليوم',
    viewers: 3400,
    comments: mockComments.slice(2, 4)
  },
   {
    id: '3',
    user: { username: 'سارة_فلوق', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
    thumbnailUrl: 'bg-gradient-to-br from-pink-500 to-purple-600',
    title: 'سهرة أسئلة وأجوبة',
    viewers: 12500,
    comments: mockComments.slice(1, 3)
  },
   {
    id: '4',
    user: { username: 'مبرمج_العرب', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' },
    thumbnailUrl: 'bg-gradient-to-br from-blue-700 to-gray-900',
    title: 'بناء تطبيق مباشر',
    viewers: 980,
    comments: [mockComments[0], mockComments[3]]
  },
];

export const mockChatUsers: User[] = [
    { username: 'أحمد', name: 'أحمد صالح', avatarUrl: 'https://i.pravatar.cc/150?u=user1' },
    { username: 'فاطمة', name: 'فاطمة علي', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
    { username: 'سارة_فلوق', name: 'سارة', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

export const mockConversations: Conversation[] = [
    {
        id: 'conv1',
        user: mockChatUsers[0],
        unreadCount: 2,
        messages: [
            { id: 'm1-1', senderId: 'أحمد', text: 'أهلاً! كيف الحال؟', timestamp: '2024-05-20T10:00:00Z' },
            { id: 'm1-2', senderId: 'نور', text: 'أهلاً أحمد، أنا بخير الحمد لله. وأنت؟', timestamp: '2024-05-20T10:01:00Z' },
            { id: 'm1-3', senderId: 'أحمد', text: 'بخير. شاهدت الفيديو الجديد الذي نشرته، رائع جداً!', timestamp: '2024-05-20T10:02:00Z' },
            { id: 'm1-4', senderId: 'أحمد', text: 'هل أنت متفرغ اليوم؟', timestamp: '2024-05-20T10:02:15Z' },
        ],
    },
    {
        id: 'conv2',
        user: mockChatUsers[1],
        unreadCount: 0,
        messages: [
            { id: 'm2-1', senderId: 'فاطمة', text: 'السلام عليكم', timestamp: '2024-05-19T15:30:00Z' },
            { id: 'm2-2', senderId: 'نور', text: 'وعليكم السلام ورحمة الله', timestamp: '2024-05-19T15:31:00Z' },
        ],
    },
    {
        id: 'conv3',
        user: mockChatUsers[2],
        unreadCount: 0,
        messages: [
            { id: 'm3-1', senderId: 'سارة_فلوق', text: 'فكرة البث المباشر القادم ستكون مذهلة!', timestamp: '2024-05-20T08:00:00Z' },
        ],
    },
];

const allMockUsers: User[] = [
  ...mockVideos.map(v => v.user),
  initialUser,
  ...mockUsers,
  ...mockStreams.map(s => s.user),
  ...mockChatUsers,
];

// Deduplicate users by username
const uniqueUsers = new Map<string, User>();
allMockUsers.forEach(user => {
  if (!uniqueUsers.has(user.username)) {
    uniqueUsers.set(user.username, {
        username: user.username,
        name: user.name || user.username,
        avatarUrl: user.avatarUrl
    });
  }
});

export const mockAllUsers: User[] = Array.from(uniqueUsers.values());