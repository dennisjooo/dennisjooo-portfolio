'use client';

import { useState, useEffect } from 'react';

interface BlinkingCursorProps {
    /** The cursor character to display. Defaults to '▌' */
    cursor?: string;
    /** Blink interval in milliseconds. Defaults to 530ms */
    interval?: number;
    /** Additional CSS classes */
    className?: string;
}

export function BlinkingCursor({
    cursor = '▌',
    interval = 530,
    className = '',
}: BlinkingCursorProps) {
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, interval);
        return () => clearInterval(cursorInterval);
    }, [interval]);

    return (
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity ${className}`}>
            {cursor}
        </span>
    );
}
