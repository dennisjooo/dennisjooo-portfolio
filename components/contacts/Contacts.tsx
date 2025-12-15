'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dock } from '@/components/Dock';
import { DockIcon } from '@/components/DockIcon';
import GradientUnderline from '@/components/shared/GradientUnderline';
import { contactLinks } from '@/data/contactContent';

const Contacts: React.FC = () => {
    return (
        <section id="contact" className="flex flex-col items-center py-24 text-gray-900 dark:text-white px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-border)] to-transparent"
            />
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-12 text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white"
            >
                <GradientUnderline delay={0.5}>
                    Reach Me Here.
                </GradientUnderline>
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 text-base md:text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl leading-relaxed"
            >
                Let&apos;s talk shop, job offers, or whatever you&apos;re building next, and swap stories interesting stories about tech and life in general.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="w-full flex justify-center"
            >
                <Dock className="my-8">
                    {contactLinks.map(({ href, ariaLabel, icon }) => (
                        <DockIcon key={ariaLabel} href={href} ariaLabel={ariaLabel} icon={icon} />
                    ))}
                </Dock>
            </motion.div>
        </section>
    );
};

export default Contacts;
