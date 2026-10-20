import { CompactCard } from "@/components/shared/list/ContentCard";
import { FeaturedCard } from "./FeaturedCard";

export interface PostCardData {
  title: string;
  description: string;
  slug: string;
  date: string;
  imageUrl?: string;
  type?: "project" | "blog";
  readTime?: string;
}

export function PostsBento({
  posts,
  priority = true,
}: {
  posts: PostCardData[];
  priority?: boolean;
}) {
  const [lead, ...rest] = posts;
  if (!lead) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      <div
        className={`lg:flex ${rest.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}`}
      >
        <FeaturedCard {...lead} displayIndex={1} priority={priority} />
      </div>
      {rest.length > 0 && (
        <div className="flex flex-col divide-y divide-border lg:col-span-5">
          {rest.map((post, index) => (
            <div
              key={`${post.title}_${post.date}`}
              className="py-10 first:pt-0 last:pb-0 lg:flex lg:flex-1 lg:items-center"
            >
              <CompactCard {...post} index={index} displayIndex={index + 2} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
