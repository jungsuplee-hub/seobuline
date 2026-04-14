"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";

type PoliticianItem = {
  id?: number;
  name: string;
  party: string;
  district: string;
  office_type: string;
  region_tags?: string[];
  summary: string;
  stance_or_relevance?: string;
  office_phone?: string | null;
  is_visible?: boolean;
  image_url?: string | null;
};

export default function PoliticiansClient({ items, canManage }: { items: PoliticianItem[]; canManage: boolean }) {
  const searchParams = useSearchParams();
  const [region, setRegion] = useState("all");
  const [office, setOffice] = useState("all");
  const [party, setParty] = useState("all");
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const visibleItems = useMemo(() => items.filter((item) => item.is_visible !== false), [items]);
  const regions = useMemo(() => ["all", ...new Set(visibleItems.flatMap((item) => item.region_tags || []))], [visibleItems]);
  const offices = useMemo(() => ["all", ...new Set(visibleItems.map((item) => item.office_type))], [visibleItems]);
  const parties = useMemo(() => ["all", ...new Set(visibleItems.map((item) => item.party))], [visibleItems]);

  const filtered = useMemo(() => visibleItems.filter((item) => {
    const byRegion = region === "all" || (item.region_tags || []).includes(region);
    const byOffice = office === "all" || item.office_type === office;
    const byParty = party === "all" || item.party === party;
    const byQuery = !query || [item.name, item.summary, item.stance_or_relevance, item.district, item.party].join(" ").toLowerCase().includes(query.toLowerCase());
    return byRegion && byOffice && byParty && byQuery;
  }), [visibleItems, region, office, party, query]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">정치인 정보공유</h1>{canManage && <Link href="/politicians/new" className="rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">새 정치인 정보 등록</Link>}</div>
      <div className="grid gap-2 md:grid-cols-4">{/* filters */}
        <select className="rounded-md border border-[#d0a453]/30 bg-[#0f1622] p-2" value={region} onChange={(e) => setRegion(e.target.value)}>{regions.map((value) => <option key={value} value={value}>{value === "all" ? "전체 지역" : value}</option>)}</select>
        <select className="rounded-md border border-[#d0a453]/30 bg-[#0f1622] p-2" value={office} onChange={(e) => setOffice(e.target.value)}>{offices.map((value) => <option key={value} value={value}>{value === "all" ? "전체 직책" : value}</option>)}</select>
        <select className="rounded-md border border-[#d0a453]/30 bg-[#0f1622] p-2" value={party} onChange={(e) => setParty(e.target.value)}>{parties.map((value) => <option key={value} value={value}>{value === "all" ? "전체 정당" : value}</option>)}</select>
        <input className="rounded-md border border-[#d0a453]/30 bg-[#0f1622] p-2" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름/지역/정당 검색" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">{filtered.map((item) => (
        <Card key={`${item.id || item.name}-${item.office_type}-${item.district}`}>
          <h2 className="font-semibold">{item.name} · {item.office_type}</h2>
          <p className="text-sm">{item.party} / {item.district}</p>
          {item.image_url && <img src={item.image_url} alt="정치인 이미지" className="mt-2 h-40 w-full rounded object-cover" />}
          <p className="mt-2 text-sm text-[#dfcfb5]">대표 전화: {item.office_phone?.trim() ? item.office_phone : "정보 없음"}</p>
          <p className="mt-2 text-sm">{item.summary}</p>
          {canManage && item.id ? <div className="mt-2 flex gap-2"><Link href={`/politicians/${item.id}/edit`} className="rounded border px-2 py-1 text-xs">수정</Link><form action={`/api/politicians/${item.id}`} method="post"><input type="hidden" name="_method" value="DELETE" /><button className="rounded border border-red-400/60 px-2 py-1 text-xs text-red-300">삭제</button></form></div> : null}
        </Card>
      ))}</div>
    </div>
  );
}
