import React from 'react';
import { HomeIcon, DiscoverIcon, CreateIcon, InboxIcon, ProfileIcon } from './icons';

const NavItem = ({ label, icon, active = false }) => (
  <button className="flex flex-col items-center justify-center text-xs space-y-1 flex-1">
    <div className={`${active ? 'text-white' : 'text-gray-400'}`}>{icon}</div>
    <span className={`font-bold ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
  </button>
);


const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black flex items-center justify-around z-50 px-2">
      <NavItem label="الرئيسية" icon={<HomeIcon />} active={true} />
      <NavItem label="اكتشف" icon={<DiscoverIcon />} />
      <CreateIcon />
      <NavItem label="صندوق الوارد" icon={<InboxIcon />} />
      <NavItem label="ملفي" icon={<ProfileIcon />} />
    </div>
  );
};

export default BottomNav;
