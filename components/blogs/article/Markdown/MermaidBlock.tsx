"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

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
            <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto flex justify-center">
                <div ref={containerRef} className="[&_svg]:max-w-full" />
            </div>
        </div>
    );
};
