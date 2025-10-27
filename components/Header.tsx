import React from 'react';

interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="p-4 bg-gray-100/80 dark:bg-gray-900/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-lg flex-shrink-0">
      <h1 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-500">
        {title}
      </h1>
    </header>
  );
};