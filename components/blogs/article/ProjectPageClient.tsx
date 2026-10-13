"use client";

import ProjectLinks from "@/components/blogs/article/ProjectLinks";
import { BackToBlogsLink } from "@/components/blogs/article/BackToBlogsLink";
import TableOfContents from "@/components/blogs/article/TableOfContents";
import { ReadingProgress } from "@/components/shared";
import { ArticleHero } from "@/components/blogs/article/ArticleHero";
import type { Blog } from "@/lib/db";
import { PHOTO_VIEWER_CONFIG } from "@/lib/constants/photoViewer";
import {
  formatProjectDate,
  calculateReadTime,
} from "@/lib/utils/projectFormatting";
import { m } from "@/components/motion";
import { PhotoProvider } from "react-photo-view";
import { Heading } from "@/lib/utils/markdownHelpers";

interface ProjectPageClientProps {
  project: Blog;
  headings: Heading[];
  children: React.ReactNode;
}

export default function ProjectPageClient({
  project,
  headings,
  children,
}: ProjectPageClientProps) {
  const wordCount = project.blogPost.split(/\s+/).length;
  const readTime = calculateReadTime(project.blogPost);

  return (
    <>
      <ReadingProgress />
      <TableOfContents headings={headings} />
      <PhotoProvider
        maskOpacity={PHOTO_VIEWER_CONFIG.maskOpacity}
        speed={() => PHOTO_VIEWER_CONFIG.speed}
      >
        <div className="min-h-screen bg-background text-foreground">
          <article className="mx-auto w-full max-w-4xl px-6 py-24 md:py-28">
            <ArticleHero
              title={project.title}
              description={project.description}
              date={formatProjectDate(project.date)}
              wordCount={wordCount}
              readTime={readTime}
              imageUrl={project.imageUrl ?? undefined}
              type={project.type}
            />

            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              {children}
            </m.div>

            {project.links && project.links.length > 0 && (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ProjectLinks links={project.links} />
              </m.div>
            )}

            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 flex justify-center border-t border-border pt-8"
            >
              <BackToBlogsLink>Back to all posts</BackToBlogsLink>
            </m.div>
          </article>
        </div>
      </PhotoProvider>
    </>
  );
}
