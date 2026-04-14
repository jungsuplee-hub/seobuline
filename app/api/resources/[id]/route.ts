import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

async function checkAdmin() {
  const user = await getCurrentUser();
  return Boolean(user && (user.role === "admin" || user.role === "moderator" || user.role === "manager"));
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const form = await req.formData();
  const fileUrl = String(form.get("file_url") || "").trim();
  db.prepare("UPDATE resources SET title=?, url=?, file_url=?, description=?, category=?, thumbnail_url=?, published_date=? WHERE id=?").run(
    String(form.get("title") || "").trim(),
    fileUrl,
    fileUrl,
    String(form.get("description") || "").trim() || null,
    String(form.get("category") || "").trim(),
    String(form.get("thumbnail_url") || "").trim() || null,
    String(form.get("published_date") || "").trim() || null,
    id,
  );
  return redirectWithForwardedHeaders(req, "/resources");
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  db.prepare("DELETE FROM resources WHERE id = ?").run(id);
  return redirectWithForwardedHeaders(req, "/resources");
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const form = Object.fromEntries((await req.formData()).entries());
  const method = String(form._method || "PATCH").toUpperCase();
  if (method === "DELETE") return DELETE(req, { params });
  return PATCH(req, { params });
}
