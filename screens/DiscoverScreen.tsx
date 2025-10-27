import React from 'react';
import { DiscoverIcon } from '../components/icons';

const DiscoverScreen = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-4">
            <div className="absolute top-0 left-0 right-0 p-4 bg-black text-center">
                <h1 className="text-xl font-bold">اكتشف</h1>
            </div>
            <div className="text-center">
                <DiscoverIcon className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">استكشف عوالم جديدة</h2>
                <p className="text-lg text-gray-400">هنا ستجد المحتوى الرائج والمبدعين الجدد.</p>
            </div>
        </div>
    );
};

export default DiscoverScreen;
