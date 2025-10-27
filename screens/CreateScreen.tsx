import React from 'react';

const CreateScreen = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
            <h1 className="text-4xl font-bold mb-4 animate-zoom-in-fade">إنشاء فيديو</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-md">أطلق العنان لإبداعك وشارك لحظاتك مع العالم. اختر مقطع فيديو للبدء.</p>
            <button className="bg-rose-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-rose-600 transition-transform transform hover:scale-105">
                تحميل فيديو
            </button>
        </div>
    );
};

export default CreateScreen;
