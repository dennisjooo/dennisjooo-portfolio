"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-noise flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-caslon text-4xl italic md:text-5xl">
          Something went wrong
        </h1>
        <p className="max-w-md text-sm text-foreground/60">
          An unexpected error occurred. Try again, or refresh the page if the
          problem persists.
        </p>
        <button
          onClick={reset}
          className="mt-2 rounded-full border border-foreground/20 px-6 py-2 text-sm font-medium transition-colors hover:border-foreground/40 hover:bg-foreground/5"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
