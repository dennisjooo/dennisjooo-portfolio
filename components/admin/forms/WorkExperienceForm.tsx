"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import type { WorkExperience } from "@/lib/db";
import { formStyles } from "@/components/admin/shared/formStyles";
import { FormActions } from "@/components/admin/shared/FormActions";
import { FormField } from "@/components/admin/shared/FormField";
import { AutoResizeTextarea } from "@/components/admin/shared/AutoResizeTextarea";
import { DragGripHandle } from "@/components/admin/shared/DragGripHandle";
import { useImageUpload } from "@/lib/hooks/domain/useImageUpload";
import {
  useAdminEntityForm,
  useAdminSubmitHandler,
} from "@/components/admin/hooks";
import { cn } from "@/lib/utils";

interface WorkExperienceFormProps {
  initialData?: WorkExperience;
  onSubmit: (data: Partial<WorkExperience>) => Promise<void>;
}

const defaultFormState = {
  title: "",
  company: "",
  date: "",
  imageSrc: "",
  responsibilities: [""],
  order: 0,
};

export default function WorkExperienceForm({
  initialData,
  onSubmit,
}: WorkExperienceFormProps) {
  const { formData, setFormData } = useAdminEntityForm(defaultFormState, {
    title: initialData?.title,
    company: initialData?.company,
    date: initialData?.date,
    imageSrc: initialData?.imageSrc,
    responsibilities: initialData?.responsibilities ?? [""],
    order: initialData?.order ?? 0,
  });
  const { submitting, handleFormSubmit } = useAdminSubmitHandler(onSubmit);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { uploading, upload } = useImageUpload({
    folder: "work",
    onSuccess: (url) => setFormData((prev) => ({ ...prev, imageSrc: url })),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    await upload(e.target.files[0]);
  };

  const getSubmitData = () => ({
    ...formData,
    responsibilities: formData.responsibilities.filter((r) => r.trim() !== ""),
  });

  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const updateResponsibility = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.responsibilities];
      updated[index] = value;
      return { ...prev, responsibilities: updated };
    });
  };

  const handleDragStart = (event: React.DragEvent, index: number) => {
    setDragIndex(index);
    const row = (event.target as HTMLElement).closest(
      "[data-responsibility-row]",
    );
    if (row && event.dataTransfer) {
      event.dataTransfer.setDragImage(row, 0, 0);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDragOver = (event: React.DragEvent, index: number) => {
    if (dragIndex === null) return;
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null) return;
    if (dragIndex !== index) {
      setFormData((prev) => {
        const next = [...prev.responsibilities];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(index, 0, moved);
        return { ...prev, responsibilities: next };
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <form
      onSubmit={handleFormSubmit(getSubmitData)}
      className={cn(formStyles.panel, "max-w-3xl space-y-6")}
    >
      <FormField label="Company Logo">
        <div className="flex items-start gap-6">
          <div className="group relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30">
              {formData.imageSrc ? (
                <Image
                  src={formData.imageSrc}
                  alt="Company logo"
                  fill
                  className="object-contain p-2"
                  unoptimized={formData.imageSrc.startsWith("http")}
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
                setFormData((prev) => ({ ...prev, imageSrc: e.target.value }))
              }
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Upload an image or paste a URL. Supports local paths like
              /images/work/company.svg
            </p>
          </div>
        </div>
      </FormField>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Job Title">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. AI/ML Engineer"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
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
              setFormData((prev) => ({ ...prev, company: e.target.value }))
            }
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField label="Date Range">
          <input
            type="text"
            required
            className={formStyles.input}
            placeholder="e.g. February 2024 - Now"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
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
              setFormData((prev) => ({
                ...prev,
                order: parseInt(e.target.value) || 0,
              }))
            }
          />
        </FormField>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className={formStyles.label}>Responsibilities</label>
          <button
            type="button"
            onClick={addResponsibility}
            className="inline-flex items-center gap-1 text-xs text-accent transition-colors hover:text-accent/80"
          >
            <PlusIcon className="h-4 w-4" />
            Add Item
          </button>
        </div>
        {formData.responsibilities.length > 1 && (
          <p className="mb-3 text-xs text-muted-foreground">
            Drag the grip to reorder items.
          </p>
        )}
        <div className="space-y-3">
          {formData.responsibilities.map((resp, index) => {
            const isDragging = dragIndex === index;
            const isDragOver =
              dragOverIndex === index &&
              dragIndex !== null &&
              dragIndex !== index;

            return (
              <div
                key={index}
                data-responsibility-row
                className={cn(
                  "flex items-stretch gap-2 rounded-lg transition-all duration-200",
                  isDragging && "bg-muted/50 opacity-50",
                  isDragOver && "ring-2 ring-primary",
                )}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                {formData.responsibilities.length > 1 && (
                  <DragGripHandle
                    onDragStart={(e) => handleDragStart(e, index)}
                  />
                )}
                <span className="w-6 shrink-0 self-center text-right font-mono text-sm text-muted-foreground">
                  {index + 1}.
                </span>
                <AutoResizeTextarea
                  className={cn(formStyles.input, "min-h-[4.5rem]")}
                  placeholder="Describe a responsibility or achievement..."
                  value={resp}
                  onValueChange={(value) => updateResponsibility(index, value)}
                />
                {formData.responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResponsibility(index)}
                    className="shrink-0 self-center p-2 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <FormActions
        loading={submitting}
        submitLabel={initialData ? "Update Record" : "Create Record"}
      />
    </form>
  );
}
