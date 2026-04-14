import type { Metadata } from "next";
import { notices } from "@/lib/public-data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const n = notices.find((x) => x.id === id);
  return { title: n?.title ?? "공지 상세", description: n?.content, openGraph: { title: n?.title, description: n?.content } };
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = notices.find((x) => x.id === id);
  if (!n) return <div>존재하지 않는 공지입니다.</div>;

  return (
    <article className="space-y-3">
      <h1 className="text-2xl font-bold">{n.title}</h1>
      <p className="text-sm text-slate-500">{n.created_at}</p>
      <p>{n.content}</p>
      <p className="text-sm">
        출처: {n.source_name} · <a className="underline" href={n.source_url} target="_blank" rel="noreferrer">원문</a>
      </p>
    </article>
  );
}
