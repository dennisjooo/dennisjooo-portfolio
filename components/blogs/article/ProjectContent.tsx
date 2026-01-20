'use client';

import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { markdownComponents } from './Markdown/MarkdownComponents';
import { scrollToCentered } from '@/lib/utils/scrollHelpers';
import {
    HASH_SCROLL_RETRY_DELAY,
    HASH_SCROLL_MAX_RETRIES
} from '@/lib/constants/scrolling';

interface ProjectContentProps {
    content: string;
}

export default function ProjectContent({ content }: ProjectContentProps) {
    useEffect(() => {
        // Handle initial hash navigation
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);

            // Try to find and scroll to element with retries
            const scrollToElement = (retries = 0) => {
                const element = document.getElementById(hash);
                if (element) {
                    // Use instant scroll (no animation) for initial page load
                    // This prevents jarring scroll-from-top effect
                    scrollToCentered(element, false);
                } else if (retries < HASH_SCROLL_MAX_RETRIES) {
                    // Retry if element not found yet (content might be rendering)
                    setTimeout(() => scrollToElement(retries + 1), HASH_SCROLL_RETRY_DELAY);
                }
            };

            // Small delay to ensure content has rendered
            requestAnimationFrame(() => {
                scrollToElement();
            });
        }
    }, [content]); // Re-run if content changes, though usually static per page load

    return (
        <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-gray dark:prose-invert">
            <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeSlug, rehypeKatex]}
            >
                {content}
            </ReactMarkdown>
        </article>
    );
}
