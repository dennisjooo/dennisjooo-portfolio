'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useMemo, useState, useEffect, useLayoutEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { Blog } from '@/data/blogs';
import ProjectLinks from '@/components/projects/ProjectLinks';
import ProjectDescription from '@/components/projects/ProjectDescription';
import { BsArrowLeft } from "react-icons/bs";
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import { extractHeadings } from '@/lib/utils/markdownHelpers';
import { GradientUnderline, ReadingProgress } from '@/components/shared';
import TableOfContents from '@/components/projects/TableOfContents';
import { PHOTO_VIEWER_CONFIG } from '@/lib/constants/photoViewer';

const ProjectContent = dynamic(() => import('@/components/projects/ProjectContent'), {
    loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-96 rounded-lg" />
});


export default function ProjectPageClient({ project }: { project: Blog }) {
    const headings = useMemo(() => extractHeadings(project.blogPost), [project.blogPost]);

    // Reset scroll position on mount to prevent cumulative drift on hard refresh
    // Removed because we now have a global ScrollRestorer that handles this better
    // and respects user's last position.

    return (
        <>
            <ReadingProgress />
            <TableOfContents headings={headings} />
            <PhotoProvider maskOpacity={PHOTO_VIEWER_CONFIG.maskOpacity} speed={() => PHOTO_VIEWER_CONFIG.speed}>
                <section
                    id='projects'
                    className='flex flex-col items-center justify-start min-h-screen py-24 px-8 bg-white dark:bg-black text-gray-900 dark:text-white'
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="w-full max-w-4xl mx-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="mb-6"
                        >
                            <Link href="/blogs" className="text-sm md:text-base inline-flex items-center text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <BsArrowLeft className="mr-2" />
                                Back to Blogs
                            </Link>
                        </motion.div>
                        <header className="mb-6">
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                            >
                                <GradientUnderline delay={0.3}>
                                    {project.title}
                                </GradientUnderline>
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="font-mono text-xs md:text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4"
                            >
                                <span className="whitespace-nowrap">{formatProjectDate(project.date)}</span>
                                <span className="hidden md:block w-1 h-1 bg-gray-400 rounded-full" />
                                <div className="flex items-center gap-4">
                                    <span className="whitespace-nowrap">{project.blogPost.split(/\s+/).length} words</span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                                    <span className="whitespace-nowrap">{Math.ceil(project.blogPost.split(/\s+/).length / 200)} min read</span>
                                </div>
                            </motion.div>
                        </header>
                        {project.imageUrl && <ProjectImage src={project.imageUrl} alt={project.title} />}
                        <ProjectDescription description={project.description} />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="mb-12"
                        >
                            <ProjectContent content={project.blogPost} />
                        </motion.div>
                        {project.links && project.links.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.9 }}
                            >
                                <ProjectLinks links={project.links} />
                            </motion.div>
                        )}
                    </motion.div>
                </section>
            </PhotoProvider>
        </>
    );
}

function ProjectImage({ src, alt }: { src: string; alt: string }) {
    const [aspectRatio, setAspectRatio] = useState<number | null>(null);

    useEffect(() => {
        const img = new window.Image();
        img.onload = () => {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
        };
        img.src = src;
    }, [src]);

    return (
        <PhotoView src={src}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative w-full max-w-3xl mx-auto mb-6 overflow-hidden rounded-3xl cursor-zoom-in"
                style={
                    aspectRatio
                        ? {
                            aspectRatio: `${aspectRatio}`,
                            maxHeight: '60vh',
                            width: `min(100%, calc(60vh * ${aspectRatio}))`,
                            maxWidth: `min(100%, calc(60vh * ${aspectRatio}))`
                        }
                        : { minHeight: '200px', maxHeight: '60vh', width: '100%' }
                }
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded-3xl"
                    sizes="(max-width: 768px) 100vw, 768px"
                />
                <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                    Click to zoom
                </span>
            </motion.div>
        </PhotoView>
    );
}
