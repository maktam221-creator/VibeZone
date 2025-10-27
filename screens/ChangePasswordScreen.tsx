import React, { useState } from 'react';
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from '../components/icons';

interface ChangePasswordScreenProps {
  onBack: () => void;
  onChangePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ onBack, onChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setError(null);
        setSuccess(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('الرجاء ملء جميع الحقول.');
            return;
        }
        if (newPassword.length < 6) {
            setError('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('كلمتا المرور الجديدتان غير متطابقتين.');
            return;
        }

        setIsLoading(true);
        const result = await onChangePassword(currentPassword, newPassword);
        setIsLoading(false);

        if (result.success) {
            setSuccess('تم تغيير كلمة المرور بنجاح!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPassword(false);
            setTimeout(() => {
                onBack();
            }, 1500);
        } else {
            setError(result.error || 'حدث خطأ غير متوقع.');
        }
    };

    return (
        <div className="h-full bg-black text-white flex flex-col">
            <header className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
                <button onClick={onBack} aria-label="رجوع">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">تغيير كلمة المرور</h1>
                <button 
                    onClick={handleSave} 
                    disabled={isLoading}
                    className="font-semibold text-purple-400 hover:text-purple-300 transition-colors disabled:text-gray-500"
                >
                    {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm text-gray-400" htmlFor="current-pass">كلمة المرور الحالية</label>
                        <input
                            id="current-pass"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-gray-900 text-white rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                     <div>
                        <label className="text-sm text-gray-400" htmlFor="new-pass">كلمة المرور الجديدة</label>
                        <div className="relative mt-1">
                            <input
                                id="new-pass"
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-gray-900 text-white rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                             <button 
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400 hover:text-white"
                                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm text-gray-400" htmlFor="confirm-pass">تأكيد كلمة المرور الجديدة</label>
                         <div className="relative mt-1">
                            <input
                                id="confirm-pass"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-gray-900 text-white rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-400 hover:text-white"
                                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            >
                                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center mt-4">{success}</p>}
            </div>
        </div>
    );
};