import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import WorkExperience from "@/components/landing/work-experience";
import FeaturedProjects from "@/components/landing/featured-projects";
import dynamic from "next/dynamic";
import { HomeEffects } from "./HomeEffects";
import {
  getSiteConfig,
  getWorkExperience,
  getContacts,
  buildAboutContent,
} from "@/lib/data/site";
import { getFeaturedProjects } from "@/lib/data/blogs";

export const revalidate = 60;

const SectionSkeleton = ({ height = "min-h-screen" }: { height?: string }) => (
  <div className={`${height} bg-background`} />
);

const Skills = dynamic(() => import("@/components/landing/skills"), {
  loading: () => <SectionSkeleton height="min-h-[50vh]" />,
});
const Contacts = dynamic(() => import("@/components/landing/contacts"), {
  loading: () => <SectionSkeleton height="min-h-[50vh]" />,
});

const BackToTop = dynamic(() => import("@/components/shared/BackToTop"));

export default async function Home() {
  const [projects, config, workExperience, contactLinks] = await Promise.all([
    getFeaturedProjects(),
    getSiteConfig(),
    getWorkExperience(),
    getContacts(),
  ]);

  const profileImageUrl = config?.profileImageUrl ?? undefined;
  const aboutContent = buildAboutContent(config);

  return (
    <>
      <div id="home-hero" className="sticky top-0 h-screen w-full z-0">
        <Hero />
      </div>

      <div
        id="home-content"
        className="relative z-10 bg-white dark:bg-black shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
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
