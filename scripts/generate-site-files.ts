/**
 * Regenerates public/llms.txt from live database content.
 * Sitemap URLs come from app/sitemap.ts at request time.
 *
 * Usage:
 *   npx tsx scripts/generate-site-files.ts
 *   npx tsx scripts/generate-site-files.ts --dry-run
 *
 * Required environment variables:
 *   - DATABASE_URL: Neon PostgreSQL connection string (.env.local)
 */

import { writeFileSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import * as schema from "../lib/db/schema";
import packageJson from "../package.json";
import { SITE_DESCRIPTION } from "../lib/constants/site";
import { fetchSiteData } from "../lib/site-manifest/fetchSiteData";
import { buildLlmsTxt } from "../lib/site-manifest/generate";

dotenv.config({ path: ".env.local" });

const DATABASE_URL = process.env.DATABASE_URL;
const dryRun = process.argv.includes("--dry-run");

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set");
  process.exit(1);
}

const LLMS_PATH = "public/llms.txt";

async function main() {
  const sql = neon(DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("Fetching site data...");
  const data = await fetchSiteData(db);

  const llmsTxt = buildLlmsTxt(data, SITE_DESCRIPTION);

  if (dryRun) {
    console.log("\n--- Dry run: no files written ---");
    console.log(`Would write ${LLMS_PATH} (${llmsTxt.length} chars)`);
    return;
  }

  writeFileSync(LLMS_PATH, llmsTxt, "utf8");

  console.log(`Wrote ${LLMS_PATH}`);
  console.log(`  Build version: ${packageJson.version}`);
  console.log(`  Projects: ${data.projects.length}`);
  console.log(`  Blog posts: ${data.blogPosts.length}`);
  console.log(`  Work entries: ${data.workExperiences.length}`);
  console.log(`  Certifications: ${data.certifications.length}`);
}

main().catch((error) => {
  console.error("Failed to generate site files:", error);
  process.exit(1);
});
