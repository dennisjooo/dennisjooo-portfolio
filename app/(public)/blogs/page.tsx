import type { Metadata } from "next";
import { BackToTop } from "@/components/shared";
import { BlogsTabs } from "@/components/blogs/list/BlogsTabs";
import { getBlogs } from "@/lib/data/blogs";
import { SITE_URL } from "@/lib/constants/site";

// Enable ISR for blogs listing
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog & Certifications | Dennis' Portfolio",
  description:
    "Explore Dennis' projects, blog posts, and professional certifications.",
  alternates: {
    canonical: "/blogs",
  },
};

export default async function ProjectsAndCertificationsPage() {
  const initialBlogsData = await getBlogs(1, 7, "all");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog & Certifications",
        item: `${SITE_URL}/blogs`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section
        id="projects-and-certifications"
        className="flex flex-col py-8 md:py-12"
      >
        <BlogsTabs
          initialProjects={initialBlogsData.data}
          initialPagination={initialBlogsData.pagination}
        />
      </section>

      <BackToTop />
    </div>
  );
}
