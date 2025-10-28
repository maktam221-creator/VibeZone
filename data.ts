import { Video } from './types';

export const videos: Video[] = [
  {
    id: '1',
    user: {
      username: 'creative_coder',
      avatarUrl: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-in-a-floral-summery-dress-walking-on-a-b-4029-large.mp4',
    description: 'Enjoying the summer breeze and beautiful flowers! 🌸 #summer #nature #flowers',
    songTitle: 'Upbeat Summer Pop - Mixkit',
    stats: {
      likes: 12300,
      comments: 456,
      shares: 789,
    },
  },
  {
    id: '2',
    user: {
      username: 'travel_junkie',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-trip-on-a-ferry-in-the-sea-near-a-port-31140-large.mp4',
    description: 'Exploring the world one city at a time. This view is breathtaking! 🌊 #travel #adventure #sea',
    songTitle: 'Ocean Waves - Nature Sounds',
    stats: {
      likes: 54200,
      comments: 1200,
      shares: 2300,
    },
  },
  {
    id: '3',
    user: {
      username: 'art_by_jane',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-artist-working-on-a-painting-in-her-studio-3883-large.mp4',
    description: 'Lost in the colors. A little glimpse into my creative process. 🎨 #art #painting #creative',
    songTitle: 'Inspiring Piano - Royalty Free',
    stats: {
      likes: 98700,
      comments: 3400,
      shares: 5600,
    },
  },
   {
    id: '4',
    user: {
      username: 'urban_explorer',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    },
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-times-square-in-the-afternoon-4251-large.mp4',
    description: 'The city that never sleeps. The energy is unreal! 🌃 #citylife #newyork #timessquare',
    songTitle: 'City Pop Beat - Lofi',
    stats: {
      likes: 250000,
      comments: 8900,
      shares: 12000,
    },
  },
];
