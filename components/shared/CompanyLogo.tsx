import Image from "next/image";
import { cn } from "@/lib/utils";
import { isSvgImageSrc, publicImageSrc } from "@/lib/utils/imageSrc";

interface CompanyLogoProps {
  src: string;
  alt: string;
  className?: string;
}

export function CompanyLogo({ src, alt, className }: CompanyLogoProps) {
  const resolved = publicImageSrc(src);

  if (isSvgImageSrc(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Blob serves SVGs with a CSP that blanks next/image optimizer output
      <img
        src={resolved}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", className)}
      />
    );
  }

  return <Image src={resolved} alt={alt} fill className={className} />;
}
