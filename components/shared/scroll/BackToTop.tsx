"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTopWithRefresh } from "@/lib/utils/scrollHelpers";

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
      onClick={(e) => {
        scrollToTopWithRefresh();
        e.currentTarget.blur();
      }}
      className={`fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-sm border border-border bg-background text-muted-foreground transition-[opacity,transform,border-color,color,background-color] duration-200 ease-out active:border-foreground active:bg-foreground active:text-background sm:bottom-8 sm:right-8 [@media(hover:hover)_and_(pointer:fine)]:hover:border-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:text-background ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
      aria-label="Back to top"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUp className="size-4" strokeWidth={1.75} />
    </button>
  );
};

export default BackToTop;
