import React from 'react';

// FIX: Add explicit type for props to resolve TypeScript inference issue with JSX children.
const Icon = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-7 h-7 ${className}`}
  >
    {children}
  </svg>
);

// Fix: Added explicit prop type to resolve TypeScript inference error.
export const HomeIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
  </Icon>
);

// Fix: Added explicit prop type to resolve TypeScript inference error.
export const DiscoverIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path fillRule="evenodd" d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8ZM12 7a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 12 7Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
    <path d="m10.828 10.828-2.12 2.121 2.12 2.121 2.122-2.12L10.829 10.828Z" fillOpacity=".5" />
  </Icon>
);

export const CreateIcon = ({ className = '' }: { className?: string }) => (
    <div className={`w-14 h-8 rounded-lg flex items-center justify-center ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        </svg>
    </div>
);

// Fix: Added explicit prop type to resolve TypeScript inference error.
export const InboxIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm-2 12H6v-2h12v2Zm0-3H6V9h12v2Zm0-3H6V6h12v2Z" />
  </Icon>
);

// Fix: Added explicit prop type to resolve TypeScript inference error.
export const ProfileIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4Z" />
  </Icon>
);

// Fix: Added explicit prop type to resolve TypeScript inference error.
export const HeartIcon = ({ className = '' }: { className?: string }) => (
    <Icon className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </Icon>
);

// Fix: Added explicit prop type to resolve TypeScript inference error.
export const CommentIcon = ({ className = '' }: { className?: string }) => (
    <Icon className={className}>
        <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
    </Icon>
);

// Fix: Added explicit prop type to resolve TypeScript inference error.
export const ShareIcon = ({ className = '' }: { className?: string }) => (
    <Icon className={className}>
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
    </Icon>
);

export const MusicIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
  </svg>
);