import React, { useState, useEffect } from 'react';
import type { Notification } from '../types';
import { api } from '../services/apiService';
import { ChevronLeftIcon, HeartIcon, CommentIcon, ProfileIcon, MessageIcon } from '../components/icons';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    
    const getIcon = () => {
        switch (notification.type) {
            case 'like':
                return <HeartIcon className="w-5 h-5 text-red-500" fill="currentColor" />;
            case 'comment':
                return <CommentIcon className="w-5 h-5 text-blue-500" fill="currentColor" />;
            case 'follow':
                return <ProfileIcon className="w-5 h-5 text-purple-500" />;
            case 'message':
                 return <MessageIcon className="w-5 h-5 text-green-500" />;
            default:
                return null;
        }
    };
    
    const getText = () => {
        switch (notification.type) {
            case 'like':
                return <><span className="font-bold">{notification.user.username}</span> أعجب بفيديو لك.</>;
            case 'comment':
                return <><span className="font-bold">{notification.user.username}</span> علق: "{notification.commentText}"</>;
            case 'follow':
                return <><span className="font-bold">{notification.user.username}</span> بدأ بمتابعتك.</>;
            case 'message':
                return <><span className="font-bold">{notification.user.username}</span> أرسل لك رسالة جديدة.</>;
            default:
                return '';
        }
    }
    
    const timeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `قبل ${Math.floor(interval)} سنة`;
        interval = seconds / 2592000;
        if (interval > 1) return `قبل ${Math.floor(interval)} شهر`;
        interval = seconds / 86400;
        if (interval > 1) return `قبل ${Math.floor(interval)} يوم`;
        interval = seconds / 3600;
        if (interval > 1) return `قبل ${Math.floor(interval)} ساعة`;
        interval = seconds / 60;
        if (interval > 1) return `قبل ${Math.floor(interval)} دقيقة`;
        return `قبل ${Math.floor(seconds)} ثانية`;
    };

    const PostThumbnail: React.FC<{ post?: { videoUrl: string, thumbnailUrl?: string, caption: string } }> = ({ post }) => {
        if (!post) return null;
        const displayUrl = post.thumbnailUrl || post.videoUrl;
        
        if (displayUrl.startsWith('archived:')) {
            return <div className="w-12 h-12 rounded-md flex-shrink-0 bg-gray-800 flex items-center justify-center text-xs text-gray-400">🗄️</div>;
        }
        if (displayUrl.startsWith('data:image/')) {
            return <img src={displayUrl} alt={post.caption} className="w-12 h-12 rounded-md flex-shrink-0 object-cover" />;
        }
        if (displayUrl.startsWith('data:video/')) { // Fallback if thumbnail fails
            return <video src={displayUrl} muted className="w-12 h-12 rounded-md flex-shrink-0 object-cover" />;
        }
        return <div className={`w-12 h-12 rounded-md flex-shrink-0 ${post.videoUrl}`}></div>;
    };
    
    return (
        <div className={`flex items-center gap-3 p-3 transition-colors cursor-pointer ${notification.isRead ? 'hover:bg-gray-900' : 'bg-purple-900/20 hover:bg-purple-900/30'}`}>
            <div className="relative flex-shrink-0">
                 <img src={notification.user.avatarUrl} alt={notification.user.username} className="w-12 h-12 rounded-full" />
                 <div className="absolute -bottom-1 -right-1 bg-gray-800 p-0.5 rounded-full">
                    {getIcon()}
                 </div>
            </div>
             <div className="flex-1 text-sm">
                <p className="text-white">{getText()}</p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(notification.timestamp)}</p>
             </div>
             {notification.type !== 'message' && notification.type !== 'follow' && <PostThumbnail post={notification.post} /> }
        </div>
    );
};


export const NotificationsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = () => {
            setIsLoading(true);
            try {
                const notifs = api.getNotifications();
                setNotifications(notifs);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="space-y-2 animate-pulse p-2">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3">
                           <div className="w-12 h-12 rounded-full bg-gray-800"></div>
                           <div className="flex-1 space-y-2">
                               <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                               <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                           </div>
                           <div className="w-12 h-12 rounded-md bg-gray-800"></div>
                        </div>
                    ))}
                </div>
            )
        }
        if (notifications.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-128px)] text-gray-500 text-center">
                    <div className="text-5xl mb-4">🔕</div>
                    <h2 className="text-xl font-bold">لا توجد إشعارات</h2>
                    <p className="text-gray-400 mt-2">ستظهر التفاعلات الجديدة مع حسابك هنا.</p>
                </div>
            )
        }
        return (
            <div className="divide-y divide-gray-800">
                {notifications.map((notif) => (
                    <NotificationItem key={notif.id} notification={notif} />
                ))}
            </div>
        );
    }

  return (
    <div className="h-full flex flex-col bg-black text-white">
        <header className="flex items-center p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10 border-b border-gray-800">
             <button onClick={onBack} aria-label="رجوع">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold mx-auto">الإشعارات</h1>
            <div className="w-6 h-6"></div> {/* Spacer */}
        </header>
        <div className="flex-1 overflow-y-auto">
            {renderContent()}
        </div>
    </div>
  );
};