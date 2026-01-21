import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  uuid,
  json,
} from "drizzle-orm/pg-core";

// Enums
export const blogTypeEnum = pgEnum("blog_type", ["project", "blog"]);
export const contactIconEnum = pgEnum("contact_icon", [
  "mail",
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "website",
]);

// Blog table
export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  blogPost: text("blog_post").notNull(),
  date: text("date").notNull(),
  type: blogTypeEnum("type").notNull(),
  wordCount: integer("word_count"),
  readTime: integer("read_time"),
  links: json("links").$type<Array<{ text: string; url: string }>>(),
  slug: text("slug").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contact table
export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  icon: contactIconEnum("icon").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Work Experience table
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

// Certification table
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

// Site Config table (singleton)
export const siteConfig = pgTable("site_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileImageUrl: text("profile_image_url").default("/images/profile.webp"),
  aboutIntro: text("about_intro"),
  aboutExperience: text("about_experience"),
  aboutPersonal: text("about_personal"),
  aboutOutro: text("about_outro"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports for use in application
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
