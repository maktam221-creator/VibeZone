import React from 'react';
import { type Screen } from '../types';
import { HomeIcon, ChatIcon, CreateIcon, ProfileIcon, DiscoverIcon } from './icons';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { name: 'الرئيسية', screen: 'feed', icon: HomeIcon },
    { name: 'اكتشف', screen: 'discover', icon: DiscoverIcon },
    { name: 'إنشاء', screen: 'create', icon: CreateIcon },
    { name: 'دردشة', screen: 'chat', icon: ChatIcon },
    { name: 'ملفي', screen: 'profile', icon: ProfileIcon },
  ] as const;

  return (
    <nav className="fixed bottom-0 right-0 left-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => setActiveScreen(item.screen)}
            className="flex flex-col items-center justify-center gap-1 text-sm transition-colors duration-200"
            aria-label={item.name}
          >
            {item.screen === 'create' ? (
              <item.icon />
            ) : (
               <item.icon 
                className={`h-7 w-7 transition-all duration-200 ${activeScreen === item.screen ? 'text-white scale-110' : 'text-gray-400'}`} 
                filled={activeScreen === item.screen}
               />
            )}
            {item.screen !== 'create' && (
                <span className={activeScreen === item.screen ? 'text-white' : 'text-gray-400'}>
                    {item.name}
                </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};