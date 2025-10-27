import React, { useEffect } from 'react';
import FeedScreen from './screens/FeedScreen';
import BottomNav from './components/BottomNav';

const App = () => {
    useEffect(() => {
        const root = window.document.documentElement;
        if (!root.classList.contains('dark')) {
            root.classList.add('dark');
        }
    }, []);

    return (
        <div className="h-screen w-full bg-black text-white relative">
           <FeedScreen />
           <BottomNav />
        </div>
    );
};

export default App;
