import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

function ownsPost(postId: string, userId: number) {
  const post = db.prepare("SELECT author_id FROM posts WHERE id = ? AND is_deleted = 0").get(postId) as
    | { author_id: number }
    | undefined;
  return Boolean(post && post.author_id === userId);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!ownsPost(id, user.id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const payload = Object.fromEntries((await req.formData()).entries());
  db.prepare("UPDATE posts SET title = ?, content = ?, region = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
    String(payload.title || "").trim(),
    String(payload.content || "").trim(),
    String(payload.region || "").trim() || null,
    String(payload.category || "자유게시판").trim(),
    id,
  );

  return NextResponse.redirect(new URL("/board", req.url), { status: 303 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!ownsPost(id, user.id)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  db.prepare("UPDATE posts SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  return NextResponse.redirect(new URL("/board", req.url), { status: 303 });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const form = Object.fromEntries((await req.formData()).entries());
  const method = String(form._method || "PATCH").toUpperCase();
  if (method === "DELETE") return DELETE(req, { params });
  return PATCH(req, { params });
}
