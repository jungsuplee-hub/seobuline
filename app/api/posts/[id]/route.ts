import { redirectWithForwardedHeaders } from "@/lib/request";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseImageUrls } from "@/lib/upload";

function canManagePost(postId: string, user: { id: number; role: string }) {
  if (user.role === "admin" || user.role === "moderator" || user.role === "manager") return true;
  const post = db.prepare("SELECT author_id FROM posts WHERE id = ? AND is_deleted = 0").get(postId) as { author_id: number } | undefined;
  return Boolean(post && post.author_id === user.id);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!canManagePost(id, user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await req.formData();
  const payload = Object.fromEntries(formData.entries());
  const imageUrls = parseImageUrls(formData.get("image_urls"));

  db.prepare("UPDATE posts SET title = ?, content = ?, region = ?, category = ?, image_urls = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
    String(payload.title || "").trim(),
    String(payload.content || "").trim(),
    String(payload.region || "").trim() || null,
    String(payload.category || "자유게시판").trim(),
    JSON.stringify(imageUrls),
    id,
  );

  return redirectWithForwardedHeaders(req, `/board/${id}`);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!canManagePost(id, user)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  db.prepare("UPDATE posts SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  return redirectWithForwardedHeaders(req, "/board");
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const form = Object.fromEntries((await req.formData()).entries());
  const method = String(form._method || "PATCH").toUpperCase();
  if (method === "DELETE") return DELETE(req, { params });
  return PATCH(req, { params });
}
