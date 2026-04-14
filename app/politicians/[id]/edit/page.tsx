import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { db } from "@/lib/db";

export default async function EditPoliticianPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  const { id } = await params;
  const p = db.prepare("SELECT * FROM politicians WHERE id = ?").get(id) as any;
  if (!p) redirect("/politicians");

  return <div className="space-y-3"><h1 className="text-2xl font-bold">정치인 정보 수정</h1><form action={`/api/politicians/${id}`} method="post" className="space-y-2"><input type="hidden" name="_method" value="PATCH" /><input name="name" defaultValue={p.name} className="w-full" /><input name="party" defaultValue={p.party || ""} className="w-full" /><input name="district" defaultValue={p.district || ""} className="w-full" /><input name="office_type" defaultValue={p.office_type || ""} className="w-full" /><input name="source_url" defaultValue={p.source_url || ""} className="w-full" /><textarea name="summary" defaultValue={p.summary || ""} className="min-h-24 w-full" /><AdminImageInput scope="politicians" defaultUrl={p.image_url || ""} /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">수정 저장</button></form></div>;
}
