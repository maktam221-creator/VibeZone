import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons';
import type { Video, Comment } from '../types';

interface CommentsSheetProps {
    video: Video;
    onClose: () => void;
    onAddComment: (videoId: number) => void;
}

const CommentsSheet = ({ video, onClose, onAddComment }: CommentsSheetProps) => {
    const [comments, setComments] = useState<Comment[]>(video.commentsList || []);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            const newCommentObj: Comment = {
                id: Date.now(),
                user: '@مستخدم_جديد',
                avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
                text: newComment.trim(),
                timestamp: 'الآن'
            };
            setComments(prev => [newCommentObj, ...prev]);
            setNewComment('');
            if (onAddComment) {
                onAddComment(video.id);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex flex-col justify-end" onClick={onClose} aria-modal="true" role="dialog">
            <div 
                className="bg-gray-900 text-white rounded-t-2xl h-[75%] flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-700 text-center relative flex-shrink-0">
                    <h2 className="font-bold text-lg">{comments.length} تعليقًا</h2>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-4" aria-label="إغلاق التعليقات">
                        <CloseIcon />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                            <img src={comment.avatar} alt={`${comment.user}'s avatar`} className="w-10 h-10 rounded-full" />
                            <div className="flex-1">
                                <p className="text-gray-400 text-sm">{comment.user}</p>
                                <p className="text-base break-words">{comment.text}</p>
                                <p className="text-gray-500 text-xs mt-1">{comment.timestamp}</p>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && (
                        <div className="text-center text-gray-500 pt-10">
                            <p>لا توجد تعليقات بعد.</p>
                            <p>كن أول من يعلق!</p>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-700 bg-gray-900 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="أضف تعليقًا..."
                            className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                            aria-label="اكتب تعليق"
                        />
                        <button type="submit" className="text-rose-500 font-bold px-4 disabled:text-gray-500 transition-colors" disabled={!newComment.trim()}>
                            نشر
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentsSheet;
