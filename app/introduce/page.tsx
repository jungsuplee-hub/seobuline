import { Card } from "@/components/ui/card";
import { faqItems, projectOverview } from "@/lib/public-data";

export default function IntroducePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">서부선 소개</h1>

      <Card>
        <h2 className="font-semibold">사업 개요</h2>
        <p className="mt-2 text-sm">{projectOverview.business_summary}</p>
      </Card>

      <Card>
        <h2 className="font-semibold">추진 배경</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {projectOverview.추진_background.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold">노선 개요 / 주요 구간</h2>
        <p className="mt-2 text-sm">{projectOverview.route_overview}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {projectOverview.major_stations_or_sections.map((station) => (
            <li key={station}>{station}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold">기대 효과</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {projectOverview.expected_effects.map((effect) => (
            <li key={effect}>{effect}</li>
          ))}
        </ul>
        <p className="mt-2 text-sm font-medium">주민 관점 요약</p>
        <p className="text-sm">{projectOverview.resident_perspective_summary}</p>
      </Card>

      <Card>
        <h2 className="font-semibold">FAQ</h2>
        <ul className="mt-2 space-y-3 text-sm">
          {faqItems.map((f) => (
            <li key={f.question}>
              <strong>{f.question}</strong>
              <p className="mt-1">{f.answer}</p>
              <p className="mt-1 text-xs text-slate-500">
                출처: {f.source_name} · 기준일: {f.reference_date} · {" "}
                <a href={f.source_url} className="underline" target="_blank" rel="noreferrer">
                  원문
                </a>
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold">주요 출처</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {projectOverview.sources.map((source) => (
            <li key={source.source_url}>
              {source.source_name} (기준일: {source.reference_date}) · {" "}
              <a href={source.source_url} className="underline" target="_blank" rel="noreferrer">
                링크
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
