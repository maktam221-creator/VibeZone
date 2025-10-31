
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon } from '../components/icons';

interface ChangePasswordScreenProps {
    onBack: () => void;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ onBack }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        setCanSubmit(currentPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0);
        if(newPassword !== confirmPassword && confirmPassword.length > 0) {
            setError('كلمتا المرور الجديدتان غير متطابقتين.');
        } else {
            setError('');
        }
    }, [currentPassword, newPassword, confirmPassword]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if(!canSubmit || error) return;
        
        if(newPassword.length < 8) {
             setError('يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل.');
             return;
        }

        // In a real app, you would make an API call here
        alert('تم تحديث كلمة المرور بنجاح!');
        onBack();
    };

  return (
    <div className="flex flex-col h-full bg-black text-white">
      <header className="flex items-center p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
        <button onClick={onBack} aria-label="العودة" className="p-2 -ml-2">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center -ml-6">تغيير كلمة المرور</h1>
      </header>
       <form onSubmit={handleSave} className="flex-1 flex flex-col p-4">
        <div className="space-y-6">
            <div>
                 <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    كلمة المرور الحالية
                </label>
                <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>
             <div>
                 <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    كلمة المرور الجديدة
                </label>
                <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>
             <div>
                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    تأكيد كلمة المرور الجديدة
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
         <div className="mt-auto pt-6">
            <button
                type="submit"
                disabled={!canSubmit || !!error}
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
            >
                حفظ التغييرات
            </button>
        </div>
       </form>
    </div>
  );
};
