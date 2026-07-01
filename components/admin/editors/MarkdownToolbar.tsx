"use client";

import {
  LinkIcon,
  CodeBracketIcon,
  ListBulletIcon,
  HashtagIcon,
  ChatBubbleBottomCenterTextIcon,
  Bars3BottomLeftIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { applyFormatting, type FormatType } from "./markdownFormatting";

const toolbarBtnClass =
  "px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-md transition-all hover:bg-background/50";

interface ToolbarButtonProps {
  type: FormatType;
  title: string;
  icon: React.ReactNode;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onContentChange: (content: string) => void;
}

function ToolbarButton({
  type,
  title,
  icon,
  textareaRef,
  onContentChange,
}: ToolbarButtonProps) {
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

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onContentChange: (content: string) => void;
}

export function MarkdownToolbar({
  textareaRef,
  onContentChange,
}: MarkdownToolbarProps) {
  const iconClass = "w-3.5 h-3.5";

  const toolbarButtons: {
    type: FormatType;
    title: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: "bold",
      title: "Bold (Ctrl+B)",
      icon: <span className="font-bold text-xs">B</span>,
    },
    {
      type: "italic",
      title: "Italic (Ctrl+I)",
      icon: <span className="italic text-xs">I</span>,
    },
    {
      type: "heading",
      title: "Heading",
      icon: <HashtagIcon className={iconClass} />,
    },
    {
      type: "link",
      title: "Link (Ctrl+K)",
      icon: <LinkIcon className={iconClass} />,
    },
    {
      type: "code",
      title: "Inline Code",
      icon: <CodeBracketIcon className={iconClass} />,
    },
    {
      type: "codeBlock",
      title: "Code Block (Ctrl+Shift+K)",
      icon: (
        <>
          <CodeBracketIcon className={iconClass} />
          <span className="text-[10px]">{"{}"}</span>
        </>
      ),
    },
    {
      type: "unorderedList",
      title: "Unordered List",
      icon: <ListBulletIcon className={iconClass} />,
    },
    {
      type: "orderedList",
      title: "Ordered List",
      icon: <Bars3BottomLeftIcon className={iconClass} />,
    },
    {
      type: "blockquote",
      title: "Blockquote",
      icon: <ChatBubbleBottomCenterTextIcon className={iconClass} />,
    },
    {
      type: "horizontalRule",
      title: "Horizontal Rule",
      icon: <MinusIcon className={iconClass} />,
    },
  ];

  return (
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
  );
}
