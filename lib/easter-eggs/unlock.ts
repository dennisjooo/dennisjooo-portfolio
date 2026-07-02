import { EASTER_EGG_STORAGE_KEY } from "./constants";
import { PALETTE_SECRETS } from "./secrets";

function readFoundIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(EASTER_EGG_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function writeFoundIds(ids: string[]): void {
  localStorage.setItem(EASTER_EGG_STORAGE_KEY, JSON.stringify(ids));
}

export function getTotalSecretCount(): number {
  return PALETTE_SECRETS.length + 1;
}

export function getFoundSecretCount(): number {
  return readFoundIds().length;
}

export function markSecretFound(id: string): void {
  const found = readFoundIds();
  if (found.includes(id)) return;
  writeFoundIds([...found, id]);
}
