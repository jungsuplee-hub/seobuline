import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const payload = await req.json();
  const token = String(payload.token || "").trim();
  const password = String(payload.password || "");

  if (!token) {
    return NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  const now = new Date().toISOString();
  const tokenRow = db
    .prepare(
      `SELECT id, user_id, expires_at
       FROM password_reset_tokens
       WHERE token = ? AND used_at IS NULL`,
    )
    .get(token) as { id: number; user_id: number; expires_at: string } | undefined;

  if (!tokenRow) {
    return NextResponse.json({ error: "유효하지 않거나 이미 사용된 토큰입니다." }, { status: 400 });
  }

  if (tokenRow.expires_at <= now) {
    db.prepare("UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?").run(tokenRow.id);
    return NextResponse.json({ error: "토큰이 만료되었습니다. 다시 요청해 주세요." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const tx = db.transaction(() => {
    db.prepare("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(passwordHash, tokenRow.user_id);
    db.prepare("UPDATE sessions SET expires_at = CURRENT_TIMESTAMP WHERE user_id = ?").run(tokenRow.user_id);
    db.prepare("UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE id = ?").run(tokenRow.id);
  });

  tx();

  return NextResponse.json({ ok: true, message: "비밀번호가 재설정되었습니다. 다시 로그인해 주세요." });
}
