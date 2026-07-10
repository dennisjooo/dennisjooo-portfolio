import type { Metadata } from "next";
import { BackToTop } from "@/components/shared";
import { GalleryPageClient } from "@/components/gallery/GalleryPageClient";
import { getGalleryImages } from "@/lib/data/gallery";
import { SITE_URL } from "@/lib/constants/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery | Dennis' Portfolio",
  description: "Photography and visual work by Dennis Jonathan.",
  alternates: {
    canonical: "/gallery",
  },
};

export default async function GalleryPage() {
  const initialData = await getGalleryImages(1, 12);

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
        name: "Gallery",
        item: `${SITE_URL}/gallery`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="flex flex-col py-8 md:py-12">
        <div className="container mx-auto max-w-7xl px-6 pt-24 md:pt-20">
          <header className="mb-8 w-full md:mb-10">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Gallery
            </p>
            <h1 className="mb-4 font-caslon text-4xl italic leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Pictures
            </h1>
            <p className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
              Some of my crappy pictures, please don't judge me.
            </p>
          </header>

          <GalleryPageClient
            initialImages={initialData.data}
            initialPagination={initialData.pagination}
          />
        </div>
      </section>

      <BackToTop />
    </div>
  );
}
