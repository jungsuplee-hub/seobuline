import { NextResponse } from "next/server";
import { createSession, getRoleForEmail, hashPassword, validateEmail } from "@/lib/auth";
import { normalizeEmail } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { regionSchema } from "@/lib/regions";

export async function POST(req: Request) {
  const payload = await req.json();
  const email = normalizeEmail(String(payload.email || ""));
  const password = String(payload.password || "");
  const regionRaw = String(payload.region || "").trim();
  const regionResult = regionSchema.safeParse(regionRaw);
  const nicknameRaw = String(payload.nickname || "").trim();
  const nickname = nicknameRaw.length ? nicknameRaw : null;

  if (!validateEmail(email)) {
    return NextResponse.json({ error: "유효한 이메일을 입력해 주세요." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }
  if (!regionResult.success) {
    return NextResponse.json({ error: "지역을 올바르게 선택해 주세요." }, { status: 400 });
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE lower(trim(email)) = ?")
    .get(email) as { id: number } | undefined;
  if (existing) {
    return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const role = getRoleForEmail(email);
  const result = db
    .prepare("INSERT INTO users (email, password_hash, nickname, role, region) VALUES (?, ?, ?, ?, ?)")
    .run(email, passwordHash, nickname, role, regionResult.data);

  await createSession(Number(result.lastInsertRowid));

  return NextResponse.json({ ok: true });
}
