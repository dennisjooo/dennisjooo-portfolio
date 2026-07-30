import { PALETTE_SECRETS } from "./secrets";

const EASTER_EGG_QUERY_TERMS = [
  "easter",
  "egg",
  "eggs",
  "secret",
  "secrets",
  "hint",
  "scavenger",
  "unlock",
  "hidden",
  "reset",
  "restart",
];

export function isEasterEggSearch(search: string): boolean {
  const normalized = search.toLowerCase().trim();
  if (!normalized) return false;

  if (EASTER_EGG_QUERY_TERMS.some((term) => normalized.includes(term))) {
    return true;
  }

  return PALETTE_SECRETS.some((secret) =>
    secret.triggers.some((trigger) =>
      normalized.includes(trigger.toLowerCase()),
    ),
  );
}

export function shouldShowEasterEggProgress(
  search: string,
  matchedSecretCount: number,
): boolean {
  if (!search.trim()) return true;
  if (matchedSecretCount > 0) return true;
  return isEasterEggSearch(search);
}
