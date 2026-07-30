"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NavLogo } from "./NavLogo";
import { BurgerButton } from "./BurgerButton";
import { CommandMenuTrigger } from "./CommandMenuTrigger";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/theme";
import { navItems } from "@/lib/content/navbarContent";
import {
  useHeroSectionState,
  useNavbarStyles,
  useSectionNavigation,
} from "@/lib/hooks/nav/useNavbar";
import { useMounted } from "@/lib/hooks/ui/useMounted";

export const NavbarClient = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const isClientReady = useMounted();
  const { scrolled, isHeroSection } = useHeroSectionState(
    isClientReady,
    pathname,
  );

  const handleNavigation = useSectionNavigation({
    isClientReady,
    pathname,
    closeMenu: () => setIsMenuOpen(false),
  });

  const { bgClass, navWidth, textColorClass } = useNavbarStyles({
    isHeroSection,
    scrolled,
    isMenuOpen,
  });

  const isGlass = bgClass === "glass-panel";
  const noiseClass = isGlass ? "bg-noise" : "";

  const navbarContainerClasses = [
    "relative flex flex-col",
    bgClass,
    noiseClass,
    isMenuOpen ? "rounded-2xl" : "rounded-2xl md:rounded-full",
    "transition-all duration-200 ease-in-out overflow-hidden",
  ].join(" ");

  return (
    <nav
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transform transition-all duration-200 ease-in-out ${navWidth}`}
    >
      <div className={navbarContainerClasses}>
        <div className="flex min-h-[3rem] items-center gap-2 px-4 py-3">
          <NavLogo
            onNavigate={handleNavigation}
            showCircle={!isHeroSection || scrolled || isMenuOpen}
          />
          <div className="ml-auto flex items-center gap-2">
            <CommandMenuTrigger
              textColorClass={textColorClass}
              scrolled={scrolled}
            />
            <ThemeToggle textColorClass={textColorClass} scrolled={scrolled} />
            <BurgerButton
              isMenuOpen={isMenuOpen}
              onToggle={(nextIsMenuOpen) => setIsMenuOpen(nextIsMenuOpen)}
              textColorClass={textColorClass}
            />
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
