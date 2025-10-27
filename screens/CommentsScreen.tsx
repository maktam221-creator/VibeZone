import React, { useState, useRef, useEffect } from 'react';
import type { Comment, User } from '../types';
import { XIcon } from '../components/icons';
import { SendIcon } from '../components/icons/SendIcon';

const CommentItem: React.FC<{ comment: Comment }> = React.memo(({ comment }) => {
  if (!comment.user) {
    return (
      <div className="flex items-start gap-3 py-3">
         <div className="w-9 h-9 rounded-full mt-1 bg-gray-700"></div>
         <div className="flex-1">
            <p className="text-xs text-gray-500">@مستخدم_محذوف</p>
            <p className="text-sm text-gray-500 italic">هذا التعليق غير متوفر</p>
         </div>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-3 py-3">
      <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-9 h-9 rounded-full mt-1" />
      <div className="flex-1">
        <p className="text-xs text-gray-400">@{comment.user.username}</p>
        <p className="text-sm text-white whitespace-pre-wrap">{comment.text}</p>
      </div>
    </div>
  );
});

interface CommentsScreenProps {
  postCommentsCount: number;
  comments: Comment[];
  currentUser: User | null;
  onClose: () => void;
  onAddComment: (text: string) => void;
}

export const CommentsScreen: React.FC<CommentsScreenProps> = ({ postCommentsCount, comments, currentUser, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end" role="dialog" aria-modal="true" aria-labelledby="comments-title">
      <div className="w-full bg-gray-900 rounded-t-2xl flex flex-col h-[85vh] max-h-[800px] animate-slide-up">
        <header className="p-4 text-center border-b border-gray-800 flex-shrink-0 relative">
          <h2 id="comments-title" className="font-bold">{postCommentsCount} تعليقات</h2>
          <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 hover:text-white p-2 rounded-full" aria-label="إغلاق التعليقات">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4">
          {comments.length > 0 ? (
            comments.map(comment => <CommentItem key={comment.id} comment={comment} />)
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg font-semibold">لا توجد تعليقات بعد</p>
              <p className="text-sm">كن أول من يعلق!</p>
            </div>
          )}
          <div ref={commentsEndRef} />
        </div>

        <footer className="p-3 border-t border-gray-800 bg-gray-900 flex-shrink-0">
          {currentUser ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <img src={currentUser.avatarUrl} alt="Your avatar" className="w-9 h-9 rounded-full"/>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="أضف تعليقًا..."
                className="flex-1 bg-gray-800 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button type="submit" disabled={!newComment.trim()} className="p-2 text-purple-400 disabled:text-gray-600 transition-colors">
                <SendIcon />
              </button>
            </form>
          ) : (
             <p className="text-center text-sm text-gray-400">يرجى تسجيل الدخول للتعليق.</p>
          )}
        </footer>
      </div>
    </div>
  );
};