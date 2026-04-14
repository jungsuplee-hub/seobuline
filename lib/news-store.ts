import { promises as fs } from "node:fs";
import path from "node:path";
import type { NewsArticle } from "@/types";

const NEWS_PATH = path.join(process.cwd(), "data/news.json");

function sortByPublishedDateDesc(items: NewsArticle[]) {
  return [...items].sort((a, b) =>
    new Date(b.published_date).getTime() - new Date(a.published_date).getTime(),
  );
}

export async function getNews(): Promise<NewsArticle[]> {
  const raw = await fs.readFile(NEWS_PATH, "utf8");
  const parsed = JSON.parse(raw) as NewsArticle[];
  return sortByPublishedDateDesc(parsed);
}

export async function getNewsById(id: string): Promise<NewsArticle | undefined> {
  const items = await getNews();
  return items.find((item) => item.id === id);
}

export async function saveNews(news: NewsArticle[]): Promise<void> {
  const sorted = sortByPublishedDateDesc(news);
  await fs.writeFile(NEWS_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}
