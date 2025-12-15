"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Spinner from '@/components/shared/Spinner';
import { skillIcons } from '@/data/skillContent';
import { motion } from 'framer-motion';
import { useAnimateOnScroll } from '@/lib/hooks/useAnimateOnScroll';
import { fadeInUpVariants } from '@/lib/animations/variants';
import GradientUnderline from '@/components/shared/GradientUnderline';

const IconCloud = dynamic(() => import('./IconCloud'), {
    ssr: false,
    loading: () => <Spinner />
});

const Skills: React.FC = () => {
    const { ref, mainControls } = useAnimateOnScroll();

    return (
        <section ref={ref} id="skills" className="py-24 text-gray-900 dark:text-white min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-8 flex flex-col items-center justify-center">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate={mainControls}
                    transition={{ duration: 0.8 }}
                >
                    <GradientUnderline delay={0.8}>
                        Skills and Stacks.
                    </GradientUnderline>
                </motion.h2>
                <motion.p
                    className="text-base md:text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl leading-relaxed"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate={mainControls}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Some of the tools and technologies I&apos;ve used to build stuff. This represents things I&apos;ve dabbled in and might be updated in the future as I explore new technologies.
                </motion.p>
                <motion.div
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate={mainControls}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <Suspense fallback={<div className="flex items-center justify-center h-64 w-full"><Spinner /></div>}>
                        <IconCloud iconSlugs={skillIcons} />
                    </Suspense>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
