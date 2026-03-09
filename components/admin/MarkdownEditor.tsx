import { useState, useCallback, useRef, useMemo } from 'react';
import {
  DocumentPlusIcon,
  EyeIcon,
  PencilSquareIcon,
  ViewColumnsIcon,
  LinkIcon,
  CodeBracketIcon,
  ListBulletIcon,
  HashtagIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars3BottomLeftIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { formStyles } from './shared/formStyles';
import { MarkdownPreview } from './MarkdownPreview';

export type EditorMode = 'write' | 'preview' | 'split';

type FormatType =
  | 'bold' | 'italic' | 'heading' | 'link'
  | 'code' | 'codeBlock' | 'unorderedList' | 'orderedList'
  | 'blockquote' | 'horizontalRule';

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

function applyFormatting(
  textarea: HTMLTextAreaElement,
  type: FormatType,
  onContentChange: (content: string) => void,
) {
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.substring(selectionStart, selectionEnd);
  let newText: string;
  let cursorStart: number;
  let cursorEnd: number;

  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;

  switch (type) {
    case 'bold': {
      newText = value.substring(0, selectionStart) + `**${selected}**` + value.substring(selectionEnd);
      cursorStart = selectionStart + 2;
      cursorEnd = selectionEnd + 2;
      break;
    }
    case 'italic': {
      newText = value.substring(0, selectionStart) + `*${selected}*` + value.substring(selectionEnd);
      cursorStart = selectionStart + 1;
      cursorEnd = selectionEnd + 1;
      break;
    }
    case 'heading': {
      const prefix = '## ';
      newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
      cursorStart = selectionStart + prefix.length;
      cursorEnd = selectionEnd + prefix.length;
      break;
    }
    case 'link': {
      const linkText = selected || 'text';
      newText = value.substring(0, selectionStart) + `[${linkText}](url)` + value.substring(selectionEnd);
      if (selected) {
        cursorStart = selectionStart + linkText.length + 3;
        cursorEnd = selectionStart + linkText.length + 6;
      } else {
        cursorStart = selectionStart + 1;
        cursorEnd = selectionStart + 5;
      }
      break;
    }
    case 'code': {
      newText = value.substring(0, selectionStart) + '`' + selected + '`' + value.substring(selectionEnd);
      cursorStart = selectionStart + 1;
      cursorEnd = selectionEnd + 1;
      break;
    }
    case 'codeBlock': {
      newText = value.substring(0, selectionStart) + '```\n' + selected + '\n```' + value.substring(selectionEnd);
      cursorStart = selectionStart + 4;
      cursorEnd = selectionEnd + 4;
      break;
    }
    case 'unorderedList': {
      const prefix = '- ';
      newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
      cursorStart = selectionStart + prefix.length;
      cursorEnd = selectionEnd + prefix.length;
      break;
    }
    case 'orderedList': {
      const prefix = '1. ';
      newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
      cursorStart = selectionStart + prefix.length;
      cursorEnd = selectionEnd + prefix.length;
      break;
    }
    case 'blockquote': {
      const prefix = '> ';
      newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
      cursorStart = selectionStart + prefix.length;
      cursorEnd = selectionEnd + prefix.length;
      break;
    }
    case 'horizontalRule': {
      const rule = '\n---\n';
      newText = value.substring(0, selectionStart) + rule + value.substring(selectionEnd);
      cursorStart = selectionStart + rule.length;
      cursorEnd = cursorStart;
      break;
    }
  }

  onContentChange(newText);

  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(cursorStart, cursorEnd);
  }, 0);
}

const toolbarBtnClass =
  "px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md transition-all hover:bg-background/50";

interface ToolbarButtonProps {
  type: FormatType;
  title: string;
  icon: React.ReactNode;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onContentChange: (content: string) => void;
}

