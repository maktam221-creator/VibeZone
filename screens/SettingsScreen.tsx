import React from 'react';
import type { Theme, Screen } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, ShieldIcon, LockIcon, AlertTriangleIcon } from '../components/icons';

interface SettingsScreenProps {
  onBack: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (screen: Screen) => void;
}

const SettingsItem: React.FC<{
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  title: string;
  onClick: () => void;
}> = ({ icon, title, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
    <div className="flex items-center gap-4">
      {React.cloneElement(icon, { className: "w-6 h-6 text-gray-500"})}
      <span className="font-medium">{title}</span>
    </div>
    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
  </button>
);


export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, theme, onToggleTheme, onNavigate }) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <button onClick={onBack} aria-label="رجوع">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold mx-auto">الإعدادات والخصوصية</h1>
        <div className="w-6 h-6"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">الحساب</h2>
          <div className="space-y-2">
            <SettingsItem icon={<ShieldIcon />} title="الأمان" onClick={() => onNavigate('security')} />
            <SettingsItem icon={<LockIcon />} title="الخصوصية" onClick={() => onNavigate('privacy')} />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">العرض</h2>
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <span className="font-medium">المظهر الداكن</span>
              <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="theme-toggle"
                  className="sr-only peer"
                  checked={theme === 'dark'}
                  onChange={onToggleTheme}
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 dark:peer-focus:ring-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

         <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">الدعم</h2>
          <div className="space-y-2">
             <SettingsItem icon={<AlertTriangleIcon />} title="الإبلاغ عن مشكلة" onClick={() => alert('ميزة قيد الإنشاء')} />
          </div>
        </div>
      </div>
    </div>
  );
};