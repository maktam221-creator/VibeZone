
import React from 'react';
import { ChevronLeftIcon, MailIcon, PhoneIcon, KeyIcon, LogoutIcon } from '../components/icons';
import type { User } from '../types';

interface AccountScreenProps {
  user: User;
  onBack: () => void;
  onNavigate: (screen: 'changePassword') => void;
  onLogout: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-4 rounded-lg">
        <div className="flex items-center gap-4">
            {icon}
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-white font-semibold">{value}</p>
            </div>
        </div>
    </div>
);


export const AccountScreen: React.FC<AccountScreenProps> = ({ user, onBack, onNavigate, onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-black text-white">
      <header className="flex items-center p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
        <button onClick={onBack} aria-label="العودة" className="p-2 -ml-2">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center -ml-6">الحساب</h1>
      </header>
      <div className="flex-1 flex flex-col p-4">
        <div className="space-y-6">
            <div>
                <h2 className="text-xs font-bold text-gray-500 uppercase px-4 mb-2">معلومات الحساب</h2>
                <div className="bg-gray-900 rounded-lg">
                    <InfoRow icon={<PhoneIcon className="w-6 h-6 text-gray-400"/>} label="رقم الهاتف" value="لم يتم الربط" />
                    <div className="h-px bg-gray-800 mx-4"></div>
                    <InfoRow icon={<MailIcon className="w-6 h-6 text-gray-400"/>} label="البريد الإلكتروني" value="user@example.com" />
                </div>
            </div>
            <div>
                <h2 className="text-xs font-bold text-gray-500 uppercase px-4 mb-2">الأمان</h2>
                <div className="bg-gray-900 rounded-lg">
                    <button onClick={() => onNavigate('changePassword')} className="flex items-center justify-between w-full p-4 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <KeyIcon className="w-6 h-6 text-gray-400"/>
                            <p className="text-white font-semibold">تغيير كلمة المرور</p>
                        </div>
                        <ChevronLeftIcon className="w-5 h-5 text-gray-500 transform rotate-180" />
                    </button>
                </div>
            </div>
        </div>
        <div className="mt-auto pt-6">
            <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-transparent text-red-400 font-semibold py-3 rounded-lg border border-red-400/50 hover:bg-red-400/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-red-500"
            >
                <LogoutIcon className="w-5 h-5" />
                <span>تسجيل الخروج</span>
            </button>
        </div>
      </div>
    </div>
  );
};
