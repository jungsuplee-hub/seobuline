import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const items = db
    .prepare(
      `SELECT p.id, p.title, p.content, p.created_at, p.region, p.category, p.author_id, u.nickname, u.email
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
  const title = String(payload.title || "").trim();
  const content = String(payload.content || "").trim();
  const region = String(payload.region || "").trim() || null;
  const category = String(payload.category || "자유게시판").trim();

  if (!title || !content) return NextResponse.json({ error: "제목과 내용을 입력해 주세요." }, { status: 400 });

  db.prepare("INSERT INTO posts (title, content, region, category, author_id) VALUES (?, ?, ?, ?, ?)").run(
    title,
    content,
    region,
    category,
    user.id,
  );

  return NextResponse.redirect(new URL("/board", req.url), { status: 303 });
}
