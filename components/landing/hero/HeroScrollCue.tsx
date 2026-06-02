'use client';

import { useEffect, useState } from 'react';
import { heroScrollCueBaseClassName, heroScrollCueStyle } from './heroScrollCueStyles';

const SCROLL_THRESHOLD = 48;
const MOBILE_BREAKPOINT = 1024;

export function HeroScrollCue() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const update = () => {
            const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
            const inHero = window.scrollY < SCROLL_THRESHOLD;
            setVisible(isMobile && inHero);
        };

        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`lg:hidden ${heroScrollCueBaseClassName}`}
            style={heroScrollCueStyle}
            aria-hidden="true"
        >
            Scroll to Explore
        </div>
    );
}
