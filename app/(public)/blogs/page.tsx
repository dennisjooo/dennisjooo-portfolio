import { BackToTop } from "@/components/shared";
import { BlogsTabs } from "@/components/blogs/list/BlogsTabs";
import { getBlogs } from "@/lib/data/blogs";
import { getCertifications } from "@/lib/data/certifications";
import { PUBLIC_LIST_PAGE_SIZE } from "@/lib/constants/blogsList";
import { SITE_URL } from "@/lib/constants/site";

export const revalidate = 60;

export default async function ProjectsAndCertificationsPage() {
  const [initialBlogsData, initialCertificationsData] = await Promise.all([
    getBlogs(null, PUBLIC_LIST_PAGE_SIZE, "all"),
    getCertifications(null, PUBLIC_LIST_PAGE_SIZE),
  ]);

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
          initialCertifications={initialCertificationsData.data}
          initialCertificationsPagination={initialCertificationsData.pagination}
        />
      </section>

      <BackToTop />
    </div>
  );
}
