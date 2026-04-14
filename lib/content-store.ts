import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import { faqItems, politicianItems, projectOverview, timelineItems } from "@/lib/public-data";

const DATA_DIR = path.join(process.cwd(), "data");

export interface SiteContent {
  projectOverview: typeof projectOverview;
  faqItems: typeof faqItems;
}

type IntroduceSectionOverrides = Partial<{
  business_summary: string;
  route_overview: string;
  resident_perspective_summary: string;
  추진_background: string[];
  major_stations_or_sections: string[];
  expected_effects: string[];
}>;

export interface TimelineItem {
  id?: number;
  title: string;
  description: string;
  timeline_date: string;
  status: string;
  source_name?: string | null;
  source_url?: string | null;
  sort_order: number;
  image_url?: string | null;
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
  const row = db.prepare("SELECT about_content, image_url, introduce_sections_json FROM site_content WHERE id = 1").get() as
    | { about_content: string | null; image_url: string | null; introduce_sections_json: string | null }
    | undefined;
  if (!row) return base;

  let sectionOverrides: IntroduceSectionOverrides = {};
  if (row.introduce_sections_json?.trim()) {
    try {
      const parsed = JSON.parse(row.introduce_sections_json) as IntroduceSectionOverrides;
      sectionOverrides = parsed;
    } catch {
      sectionOverrides = {};
    }
  }

  const mergedAboutContent = sectionOverrides.business_summary?.trim() || (row.about_content?.trim() ? row.about_content : base.projectOverview.business_summary);
  const mergedHeroImageUrl = row.image_url?.trim() ? row.image_url : ((base.projectOverview as { hero_image_url?: string | null }).hero_image_url ?? null);

  return {
    ...base,
    projectOverview: {
      ...base.projectOverview,
      business_summary: mergedAboutContent,
      route_overview: sectionOverrides.route_overview?.trim() || base.projectOverview.route_overview,
      resident_perspective_summary: sectionOverrides.resident_perspective_summary?.trim() || base.projectOverview.resident_perspective_summary,
      추진_background: Array.isArray(sectionOverrides["추진_background"]) && sectionOverrides["추진_background"].length
        ? sectionOverrides["추진_background"]
        : base.projectOverview["추진_background"],
      major_stations_or_sections: Array.isArray(sectionOverrides.major_stations_or_sections) && sectionOverrides.major_stations_or_sections.length
        ? sectionOverrides.major_stations_or_sections
        : base.projectOverview.major_stations_or_sections,
      expected_effects: Array.isArray(sectionOverrides.expected_effects) && sectionOverrides.expected_effects.length
        ? sectionOverrides.expected_effects
        : base.projectOverview.expected_effects,
      hero_image_url: mergedHeroImageUrl,
    },
  } as SiteContent;
}

export function getRouteMapImageUrl() {
  const row = db.prepare("SELECT route_map_image_url FROM site_content WHERE id = 1").get() as { route_map_image_url: string | null } | undefined;
  return row?.route_map_image_url ?? null;
}

export async function getTimelineItems(): Promise<TimelineItem[]> {
  const rows = db.prepare("SELECT id, title, description, timeline_date, status, source_name, source_url, sort_order, image_url FROM timeline_items ORDER BY sort_order ASC, timeline_date DESC").all() as Array<Record<string, unknown>>;
  if (!rows.length) {
    const fallback = await readJsonFile<typeof timelineItems>("timeline.json", timelineItems);
    if (fallback.length) {
      const insert = db.prepare("INSERT INTO timeline_items (title, description, timeline_date, status, source_name, source_url, sort_order, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      const syncFallback = db.transaction((items: typeof fallback) => {
        for (const item of items) {
          insert.run(
            String(item.title || "").trim(),
            String(item.description || "").trim(),
            String(item.timeline_date || "").trim(),
            String(item.status || "진행").trim(),
            String(item.source_name || "관리자 등록").trim() || null,
            String(item.source_url || "").trim() || null,
            Number(item.sort_order || 0),
            "image_url" in item && item.image_url ? String(item.image_url).trim() : null,
          );
        }
      });
      syncFallback(fallback);
      const seededRows = db.prepare("SELECT id, title, description, timeline_date, status, source_name, source_url, sort_order, image_url FROM timeline_items ORDER BY sort_order ASC, timeline_date DESC").all() as Array<Record<string, unknown>>;
      return seededRows.map((row) => ({
        id: Number(row.id || 0),
        title: String(row.title || ""),
        description: String(row.description || ""),
        timeline_date: String(row.timeline_date || ""),
        status: String(row.status || ""),
        source_name: row.source_name ? String(row.source_name) : null,
        source_url: row.source_url ? String(row.source_url) : null,
        sort_order: Number(row.sort_order || 0),
        image_url: row.image_url ? String(row.image_url) : null,
      }));
    }
    return fallback.map((item) => ({ ...item, id: undefined, image_url: null }));
  }
  return rows.map((row) => ({
    id: Number(row.id || 0),
    title: String(row.title || ""),
    description: String(row.description || ""),
    timeline_date: String(row.timeline_date || ""),
    status: String(row.status || ""),
    source_name: row.source_name ? String(row.source_name) : null,
    source_url: row.source_url ? String(row.source_url) : null,
    sort_order: Number(row.sort_order || 0),
    image_url: row.image_url ? String(row.image_url) : null,
  }));
}

export async function getPoliticianItems() {
  let rows = db.prepare("SELECT * FROM politicians ORDER BY id DESC").all() as Array<Record<string, unknown>>;
  if (!rows.length) {
    const fallback = await readJsonFile<typeof politicianItems>("politicians.json", politicianItems);
    if (fallback.length) {
      const insert = db.prepare(`INSERT INTO politicians (
        name, party, district, office_type, region_tags, summary, stance_or_relevance, election_2026_status,
        source_name, source_url, official_website, x_url, blog_url, office_phone, image_url, is_visible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      const syncFallback = db.transaction((items: typeof fallback) => {
        for (const item of items) {
          const imageUrl = "image_url" in item && item.image_url ? String(item.image_url).trim() : null;
          insert.run(
            String(item.name || "").trim(),
            String(item.party || "").trim(),
            String(item.district || "").trim(),
            String(item.office_type || "").trim(),
            ((item.region_tags || []).map((tag) => String(tag).trim()).filter(Boolean)).join(","),
            String(item.summary || "").trim(),
            String(item.stance_or_relevance || item.summary || "").trim(),
            String(item.election_2026_status || "공개 확인 자료 없음").trim(),
            String(item.source_name || "관리자 등록").trim() || null,
            String(item.source_url || "").trim() || null,
            item.official_website ? String(item.official_website).trim() : null,
            item.x_url ? String(item.x_url).trim() : null,
            item.blog_url ? String(item.blog_url).trim() : null,
            item.office_phone ? String(item.office_phone).trim() : null,
            imageUrl,
            item.is_visible === false ? 0 : 1,
          );
        }
      });
      syncFallback(fallback);
      rows = db.prepare("SELECT * FROM politicians ORDER BY id DESC").all() as Array<Record<string, unknown>>;
    }
  }
  if (!rows.length) {
    return [];
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
