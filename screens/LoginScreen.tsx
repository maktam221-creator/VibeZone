import React, { useState } from 'react';
import { XIcon, GoogleIcon, AppleIcon } from '../components/icons';
import { api } from '../services/apiService';
import type { User } from '../types';
import { Logo } from '../components/Logo';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onCancel: () => void;
}

type AuthMode = 'login' | 'signup';
type LoginMethod = 'email' | 'phone';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onCancel }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setUsername('');
    setEmailOrPhone('');
    setPassword('');
    setError(null);
  };

  const handleLoginMethodChange = (method: LoginMethod) => {
    setLoginMethod(method);
    setEmailOrPhone(''); // Clear input on method change for better UX
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let result;
    if (authMode === 'login') {
      result = api.login(emailOrPhone, password, rememberMe);
    } else {
      // Signup always "remembers" the user
      result = api.signup(username, emailOrPhone, password);
    }

    if (result.user) {
      onLoginSuccess(result.user);
    } else {
      setError(result.error);
    }
  };
  
  const renderFormView = () => (
     <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-8">
            <Logo />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8 text-white dark:text-white">
            {authMode === 'login' ? 'تسجيل الدخول إلى VibeZone' : 'إنشاء حساب جديد'}
        </h2>
        
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
               {authMode === 'signup' && (
                <div>
                  <label htmlFor="username" className="sr-only">اسم المستخدم</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="اسم المستخدم"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-800 dark:bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
                
                {authMode === 'signup' && (
                    <div className="flex bg-gray-800 dark:bg-gray-800 rounded-lg p-1">
                        <button type="button" onClick={() => handleLoginMethodChange('email')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${loginMethod === 'email' ? 'bg-gray-700 dark:bg-gray-700 text-white' : 'text-gray-400 dark:text-gray-400'}`}>البريد الإلكتروني</button>
                        <button type="button" onClick={() => handleLoginMethodChange('phone')} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${loginMethod === 'phone' ? 'bg-gray-700 dark:bg-gray-700 text-white' : 'text-gray-400 dark:text-gray-400'}`}>الهاتف</button>
                    </div>
                )}

                <div>
                  <label htmlFor="emailOrPhone" className="sr-only">{loginMethod === 'email' ? 'البريد الإلكتروني' : 'رقم الهاتف'}</label>
                  <input
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    id="emailOrPhone"
                    placeholder={authMode === 'login' ? 'البريد الإلكتروني أو الهاتف' : (loginMethod === 'email' ? 'البريد الإلكتروني' : 'رقم الهاتف')}
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full bg-gray-800 dark:bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              <div>
                <label htmlFor="password" className="sr-only">كلمة المرور</label>
                <input
                  type="password"
                  id="password"
                  placeholder="كلمة المرور"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 dark:bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            {authMode === 'login' && (
              <div className="flex items-center justify-between mt-4">
                <label htmlFor="rememberMe" className="flex items-center text-sm text-gray-400 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="mr-2">تذكرني</span>
                </label>
              </div>
            )}
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors duration-200 hover:bg-purple-500"
            >
              {authMode === 'login' ? 'متابعة' : 'إنشاء حساب'}
            </button>
          </form>

            <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">أو</span>
                <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <div className="space-y-3">
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <GoogleIcon className="w-6 h-6" />
                    <span>متابعة باستخدام جوجل</span>
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <AppleIcon className="w-6 h-6" />
                    <span>متابعة باستخدام آبل</span>
                </button>
            </div>

            <div className="text-center mt-6">
                <p className="text-gray-400 dark:text-gray-400 text-sm">
                    {authMode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
                    <button 
                        onClick={() => {
                          setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
                          resetForm();
                        }}
                        className="font-semibold text-purple-400 hover:underline"
                    >
                        {authMode === 'login' ? 'إنشاء حساب' : 'تسجيل الدخول'}
                    </button>
                </p>
            </div>
     </div>
  );


  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <div className="w-full bg-gray-900 dark:bg-gray-900 rounded-t-2xl flex flex-col h-[95vh] max-h-[700px] animate-slide-up relative">
            
            <div className="absolute top-4 left-4 z-10">
                <button 
                    onClick={onCancel} 
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700" 
                    aria-label="إغلاق"
                >
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center overflow-y-auto px-6 pt-12">
                {renderFormView()}
            </div>
            
            <footer className="text-center pb-6 pt-4 px-6">
                <p className="text-xs text-gray-500 dark:text-gray-500 max-w-sm mx-auto">
                    بالاستمرار، فإنك توافق على شروط الخدمة الخاصة بنا وتقر بأنك قرأت سياسة الخصوصية.
                </p>
            </footer>
        </div>
    </div>
  );
};