"use client";

import { useState, useEffect, type RefObject } from "react";
import type { PendingImage } from "@/lib/admin/blogContentProcessing";

export function useBlogFormMarkdownImages(
  blogPost: string | undefined,
  setBlogPost: (content: string) => void,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
) {
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);

  useEffect(() => {
    return () => {
      pendingImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [pendingImages]);

  const insertImageToMarkdown = (file: File) => {
    const id = Math.random().toString(36).substring(7);
    const previewUrl = URL.createObjectURL(file);

    setPendingImages((prev) => [...prev, { id, file, previewUrl }]);

    const imageMarkdown = `![Image](${previewUrl})`;
    const textarea = textareaRef.current;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = blogPost || "";
      const newText =
        text.substring(0, start) + imageMarkdown + text.substring(end);

      setBlogPost(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + imageMarkdown.length,
          start + imageMarkdown.length,
        );
      }, 0);
    } else {
      setBlogPost(`${blogPost || ""}\n${imageMarkdown}`);
    }
  };

  return { pendingImages, insertImageToMarkdown };
}
