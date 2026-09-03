import { useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MarkdownPreview } from "./MarkdownPreview";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { MarkdownEditorModeTabs } from "./MarkdownEditorModeTabs";
import { MarkdownEditorTextarea } from "./MarkdownEditorTextarea";
import { MarkdownEditorStats } from "./MarkdownEditorStats";
import { useMarkdownEditorScrollSync } from "./useMarkdownEditorScrollSync";
import { useMarkdownEditorKeyboard } from "./useMarkdownEditorKeyboard";
import { useMarkdownEditorImageDrop } from "./useMarkdownEditorImageDrop";

export type EditorMode = "write" | "preview" | "split";

interface MarkdownEditorProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onContentChange: (content: string) => void;
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
  canUploadImages: boolean;
  onInsertImage: (file: File) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function MarkdownEditor({
  content,
  onChange,
  onContentChange,
  editorMode,
  onEditorModeChange,
  canUploadImages,
  onInsertImage,
  textareaRef,
}: MarkdownEditorProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  const { handleEditorScroll, handlePreviewScroll } =
    useMarkdownEditorScrollSync(editorMode, textareaRef, previewRef);
  const handleKeyDown = useMarkdownEditorKeyboard(onContentChange);
  const { dragActive, handlePaste, handleDrag, handleDrop, handleImageUpload } =
    useMarkdownEditorImageDrop(canUploadImages, onInsertImage);

  return (
    <div>
      <MarkdownEditorModeTabs
        editorMode={editorMode}
        onEditorModeChange={onEditorModeChange}
        canUploadImages={canUploadImages}
        onImageUpload={handleImageUpload}
      />

      {editorMode !== "preview" && (
        <MarkdownToolbar
          textareaRef={textareaRef}
          onContentChange={onContentChange}
        />
      )}

      <div className={cn(editorMode === "split" && "grid grid-cols-2 gap-4")}>
        {editorMode !== "preview" && (
          <MarkdownEditorTextarea
            content={content}
            editorMode={editorMode}
            dragActive={dragActive}
            textareaRef={textareaRef}
            onChange={onChange}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onScroll={editorMode === "split" ? handleEditorScroll : undefined}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          />
        )}

        {editorMode === "preview" && (
          <input type="hidden" name="blogPost" value={content || ""} />
        )}

        {editorMode !== "write" && (
          <div
            ref={editorMode === "split" ? previewRef : undefined}
            onScroll={editorMode === "split" ? handlePreviewScroll : undefined}
            className={cn(
              "rounded-lg border border-border bg-background p-6",
              editorMode === "split"
                ? "h-[700px] overflow-auto"
                : "min-h-[500px]",
            )}
          >
            <MarkdownPreview content={content || ""} />
          </div>
        )}
      </div>

      <MarkdownEditorStats wordCount={wordCount} charCount={content.length} />
    </div>
  );
}
