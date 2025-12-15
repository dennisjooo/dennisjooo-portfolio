'use client';

import { BlinkingCursor } from '@/components/shared/BlinkingCursor';
import { useTypingEffect } from '@/lib/hooks/useTypingEffect';

interface TerminalPromptProps {
    messages: string[];
}

export function TerminalPrompt({ messages }: TerminalPromptProps) {
    const displayText = useTypingEffect(messages);

    return (
        <div className="font-mono text-sm md:text-base bg-black/80 dark:bg-black/90 rounded-lg px-4 py-3 border border-[hsl(var(--accent))]/30 shadow-lg">
            <span className="text-green-400">$</span>
            <span className="text-gray-300 ml-2">{displayText}</span>
            <BlinkingCursor className="ml-0.5 text-[hsl(var(--accent))]" />
        </div>
    );
}

