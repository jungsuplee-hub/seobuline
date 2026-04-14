import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const summaryCardTitles = [
  "노선 개요",
  "사업 목적",
  "환승 효과",
  "주민 체감 기대효과",
] as const;

export default async function IntroducePage() {
  const [site, user] = await Promise.all([getSiteContent(), getCurrentUser()]);
  const { projectOverview, faqItems } = site;
  const canManage = canManageContent(user);

  const summaryCardValues = [
    projectOverview.route_overview,
    projectOverview.business_summary,
    "1·2·6·7·9호선 연계 구간 중심으로 통행 선택지를 늘려 혼잡 분산 효과를 기대합니다.",
    projectOverview.resident_perspective_summary,
  ];

  return (
    <div className="space-y-6">
      {canManage && <div className="flex justify-end"><Link href="/introduce/edit" className="rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">수정</Link></div>}
      <section className="relative overflow-hidden rounded-2xl border border-[#d0a453]/25">
        <Image
          src={(projectOverview as { hero_image_url?: string | null }).hero_image_url || "/assets/route-overview.svg"}
          alt="서부선 노선 개요를 설명하는 시각 자료"
          width={1400}
          height={760}
          className="h-[320px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090d14]/95 via-[#090d14]/65 to-[#090d14]/40" />
        <div className="absolute inset-0 p-7 md:p-10">
          <Badge>서부선 핵심 소개</Badge>
          <h1 className="mt-3 text-2xl font-bold md:text-4xl">서부권 생활권을 잇는 도시철도 축, 서부선</h1>
          <p className="mt-3 max-w-3xl text-sm text-[#f1e6d3] md:text-base">
            참고 자료의 사실관계를 바탕으로, 사업 목적·연결 구간·환승 효과를 캠페인 사이트 문체에 맞춰 재정리했습니다.
            핵심은 이동시간 단축뿐 아니라 서부권 내 생활·업무·교육 이동의 예측 가능성을 높이는 데 있습니다.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">한눈에 보는 요약</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCardTitles.map((title, idx) => (
            <Card key={title} className="h-full">
              <p className="text-xs text-[#cab898]">핵심 포인트</p>
              <h3 className="mt-1 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-[#e5d8c2]">{summaryCardValues[idx]}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="text-xl font-semibold">상세 설명</h2>
          <p className="mt-3 text-sm">{projectOverview.business_summary}</p>
          <h3 className="mt-4 font-semibold">왜 서부선이 필요한가</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#dfcfb5]">
            {projectOverview.추진_background.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-4 font-semibold">주요 정차 예상·연결 구간</h3>
          <p className="mt-1 text-sm">{projectOverview.route_overview}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#dfcfb5]">
            {projectOverview.major_stations_or_sections.map((station) => (
              <li key={station}>{station}</li>
            ))}
          </ul>

          <h3 className="mt-4 font-semibold">서울 서부권 교통 개선 효과</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#dfcfb5]">
            {projectOverview.expected_effects.map((effect) => (
              <li key={effect}>{effect}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">연결성 시각 자료</h2>
          <Image
            src="/assets/connectivity-panel.svg"
            alt="지역 연결성과 환승 개선 효과를 표현한 시각 패널"
            width={700}
            height={760}
            className="mt-3 h-auto w-full rounded-lg border border-[#d0a453]/20"
          />
          <p className="mt-3 text-sm text-[#dfcfb5]">
            은평·마포·서대문·영등포·동작·관악을 잇는 횡축 관점에서 접근성과 환승 편의 개선 효과를 강조했습니다.
          </p>
        </Card>
      </section>

      <Card>
        <h2 className="font-semibold">FAQ</h2>
        <ul className="mt-2 space-y-3 text-sm">
          {faqItems.map((f) => (
            <li key={f.question}>
              <strong>{f.question}</strong>
              <p className="mt-1">{f.answer}</p>
              <p className="mt-1 text-xs text-slate-500">
                출처: {f.source_name} · 기준일: {f.reference_date} ·{" "}
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
              {source.source_name} (기준일: {source.reference_date}) ·{" "}
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
