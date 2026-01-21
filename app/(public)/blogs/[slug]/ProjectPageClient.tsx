'use client';

import ProjectLinks from '@/components/blogs/article/ProjectLinks';
import TableOfContents from '@/components/blogs/article/TableOfContents';
import HashScrollHandler from '@/components/blogs/article/HashScrollHandler';
import { ReadingProgress } from '@/components/shared';
import { ArticleHero } from '@/components/blogs/article/ArticleHero';
import { Blog } from '@/lib/db';
import { PHOTO_VIEWER_CONFIG } from '@/lib/constants/photoViewer';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { motion } from 'framer-motion';
import { PhotoProvider } from 'react-photo-view';
import { Heading } from '@/lib/utils/markdownHelpers';

interface ProjectPageClientProps {
    project: Blog;
    headings: Heading[];
    children: React.ReactNode;
}

export default function ProjectPageClient({ project, headings, children }: ProjectPageClientProps) {
    const wordCount = project.blogPost.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    return (
        <>
            <ReadingProgress />
            <HashScrollHandler />
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
                            imageUrl={project.imageUrl ?? undefined}
                            type={project.type}
                        />

                        {/* Article Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-16"
                        >
                            {children}
                        </motion.div>

                        {/* Project Links */}
                        {project.links && project.links.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
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
