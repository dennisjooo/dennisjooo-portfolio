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
    className={`rounded-sm px-3 py-1.5 font-mono text-xs transition-colors duration-200 hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] md:hidden ${textColorClass}`}
    onClick={() => onToggle(!isMenuOpen)}
    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
    aria-expanded={isMenuOpen}
  >
    {isMenuOpen ? "Close" : "Menu"}
  </button>
);
