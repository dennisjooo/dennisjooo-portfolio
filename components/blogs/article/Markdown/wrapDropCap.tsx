import { Children, type ReactNode } from "react";
import { splitDropCap } from "@/lib/utils/dropCap";

export function wrapDropCap(children: ReactNode): ReactNode {
  const items = Children.toArray(children);
  const first = items[0];
  if (typeof first !== "string") return children;

  const parts = splitDropCap(first);
  if (!parts) return children;

  return [
    <span
      key="drop-cap"
      className="article-dropcap"
      data-length={Math.min(parts.cap.length, 4)}
      data-joined={/^\S/.test(parts.rest) ? "true" : undefined}
    >
      {parts.cap}
    </span>,
    parts.rest,
    ...items.slice(1),
  ];
}
