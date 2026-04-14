import { db } from "@/lib/db";
import type { NewsArticle } from "@/types";

function sortByPublishedDateDesc(items: NewsArticle[]) {
  return [...items].sort((a, b) =>
    new Date(b.published_date).getTime() - new Date(a.published_date).getTime(),
  );
}

export async function getNews(): Promise<NewsArticle[]> {
  const rows = db.prepare("SELECT * FROM news_articles ORDER BY published_date DESC").all() as Array<Record<string, unknown>>;
  return sortByPublishedDateDesc(
    rows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      source_name: String(row.source_name),
      summary: String(row.summary),
      source_url: String(row.source_url),
      category: String(row.category),
      image_url: row.image_url ? String(row.image_url) : null,
      published_date: String(row.published_date),
      is_featured: Boolean(row.is_featured),
    })),
  );
}

export async function getNewsById(id: string): Promise<NewsArticle | undefined> {
  const row = db.prepare("SELECT * FROM news_articles WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!row) return undefined;
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
