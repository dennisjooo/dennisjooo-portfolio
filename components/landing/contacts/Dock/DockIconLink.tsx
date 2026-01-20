import { DockIcon, type DockIconProps } from "./DockIcon";
import Link from "next/link";
import type { ReactNode } from "react";

interface DockIconLinkProps extends Partial<DockIconProps> {
    href: string;
    ariaLabel: string;
    icon: ReactNode;
}

export const DockIconLink: React.FC<DockIconLinkProps> = ({ href, ariaLabel, icon, ...dockProps }) => {
    return (
        <DockIcon
            className="transition-all duration-200"
            {...dockProps}
        >
            <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
                className="flex items-center justify-center size-full text-muted-foreground hover:text-primary transition-colors duration-200"
            >
                {icon}
            </Link>
        </DockIcon>
    );
};
