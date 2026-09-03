"use client";

import { m } from "@/components/motion";
import { useScroll, useSpring, useTransform } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const width = useTransform(scaleX, (value) => `${value * 100}%`);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted/30">
      <m.div className="h-full overflow-hidden" style={{ width }}>
        <div className="h-full w-full bg-gradient-to-r from-foreground from-90% to-transparent" />
      </m.div>
    </div>
  );
}
