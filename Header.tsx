
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="p-4 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700 shadow-lg">
      <h1 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
        تطبيق دردشه Gemini
      </h1>
    </header>
  );
};
