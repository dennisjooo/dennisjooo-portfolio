import { db, gallery, galleryDate } from "./lib/db";
import { desc } from "drizzle-orm";

async function main() {
  const images = await db.select().from(gallery).orderBy(desc(galleryDate));
  console.log("By galleryDate desc:");
  images.forEach((i) => console.log(i.title, i.createdAt));
}
main();
