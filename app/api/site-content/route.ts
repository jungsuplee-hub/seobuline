import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator" && user.role !== "manager")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const aboutContent = String(form.get("about_content") || "").trim();
  const imageUrl = String(form.get("image_url") || "").trim() || null;

  db.prepare("UPDATE site_content SET about_content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1").run(aboutContent, imageUrl);

  return redirectWithForwardedHeaders(req, "/introduce");
}
