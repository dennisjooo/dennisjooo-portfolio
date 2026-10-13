import { DockIcon } from "./DockIcon";
import Link from "next/link";
import type { ReactNode } from "react";

interface DockIconLinkProps {
  href: string;
  ariaLabel: string;
  icon: ReactNode;
}

export function DockIconLink({ href, ariaLabel, icon }: DockIconLinkProps) {
  return (
    <DockIcon>
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="flex size-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground"
      >
        {icon}
      </Link>
    </DockIcon>
  );
}