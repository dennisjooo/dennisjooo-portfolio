'use client';

import React from 'react';
import { Dock } from './Dock/Dock';
import { DockIconLink } from './Dock/DockIconLink';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { contactLinks } from '@/data/contactContent';
import { CONTACT_ICON_MAP } from '@/lib/constants/contactIcons';
import { m, useReducedMotion, springConfigs, viewportSettings } from '@/components/motion';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: springConfigs.smooth,
    },
};

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

interface ContactItem {
    href: string;
    ariaLabel: string;
    icon: string;
}

interface ContactsProps {
    contacts?: ContactItem[];
}

const Contacts: React.FC<ContactsProps> = ({ contacts }) => {
    const prefersReducedMotion = useReducedMotion();
    const dockLinks = contacts?.length
        ? contacts.map((contact) => {
            const Icon = CONTACT_ICON_MAP[contact.icon] ?? CONTACT_ICON_MAP.website;
            return {
                href: contact.href,
                ariaLabel: contact.ariaLabel,
                icon: <Icon className="size-6" />,
            };
        })
        : contactLinks;

    return (
        <section
            id="contact"
            className="relative min-h-[80vh] flex flex-col py-24 px-6 md:px-8 bg-background overflow-hidden"
        >
            <div className="w-full max-w-7xl mx-auto">
                <div className="w-full mb-16 md:mb-20">
                    <SectionHeader number="06." title="Contact" />
                </div>

                <div className="flex-1 w-full flex flex-col justify-center items-center min-h-[50vh]">
                    <m.div
                        variants={prefersReducedMotion ? undefined : containerVariants}
                        initial={prefersReducedMotion ? undefined : "hidden"}
                        whileInView={prefersReducedMotion ? undefined : "visible"}
                        viewport={viewportSettings.onceDeep}
                        className="flex flex-col items-center relative leading-none mb-12"
                    >
                        <m.span
                            variants={prefersReducedMotion ? undefined : itemVariants}
                            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6"
                        >
                            Get In Touch
                        </m.span>

                        <m.span
                            variants={prefersReducedMotion ? undefined : headlineVariants}
                            className="font-playfair italic text-[18vw] md:text-[10vw] leading-[0.8] text-foreground dark:mix-blend-screen select-none text-center relative"
                        >
                            Let&apos;s
                        </m.span>

                        <m.span
                            variants={prefersReducedMotion ? undefined : headlineVariants}
                            className="font-sans font-black text-[22vw] md:text-[12vw] leading-[0.8] text-gradient-primary tracking-tighter select-none text-center relative"
                        >
                            TALK
                        </m.span>
                    </m.div>

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
                                {dockLinks.map(({ href, ariaLabel, icon }) => (
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
