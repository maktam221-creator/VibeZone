
import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { ChevronLeftIcon } from '../components/icons';

// FIX: Made `name` a required property in the user and onSave callback types.
// The component always receives a user with a name, and the parent component expects
// an updated user with a name, so this change fixes the type mismatch.
interface EditProfileScreenProps {
  user: User & { name: string; bio: string; stats: { following: number; followers: number; likes: number; } };
  onSave: (updatedUser: User & { name: string; bio: string; stats: { following: number; followers: number; likes: number; } }) => void;
  onCancel: () => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onSave, onCancel }) => {
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [username, setUsername] = useState(user.username);
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave({
      ...user,
      avatarUrl: avatar,
      username,
      name,
      bio,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="h-full bg-black text-white flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
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
          <button onClick={triggerFileSelect} className="text-sm font-semibold text-purple-400">
            تغيير الصورة
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-800 pb-2">
            <label className="text-sm text-gray-400">اسم المستخدم</label>
            <input 
              type="text"
              value={`@${username}`}
              onChange={(e) => setUsername(e.target.value.replace('@', ''))}
              className="w-full bg-transparent text-white pt-1 focus:outline-none"
            />
          </div>
          <div className="border-b border-gray-800 pb-2">
            <label className="text-sm text-gray-400">الاسم</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-white pt-1 focus:outline-none"
            />
          </div>
          <div className="border-b border-gray-800 pb-2">
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
