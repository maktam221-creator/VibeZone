import React from 'react';
import FeedScreen from './screens/FeedScreen';
import BottomNav from './components/BottomNav';

const App = () => {
    return (
        <div className="relative h-screen w-full max-w-md mx-auto bg-black overflow-hidden">
            <FeedScreen />
            <BottomNav />
        </div>
    );
};

export default App;