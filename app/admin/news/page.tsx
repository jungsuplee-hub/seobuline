import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminImageInput from "@/components/admin-image-input";

export default async function AdminNewsPage() {
  await requireAdmin("/admin/news");
  const items = db.prepare("SELECT * FROM news_articles ORDER BY published_date DESC LIMIT 30").all() as Array<any>;

  return <div className="space-y-4"><Card><h1 className="text-xl font-bold">뉴스 추가</h1><form action="/api/news" method="post" className="space-y-2"><input name="title" placeholder="제목" required /><input name="source_name" placeholder="출처" required /><input name="source_url" placeholder="원문 URL" required /><input name="category" placeholder="카테고리" defaultValue="일반" /><input type="date" name="published_date" defaultValue={new Date().toISOString().slice(0,10)} /><textarea name="summary" placeholder="요약" className="min-h-24 w-full" required /><AdminImageInput scope="news" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></Card>{items.map((n)=><Card key={n.id}><form action={`/api/news/${n.id}`} method="post" className="space-y-2"><input type="hidden" name="_method" value="PATCH" /><input name="title" defaultValue={n.title} /><input name="source_name" defaultValue={n.source_name} /><input name="source_url" defaultValue={n.source_url} /><input name="category" defaultValue={n.category} /><input type="date" name="published_date" defaultValue={n.published_date} /><textarea name="summary" defaultValue={n.summary} className="min-h-24 w-full" /><AdminImageInput scope="news" defaultUrl={n.image_url} /><button className="rounded border px-3 py-1">수정</button></form></Card>)}</div>;
}
