"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function adjustTextareaHeight(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

interface AutoResizeTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange" | "value"
> {
  value: string;
  onValueChange: (value: string) => void;
}

export function AutoResizeTextarea({
  value,
  onValueChange,
  className,
  onInput,
  ...props
}: AutoResizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (ref.current) adjustTextareaHeight(ref.current);
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={1}
      onChange={(e) => onValueChange(e.target.value)}
      onInput={(e) => {
        adjustTextareaHeight(e.currentTarget);
        onInput?.(e);
      }}
      className={cn(className, "resize-y overflow-hidden")}
      {...props}
    />
  );
}
