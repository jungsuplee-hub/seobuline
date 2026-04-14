import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = Object.fromEntries((await req.formData()).entries());
  const region = String(body.region || "").trim();
  const nicknameRaw = String(body.nickname || "").trim();
  const nickname = nicknameRaw.length ? nicknameRaw : null;

  if (!region) return NextResponse.json({ error: "지역을 입력해 주세요." }, { status: 400 });

  db.prepare("UPDATE users SET region = ?, nickname = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
    region,
    nickname,
    user.id,
  );

  return NextResponse.redirect(new URL("/mypage", req.url), { status: 303 });
}
