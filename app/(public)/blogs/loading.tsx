export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-6 pt-24">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-muted/20 rounded w-1/3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-96 bg-muted/20 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
