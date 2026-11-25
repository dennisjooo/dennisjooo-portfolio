"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NavLogo } from "./NavLogo";
import { BurgerButton } from "./BurgerButton";
import { CommandMenuTrigger } from "./CommandMenuTrigger";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "@/components/theme";
import { useReducedMotion } from "@/components/motion";
import { navItems } from "@/lib/content/navbarContent";
import { useHeroSectionState } from "@/lib/hooks/nav/useHeroSectionState";
import { useNavbarStyles } from "@/lib/hooks/nav/useNavbarStyles";
import { useSectionNavigation } from "@/lib/hooks/nav/useSectionNavigation";
import { useMounted } from "@/lib/hooks/ui/useMounted";

export default function NavbarClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const isClientReady = useMounted();
  const prefersReducedMotion = useReducedMotion();
  const { scrolled, isHeroSection, isNavbarVisible } = useHeroSectionState(
    isClientReady,
    pathname,
    {
      isMenuOpen,
      prefersReducedMotion: prefersReducedMotion ?? false,
    },
  );

  const handleNavigation = useSectionNavigation({
    isClientReady,
    pathname,
    closeMenu: () => setIsMenuOpen(false),
  });

  const { bgClass, navWidth, textColorClass, showMarkFill } = useNavbarStyles({
    isHeroSection,
    scrolled,
    isMenuOpen,
  });

  const visibilityClass = isNavbarVisible
    ? "translate-y-0 opacity-100"
    : "-translate-y-[calc(100%+1.25rem)] opacity-0 pointer-events-none";

  return (
    <nav
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transform transition-[opacity,transform] duration-200 ease-out ${navWidth} ${visibilityClass}`}
    >
      <div
        className={`relative flex flex-col overflow-hidden rounded-sm border ${bgClass}`}
      >
        <div className="flex min-h-12 items-center gap-2 px-4 py-2">
          <NavLogo onNavigate={handleNavigation} showCircle={showMarkFill} />
          <div className="ml-auto flex items-center gap-1">
            <CommandMenuTrigger
              textColorClass={textColorClass}
              scrolled={scrolled}
            />
            <ThemeToggle
              className="hidden md:flex"
              textColorClass={textColorClass}
              scrolled={scrolled}
            />
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
}
