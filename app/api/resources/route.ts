import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

export async function GET() {
  const items = db.prepare("SELECT * FROM resources ORDER BY created_at DESC").all();
  return NextResponse.json({ entity: "resources", items });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator" && user.role !== "manager")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const form = await req.formData();
  const fileUrl = String(form.get("file_url") || "").trim();
  db.prepare("INSERT INTO resources (title, url, file_url, description, category, thumbnail_url, published_date) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    String(form.get("title") || "").trim(),
    fileUrl,
    fileUrl,
    String(form.get("description") || "").trim() || null,
    String(form.get("category") || "").trim(),
    String(form.get("thumbnail_url") || "").trim() || null,
    String(form.get("published_date") || "").trim() || null,
  );
  return redirectWithForwardedHeaders(req, "/resources");
}
