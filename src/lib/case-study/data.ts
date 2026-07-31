/**
 * Case Study Data Access
 *
 * Reads JSON case studies from the filesystem.
 *
 * @module lib/case-study/data
 */

import fs from "fs";
import path from "path";
import type { CaseStudy } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "src/content/case-studies");

/**
 * Ensure the content directory exists
 */
function ensureDir() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

/**
 * Get all available case study slugs
 */
export function getCaseStudySlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
}

/**
 * Retrieve and parse a single case study by slug
 */
export function getCaseStudy(slug: string): CaseStudy {
  ensureDir();
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Case study not found: ${slug}`);
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContent) as CaseStudy;
}

/**
 * Retrieve all case studies, sorted by publish date (newest first)
 */
export function getAllCaseStudies(): CaseStudy[] {
  const slugs = getCaseStudySlugs();
  const caseStudies = slugs.map((slug) => getCaseStudy(slug));

  // Sort by date descending
  return caseStudies.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

/**
 * Retrieve only featured case studies
 */
export function getFeaturedCaseStudies(): CaseStudy[] {
  return getAllCaseStudies().filter((cs) => cs.featured);
}
