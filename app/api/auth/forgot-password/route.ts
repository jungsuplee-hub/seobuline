import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateResetToken, validateEmail } from "@/lib/auth";
import { buildAbsoluteUrl } from "@/lib/request";

const RESET_TTL_MS = 1000 * 60 * 30;
const MAX_TOKEN_INSERT_RETRIES = 5;

function createPasswordResetToken(userId: number, expiresAt: string) {
  for (let attempt = 1; attempt <= MAX_TOKEN_INSERT_RETRIES; attempt += 1) {
    const token = generateResetToken();

    try {
      const tx = db.transaction(() => {
        db.prepare("UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE user_id = ? AND used_at IS NULL").run(userId);
        db.prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)").run(userId, token, expiresAt);
      });

      tx();
      return token;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const isUniqueCollision = message.includes("UNIQUE constraint failed: password_reset_tokens.token");
      if (isUniqueCollision && attempt < MAX_TOKEN_INSERT_RETRIES) {
        continue;
      }
      throw error;
    }
  }

  throw new Error("Could not create password reset token after retries.");
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const email = String(payload.email || "").trim().toLowerCase();

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "유효한 이메일을 입력해 주세요." }, { status: 400 });
    }

    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | undefined;
    if (!user) {
      return NextResponse.json({ error: "등록된 이메일을 찾을 수 없습니다." }, { status: 404 });
    }

    const expiresAt = new Date(Date.now() + RESET_TTL_MS).toISOString();
    const token = createPasswordResetToken(user.id, expiresAt);

    const resetLink = buildAbsoluteUrl(`/reset-password?token=${encodeURIComponent(token)}`, req);

    console.log("[password-reset]", { email, resetLink, expiresAt });

    return NextResponse.json({
      ok: true,
      message: "비밀번호 초기화 링크가 생성되었습니다.",
      resetLink,
      expiresAt,
    });
  } catch (error) {
    console.error("[password-reset] failed to create reset link", error);
    return NextResponse.json({ error: "초기화 링크 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
