import { useState, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { formStyles } from "@/components/admin/shared/formStyles";
import { MarkdownPreview } from "./MarkdownPreview";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { MarkdownEditorModeTabs } from "./MarkdownEditorModeTabs";
import { useMarkdownEditorScrollSync } from "./useMarkdownEditorScrollSync";
import { useMarkdownEditorKeyboard } from "./useMarkdownEditorKeyboard";

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
  const [dragActive, setDragActive] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  const { handleEditorScroll, handlePreviewScroll } =
    useMarkdownEditorScrollSync(editorMode, textareaRef, previewRef);
  const handleKeyDown = useMarkdownEditorKeyboard(onContentChange);

  const handlePaste = (e: React.ClipboardEvent) => {
    if (!canUploadImages) return;
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) onInsertImage(file);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!canUploadImages) return;

    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image/")) {
        onInsertImage(files[i]);
      }
    }
  };

  const handleMarkdownImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        onInsertImage(e.target.files[i]);
      }
    }
  };

  return (
    <div>
      <MarkdownEditorModeTabs
        editorMode={editorMode}
        onEditorModeChange={onEditorModeChange}
        canUploadImages={canUploadImages}
        onImageUpload={handleMarkdownImageUpload}
      />

      {editorMode !== "preview" && (
        <MarkdownToolbar
          textareaRef={textareaRef}
          onContentChange={onContentChange}
        />
      )}

      <div className={cn(editorMode === "split" && "grid grid-cols-2 gap-4")}>
        {editorMode !== "preview" && (
          <div className="relative">
            <textarea
              ref={textareaRef}
              name="blogPost"
              required={editorMode === "write"}
              value={content}
              onChange={onChange}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onScroll={editorMode === "split" ? handleEditorScroll : undefined}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                formStyles.input,
                "font-mono text-sm leading-relaxed",
                editorMode === "split"
                  ? "h-[700px] resize-y overflow-auto"
                  : "min-h-[500px] resize-none overflow-hidden",
                dragActive && "border-primary ring-2 ring-primary/20",
              )}
              placeholder="# Write your masterpiece here... (Drag & drop images supported)"
            />
            {editorMode === "write" && (
              <div
                className={cn(
                  "pointer-events-none absolute bottom-4 right-4 rounded border border-border bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur transition-opacity duration-300",
                  content ? "opacity-20" : "opacity-100",
                )}
              >
                Markdown Supported &bull; Drag & Drop Images
              </div>
            )}
            {dragActive && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/10 backdrop-blur-[1px]">
                <span className="font-medium text-primary">
                  Drop image to insert
                </span>
              </div>
            )}
          </div>
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

      <div className="mt-2 flex items-center gap-4 px-1 text-xs text-muted-foreground/60">
        <span>{wordCount} words</span>
        <span className="text-border">•</span>
        <span>{content.length.toLocaleString()} chars</span>
        <span className="text-border">•</span>
        <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
      </div>
    </div>
  );
}
