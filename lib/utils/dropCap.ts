const OPENING_QUOTE = /^[\u201C\u2018"']/;
const LETTER = /^\p{L}/u;
const WORD = /^[\p{L}'\u2019]+/u;
const IMMEDIATE_CONTRACTION = /^\p{L}(?:['\u2019]\p{L}+)+/u;
const SHORT_CONTRACTION_MAX = 4;

export function splitDropCap(
  text: string,
): { cap: string; rest: string } | null {
  const body = text.replace(/^\s+/, "");
  if (!body) return null;

  const opening = body.match(OPENING_QUOTE)?.[0] ?? "";
  const afterQuote = body.slice(opening.length);
  if (!LETTER.test(afterQuote)) return null;

  const word = afterQuote.match(WORD)?.[0] ?? afterQuote[0];
  const immediate = afterQuote.match(IMMEDIATE_CONTRACTION)?.[0];
  const shortWord =
    word.length <= SHORT_CONTRACTION_MAX && /['\u2019]/.test(word)
      ? word
      : null;

  const cap = opening + (immediate ?? shortWord ?? afterQuote[0]);
  return { cap, rest: body.slice(cap.length) };
}

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function isImageParagraph(node: HastNode): boolean {
  return (
    node.children?.some(
      (child) => child.type === "element" && child.tagName === "img",
    ) ?? false
  );
}

export function rehypeLeadParagraph() {
  return (tree: HastNode) => {
    for (const child of tree.children ?? []) {
      if (child.type !== "element" || child.tagName !== "p") continue;
      if (isImageParagraph(child)) continue;

      const className = child.properties?.className;
      if (Array.isArray(className)) {
        className.push("article-lead");
      } else if (typeof className === "string" && className.length > 0) {
        child.properties = {
          ...child.properties,
          className: `${className} article-lead`,
        };
      } else {
        child.properties = {
          ...child.properties,
          className: ["article-lead"],
        };
      }
      break;
    }
  };
}
