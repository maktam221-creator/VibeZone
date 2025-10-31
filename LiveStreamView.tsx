import React, { useState, useEffect, useRef } from 'react';
import type { LiveStream, User, Comment } from '../types';
import { HeartIcon, SwitchCameraIcon, RecordIcon, XIcon, ViewsIcon } from '../components/icons';

const FloatingHeart: React.FC<{ id: number; onAnimationEnd: (id: number) => void }> = ({ id, onAnimationEnd }) => {
    const style = {
        left: `${Math.random() * 30 + 5}%`,
        animationDuration: `${Math.random() * 2 + 3}s`,
        animationDelay: `${Math.random() * 0.5}s`,
    };

    return (
        <div className="absolute bottom-20" style={style} onAnimationEnd={() => onAnimationEnd(id)}>
            <HeartIcon filled className="w-8 h-8 text-red-500 animate-float" />
        </div>
    );
};

const LiveComment: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex items-start gap-2 p-2 rounded-lg max-w-full">
        <img src={comment.user.avatarUrl} alt={comment.user.username} className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 bg-black/30 p-2 rounded-lg">
            <p className="text-xs text-gray-300 font-semibold">@{comment.user.username}</p>
            <p className="text-sm text-white break-words">{comment.text}</p>
        </div>
    </div>
);

interface LiveStreamViewProps {
    stream: LiveStream;
    onClose: () => void;
    currentUser: User;
}

export const LiveStreamView: React.FC<LiveStreamViewProps> = ({ stream, onClose, currentUser }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [comments, setComments] = useState(stream.comments || []);
    const [newComment, setNewComment] = useState('');
    const [hearts, setHearts] = useState<{ id: number }[]>([]);
    const endOfCommentsRef = useRef<HTMLDivElement>(null);
    
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    let heartId = 0;

    useEffect(() => {
        let streamObj: MediaStream | null = null;
        const setupCamera = async () => {
             if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }

            try {
                const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode }, audio: true });
                streamObj = s;
                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                }
            } catch (err) {
                 console.error("خطأ في الوصول إلى الكاميرا:", err);
                 alert(`فشل الوصول إلى الكاميرا: ${err instanceof Error ? err.message : String(err)}`);
            }
        };

        setupCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
               (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);
    
    useEffect(() => {
        const interval = setInterval(() => {
           if (stream.comments && stream.comments.length > 0) {
             const nextComment = stream.comments[Math.floor(Math.random() * stream.comments.length)];
             setComments(prev => [...prev, {...nextComment, id: `c-${Date.now()}-${Math.random()}`}]);
           }
        }, 4000);
        return () => clearInterval(interval);
    }, [stream.comments]);


    useEffect(() => {
        endOfCommentsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [comments]);
    
    const handleAddHeart = () => {
        heartId += 1;
        setHearts(h => [...h, { id: heartId }]);
    };
    
    const removeHeart = (id: number) => {
        setHearts(h => h.filter(heart => heart.id !== id));
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            const comment: Comment = {
                id: `c-${Date.now()}`,
                user: currentUser,
                text: newComment,
                timestamp: new Date().toISOString()
            };
            setComments(prev => [...prev, comment]);
            setNewComment('');
        }
    };

    const handleSwitchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const handleSaveRecording = () => {
        if (recordedChunksRef.current.length === 0) return;
        
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `vibezone-live-${new Date().toISOString()}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        recordedChunksRef.current = [];
    };

    const startRecording = () => {
        if (!videoRef.current?.srcObject) {
            alert("لا يمكن بدء التسجيل، الكاميرا غير متاحة.");
            return;
        }
        
        recordedChunksRef.current = [];
        const stream = videoRef.current.srcObject as MediaStream;
        
        try {
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };
            mediaRecorderRef.current.onstop = handleSaveRecording;
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error("فشل بدء التسجيل:", error);
            alert("فشل بدء التسجيل. قد لا يكون متصفحك يدعم هذه الميزة.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const handleToggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleClose = () => {
        if (isRecording) {
            stopRecording();
        }
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black z-[100] animate-fade-in-fast">
            <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform scale-x-[-1]' : ''}`}></video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
            
            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start text-white">
                <div className="flex items-center gap-3 bg-black/40 p-2 rounded-lg">
                    <img src={stream.user.avatarUrl} alt={stream.user.username} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="font-bold">@{stream.user.username}</p>
                        <p className="text-xs text-gray-300">{stream.title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-lg text-sm">
                        <ViewsIcon className="w-5 h-5" />
                        <span>{stream.viewers.toLocaleString()}</span>
                    </div>
                    <button onClick={handleClose} className="bg-red-600/80 px-4 py-1.5 rounded-lg text-sm font-bold">إنهاء</button>
                </div>
            </header>

            <div className="absolute bottom-20 left-4 right-4 h-1/3 flex flex-col-reverse overflow-y-hidden">
                <div className="overflow-y-auto pr-2 space-y-2">
                    {comments.map(c => <LiveComment key={c.id} comment={c} />)}
                    <div ref={endOfCommentsRef} />
                </div>
            </div>

            <footer className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-2">
                <form onSubmit={handleCommentSubmit} className="flex-1">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="إضافة تعليق..."
                        className="w-full bg-black/40 text-white rounded-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </form>
                <button onClick={handleToggleRecording} className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center" aria-label={isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}>
                    <RecordIcon className={`w-7 h-7 transition-colors ${isRecording ? 'text-red-500' : 'text-white'}`} fill={isRecording ? 'currentColor' : 'transparent'} />
                </button>
                <button onClick={handleSwitchCamera} className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center" aria-label="تبديل الكاميرا">
                    <SwitchCameraIcon className="w-7 h-7 text-white" />
                </button>
                <button onClick={handleAddHeart} className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center" aria-label="إعجاب">
                    <HeartIcon filled className="w-8 h-8 text-red-500" />
                </button>
            </footer>
            
            <div className="absolute bottom-0 right-0 pointer-events-none w-1/4 h-3/4">
                {hearts.map(h => <FloatingHeart key={h.id} id={h.id} onAnimationEnd={removeHeart} />)}
            </div>

            <style>{`
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
                @keyframes float {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-200px) scale(0.5); opacity: 0; }
                }
                .animate-float { animation-name: float; animation-timing-function: linear; }
            `}</style>
        </div>
    );
};