export interface RollbackConfig {
  prefix: string;
  oldText: string;
  newText: string;
  suffix: string;
}

export type RollbackPhase =
  "typing-to-old" | "pausing" | "deleting-old" | "typing-new" | "done";

export const parseRollback = (text: string): RollbackConfig | null => {
  const rollbackRegex = /^(.*){{(.+?)>>(.+?)}}(.*)$/;
  const match = text.match(rollbackRegex);

  if (match) {
    return {
      prefix: match[1],
      oldText: match[2],
      newText: match[3],
      suffix: match[4],
    };
  }
  return null;
};

export const resolveTypingDescription = (text: string): string => {
  const parsed = parseRollback(text);
  if (parsed) {
    return parsed.prefix + parsed.newText + parsed.suffix;
  }
  return text;
};
