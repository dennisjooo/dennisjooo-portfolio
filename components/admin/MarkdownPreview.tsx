"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const ProjectContent = dynamic(
  () => import("@/components/blogs/article/ProjectContent"),
  { ssr: false }
);

interface MarkdownPreviewProps {
  content: string;
  debounceMs?: number;
}

export function MarkdownPreview({
  content,
  debounceMs = 300,
}: MarkdownPreviewProps) {
  const [debouncedContent, setDebouncedContent] = useState(content);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedContent(content), debounceMs);
    return () => clearTimeout(timer);
  }, [content, debounceMs]);

  if (!debouncedContent) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Start writing to see the preview...
      </div>
    );
  }

  return (
    <PhotoProvider>
      <ProjectContent content={debouncedContent} />
    </PhotoProvider>
  );
}
