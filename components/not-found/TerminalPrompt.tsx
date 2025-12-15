'use client';

import { useState, useEffect } from 'react';

interface TerminalPromptProps {
    message: string;
}

export function TerminalPrompt({ message }: TerminalPromptProps) {
    const [displayText, setDisplayText] = useState('');
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        setDisplayText('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < message.length) {
                setDisplayText(message.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [message]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div className="font-mono text-sm md:text-base bg-black/80 dark:bg-black/90 rounded-lg px-4 py-3 border border-[hsl(var(--accent))]/30 shadow-lg">
            <span className="text-green-400">$</span>
            <span className="text-gray-300 ml-2">{displayText}</span>
            <span className={`ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'} text-[hsl(var(--accent))]`}>▌</span>
        </div>
    );
}
