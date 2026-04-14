import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTimelineItems } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const timelineItems = await getTimelineItems();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">진행현황</h1>
      <div className="space-y-3">
        {timelineItems.map((item) => (
          <Card key={`${item.timeline_date}-${item.title}`}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">{item.title}</h2>
              <Badge>{item.status}</Badge>
            </div>
            <p className="mt-1 text-sm">{item.description}</p>
            <p className="mt-1 text-xs text-slate-500">{item.timeline_date}</p>
            <p className="mt-1 text-xs text-slate-500">
              출처: {item.source_name} · 기준일: {item.reference_date} ·{" "}
              <a href={item.source_url} className="underline" target="_blank" rel="noreferrer">
                원문
              </a>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
