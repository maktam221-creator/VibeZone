import React from 'react';

export const PlaceholderScreen: React.FC<{ title?: string }> = ({ title = 'Screen' }) => (
  <div className="flex flex-col h-full items-center justify-center bg-gray-900 text-white p-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-gray-400 mt-2">This is a placeholder screen.</p>
  </div>
);
