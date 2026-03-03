export default function Loading() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <article className="w-full max-w-4xl mx-auto px-6 py-24 md:py-28 animate-pulse">
                {/* Back Navigation */}
                <div className="mb-8">
                    <div className="h-4 w-28 bg-muted/20 rounded" />
                </div>

                {/* Meta Bar */}
                <div className="flex items-center gap-3 md:gap-4 mb-6">
                    <div className="h-6 w-16 bg-muted/20 rounded border border-border/50" />
                    <div className="w-1 h-1 rounded-full bg-muted/20" />
                    <div className="h-4 w-24 bg-muted/20 rounded" />
                    <div className="w-1 h-1 rounded-full bg-muted/20" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                    <div className="w-1 h-1 rounded-full bg-muted/20" />
                    <div className="h-4 w-20 bg-muted/20 rounded" />
                </div>

                {/* Title */}
                <div className="space-y-3 mb-6">
                    <div className="h-12 md:h-14 lg:h-16 bg-muted/20 rounded w-4/5" />
                    <div className="h-12 md:h-14 lg:h-16 bg-muted/20 rounded w-3/5" />
                </div>

                {/* Description */}
                <div className="space-y-2 mb-10 max-w-3xl">
                    <div className="h-5 bg-muted/20 rounded w-full" />
                    <div className="h-5 bg-muted/20 rounded w-2/3" />
                </div>

                {/* Hero Image */}
                <div className="w-full aspect-video bg-muted/20 rounded-xl border border-border/50 mb-12 md:mb-16" />

                {/* Article Content */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="h-4 bg-muted/20 rounded w-full" />
                        <div className="h-4 bg-muted/20 rounded w-full" />
                        <div className="h-4 bg-muted/20 rounded w-5/6" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 bg-muted/20 rounded w-full" />
                        <div className="h-4 bg-muted/20 rounded w-4/5" />
                        <div className="h-4 bg-muted/20 rounded w-full" />
                        <div className="h-4 bg-muted/20 rounded w-3/4" />
                    </div>
                    <div className="h-8 bg-muted/20 rounded w-2/5 mt-8" />
                    <div className="space-y-2">
                        <div className="h-4 bg-muted/20 rounded w-full" />
                        <div className="h-4 bg-muted/20 rounded w-full" />
                        <div className="h-4 bg-muted/20 rounded w-2/3" />
                    </div>
                </div>
            </article>
        </div>
    );
}
