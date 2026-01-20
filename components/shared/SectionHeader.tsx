'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
    number: string;
    title: string;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, className }) => {
    return (
        <motion.div 
            className={cn(
                "w-full flex justify-between items-end border-b border-border pb-4",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <span className="font-playfair italic text-3xl md:text-4xl text-foreground">{number}</span>
            <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-50 text-muted-foreground">{title}</span>
        </motion.div>
    );
};
