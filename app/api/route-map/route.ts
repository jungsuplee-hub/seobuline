import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const routeMapImageUrl = String(form.get("route_map_image_url") || "").trim() || null;

  db.prepare("UPDATE site_content SET route_map_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1").run(routeMapImageUrl);

  return redirectWithForwardedHeaders(req, "/admin/route-map");
}
