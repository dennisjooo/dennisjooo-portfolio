"use client";

import { useConsoleEasterEgg } from "@/lib/hooks/useConsoleEasterEgg";

/**
 * Easter Eggs Provider - Initializes all easter eggs for the site
 * This component should be included in the layout to enable easter eggs globally
 */
export function EasterEggs() {
    // Initialize console ASCII art easter egg
    useConsoleEasterEgg();

    // This component doesn't render anything visible
    return null;
}
