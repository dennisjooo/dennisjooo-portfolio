"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Components } from "react-markdown";
import { CodeBlock, type CodeProps } from "./CodeBlock";
import { PhotoView } from "react-photo-view";

export const markdownComponents: Components = {
    // Headings - Editorial Typography
    h1: ({ children, ...props }) => (
        <h1 className="font-urbanist font-black text-3xl md:text-4xl mb-6 text-foreground border-b border-border pb-4 tracking-tight" {...props}>
            {children}
        </h1>
    ),
    h2: ({ children, ...props }) => (
        <h2 className="font-urbanist font-bold text-2xl md:text-3xl mb-4 mt-12 text-foreground tracking-tight" {...props}>
            {children}
        </h2>
    ),
    h3: ({ children, ...props }) => (
        <h3 className="font-urbanist font-bold text-xl md:text-2xl mb-3 mt-8 text-foreground tracking-tight" {...props}>
            {children}
        </h3>
    ),
    h4: ({ children, ...props }) => (
        <h4 className="font-urbanist font-bold text-lg md:text-xl mb-2 mt-6 text-foreground tracking-tight" {...props}>
            {children}
        </h4>
    ),

    // Text elements
    p: ({ children }) => {
        return <p className="mb-5 text-muted-foreground leading-relaxed">{children}</p>;
    },
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
    blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-accent pl-6 my-6 italic text-muted-foreground bg-muted/30 py-4 pr-4 rounded-r-lg">
            {children}
        </blockquote>
    ),

    // Lists
    ul: ({ children }) => (
        <ul className="list-disc list-inside mb-5 text-muted-foreground space-y-2 leading-relaxed">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal list-inside mb-5 text-muted-foreground space-y-2 leading-relaxed">{children}</ol>
    ),
    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,

    // Code
    code: ({ inline, children, className }: CodeProps) => {
        const codeString = String(children);

        const isInlineCode =
            inline === true ||
            (!className && !codeString.includes("\n") && codeString.length < 100);

        if (isInlineCode) {
            return (
                <code className="bg-muted rounded px-2 py-1 text-sm font-mono text-accent border border-border">
                    {children}
                </code>
            );
        }

        return <CodeBlock className={className}>{children}</CodeBlock>;
    },
    pre: ({ children }) => <>{children}</>,

    // Tables - Editorial Style
    table: ({ children }) => (
        <div className="not-prose my-8">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <table className="min-w-full">{children}</table>
            </div>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-muted border-b border-border">{children}</thead>
    ),
    tbody: ({ children }) => (
        <tbody className="divide-y divide-border">{children}</tbody>
    ),
    tr: ({ children }) => <tr className="hover:bg-muted/50 transition-colors">{children}</tr>,
    th: ({ children }) => (
        <th className="px-6 py-4 text-left font-urbanist font-bold text-foreground text-sm tracking-wide uppercase">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="px-6 py-4 text-muted-foreground text-sm">{children}</td>
    ),

    // Media - With Noise Overlay
    img: ({ src, alt, title, ...rest }: ComponentPropsWithoutRef<"img">) => {
        if (!src) {
            return null;
        }

        return (
            <span className="block my-8 group">
                <PhotoView src={src as string}>
                    <span className="relative block rounded-xl overflow-hidden border border-border cursor-zoom-in">
                        {/* Noise Overlay */}
                        <span
                            className="absolute inset-0 z-10 pointer-events-none opacity-15 mix-blend-overlay"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                            }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={alt ?? ''}
                            loading="lazy"
                            className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                            {...rest}
                        />
                    </span>
                </PhotoView>
                {title ? (
                    <span className="block mt-3 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {title}
                    </span>
                ) : null}
            </span>
        );
    },
    video: ({
        src,
        controls,
        autoPlay,
        loop,
        muted,
        children,
        poster,
        title,
        ...rest
    }: ComponentPropsWithoutRef<"video">) => {
        if (!src && !children) {
            return null;
        }

        const showControls = controls ?? true;

        return (
            <figure className="my-8">
                <div className="relative rounded-xl overflow-hidden border border-border">
                    <video
                        className="w-full"
                        controls={showControls}
                        autoPlay={autoPlay}
                        loop={loop}
                        muted={muted}
                        poster={poster}
                        {...rest}
                    >
                        {src ? <source src={src as string} /> : null}
                        {children}
                    </video>
                </div>
                {title ? (
                    <figcaption className="mt-3 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {title}
                    </figcaption>
                ) : null}
            </figure>
        );
    },
    iframe: ({
        src,
        title,
        width,
        height,
        allow,
        allowFullScreen,
        ...rest
    }: ComponentPropsWithoutRef<"iframe">) => {
        if (!src) {
            return null;
        }

        return (
            <div className="my-8">
                <div className="relative w-full overflow-hidden rounded-xl border border-border">
                    <div className="aspect-video">
                        <iframe
                            src={src}
                            title={title}
                            width={width}
                            height={height}
                            allow={allow}
                            allowFullScreen={allowFullScreen}
                            className="w-full h-full"
                            loading="lazy"
                            {...rest}
                        />
                    </div>
                </div>
            </div>
        );
    },
    audio: ({
        src,
        controls,
        autoPlay,
        loop,
        muted,
        children,
        title,
        ...rest
    }: ComponentPropsWithoutRef<"audio">) => {
        if (!src && !children) {
            return null;
        }

        const showControls = controls ?? true;

        return (
            <figure className="my-8">
                <div className="rounded-xl border border-border p-4 bg-muted/30">
                    <audio
                        className="w-full"
                        controls={showControls}
                        autoPlay={autoPlay}
                        loop={loop}
                        muted={muted}
                        {...rest}
                    >
                        {src ? <source src={src as string} /> : null}
                        {children}
                    </audio>
                </div>
                {title ? (
                    <figcaption className="mt-3 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {title}
                    </figcaption>
                ) : null}
            </figure>
        );
    },
};
