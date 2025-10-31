import React from 'react';
import type { LiveStream } from '../types';
import { ViewsIcon } from '../components/icons';
import { mockStreams } from '../data';

const formatCount = (num: number): string => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'ألف';
  return num.toString();
};

interface LiveScreenProps {
    onViewStream: (stream: LiveStream) => void;
}

const LiveStreamCard: React.FC<{ stream: LiveStream; onClick: () => void }> = ({ stream, onClick }) => {
    return (
        <button onClick={onClick} className="relative aspect-[9/12] rounded-lg overflow-hidden group text-right w-full">
            <div className={`absolute inset-0 ${stream.thumbnailUrl}`}></div>
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="absolute top-2 right-2 bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded">
                مباشر
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-gradient-to-t from-black/70 to-transparent">
                 <div className="flex items-center gap-2">
                    <img src={stream.user.avatarUrl} alt={stream.user.username} className="w-8 h-8 rounded-full border-2 border-pink-500" />
                    <div>
                        <p className="font-bold text-sm">@{stream.user.username}</p>
                        <p className="text-xs text-gray-200">{stream.title}</p>
                    </div>
                 </div>
                 <div className="text-xs mt-1 font-semibold bg-black/40 px-2 py-1 rounded-full inline-block">
                    <ViewsIcon />
                    {formatCount(stream.viewers)}
                 </div>
            </div>
        </button>
    );
};

export const LiveScreen: React.FC<LiveScreenProps> = ({ onViewStream }) => {
  return (
    <div className="h-full overflow-y-auto pb-16">
        <header className="p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
            <h1 className="text-xl font-bold text-center">بث مباشر</h1>
        </header>
      <div className="grid grid-cols-2 gap-2 p-2">
        {mockStreams.map((stream) => (
          <LiveStreamCard key={stream.id} stream={stream} onClick={() => onViewStream(stream)} />
        ))}
      </div>
    </div>
  );
};