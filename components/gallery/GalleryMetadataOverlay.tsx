"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryListItem } from "@/lib/data/gallery";
import { GalleryExifPills } from "./GalleryExifPills";

/** Distance from viewport bottom (in px) that triggers the overlay reveal */
const HOVER_ZONE_HEIGHT = 120;
/** Time (ms) before the overlay auto-hides after leaving the zone */
const AUTO_HIDE_DELAY = 3000;

interface GalleryMetadataOverlayProps {
  image: GalleryListItem;
}

export function GalleryMetadataOverlay({ image }: GalleryMetadataOverlayProps) {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_DELAY);
  }, [clearTimer]);

  const show = useCallback(() => {
    clearTimer();
    setVisible(true);
  }, [clearTimer]);

  useEffect(() => {
    // Start initial auto-hide countdown
    timerRef.current = setTimeout(() => setVisible(false), AUTO_HIDE_DELAY);

    function handlePointerMove(e: MouseEvent) {
      const inZone =
        window.innerHeight - e.clientY <= HOVER_ZONE_HEIGHT;
      if (inZone) {
        show();
      } else {
        // Only schedule hide if currently visible and no timer is pending
        setVisible((prev) => {
          if (prev && !timerRef.current) {
            scheduleHide();
          }
          return prev;
        });
      }
    }

    function handleTouch() {
      // Toggle on touch
      setVisible((prev) => {
        if (prev) {
          clearTimer();
          return false;
        }
        scheduleHide();
        return true;
      });
    }

    document.addEventListener("mousemove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("touchstart", handleTouch, { passive: true });

    return () => {
      clearTimer();
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("touchstart", handleTouch);
    };
  }, [show, scheduleHide, clearTimer]);

  return (
    <>
      {/* Subtle bottom-edge indicator line — always visible when overlay is hidden */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center transition-opacity duration-500"
        style={{ opacity: visible ? 0 : 1 }}
      >
        <div className="mb-3 h-0.5 w-16 rounded-full bg-white/30" />
      </div>

      {/* Metadata overlay */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <div className="pointer-events-auto w-full max-w-2xl rounded-xl border border-white/10 bg-black/60 px-5 py-4 backdrop-blur-xl">
          <p className="font-caslon text-lg italic text-white">
            {image.title || "Untitled"}
          </p>
          {image.description ? (
            <p className="mt-1 font-sans text-sm leading-relaxed text-white/70">
              {image.description}
            </p>
          ) : null}
          <GalleryExifPills
            exif={image.exif}
            className="mt-3 [&_span]:border-white/15 [&_span]:bg-white/10 [&_span]:text-white/80"
          />
        </div>
      </div>
    </>
  );
}
