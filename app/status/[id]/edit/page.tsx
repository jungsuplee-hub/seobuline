import Link from "next/link";
import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { db } from "@/lib/db";

export default async function EditStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  const { id } = await params;
  const event = db.prepare("SELECT * FROM timeline_items WHERE id = ?").get(id) as any;
  if (!event) redirect("/status");
  const timelineDateValue = String(event.timeline_date || "").slice(0, 10);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">진행현황 수정</h1>
      <form action={`/api/events/${id}`} method="post" className="space-y-2">
        <input type="hidden" name="_method" value="PATCH" />
        <input name="title" defaultValue={event.title} className="w-full" required />
        <textarea name="description" defaultValue={event.description} className="min-h-24 w-full" required />
        <input name="status" defaultValue={event.status} className="w-full" required />
        <input type="date" name="timeline_date" defaultValue={timelineDateValue} className="w-full" required />
        <input name="source_name" defaultValue={event.source_name || ""} className="w-full" placeholder="출처명" />
        <input name="source_url" defaultValue={event.source_url || ""} className="w-full" placeholder="출처 URL" />
        <input type="number" name="sort_order" defaultValue={event.sort_order} className="w-full" />
        <AdminImageInput scope="timeline" defaultUrl={event.image_url || ""} />
        <div className="flex gap-2">
          <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">수정 저장</button>
          <Link href="/status" className="rounded border px-3 py-2">취소</Link>
          <button formAction={`/api/events/${id}`} name="_method" value="DELETE" className="rounded border border-red-400/60 px-3 py-2 text-red-300">삭제</button>
        </div>
      </form>
    </div>
  );
}
