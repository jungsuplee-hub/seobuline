import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

async function bodyFrom(req: Request) {
  const type = req.headers.get("content-type") || "";
  if (type.includes("form")) return Object.fromEntries((await req.formData()).entries());
  return req.json();
}

export async function POST(req: Request) {
  const body = await bodyFrom(req);
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  );

  const { error } = await admin.from("profiles").upsert({
    user_id: body.userId,
    email: body.email,
    region: body.region,
    nickname: body.nickname || null,
    role: "user",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if ((req.headers.get("content-type") || "").includes("form")) {
    return NextResponse.redirect(new URL("/mypage", req.url), { status: 303 });
  }
  return NextResponse.json({ ok: true });
}
