import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getNews } from "@/lib/news-store";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [news, user] = await Promise.all([getNews(), getCurrentUser()]);
  const deduped = news.filter((item, idx, arr) => arr.findIndex((v) => v.title === item.title) === idx);
  const canManage = canManageContent(user);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">뉴스/기사 아카이브</h1>
        {canManage && <Link href="/news/new" className="rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">새 뉴스 등록</Link>}
      </div>
      {deduped.map((n) => (
        <Card key={n.id}>
          {n.image_url && <img src={n.image_url} alt="뉴스 이미지" className="mb-2 h-40 w-full rounded object-cover" />}
          <Link href={`/news/${n.id}`} className="font-semibold hover:text-[#f7d899]">{n.title}</Link>
          <p className="text-sm text-slate-400">{n.source_name} · {n.published_date} · {n.category}</p>
          <p className="mt-2 text-sm text-[#e8dcc9]">{n.summary}</p>
          {canManage && (
            <div className="mt-3 flex gap-2">
              <Link href={`/news/${n.id}/edit`} className="rounded border px-2 py-1 text-xs">수정</Link>
              <form action={`/api/news/${n.id}`} method="post">
                <input type="hidden" name="_method" value="DELETE" />
                <button className="rounded border border-red-400/60 px-2 py-1 text-xs text-red-300">삭제</button>
              </form>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
