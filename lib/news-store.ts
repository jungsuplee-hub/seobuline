import { promises as fs } from "node:fs";
import path from "node:path";
import { db } from "@/lib/db";
import type { NewsArticle } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

function sortByPublishedDateDesc(items: NewsArticle[]) {
  return [...items].sort((a, b) =>
    new Date(b.published_date).getTime() - new Date(a.published_date).getTime(),
  );
}

async function readFallbackNews(): Promise<NewsArticle[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, "news.json"), "utf8");
    const parsed = JSON.parse(raw) as NewsArticle[];
    return sortByPublishedDateDesc(parsed);
  } catch {
    return [];
  }
}

function mapRowToNewsArticle(row: Record<string, unknown>): NewsArticle {
  return {
    id: String(row.id),
    title: String(row.title),
    source_name: String(row.source_name),
    summary: String(row.summary),
    source_url: String(row.source_url),
    category: String(row.category),
    image_url: row.image_url ? String(row.image_url) : null,
    published_date: String(row.published_date),
    is_featured: Boolean(row.is_featured),
  };
}

function readNewsRows() {
  return db.prepare("SELECT * FROM news_articles ORDER BY published_date DESC").all() as Array<Record<string, unknown>>;
}

function seedNewsFromFallback(items: NewsArticle[]) {
  if (!items.length) return;

  const insert = db.prepare(
    "INSERT OR REPLACE INTO news_articles (id, title, source_name, summary, source_url, category, image_url, published_date, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );

  const tx = db.transaction((newsItems: NewsArticle[]) => {
    for (const item of newsItems) {
      insert.run(
        item.id,
        item.title,
        item.source_name,
        item.summary,
        item.source_url,
        item.category,
        item.image_url ?? null,
        item.published_date,
        item.is_featured ? 1 : 0,
      );
    }
  });

  tx(sortByPublishedDateDesc(items));
}

export async function getNews(): Promise<NewsArticle[]> {
  const rows = readNewsRows();
  if (!rows.length) {
    const fallback = await readFallbackNews();
    seedNewsFromFallback(fallback);
    return fallback;
  }

  return sortByPublishedDateDesc(rows.map(mapRowToNewsArticle));
}

export async function getNewsById(id: string): Promise<NewsArticle | undefined> {
  const row = db.prepare("SELECT * FROM news_articles WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!row) return undefined;
  return mapRowToNewsArticle(row);
}

export async function saveNews(news: NewsArticle[]): Promise<void> {
  const stmtDelete = db.prepare("DELETE FROM news_articles");
  const stmtInsert = db.prepare(
    "INSERT INTO news_articles (id, title, source_name, summary, source_url, category, image_url, published_date, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );
  const tx = db.transaction((items: NewsArticle[]) => {
    stmtDelete.run();
    for (const item of sortByPublishedDateDesc(items)) {
      stmtInsert.run(item.id, item.title, item.source_name, item.summary, item.source_url, item.category, item.image_url ?? null, item.published_date, item.is_featured ? 1 : 0);
    }
  });
  tx(news);
}
