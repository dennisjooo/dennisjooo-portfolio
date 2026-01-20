"use client";

import { type ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";

interface CodeProps {
    inline?: boolean;
    className?: string;
    children?: ReactNode;
}

export const CodeBlock = ({ children, className }: CodeProps) => {
    const { copied, copyToClipboard } = useCopyToClipboard();
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeString = String(children).replace(/\n$/, "");

    const handleCopy = () => copyToClipboard(codeString);

    return (
        <div className="not-prose my-6">
            <div className="code-block-wrapper">
                {/* macOS-style window header */}
                <div className="code-block-header">
                    <div className="flex items-center space-x-3">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        {language && (
                            <span className="text-xs text-muted-foreground font-mono">
                                {language}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="code-copy-btn"
                        title="Copy code"
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
                <div className="overflow-x-auto">
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={language || "text"}
                        PreTag="div"
                        className="!m-0 !p-4 !bg-transparent text-sm leading-relaxed"
                    >
                        {codeString}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
};

export type { CodeProps };
