import { useState, useCallback } from "react";

export function useMarkdownEditorImageDrop(
  canUploadImages: boolean,
  onInsertImage: (file: File) => void,
) {
  const [dragActive, setDragActive] = useState(false);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (!canUploadImages) return;
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) onInsertImage(file);
        }
      }
    },
    [canUploadImages, onInsertImage],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
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
    },
    [canUploadImages, onInsertImage],
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        for (let i = 0; i < e.target.files.length; i++) {
          onInsertImage(e.target.files[i]);
        }
      }
    },
    [onInsertImage],
  );

  return {
    dragActive,
    handlePaste,
    handleDrag,
    handleDrop,
    handleImageUpload,
  };
}
