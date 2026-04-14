import { HeroSection, HomeGrid, HomeLists } from "@/components/sections";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HeroSection />
      <div className="rounded-lg border-l-4 border-primary bg-mutedBg p-4 text-sm">
        최신 반영: 2026년 4월 1일 서울시의 서부선 우선협상대상자 지위 취소 절차 착수 발표 내용을 기준으로 데이터를 업데이트했습니다.
      </div>
      <HomeGrid />
      <HomeLists />
    </div>
  );
}
