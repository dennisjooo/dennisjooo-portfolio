import packageJson from "@/package.json";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants/site";
import { defaultAboutContent } from "@/components/landing/about/contentSections";
import { skillCategories } from "@/data/skillContent";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import type { SiteManifestData } from "./types";
import type { SitemapEntry } from "./types";

function blogSlug(title: string, slug: string | null): string {
  return slug || createUrlSlug(title);
}

function formatDateForXml(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemapEntries(data: SiteManifestData): SitemapEntry[] {
  const now = new Date();
  const blogPages: SitemapEntry[] = [...data.projects, ...data.blogPosts].map(
    (entry) => ({
      url: `${SITE_URL}/blogs/${blogSlug(entry.title, entry.slug)}`,
      lastModified: new Date(entry.date),
      changeFrequency: "monthly",
      priority: entry.type === "project" ? 0.6 : 0.5,
    }),
  );

  const staticPages: SitemapEntry[] = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  return [...staticPages, ...blogPages];
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${formatDateForXml(entry.lastModified)}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Site build version: ${escapeXml(packageJson.version)} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function aboutText(data: SiteManifestData): {
  intro: string;
  experience: string;
  personal: string;
  outro: string;
} {
  const config = data.siteConfig;
  return {
    intro: config?.aboutIntro || defaultAboutContent.intro,
    experience: config?.aboutExperience || defaultAboutContent.experience,
    personal: config?.aboutPersonal || defaultAboutContent.personal,
    outro: config?.aboutOutro || defaultAboutContent.outro,
  };
}

function formatProjectSection(data: SiteManifestData): string {
  if (data.projects.length === 0) {
    return "";
  }

  const sections = data.projects.map((project) => {
    const slug = blogSlug(project.title, project.slug);
    const links =
      project.links && project.links.length > 0
        ? `\n**Links:**\n${project.links.map((link) => `- ${link.text}: ${link.url}`).join("\n")}`
        : "";
    const portfolioLink = `\n- Portfolio: ${SITE_URL}/blogs/${slug}`;

    return `### ${project.title}
${project.description}${links}${portfolioLink}`;
  });

  return `## Projects

${sections.join("\n\n---\n\n")}`;
}

function formatBlogSection(data: SiteManifestData): string {
  if (data.blogPosts.length === 0) {
    return "";
  }

  const sections = data.blogPosts.map((post) => {
    const slug = blogSlug(post.title, post.slug);
    return `### ${post.title}
${post.description}

- Read: ${SITE_URL}/blogs/${slug}`;
  });

  return `## Blog Posts

${sections.join("\n\n")}`;
}

function formatWorkExperience(data: SiteManifestData): string {
  if (data.workExperiences.length === 0) {
    return "";
  }

  const sections = data.workExperiences.map((entry) => {
    const items = entry.responsibilities ?? [];
    const responsibilities =
      items.length > 0
        ? `\n\n${items.map((item) => `- ${item}`).join("\n")}`
        : "";

    return `### ${entry.title} at ${entry.company} (${entry.date})${responsibilities}`;
  });

  return `## Work Experience

${sections.join("\n\n")}`;
}

function formatSkills(): string {
  const categories = skillCategories.map(
    (category) => `- **${category.title}:** ${category.skills.join(", ")}`,
  );

  return `## Skills & Technologies

${categories.join("\n")}`;
}

function formatCertifications(data: SiteManifestData): string {
  if (data.certifications.length === 0) {
    return "";
  }

  const items = data.certifications.map(
    (cert) =>
      `- **${cert.title}** - ${cert.issuer} (${cert.date}): ${cert.description}${cert.link ? ` — ${cert.link}` : ""}`,
  );

  return `## Certifications

${items.join("\n")}`;
}

function formatContact(data: SiteManifestData): string {
  const contactLines =
    data.contacts.length > 0
      ? data.contacts.map(
          (contact) => `- **${contact.label}:** ${contact.href}`,
        )
      : [
          "- **Portfolio:** https://dennisjooo.vercel.app",
          "- **Email:** mailto:dennisjonathan78@gmail.com",
          "- **GitHub:** https://github.com/dennisjooo",
          "- **LinkedIn:** https://linkedin.com/in/dennisjooo",
        ];

  return `## Contact

${contactLines.join("\n")}`;
}

export function buildLlmsTxt(
  data: SiteManifestData,
  siteDescription: string,
): string {
  const about = aboutText(data);
  const sections = [
    `# ${SITE_NAME}'s Portfolio`,
    `> ${siteDescription}`,
    `- **Build version:** v${packageJson.version}`,
    about.intro,
    about.experience,
    about.personal,
    formatWorkExperience(data),
    formatProjectSection(data),
    formatBlogSection(data),
    formatSkills(),
    formatCertifications(data),
    formatContact(data),
    "## Optional",
    [
      `- [Homepage](${SITE_URL}/): ${SITE_TAGLINE}`,
      `- [Projects & Certifications](${SITE_URL}/blogs): Full project list and certification cards`,
      `- [Skills Section](${SITE_URL}/#skills): Interactive skills marquee`,
    ].join("\n"),
  ];

  return `${sections.filter((section) => section.length > 0).join("\n\n")}\n`;
}
