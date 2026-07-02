"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Components } from "react-markdown";
import { CodeBlock, type CodeProps } from "./CodeBlock";
import { MermaidBlock } from "./MermaidBlock";
import { PhotoView } from "react-photo-view";
import { HoverImageFrame } from "@/components/shared/HoverImageFrame";
import { NOISE_OVERLAY_HEAVY } from "@/lib/constants/noiseOverlay";

export const markdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1
      className="mb-6 border-b border-border pb-4 font-sans text-3xl font-black tracking-tight text-foreground md:text-4xl"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mb-4 mt-14 flex items-center gap-4 font-caslon text-2xl font-normal italic tracking-tight text-foreground md:text-3xl"
      {...props}
    >
      <span className="h-8 w-[2px] shrink-0 rounded-full bg-accent" />
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="mb-3 mt-8 font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="mb-2 mt-6 font-sans text-lg font-bold tracking-tight text-foreground md:text-xl"
      {...props}
    >
      {children}
    </h4>
  ),

  p: ({ children, node }) => {
    const hasImage = node?.children?.some(
      (child) => child.type === "element" && child.tagName === "img",
    );
    if (hasImage) {
      return <div className="mb-5">{children}</div>;
    }
    return (
      <p className="mb-5 leading-relaxed text-muted-foreground">{children}</p>
    );
  },
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-foreground">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="relative mx-auto my-10 max-w-2xl border-none bg-transparent px-6 py-8 text-center md:px-10 [&>p]:mb-0 [&>p]:font-caslon [&>p]:text-lg [&>p]:italic [&>p]:leading-relaxed [&>p]:text-foreground [&>p]:before:content-none [&>p]:after:content-none [&>p]:md:text-xl">
      <div className="mx-auto mb-6 h-px w-8 bg-accent/60" />
      {children}
      <div className="mx-auto mt-6 h-px w-8 bg-accent/60" />
    </blockquote>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="mb-5 list-inside list-disc space-y-2 leading-relaxed text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 list-inside list-decimal space-y-2 leading-relaxed text-muted-foreground">
      {children}
    </ol>
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
        <code className="rounded border border-border bg-muted px-2 py-1 font-mono text-sm text-accent">
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
    <thead className="border-b border-border bg-muted">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-muted/50">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-6 py-4 text-left font-sans text-sm font-bold uppercase tracking-wide text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-6 py-4 text-sm text-muted-foreground">{children}</td>
  ),

  // Media - With Noise Overlay
  img: ({ src, alt, title, ...rest }: ComponentPropsWithoutRef<"img">) => {
    if (!src) {
      return null;
    }

    let cleanSrc = src as string;
    let imgWidth: number | undefined;
    let imgHeight: number | undefined;

    const dimMatch =
      cleanSrc.match(/#dim=(\d*)x(\d*)$/) || cleanSrc.match(/\s+=(\d*)x(\d*)$/);
    if (dimMatch) {
      cleanSrc = cleanSrc
        .replace(/#dim=\d*x\d*$/, "")
        .replace(/\s+=\d*x\d*$/, "");
      if (dimMatch[1]) imgWidth = parseInt(dimMatch[1], 10);
      if (dimMatch[2]) imgHeight = parseInt(dimMatch[2], 10);
    }

    const hasDimensions = imgWidth || imgHeight;

    return (
      <span className="my-10 flex justify-center">
        <span className={hasDimensions ? "inline-block" : "block w-full"}>
          <HoverImageFrame
            className={
              hasDimensions ? "inline-block" : "block w-full shadow-md"
            }
          >
            <span
              className="relative block"
              style={{
                width: imgWidth ? `${imgWidth}px` : "100%",
                ...(imgHeight ? { height: `${imgHeight}px` } : {}),
              }}
            >
              <span
                className="pointer-events-none absolute inset-0 z-10 opacity-15 mix-blend-overlay"
                style={{ backgroundImage: NOISE_OVERLAY_HEAVY }}
              />
              <PhotoView src={cleanSrc}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cleanSrc}
                  alt={alt ?? ""}
                  loading="lazy"
                  className="block h-auto w-full cursor-zoom-in transition-transform duration-700 ease-out group-hover:scale-105"
                  {...rest}
                />
              </PhotoView>
              <span className="pointer-events-none absolute inset-0 z-10 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/5" />
            </span>
          </HoverImageFrame>
          {title ? (
            <span className="mt-3 block text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
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
        <div className="relative overflow-hidden rounded-xl border border-border">
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
              className="h-full w-full"
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
        <div className="rounded-xl border border-border bg-muted/30 p-4">
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
