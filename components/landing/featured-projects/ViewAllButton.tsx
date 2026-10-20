import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const ViewAllButton = () => {
  return (
    <div className="mt-12 flex w-full justify-center md:mt-16">
      <Link
        href="/blogs"
        prefetch
        className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
      >
        Read the blog
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
};
