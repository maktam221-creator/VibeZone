import React, { useState } from 'react';
import { ChevronLeftIcon } from '../components/icons';

interface PrivacyScreenProps {
  onBack: () => void;
}

const PrivacyToggle: React.FC<{ title: string; description: string; initialValue?: boolean }> = ({ title, description, initialValue = false }) => {
    const [isEnabled, setIsEnabled] = useState(initialValue);
    
    return (
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <label htmlFor={`toggle-${title}`} className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={`toggle-${title}`}
                  className="sr-only peer"
                  checked={isEnabled}
                  onChange={() => setIsEnabled(prev => !prev)}
                />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 dark:peer-focus:ring-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
        </div>
    );
};

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <button onClick={onBack} aria-label="رجوع">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold mx-auto">الخصوصية</h1>
        <div className="w-6 h-6"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <PrivacyToggle 
            title="حساب خاص"
            description="عندما يكون حسابك خاصًا، يمكن فقط للأشخاص الذين توافق عليهم متابعتك ورؤية فيديوهاتك."
        />
        <PrivacyToggle 
            title="اقتراح حسابك للآخرين"
            description="السماح باقتراح حسابك للأشخاص على VibeZone."
            initialValue={true}
        />
        <PrivacyToggle 
            title="حالة النشاط"
            description="السماح للحسابات التي تتابعها برؤية أنك نشط."
            initialValue={true}
        />
      </div>
    </div>
  );
};