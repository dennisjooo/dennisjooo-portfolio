export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <article className="mx-auto w-full max-w-4xl animate-pulse px-6 py-24 md:py-28">
        {/* Back Navigation */}
        <div className="mb-8">
          <div className="h-4 w-28 rounded bg-muted/20" />
        </div>

        {/* Meta Bar */}
        <div className="mb-6 flex items-center gap-3 md:gap-4">
          <div className="h-6 w-16 rounded border border-border/50 bg-muted/20" />
          <div className="h-1 w-1 rounded-full bg-muted/20" />
          <div className="h-4 w-24 rounded bg-muted/20" />
          <div className="h-1 w-1 rounded-full bg-muted/20" />
          <div className="h-4 w-20 rounded bg-muted/20" />
          <div className="h-1 w-1 rounded-full bg-muted/20" />
          <div className="h-4 w-20 rounded bg-muted/20" />
        </div>

        {/* Title */}
        <div className="mb-6 space-y-3">
          <div className="h-12 w-4/5 rounded bg-muted/20 md:h-14 lg:h-16" />
          <div className="h-12 w-3/5 rounded bg-muted/20 md:h-14 lg:h-16" />
        </div>

        {/* Description */}
        <div className="mb-10 max-w-3xl space-y-2">
          <div className="h-5 w-full rounded bg-muted/20" />
          <div className="h-5 w-2/3 rounded bg-muted/20" />
        </div>

        {/* Hero Image */}
        <div className="mb-12 aspect-video w-full rounded-xl border border-border/50 bg-muted/20 md:mb-16" />

        {/* Article Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted/20" />
            <div className="h-4 w-full rounded bg-muted/20" />
            <div className="h-4 w-5/6 rounded bg-muted/20" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted/20" />
            <div className="h-4 w-4/5 rounded bg-muted/20" />
            <div className="h-4 w-full rounded bg-muted/20" />
            <div className="h-4 w-3/4 rounded bg-muted/20" />
          </div>
          <div className="mt-8 h-8 w-2/5 rounded bg-muted/20" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted/20" />
            <div className="h-4 w-full rounded bg-muted/20" />
            <div className="h-4 w-2/3 rounded bg-muted/20" />
          </div>
        </div>
      </article>
    </div>
  );
}
