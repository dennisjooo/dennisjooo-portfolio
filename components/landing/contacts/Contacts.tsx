'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Dock } from './Dock/Dock';
import { DockIconLink } from './Dock/DockIconLink';
import { SectionHeaderAnimated } from '@/components/shared/SectionHeaderAnimated';
import { contactLinks } from '@/data/contactContent';

const Contacts: React.FC = () => {
    const headlineRef = useRef<HTMLDivElement>(null);
    const bottomGroupRef = useRef<HTMLDivElement>(null);
    const [headlineVisible, setHeadlineVisible] = useState(false);
    const [bottomVisible, setBottomVisible] = useState(false);

    useEffect(() => {
        const observerOptions = { threshold: 0.1 };

        const headlineObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setHeadlineVisible(true);
                    headlineObserver.disconnect();
                }
            });
        }, { ...observerOptions, rootMargin: '-100px' });

        const bottomObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setBottomVisible(true);
                    bottomObserver.disconnect();
                }
            });
        }, { ...observerOptions, rootMargin: '-50px' });

        if (headlineRef.current) headlineObserver.observe(headlineRef.current);
        if (bottomGroupRef.current) bottomObserver.observe(bottomGroupRef.current);

        return () => {
            headlineObserver.disconnect();
            bottomObserver.disconnect();
        };
    }, []);

    return (
        <section
            id="contact"
            className="relative min-h-[80vh] flex flex-col py-24 px-6 md:px-8 bg-background overflow-hidden"
        >
            <div className="w-full max-w-7xl mx-auto">
                {/* Section Header - Consistent with other sections */}
                <div className="w-full mb-16 md:mb-20">
                    <SectionHeaderAnimated number="06." title="Contact" />
                </div>

                {/* Main Content - Poster Layout */}
                <div className="flex-1 w-full flex flex-col justify-center items-center min-h-[50vh]">
                    {/* Headline with staggered word reveal */}
                    <div
                        ref={headlineRef}
                        className="flex flex-col items-center relative leading-none mb-12"
                    >
                        {/* Metadata label above headline */}
                        <span
                            className={`font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-0 text-muted-foreground mb-6 ${
                                headlineVisible ? 'contacts-stagger-item contacts-stagger-0' : ''
                            }`}
                        >
                            Get In Touch
                        </span>

                        {/* Main headline - Playfair italic for "Let's" */}
                        <span
                            className={`font-playfair italic text-[18vw] md:text-[10vw] leading-[0.8] text-foreground dark:mix-blend-screen select-none text-center relative opacity-0 ${
                                headlineVisible ? 'contacts-blur-reveal contacts-stagger-1' : ''
                            }`}
                        >
                            Let&apos;s
                        </span>

                        {/* Main headline - Urbanist bold for "TALK" */}
                        <span
                            className={`font-sans font-black text-[22vw] md:text-[12vw] leading-[0.8] text-gradient-primary tracking-tighter select-none text-center relative opacity-0 ${
                                headlineVisible ? 'contacts-blur-reveal contacts-stagger-2' : ''
                            }`}
                        >
                            TALK
                        </span>
                    </div>

                    {/* Bottom Group: Text & Dock with staggered reveal */}
                    <div
                        ref={bottomGroupRef}
                        className="flex flex-col items-center gap-8"
                    >
                        <p
                            className={`text-base md:text-xl font-light text-muted-foreground font-sans text-center max-w-md px-4 opacity-0 ${
                                bottomVisible ? 'contacts-spring-item contacts-bottom-0' : ''
                            }`}
                        >
                            Have a cool idea? Want to geek out over AI, or just want to say hi? Drop a line.
                        </p>

                        <div
                            className={`opacity-0 ${
                                bottomVisible ? 'contacts-spring-item contacts-bottom-1' : ''
                            }`}
                        >
                            <Dock className="mx-auto">
                                {contactLinks.map(({ href, ariaLabel, icon }) => (
                                    <DockIconLink key={ariaLabel} href={href} ariaLabel={ariaLabel} icon={icon} />
                                ))}
                            </Dock>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
