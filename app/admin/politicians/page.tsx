import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminImageInput from "@/components/admin-image-input";

export default async function AdminPoliticiansPage() {
  await requireAdmin("/admin/politicians");
  const items = db.prepare("SELECT * FROM politicians ORDER BY id DESC LIMIT 50").all() as Array<any>;

  return <div className="space-y-4"><Card><h1 className="text-xl font-bold">정치인 정보 추가</h1><form action="/api/politicians" method="post" className="space-y-2"><input name="name" placeholder="이름" required /><input name="party" placeholder="정당" /><input name="district" placeholder="지역" /><input name="office_type" placeholder="직책" /><input name="source_url" placeholder="출처 URL" /><textarea name="summary" placeholder="설명" className="min-h-24 w-full" required /><AdminImageInput scope="politicians" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></Card>{items.map((p)=><Card key={p.id}><form action={`/api/politicians/${p.id}`} method="post" className="space-y-2"><input type="hidden" name="_method" value="PATCH" /><input name="name" defaultValue={p.name} /><input name="party" defaultValue={p.party} /><input name="district" defaultValue={p.district} /><input name="office_type" defaultValue={p.office_type} /><input name="source_url" defaultValue={p.source_url} /><textarea name="summary" defaultValue={p.summary} className="min-h-24 w-full" /><AdminImageInput scope="politicians" defaultUrl={p.image_url} /><button className="rounded border px-3 py-1">수정</button></form></Card>)}</div>;
}
