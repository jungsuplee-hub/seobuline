import { createHash } from "node:crypto";
import { getNews, saveNews } from "@/lib/news-store";
import type { NewsArticle } from "@/types";

const RSS_URL =
  process.env.NEWS_RSS_URL ??
  "https://news.google.com/rss/search?q=%EC%84%9C%EB%B6%80%EC%84%A0+%EC%A7%80%ED%95%98%EC%B2%A0&hl=ko&gl=KR&ceid=KR:ko";

const MAX_NEWS_ITEMS = Number(process.env.NEWS_MAX_ITEMS ?? 50);

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

function makeId(sourceUrl: string): string {
  return `rss-${createHash("sha1").update(sourceUrl).digest("hex").slice(0, 12)}`;
}

function toArticle(item: RssItem): NewsArticle {
  const publishedDate = Number.isNaN(Date.parse(item.pubDate))
    ? new Date().toISOString().slice(0, 10)
    : new Date(item.pubDate).toISOString().slice(0, 10);

  return {
    id: makeId(item.link),
    title: item.title,
    source_name: item.source,
    summary: `${item.source}에 게시된 서부선 관련 기사입니다. 원문 링크에서 전문을 확인하세요.`,
    source_url: item.link,
    category: "자동수집",
    published_date: publishedDate,
    is_featured: false,
  };
}

async function run() {
  const response = await fetch(RSS_URL, {
    headers: {
      "User-Agent": "seobuline-news-bot/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`RSS 요청 실패: ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();
  const fetched = parseRss(xml).map(toArticle);
  const current = await getNews();

  const mergedMap = new Map<string, NewsArticle>();
  for (const article of [...fetched, ...current]) {
    if (!mergedMap.has(article.id)) {
      mergedMap.set(article.id, article);
    }
  }

  const merged = [...mergedMap.values()]
    .sort(
      (a, b) =>
        new Date(b.published_date).getTime() - new Date(a.published_date).getTime(),
    )
    .slice(0, MAX_NEWS_ITEMS);

  await saveNews(merged);

  console.log(
    `[sync-news] fetched=${fetched.length}, before=${current.length}, after=${merged.length}`,
  );
}

run().catch((error) => {
  console.error("[sync-news] failed", error);
  process.exitCode = 1;
});
