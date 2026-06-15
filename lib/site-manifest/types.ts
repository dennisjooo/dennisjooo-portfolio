import type {
  Blog,
  Certification,
  Contact,
  SiteConfig,
  WorkExperience,
} from "@/lib/db/schema";

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export interface SiteManifestData {
  siteConfig: SiteConfig | null;
  workExperiences: WorkExperience[];
  projects: Blog[];
  blogPosts: Blog[];
  certifications: Certification[];
  contacts: Contact[];
}
