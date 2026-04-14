import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getNews } from "@/lib/news-store";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">뉴스/기사 아카이브</h1>
      <input
        aria-label="뉴스 검색"
        placeholder="검색어 입력"
        className="w-full rounded-md border p-2"
      />
      {news.map((n) => (
        <Card key={n.id}>
          <Link href={`/news/${n.id}`} className="font-semibold hover:text-primary">
            {n.title}
          </Link>
          <p className="text-sm text-slate-600">
            {n.source_name} · {n.published_date} · {n.category}
          </p>
          <p className="mt-2 text-sm">{n.summary}</p>
        </Card>
      ))}
    </div>
  );
}
