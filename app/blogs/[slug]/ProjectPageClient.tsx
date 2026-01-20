'use client';

import ProjectLinks from '@/components/blogs/article/ProjectLinks';
import TableOfContents from '@/components/blogs/article/TableOfContents';
import { ReadingProgress } from '@/components/shared';
import { ArticleHero } from '@/components/blogs/article';
import { Blog } from '@/data/blogs';
import { PHOTO_VIEWER_CONFIG } from '@/lib/constants/photoViewer';
import { extractHeadings } from '@/lib/utils/markdownHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { PhotoProvider } from 'react-photo-view';

const ProjectContent = dynamic(() => import('@/components/blogs/article/ProjectContent'), {
    loading: () => <div className="animate-pulse bg-muted h-96 rounded-xl" />
});

export default function ProjectPageClient({ project }: { project: Blog }) {
    const headings = useMemo(() => extractHeadings(project.blogPost), [project.blogPost]);
    const wordCount = project.blogPost.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <>
            <ReadingProgress />
            <TableOfContents headings={headings} />
            <PhotoProvider maskOpacity={PHOTO_VIEWER_CONFIG.maskOpacity} speed={() => PHOTO_VIEWER_CONFIG.speed}>
                <main className="min-h-screen bg-background text-foreground">
                    <article className="w-full max-w-4xl mx-auto px-6 py-24 md:py-28">
                        {/* Editorial Hero */}
                        <ArticleHero
                            title={project.title}
                            description={project.description}
                            date={formatProjectDate(project.date)}
                            wordCount={wordCount}
                            readTime={readTime}
                            imageUrl={project.imageUrl}
                            type={project.type}
                        />

                        {/* Article Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-16"
                        >
                            <ProjectContent content={project.blogPost} />
                        </motion.div>

                        {/* Project Links */}
                        {project.links && project.links.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <ProjectLinks links={project.links} />
                            </motion.div>
                        )}
                    </article>
                </main>
            </PhotoProvider>
        </>
    );
}
