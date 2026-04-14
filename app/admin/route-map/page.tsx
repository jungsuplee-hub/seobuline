import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import AdminImageInput from "@/components/admin-image-input";

export default async function AdminRouteMapPage() {
  await requireAdmin("/admin/route-map");
  const row = db.prepare("SELECT route_map_image_url FROM site_content WHERE id = 1").get() as
    | { route_map_image_url: string | null }
    | undefined;

  return (
    <Card className="space-y-3">
      <h1 className="text-xl font-bold">예상노선도 이미지 관리</h1>
      <p className="text-sm text-[#decfb8]">업로드 후 저장하면 공개 페이지(/route-map)에 즉시 반영됩니다.</p>
      <form action="/api/route-map" method="post" className="space-y-3">
        <AdminImageInput scope="route-map" name="route_map_image_url" defaultUrl={row?.route_map_image_url || ""} />
        <button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">저장</button>
      </form>
    </Card>
  );
}
