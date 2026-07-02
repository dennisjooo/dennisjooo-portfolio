import type { SecretDefinition } from "./types";

export function matchSecrets(
  search: string,
  secrets: SecretDefinition[],
): SecretDefinition[] {
  const normalized = search.toLowerCase().trim();
  if (!normalized) return [];

  return secrets.filter((secret) =>
    secret.triggers.some((trigger) =>
      normalized.includes(trigger.toLowerCase()),
    ),
  );
}
