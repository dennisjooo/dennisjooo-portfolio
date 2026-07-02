"use client";

import { Copy, Check, FileText, Map } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

interface UtilitiesGroupProps {
  copied: boolean;
  onCopyUrl: () => void;
  onSelect: (command: () => unknown) => void;
}

const siteFiles = [
  {
    label: "llms.txt",
    path: "/llms.txt",
    icon: FileText,
    keywords: ["llms", "llm", "ai", "agents", "context"],
  },
  {
    label: "Sitemap",
    path: "/sitemap.xml",
    icon: Map,
    keywords: ["sitemap", "xml", "seo", "crawl", "robots"],
  },
] as const;

export function UtilitiesGroup({
  copied,
  onCopyUrl,
  onSelect,
}: UtilitiesGroupProps) {
  return (
    <>
      <CommandGroup heading="Utilities">
        <CommandItem onSelect={onCopyUrl} value="Copy URL">
          {copied ? (
            <Check className="h-4 w-4 text-accent" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="font-medium">
            {copied ? "Copied!" : "Copy Current URL"}
          </span>
        </CommandItem>
        {siteFiles.map((file) => {
          const Icon = file.icon;
          return (
            <CommandItem
              key={file.path}
              value={file.label}
              keywords={[file.path, ...file.keywords]}
              onSelect={() =>
                onSelect(() => window.open(file.path, "_blank", "noopener"))
              }
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{file.label}</span>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {file.path}
              </span>
            </CommandItem>
          );
        })}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}
