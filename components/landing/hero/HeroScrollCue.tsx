'use client';

import { useEffect } from 'react';

const SCROLL_CUE_CLASSNAME =
    'font-mono text-[10px] md:text-xs lg:text-sm tracking-widest uppercase text-foreground/50 animate-fade-in shrink-0';

const SCROLL_CUE_STYLE = {
    writingMode: 'vertical-rl' as const,
    animationDelay: '1200ms',
};

const MOBILE_MEDIA = '(max-width: 1023px)';
const HERO_VISIBILITY_SLACK = 100;

function isInHeroSection(): boolean {
    const home = document.getElementById('home');
    if (!home) return true;
    return home.getBoundingClientRect().bottom > HERO_VISIBILITY_SLACK;
}

export function HeroScrollCue() {
    useEffect(() => {
        const cue = document.getElementById('hero-scroll-cue-mobile');
        if (!cue) return;

        const mobileQuery = window.matchMedia(MOBILE_MEDIA);

        const update = () => {
            const show = mobileQuery.matches && isInHeroSection();
            cue.classList.toggle('hidden', !show);
            cue.setAttribute('aria-hidden', show ? 'false' : 'true');
        };

        requestAnimationFrame(update);
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        window.visualViewport?.addEventListener('resize', update);
        window.visualViewport?.addEventListener('scroll', update);
        mobileQuery.addEventListener('change', update);

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
            window.visualViewport?.removeEventListener('resize', update);
            window.visualViewport?.removeEventListener('scroll', update);
            mobileQuery.removeEventListener('change', update);
        };
    }, []);

    return (
        <>
            <div
                className={`hidden lg:block ${SCROLL_CUE_CLASSNAME}`}
                style={SCROLL_CUE_STYLE}
            >
                Scroll to Explore
            </div>

            <div
                id="hero-scroll-cue-mobile"
                className={`lg:hidden ${SCROLL_CUE_CLASSNAME}`}
                style={SCROLL_CUE_STYLE}
                aria-hidden="false"
            >
                Scroll to Explore
            </div>
        </>
    );
}
