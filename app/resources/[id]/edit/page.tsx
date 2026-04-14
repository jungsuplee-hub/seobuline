import Link from "next/link";
import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { db } from "@/lib/db";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  const { id } = await params;
  const r = db.prepare("SELECT * FROM resources WHERE id = ?").get(id) as any;
  if (!r) redirect("/resources");

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">자료 수정</h1>
      <form action={`/api/resources/${id}`} method="post" className="space-y-2">
        <input type="hidden" name="_method" value="PATCH" />
        <input name="title" defaultValue={r.title} className="w-full" required />
        <textarea name="description" defaultValue={r.description || ""} className="min-h-24 w-full" />
        <input name="file_url" defaultValue={r.file_url || r.url} className="w-full" required />
        <input name="category" defaultValue={r.category || ""} className="w-full" />
        <input type="date" name="published_date" defaultValue={r.published_date || ""} className="w-full" />
        <AdminImageInput scope="resources" name="thumbnail_url" defaultUrl={r.thumbnail_url || ""} />
        <div className="flex gap-2">
          <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">수정 저장</button>
          <Link href="/resources" className="rounded border px-3 py-2">취소</Link>
          <button formAction={`/api/resources/${id}`} name="_method" value="DELETE" className="rounded border border-red-400/60 px-3 py-2 text-red-300">삭제</button>
        </div>
      </form>
    </div>
  );
}
