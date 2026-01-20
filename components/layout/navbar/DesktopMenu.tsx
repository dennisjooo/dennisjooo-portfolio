"use client";

import Link from "next/link";
import { NavItem } from "@/data/navbarContent";

interface DesktopMenuProps {
    navItems: NavItem[];
    scrolled: boolean;
    onNavigate: (sectionId: string) => void;
    textColorClass: string;
}

// Style constants
const BASE_CLASSES = "w-full md:w-auto px-4 py-2 rounded-xl md:rounded-full transition-colors duration-300 ease-in-out uppercase tracking-widest text-xs font-bold";
const HOVER_SCROLLED = "hover:bg-black/5 dark:hover:bg-white/10";
const HOVER_DEFAULT = "hover:bg-black/10 dark:hover:bg-white/10";

export const DesktopMenu = ({ navItems, scrolled, onNavigate, textColorClass }: DesktopMenuProps) => (
    <ul className="hidden md:flex md:flex-row justify-around items-center w-full">
        {navItems.map((item) => {
            const hoverClass = scrolled ? HOVER_SCROLLED : HOVER_DEFAULT;
            const className = `${BASE_CLASSES} ${textColorClass} ${hoverClass}`;

            return (
                <li key={item.id} className="w-full md:w-auto font-semibold">
                    {item.href ? (
                        <Link href={item.href} className={className}>
                            {item.label}
                        </Link>
                    ) : (
                        <button
                            onClick={() => onNavigate(item.id)}
                            className={className}
                            aria-label={`Navigate to ${item.label}`}
                        >
                            {item.label}
                        </button>
                    )}
                </li>
            );
        })}
    </ul>
);
