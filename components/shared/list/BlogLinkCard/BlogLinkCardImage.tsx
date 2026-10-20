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
        <div className="bg-noise relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-secondary to-muted">
          <span
            aria-hidden
            className="select-none font-caslon text-[10rem] italic leading-none text-foreground/10 transition-transform duration-500 group-hover:scale-110"
          >
            {title.charAt(0)}
          </span>
        </div>
      )}
    </>
  );
}
