import React, { useEffect } from 'react';

const App = () => {
    useEffect(() => {
        const root = window.document.documentElement;
        // Keep dark mode for consistency
        if (!root.classList.contains('dark')) {
            root.classList.add('dark');
        }
    }, []);

    return (
        <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center text-center p-4">
           <h1 className="text-4xl font-bold mb-4 animate-zoom-in-fade">تم حذف التطبيق</h1>
           <p className="text-lg text-gray-400">بناءً على طلبك، تم حذف جميع مكونات التطبيق ووظائفه.</p>
           <p className="text-lg text-gray-400 mt-2">شكراً لاستخدامك VibeZone.</p>
        </div>
    );
};

export default App;
