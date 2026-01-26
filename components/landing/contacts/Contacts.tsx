'use client';

import React from 'react';
import { Dock } from './Dock/Dock';
import { DockIconLink } from './Dock/DockIconLink';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { contactLinks } from '@/data/contactContent';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

// Staggered container for children
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

// Individual item animations
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: springConfigs.smooth,
    },
};

// Headline reveal with slight scale for premium feel
const headlineVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
            ...springConfigs.gentle,
            duration: 0.8,
        },
    },
};

const Contacts: React.FC = () => {
    const prefersReducedMotion = useReducedMotion();

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
                    <m.div
                        variants={prefersReducedMotion ? undefined : containerVariants}
                        initial={prefersReducedMotion ? undefined : "hidden"}
                        whileInView={prefersReducedMotion ? undefined : "visible"}
                        viewport={viewportSettings.onceDeep}
                        className="flex flex-col items-center relative leading-none mb-12"
                    >
                        {/* Metadata label above headline */}
                        <m.span
                            variants={prefersReducedMotion ? undefined : itemVariants}
                            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6"
                        >
                            Get In Touch
                        </m.span>

                        {/* Main headline - Playfair italic for "Let's" */}
                        <m.span
                            variants={prefersReducedMotion ? undefined : headlineVariants}
                            className="font-playfair italic text-[18vw] md:text-[10vw] leading-[0.8] text-foreground dark:mix-blend-screen select-none text-center relative"
                        >
                            Let&apos;s
                        </m.span>

                        {/* Main headline - Urbanist bold for "TALK" */}
                        <m.span
                            variants={prefersReducedMotion ? undefined : headlineVariants}
                            className="font-sans font-black text-[22vw] md:text-[12vw] leading-[0.8] text-gradient-primary tracking-tighter select-none text-center relative"
                        >
                            TALK
                        </m.span>
                    </m.div>

                    {/* Bottom Group: Text & Dock with staggered reveal */}
                    <m.div
                        variants={prefersReducedMotion ? undefined : containerVariants}
                        initial={prefersReducedMotion ? undefined : "hidden"}
                        whileInView={prefersReducedMotion ? undefined : "visible"}
                        viewport={viewportSettings.once}
                        className="flex flex-col items-center gap-8"
                    >
                        <m.p
                            variants={prefersReducedMotion ? undefined : itemVariants}
                            className="text-base md:text-xl font-light text-muted-foreground font-sans text-center max-w-md px-4"
                        >
                            Have a cool idea? Want to geek out over AI, or just want to say hi? Drop a line.
                        </m.p>

                        <m.div variants={prefersReducedMotion ? undefined : itemVariants}>
                            <Dock className="mx-auto">
                                {contactLinks.map(({ href, ariaLabel, icon }) => (
                                    <DockIconLink key={ariaLabel} href={href} ariaLabel={ariaLabel} icon={icon} />
                                ))}
                            </Dock>
                        </m.div>
                    </m.div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
