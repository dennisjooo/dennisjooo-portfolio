"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTopWithRefresh } from "@/lib/utils/scrollHelpers";

/** Floating button that appears after scrolling down; scrolls the page back to top. */
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToTopWithRefresh()}
      className={`fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-full border border-border bg-background/85 text-muted-foreground backdrop-blur-md transition-[opacity,transform,border-color,color,background-color] duration-200 ease-out hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-8 sm:right-8 ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
      aria-label="Back to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUp className="size-4" strokeWidth={1.75} />
    </button>
  );
};

export default BackToTop;
