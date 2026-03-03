"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { SiteConfig } from "@/lib/db";

type SiteConfigData = Omit<SiteConfig, "id" | "createdAt" | "updatedAt">;

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfigData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-config", { cache: "no-store" })
      .then((res) => res.json())
      .then((res) => {
        const config = res.data ?? res;
        setConfig(config as SiteConfigData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load site config:", error);
        toast.error("Failed to load configuration");
        setLoading(false);
      });
  }, []);

  const updateConfig = useCallback(
    async (updates: Partial<SiteConfigData>) => {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        throw new Error("Failed to update site config");
      }

      setConfig((prev) => (prev ? { ...prev, ...updates } : prev));
      return res;
    },
    []
  );

  return { config, loading, updateConfig };
}
