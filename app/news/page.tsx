import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getNews } from "@/lib/news-store";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const news = await getNews();
  const deduped = news.filter((item, idx, arr) => arr.findIndex((v) => v.title === item.title) === idx);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">뉴스/기사 아카이브</h1>
      <p className="text-sm text-[#dfcfb5]">중복 항목을 정리하고, 제목/카드 전체에서 기사와 상세 페이지로 이동할 수 있게 개선했습니다.</p>
      <input
        aria-label="뉴스 검색"
        placeholder="검색어 입력"
        className="w-full rounded-md border border-[#d0a453]/30 bg-[#121721] p-2"
      />
      {deduped.map((n) => (
        <Link key={n.id} href={`/news/${n.id}`} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0a453]/70">
          <Card className="transition hover:border-[#d0a453]/55 hover:bg-[#182233]">
            {n.image_url && <img src={n.image_url} alt="뉴스 이미지" className="mb-2 h-40 w-full rounded object-cover" />}
            <p className="font-semibold group-hover:text-[#f7d899] group-focus-visible:text-[#f7d899]">{n.title}</p>
            <p className="text-sm text-slate-400">
              {n.source_name} · {n.published_date} · {n.category}
            </p>
            <p className="mt-2 text-sm text-[#e8dcc9]">{n.summary}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
