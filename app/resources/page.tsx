import Link from "next/link";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

function normalizeExternalUrl(url: string | null) {
  const trimmed = String(url || "").trim();
  if (!trimmed || trimmed.toUpperCase() === "N/A") return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "";
}

export default async function ResourcesPage() {
  const [user, resources] = await Promise.all([
    getCurrentUser(),
    Promise.resolve(db.prepare("SELECT * FROM resources ORDER BY created_at DESC").all() as Array<{ id: number; title: string; url: string; file_url: string | null; description: string | null; category: string | null; thumbnail_url: string | null; created_at: string; published_date: string | null }>),
  ]);
  const canManage = canManageContent(user);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">자료실</h1>{canManage && <Link href="/resources/new" className="rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">새 자료 등록</Link>}</div>
      {resources.map((resource) => (
        <Card key={resource.id}>
          {resource.thumbnail_url && isImageUrl(resource.thumbnail_url) && <img src={resource.thumbnail_url} alt="자료 썸네일" className="mb-2 h-40 w-full rounded object-cover" />}
          <h2 className="font-semibold">{resource.title}</h2>
          <p className="text-sm text-slate-500">{resource.category || "기타"} · {resource.published_date || resource.created_at}</p>
          {resource.description && <p className="mt-2 text-sm text-[#e8dcc9]">{resource.description}</p>}
          {(() => {
            const linkUrl = normalizeExternalUrl(resource.file_url) || normalizeExternalUrl(resource.url);
            return linkUrl ? (
              <a className="mt-2 inline-block text-sm text-primary underline" href={linkUrl} target="_blank" rel="noreferrer">자료 보기</a>
            ) : (
              <p className="mt-2 text-xs text-[#cab898]">등록된 링크/파일이 없습니다.</p>
            );
          })()}
          {canManage && <div className="mt-2"><Link href={`/resources/${resource.id}/edit`} className="rounded border px-2 py-1 text-xs">수정</Link></div>}
        </Card>
      ))}
    </div>
  );
}
