"use client";

import { m } from "@/components/motion";
import { useScroll, useSpring, useTransform } from "framer-motion";

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const width = useTransform(scaleX, (value) => `${value * 100}%`);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-0.5">
      <m.div className="h-full overflow-hidden" style={{ width }}>
        <div className="progress-bar-fill" />
      </m.div>
    </div>
  );
}
