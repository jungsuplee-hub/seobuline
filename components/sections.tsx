import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getNews } from "@/lib/news-store";
import { notices, timelineItems, faqItems } from "@/lib/public-data";
import { posts } from "@/lib/mock-data";

export function HeroSection() {
  return (
    <section className="rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white">
      <Badge className="bg-white/20 text-white">서부선 공개자료 기반 아카이브</Badge>
      <h1 className="mt-3 text-3xl font-bold">서부선 추진위원회</h1>
      <p className="mt-2 max-w-2xl text-sm text-blue-100">
        공식 보도자료·언론보도·의회 공개문서를 기준으로 서부선 추진 현황을 정리합니다.
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
      {[
        `등록 뉴스 ${news.length}건`,
        `최근 공지 ${notices.length}건`,
        `타임라인 ${timelineItems.length}건`,
        `FAQ ${faqItems.length}건`,
      ].map((text) => (
        <Card key={text}>
          <p className="text-sm text-slate-500">핵심 현황</p>
          <p className="mt-1 text-xl font-semibold">{text}</p>
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
          {notices.slice(0, 3).map((notice) => (
            <li key={notice.id}>{notice.title}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">최신 뉴스 5건</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {news.slice(0, 5).map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">진행현황 요약</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {timelineItems.slice(0, 4).map((item) => (
            <li key={`${item.timeline_date}-${item.title}`}>
              {item.status} · {item.title}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">FAQ 미리보기</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {faqItems.slice(0, 4).map((item) => (
            <li key={item.question}>{item.question}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-semibold">게시판 최신글 5건</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
