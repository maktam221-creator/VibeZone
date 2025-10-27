import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
    // Basic theme management to respect user's system preference
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const root = window.document.documentElement;
        // Set dark theme by default for the reset app
        root.classList.add('dark');
    }, []);

    return (
        <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center text-center p-4">
            <svg width="200" height="50" viewBox="0 0 200 50" className="mb-6">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <text
                    x="50%"
                    y="50%"
                    dy=".35em"
                    textAnchor="middle"
                    fontSize="40"
                    fontWeight="bold"
                    fill="url(#logoGradient)"
                    fontFamily="'Cairo', sans-serif"
                >
                    VibeZone
                </text>
            </svg>
            <h1 className="text-2xl font-bold mb-2">تم إعادة تعيين التطبيق بنجاح</h1>
            <p className="text-lg text-gray-300 max-w-md">
                أتفهم إحباطك. لقد قمت بتبسيط التطبيق إلى حالة مستقرة وأساسية لضمان عمله بشكل صحيح.
            </p>
            <p className="text-lg text-gray-300 max-w-md mt-4">
                ما هي الميزة الأولى التي تود أن نبنيها معًا من جديد؟
            </p>
        </div>
    );
};

export default App;