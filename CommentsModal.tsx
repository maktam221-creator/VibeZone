import React, { useState, useRef, useEffect } from 'react';
import type { VideoPost, User, Comment } from '../types';
import { XIcon, PaperPlaneIcon } from '../components/icons';

interface CommentsModalProps {
  post: VideoPost;
  currentUser: User;
  onClose: () => void;
  onAddComment: (postId: string, commentText: string) => void;
}

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex items-start gap-3 py-3">
        <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-9 h-9 rounded-full flex-shrink-0" />
        <div className="flex-1">
            <p className="text-xs text-gray-400">@{comment.user.username}</p>
            <p className="text-sm text-white">{comment.text}</p>
        </div>
    </div>
);

export const CommentsModal: React.FC<CommentsModalProps> = ({ post, currentUser, onClose, onAddComment }) => {
    const [newComment, setNewComment] = useState('');
    const endOfCommentsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [post.comments]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(post.id, newComment.trim());
            setNewComment('');
        }
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 z-[60] flex items-end"
            onClick={onClose}
        >
             <div 
                className="w-full h-[70vh] bg-gray-900 rounded-t-2xl flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 p-4 text-center border-b border-gray-700 relative">
                    <h2 className="font-bold">{post.comments.length} تعليقات</h2>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 left-4 p-2" aria-label="إغلاق">
                        <XIcon className="w-6 h-6 text-gray-400" />
                    </button>
                </header>
                
                <div className="flex-1 overflow-y-auto px-4">
                    {post.comments.length > 0 ? (
                        post.comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
                        </div>
                    )}
                    <div ref={endOfCommentsRef} />
                </div>
                
                <footer className="flex-shrink-0 p-3 border-t border-gray-700 bg-gray-900">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <img src={currentUser.avatarUrl} alt="Your avatar" className="w-9 h-9 rounded-full" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="إضافة تعليق..."
                            className="flex-1 bg-gray-800 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit" disabled={!newComment.trim()} className="p-2 text-purple-400 disabled:text-gray-600" aria-label="إرسال التعليق">
                            <PaperPlaneIcon className="w-6 h-6" />
                        </button>
                    </form>
                </footer>
            </div>
             <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            `}</style>
        </div>
    );
};