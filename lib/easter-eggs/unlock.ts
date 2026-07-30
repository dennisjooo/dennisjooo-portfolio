import {
  EASTER_EGG_STORAGE_KEY,
  EASTER_EGG_FOUND_EVENT,
  HIDDEN_SECRET_IDS,
} from "./constants";
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
  return PALETTE_SECRETS.length + HIDDEN_SECRET_IDS.length;
}

export function getFoundSecretCount(): number {
  return readFoundIds().length;
}

export function getFoundSecretIds(): string[] {
  return readFoundIds();
}

export function markSecretFound(id: string): void {
  const found = readFoundIds();
  if (found.includes(id)) return;
  writeFoundIds([...found, id]);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(EASTER_EGG_FOUND_EVENT, { detail: id }),
    );
  }
}
