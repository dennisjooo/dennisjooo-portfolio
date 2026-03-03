'use client';

import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
    text: string;
    title?: string;
    className?: string;
}

export const CopyButton = ({ text, title = 'Copy', className }: CopyButtonProps) => {
    const { copied, copyToClipboard } = useCopyToClipboard();

    return (
        <button
            onClick={() => copyToClipboard(text)}
            className={cn('code-copy-btn', className)}
            title={title}
        >
            {copied ? (
                <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z" />
                        <path d="M6 3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2 3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
                    </svg>
                    <span>Copy</span>
                </>
            )}
        </button>
    );
};
