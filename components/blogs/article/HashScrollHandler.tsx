'use client';

import { useEffect } from 'react';
import { scrollToCentered } from '@/lib/utils/scrollHelpers';
import {
    HASH_SCROLL_RETRY_DELAY,
    HASH_SCROLL_MAX_RETRIES
} from '@/lib/constants/scrolling';

export default function HashScrollHandler() {
    useEffect(() => {
        // Handle initial hash navigation
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);

            // Try to find and scroll to element with retries
            const scrollToElement = (retries = 0) => {
                const element = document.getElementById(hash);
                if (element) {
                    // Use instant scroll (no animation) for initial page load
                    // This prevents jarring scroll-from-top effect
                    scrollToCentered(element, false);
                } else if (retries < HASH_SCROLL_MAX_RETRIES) {
                    // Retry if element not found yet (content might be rendering)
                    setTimeout(() => scrollToElement(retries + 1), HASH_SCROLL_RETRY_DELAY);
                }
            };

            // Small delay to ensure content has rendered
            requestAnimationFrame(() => {
                scrollToElement();
            });
        }
    }, []); // Run once on mount

    return null;
}
