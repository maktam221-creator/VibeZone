
import React, { useState } from 'react';
import { GoogleIcon, AppleIcon, ChevronLeftIcon } from '../components/icons'; // Removed XIcon
import { auth } from '../services/firebase'; // Import auth
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'; // Import auth functions

type AuthMode = 'login' | 'register';

interface LoginScreenProps {
  onCancel?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onCancel }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === 'login';

  const toggleMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setError(null);
    setEmail('');
    setPassword('');
    setUsername('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setIsLoading(true);
    try {
      if (mode === 'register') {
          await createUserWithEmailAndPassword(auth, email, password);
          // In a real app, you'd also set the displayName and save user data to Firestore here
      } else {
          await signInWithEmailAndPassword(auth, email, password);
      }
      // The onAuthStateChanged listener in App.tsx will handle the rest
    } catch (err: any) {
      console.error("Authentication error:", err.code);
      switch (err.code) {
        case 'auth/invalid-email':
          setError('البريد الإلكتروني غير صالح.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
          break;
        case 'auth/email-already-in-use':
          setError('هذا البريد الإلكتروني مستخدم بالفعل.');
          break;
        case 'auth/weak-password':
          setError('كلمة المرور ضعيفة جدًا. يجب أن تكون 6 أحرف على الأقل.');
          break;
        case 'auth/operation-not-allowed':
          setError('عملية تسجيل الدخول/الاشتراك عبر البريد الإلكتروني غير مفعّلة. يرجى تفعيلها في إعدادات مشروع Firebase.');
          break;
        default:
          setError('حدث خطأ. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-black text-white p-6 justify-between">
       {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 z-30 bg-black/40 p-2 rounded-full transition-opacity hover:opacity-80"
          aria-label="العودة"
        >
          <ChevronLeftIcon className="w-6 h-6 text-white" />
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            VibeZone
          </h1>
          <p className="text-gray-400 mt-2">
            {isLogin ? 'تسجيل الدخول للمتابعة' : 'أنشئ حسابك واكتشف عالمًا من الفيديوهات'}
          </p>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="username" className="sr-only">اسم المستخدم</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="sr-only">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">كلمة المرور</label>
                <input
                  type="password"
                  id="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-800 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors duration-200 hover:bg-purple-500 disabled:bg-gray-600"
            >
              {isLoading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء حساب')}
            </button>
          </form>

           <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative inline-block px-4 bg-black text-sm text-gray-500">
                    أو تابع باستخدام
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700 transition-colors" aria-label="تسجيل الدخول باستخدام جوجل">
                    <GoogleIcon />
                </button>
                 <button className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gray-700 transition-colors" aria-label="تسجيل الدخول باستخدام آبل">
                    <AppleIcon />
                </button>
            </div>

        </div>
      </div>
      
      <footer className="text-center pb-4">
        <p className="text-sm text-gray-500">
          {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
          <button onClick={toggleMode} className="font-semibold text-purple-400 hover:underline bg-transparent border-none p-0 cursor-pointer">
             {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </button>
        </p>
      </footer>
    </div>
  );
};
