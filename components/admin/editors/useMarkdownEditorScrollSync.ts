import { useCallback, useRef } from "react";
import type { EditorMode } from "./MarkdownEditor";

export function useMarkdownEditorScrollSync(
  editorMode: EditorMode,
  textareaRef: React.RefObject<HTMLTextAreaElement | null>,
  previewRef: React.RefObject<HTMLDivElement | null>,
) {
  const isScrollSyncing = useRef(false);

  const handleEditorScroll = useCallback(() => {
    if (editorMode !== "split" || isScrollSyncing.current) return;
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    if (!textarea || !preview) return;

    isScrollSyncing.current = true;
    const scrollRatio =
      textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight || 1);
    preview.scrollTop =
      scrollRatio * (preview.scrollHeight - preview.clientHeight);
    requestAnimationFrame(() => {
      isScrollSyncing.current = false;
    });
  }, [editorMode, textareaRef, previewRef]);

  const handlePreviewScroll = useCallback(() => {
    if (editorMode !== "split" || isScrollSyncing.current) return;
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    if (!textarea || !preview) return;

    isScrollSyncing.current = true;
    const scrollRatio =
      preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1);
    textarea.scrollTop =
      scrollRatio * (textarea.scrollHeight - textarea.clientHeight);
    requestAnimationFrame(() => {
      isScrollSyncing.current = false;
    });
  }, [editorMode, textareaRef, previewRef]);

  return { handleEditorScroll, handlePreviewScroll };
}
