import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
    imageUrl?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl = '/images/profile.webp' }) => (
    <div
        className="w-full max-w-[300px] aspect-square relative flex-shrink-0 group animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
    >
        <div className="absolute -inset-4 bg-gradient-accent rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
        <Image
            src={imageUrl}
            alt="Profile picture"
            fill
            className="rounded-2xl object-cover shadow-2xl group-hover:grayscale-0 transition-all duration-500 relative z-10"
            priority
            sizes="(max-width: 768px) 100vw, 300px"
        />
    </div>
);
