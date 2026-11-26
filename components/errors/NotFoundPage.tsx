"use client";

import Link from "next/link";

interface NotFoundPageProps {
  error?: { reset: () => void };
}

const actionClasses =
  "font-sans text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]";

export function NotFoundPage({ error }: NotFoundPageProps) {
  const isError = Boolean(error);

  return (
    <section className="relative flex min-h-dvh w-full flex-col justify-end bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-24 md:pb-20">
        <h1 className="max-w-none font-serif text-7xl font-semibold leading-[1] tracking-tight text-foreground sm:text-8xl md:text-9xl">
          <span className="block">{isError ? "That" : "Nothing"}</span>
          <span className="block">{isError ? "broke." : "here."}</span>
        </h1>
        <div className="mt-10 flex items-baseline justify-between gap-6 border-t border-border pt-4 text-sm text-muted-foreground md:mt-14 md:text-base">
          <p className="font-serif">
            {isError
              ? "Something failed on our side. Try again, or head home if it keeps happening."
              : "This URL doesn't lead anywhere. It may have moved, or never existed."}
          </p>
          <p className="shrink-0 font-mono text-xs md:text-sm">
            {isError ? "500" : "404"}
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          {error && (
            <button
              type="button"
              onClick={error.reset}
              className={actionClasses}
            >
              Try again
            </button>
          )}
          <Link href="/" className={actionClasses}>
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
