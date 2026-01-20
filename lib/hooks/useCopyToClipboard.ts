'use client';

import { useState, useCallback } from 'react';

interface UseCopyToClipboardResult {
    copied: boolean;
    copyToClipboard: (text: string) => Promise<boolean>;
}

interface UseCopyToClipboardOptions {
    resetDelay?: number;
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
    const { resetDelay = 2000 } = options;
    const [copied, setCopied] = useState(false);

    const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), resetDelay);
            return true;
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            return false;
        }
    }, [resetDelay]);

    return { copied, copyToClipboard };
}
