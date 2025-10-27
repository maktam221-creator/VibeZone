import React from 'react';

export const Logo: React.FC = () => {
    return (
        <svg width="150" height="40" viewBox="0 0 150 40">
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
                fontSize="30"
                fontWeight="bold"
                fill="url(#logoGradient)"
                fontFamily="'Cairo', sans-serif"
            >
                VibeZone
            </text>
        </svg>
    );
};