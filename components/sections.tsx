import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getNews } from "@/lib/news-store";
import { notices, posts, timeline } from "@/lib/mock-data";

export function HeroSection() {
  return (
    <section className="rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white">
      <Badge className="bg-white/20 text-white">서부선 정상화 캠페인</Badge>
      <h1 className="mt-3 text-3xl font-bold">서부선 추진위원회</h1>
      <p className="mt-2 max-w-2xl text-sm text-blue-100">
        주민과 함께 서부선 관련 정보를 체계적으로 정리하고 추진 상황을 투명하게 공유합니다.
      </p>
      <div className="mt-5 flex gap-3">
        <Button href="/join">참여하기</Button>
        <Button href="/news" className="bg-white text-blue-900 hover:bg-blue-100">
          뉴스 보기
        </Button>
      </div>
    </section>
  );
}

export async function HomeGrid() {
  const news = await getNews();

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {[`등록 뉴스 ${news.length}건`, `공지 ${notices.length}건`, `일정 3건`, `참여 회원 128명`].map((t) => (
        <Card key={t}>
          <p className="text-sm text-slate-500">핵심 현황</p>
          <p className="mt-1 text-xl font-semibold">{t}</p>
        </Card>
      ))}
    </div>
  );
}

export async function HomeLists() {
  const news = await getNews();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="font-semibold">최근 공지 3건</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {notices.slice(0, 3).map((n) => (
            <li key={n.id}>{n.title}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">최신 뉴스 5건</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {news.slice(0, 5).map((n) => (
            <li key={n.id}>{n.title}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">진행현황 요약</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {timeline.slice(0, 4).map((t) => (
            <li key={t.id}>
              {t.status} · {t.title}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">게시판 최신글 5건</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {posts.map((p) => (
            <li key={p.id}>{p.title}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
