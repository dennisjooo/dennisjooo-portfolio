"use client";

import { useEffect } from "react";
import { NotFoundPage } from "@/components/errors/NotFoundPage";

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

  return <NotFoundPage embedded error={{ digest: error.digest, reset }} />;
}
