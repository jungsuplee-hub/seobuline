import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTimelineItems } from "@/lib/content-store";

type StageType = "past" | "current" | "planned";

function classifyTimeline(status: string): StageType {
  if (["절차 전환", "심의 통과"].includes(status)) return "current";
  if (["사업 지정", "재검토", "지역 촉구"].includes(status)) return "past";
  return "planned";
}

const stageStyle: Record<StageType, string> = {
  past: "border-slate-500/30 bg-slate-500/10 text-slate-200",
  current: "border-[#d0a453]/50 bg-[#d0a453]/15 text-[#f7d899]",
  planned: "border-emerald-500/35 bg-emerald-500/10 text-emerald-200",
};

const stageLabel: Record<StageType, string> = {
  past: "완료/이력",
  current: "현재 단계",
  planned: "예정/관찰",
};

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const timelineItems = await getTimelineItems();
  const sorted = [...timelineItems].sort((a, b) => a.timeline_date.localeCompare(b.timeline_date));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">진행현황</h1>
      <p className="text-sm text-[#dfcfb5]">과거·현재·예정 단계를 분리해 사업 흐름을 확인할 수 있도록 타임라인을 재구성했습니다.</p>

      <div className="space-y-4">
        {sorted.map((item, index) => {
          const stage = classifyTimeline(item.status);
          return (
            <div key={`${item.timeline_date}-${item.title}`} className="relative pl-8">
              {index < sorted.length - 1 && <span className="absolute bottom-[-22px] left-[11px] top-8 w-px bg-[#d0a453]/40" aria-hidden />}
              <span className="absolute left-0 top-5 h-6 w-6 rounded-full border border-[#d0a453]/50 bg-[#1b2431]" aria-hidden />

              <Card className={stage === "current" ? "border-[#d0a453]/55" : undefined}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">{item.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={stageStyle[stage]}>{stageLabel[stage]}</Badge>
                    <Badge>{item.status}</Badge>
                  </div>
                </div>
                <p className="mt-2 text-sm">{item.description}</p>
                <p className="mt-2 text-xs text-slate-400">기준 날짜: {item.timeline_date}</p>
                <p className="mt-1 text-xs text-slate-500">
                  출처: {item.source_name} · 기준일: {item.reference_date} ·{" "}
                  <a href={item.source_url} className="underline underline-offset-2 hover:text-[#f7d899] focus:text-[#f7d899]" target="_blank" rel="noreferrer">
                    관련 뉴스/자료 보기
                  </a>
                </p>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
