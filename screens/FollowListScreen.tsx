import React from 'react';
import type { User } from '../types';
import { ChevronLeftIcon } from '../components/icons';

interface FollowListScreenProps {
  title: string;
  users: User[];
  currentUser: User;
  followedUsers: Set<string>;
  onBack: () => void;
  onToggleFollow: (username: string) => void;
  onViewProfile: (user: User) => void;
}

const UserItem: React.FC<{
  user: User;
  isFollowing: boolean;
  isCurrentUser: boolean;
  onToggleFollow: () => void;
  onViewProfile: () => void;
}> = ({ user, isFollowing, isCurrentUser, onToggleFollow, onViewProfile }) => {
  return (
    <div className="flex items-center gap-4 p-3">
      <button onClick={onViewProfile} className="flex items-center gap-4 flex-1">
        <img src={user.avatarUrl} alt={user.username} className="w-12 h-12 rounded-full" />
        <div className="text-right">
          <p className="font-bold text-white">@{user.username}</p>
          {user.name && <p className="text-sm text-gray-400">{user.name}</p>}
        </div>
      </button>
      {!isCurrentUser && (
        <button
          onClick={onToggleFollow}
          className={`font-semibold py-1.5 px-4 rounded-lg text-sm transition-colors duration-200 ${
            isFollowing
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-purple-600 hover:bg-purple-500 text-white'
          }`}
        >
          {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
        </button>
      )}
    </div>
  );
};

export const FollowListScreen: React.FC<FollowListScreenProps> = ({
  title,
  users,
  currentUser,
  followedUsers,
  onBack,
  onToggleFollow,
  onViewProfile,
}) => {
  return (
    <div className="h-full flex flex-col bg-black text-white">
      <header className="flex items-center p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10 border-b border-gray-800">
        <button onClick={onBack} aria-label="رجوع">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold mx-auto">{title}</h1>
        <div className="w-6 h-6"></div>
      </header>
      <div className="flex-1 overflow-y-auto">
        {users.length > 0 ? (
          <div className="divide-y divide-gray-800">
            {users.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                isFollowing={followedUsers.has(user.username)}
                isCurrentUser={user.id === currentUser.id}
                onToggleFollow={() => onToggleFollow(user.username)}
                onViewProfile={() => onViewProfile(user)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
            <p className="text-lg font-semibold">القائمة فارغة</p>
            <p className="text-sm">لا يوجد مستخدمون لعرضهم هنا بعد.</p>
          </div>
        )}
      </div>
    </div>
  );
};
