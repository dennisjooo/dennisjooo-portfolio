"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { scrollToTop } from "@/lib/utils/scrollHelpers";

// Constants
const SCROLL_THRESHOLD = 20;

export const useClientReady = (): boolean => {
    const [isClientReady, setIsClientReady] = useState(false);

    useEffect(() => {
        setIsClientReady(true);
    }, []);

    return isClientReady;
};

interface HeroSectionState {
    isHeroSection: boolean;
    scrolled: boolean;
}

export const useHeroSectionState = (isClientReady: boolean, pathname: string): HeroSectionState => {
    const [state, setState] = useState<HeroSectionState>({
        isHeroSection: true,
        scrolled: false,
    });

    useEffect(() => {
        if (!isClientReady) return;

        let rafId: number | null = null;
        let lastScrollY = 0;

        const updateState = () => {
            const heroSection = document.getElementById("home");
            const isHeroSection = heroSection
                ? lastScrollY < heroSection.offsetTop + heroSection.offsetHeight
                : false;

            setState({
                isHeroSection,
                scrolled: lastScrollY > SCROLL_THRESHOLD,
            });
            rafId = null;
        };

        const handleScroll = () => {
            lastScrollY = window.scrollY;
            // Throttle to one update per frame
            if (rafId === null) {
                rafId = requestAnimationFrame(updateState);
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
        };
    }, [isClientReady, pathname]);

    return state;
};

interface UseSectionNavigationParams {
    isClientReady: boolean;
    pathname: string;
    closeMenu: () => void;
}

export const useSectionNavigation = (
    { isClientReady, pathname, closeMenu }: UseSectionNavigationParams
): ((sectionId: string) => void) => {
    const router = useRouter();

    return useCallback(
        (sectionId: string) => {
            if (!isClientReady) return;

            if (pathname === "/") {
                // On homepage: scroll to section instantly
                if (sectionId === "home") {
                    scrollToTop(true); // instant scroll
                } else {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: "auto" });
                }
            } else {
                router.push(`/#${sectionId}`);
            }

            closeMenu();
        },
        [closeMenu, isClientReady, pathname, router],
    );
};

interface NavbarStylesParams {
    isHeroSection: boolean;
    scrolled: boolean;
    isMenuOpen: boolean;
    pathname: string;
}

interface NavbarStyles {
    bgClass: string;
    navWidth: string;
    textColorClass: string;
}

export const useNavbarStyles = (
    { isHeroSection, scrolled, isMenuOpen, pathname }: NavbarStylesParams
): NavbarStyles =>
    useMemo(() => {
        // Use glass-panel when scrolled, menu open, or not in hero section
        const bgClass = !isHeroSection || scrolled || isMenuOpen ? "glass-panel" : "bg-transparent";

        // Wider navbar in hero section when not scrolled
        const navWidth =
            isHeroSection && !scrolled && pathname === "/"
                ? "w-11/12 lg:w-5/6"
                : "w-11/12 lg:w-3/4 xl:w-2/3";

        // Consistent text color across all states
        const textColorClass = "text-foreground";

        return { bgClass, navWidth, textColorClass };
    }, [isHeroSection, isMenuOpen, pathname, scrolled]);
