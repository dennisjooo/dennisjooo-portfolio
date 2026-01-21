"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface WorkExperience {
  _id?: string;
  title: string;
  company: string;
  date: string;
  imageSrc: string;
  responsibilities: string[];
  order: number;
}

interface WorkExperienceFormProps {
  initialData?: WorkExperience;
  isEditing?: boolean;
}

export default function WorkExperienceForm({
  initialData,
  isEditing = false,
}: WorkExperienceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<WorkExperience>(
    initialData || {
      title: "",
      company: "",
      date: "",
      imageSrc: "",
      responsibilities: [""],
      order: 0,
    }
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const file = e.target.files[0];

    try {
      const response = await fetch(
        `/api/upload?filename=work/${file.name}`,
        {
          method: "POST",
          body: file,
        }
      );

      const newBlob = await response.json();
      if (newBlob.url) {
        setFormData({ ...formData, imageSrc: newBlob.url });
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Filter out empty responsibilities
    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter((r) => r.trim() !== ""),
    };

    try {
      const url = isEditing
        ? `/api/work-experience/${initialData?._id}`
        : "/api/work-experience";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      if (!res.ok) throw new Error("Failed to save");

      router.push("/admin/work-experience");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const addResponsibility = () => {
    setFormData({
      ...formData,
      responsibilities: [...formData.responsibilities, ""],
    });
  };

  const removeResponsibility = (index: number) => {
    setFormData({
      ...formData,
      responsibilities: formData.responsibilities.filter((_, i) => i !== index),
    });
  };

  const updateResponsibility = (index: number, value: string) => {
    const updated = [...formData.responsibilities];
    updated[index] = value;
    setFormData({ ...formData, responsibilities: updated });
  };

  const inputClasses =
    "w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all outline-none";
  const labelClasses = "block text-sm font-medium text-muted-foreground mb-1.5";

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-playfair italic text-3xl font-bold text-foreground">
            {isEditing ? "Edit" : "Add"}{" "}
            <span className="not-italic font-sans">Work Experience</span>
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
            {isEditing ? "Update existing record" : "Register new position"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass-panel p-8 rounded-2xl border border-border/50 space-y-6"
      >
        {/* Company Logo */}
        <div>
          <label className={labelClasses}>Company Logo</label>
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
                className={inputClasses}
                placeholder="Or enter image URL directly..."
                value={formData.imageSrc}
                onChange={(e) =>
                  setFormData({ ...formData, imageSrc: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground mt-2">
                Upload an image or paste a URL. Supports local paths like /images/work/company.svg
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Job Title</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="e.g. AI/ML Engineer"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClasses}>Company</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="e.g. Sinar Mas Land"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Date Range</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="e.g. February 2024 - Now"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClasses}>Display Order</label>
            <input
              type="number"
              className={inputClasses}
              placeholder="0"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower numbers appear first
            </p>
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className={labelClasses}>Responsibilities</label>
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
                  className={`${inputClasses} resize-none`}
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

        <div className="flex gap-4 pt-4 border-t border-border/50 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Saving..." : isEditing ? "Update Record" : "Create Record"}
          </button>
        </div>
      </form>
    </div>
  );
}
