import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
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
  const base = await readJsonFile<SiteContent>("site-content.json", { projectOverview, faqItems });
  const row = db.prepare("SELECT about_content, image_url FROM site_content WHERE id = 1").get() as { about_content: string | null; image_url: string | null } | undefined;
  if (!row?.about_content) return base;

  return {
    ...base,
    projectOverview: {
      ...base.projectOverview,
      business_summary: row.about_content,
      hero_image_url: row.image_url ?? null,
    },
  } as SiteContent;
}

export function getRouteMapImageUrl() {
  const row = db.prepare("SELECT route_map_image_url FROM site_content WHERE id = 1").get() as { route_map_image_url: string | null } | undefined;
  return row?.route_map_image_url ?? null;
}

export async function getTimelineItems() {
  const rows = db.prepare("SELECT id, title, description, timeline_date, status, source_name, source_url, sort_order, image_url FROM timeline_items ORDER BY sort_order ASC, timeline_date DESC").all() as Array<Record<string, unknown>>;
  if (!rows.length) {
    return readJsonFile<typeof timelineItems>("timeline.json", timelineItems);
  }
  return rows;
}

export async function getPoliticianItems() {
  const rows = db.prepare("SELECT * FROM politicians ORDER BY id DESC").all() as Array<Record<string, unknown>>;
  if (!rows.length) {
    return readJsonFile<typeof politicianItems>("politicians.json", politicianItems);
  }
  return rows.map((row) => ({
    id: Number(row.id || 0),
    name: String(row.name || ""),
    party: String(row.party || ""),
    district: String(row.district || ""),
    office_type: String(row.office_type || ""),
    summary: String(row.summary || ""),
    stance_or_relevance: String(row.stance_or_relevance || row.summary || ""),
    region_tags: String(row.region_tags || "").split(",").map((tag) => tag.trim()).filter(Boolean).length
      ? String(row.region_tags || "").split(",").map((tag) => tag.trim()).filter(Boolean)
      : [String(row.district || "기타")],
    election_2026_status: String(row.election_2026_status || "공개 확인 자료 없음"),
    source_name: String(row.source_name || "관리자 등록"),
    source_url: String(row.source_url || "#"),
    official_website: row.official_website ? String(row.official_website) : null,
    x_url: row.x_url ? String(row.x_url) : null,
    blog_url: row.blog_url ? String(row.blog_url) : null,
    office_phone: row.office_phone ? String(row.office_phone) : null,
    review_status: "approved",
    is_visible: Number(row.is_visible ?? 1) === 1,
    updated_at: new Date().toISOString().slice(0, 10),
    image_url: row.image_url ? String(row.image_url) : null,
  }));
}
