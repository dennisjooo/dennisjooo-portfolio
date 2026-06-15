import { eq, or, and, lte, type SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { blogs } from "./schema";

export function visibleBlogsFilter(): SQL {
  return or(
    eq(blogs.status, "published"),
    and(eq(blogs.status, "scheduled"), lte(blogs.publishAt, sql`now()`)),
  )!;
}
