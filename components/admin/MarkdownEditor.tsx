import { useState } from 'react';
import { DocumentPlusIcon, EyeIcon, PencilSquareIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { formStyles } from './shared/formStyles';
import { MarkdownPreview } from './MarkdownPreview';

export type EditorMode = 'write' | 'preview' | 'split';

interface MarkdownEditorProps {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
  canUploadImages: boolean;
  onInsertImage: (file: File) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function MarkdownEditor({
  content,
  onChange,
  editorMode,
  onEditorModeChange,
  canUploadImages,
  onInsertImage,
  textareaRef,
}: MarkdownEditorProps) {
  const [dragActive, setDragActive] = useState(false);

  const handlePaste = (e: React.ClipboardEvent) => {
    if (!canUploadImages) return;
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
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
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onInsertImage(files[0]);
    }
  };

  const handleMarkdownImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onInsertImage(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted/30">
          <button
            type="button"
            onClick={() => onEditorModeChange('write')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              editorMode === 'write'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <PencilSquareIcon className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => onEditorModeChange('preview')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              editorMode === 'preview'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <EyeIcon className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => onEditorModeChange('split')}
            className={cn(
              "hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
              editorMode === 'split'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ViewColumnsIcon className="w-3.5 h-3.5" />
            Split
          </button>
        </div>

        {editorMode !== 'preview' && (
          <label
            title={!canUploadImages ? 'Add a title to enable image uploads' : undefined}
            className={cn(
              "flex items-center gap-2 text-xs",
              canUploadImages
                ? "text-primary cursor-pointer hover:underline"
                : "text-muted-foreground/50 pointer-events-none"
            )}
          >
            <DocumentPlusIcon className="w-4 h-4" />
            <span>Add Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleMarkdownImageUpload}
              disabled={!canUploadImages}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className={cn(
        editorMode === 'split' && "grid grid-cols-2 gap-4"
      )}>
        {editorMode !== 'preview' && (
          <div className="relative">
            <textarea
              ref={textareaRef}
              name="blogPost"
              required={editorMode === 'write'}
              value={content}
              onChange={onChange}
              onPaste={handlePaste}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                formStyles.input,
                "font-mono text-sm leading-relaxed",
                editorMode === 'split'
                  ? "h-[700px] resize-y overflow-auto"
                  : "resize-none overflow-hidden min-h-[500px]",
                dragActive && "border-primary ring-2 ring-primary/20"
              )}
              placeholder="# Write your masterpiece here... (Drag & drop images supported)"
            />
            {editorMode === 'write' && (
              <div className={cn(
                "absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded border border-border pointer-events-none transition-opacity duration-300",
                content ? "opacity-20" : "opacity-100"
              )}>
                Markdown Supported &bull; Drag & Drop Images
              </div>
            )}
            {dragActive && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px] border-2 border-primary border-dashed rounded-lg flex items-center justify-center pointer-events-none">
                <span className="text-primary font-medium">Drop image to insert</span>
              </div>
            )}
          </div>
        )}

        {editorMode === 'preview' && (
          <input type="hidden" name="blogPost" value={content || ''} />
        )}

        {editorMode !== 'write' && (
          <div className={cn(
            "rounded-lg border border-border bg-background p-6",
            editorMode === 'split'
              ? "h-[700px] overflow-auto"
              : "min-h-[500px]"
          )}>
            <MarkdownPreview content={content || ''} />
          </div>
        )}
      </div>
    </div>
  );
}
