"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import type { WorkExperience } from "@/lib/db";
import { formStyles } from "./shared/formStyles";
import { FormActions } from "./shared/FormActions";
import { FormField } from "./shared/FormField";
import { useImageUpload } from "@/lib/hooks/useImageUpload";
import { useFormSubmit } from "./hooks/useFormSubmit";
import { cn } from "@/lib/utils";

interface WorkExperienceFormProps {
  initialData?: WorkExperience;
  onSubmit: (data: Partial<WorkExperience>) => Promise<void>;
}

export default function WorkExperienceForm({
  initialData,
  onSubmit,
}: WorkExperienceFormProps) {
  const { loading, handleSubmit } = useFormSubmit();
  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    company: initialData?.company ?? "",
    date: initialData?.date ?? "",
    imageSrc: initialData?.imageSrc ?? "",
    responsibilities: initialData?.responsibilities ?? [""],
    order: initialData?.order ?? 0,
  });

  const { uploading, upload } = useImageUpload({
    folder: "work",
    onSuccess: (url) => setFormData((prev) => ({ ...prev, imageSrc: url })),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    await upload(e.target.files[0]);
  };

  const submitWorkExperience = async () => {
    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter((r) => r.trim() !== ""),
    };
    try {
      await onSubmit(cleanedData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to save work experience: ${message}`);
      throw error;
    }
  };

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const updateResponsibility = (index: number, value: string) => {
    setFormData(prev => {
      const updated = [...prev.responsibilities];
      updated[index] = value;
      return { ...prev, responsibilities: updated };
    });
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e, submitWorkExperience)}
      className={cn(formStyles.panel, "space-y-6 max-w-3xl")}
    >
      <FormField label="Company Logo">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden">
              {formData.imageSrc ? (
                <Image
                  src={formData.imageSrc}
                  alt="Company logo"
                  fill
                  className="object-contain p-2"
                  unoptimized={formData.imageSrc.startsWith("http")}
                />
              ) : (
                <PhotoIcon className="w-8 h-8 text-muted-foreground" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                  <ArrowPathIcon className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <label
              htmlFor="logo-upload"
              className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <PhotoIcon className="w-4 h-4" />
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
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
              value={formData.imageSrc}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, imageSrc: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground mt-2">
              Upload an image or paste a URL. Supports local paths like /images/work/company.svg
            </p>
          </div>
        </div>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Job Title">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. AI/ML Engineer"
            value={formData.title}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, title: e.target.value }))
            }
          />
        </FormField>

        <FormField label="Company">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. Sinar Mas Land"
            value={formData.company}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, company: e.target.value }))
            }
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Date Range">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. February 2024 - Now"
            value={formData.date}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, date: e.target.value }))
            }
          />
        </FormField>

        <FormField label="Display Order" hint="Lower numbers appear first">
          <input
            type="number"
            className={formStyles.input}
            placeholder="0"
            value={formData.order}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))
            }
          />
        </FormField>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={formStyles.label}>Responsibilities</label>
          <button
            type="button"
            onClick={addResponsibility}
            className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Item
          </button>
        </div>
        <div className="space-y-3">
          {formData.responsibilities.map((resp, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="p-3 text-muted-foreground font-mono text-sm">
                {index + 1}.
              </span>
              <textarea
                className={cn(formStyles.input, "resize-none")}
                rows={2}
                placeholder="Describe a responsibility or achievement..."
                value={resp}
                onChange={(e) => updateResponsibility(index, e.target.value)}
              />
              {formData.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="p-3 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <FormActions
        loading={loading}
        submitLabel={initialData ? "Update Record" : "Create Record"}
      />
    </form>
  );
}
