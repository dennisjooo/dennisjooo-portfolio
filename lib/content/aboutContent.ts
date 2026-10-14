export interface ContentSection {
  id: string;
  title: string;
  body: string;
}

export type AboutContent = ContentSection[];

export const ABOUT_SECTION_MIN = 1;
export const ABOUT_SECTION_MAX = 6;
export const ABOUT_BODY_SOFT_LIMIT = 420;

export const defaultAboutContent: AboutContent = [
  {
    id: "hello",
    title: "Hello",
    body: `Hey, I'm Dennis. I take ideas apart, figure out how they tick, and put them back together a little smarter. Business Mathematics by training; data, AI, and systems that make life flow by obsession. I like when logic meets intuition — when something just clicks.`,
  },
  {
    id: "craft",
    title: "Craft",
    body: `I've shipped ML apps, orchestrated chatbots, and tools that turn chaos into clarity. I live in the messy space between a rough sketch and something people actually use. Less hype, more quiet progress: automations that save time, systems that scale, ideas that grow legs.`,
  },
  {
    id: "play",
    title: "Play",
    body: `Off the clock I'm half-lost in papers I only half understand, sketching side projects that may never ship, or running laps in a sim rig like there's a trophy at stake. Comics, science books, strange ideas. Building isn't just utility — it's curiosity, rhythm, and play.`,
  },
];

function isAboutSection(value: unknown): value is ContentSection {
  if (!value || typeof value !== "object") return false;
  const section = value as Record<string, unknown>;
  return (
    typeof section.id === "string" &&
    section.id.length > 0 &&
    typeof section.title === "string" &&
    typeof section.body === "string"
  );
}

export function parseAboutSections(
  value: unknown,
): { ok: true; value: AboutContent } | { ok: false; error: string } {
  if (!Array.isArray(value)) {
    return { ok: false, error: "About sections must be an array" };
  }
  if (value.length < ABOUT_SECTION_MIN || value.length > ABOUT_SECTION_MAX) {
    return {
      ok: false,
      error: `About sections must have between ${ABOUT_SECTION_MIN} and ${ABOUT_SECTION_MAX} items`,
    };
  }
  if (!value.every(isAboutSection)) {
    return {
      ok: false,
      error: "Each about section needs an id, title, and body",
    };
  }
  return { ok: true, value };
}

export function resolveAboutContent(
  sections?: AboutContent | null,
): AboutContent {
  if (sections && sections.length > 0) return sections;
  return defaultAboutContent;
}
