"use client";

interface BurgerButtonProps {
  isMenuOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  textColorClass: string;
}

export const BurgerButton = ({
  isMenuOpen,
  onToggle,
  textColorClass,
}: BurgerButtonProps) => (
  <button
    className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/10 md:hidden ${textColorClass}`}
    onClick={() => onToggle(!isMenuOpen)}
    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
    aria-expanded={isMenuOpen}
  >
    {isMenuOpen ? "Close" : "Menu"}
  </button>
);
