import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTop } from "@/components/shared";
import ProjectPageClient from "@/components/blogs/article/ProjectPageClient";
import ProjectContent from "@/components/blogs/article/ProjectContent";
import { unstable_cache } from "next/cache";
import { CACHE_CONFIG } from "@/lib/constants/cache";
import { extractHeadings } from "@/lib/utils/markdownHelpers";
import { findBlogBySlug, visibleBlogsFilter } from "@/lib/data/blogs";
import { auth } from "@clerk/nextjs/server";
import { PreviewBanner } from "@/components/blogs/article/PreviewBanner";
import { SITE_URL, SITE_NAME } from "@/lib/constants/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

const getProject = unstable_cache(
  (slug: string) => findBlogBySlug(slug, visibleBlogsFilter()),
  ["blog-by-slug"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: ["blogs"] },
);

const getProjectForPreview = (slug: string) => findBlogBySlug(slug);

export async function generateMetadata({
  params,
  searchParams,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  const project = isPreview
    ? await getProjectForPreview(slug)
    : await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Dennis' Portfolio",
    };
  }

  return {
    title: `${project.title} | Dennis' Portfolio`,
    description: project.description,
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `/blogs/${slug}`,
      publishedTime: new Date(project.date).toISOString(),
      authors: [SITE_NAME],
      section: project.type === "project" ? "Project" : "Blog",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

export default async function Page({ params, searchParams }: ProjectPageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  let project;

  if (isPreview) {
    const { userId } = await auth();
    if (!userId) notFound();
    project = await getProjectForPreview(slug);
  } else {
    project = await getProject(slug);
  }

  if (!project) {
    notFound();
  }

  const headings = extractHeadings(project.blogPost);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: project.title,
    description: project.description,
    datePublished: new Date(project.date).toISOString(),
    dateModified: project.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blogs/${slug}`,
    },
    ...(project.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: project.imageUrl,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      {isPreview && <PreviewBanner status={project.status} slug={slug} />}
      <ProjectPageClient project={project} headings={headings}>
        <ProjectContent content={project.blogPost} />
      </ProjectPageClient>
      <BackToTop />
    </>
  );
}
