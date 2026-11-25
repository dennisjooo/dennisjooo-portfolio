import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
  json,
} from "drizzle-orm/pg-core";
import { DEFAULT_PROFILE_IMAGE } from "@/lib/constants/site";

export const blogTypeEnum = pgEnum("blog_type", ["project", "blog"]);
export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "scheduled",
  "published",
]);
export const contactIconEnum = pgEnum("contact_icon", [
  "mail",
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "website",
]);

export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  blogPost: text("blog_post").notNull(),
  date: text("date").notNull(),
  type: blogTypeEnum("type").notNull(),
  links: json("links").$type<Array<{ text: string; url: string }>>(),
  slug: text("slug").unique(),
  status: blogStatusEnum("status").default("draft").notNull(),
  publishAt: timestamp("publish_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: contactIconEnum("icon").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workExperiences = pgTable("work_experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  date: text("date").notNull(),
  imageSrc: text("image_src").notNull(),
  responsibilities: json("responsibilities").$type<string[]>().default([]),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const certifications = pgTable("certifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  issuer: text("issuer").notNull(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteConfig = pgTable("site_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileImageUrl: text("profile_image_url").default(DEFAULT_PROFILE_IMAGE),
  aboutSections: json("about_sections")
    .$type<Array<{ id: string; title: string; body: string }>>()
    .default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export type WorkExperience = typeof workExperiences.$inferSelect;
export type NewWorkExperience = typeof workExperiences.$inferInsert;

export type Certification = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;

export type SiteConfig = typeof siteConfig.$inferSelect;
export type NewSiteConfig = typeof siteConfig.$inferInsert;
