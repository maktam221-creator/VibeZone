import React from 'react';
import { HomeIcon, DiscoverIcon, CreateIcon, InboxIcon, ProfileIcon } from './icons';

const BottomNav = () => {
  const navItems = [
    { icon: <HomeIcon />, label: 'Home' },
    { icon: <DiscoverIcon />, label: 'Discover' },
    { icon: <CreateIcon className="bg-white text-black" />, label: 'Create' },
    { icon: <InboxIcon />, label: 'Inbox' },
    { icon: <ProfileIcon />, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-black flex justify-around items-center z-20">
      {navItems.map((item, index) => (
        <button key={index} className="flex flex-col items-center justify-center text-xs font-semibold text-gray-400">
          {item.label === 'Create' ? (
             <div className="w-12 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-cyan-400 to-pink-500 p-0.5">
                <div className="bg-white w-full h-full rounded-md flex items-center justify-center">
                    <CreateIcon className="text-black" />
                </div>
            </div>
          ) : (
            <>
              <div className={item.label === 'Home' ? 'text-white' : ''}>
                {item.icon}
              </div>
              <span className={`mt-1 ${item.label === 'Home' ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </>
          )}
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
