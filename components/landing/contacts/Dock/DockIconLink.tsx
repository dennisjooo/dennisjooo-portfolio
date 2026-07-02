import { DockIcon, type DockIconProps } from "./DockIcon";
import Link from "next/link";
import type { ReactNode } from "react";
interface DockIconLinkProps extends Partial<DockIconProps> {
  href: string;
  ariaLabel: string;
  icon: ReactNode;
}

export const DockIconLink: React.FC<DockIconLinkProps> = ({
  href,
  ariaLabel,
  icon,
  ...dockProps
}) => {
  return (
    <DockIcon {...dockProps}>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="flex size-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-primary"
      >
        {icon}
      </Link>
    </DockIcon>
  );
};
