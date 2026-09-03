interface MarkdownEditorStatsProps {
  wordCount: number;
  charCount: number;
}

export function MarkdownEditorStats({
  wordCount,
  charCount,
}: MarkdownEditorStatsProps) {
  return (
    <div className="mt-2 flex items-center gap-4 px-1 text-xs text-muted-foreground/60">
      <span>{wordCount} words</span>
      <span className="text-border">•</span>
      <span>{charCount.toLocaleString()} chars</span>
      <span className="text-border">•</span>
      <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
    </div>
  );
}
