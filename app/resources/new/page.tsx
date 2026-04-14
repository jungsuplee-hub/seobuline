import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export default async function NewResourcePage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">새 자료 등록</h1>
      <form action="/api/resources" method="post" className="space-y-2">
        <input name="title" required className="w-full" placeholder="제목" />
        <textarea name="description" className="min-h-24 w-full" placeholder="설명" />
        <input name="file_url" required className="w-full" placeholder="파일/링크 URL" />
        <input name="category" className="w-full" placeholder="카테고리" />
        <input type="date" name="published_date" className="w-full" defaultValue={new Date().toISOString().slice(0, 10)} />
        <AdminImageInput scope="resources" name="thumbnail_url" />
        <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button>
      </form>
    </div>
  );
}
