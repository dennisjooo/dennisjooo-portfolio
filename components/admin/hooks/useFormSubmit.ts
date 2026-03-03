"use client";

import { useState, useCallback } from "react";

export function useFormSubmit() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent, submitFn: () => Promise<void>) => {
      e.preventDefault();
      setLoading(true);
      try {
        await submitFn();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, handleSubmit };
}
