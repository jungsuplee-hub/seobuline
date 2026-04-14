import Link from "next/link";
import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { getNewsById } from "@/lib/news-store";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  const { id } = await params;
  const news = await getNewsById(id);
  if (!news) redirect("/news");

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">뉴스 수정</h1>
      <form action={`/api/news/${id}`} method="post" className="space-y-2">
        <input type="hidden" name="_method" value="PATCH" />
        <input name="title" defaultValue={news.title} className="w-full" required />
        <input name="source_name" defaultValue={news.source_name} className="w-full" required />
        <input name="source_url" defaultValue={news.source_url} className="w-full" required />
        <input name="category" defaultValue={news.category} className="w-full" />
        <input type="date" name="published_date" defaultValue={news.published_date} className="w-full" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" value="1" defaultChecked={Boolean(news.is_featured)} /> 대표 노출</label>
        <textarea name="summary" defaultValue={news.summary} className="min-h-24 w-full" required />
        <AdminImageInput scope="news" defaultUrl={news.image_url || ""} />
        <div className="flex gap-2">
          <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">수정 저장</button>
          <Link href={`/news/${id}`} className="rounded border px-3 py-2">취소</Link>
        </div>
      </form>
    </div>
  );
}
