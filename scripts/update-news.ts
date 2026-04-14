import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getNews, saveNews } from "@/lib/news-store";
import type { NewsArticle } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const SOURCES_PATH = path.join(DATA_DIR, "news-sources.json");
const MANUAL_PATH = path.join(DATA_DIR, "news-manual.json");
const MAX_NEWS_ITEMS = Number(process.env.NEWS_MAX_ITEMS ?? 50);

interface RssConfig {
  name: string;
  url: string;
  category?: string;
}

interface NewsSources {
  rss?: RssConfig[];
}

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function getTag(block: string, tag: string): string {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return decodeXml(match?.[1] ?? "");
}

function parseRss(xml: string): RssItem[] {
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];

  return itemBlocks
    .map((block) => ({
      title: getTag(block, "title"),
      link: getTag(block, "link"),
      pubDate: getTag(block, "pubDate"),
      source: getTag(block, "source") || "뉴스 RSS",
    }))
    .filter((item) => item.title && item.link);
}

function makeId(sourceUrl: string) {
  return `rss-${createHash("sha1").update(sourceUrl).digest("hex").slice(0, 12)}`;
}

function toArticle(item: RssItem, category = "RSS"): NewsArticle {
  const publishedDate = Number.isNaN(Date.parse(item.pubDate))
    ? new Date().toISOString().slice(0, 10)
    : new Date(item.pubDate).toISOString().slice(0, 10);

  return {
    id: makeId(item.link),
    title: item.title,
    source_name: item.source,
    summary: `${item.source}에 게시된 서부선 관련 기사입니다. 원문 링크에서 전문을 확인하세요.`,
    source_url: item.link,
    category,
    published_date: publishedDate,
    is_featured: false,
  };
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function fetchRss(config: RssConfig): Promise<NewsArticle[]> {
  const response = await fetch(config.url, {
    headers: { "User-Agent": "seobuline-content-updater/1.0" },
  });

  if (!response.ok) {
    throw new Error(`RSS 요청 실패 (${config.name}): ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  return parseRss(xml).map((item) => toArticle(item, config.category ?? "RSS"));
}

async function run() {
  const sources = await readJson<NewsSources>(SOURCES_PATH, { rss: [] });
  const manualItems = await readJson<NewsArticle[]>(MANUAL_PATH, []);
  const current = await getNews();

  const rssResults = await Promise.all((sources.rss ?? []).map(async (source) => {
    try {
      return await fetchRss(source);
    } catch (error) {
      console.warn(`[update-news] rss source skipped: ${source.name}`, error);
      return [];
    }
  }));
  const rssItems = rssResults.flat();
  const mergedMap = new Map<string, NewsArticle>();

  for (const article of [...manualItems, ...rssItems, ...current]) {
    const dedupeKey = article.source_url.trim();
    if (!mergedMap.has(dedupeKey)) {
      mergedMap.set(dedupeKey, { ...article, id: article.id || makeId(article.source_url) });
    }
  }

  const merged = [...mergedMap.values()]
    .sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime())
    .slice(0, MAX_NEWS_ITEMS);

  await saveNews(merged);
  console.log(`[update-news] rss=${rssItems.length}, manual=${manualItems.length}, total=${merged.length}`);
}

run().catch((error) => {
  console.error("[update-news] failed", error);
  process.exitCode = 1;
});
