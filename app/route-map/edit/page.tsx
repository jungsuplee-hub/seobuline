import Link from "next/link";
import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { db } from "@/lib/db";

export default async function EditRouteMapPage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  db.prepare("INSERT INTO site_content (id, about_content, route_map_image_url, route_map_image_urls) VALUES (1, '', NULL, NULL) ON CONFLICT(id) DO NOTHING").run();
  const row = db.prepare("SELECT route_map_image_url, route_map_image_urls FROM site_content WHERE id = 1").get() as
    | { route_map_image_url: string | null; route_map_image_urls: string | null }
    | undefined;

  if (!row) {
    return <div className="rounded border border-red-300/40 p-4 text-sm text-red-200">예상노선도 데이터를 불러오지 못했습니다.</div>;
  }

  const defaultUrls = row.route_map_image_urls?.trim()
    ? (() => {
      try {
        const parsed = JSON.parse(row.route_map_image_urls) as unknown;
        if (!Array.isArray(parsed)) return row.route_map_image_url ? [row.route_map_image_url] : [];
        return parsed.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
      } catch {
        return row.route_map_image_url ? [row.route_map_image_url] : [];
      }
    })()
    : (row.route_map_image_url ? [row.route_map_image_url] : []);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">예상노선도 수정</h1>
      <form action="/api/route-map" method="post" className="space-y-3">
        <AdminImageInput
          scope="route-map"
          name="route_map_image_urls"
          defaultUrls={defaultUrls}
          multiple
          accept="image/*"
          currentLabel="현재 노선도 이미지"
          uploadLabel="노선도 이미지 추가 업로드 (선택)"
        />
        <div className="flex gap-2">
          <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">저장</button>
          <Link href="/route-map" className="rounded border px-3 py-2">취소</Link>
        </div>
      </form>
    </div>
  );
}
