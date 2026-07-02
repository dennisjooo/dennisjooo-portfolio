"use client";

import { m } from "@/components/motion";
import { useScroll, useSpring } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted/30">
      <m.div
        className="bg-gradient-accent h-full origin-left"
        style={{
          scaleX,
          boxShadow: "0 0 10px var(--accent-shadow)",
        }}
      />
    </div>
  );
}
