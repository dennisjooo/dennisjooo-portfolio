import { db, siteConfig } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  requireAuth,
  isAuthError,
  successResponse,
  mutationResponse,
  errorResponse,
} from "@/lib/api/apiHelpers";
import {
  defaultAboutContent,
  parseAboutSections,
  type AboutContent,
} from "@/lib/content/aboutContent";

function hasAboutSections(
  sections: AboutContent | null | undefined,
): sections is AboutContent {
  return Array.isArray(sections) && sections.length > 0;
}

export async function GET() {
  try {
    const [config] = await db.select().from(siteConfig).limit(1);

    if (!config) {
      const [newConfig] = await db
        .insert(siteConfig)
        .values({
          profileImageUrl: "/images/profile.webp",
          aboutSections: defaultAboutContent,
        })
        .returning();
      return successResponse(newConfig);
    }

    if (!hasAboutSections(config.aboutSections)) {
      const [seeded] = await db
        .update(siteConfig)
        .set({ aboutSections: defaultAboutContent, updatedAt: new Date() })
        .where(eq(siteConfig.id, config.id))
        .returning();
      return successResponse(seeded);
    }

    return successResponse(config);
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return errorResponse("Failed to fetch site config", 500);
  }
}

function parseSiteConfigUpdate(body: unknown) {
  if (!body || typeof body !== "object") {
    return { ok: false as const, error: "Invalid payload" };
  }

  const payload = body as Record<string, unknown>;
  const updates: {
    profileImageUrl?: string;
    aboutSections?: AboutContent;
    updatedAt: Date;
  } = { updatedAt: new Date() };

  if (payload.profileImageUrl !== undefined) {
    if (typeof payload.profileImageUrl !== "string") {
      return { ok: false as const, error: "Invalid profile image URL" };
    }
    updates.profileImageUrl = payload.profileImageUrl;
  }

  if (payload.aboutSections !== undefined) {
    const parsed = parseAboutSections(payload.aboutSections);
    if (!parsed.ok) return parsed;
    updates.aboutSections = parsed.value;
  }

  return { ok: true as const, value: updates };
}

export async function PUT(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const parsed = parseSiteConfigUpdate(await request.json());
    if (!parsed.ok) return errorResponse(parsed.error);

    const [existingConfig] = await db.select().from(siteConfig).limit(1);

    let config;
    if (existingConfig) {
      [config] = await db
        .update(siteConfig)
        .set(parsed.value)
        .where(eq(siteConfig.id, existingConfig.id))
        .returning();
    } else {
      [config] = await db
        .insert(siteConfig)
        .values({
          profileImageUrl:
            parsed.value.profileImageUrl ?? "/images/profile.webp",
          aboutSections: parsed.value.aboutSections ?? defaultAboutContent,
        })
        .returning();
    }

    return mutationResponse(config);
  } catch (error) {
    console.error("Failed to update site config:", error);
    return errorResponse("Failed to update site config", 500);
  }
}
