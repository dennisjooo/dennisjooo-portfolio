'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ProjectLinks from '@/components/blogs/article/ProjectLinks';
import TableOfContents from '@/components/blogs/article/TableOfContents';
import { ReadingProgress } from '@/components/shared';
import { ArticleHero } from '@/components/blogs/article/ArticleHero';
import { Blog } from '@/lib/db';
import { PHOTO_VIEWER_CONFIG } from '@/lib/constants/photoViewer';
import { formatProjectDate, calculateReadTime } from '@/lib/utils/projectFormatting';
import { m } from '@/components/motion';
import { PhotoProvider } from 'react-photo-view';
import { Heading } from '@/lib/utils/markdownHelpers';

interface ProjectPageClientProps {
    project: Blog;
    headings: Heading[];
    children: React.ReactNode;
}

export default function ProjectPageClient({ project, headings, children }: ProjectPageClientProps) {
    const wordCount = project.blogPost.split(/\s+/).length;
    const readTime = calculateReadTime(project.blogPost);

    return (
        <>
            <ReadingProgress />
            <TableOfContents headings={headings} />
            <PhotoProvider maskOpacity={PHOTO_VIEWER_CONFIG.maskOpacity} speed={() => PHOTO_VIEWER_CONFIG.speed}>
                <div className="min-h-screen bg-background text-foreground">
                    <article className="w-full max-w-4xl mx-auto px-6 py-24 md:py-28">
                        {/* Editorial Hero */}
                        <ArticleHero
                            title={project.title}
                            description={project.description}
                            date={formatProjectDate(project.date)}
                            wordCount={wordCount}
                            readTime={readTime}
                            imageUrl={project.imageUrl ?? undefined}
                            type={project.type}
                            slug={project.slug ?? ''}
                        />

                        {/* Article Content */}
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                        >
                            {children}
                        </m.div>

                        {/* Project Links */}
                        {project.links && project.links.length > 0 && (
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <ProjectLinks links={project.links} />
                            </m.div>
                        )}

                        {/* Back to all posts footer */}
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-16 pt-8 border-t border-border flex justify-center"
                        >
                            <Link
                                href="/blogs"
                                className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors duration-300"
                            >
                                <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                Back to all posts
                            </Link>
                        </m.div>
                    </article>
                </div>
            </PhotoProvider>
        </>
    );
}
