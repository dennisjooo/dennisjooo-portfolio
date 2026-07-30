import {
  FOOTER_SECRET_ID,
  HIDDEN_SECRET_IDS,
  NAV_LOGO_SECRET_ID,
} from "./constants";
import { PALETTE_SECRETS } from "./secrets";

const SECRET_HINTS: Record<string, string> = {
  rickroll: "Search for bitcoin, free, or rick",
  sudo: "Try searching sudo or root",
  "force-push": "Try git push or force",
  void: "Search 404, void, or lost",
  coffee: "Try coffee or caffeine",
  hire: "Search hire, available, or work",
  build: "Try version, build, or commit",
  [FOOTER_SECRET_ID]: "Shift+click the footer copyright",
  [NAV_LOGO_SECRET_ID]: "Triple-click the navbar logo",
};

const GENERAL_HINTS = [
  "Open DevTools for a console surprise",
  "Secrets unlock when you trigger them",
  "Search keywords to reveal hidden commands",
];

export function getEasterEggHint(foundIds: string[]): string {
  const allIds = [...PALETTE_SECRETS.map((s) => s.id), ...HIDDEN_SECRET_IDS];
  const unfound = allIds.filter((id) => !foundIds.includes(id));

  if (unfound.length === 0) {
    return "You found them all. Absolute legend.";
  }

  const nextSecretId = unfound[0]!;
  const secretHint = SECRET_HINTS[nextSecretId];
  if (secretHint) return secretHint;

  return GENERAL_HINTS[foundIds.length % GENERAL_HINTS.length]!;
}

export const EASTER_EGG_HINTS = [
  ...Object.values(SECRET_HINTS),
  ...GENERAL_HINTS,
];

export function pickRotatingConsoleHint(): string {
  const version = process.env.NEXT_PUBLIC_BUILD_VERSION;
  const pool = version
    ? [...EASTER_EGG_HINTS, `Build: v${version}`]
    : EASTER_EGG_HINTS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
