import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

type ResourceRow = {
  id: number;
  title: string;
  url: string;
  file_url: string | null;
  description: string | null;
  category: string | null;
  thumbnail_url: string | null;
  created_at: string;
  published_date: string | null;
};

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

function formatFileName(url: string) {
  const pathname = url.split("?")[0] || url;
  const fileName = pathname.split("/").pop();
  return fileName || "첨부파일";
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, user] = await Promise.all([params, getCurrentUser()]);
  const resource = db.prepare("SELECT * FROM resources WHERE id = ?").get(id) as ResourceRow | undefined;

  if (!resource) notFound();

  const canManage = canManageContent(user);
  const attachmentUrl = resource.file_url || resource.url;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{resource.title}</h1>
        <div className="flex gap-2">
          {canManage && (
            <Link href={`/resources/${resource.id}/edit`} className="rounded border px-3 py-2 text-sm">
              수정
            </Link>
          )}
          <Link href="/resources" className="rounded border px-3 py-2 text-sm">
            목록
          </Link>
        </div>
      </div>

      <p className="text-sm text-slate-400">
        {resource.category || "기타"} · {resource.published_date || resource.created_at}
      </p>

      {resource.thumbnail_url && isImageUrl(resource.thumbnail_url) && (
        <img src={resource.thumbnail_url} alt={`${resource.title} 대표 이미지`} className="max-h-[520px] w-full rounded object-contain" />
      )}

      {resource.description && <p className="whitespace-pre-wrap leading-relaxed text-[#e8dcc9]">{resource.description}</p>}

      {attachmentUrl ? (
        <div className="rounded border border-[#d0a453]/40 bg-[#0c1322] p-4">
          <h2 className="mb-2 text-sm font-semibold text-[#f7d899]">첨부파일</h2>
          <a
            href={attachmentUrl}
            download
            className="inline-flex items-center rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]"
          >
            다운로드: {formatFileName(attachmentUrl)}
          </a>
        </div>
      ) : (
        <p className="text-sm text-[#cab898]">첨부된 파일이 없습니다.</p>
      )}
    </div>
  );
}
