import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export default async function NewNewsPage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">새 뉴스 등록</h1>
      <form action="/api/news" method="post" className="space-y-2">
        <input name="title" placeholder="제목" required className="w-full" />
        <input name="source_name" placeholder="출처" required className="w-full" />
        <input name="source_url" placeholder="원문 URL" required className="w-full" />
        <input name="category" placeholder="카테고리" defaultValue="일반" className="w-full" />
        <input type="date" name="published_date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-full" />
        <textarea name="summary" placeholder="요약" className="min-h-24 w-full" required />
        <AdminImageInput scope="news" />
        <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button>
      </form>
    </div>
  );
}
