"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { politicianItems } from "@/lib/public-data";

export default function PoliticiansPage() {
  const [region, setRegion] = useState("all");
  const [office, setOffice] = useState("all");
  const [party, setParty] = useState("all");
  const [query, setQuery] = useState("");

  const regions = useMemo(() => ["all", ...new Set(politicianItems.flatMap((item) => item.region_tags))], []);
  const offices = useMemo(() => ["all", ...new Set(politicianItems.map((item) => item.office_type))], []);
  const parties = useMemo(() => ["all", ...new Set(politicianItems.map((item) => item.party))], []);

  const filtered = useMemo(
    () =>
      politicianItems.filter((item) => {
        const byRegion = region === "all" || item.region_tags.includes(region);
        const byOffice = office === "all" || item.office_type === office;
        const byParty = party === "all" || item.party === party;
        const byQuery = !query || [item.name, item.summary, item.stance_or_relevance].join(" ").toLowerCase().includes(query.toLowerCase());
        return byRegion && byOffice && byParty && byQuery;
      }),
    [region, office, party, query],
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">정치인 정보공유</h1>
      <div className="rounded-md border-l-4 border-[#d0a453] bg-[#121721] p-3 text-sm">공개 출처 기반 정보 아카이브: 확인 가능한 공식 페이지·보도만 반영합니다.</div>
      <div className="grid gap-2 md:grid-cols-4">
        <select value={region} onChange={(e) => setRegion(e.target.value)}>{regions.map((value) => <option key={value} value={value}>{value === "all" ? "전체 지역" : value}</option>)}</select>
        <select value={office} onChange={(e) => setOffice(e.target.value)}>{offices.map((value) => <option key={value} value={value}>{value === "all" ? "전체 직책" : value}</option>)}</select>
        <select value={party} onChange={(e) => setParty(e.target.value)}>{parties.map((value) => <option key={value} value={value}>{value === "all" ? "전체 정당" : value}</option>)}</select>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름/요약 검색" />
      </div>
      {filtered.map((item) => (
        <Card key={`${item.name}-${item.office_type}`}>
          <h2 className="font-semibold">{item.name} · {item.office_type}</h2>
          <p className="text-sm">{item.party} / {item.district}</p>
          <p className="mt-2 text-sm">{item.summary}</p>
          <p className="mt-1 text-sm text-[#dfcfb5]">관련성: {item.stance_or_relevance}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {item.official_website && <a className="underline" href={item.official_website} target="_blank" rel="noreferrer">공식 링크</a>}
            {item.x_url && <a className="underline" href={item.x_url} target="_blank" rel="noreferrer">X</a>}
            {item.blog_url && <a className="underline" href={item.blog_url} target="_blank" rel="noreferrer">블로그</a>}
            {item.office_phone && <span>대표번호: {item.office_phone}</span>}
            <a className="underline" href={item.source_url} target="_blank" rel="noreferrer">출처({item.source_name})</a>
          </div>
          <p className="mt-1 text-xs text-[#a89b84]">최종 업데이트: {item.updated_at}</p>
        </Card>
      ))}
    </div>
  );
}
