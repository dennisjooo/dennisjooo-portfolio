"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Components } from "react-markdown";
import { CodeBlock, type CodeProps } from "./CodeBlock";
import { MermaidBlock } from "./MermaidBlock";
import { PhotoView } from "react-photo-view";
import { NOISE_OVERLAY_HEAVY } from "@/lib/constants/noiseOverlay";

export const markdownComponents: Components = {
    h1: ({ children, ...props }) => (
        <h1 className="font-urbanist font-black text-3xl md:text-4xl mb-6 text-foreground border-b border-border pb-4 tracking-tight" {...props}>
            {children}
        </h1>
    ),
    h2: ({ children, ...props }) => (
        <h2 className="font-playfair italic text-2xl md:text-3xl mb-4 mt-14 text-foreground tracking-tight flex items-center gap-4" {...props}>
            <span className="w-[2px] h-8 bg-accent rounded-full shrink-0" />
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

    p: ({ children, node }) => {
        const hasImage = node?.children?.some(
            (child) => child.type === 'element' && child.tagName === 'img'
        );
        if (hasImage) {
            return <div className="mb-5">{children}</div>;
        }
        return <p className="mb-5 text-muted-foreground leading-relaxed">{children}</p>;
    },
    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
    blockquote: ({ children }) => (
        <blockquote className="relative my-10 mx-auto max-w-2xl py-8 px-6 md:px-10 border-none bg-transparent text-center [&>p]:before:content-none [&>p]:after:content-none [&>p]:mb-0 [&>p]:text-foreground [&>p]:font-playfair [&>p]:italic [&>p]:text-lg [&>p]:md:text-xl [&>p]:leading-relaxed">
            <div className="mx-auto w-8 h-px bg-accent/60 mb-6" />
            {children}
            <div className="mx-auto w-8 h-px bg-accent/60 mt-6" />
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
        const match = /language-(\w+)/.exec(className || "");
        const language = match ? match[1] : "";

        if (language === "mermaid") {
            return <MermaidBlock>{codeString}</MermaidBlock>;
        }

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

        let cleanSrc = src as string;
        let imgWidth: number | undefined;
        let imgHeight: number | undefined;

        const dimMatch = cleanSrc.match(/#dim=(\d*)x(\d*)$/) || cleanSrc.match(/\s+=(\d*)x(\d*)$/);
        if (dimMatch) {
            cleanSrc = cleanSrc.replace(/#dim=\d*x\d*$/, '').replace(/\s+=\d*x\d*$/, '');
            if (dimMatch[1]) imgWidth = parseInt(dimMatch[1], 10);
            if (dimMatch[2]) imgHeight = parseInt(dimMatch[2], 10);
        }

        const hasDimensions = imgWidth || imgHeight;
        const isFullWidth = !hasDimensions;

        return (
            <span className="flex justify-center my-10 group">
                <span className={hasDimensions ? "inline-block" : "block w-full"}>
                    <PhotoView src={cleanSrc}>
                        <span className="relative block rounded-xl overflow-hidden border border-border cursor-zoom-in shadow-md">
                            <span
                                className="absolute inset-0 z-10 pointer-events-none opacity-15 mix-blend-overlay"
                                style={{ backgroundImage: NOISE_OVERLAY_HEAVY }}
                            />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={cleanSrc}
                                alt={alt ?? ''}
                                loading="lazy"
                                className="h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                                style={{
                                    width: imgWidth ? `${imgWidth}px` : '100%',
                                    ...(imgHeight ? { height: `${imgHeight}px` } : {}),
                                }}
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
