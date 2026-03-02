"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";

mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
        darkMode: true,
        background: "transparent",
        primaryColor: "#1e1e2e",
        primaryTextColor: "#cdd6f4",
        primaryBorderColor: "#585b70",
        lineColor: "#585b70",
        secondaryColor: "#313244",
        tertiaryColor: "#45475a",
    },
});

interface MermaidBlockProps {
    children: string;
}

export const MermaidBlock = ({ children }: MermaidBlockProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const { copied, copyToClipboard } = useCopyToClipboard();

    const handleCopy = () => copyToClipboard(children.trim());

    useEffect(() => {
        const render = async () => {
            if (!containerRef.current) return;

            try {
                const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
                const { svg } = await mermaid.render(id, children.trim());
                containerRef.current.innerHTML = svg;
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to render diagram");
            }
        };

        render();
    }, [children]);

    if (error) {
        return (
            <div className="not-prose my-6">
                <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
                    <p className="text-sm text-destructive font-mono">Mermaid Error: {error}</p>
                    <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">{children}</pre>
                </div>
            </div>
        );
    }

    return (
        <div className="not-prose my-6">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
                    <span className="text-xs text-muted-foreground font-mono">mermaid</span>
                    <button
                        onClick={handleCopy}
                        className="code-copy-btn"
                        title="Copy Mermaid source"
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
                </div>
                <div className="p-6 overflow-x-auto flex justify-center">
                    <div ref={containerRef} className="[&_svg]:max-w-full" />
                </div>
            </div>
        </div>
    );
};
