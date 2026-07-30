"use client";

import { useState, useCallback, type FormEvent } from "react";

export function useAdminSubmitHandler<T>(
  onSubmit: (data: Partial<T>) => Promise<void>,
) {
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = useCallback(
    (getData: () => Partial<T>) => async (e: FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        await onSubmit(getData());
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit],
  );

  return { submitting, handleFormSubmit };
}
