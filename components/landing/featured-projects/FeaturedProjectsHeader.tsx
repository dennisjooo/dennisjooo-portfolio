'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/shared/SectionHeader';

export const FeaturedProjectsHeader = () => (
    <div className="w-full mb-16 md:mb-24">
        {/* Standard Section Header */}
        <SectionHeader 
            number="04." 
            title="Featured Projects" 
            className="mb-12"
        />

        {/* Artistic/Editorial Headline */}
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full pt-12 select-none"
        >
            <div className="flex flex-col items-start w-full">
                <motion.span 
                    initial={{ x: -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="font-playfair italic text-7xl md:text-9xl ml-2 md:ml-12 mb-[-3vw] md:mb-[-4vw] relative z-20 text-foreground"
                >
                    Selected
                </motion.span>
                <h2 className="font-urbanist font-black text-[15vw] md:text-[12vw] leading-[0.8] tracking-tighter text-background-layer z-10 select-none">
                    WORK
                </h2>
            </div>
        </motion.div>
    </div>
);
