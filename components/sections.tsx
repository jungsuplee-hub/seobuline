import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPoliticianItems, getSiteContent, getTimelineItems } from "@/lib/content-store";
import { getNews } from "@/lib/news-store";
import { notices } from "@/lib/public-data";
import { db } from "@/lib/db";

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g9w5KIpi";
const NAVER_CAFE = "https://cafe.naver.com/seobuline1";

export async function HeroSection() {
  const { homeHero } = await getSiteContent();
  const heroTitleLines = homeHero.title.split("\n").filter(Boolean);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#d0a453]/25">
      <Image
        src={homeHero.image_url || "/assets/hero-campaign.svg"}
        alt="서부권 교통 캠페인 비주얼"
        width={1600}
        height={900}
        className="h-[460px] w-full object-cover"
        style={{ objectPosition: homeHero.image_position || "center center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090d14]/95 via-[#090d14]/75 to-[#090d14]/40" />
      <div className="absolute inset-0 p-8 md:p-12">
        <Badge>{homeHero.badge}</Badge>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
          {heroTitleLines.map((line, index) => (
            <span key={`${line}-${index}`}>
              {line}
              {index < heroTitleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-[#e8dcc9] md:text-base">
          {homeHero.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/route-map">예상노선도 보기</Button>
          <Button href="/board" variant="outline">
            게시판 보기
          </Button>
          <a href={KAKAO_OPEN_CHAT} target="_blank" rel="noreferrer">
            <Button variant="ghost">카카오톡 채팅방 참여 ↗</Button>
          </a>
          <a href={NAVER_CAFE} target="_blank" rel="noreferrer">
            <Button variant="ghost">네이버 카페 바로가기 ↗</Button>
          </a>
        </div>
      </div>
    </section>
  );
}

export async function HomeGrid({ userCount, homeViewCount }: { userCount: number; homeViewCount: number }) {
  const news = await getNews();

  const metricCards: Array<{ text: string; href: "/" | "/news" | "/notices" | "/route-map" | "/board" }> = [
    { text: `최신 뉴스 ${news.length}건`, href: "/news" },
    { text: `최근 공지 ${notices.length}건`, href: "/notices" },
    { text: `가입 회원 수 ${userCount}명`, href: "/board" },
    { text: `홈페이지 조회수 ${homeViewCount}회`, href: "/" },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((item) => (
        <Link key={item.text} href={item.href} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0a453]/70">
          <Card className="h-full transition hover:border-[#d0a453]/55 hover:bg-[#182233]">
            <p className="text-xs text-[#cab898]">핵심 지표</p>
            <p className="mt-1 text-xl font-semibold group-hover:text-[#f7d899]">{item.text}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function NeedSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="text-2xl font-semibold">왜 서부선이 필요한가</h2>
        <p className="mt-2 text-sm text-[#decfb8]">서울 서부권은 방사형 중심 철도망에서 상대적으로 소외되어, 업무지구 접근 시 환승과 우회 이동 부담이 큽니다.</p>
        <ul className="mt-4 space-y-3 text-sm">
          <li><strong>YBD</strong> 여의도권 접근 동선 단축 및 환승 선택지 확대</li>
          <li><strong>CBD</strong> 도심권(광화문·시청) 진입 시 환승 횟수 감소 기대</li>
          <li><strong>GBD</strong> 강남권 출퇴근 시 2·7·9호선 연계 효율 개선</li>
        </ul>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">연결성 시각 섹션</h2>
        <Image
          src="/assets/connectivity-panel.svg"
          alt="서부권 지역 연결성 설명 이미지"
          width={900}
          height={700}
          className="mt-3 h-auto w-full rounded-lg border border-[#d0a453]/20"
        />
        <ul className="mt-4 space-y-3 text-sm text-[#dfcfb5]">
          <li>• 이미지 중심으로 노선 필요성과 생활권 연결 구조를 설명합니다.</li>
          <li>• 장식 목적 그래프 대신, 환승·연결·생활권 정보를 우선 배치합니다.</li>
          <li>• 텍스트 가독성을 위해 오버레이/대비가 높은 스타일을 유지합니다.</li>
        </ul>
      </Card>
    </section>
  );
}

export async function HomeLists() {
  const news = await getNews();
  const timelineItems = await getTimelineItems();
  const politicianItems = await getPoliticianItems();
  const latestPosts = db.prepare("SELECT id, title FROM posts WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT 5").all() as Array<{ id: number; title: string }>;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="font-semibold">진행현황 요약</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {timelineItems.slice(0, 4).map((item) => (
            <li key={item.title}>
              <Link href="/status" className="block rounded px-1 py-1 hover:bg-[#1b2431] hover:text-[#f7d899] focus:bg-[#1b2431] focus:text-[#f7d899]">
                {item.status} · {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">최신 뉴스</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {news.slice(0, 5).map((n) => (
            <li key={n.id}>
              <Link href={`/news/${n.id}`} className="block rounded px-1 py-1 hover:bg-[#1b2431] hover:text-[#f7d899] focus:bg-[#1b2431] focus:text-[#f7d899]">
                {n.published_date} · {n.title}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">최근 공지</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {notices.slice(0, 3).map((n) => (
            <li key={n.id}>
              <Link href={`/notices/${n.id}`} className="block rounded px-1 py-1 hover:bg-[#1b2431] hover:text-[#f7d899] focus:bg-[#1b2431] focus:text-[#f7d899]">
                {n.title}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">게시판 최신글</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {latestPosts.map((p) => (
            <li key={p.id}>
              <Link href={`/board/${p.id}`} className="block rounded px-1 py-1 hover:bg-[#1b2431] hover:text-[#f7d899] focus:bg-[#1b2431] focus:text-[#f7d899]">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">정치인 정보 바로가기</h2>
          <Link href="/politicians" className="text-xs font-medium text-[#f7d899] hover:underline">전체 보기 →</Link>
        </div>
        <p className="mt-2 text-xs text-[#decfb8]">요청 반영 내용은 정치인 정보 페이지에서 바로 확인할 수 있습니다.</p>
        <ul className="mt-3 space-y-2 text-sm">
          {politicianItems.slice(0, 6).map((item) => (
            <li key={`${item.name}-${item.office_type}`}>
              <Link href={`/politicians?query=${encodeURIComponent(item.name)}`} className="block rounded px-1 py-2 hover:bg-[#1b2431] hover:text-[#f7d899] focus:bg-[#1b2431] focus:text-[#f7d899]">
                {item.name} · {item.office_type}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function CampaignBanner() {
  return (
    <Card className="border-[#d0a453]/40 bg-[linear-gradient(135deg,rgba(208,164,83,0.2),rgba(14,20,30,0.95))]">
      <p className="text-xl font-semibold">서부선 예상노선도와 소통 채널을 확인해 주세요.</p>
      <p className="mt-2 text-sm text-[#e7d9c1]">최신 예상노선도는 전용 페이지에서 확인하고, 소식 공유는 카카오톡 오픈채팅과 네이버 카페에서 이어가실 수 있습니다.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button href="/route-map" variant="outline">서부선 예상노선도 보기</Button>
        <a href={KAKAO_OPEN_CHAT} target="_blank" rel="noreferrer"><Button>오픈채팅방 바로가기 ↗</Button></a>
        <a href={NAVER_CAFE} target="_blank" rel="noreferrer"><Button variant="outline">네이버 카페 바로가기 ↗</Button></a>
      </div>
    </Card>
  );
}
