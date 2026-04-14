import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  const post = db
    .prepare(
      `SELECT p.id, p.title, p.content, p.region, p.category, p.created_at, p.author_id, u.nickname, u.email
       FROM posts p
       JOIN users u ON u.id = p.author_id
       WHERE p.id = ? AND p.is_deleted = 0`,
    )
    .get(id) as
    | {
        id: number;
        title: string;
        content: string;
        region: string | null;
        category: string | null;
        created_at: string;
        author_id: number;
        nickname: string | null;
        email: string;
      }
    | undefined;

  if (!post) notFound();

  const canManage = user?.id === post.author_id;

  return (
    <Card className="space-y-3">
      <p className="text-xs text-[#a89b84]">{post.category || "자유게시판"}</p>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-xs text-[#a89b84]">
        {new Date(post.created_at).toLocaleString("ko-KR")} · 작성자: {post.nickname || post.email.split("@")[0]} · 지역: {post.region || "미입력"}
      </p>
      <p className="whitespace-pre-wrap text-sm leading-7">{post.content}</p>
      <div className="flex gap-2 pt-2">
        <Link href="/board" className="rounded-md border border-[#d0a453]/40 px-3 py-2 text-sm">목록</Link>
        {canManage && <Link href={`/board/${post.id}/edit`} className="rounded-md bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">수정/삭제</Link>}
      </div>
    </Card>
  );
}
