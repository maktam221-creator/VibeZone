import React, { useState, useEffect } from 'react';
import FeedScreen from './screens/FeedScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import CreateScreen from './screens/CreateScreen';
import InboxScreen from './screens/InboxScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNav from './components/BottomNav';

const App = () => {
    const [activeScreen, setActiveScreen] = useState('Home');

    useEffect(() => {
        const root = window.document.documentElement;
        // Keep dark mode for consistency
        if (!root.classList.contains('dark')) {
            root.classList.add('dark');
        }
    }, []);

    const renderScreen = () => {
        switch (activeScreen) {
            case 'Home':
                return <FeedScreen />;
            case 'Discover':
                return <DiscoverScreen />;
            case 'Create':
                return <CreateScreen />;
            case 'Inbox':
                return <InboxScreen />;
            case 'Profile':
                return <ProfileScreen />;
            default:
                return <FeedScreen />;
        }
    };

    return (
        <div className="h-screen w-full bg-black text-white relative">
            <main className="h-full w-full">
              {renderScreen()}
            </main>
            <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
        </div>
    );
};

export default App;
