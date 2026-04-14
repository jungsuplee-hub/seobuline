import type { Metadata } from "next";
import { getNewsById } from "@/lib/news-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getNewsById(id);

  return {
    title: article?.title ?? "뉴스 상세",
    description: article?.summary,
    openGraph: {
      title: article?.title,
      description: article?.summary,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNewsById(id);

  if (!article) {
    return <div>존재하지 않는 기사입니다.</div>;
  }

  return (
    <article className="space-y-3">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p className="text-sm">
        {article.source_name} · {article.published_date}
      </p>
      {article.image_url && <img src={article.image_url} alt="뉴스 이미지" className="w-full rounded-lg object-cover" />}
      <p>{article.summary}</p>
      <a href={article.source_url} target="_blank" className="text-primary underline">
        원문 보기
      </a>
    </article>
  );
}
