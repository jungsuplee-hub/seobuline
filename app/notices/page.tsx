import Link from "next/link";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const [user, notices] = await Promise.all([
    getCurrentUser(),
    Promise.resolve(db.prepare("SELECT id, title, created_at, image_url, is_pinned FROM notices ORDER BY is_pinned DESC, created_at DESC").all() as Array<{ id: number; title: string; created_at: string; image_url: string | null; is_pinned: number }>),
  ]);
  const canManage = canManageContent(user);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">공지사항</h1>
        {canManage && <Link href="/notices/new" className="rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">새 공지 등록</Link>}
      </div>
      {notices.map((n) => (
        <Card key={n.id}>
          {n.image_url && <img src={n.image_url} alt="공지 이미지" className="mb-2 h-40 w-full rounded object-cover" />}
          {Boolean(n.is_pinned) && <p className="text-xs text-[#f7d899]">상단 고정</p>}
          <Link className="font-semibold hover:text-primary" href={`/notices/${n.id}`}>{n.title}</Link>
          <p className="text-sm text-slate-500">{n.created_at}</p>
          {canManage && <div className="mt-2"><Link href={`/notices/${n.id}/edit`} className="rounded border px-2 py-1 text-xs">수정</Link></div>}
        </Card>
      ))}
    </div>
  );
}
