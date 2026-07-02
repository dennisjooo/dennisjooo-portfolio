"use client";

import { BsList, BsX } from "react-icons/bs";

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
    className={`transition-transform duration-200 md:hidden ${textColorClass}`}
    onClick={() => onToggle(!isMenuOpen)}
    aria-label="Toggle menu"
    aria-expanded={isMenuOpen}
  >
    {isMenuOpen ? <BsX size={24} /> : <BsList size={24} />}
  </button>
);
