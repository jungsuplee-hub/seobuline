import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { db } from "@/lib/db";

export default async function EditRouteMapPage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  const row = db.prepare("SELECT route_map_image_url FROM site_content WHERE id = 1").get() as { route_map_image_url: string | null } | undefined;

  return <div className="space-y-3"><h1 className="text-2xl font-bold">예상노선도 수정</h1><form action="/api/route-map" method="post" className="space-y-3"><AdminImageInput scope="route-map" name="route_map_image_url" defaultUrl={row?.route_map_image_url || ""} /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">저장</button></form></div>;
}
