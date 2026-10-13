import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function BackToBlogsLink({ children }: { children: React.ReactNode }) {
  return (
    <Link
      href="/blogs"
      className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {children}
    </Link>
  );
}
