import Link from "next/link";
import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { getSiteContent } from "@/lib/content-store";
import { canManageContent } from "@/lib/permissions";

export default async function EditIntroducePage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");

  const site = await getSiteContent();
  const projectOverview = site.projectOverview;
  const imageValue = (projectOverview as { hero_image_url?: string | null }).hero_image_url || "";

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">소개 수정</h1>
      <form action="/api/site-content" method="post" className="space-y-3">
        <div className="space-y-2 rounded border border-[#d0a453]/35 p-4">
          <h2 className="font-semibold text-[#f6d794]">히어로/상세 섹션</h2>
          <label className="block text-sm">상세 설명</label>
          <textarea name="business_summary" defaultValue={projectOverview.business_summary} className="min-h-32 w-full" required />
          <label className="block text-sm">노선 개요</label>
          <textarea name="route_overview" defaultValue={projectOverview.route_overview} className="min-h-24 w-full" required />
          <label className="block text-sm">주민 체감 기대효과</label>
          <textarea name="resident_perspective_summary" defaultValue={projectOverview.resident_perspective_summary} className="min-h-24 w-full" required />
        </div>

        <div className="space-y-2 rounded border border-[#d0a453]/35 p-4">
          <h2 className="font-semibold text-[#f6d794]">리스트 섹션 (한 줄당 1개 항목)</h2>
          <label className="block text-sm">왜 서부선이 필요한가</label>
          <textarea name="추진_background" defaultValue={projectOverview["추진_background"].join("\n")} className="min-h-28 w-full" required />
          <label className="block text-sm">주요 정차 예상·연결 구간</label>
          <textarea name="major_stations_or_sections" defaultValue={projectOverview.major_stations_or_sections.join("\n")} className="min-h-28 w-full" required />
          <label className="block text-sm">서울 서부권 교통 개선 효과</label>
          <textarea name="expected_effects" defaultValue={projectOverview.expected_effects.join("\n")} className="min-h-28 w-full" required />
        </div>

        <AdminImageInput scope="site" defaultUrl={imageValue} />
        <div className="flex gap-2">
          <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">저장</button>
          <Link href="/introduce" className="rounded border px-3 py-2">취소</Link>
        </div>
      </form>
    </div>
  );
}
