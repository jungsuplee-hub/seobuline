import { z } from "zod";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirectWithForwardedHeaders } from "@/lib/request";

const postSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해 주세요.").max(120, "제목은 120자 이하여야 합니다."),
  content: z.string().trim().min(1, "내용을 입력해 주세요.").max(5000, "내용은 5000자 이하여야 합니다."),
  region: z.string().trim().max(30).nullable(),
  category: z.string().trim().min(1).max(30),
});

export async function GET() {
  const items = db
    .prepare(
      `SELECT p.id, p.title, p.content, p.created_at, p.region, p.category, p.author_id, p.view_count, u.nickname, u.email
       FROM posts p
       JOIN users u ON u.id = p.author_id
       WHERE p.is_deleted = 0
       ORDER BY p.created_at DESC`,
    )
    .all();

  return NextResponse.json({ entity: "posts", items });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const payload = Object.fromEntries((await req.formData()).entries());
  const parsed = postSchema.safeParse({
    title: payload.title,
    content: payload.content,
    region: String(payload.region || "").trim() || null,
    category: payload.category || "자유게시판",
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "입력값을 확인해 주세요.";
    return redirectWithForwardedHeaders(req, `/board/new?error=${encodeURIComponent(message)}`);
  }

  const result = db
    .prepare("INSERT INTO posts (title, content, region, category, author_id) VALUES (?, ?, ?, ?, ?)")
    .run(parsed.data.title, parsed.data.content, parsed.data.region, parsed.data.category, user.id);

  return redirectWithForwardedHeaders(req, `/board/${String(result.lastInsertRowid)}`);
}
