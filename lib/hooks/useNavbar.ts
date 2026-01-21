"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
    const [state, setState] = useState<HeroSectionState>(() => ({
        isHeroSection: pathname === "/",
        scrolled: false,
    }));

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

export const useScrollToSavedSection = (isClientReady: boolean, pathname: string) => {
    useEffect(() => {
        if (!isClientReady || pathname !== "/") return;

        try {
            const sectionToScroll = sessionStorage.getItem("scrollToSection");
            if (sectionToScroll) {
                const scrollToElement = () => {
                    const element = document.getElementById(sectionToScroll);
                    if (element) {
                        // Small delay to ensure layout is stable
                        setTimeout(() => {
                            element.scrollIntoView({ behavior: "auto" });
                            sessionStorage.removeItem("scrollToSection");
                        }, 100);
                        return true;
                    }
                    return false;
                };

                // Try immediately
                if (!scrollToElement()) {
                    // Retry every 100ms for up to 2 seconds
                    const intervalId = setInterval(() => {
                        if (scrollToElement()) {
                            clearInterval(intervalId);
                        }
                    }, 100);

                    // Stop retrying after 2 seconds
                    const timeoutId = setTimeout(() => {
                        clearInterval(intervalId);
                        sessionStorage.removeItem("scrollToSection");
                    }, 2000);

                    return () => {
                        clearInterval(intervalId);
                        clearTimeout(timeoutId);
                    };
                }
            }
        } catch (error) {
            console.error("Error accessing sessionStorage:", error);
        }
    }, [isClientReady, pathname]);
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

    // Track the current section when scrolling on the homepage
    useEffect(() => {
        if (!isClientReady || pathname !== "/") return;

        let rafId: number | null = null;

        const updateSection = () => {
            const sections = ["home", "about", "skills", "contact"];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // If the section is in view (top is above middle of viewport)
                    if (rect.top <= window.innerHeight / 2 && rect.bottom > 0) {
                        try {
                            sessionStorage.setItem("currentSection", section);
                        } catch (error) {
                            console.error("Error saving current section:", error);
                        }
                        break;
                    }
                }
            }
            rafId = null;
        };

        const handleScroll = () => {
            // Throttle to one update per frame
            if (rafId === null) {
                rafId = requestAnimationFrame(updateSection);
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

    return useCallback(
        (sectionId: string) => {
            if (!isClientReady) return;

            if (pathname === "/") {
                // If on homepage and clicking home, scroll to top
                if (sectionId === "home") {
                    window.scrollTo({ top: 0, behavior: "auto" });
                } else {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: "auto" });
                }
            } else {
                try {
                    // If clicking home from another page, go to the last visited section
                    if (sectionId === "home") {
                        const lastSection = sessionStorage.getItem("currentSection");
                        sessionStorage.setItem("scrollToSection", lastSection || "home");
                    } else {
                        sessionStorage.setItem("scrollToSection", sectionId);
                    }
                    // Clear any saved scroll position for home so it doesn't conflict with our explicit jump
                    sessionStorage.removeItem("scroll-pos-/");
                    router.push("/");
                } catch (error) {
                    console.error("Error accessing sessionStorage:", error);
                    router.push("/");
                }
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
        const isHeroForNav = pathname === "/" ? isHeroSection : false;

        // Use glass-panel when scrolled, menu open, or not in hero section
        const bgClass = !isHeroForNav || scrolled || isMenuOpen ? "glass-panel" : "bg-transparent";

        // Wider navbar in hero section when not scrolled
        const navWidth =
            isHeroForNav && !scrolled && pathname === "/"
                ? "w-11/12 lg:w-5/6"
                : "w-11/12 lg:w-3/4 xl:w-2/3";

        // Consistent text color across all states
        const textColorClass = "text-foreground";

        return { bgClass, navWidth, textColorClass };
    }, [isHeroSection, isMenuOpen, pathname, scrolled]);
