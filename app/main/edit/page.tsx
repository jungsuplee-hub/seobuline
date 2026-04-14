import Link from "next/link";
import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { getSiteContent } from "@/lib/content-store";
import { canManageContent } from "@/lib/permissions";

export default async function EditMainPage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");

  const { homeHero } = await getSiteContent();

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">메인페이지 수정</h1>
      <form action="/api/site-content" method="post" className="space-y-3">
        <input type="hidden" name="section" value="home" />

        <div className="space-y-2 rounded border border-[#d0a453]/35 p-4">
          <label className="block text-sm">배지 텍스트</label>
          <input name="home_badge" defaultValue={homeHero.badge} className="w-full" required />

          <label className="block text-sm">메인 제목 (줄바꿈 가능)</label>
          <textarea name="home_title" defaultValue={homeHero.title} className="min-h-24 w-full" required />

          <label className="block text-sm">설명 문구</label>
          <textarea name="home_description" defaultValue={homeHero.description} className="min-h-24 w-full" required />
        </div>

        <AdminImageInput scope="site" name="home_image_url" defaultUrl={homeHero.image_url} />

        <div className="space-y-2 rounded border border-[#d0a453]/35 p-4">
          <label className="block text-sm font-semibold text-[#f6d794]">메인 히어로 이미지 위치</label>
          <select
            name="home_image_position"
            defaultValue={homeHero.image_position || "center center"}
            className="w-full rounded border border-[#d0a453]/40 bg-[#0f1520] px-3 py-2"
          >
            <option value="center center">가운데</option>
            <option value="top center">위쪽</option>
            <option value="bottom center">아래쪽</option>
            <option value="center left">왼쪽</option>
            <option value="center right">오른쪽</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">저장</button>
          <Link href="/" className="rounded border px-3 py-2">취소</Link>
        </div>
      </form>
    </div>
  );
}
