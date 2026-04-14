import { NextResponse } from "next/server";
import { createSession, validateEmail, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const isForm = (req.headers.get("content-type") || "").includes("form");
  const payload = isForm ? Object.fromEntries((await req.formData()).entries()) : await req.json();

  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  if (!validateEmail(email) || password.length < 8) {
    return NextResponse.json({ error: "이메일 또는 비밀번호 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const user = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as
    | { id: number; password_hash: string }
    | undefined;

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
