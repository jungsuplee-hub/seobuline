import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirectWithForwardedHeaders } from "@/lib/request";
import { regionSchema } from "@/lib/regions";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = Object.fromEntries((await req.formData()).entries());
  const regionRaw = String(body.region || "").trim();
  const regionResult = regionSchema.safeParse(regionRaw);
  const nicknameRaw = String(body.nickname || "").trim();
  const nickname = nicknameRaw.length ? nicknameRaw : null;

  if (!regionResult.success) {
    return redirectWithForwardedHeaders(req, `/mypage?error=${encodeURIComponent("지역을 올바르게 선택해 주세요.")}`);
  }

  db.prepare("UPDATE users SET region = ?, nickname = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
    regionResult.data,
    nickname,
    user.id,
  );

  return redirectWithForwardedHeaders(req, "/mypage");
}
