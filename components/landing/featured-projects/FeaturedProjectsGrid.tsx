import Image from 'next/image';
import Link from 'next/link';
import { createUrlSlug } from '@/lib/utils/urlHelpers';
import { formatProjectDate } from '@/lib/utils/projectFormatting';
import type { Blog } from '@/lib/db';

interface FeaturedProjectsGridProps {
    projects: Blog[];
}

export const FeaturedProjectsGrid: React.FC<FeaturedProjectsGridProps> = ({ projects }) => {
    return (
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
            {projects.map(({ title, description, date, imageUrl, slug }, index) => (
                <article key={`${title}_${date}`} className="w-full">
                    <Link href={`/blogs/${slug || createUrlSlug(title)}`} className="block group h-full">
                        <div className="relative h-full rounded-xl border border-border bg-card overflow-hidden transition-transform duration-300 group-hover:-translate-y-2">
                            <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={title}
                                        fill
                                        loading="lazy"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                                )}
                            </div>

                            <div className="flex flex-col gap-3 p-4 md:p-5">
                                <span className="font-mono text-[10px] text-muted-foreground/80 uppercase tracking-widest">
                                    Featured {index + 1}
                                </span>
                                <h3 className="font-playfair italic tracking-tight text-foreground text-2xl md:text-3xl leading-[0.9] group-hover:text-accent transition-colors duration-300">
                                    {title}
                                </h3>
                                <p className="font-sans text-muted-foreground text-sm leading-relaxed line-clamp-2">
                                    {description}
                                </p>
                                <div className="pt-3 border-t border-border mt-auto">
                                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                                        {formatProjectDate(date, true)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );
};
