import { SkeletonBlock } from './SkeletonBlock';
import { BlogsListSkeleton } from './BlogsListSkeleton';

export function BlogsPageSkeleton() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <section id="projects-and-certifications" className="flex flex-col py-8 md:py-12">
                <div className="container max-w-7xl mx-auto px-6 pt-24 md:pt-20">
                    <header className="w-full mb-8 md:mb-10" aria-hidden="true">
                        <SkeletonBlock className="h-3 w-44 mb-4" />
                        <SkeletonBlock className="h-12 md:h-14 w-48 md:w-56 mb-4" />
                        <SkeletonBlock className="h-5 w-full max-w-xl" />
                        <SkeletonBlock className="h-5 w-4/5 max-w-md mt-2" />
                    </header>

                    <div
                        className="flex items-center gap-6 md:gap-10 mb-8 border-b border-border pb-4"
                        aria-hidden="true"
                    >
                        <div className="space-y-1">
                            <SkeletonBlock className="h-3 w-6" />
                            <SkeletonBlock className="h-7 w-20" />
                        </div>
                        <div className="space-y-1">
                            <SkeletonBlock className="h-3 w-6" />
                            <SkeletonBlock className="h-7 w-36" />
                        </div>
                        <div className="flex-1 hidden md:block" />
                        <SkeletonBlock className="hidden md:block h-3 w-24" />
                    </div>

                    <div className="w-full min-h-[50vh] mt-8">
                        <BlogsListSkeleton />
                    </div>
                </div>
            </section>
        </div>
    );
}
