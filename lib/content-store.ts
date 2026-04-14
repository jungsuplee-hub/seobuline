import { promises as fs } from "node:fs";
import path from "node:path";
import { faqItems, politicianItems, projectOverview, timelineItems } from "@/lib/public-data";

const DATA_DIR = path.join(process.cwd(), "data");

export interface SiteContent {
  projectOverview: typeof projectOverview;
  faqItems: typeof faqItems;
}

async function readJsonFile<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, fileName), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  return readJsonFile<SiteContent>("site-content.json", { projectOverview, faqItems });
}

export async function getTimelineItems() {
  return readJsonFile<typeof timelineItems>("timeline.json", timelineItems);
}

export async function getPoliticianItems() {
  return readJsonFile<typeof politicianItems>("politicians.json", politicianItems);
}
