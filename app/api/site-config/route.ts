import { db, siteConfig } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireAuth, isAuthError, successResponse, errorResponse } from "@/lib/api/apiHelpers";
import { defaultAboutContent } from "@/components/landing/about/contentSections";

export async function GET() {
  try {
    const [config] = await db.select().from(siteConfig).limit(1);

    if (!config) {
      // Create default config if none exists
      const [newConfig] = await db
        .insert(siteConfig)
        .values({
          profileImageUrl: "/images/profile.webp",
          aboutIntro: defaultAboutContent.intro,
          aboutExperience: defaultAboutContent.experience,
          aboutPersonal: defaultAboutContent.personal,
          aboutOutro: defaultAboutContent.outro,
        })
        .returning();
      return successResponse(newConfig);
    }

    return successResponse(config);
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return errorResponse("Failed to fetch site config", 500);
  }
}

export async function PUT(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    // Get existing config or create new one
    const [existingConfig] = await db.select().from(siteConfig).limit(1);

    let config;
    if (existingConfig) {
      [config] = await db
        .update(siteConfig)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(siteConfig.id, existingConfig.id))
        .returning();
    } else {
      [config] = await db
        .insert(siteConfig)
        .values({
          profileImageUrl: body.profileImageUrl ?? "/images/profile.webp",
          aboutIntro: body.aboutIntro ?? defaultAboutContent.intro,
          aboutExperience: body.aboutExperience ?? defaultAboutContent.experience,
          aboutPersonal: body.aboutPersonal ?? defaultAboutContent.personal,
          aboutOutro: body.aboutOutro ?? defaultAboutContent.outro,
        })
        .returning();
    }

    return successResponse(config);
  } catch (error) {
    console.error("Failed to update site config:", error);
    return errorResponse("Failed to update site config", 500);
  }
}
