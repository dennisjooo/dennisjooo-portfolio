'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '@/lib/hooks/useAnimateOnScroll';
import { fadeInUpVariants } from '@/lib/animations/variants';
import GradientUnderline from '@/components/shared/GradientUnderline';
import { ProfileImage } from './ProfileImage';
import { AboutContent } from './AboutContent';

const About: React.FC = () => {
    const { ref, mainControls } = useAnimateOnScroll();

    return (
        <section
            ref={ref}
            id="about"
            className="min-h-screen flex flex-col items-center justify-center py-24 px-8 text-gray-900 dark:text-white"
        >
            <motion.h2
                className="text-3xl md:text-4xl mb-6 text-center font-bold text-gray-900 dark:text-white"
                variants={fadeInUpVariants}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.8 }}
            >
                <GradientUnderline delay={0.8}>
                    About.
                </GradientUnderline>
            </motion.h2>
            <motion.div
                className="max-w-4xl mx-auto flex flex-col md:flex-row items-center"
                variants={fadeInUpVariants}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <ProfileImage mainControls={mainControls} />
                <AboutContent mainControls={mainControls} />
            </motion.div>
        </section>
    );
};

export default About;
