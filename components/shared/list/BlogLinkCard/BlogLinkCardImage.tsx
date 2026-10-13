import Image from "next/image";

export function BlogLinkCardImage({
  imageUrl,
  title,
  sizes,
}: {
  imageUrl?: string;
  title: string;
  sizes: string;
}) {
  return (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          loading="lazy"
          className="object-cover"
          sizes={sizes}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
      )}
    </>
  );
}
