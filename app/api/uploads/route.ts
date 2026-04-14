import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/upload";

const ADMIN_SCOPES = new Set(["news", "notices", "politicians", "resources", "site", "timeline"]);

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인 후 이용해 주세요." }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  const scope = String(formData.get("scope") || "misc");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  if (scope === "posts") {
    // all signed users can upload in board
  } else if (ADMIN_SCOPES.has(scope)) {
    if (user.role !== "admin" && user.role !== "moderator") {
      return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: "허용되지 않은 업로드 타입입니다." }, { status: 400 });
  }

  try {
    const url = await saveUploadedImage(file, scope);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "업로드 실패" }, { status: 400 });
  }
}
