import {
  DocumentPlusIcon,
  EyeIcon,
  PencilSquareIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import type { EditorMode } from "./MarkdownEditor";

interface MarkdownEditorModeTabsProps {
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
  canUploadImages: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MarkdownEditorModeTabs({
  editorMode,
  onEditorModeChange,
  canUploadImages,
  onImageUpload,
}: MarkdownEditorModeTabsProps) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
        <button
          type="button"
          onClick={() => onEditorModeChange("write")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            editorMode === "write"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <PencilSquareIcon className="h-3.5 w-3.5" />
          Write
        </button>
        <button
          type="button"
          onClick={() => onEditorModeChange("preview")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            editorMode === "preview"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <EyeIcon className="h-3.5 w-3.5" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => onEditorModeChange("split")}
          className={cn(
            "hidden items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all md:flex",
            editorMode === "split"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ViewColumnsIcon className="h-3.5 w-3.5" />
          Split
        </button>
      </div>

      {editorMode !== "preview" && (
        <label
          title={
            !canUploadImages ? "Add a title to enable image uploads" : undefined
          }
          className={cn(
            "flex items-center gap-2 text-xs",
            canUploadImages
              ? "cursor-pointer text-primary hover:underline"
              : "pointer-events-none text-muted-foreground/50",
          )}
        >
          <DocumentPlusIcon className="h-4 w-4" />
          <span>Add Image</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onImageUpload}
            disabled={!canUploadImages}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
