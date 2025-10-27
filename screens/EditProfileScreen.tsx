import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { ChevronLeftIcon } from '../components/icons';

interface EditProfileScreenProps {
  user: User & { bio?: string };
  onSave: (updatedData: { name?: string, username?: string, bio?: string, avatarUrl?: string }) => void;
  onCancel: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error || new Error('An unknown error occurred while reading the file.'));
    });
};


export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onSave, onCancel }) => {
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleSave = () => {
    setError(null);
    const updates: { name?: string, username?: string, bio?: string, avatarUrl?: string } = {};

    if (name !== user.name) updates.name = name;
    if (username !== user.username) updates.username = username;
    if (bio !== user.bio) updates.bio = bio;
    if (avatar !== user.avatarUrl) updates.avatarUrl = avatar;

    if (Object.keys(updates).length > 0) {
      onSave(updates);
    } else {
      onCancel(); // No changes were made
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
      if (file.size > MAX_FILE_SIZE) {
        setError('حجم الصورة كبير جداً. الرجاء اختيار ملف أصغر من 1 ميجابايت.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('الرجاء اختيار ملف صورة صالح.');
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setAvatar(base64);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'حدث خطأ غير متوقع.';
        setError(`حدث خطأ أثناء معالجة الصورة: ${message}`);
      }
    }
  };

  return (
    <div className="h-full bg-black text-white flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-800 dark:border-gray-800 sticky top-0 bg-black z-10">
        <button onClick={onCancel} aria-label="إلغاء">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">تعديل الملف الشخصي</h1>
        <button onClick={handleSave} className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
          حفظ
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center gap-4 mb-8">
          <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-purple-400">
            تغيير الصورة
          </button>
        </div>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <div className="space-y-6">
          <div className="border-b border-gray-700 pb-2">
            <label className="text-sm text-gray-400">اسم المستخدم</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))}
              className="w-full bg-transparent text-white pt-1 focus:outline-none"
            />
          </div>
          <div className="border-b border-gray-700 pb-2">
            <label className="text-sm text-gray-400">الاسم</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-white pt-1 focus:outline-none"
            />
          </div>
          <div className="border-b border-gray-700 pb-2">
            <label className="text-sm text-gray-400">النبذة التعريفية</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-transparent text-white pt-1 resize-none focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};