import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/upload";

const ADMIN_SCOPES = new Set(["news", "notices", "politicians", "resources", "site", "timeline", "route-map"]);
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function jsonError(message: string, status: number) {
  return new NextResponse(JSON.stringify({ ok: false, error: message }), { status, headers: JSON_HEADERS });
}

function isUploadFile(
  value: FormDataEntryValue | null,
): value is FormDataEntryValue & { name: string; size: number; type: string; arrayBuffer: () => Promise<ArrayBuffer> } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "name" in value &&
      "size" in value &&
      "type" in value &&
      "arrayBuffer" in value &&
      typeof (value as { arrayBuffer?: unknown }).arrayBuffer === "function",
  );
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError("로그인 후 이용해 주세요.", 401);

    const formData = await req.formData();
    const file = formData.get("file");
    const scope = String(formData.get("scope") || "misc");

    if (!isUploadFile(file)) {
      return jsonError("유효한 파일이 없습니다.", 400);
    }

    if (scope === "posts") {
      // all signed users can upload in board
    } else if (ADMIN_SCOPES.has(scope)) {
      if (user.role !== "admin" && user.role !== "moderator" && user.role !== "manager") {
        return jsonError("관리자 권한이 필요합니다.", 403);
      }
    } else {
      return jsonError("허용되지 않은 업로드 타입입니다.", 400);
    }

    const url = await saveUploadedImage(file as File, scope);
    return new NextResponse(JSON.stringify({ ok: true, url }), { status: 200, headers: JSON_HEADERS });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "업로드 실패", 400);
  }
}
