import { Card } from "@/components/ui/card";
import { getTimelineItems } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getTimelineItems();

  return <div className="space-y-4"><h1 className="text-2xl font-bold">진행현황</h1>{events.map((e) => <Card key={`${e.title}-${e.timeline_date}`}><h2 className="font-semibold">{e.title}</h2><p className="text-sm text-slate-500">{e.timeline_date} · {e.status}</p>{e.image_url ? <img src={String(e.image_url)} alt="진행현황 이미지" className="mt-2 h-44 w-full rounded object-cover" /> : null}<p className="mt-2 text-sm">{e.description}</p></Card>)}</div>;
}
