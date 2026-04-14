import { Card } from "@/components/ui/card";
import { politicianItems } from "@/lib/public-data";

export default function PoliticiansPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">정치인 정보공유</h1>
      <div className="rounded-md border-l-4 border-primary bg-mutedBg p-3 text-sm">
        공개 발언·보도·공식자료에 근거한 사실 요약만 제공합니다.
      </div>
      {politicianItems.map((item) => (
        <Card key={`${item.name}-${item.speech_date}`}>
          <h2 className="font-semibold">
            {item.name} ({item.party})
          </h2>
          <p className="text-sm">지역구/직위: {item.district}</p>
          <p className="mt-1 text-sm">{item.summary}</p>
          <p className="mt-1 text-xs text-slate-500">발언/입장일: {item.speech_date}</p>
          <p className="text-xs text-slate-500">검수상태: {item.review_status}</p>
          <p className="mt-1 text-xs text-slate-500">
            출처: {item.source_name} · 기준일: {item.reference_date} · {" "}
            <a className="underline" href={item.source_url} target="_blank" rel="noreferrer">
              원문
            </a>
          </p>
        </Card>
      ))}
    </div>
  );
}
