import React, { useState } from 'react';
import type { Screen, User, VideoPost, LiveStream, Conversation } from './types';
import { mockVideos, initialUser, mockConversations } from './data';

function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('feed');
  const [currentUser] = useState<User>(initialUser);
  const [videos] = useState<VideoPost[]>(mockVideos);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'feed':
        return (
          <div className="h-full p-4">
            <h1 className="text-2xl font-bold mb-4">الفيديوات</h1>
            <div className="space-y-4">
              {videos.map(video => (
                <div key={video.id} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <img src={video.user.avatarUrl} alt={video.user.username} className="w-8 h-8 rounded-full mr-2" />
                    <span className="font-bold">{video.user.username}</span>
                  </div>
                  <p>{video.caption}</p>
                  <div className="flex justify-between mt-2 text-gray-400">
                    <span>❤️ {video.likes}</span>
                    <span>💬 {video.comments.length}</span>
                    <span>↗️ {video.shares}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <h1 className="text-2xl font-bold">شاشة {activeScreen}</h1>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white">
      <main className="h-full pb-16">
        {renderScreen()}
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700">
        <div className="flex justify-around p-3">
          {(['feed', 'discover', 'create', 'chat', 'profile'] as Screen[]).map(screen => (
            <button
              key={screen}
              onClick={() => setActiveScreen(screen)}
              className={`p-2 rounded-lg ${
                activeScreen === screen ? 'bg-blue-600' : 'bg-transparent'
              }`}
            >
              {screen === 'feed' && '🏠'}
              {screen === 'discover' && '🔍'}
              {screen === 'create' && '➕'}
              {screen === 'chat' && '💬'}
              {screen === 'profile' && '👤'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;