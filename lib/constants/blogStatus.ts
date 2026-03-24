export const BLOG_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
};

export const BLOG_STATUS_STYLES: Record<string, string> = {
  draft: 'bg-muted/60 text-muted-foreground dark:bg-muted/30 dark:text-muted-foreground',
  scheduled: 'bg-accent/20 text-foreground dark:bg-accent/25 dark:text-foreground',
  published: 'bg-secondary text-foreground dark:bg-secondary/40 dark:text-foreground',
};
