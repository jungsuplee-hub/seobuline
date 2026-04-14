"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { politicianItems as fallbackItems } from "@/lib/public-data";

type PoliticianItem = (typeof fallbackItems)[number];

export default function PoliticiansClient({ items }: { items: PoliticianItem[] }) {
  const searchParams = useSearchParams();
  const [region, setRegion] = useState("all");
  const [office, setOffice] = useState("all");
  const [party, setParty] = useState("all");
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const visibleItems = useMemo(() => items.filter((item) => item.is_visible), [items]);

  const regions = useMemo(() => ["all", ...new Set(visibleItems.flatMap((item) => item.region_tags))], [visibleItems]);
  const offices = useMemo(() => ["all", ...new Set(visibleItems.map((item) => item.office_type))], [visibleItems]);
  const parties = useMemo(() => ["all", ...new Set(visibleItems.map((item) => item.party))], [visibleItems]);

  const filtered = useMemo(
    () =>
      visibleItems.filter((item) => {
        const byRegion = region === "all" || item.region_tags.includes(region);
        const byOffice = office === "all" || item.office_type === office;
        const byParty = party === "all" || item.party === party;
        const byQuery = !query || [item.name, item.summary, item.stance_or_relevance, item.district, item.party].join(" ").toLowerCase().includes(query.toLowerCase());
        return byRegion && byOffice && byParty && byQuery;
      }),
    [visibleItems, region, office, party, query],
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">정치인 정보공유</h1>
      <div className="rounded-md border-l-4 border-[#d0a453] bg-[#121721] p-3 text-sm">서부선 영향권(은평·마포·서대문·영등포·동작·관악·안양) 중심 공개 출처 기반 정보입니다.</div>
      <div className="grid gap-2 md:grid-cols-4">
        <select className="rounded-md border border-[#d0a453]/30 bg-[#0f1622] p-2" value={region} onChange={(e) => setRegion(e.target.value)}>{regions.map((value) => <option key={value} value={value}>{value === "all" ? "전체 지역" : value}</option>)}</select>
        <select className="rounded-md border border-[#d0a453]/30 bg-[#0f1622] p-2" value={office} onChange={(e) => setOffice(e.target.value)}>{offices.map((value) => <option key={value} value={value}>{value === "all" ? "전체 직책" : value}</option>)}</select>
        <select className="rounded-md border border-[#d0a453]/30 bg-[#0f1622] p-2" value={party} onChange={(e) => setParty(e.target.value)}>{parties.map((value) => <option key={value} value={value}>{value === "all" ? "전체 정당" : value}</option>)}</select>
        <input className="rounded-md border border-[#d0a453]/30 bg-[#0f1622] p-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름/지역/정당 검색" />
      </div>
      <p className="text-sm text-[#cab898]">검색 결과: {filtered.length}명</p>
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((item) => (
          <Card key={`${item.name}-${item.office_type}-${item.district}`} className="transition hover:border-[#d0a453]/50">
            <h2 className="font-semibold">{item.name} · {item.office_type}</h2>
            <p className="text-sm">{item.party} / {item.district}</p>
            <p className="mt-2 text-sm">{item.summary}</p>
            <p className="mt-1 text-sm text-[#dfcfb5]">서부선 관련성: {item.stance_or_relevance}</p>
            <p className="mt-1 text-xs text-[#cab898]">2026년 6월 지방선거 공개 확인 상태: {item.election_2026_status || "공개 확인 자료 없음"}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              {item.official_website && <a className="underline hover:text-[#f7d899] focus:text-[#f7d899]" href={item.official_website} target="_blank" rel="noreferrer">공식 홈페이지</a>}
              {item.x_url && <a className="underline hover:text-[#f7d899] focus:text-[#f7d899]" href={item.x_url} target="_blank" rel="noreferrer">X</a>}
              {item.blog_url && <a className="underline hover:text-[#f7d899] focus:text-[#f7d899]" href={item.blog_url} target="_blank" rel="noreferrer">블로그</a>}
              {item.office_phone && <span>공식 전화: {item.office_phone}</span>}
              <a className="underline hover:text-[#f7d899] focus:text-[#f7d899]" href={item.source_url} target="_blank" rel="noreferrer">출처({item.source_name})</a>
            </div>
            <p className="mt-1 text-xs text-[#a89b84]">최종 업데이트: {item.updated_at}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
