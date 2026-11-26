export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dennisjooo.vercel.app";

export const SITE_NAME = "Dennis Jonathan";
export const SITE_MARK = "DJ";
export const SITE_TITLE = "Dennis' Portfolio";
export const SITE_PORTFOLIO_NAME = `${SITE_NAME}'s Portfolio`;
export const SITE_LOCATION = "Jakarta, Indonesia";

export const SITE_TAGLINE = "Okay Developer & Human Being";

export const SITE_DESCRIPTION =
  "AI enthusiast and problem solver with a background in math, stats, and machine learning. I build practical tools, explore weird ideas, and make complex stuff a little more approachable.";

export const DEFAULT_PROFILE_IMAGE = "/images/profile.webp";
export const PROFILE_IMAGE_FILENAME = "profile.webp";

export function getSiteHostname(): string {
  return new URL(SITE_URL).hostname;
}
