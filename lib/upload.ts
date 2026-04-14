import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/json",
]);
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "text/plain": "txt",
  "text/csv": "csv",
  "application/json": "json",
};

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

function sanitizeScope(scope: string) {
  return scope.replace(/[^a-z0-9_-]/gi, "").toLowerCase() || "misc";
}

export async function saveUploadedFile(file: File, scope: string) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("지원하지 않는 파일 형식입니다. 이미지/PDF/문서/압축 파일만 업로드할 수 있습니다.");
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("파일 크기는 최대 10MB까지 업로드할 수 있습니다.");
  }

  const safeScope = sanitizeScope(scope);
  const uploadDir = path.join(process.cwd(), "public", "uploads", safeScope);
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = EXT_BY_MIME[file.type] || file.name.split(".").pop()?.toLowerCase() || "bin";
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const fullPath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(fullPath, buffer);

  return `/uploads/${safeScope}/${fileName}`;
}

export function parseImageUrls(input: FormDataEntryValue | null): string[] {
  if (!input) return [];
  try {
    const parsed = JSON.parse(String(input));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => typeof item === "string" && item.startsWith("/uploads/"));
  } catch {
    return [];
  }
}
