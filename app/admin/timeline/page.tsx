import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminImageInput from "@/components/admin-image-input";

export default async function AdminTimelinePage() {
  await requireAdmin("/admin/timeline");
  const items = db.prepare("SELECT * FROM timeline_items ORDER BY sort_order ASC, timeline_date DESC").all() as Array<any>;

  return <div className="space-y-4"><Card><h1 className="text-xl font-bold">진행현황 추가</h1><form action="/api/events" method="post" className="space-y-2"><input name="title" placeholder="제목" required /><input name="status" placeholder="상태" defaultValue="진행" /><input type="date" name="timeline_date" defaultValue={new Date().toISOString().slice(0,10)} /><input type="number" name="sort_order" defaultValue={0} /><textarea name="description" placeholder="설명" className="min-h-24 w-full" required /><AdminImageInput scope="timeline" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></Card>{items.map((e)=><Card key={e.id}><form action={`/api/events/${e.id}`} method="post" className="space-y-2"><input type="hidden" name="_method" value="PATCH" /><input name="title" defaultValue={e.title} /><input name="status" defaultValue={e.status} /><input type="date" name="timeline_date" defaultValue={e.timeline_date} /><input type="number" name="sort_order" defaultValue={e.sort_order} /><textarea name="description" defaultValue={e.description} className="min-h-24 w-full" /><AdminImageInput scope="timeline" defaultUrl={e.image_url} /><button className="rounded border px-3 py-1">수정</button></form></Card>)}</div>;
}
