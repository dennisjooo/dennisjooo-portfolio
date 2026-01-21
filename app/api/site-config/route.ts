import { NextResponse } from "next/server";
import { db, siteConfig } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

const defaultAboutContent = {
  intro: `Hey, I'm Dennis. I like taking ideas apart, figuring out how they tick, and putting them back together in a way that feels a little smarter. I studied Business Mathematics, but these days my curiosity leans more toward data, AI, and building systems that make life flow a bit smoother. I like when logic meets intuition, when something just clicks and works better than it has any right to.`,
  experience: `I've built and shipped ML apps, orchestrated chatbots, and pieced together tools that turn chaos into clarity. I'm drawn to projects that live in the messy space between idea and execution, where a rough sketch becomes something people actually use. I care less about chasing hype and more about quiet, useful progress: automations that save time, systems that scale well, and ideas that grow legs on their own.`,
  personal: `Outside of work, I'm usually buried in ML papers I only half understand (for now), sketching side projects that may or may not see daylight, or running laps in a sim rig like there's a trophy at stake. I love comics, science books, and strange ideas that don't fit anywhere yet. For me, building isn't just about utility, it's about curiosity, rhythm, and play.`,
  outro: `If you're into AI, design, or building things that make people pause and go "oh, that's clever," let's talk. I'm always down to share ideas, trade experiments, or spin up something new, half for the fun of it, half to see what it might become.`,
};

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
      return NextResponse.json(newConfig);
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return NextResponse.json(
      { error: "Failed to fetch site config" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

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

    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to update site config:", error);
    return NextResponse.json(
      { error: "Failed to update site config" },
      { status: 500 }
    );
  }
}
