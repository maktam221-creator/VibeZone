import React from 'react';
import { HomeIcon, DiscoverIcon, CreateIcon, InboxIcon, ProfileIcon } from './icons';

const NavItem = ({ label, icon, active = false, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center justify-center text-xs space-y-1 flex-1" aria-label={label}>
    <div className={`${active ? 'text-white' : 'text-gray-400'}`}>{icon}</div>
    <span className={`font-bold ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
  </button>
);


const BottomNav = ({ activeScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-sm flex items-center justify-around z-50 px-2 border-t border-gray-800">
      <NavItem label="الرئيسية" icon={<HomeIcon />} active={activeScreen === 'Home'} onClick={() => onNavigate('Home')} />
      <NavItem label="اكتشف" icon={<DiscoverIcon />} active={activeScreen === 'Discover'} onClick={() => onNavigate('Discover')} />
      <button onClick={() => onNavigate('Create')} aria-label="إنشاء فيديو جديد">
        <CreateIcon />
      </button>
      <NavItem label="صندوق الوارد" icon={<InboxIcon />} active={activeScreen === 'Inbox'} onClick={() => onNavigate('Inbox')} />
      <NavItem label="ملفي" icon={<ProfileIcon />} active={activeScreen === 'Profile'} onClick={() => onNavigate('Profile')} />
    </div>
  );
};

export default BottomNav;
