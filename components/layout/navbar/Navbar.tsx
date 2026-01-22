"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { BurgerButton } from "./BurgerButton";
import { DesktopMenu } from "./DesktopMenu";
import { CommandMenuTrigger } from "./CommandMenuTrigger";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/theme";
import { navItems } from "@/data/navbarContent";
import {
    useClientReady,
    useHeroSectionState,
    useNavbarStyles,
    useSectionNavigation,
} from "@/lib/hooks/useNavbar";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname() ?? "/";
    const isClientReady = useClientReady();
    const { scrolled, isHeroSection } = useHeroSectionState(isClientReady, pathname);

    const handleNavigation = useSectionNavigation({
        isClientReady,
        pathname,
        closeMenu: () => setIsMenuOpen(false),
    });

    const { bgClass, navWidth, textColorClass } = useNavbarStyles({
        isHeroSection,
        scrolled,
        isMenuOpen,
        pathname,
    });

    const isGlass = bgClass === "glass-panel";
    const noiseClass = isGlass ? "bg-noise" : "";

    const navbarContainerClasses = [
        "relative flex flex-col",
        bgClass,
        noiseClass,
        isMenuOpen ? "rounded-2xl" : "rounded-2xl md:rounded-full",
        "transition-all duration-200 ease-in-out overflow-hidden"
    ].join(" ");

    return (
        <nav
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200 ease-in-out ${navWidth}`}
        >
            <div
                className={navbarContainerClasses}
            >
                <div className="flex justify-between items-center px-4 py-3 min-h-[3rem]">
                    <BurgerButton
                        isMenuOpen={isMenuOpen}
                        onToggle={(nextIsMenuOpen) => setIsMenuOpen(nextIsMenuOpen)}
                        textColorClass={textColorClass}
                    />
                    <DesktopMenu
                        navItems={navItems.filter(item => ['home', 'about', 'projects', 'blogs'].includes(item.id))}
                        scrolled={scrolled}
                        onNavigate={handleNavigation}
                        textColorClass={textColorClass}
                    />
                    <CommandMenuTrigger textColorClass={textColorClass} scrolled={scrolled} />
                    <div className="ml-2">
                        <ThemeToggle textColorClass={textColorClass} scrolled={scrolled} />
                    </div>
                </div>
                <MobileMenu
                    navItems={navItems}
                    isMenuOpen={isMenuOpen}
                    onNavigate={handleNavigation}
                    onToggle={(nextIsMenuOpen) => setIsMenuOpen(nextIsMenuOpen)}
                    textColorClass={textColorClass}
                />
            </div>
        </nav>
    );
};

export default Navbar;
