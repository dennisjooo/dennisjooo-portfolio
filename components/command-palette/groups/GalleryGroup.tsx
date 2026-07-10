"use client";

import { ImageIcon } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  highlightSearchTerm,
  type ProcessedGalleryImage,
  type SearchOptions,
} from "@/lib/command-palette/utils";

interface FilteredGalleryImage extends ProcessedGalleryImage {
  context: string | null;
}

interface GalleryGroupProps {
  images: FilteredGalleryImage[];
  searchTerm: string;
  searchOptions: SearchOptions;
  onSelect: (command: () => unknown) => void;
  onNavigate: (path: string) => void;
}

export function GalleryGroup({
  images,
  searchTerm,
  searchOptions,
  onSelect,
  onNavigate,
}: GalleryGroupProps) {
  if (images.length === 0) return null;

  return (
    <>
      <CommandGroup heading="Gallery" forceMount>
        {images.map((image) => (
          <CommandItem
            key={image.id}
            value={image.title}
            forceMount
            onSelect={() => onSelect(() => onNavigate(image.path))}
          >
            <ImageIcon className="h-4 w-4 shrink-0" />
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <span className="truncate font-medium">{image.title}</span>
              {image.context && (
                <span
                  className="mt-0.5 block max-w-full truncate text-xs text-muted-foreground/70"
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerm(
                      image.context,
                      searchTerm,
                      searchOptions,
                    ),
                  }}
                />
              )}
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}
