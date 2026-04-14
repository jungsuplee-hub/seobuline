import { NextResponse } from "next/server";
import { createSession, hashPassword, validateEmail } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const payload = await req.json();
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const region = String(payload.region || "").trim();
  const nicknameRaw = String(payload.nickname || "").trim();
  const nickname = nicknameRaw.length ? nicknameRaw : null;

  if (!validateEmail(email)) {
    return NextResponse.json({ error: "유효한 이메일을 입력해 주세요." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }
  if (!region) {
    return NextResponse.json({ error: "지역을 입력해 주세요." }, { status: 400 });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: number } | undefined;
  if (existing) {
    return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const result = db
    .prepare("INSERT INTO users (email, password_hash, nickname, region) VALUES (?, ?, ?, ?)")
    .run(email, passwordHash, nickname, region);

  await createSession(Number(result.lastInsertRowid));

  return NextResponse.json({ ok: true });
}
