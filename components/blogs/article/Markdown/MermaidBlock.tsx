"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { CopyButton } from "@/components/shared/CopyButton";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "transparent",
    primaryColor: "#1a1a1a",
    primaryTextColor: "#d4d4d4",
    primaryBorderColor: "#525252",
    lineColor: "#525252",
    secondaryColor: "#262626",
    tertiaryColor: "#404040",
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
        setError(
          err instanceof Error ? err.message : "Failed to render diagram",
        );
      }
    };

    render();
  }, [children]);

  if (error) {
    return (
      <div className="not-prose my-6">
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <p className="font-mono text-sm text-destructive">
            Mermaid Error: {error}
          </p>
          <pre className="mt-2 overflow-x-auto text-xs text-muted-foreground">
            {children}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            mermaid
          </span>
          <CopyButton text={children.trim()} title="Copy Mermaid source" />
        </div>
        <div className="flex justify-center overflow-x-auto p-6">
          <div ref={containerRef} className="[&_svg]:max-w-full" />
        </div>
      </div>
    </div>
  );
};
