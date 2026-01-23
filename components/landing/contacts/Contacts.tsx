'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dock } from './Dock/Dock';
import { DockIconLink } from './Dock/DockIconLink';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { contactLinks } from '@/data/contactContent';
import { staggerContainerVariants, blurRevealVariants, springItemVariants } from '@/lib/animations/variants';

// Custom timing for bottom group (delayChildren: 0.6)
const bottomGroupVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.6,
        },
    },
};

const Contacts: React.FC = () => {
    return (
        <section
            id="contact"
            className="relative min-h-[80vh] flex flex-col py-24 px-6 md:px-8 bg-background overflow-hidden"
        >
            <div className="w-full max-w-7xl mx-auto">
                {/* Section Header - Consistent with other sections */}
                <div className="w-full mb-16 md:mb-20">
                    <SectionHeader number="06." title="Contact" />
                </div>

                {/* Main Content - Poster Layout */}
                <div className="flex-1 w-full flex flex-col justify-center items-center min-h-[50vh]">
                    {/* Headline with staggered word reveal */}
                    <motion.div
                        variants={staggerContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        className="flex flex-col items-center relative leading-none mb-12"
                    >
                        {/* Metadata label above headline */}
                        <motion.span
                            variants={springItemVariants}
                            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-50 text-muted-foreground mb-6"
                        >
                            Get In Touch
                        </motion.span>

                        {/* Main headline - Playfair italic for "Let's" */}
                        <motion.span
                            variants={blurRevealVariants}
                            className="font-playfair italic text-[18vw] md:text-[10vw] leading-[0.8] text-foreground dark:mix-blend-screen select-none text-center relative"
                        >
                            Let&apos;s
                        </motion.span>

                        {/* Main headline - Urbanist bold for "TALK" */}
                        <motion.span
                            variants={blurRevealVariants}
                            className="font-sans font-black text-[22vw] md:text-[12vw] leading-[0.8] text-gradient-primary tracking-tighter select-none text-center relative"
                        >
                            TALK
                        </motion.span>
                    </motion.div>

                    {/* Bottom Group: Text & Dock with staggered reveal */}
                    <motion.div
                        variants={bottomGroupVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        className="flex flex-col items-center gap-8"
                    >
                        <motion.p
                            variants={springItemVariants}
                            className="text-base md:text-xl font-light text-muted-foreground font-sans text-center max-w-md px-4"
                        >
                            Have a cool idea? Want to geek out over AI, or just want to say hi? Drop a line.
                        </motion.p>

                        <motion.div variants={springItemVariants}>
                            <Dock className="mx-auto">
                                {contactLinks.map(({ href, ariaLabel, icon }) => (
                                    <DockIconLink key={ariaLabel} href={href} ariaLabel={ariaLabel} icon={icon} />
                                ))}
                            </Dock>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
