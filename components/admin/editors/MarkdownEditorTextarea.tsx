import { cn } from "@/lib/utils";
import { formStyles } from "@/components/admin/shared/formStyles";
import type { EditorMode } from "./MarkdownEditor";

interface MarkdownEditorTextareaProps {
  content: string;
  editorMode: EditorMode;
  dragActive: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onScroll?: () => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function MarkdownEditorTextarea({
  content,
  editorMode,
  dragActive,
  textareaRef,
  onChange,
  onPaste,
  onKeyDown,
  onScroll,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: MarkdownEditorTextareaProps) {
  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        name="blogPost"
        required={editorMode === "write"}
        value={content}
        onChange={onChange}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
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
          <span className="font-medium text-primary">Drop image to insert</span>
        </div>
      )}
    </div>
  );
}
