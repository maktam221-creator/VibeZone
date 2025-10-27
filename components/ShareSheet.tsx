import React, { useState, useEffect } from 'react';
import { CloseIcon, CopyIcon, WhatsAppIcon, TwitterIcon, MessengerIcon } from './icons';

const ShareOption = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center space-y-2 text-white hover:text-rose-400 transition-colors">
        <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">{icon}</div>
        <span className="text-xs text-gray-300">{label}</span>
    </button>
);

const ShareSheet = ({ video, onClose }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleCopyLink = () => {
        const link = `https://vibezone.example.com/video/${video.id}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex flex-col justify-end" onClick={onClose} aria-modal="true" role="dialog">
            <div 
                className="bg-gray-900 text-white rounded-t-2xl flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-700 text-center relative flex-shrink-0">
                    <h2 className="font-bold text-lg">مشاركة إلى</h2>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-4" aria-label="إغلاق المشاركة">
                        <CloseIcon />
                    </button>
                </div>

                {/* Share Options */}
                <div className="p-6">
                    <div className="grid grid-cols-4 gap-y-4">
                        <ShareOption icon={<CopyIcon />} label="نسخ الرابط" onClick={handleCopyLink} />
                        <ShareOption icon={<WhatsAppIcon />} label="واتساب" onClick={() => alert('مشاركة إلى واتساب')} />
                        <ShareOption icon={<TwitterIcon />} label="تويتر" onClick={() => alert('مشاركة إلى تويتر')} />
                        <ShareOption icon={<MessengerIcon />} label="ماسنجر" onClick={() => alert('مشاركة إلى ماسنجر')} />
                    </div>
                </div>
                 {copied && (
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm py-2 px-4 rounded-full animate-zoom-in-fade">
                        تم نسخ الرابط!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareSheet;