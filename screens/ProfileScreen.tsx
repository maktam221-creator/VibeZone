import React from 'react';

const ProfileScreen = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white p-4 pt-12">
             <div className="absolute top-0 left-0 right-0 p-4 bg-black text-center">
                <h1 className="text-xl font-bold">ملفي</h1>
            </div>
            <img 
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-4 border-gray-700 mb-4"
            />
            <h2 className="text-2xl font-bold">@مستخدم_جديد</h2>
            <div className="flex space-x-8 my-6">
                <div className="text-center">
                    <span className="font-bold text-xl">123</span>
                    <p className="text-gray-400 text-sm">أتابعه</p>
                </div>
                <div className="text-center">
                    <span className="font-bold text-xl">456</span>
                    <p className="text-gray-400 text-sm">متابعون</p>
                </div>
                <div className="text-center">
                    <span className="font-bold text-xl">789</span>
                    <p className="text-gray-400 text-sm">إعجاب</p>
                </div>
            </div>
            <button className="bg-gray-800 font-semibold py-2 px-10 rounded-md hover:bg-gray-700 transition-colors">
                تعديل الملف الشخصي
            </button>
        </div>
    );
};

export default ProfileScreen;
