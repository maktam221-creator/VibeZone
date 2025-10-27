import React from 'react';

interface ChatThemeScreenProps {
  onClose: () => void;
  onSelectTheme: (themeClass: string) => void;
}

const themes = [
    { id: 'default', name: 'افتراضي', class: 'bg-black' },
    { id: 'sunset', name: 'غروب', class: 'bg-gradient-to-br from-red-500 to-orange-500' },
    { id: 'ocean', name: 'محيط', class: 'bg-gradient-to-br from-blue-400 to-cyan-400' },
    { id: 'aurora', name: 'شفق', class: 'bg-gradient-to-br from-purple-600 to-pink-600' },
    { id: 'forest', name: 'غابة', class: 'bg-gradient-to-br from-green-500 to-teal-500' },
    { id: 'royal', name: 'ملكي', class: 'bg-gradient-to-br from-indigo-700 to-purple-800' },
    { id: 'candy', name: 'حلوى', class: 'bg-gradient-to-br from-pink-400 to-yellow-300' },
    { id: 'dusk', name: 'غسق', class: 'bg-gradient-to-br from-gray-800 to-blue-900' },
];

export const ChatThemeScreen: React.FC<ChatThemeScreenProps> = ({ onClose, onSelectTheme }) => {
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full bg-gray-900 rounded-t-2xl animate-slide-up p-4 pb-8" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-4"></div>
        <h2 className="text-lg font-bold text-center text-white mb-4">اختر سمة للدردشة</h2>
        
        <div className="grid grid-cols-4 gap-4">
          {themes.map(theme => (
            <button 
              key={theme.id} 
              onClick={() => onSelectTheme(theme.class)}
              className="flex flex-col items-center gap-2 group"
              aria-label={`Select ${theme.name} theme`}
            >
              <div className={`w-16 h-16 rounded-full ${theme.class} border-2 border-transparent group-hover:border-white transition-all`}></div>
              <span className="text-xs text-gray-300">{theme.name}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-800 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
};