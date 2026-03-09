import { NextResponse } from "next/server";
import { db, blogs, contacts, workExperiences, certifications } from "@/lib/db";
import { desc, not, like } from "drizzle-orm";
import { requireAuth, isAuthError } from "@/lib/api/apiHelpers";

interface ActivityItem {
  id: string;
  title: string;
  type: "blog" | "project" | "contact" | "work-experience" | "certification";
  href: string;
  updatedAt: string;
  meta?: string;
}

export async function GET() {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const [recentBlogs, recentWork, recentCerts, recentContacts] =
      await Promise.all([
        db
          .select({
            id: blogs.id,
            title: blogs.title,
            type: blogs.type,
            status: blogs.status,
            updatedAt: blogs.updatedAt,
          })
          .from(blogs)
          .where(not(like(blogs.slug, "%-preview")))
          .orderBy(desc(blogs.updatedAt))
          .limit(5),
        db
          .select({
            id: workExperiences.id,
            title: workExperiences.title,
            company: workExperiences.company,
            updatedAt: workExperiences.updatedAt,
          })
          .from(workExperiences)
          .orderBy(desc(workExperiences.updatedAt))
          .limit(3),
        db
          .select({
            id: certifications.id,
            title: certifications.title,
            issuer: certifications.issuer,
            updatedAt: certifications.updatedAt,
          })
          .from(certifications)
          .orderBy(desc(certifications.updatedAt))
          .limit(3),
        db
          .select({
            id: contacts.id,
            label: contacts.label,
            updatedAt: contacts.updatedAt,
          })
          .from(contacts)
          .orderBy(desc(contacts.updatedAt))
          .limit(3),
      ]);

    const items: ActivityItem[] = [
      ...recentBlogs.map((b) => ({
        id: b.id,
        title: b.title,
        type: b.type as "blog" | "project",
        href: `/admin/blogs/${b.id}`,
        updatedAt: b.updatedAt.toISOString(),
        meta: b.status,
      })),
      ...recentWork.map((w) => ({
        id: w.id,
        title: `${w.title} at ${w.company}`,
        type: "work-experience" as const,
        href: `/admin/work-experience/${w.id}`,
        updatedAt: w.updatedAt.toISOString(),
      })),
      ...recentCerts.map((c) => ({
        id: c.id,
        title: c.title,
        type: "certification" as const,
        href: `/admin/certifications/${c.id}`,
        updatedAt: c.updatedAt.toISOString(),
        meta: c.issuer,
      })),
      ...recentContacts.map((c) => ({
        id: c.id,
        title: c.label,
        type: "contact" as const,
        href: `/admin/contacts/${c.id}`,
        updatedAt: c.updatedAt.toISOString(),
      })),
    ];

    items.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json({ data: items.slice(0, 8) });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}
