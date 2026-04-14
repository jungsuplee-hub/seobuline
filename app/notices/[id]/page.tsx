import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const n = db.prepare("SELECT title, content FROM notices WHERE id = ?").get(id) as { title: string; content: string } | undefined;
  return { title: n?.title ?? "공지 상세", description: n?.content };
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = db.prepare("SELECT * FROM notices WHERE id = ?").get(id) as { title: string; content: string; created_at: string; image_url: string | null } | undefined;
  const user = await getCurrentUser();
  if (!n) return <div>존재하지 않는 공지입니다.</div>;

  return (
    <article className="space-y-3">
      <div className="flex justify-between gap-2">
        <h1 className="text-2xl font-bold">{n.title}</h1>
        {canManageContent(user) && <Link href={`/notices/${id}/edit`} className="rounded border px-2 py-1 text-xs">수정</Link>}
      </div>
      <p className="text-sm text-slate-500">{n.created_at}</p>
      {n.image_url && <img src={n.image_url} alt="공지 이미지" className="w-full rounded-lg object-cover" />}
      <p className="whitespace-pre-wrap">{n.content}</p>
    </article>
  );
}
