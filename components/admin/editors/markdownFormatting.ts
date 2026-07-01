export type FormatType =
  | "bold"
  | "italic"
  | "heading"
  | "link"
  | "code"
  | "codeBlock"
  | "unorderedList"
  | "orderedList"
  | "blockquote"
  | "horizontalRule";

export function applyFormatting(
  textarea: HTMLTextAreaElement,
  type: FormatType,
  onContentChange: (content: string) => void,
) {
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.substring(selectionStart, selectionEnd);
  let newText: string;
  let cursorStart: number;
  let cursorEnd: number;

  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;

  switch (type) {
    case "bold": {
      newText =
        value.substring(0, selectionStart) +
        `**${selected}**` +
        value.substring(selectionEnd);
      cursorStart = selectionStart + 2;
      cursorEnd = selectionEnd + 2;
      break;
    }
    case "italic": {
      newText =
        value.substring(0, selectionStart) +
        `*${selected}*` +
        value.substring(selectionEnd);
      cursorStart = selectionStart + 1;
      cursorEnd = selectionEnd + 1;
      break;
    }
    case "heading": {
      const prefix = "## ";
      newText =
        value.substring(0, lineStart) + prefix + value.substring(lineStart);
      cursorStart = selectionStart + prefix.length;
      cursorEnd = selectionEnd + prefix.length;
      break;
    }
    case "link": {
      const linkText = selected || "text";
      newText =
        value.substring(0, selectionStart) +
        `[${linkText}](url)` +
        value.substring(selectionEnd);
      if (selected) {
        cursorStart = selectionStart + linkText.length + 3;
        cursorEnd = selectionStart + linkText.length + 6;
      } else {
        cursorStart = selectionStart + 1;
        cursorEnd = selectionStart + 5;
      }
      break;
    }
    case "code": {
      newText =
        value.substring(0, selectionStart) +
        "`" +
        selected +
        "`" +
        value.substring(selectionEnd);
      cursorStart = selectionStart + 1;
      cursorEnd = selectionEnd + 1;
      break;
    }
    case "codeBlock": {
      newText =
        value.substring(0, selectionStart) +
        "```\n" +
        selected +
        "\n```" +
        value.substring(selectionEnd);
      cursorStart = selectionStart + 4;
      cursorEnd = selectionEnd + 4;
      break;
    }
    case "unorderedList": {
      const prefix = "- ";
      newText =
        value.substring(0, lineStart) + prefix + value.substring(lineStart);
      cursorStart = selectionStart + prefix.length;
      cursorEnd = selectionEnd + prefix.length;
      break;
    }
    case "orderedList": {
      const prefix = "1. ";
      newText =
        value.substring(0, lineStart) + prefix + value.substring(lineStart);
      cursorStart = selectionStart + prefix.length;
      cursorEnd = selectionEnd + prefix.length;
      break;
    }
    case "blockquote": {
      const prefix = "> ";
      newText =
        value.substring(0, lineStart) + prefix + value.substring(lineStart);
      cursorStart = selectionStart + prefix.length;
      cursorEnd = selectionEnd + prefix.length;
      break;
    }
    case "horizontalRule": {
      const rule = "\n---\n";
      newText =
        value.substring(0, selectionStart) +
        rule +
        value.substring(selectionEnd);
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
