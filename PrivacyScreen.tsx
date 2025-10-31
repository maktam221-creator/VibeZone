import React, { useState } from 'react';
import { ChevronLeftIcon, UserCheckIcon, EyeOffIcon } from '../components/icons';

const ToggleSwitch: React.FC<{ isEnabled: boolean; onToggle: () => void }> = ({ isEnabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${isEnabled ? 'bg-purple-600' : 'bg-gray-700'}`}
        aria-label={isEnabled ? 'تعطيل' : 'تفعيل'}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

const PrivacyRow: React.FC<{ icon: React.ReactNode; title: string; description: string; isEnabled: boolean; onToggle: () => void; }> = ({ icon, title, description, isEnabled, onToggle }) => (
    <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-4 pr-4">
            {icon}
            <div>
                <p className="text-white font-semibold">{title}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
        <ToggleSwitch isEnabled={isEnabled} onToggle={onToggle} />
    </div>
);


export const PrivacyScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [showActivity, setShowActivity] = useState(true);

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <header className="flex items-center p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
        <button onClick={onBack} aria-label="العودة" className="p-2 -ml-2">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center -ml-6">الخصوصية</h1>
      </header>
       <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase px-4 mb-2">اكتشاف الحساب</h2>
            <div className="bg-gray-900 rounded-lg">
                <PrivacyRow 
                    icon={<UserCheckIcon className="w-6 h-6 text-gray-400 mt-1"/>} 
                    title="حساب خاص" 
                    description="عندما يكون حسابك خاصًا، يمكن فقط للأشخاص الذين توافق عليهم متابعتك ومشاهدة فيديوهاتك."
                    isEnabled={isPrivate}
                    onToggle={() => setIsPrivate(p => !p)}
                />
            </div>
        </div>
        <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase px-4 mb-2">التفاعلات</h2>
            <div className="bg-gray-900 rounded-lg">
                <PrivacyRow 
                    icon={<EyeOffIcon className="w-6 h-6 text-gray-400 mt-1"/>} 
                    title="حالة النشاط" 
                    description="اسمح للآخرين بمعرفة متى تكون نشطًا أو كنت نشطًا مؤخرًا."
                    isEnabled={showActivity}
                    onToggle={() => setShowActivity(p => !p)}
                />
            </div>
        </div>
      </div>
    </div>
  );
};