function ToolbarButton({ type, title, icon, textareaRef, onContentChange }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={() => {
        if (textareaRef.current) {
          applyFormatting(textareaRef.current, type, onContentChange);
        }
      }}
      className={toolbarBtnClass}
    >
      {icon}
    </button>
  );
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
  const isScrollSyncing = useRef(false);

  const wordCount = useMemo(() => {
    if (!content.trim()) return 0;
    return content.trim().split(/\s+/).length;
  }, [content]);

  const handleEditorScroll = useCallback(() => {
    if (editorMode !== 'split' || isScrollSyncing.current) return;
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    if (!textarea || !preview) return;

    isScrollSyncing.current = true;
    const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight || 1);
    preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
    requestAnimationFrame(() => { isScrollSyncing.current = false; });
  }, [editorMode, textareaRef]);

  const handlePreviewScroll = useCallback(() => {
    if (editorMode !== 'split' || isScrollSyncing.current) return;
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    if (!textarea || !preview) return;

    isScrollSyncing.current = true;
    const scrollRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1);
    textarea.scrollTop = scrollRatio * (textarea.scrollHeight - textarea.clientHeight);
    requestAnimationFrame(() => { isScrollSyncing.current = false; });
  }, [editorMode, textareaRef]);

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
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        onInsertImage(files[i]);
      }
    }
  };

  const handleMarkdownImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        onInsertImage(e.target.files[i]);
      }
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;

    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = textarea;

      if (e.shiftKey) {
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        const linePrefix = value.substring(lineStart, lineStart + 2);
        const spacesToRemove = linePrefix === '  ' ? 2 : linePrefix.startsWith(' ') ? 1 : 0;
        if (spacesToRemove > 0) {
          const newText = value.substring(0, lineStart) + value.substring(lineStart + spacesToRemove);
          onContentChange(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(selectionStart - spacesToRemove, selectionEnd - spacesToRemove);
          }, 0);
        }
      } else {
        const newText = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd);
        onContentChange(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(selectionStart + 2, selectionStart + 2);
        }, 0);
      }
      return;
    }

    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      if (e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        applyFormatting(textarea, 'codeBlock', onContentChange);
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          applyFormatting(textarea, 'bold', onContentChange);
          break;
        case 'i':
          e.preventDefault();
          applyFormatting(textarea, 'italic', onContentChange);
          break;
        case 'k':
          e.preventDefault();
          applyFormatting(textarea, 'link', onContentChange);
          break;
      }
    }
  }, [onContentChange]);

  const iconClass = "w-3.5 h-3.5";

  const toolbarButtons: { type: FormatType; title: string; icon: React.ReactNode }[] = [
    { type: 'bold', title: 'Bold (Ctrl+B)', icon: <span className="font-bold text-xs">B</span> },
    { type: 'italic', title: 'Italic (Ctrl+I)', icon: <span className="italic text-xs">I</span> },
    { type: 'heading', title: 'Heading', icon: <HashtagIcon className={iconClass} /> },
    { type: 'link', title: 'Link (Ctrl+K)', icon: <LinkIcon className={iconClass} /> },
    { type: 'code', title: 'Inline Code', icon: <CodeBracketIcon className={iconClass} /> },
    { type: 'codeBlock', title: 'Code Block (Ctrl+Shift+K)', icon: <><CodeBracketIcon className={iconClass} /><span className="text-[10px]">{'{}'}</span></> },
    { type: 'unorderedList', title: 'Unordered List', icon: <ListBulletIcon className={iconClass} /> },
    { type: 'orderedList', title: 'Ordered List', icon: <Bars3BottomLeftIcon className={iconClass} /> },
    { type: 'blockquote', title: 'Blockquote', icon: <ChatBubbleBottomCenterTextIcon className={iconClass} /> },
    { type: 'horizontalRule', title: 'Horizontal Rule', icon: <MinusIcon className={iconClass} /> },
  ];

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
              multiple
              onChange={handleMarkdownImageUpload}
              disabled={!canUploadImages}
              className="hidden"
            />
          </label>
        )}
      </div>

      {editorMode !== 'preview' && (
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted/30 mb-2 overflow-x-auto">
          {toolbarButtons.map((btn) => (
            <ToolbarButton
              key={btn.type}
              type={btn.type}
              title={btn.title}
              icon={btn.icon}
              textareaRef={textareaRef}
              onContentChange={onContentChange}
            />
          ))}
        </div>
      )}

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
              onKeyDown={handleKeyDown}
              onScroll={editorMode === 'split' ? handleEditorScroll : undefined}
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
          <div
            ref={editorMode === 'split' ? previewRef : undefined}
            onScroll={editorMode === 'split' ? handlePreviewScroll : undefined}
            className={cn(
              "rounded-lg border border-border bg-background p-6",
              editorMode === 'split'
                ? "h-[700px] overflow-auto"
                : "min-h-[500px]"
            )}
          >
            <MarkdownPreview content={content || ''} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-2 px-1 text-xs text-muted-foreground/60">
        <span>{wordCount} words</span>
        <span className="text-border">•</span>
        <span>{content.length.toLocaleString()} chars</span>
        <span className="text-border">•</span>
        <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
      </div>
    </div>
  );
}
