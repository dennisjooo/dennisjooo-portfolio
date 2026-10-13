import { HoverGlow } from "@/components/shared/HoverGlow";

export function BlogLinkCardGlow({ large = false }: { large?: boolean }) {
  return (
    <HoverGlow rounded="xl" className={large ? "md:rounded-2xl" : undefined} />
  );
}
