"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { workExperienceData } from '@/data/workContent';
import { useAnimateOnScroll } from '@/lib/hooks/useAnimateOnScroll';
import { fadeInUpVariants } from '@/lib/animations/variants';
import GradientUnderline from '@/components/shared/GradientUnderline';
import { Timeline } from './Timeline';

const WorkExperience: React.FC = () => {
    const { ref, mainControls } = useAnimateOnScroll();
    const reduceMotionPreference = useReducedMotion();
    const shouldReduceMotion = Boolean(reduceMotionPreference);
    const headingTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.25 };
    const paragraphTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.5, delay: 0.35 };

    return (
        <section
            ref={ref}
            id="work"
            aria-labelledby="work-heading"
            className="py-24 flex items-center justify-center min-h-screen px-8 text-gray-900 dark:text-white"
        >
            <div className="w-full max-w-3xl">
                <motion.h2
                    id="work-heading"
                    className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate={mainControls}
                    transition={headingTransition}
                >
                    <GradientUnderline delay={0.75}>
                        Work Experience.
                    </GradientUnderline>
                </motion.h2>
                <motion.p
                    className="text-base md:text-lg text-gray-600 dark:text-gray-400 text-center mb-12 leading-relaxed"
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate={mainControls}
                    transition={paragraphTransition}
                >
                    Some of the gigs that taught me how to ship fast without cutting the good corners and how to keep teams looped in so momentum stays loud from kickoff to ship day.
                </motion.p>
                <Timeline
                    items={workExperienceData}
                    mainControls={mainControls}
                    shouldReduceMotion={shouldReduceMotion}
                />
            </div>
        </section>
    );
};

export default WorkExperience;
