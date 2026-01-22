/**
 * Migration script to transfer data from MongoDB to Neon (PostgreSQL)
 * 
 * Usage:
 *   npx tsx scripts/migrate-mongo-to-neon.ts
 * 
 * Required environment variables:
 *   - MONGODB_URI: Your MongoDB connection string
 *   - DATABASE_URL: Your Neon PostgreSQL connection string
 */

import { MongoClient, Db } from "mongodb";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import {
  blogs,
  contacts,
  workExperiences,
  certifications,
  siteConfig,
} from "../lib/db/schema";

// Load environment variables
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_URL = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not set");
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set");
  process.exit(1);
}

// Initialize Neon connection
const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function migrateBlogs(mongoDb: Db) {
  console.log("\n--- Migrating Blogs ---");
  const mongoBlogs = await mongoDb.collection("blogs").find({}).toArray();
  console.log(`Found ${mongoBlogs.length} blogs in MongoDB`);

  if (mongoBlogs.length === 0) {
    console.log("No blogs to migrate");
    return;
  }

  for (const blog of mongoBlogs) {
    try {
      await db.insert(blogs).values({
        title: blog.title,
        description: blog.description,
        imageUrl: blog.imageUrl || null,
        blogPost: blog.blogPost,
        date: blog.date,
        type: blog.type,
        wordCount: blog.wordCount || null,
        readTime: blog.readTime || null,
        links: blog.links || null,
        slug: blog.slug || null,
        createdAt: blog.createdAt ? new Date(blog.createdAt) : new Date(),
        updatedAt: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
      });
      console.log(`  Migrated blog: ${blog.title}`);
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message?.includes("duplicate key")) {
        console.log(`  Skipped (already exists): ${blog.title}`);
      } else {
        console.error(`  Failed to migrate blog "${blog.title}":`, err.message);
      }
    }
  }
}

async function migrateContacts(mongoDb: Db) {
  console.log("\n--- Migrating Contacts ---");
  const mongoContacts = await mongoDb.collection("contacts").find({}).toArray();
  console.log(`Found ${mongoContacts.length} contacts in MongoDB`);

  if (mongoContacts.length === 0) {
    console.log("No contacts to migrate");
    return;
  }

  for (const contact of mongoContacts) {
    try {
      await db.insert(contacts).values({
        label: contact.label,
        href: contact.href,
        icon: contact.icon,
        order: contact.order ?? 0,
        createdAt: contact.createdAt ? new Date(contact.createdAt) : new Date(),
        updatedAt: contact.updatedAt ? new Date(contact.updatedAt) : new Date(),
      });
      console.log(`  Migrated contact: ${contact.label}`);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`  Failed to migrate contact "${contact.label}":`, err.message);
    }
  }
}

async function migrateWorkExperiences(mongoDb: Db) {
  console.log("\n--- Migrating Work Experiences ---");
  const mongoExperiences = await mongoDb
    .collection("workexperiences")
    .find({})
    .toArray();
  console.log(`Found ${mongoExperiences.length} work experiences in MongoDB`);

  if (mongoExperiences.length === 0) {
    console.log("No work experiences to migrate");
    return;
  }

  for (const exp of mongoExperiences) {
    try {
      await db.insert(workExperiences).values({
        title: exp.title,
        company: exp.company,
        date: exp.date,
        imageSrc: exp.imageSrc,
        responsibilities: exp.responsibilities || [],
        order: exp.order ?? 0,
        createdAt: exp.createdAt ? new Date(exp.createdAt) : new Date(),
        updatedAt: exp.updatedAt ? new Date(exp.updatedAt) : new Date(),
      });
      console.log(`  Migrated work experience: ${exp.title} at ${exp.company}`);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(
        `  Failed to migrate work experience "${exp.title}":`,
        err.message
      );
    }
  }
}

async function migrateCertifications(mongoDb: Db) {
  console.log("\n--- Migrating Certifications ---");
  const mongoCerts = await mongoDb
    .collection("certifications")
    .find({})
    .toArray();
  console.log(`Found ${mongoCerts.length} certifications in MongoDB`);

  if (mongoCerts.length === 0) {
    console.log("No certifications to migrate");
    return;
  }

  for (const cert of mongoCerts) {
    try {
      await db.insert(certifications).values({
        title: cert.title,
        issuer: cert.issuer,
        date: cert.date,
        description: cert.description,
        link: cert.link,
        createdAt: cert.createdAt ? new Date(cert.createdAt) : new Date(),
        updatedAt: cert.updatedAt ? new Date(cert.updatedAt) : new Date(),
      });
      console.log(`  Migrated certification: ${cert.title}`);
    } catch (error: unknown) {
      const err = error as Error;
      console.error(
        `  Failed to migrate certification "${cert.title}":`,
        err.message
      );
    }
  }
}

async function migrateSiteConfig(mongoDb: Db) {
  console.log("\n--- Migrating Site Config ---");
  const mongoConfig = await mongoDb
    .collection("siteconfigs")
    .findOne({});

  if (!mongoConfig) {
    console.log("No site config found in MongoDB");
    return;
  }

  try {
    await db.insert(siteConfig).values({
      profileImageUrl: mongoConfig.profileImageUrl || "/images/profile.webp",
      aboutIntro: mongoConfig.aboutIntro || null,
      aboutExperience: mongoConfig.aboutExperience || null,
      aboutPersonal: mongoConfig.aboutPersonal || null,
      aboutOutro: mongoConfig.aboutOutro || null,
      createdAt: mongoConfig.createdAt
        ? new Date(mongoConfig.createdAt)
        : new Date(),
      updatedAt: mongoConfig.updatedAt
        ? new Date(mongoConfig.updatedAt)
        : new Date(),
    });
      console.log("  Migrated site config successfully");
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message?.includes("duplicate key")) {
        console.log("  Site config already exists, skipping");
      } else {
        console.error("  Failed to migrate site config:", err.message);
      }
    }
}

async function main() {
  console.log("===========================================");
  console.log("MongoDB to Neon PostgreSQL Migration Script");
  console.log("===========================================\n");

  // Connect to MongoDB
  console.log("Connecting to MongoDB...");
  const mongoClient = new MongoClient(MONGODB_URI!);

  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB successfully!\n");

    const mongoDb = mongoClient.db();

    // Run migrations
    await migrateBlogs(mongoDb);
    await migrateContacts(mongoDb);
    await migrateWorkExperiences(mongoDb);
    await migrateCertifications(mongoDb);
    await migrateSiteConfig(mongoDb);

    console.log("\n===========================================");
    console.log("Migration completed!");
    console.log("===========================================");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoClient.close();
    console.log("\nMongoDB connection closed.");
  }
}

main();
