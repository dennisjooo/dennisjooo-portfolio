"use client";

interface NavLogoProps {
  onNavigate: (sectionId: string) => void;
}

export const NavLogo = ({ onNavigate }: NavLogoProps) => (
  <button
    onClick={() => onNavigate("home")}
    aria-label="Navigate to home"
    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground transition-colors duration-200"
  >
    <span className="-ml-[3px] font-caslon text-xs italic leading-none text-background">
      DJ
    </span>
  </button>
);
