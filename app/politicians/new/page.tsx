import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export default async function NewPoliticianPage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">새 정치인 정보 등록</h1>
      <form action="/api/politicians" method="post" className="space-y-2">
        <input name="name" required placeholder="이름" className="w-full" />
        <input name="party" placeholder="정당" className="w-full" />
        <input name="district" placeholder="지역구" className="w-full" />
        <input name="office_type" placeholder="직책" className="w-full" />
        <input name="region_tags" placeholder="지역 태그(쉼표로 구분)" className="w-full" />
        <textarea name="summary" required className="min-h-24 w-full" placeholder="요약" />
        <textarea name="stance_or_relevance" className="min-h-24 w-full" placeholder="입장/연관성" />
        <input name="election_2026_status" placeholder="2026 선거 상태" className="w-full" />
        <input name="source_name" placeholder="출처명" className="w-full" />
        <input name="source_url" placeholder="출처 URL" className="w-full" />
        <input name="official_website" placeholder="공식 웹사이트" className="w-full" />
        <input name="x_url" placeholder="X URL" className="w-full" />
        <input name="blog_url" placeholder="블로그 URL" className="w-full" />
        <input name="office_phone" placeholder="대표 전화" className="w-full" />
        <AdminImageInput scope="politicians" />
        <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button>
      </form>
    </div>
  );
}
