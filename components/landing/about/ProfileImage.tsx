'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimationControls } from 'framer-motion';
import { fadeInUpVariants } from '@/lib/animations/variants';

interface ProfileImageProps {
    mainControls?: AnimationControls;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ mainControls }) => (
    <motion.div
        className="w-full max-w-[300px] aspect-square relative flex-shrink-0 group"
        variants={fadeInUpVariants}
        initial="hidden"
        animate={mainControls || "visible"}
        transition={{ duration: 0.6, delay: 0.4 }}
    >
        <div className="absolute -inset-4 bg-gradient-accent rounded-[2rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
        <Image
            src="/images/profile.webp"
            alt="Profile picture"
            fill
            className="rounded-2xl object-cover shadow-2xl group-hover:grayscale-0 transition-all duration-500 relative z-10"
            priority
            sizes="(max-width: 768px) 100vw, 300px"
        />
    </motion.div>
);
