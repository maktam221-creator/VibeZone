import React from 'react';
import type { Screen } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, KeyIcon } from '../components/icons';

interface SecurityScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

const SecurityItem: React.FC<{
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

export const SecurityScreen: React.FC<SecurityScreenProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <button onClick={onBack} aria-label="رجوع">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold mx-auto">الأمان</h1>
        <div className="w-6 h-6"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
            <SecurityItem icon={<KeyIcon />} title="تغيير كلمة المرور" onClick={() => onNavigate('changePassword')} />
        </div>
      </div>
    </div>
  );
};