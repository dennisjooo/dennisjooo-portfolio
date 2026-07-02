import type { Metadata } from "next";
import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import WorkExperience from "@/components/landing/work-experience";
import FeaturedProjects from "@/components/landing/featured-projects";
import dynamic from "next/dynamic";
import { HomeEffects } from "@/components/landing/home/HomeEffects";
import { SectionSkeleton } from "@/components/shared/SectionSkeleton";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants/site";
import {
  getSiteConfig,
  getWorkExperience,
  getContacts,
  buildAboutContent,
} from "@/lib/data/site";
import { getFeaturedProjects } from "@/lib/data/blogs";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const Skills = dynamic(() => import("@/components/landing/skills"), {
  loading: () => <SectionSkeleton height="min-h-[50vh]" />,
});
const Contacts = dynamic(() => import("@/components/landing/contacts"), {
  loading: () => <SectionSkeleton height="min-h-[50vh]" />,
});

const BackToTop = dynamic(() => import("@/components/shared/scroll/BackToTop"));

export default async function Home() {
  const [projects, config, workExperience, contactLinks] = await Promise.all([
    getFeaturedProjects(),
    getSiteConfig(),
    getWorkExperience(),
    getContacts(),
  ]);

  const profileImageUrl = config?.profileImageUrl ?? undefined;
  const aboutContent = buildAboutContent(config);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    jobTitle: "Developer & Designer",
    sameAs: contactLinks
      .filter((c) => c.href.startsWith("http"))
      .map((c) => c.href),
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Web Development",
      "Statistics",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE_NAME}'s Portfolio`,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    author: {
      "@type": "Person",
      name: SITE_NAME,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <div id="home-hero" className="sticky top-0 z-0 h-screen w-full">
        <Hero />
      </div>

      <div
        id="home-content"
        className="relative z-10 bg-background shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      >
        <About profileImageUrl={profileImageUrl} aboutContent={aboutContent} />
        <WorkExperience workExperience={workExperience} />
        <FeaturedProjects projects={projects} />
        <Skills />
        <Contacts contacts={contactLinks} />
      </div>

      <BackToTop />
      <HomeEffects />
    </>
  );
}
