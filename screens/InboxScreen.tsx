import React from 'react';
import { InboxIcon } from '../components/icons';

const InboxScreen = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-4">
             <div className="absolute top-0 left-0 right-0 p-4 bg-black text-center">
                <h1 className="text-xl font-bold">صندوق الوارد</h1>
            </div>
            <div className="text-center">
                <InboxIcon className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">رسائلك</h2>
                <p className="text-lg text-gray-400">جميع رسائلك وإشعاراتك ستظهر هنا.</p>
            </div>
        </div>
    );
};

export default InboxScreen;
