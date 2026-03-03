import { ListSkeleton } from '@/components/shared';

export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-7xl mx-auto px-6 pt-24">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-muted/20 rounded w-1/3" />
                    <ListSkeleton count={9} />
                </div>
            </div>
        </div>
    );
}
