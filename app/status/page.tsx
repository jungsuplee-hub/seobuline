import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTimelineItems } from "@/lib/content-store";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const [timelineItems, user] = await Promise.all([getTimelineItems(), getCurrentUser()]);
  const sorted = [...timelineItems].sort((a, b) => String(a.timeline_date).localeCompare(String(b.timeline_date)));
  const canManage = canManageContent(user);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">진행현황</h1>
        {canManage && <Link href="/status/new" className="rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">신규 추가</Link>}
      </div>
      <div className="space-y-4">
        {sorted.map((item) => (
          <Card key={`${item.timeline_date}-${item.title}`}>
            <div className="flex justify-between gap-2">
              <h2 className="font-semibold">{item.title}</h2>
              {canManage && item.id ? <Link href={`/status/${item.id}/edit`} className="rounded border px-2 py-1 text-xs">수정</Link> : null}
            </div>
            <div className="mt-1"><Badge>{item.status}</Badge></div>
            <p className="mt-2 text-sm">{item.description}</p>
            <p className="mt-2 text-xs text-slate-400">기준 날짜: {item.timeline_date}</p>
            {item.image_url ? <img src={String(item.image_url)} alt="진행현황 이미지" className="mt-2 h-44 w-full rounded object-cover" /> : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
