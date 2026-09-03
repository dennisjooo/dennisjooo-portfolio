import { useCallback } from "react";
import { applyFormatting } from "./markdownFormatting";

export function useMarkdownEditorKeyboard(
  onContentChange: (content: string) => void,
) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;

      if (e.key === "Tab") {
        e.preventDefault();
        const { selectionStart, selectionEnd, value } = textarea;

        if (e.shiftKey) {
          const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
          const linePrefix = value.substring(lineStart, lineStart + 2);
          const spacesToRemove =
            linePrefix === "  " ? 2 : linePrefix.startsWith(" ") ? 1 : 0;
          if (spacesToRemove > 0) {
            const newText =
              value.substring(0, lineStart) +
              value.substring(lineStart + spacesToRemove);
            onContentChange(newText);
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(
                selectionStart - spacesToRemove,
                selectionEnd - spacesToRemove,
              );
            }, 0);
          }
        } else {
          const newText =
            value.substring(0, selectionStart) +
            "  " +
            value.substring(selectionEnd);
          onContentChange(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(selectionStart + 2, selectionStart + 2);
          }, 0);
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        if (e.shiftKey && e.key.toLowerCase() === "k") {
          e.preventDefault();
          applyFormatting(textarea, "codeBlock", onContentChange);
          return;
        }

        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            applyFormatting(textarea, "bold", onContentChange);
            break;
          case "i":
            e.preventDefault();
            applyFormatting(textarea, "italic", onContentChange);
            break;
          case "k":
            e.preventDefault();
            applyFormatting(textarea, "link", onContentChange);
            break;
        }
      }
    },
    [onContentChange],
  );

  return handleKeyDown;
}
