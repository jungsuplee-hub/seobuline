import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminImageInput from "@/components/admin-image-input";

export default async function AdminNoticesPage() {
  await requireAdmin("/admin/notices");
  const items = db.prepare("SELECT * FROM notices ORDER BY created_at DESC LIMIT 30").all() as Array<any>;

  return <div className="space-y-4"><Card><h1 className="text-xl font-bold">공지 추가</h1><form action="/api/notices" method="post" className="space-y-2"><input name="title" placeholder="제목" required /><textarea name="content" placeholder="내용" className="min-h-24 w-full" required /><AdminImageInput scope="notices" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></Card>{items.map((n)=><Card key={n.id}><form action={`/api/notices/${n.id}`} method="post" className="space-y-2"><input type="hidden" name="_method" value="PATCH" /><input name="title" defaultValue={n.title} /><textarea name="content" defaultValue={n.content} className="min-h-24 w-full" /><AdminImageInput scope="notices" defaultUrl={n.image_url} /><div className="flex gap-2"><button className="rounded border px-3 py-1">수정</button></div></form></Card>)}</div>;
}
