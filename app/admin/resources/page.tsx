import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminImageInput from "@/components/admin-image-input";

export default async function AdminResourcesPage() {
  await requireAdmin("/admin/resources");
  const items = db.prepare("SELECT * FROM resources ORDER BY created_at DESC LIMIT 50").all() as Array<any>;

  return <div className="space-y-4"><Card><h1 className="text-xl font-bold">자료실 추가</h1><form action="/api/resources" method="post" className="space-y-2"><input name="title" placeholder="제목" required /><input name="url" placeholder="링크 URL" required /><input name="category" placeholder="카테고리" /><AdminImageInput scope="resources" name="thumbnail_url" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></Card>{items.map((r)=><Card key={r.id}><form action={`/api/resources/${r.id}`} method="post" className="space-y-2"><input type="hidden" name="_method" value="PATCH" /><input name="title" defaultValue={r.title} /><input name="url" defaultValue={r.url} /><input name="category" defaultValue={r.category} /><AdminImageInput scope="resources" name="thumbnail_url" defaultUrl={r.thumbnail_url} /><button className="rounded border px-3 py-1">수정</button></form></Card>)}</div>;
}
