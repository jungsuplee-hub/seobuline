import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getNews } from "@/lib/news-store";
import { notices, politicianItems, timelineItems } from "@/lib/public-data";
import { posts } from "@/lib/mock-data";

const KAKAO_OPEN_CHAT = "https://open.kakao.com/o/g9w5KIpi";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#d0a453]/25">
      <Image
        src="/assets/hero-campaign.svg"
        alt="서부권 교통 캠페인 비주얼"
        width={1600}
        height={900}
        className="h-[460px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#090d14]/95 via-[#090d14]/75 to-[#090d14]/40" />
      <div className="absolute inset-0 p-8 md:p-12">
        <Badge>공공 캠페인 아카이브</Badge>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
          서부선 정상화로,
          <br />
          서부권의 출퇴근과 생활권 연결을 되찾겠습니다.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-[#e8dcc9] md:text-base">
          서부선은 은평·서대문·마포·영등포·동작·관악을 잇는 핵심 연결축입니다. 공개 출처로
          확인된 사실만 정리해 주민 참여와 정책 감시를 돕습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/join">참여하기</Button>
          <Button href="/board" variant="outline">
            게시판 보기
          </Button>
          <a href={KAKAO_OPEN_CHAT} target="_blank" rel="noreferrer">
            <Button variant="ghost">카카오톡 채팅방 참여 ↗</Button>
          </a>
        </div>
      </div>
    </section>
  );
}

export async function HomeGrid() {
  const news = await getNews();

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {[
        `최신 뉴스 ${news.length}건`,
        `진행 타임라인 ${timelineItems.length}건`,
        `최근 공지 ${notices.length}건`,
        `정치인 아카이브 ${politicianItems.length}명`,
      ].map((text) => (
        <Card key={text}>
          <p className="text-xs text-[#cab898]">핵심 지표</p>
          <p className="mt-1 text-xl font-semibold">{text}</p>
        </Card>
      ))}
    </div>
  );
}

export function NeedSection() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="overflow-hidden p-0">
        <Image src="/assets/network-map.svg" alt="서부권 연결 시각화" width={1400} height={900} className="h-full w-full object-cover" />
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">왜 서부선이 필요한가</h2>
        <p className="mt-2 text-sm text-[#decfb8]">서울 서부권은 방사형 중심 철도망에서 상대적으로 소외되어, 업무지구 접근 시 환승과 우회 이동 부담이 큽니다.</p>
        <ul className="mt-4 space-y-3 text-sm">
          <li><strong>YBD</strong> 여의도권 접근 동선 단축 및 환승 선택지 확대</li>
          <li><strong>CBD</strong> 도심권(광화문·시청) 진입 시 환승 횟수 감소 기대</li>
          <li><strong>GBD</strong> 강남권 출퇴근 시 2·7·9호선 연계 효율 개선</li>
        </ul>
      </Card>
    </section>
  );
}

export async function HomeLists() {
  const news = await getNews();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><h2 className="font-semibold">진행현황 요약</h2><ul className="mt-3 space-y-2 text-sm">{timelineItems.slice(0,4).map((item)=><li key={item.title}>{item.status} · {item.title}</li>)}</ul></Card>
      <Card><h2 className="font-semibold">최신 뉴스</h2><ul className="mt-3 space-y-2 text-sm">{news.slice(0,5).map((n)=><li key={n.id}>{n.published_date} · {n.title}</li>)}</ul></Card>
      <Card><h2 className="font-semibold">최근 공지</h2><ul className="mt-3 space-y-2 text-sm">{notices.slice(0,3).map((n)=><li key={n.id}>{n.title}</li>)}</ul></Card>
      <Card><h2 className="font-semibold">게시판 최신글</h2><ul className="mt-3 space-y-2 text-sm">{posts.slice(0,5).map((p)=><li key={p.id}>{p.title}</li>)}</ul></Card>
    </div>
  );
}

export function CampaignBanner() {
  return (
    <Card className="border-[#d0a453]/40 bg-[linear-gradient(135deg,rgba(208,164,83,0.2),rgba(14,20,30,0.95))]">
      <p className="text-xl font-semibold">서부선 정상화 시민 네트워크에 참여해 주세요.</p>
      <p className="mt-2 text-sm text-[#e7d9c1]">정책 변동, 공청회, 공지사항을 빠르게 공유합니다.</p>
      <div className="mt-4">
        <a href={KAKAO_OPEN_CHAT} target="_blank" rel="noreferrer"><Button>오픈채팅방 바로가기 ↗</Button></a>
      </div>
    </Card>
  );
}
