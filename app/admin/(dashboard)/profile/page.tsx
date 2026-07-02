"use client";

import { useState } from "react";
import Image from "next/image";
import { CameraIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { buildUploadPayload } from "@/lib/utils/blobUpload";
import { useSiteConfig } from "@/lib/hooks/data/useSiteConfig";
import { LoadingSpinner } from "@/components/admin/shared";

export default function ProfileAdminPage() {
  const { config, loading, updateConfig } = useSiteConfig();
  const [uploading, setUploading] = useState(false);

  const imageUrl = config?.profileImageUrl || "/images/profile.webp";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const file = e.target.files[0];

    try {
      const { contentHash, body } = await buildUploadPayload(file);

      const response = await fetch(
        `/api/upload?filename=profile.webp&contentHash=${contentHash}`,
        {
          method: "POST",
          body,
        },
      );

      const newBlob = await response.json();

      await updateConfig({ profileImageUrl: newBlob.url });
      toast.success("Profile updated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-caslon text-3xl italic text-foreground md:text-4xl">
          Profile{" "}
          <span className="font-sans font-bold not-italic">Settings</span>
        </h1>
        <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Global configuration & identity
        </p>
      </div>

      <div className="glass-panel max-w-2xl rounded-2xl border border-border/50 p-8">
        <div className="flex flex-col items-start gap-8 md:flex-row">
          <div className="group relative">
            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-background shadow-xl">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Profile"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized={imageUrl.startsWith("http")}
                />
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <ArrowPathIcon className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
            </div>

            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-colors group-hover:scale-110 hover:bg-primary/90"
            >
              <CameraIcon className="h-5 w-5" />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="font-sans text-xl font-bold">Profile Picture</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This image will be displayed on your homepage and navigation bar.
              Recommended size: 500x500px. JPG, PNG or WebP.
            </p>

            <div className="border-t border-border/50 pt-4">
              <h4 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Current Source
              </h4>
              <code className="block w-full break-all rounded-lg border border-border/50 bg-muted/50 p-3 font-mono text-xs text-muted-foreground">
                {imageUrl}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
