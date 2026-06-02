'use client';

import { useEffect } from 'react';
import { heroScrollCueBaseClassName, heroScrollCueStyle } from './heroScrollCueStyles';

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
        <div
            id="hero-scroll-cue-mobile"
            className={`lg:hidden ${heroScrollCueBaseClassName}`}
            style={heroScrollCueStyle}
            aria-hidden="false"
        >
            Scroll to Explore
        </div>
    );
}
