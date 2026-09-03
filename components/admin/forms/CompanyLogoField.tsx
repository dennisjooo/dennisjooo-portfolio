"use client";

import Image from "next/image";
import { ArrowPathIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormField } from "@/components/admin/shared/FormField";

interface CompanyLogoFieldProps {
  imageSrc: string;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (url: string) => void;
}

export function CompanyLogoField({
  imageSrc,
  uploading,
  onUpload,
  onUrlChange,
}: CompanyLogoFieldProps) {
  return (
    <FormField label="Company Logo">
      <div className="flex items-start gap-6">
        <div className="group relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="Company logo"
                fill
                className="object-contain p-2"
                unoptimized={imageSrc.startsWith("http")}
              />
            ) : (
              <PhotoIcon className="h-8 w-8 text-muted-foreground" />
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <ArrowPathIcon className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>
          <label
            htmlFor="logo-upload"
            className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
          >
            <PhotoIcon className="h-4 w-4" />
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={onUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex-1">
          <input
            type="text"
            className={formStyles.input}
            placeholder="Or enter image URL directly..."
            value={imageSrc}
            onChange={(e) => onUrlChange(e.target.value)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Upload an image or paste a URL. Supports local paths like
            /images/work/company.svg
          </p>
        </div>
      </div>
    </FormField>
  );
}
