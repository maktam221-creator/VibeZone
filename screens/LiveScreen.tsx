
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { LiveComment, User } from '../types';
import { api } from '../services/apiService';
import { generateLiveComments } from '../services/geminiService';
import { XIcon, HeartIcon, GiftIcon } from '../components/icons';

const STREAMER: User = {
  id: 'user-streamer-1',
  username: 'ProGamerX',
  name: 'أحمد برو',
  avatarUrl: 'https://i.pravatar.cc/150?u=progamerx',
  email: 'pro@gamer.x',
};

const VIDEO_URL = 'https://videos.pexels.com/video-files/5992285/5992285-hd_720_1366_25fps.mp4';

const FloatingHeart: React.FC<{ onAnimationEnd: () => void }> = ({ onAnimationEnd }) => {
  const style = {
    right: `${Math.random() * 20 + 5}%`,
    animationDuration: `${Math.random() * 2 + 3}s`,
  };

  return (
    <div className="absolute bottom-0 pointer-events-none" style={style} onAnimationEnd={onAnimationEnd}>
      <HeartIcon className="w-8 h-8 text-red-500 animate-float-up" filled />
    </div>
  );
};

const LiveCommentComponent: React.FC<{ comment: LiveComment }> = React.memo(({ comment }) => (
  <div className="p-2 rounded-lg flex items-start gap-2 text-sm">
    <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-6 h-6 rounded-full flex-shrink-0" />
    <div className="flex-1">
      <span className="font-semibold text-gray-400 mr-2">{comment.user.username}</span>
      <span className="text-white break-words">{comment.text}</span>
    </div>
  </div>
));

export const LiveScreen: React.FC<{ onBack: () => void; currentUser: User | null }> = ({ onBack, currentUser }) => {
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [viewers, setViewers] = useState(Math.floor(Math.random() * 1500) + 500);
  const [isFollowing, setIsFollowing] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number }[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const initialCommentsRef = useRef<LiveComment[]>([]);
  const commentIntervalRef = useRef<number>();

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await generateLiveComments("لاعب محترف يلعب لعبة فيديو ويجيب على أسئلة الجمهور");
      initialCommentsRef.current = fetchedComments;
    };
    fetchComments();

    const viewersInterval = setInterval(() => {
      setViewers(v => Math.max(100, v + Math.floor(Math.random() * 11) - 5));
    }, 3000);

    return () => {
      clearInterval(viewersInterval);
      clearInterval(commentIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    clearInterval(commentIntervalRef.current);
    commentIntervalRef.current = window.setInterval(() => {
      if (initialCommentsRef.current.length > 0) {
        setComments(prev => {
          const nextComment = initialCommentsRef.current.shift()!;
          initialCommentsRef.current.push(nextComment);
          return [...prev, nextComment].slice(-20);
        });
      }
    }, 2000);
    return () => clearInterval(commentIntervalRef.current);
  }, []);

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(currentUser) {
        api.toggleFollow(STREAMER.username);
        setIsFollowing(prev => !prev);
    }
  }

  const handleAddHeart = useCallback(() => {
    setFloatingHearts(hearts => [...hearts, { id: Date.now() }]);
  }, []);

  const removeHeart = (id: number) => {
    setFloatingHearts(hearts => hearts.filter(h => h.id !== id));
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && currentUser) {
      const newComment: LiveComment = {
        id: `user-${Date.now()}`,
        user: { username: currentUser.username, avatarUrl: currentUser.avatarUrl },
        text: inputMessage.trim(),
      };
      setComments(prev => [...prev, newComment].slice(-20));
      setInputMessage('');
    }
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col relative text-white">
      <video src={VIDEO_URL} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
      
      <header className="flex items-center justify-between p-4 z-10">
        <div className="flex items-center gap-3 bg-black/40 p-2 rounded-full">
          <img src={STREAMER.avatarUrl} alt={STREAMER.username} className="w-10 h-10 rounded-full" />
          <div>
            <p className="font-bold">{STREAMER.username}</p>
            <p className="text-xs text-gray-300">{viewers.toLocaleString()} مشاهد</p>
          </div>
          <button onClick={handleFollow} className={`py-1 px-3 rounded-full text-sm font-semibold ml-2 ${isFollowing ? 'bg-gray-600' : 'bg-purple-600'}`}>
            {isFollowing ? 'أتابعه' : 'متابعة'}
          </button>
        </div>
        <div className="flex items-center gap-2">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">مباشر</div>
            <button onClick={onBack} className="bg-black/40 p-2 rounded-full">
                <XIcon className="w-5 h-5" />
            </button>
        </div>
      </header>

      <div className="flex-1"></div>

      <footer className="p-4 z-10 flex flex-col">
        <div className="flex-1 flex flex-col-reverse overflow-hidden relative">
          <div className="h-64 overflow-y-auto pr-2 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black)]">
            <div className="flex flex-col-reverse">
              {comments.slice().reverse().map((comment) => (
                <LiveCommentComponent key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4">
          <form onSubmit={handleSendMessage} className="flex-1">
            <input 
              type="text" 
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="أضف تعليقًا..."
              className="w-full bg-black/40 border border-gray-600 rounded-full py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </form>
          <button onClick={handleAddHeart} className="w-12 h-12 bg-black/40 border border-gray-600 rounded-full flex items-center justify-center">
            <HeartIcon className="w-7 h-7 text-white" />
          </button>
          <button className="w-12 h-12 bg-black/40 border border-gray-600 rounded-full flex items-center justify-center">
            <GiftIcon className="w-7 h-7 text-white" />
          </button>
        </div>
      </footer>
      
      <div className="absolute bottom-20 right-4 h-64 w-24">
        {floatingHearts.map(heart => (
          <FloatingHeart key={heart.id} onAnimationEnd={() => removeHeart(heart.id)} />
        ))}
      </div>

       <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-250px) scale(0.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up forwards;
        }
      `}</style>
    </div>
  );
};