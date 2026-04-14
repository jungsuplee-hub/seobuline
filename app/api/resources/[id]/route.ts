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
  db.prepare("UPDATE resources SET title=?, url=?, category=?, thumbnail_url=? WHERE id=?").run(
    String(form.get("title") || "").trim(),
    String(form.get("url") || "").trim(),
    String(form.get("category") || "").trim(),
    String(form.get("thumbnail_url") || "").trim() || null,
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
