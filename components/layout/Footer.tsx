"use client";

import { siteToast } from "@/lib/ui/siteToast";
import { FOOTER_SECRET_ID } from "@/lib/easter-eggs/constants";
import { markSecretFound } from "@/lib/easter-eggs/unlock";

const FOOTER_COPY =
  "Built with curiosity. Found a secret? github.com/dennisjooo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleCopyrightClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!event.shiftKey) return;

    event.preventDefault();

    try {
      await navigator.clipboard.writeText(FOOTER_COPY);
      markSecretFound(FOOTER_SECRET_ID);
      siteToast.copied("You're one of us now.");
    } catch {
      siteToast.error("Failed to copy to clipboard");
    }
  };

  return (
    <footer className="relative z-40 w-full border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-2 px-6 py-8 text-center">
        <p className="font-serif text-sm text-foreground">
          <a
            href="https://dennisjooo.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer outline-none transition-colors hover:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            onClick={handleCopyrightClick}
          >
            © {currentYear} Dennis Jonathan
          </a>
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          Human being · Jakarta
        </p>
      </div>
    </footer>
  );
};

export default Footer;
