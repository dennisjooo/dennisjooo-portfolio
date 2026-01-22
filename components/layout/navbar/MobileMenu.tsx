"use client";

import Link from "next/link";
import { NavItem } from "@/data/navbarContent";

interface MobileMenuProps {
    navItems: NavItem[];
    isMenuOpen: boolean;
    onNavigate: (sectionId: string) => void;
    onToggle: (isOpen: boolean) => void;
    textColorClass: string;
}

// Style constants
const ITEM_BASE_CLASSES = "block w-full rounded-2xl px-5 py-3 text-xs uppercase tracking-widest font-bold transition-colors duration-200 ease-in-out text-center";
const HOVER_CLASSES = "hover:bg-black/5 dark:hover:bg-white/10";

// Animation constants
const ITEM_ANIMATION_BASE = "transition-[opacity,transform] duration-200 ease-out will-change-transform";

export const MobileMenu = ({
    navItems,
    isMenuOpen,
    onToggle,
    onNavigate,
    textColorClass,
}: MobileMenuProps) => {

    const handleToggleOff = () => onToggle(false);

    const handleNavigateClick = (item: NavItem) => () => {
        onNavigate(item.id);
        handleToggleOff();
    };

    return (
        <div
            className={`
                md:hidden w-full transition-[grid-template-rows,padding] duration-200 ease-in-out grid
                ${isMenuOpen ? "grid-rows-[1fr] pb-2" : "grid-rows-[0fr] pb-0"}
            `}
            aria-hidden={!isMenuOpen}
        >
            <div className="overflow-hidden">
                <nav aria-label="Mobile navigation" className="px-2 pb-2">
                    <ul className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const linkClassName = `${ITEM_BASE_CLASSES} ${HOVER_CLASSES} ${textColorClass}`;
                            const itemClassName = `${ITEM_ANIMATION_BASE} ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                                }`;

                            return (
                                <li key={item.id} className={itemClassName}>
                                    {item.href ? (
                                        <Link href={item.href} onClick={handleToggleOff} className={linkClassName}>
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleNavigateClick(item)}
                                            className={linkClassName}
                                            aria-label={`Navigate to ${item.label}`}
                                        >
                                            {item.label}
                                        </button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
};
