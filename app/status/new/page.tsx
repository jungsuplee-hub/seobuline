import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export default async function NewStatusPage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");

  return <div className="space-y-3"><h1 className="text-2xl font-bold">진행현황 신규 추가</h1><form action="/api/events" method="post" className="space-y-2"><input name="title" required placeholder="제목" className="w-full" /><input name="status" defaultValue="진행" className="w-full" /><input type="date" name="timeline_date" defaultValue={new Date().toISOString().slice(0,10)} className="w-full" /><input type="number" name="sort_order" defaultValue={0} className="w-full" /><textarea name="description" required className="min-h-24 w-full" /><AdminImageInput scope="timeline" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></div>;
}
