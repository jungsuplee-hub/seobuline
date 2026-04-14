import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateResetToken, validateEmail } from "@/lib/auth";

const RESET_TTL_MS = 1000 * 60 * 30;

export async function POST(req: Request) {
  const payload = await req.json();
  const email = String(payload.email || "").trim().toLowerCase();

  if (!validateEmail(email)) {
    return NextResponse.json({ error: "유효한 이메일을 입력해 주세요." }, { status: 400 });
  }

  const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | undefined;
  if (!user) {
    return NextResponse.json({ error: "등록된 이메일을 찾을 수 없습니다." }, { status: 404 });
  }

  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString();

  db.prepare("UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE user_id = ? AND used_at IS NULL").run(user.id);
  db.prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)").run(user.id, token, expiresAt);

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const resetLink = `${origin}/reset-password?token=${encodeURIComponent(token)}`;

  console.log("[password-reset]", { email, resetLink, expiresAt });

  return NextResponse.json({
    ok: true,
    message: "비밀번호 초기화 링크가 생성되었습니다.",
    resetLink,
    expiresAt,
  });
}
