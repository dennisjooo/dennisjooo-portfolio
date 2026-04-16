"use client";

import React from "react";

interface MarqueeProps {
    children: React.ReactNode;
    /** Duration in seconds for one full cycle. Lower = faster. */
    speed?: number;
    /** Scroll direction: 'left' or 'right' */
    direction?: "left" | "right";
    /** Whether to pause on hover */
    pauseOnHover?: boolean;
    className?: string;
}

/**
 * Pure CSS infinite marquee. Runs entirely on the compositor thread
 * via CSS `@keyframes` + `transform: translateX`, so zero main-thread cost.
 */
export function Marquee({
    children,
    speed = 40,
    direction = "left",
    pauseOnHover = true,
    className = "",
}: MarqueeProps) {
    const animationDirection = direction === "left" ? "normal" : "reverse";

    return (
        <div
            className={`marquee-container ${pauseOnHover ? "marquee-pause-hover" : ""} ${className}`}
            style={
                {
                    "--marquee-duration": `${speed}s`,
                    "--marquee-direction": animationDirection,
                } as React.CSSProperties
            }
        >
            {/* Two copies: animate from 0 → -50%, then the second copy fills the gap */}
            <div className="marquee-track">
                <div className="marquee-content" aria-hidden="false">
                    {children}
                </div>
                <div className="marquee-content" aria-hidden="true">
                    {children}
                </div>
            </div>
        </div>
    );
}
