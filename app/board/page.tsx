export const dynamic = "force-dynamic";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function BoardPage() {
  const user = await getCurrentUser();
  const items = db
    .prepare(
      `SELECT p.id, p.title, p.content, p.image_urls, p.region, p.category, p.created_at, p.view_count, u.nickname, u.email
       FROM posts p
       JOIN users u ON u.id = p.author_id
       WHERE p.is_deleted = 0
       ORDER BY p.created_at DESC
       LIMIT 20`,
    )
    .all() as Array<{
    id: number;
    title: string;
    content: string;
    image_urls: string | null;
    region: string | null;
    category: string | null;
    created_at: string;
    nickname: string | null;
    email: string;
    view_count: number;
  }>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">게시판</h1>
          <p className="text-sm text-[#d8caaf]">비회원은 열람만, 회원은 글쓰기/본인 글 수정 가능</p>
        </div>
        {user ? <Button href="/board/new">글쓰기</Button> : <Button href="/login?next=/board/new">로그인 후 글쓰기</Button>}
      </div>

      {items.map((post) => (
        <Card key={post.id}>
          <div className="flex items-center justify-between gap-2">
            <Link href={`/board/${post.id}`} className="font-semibold hover:text-[#f7d899]">
              [{post.category || "자유게시판"}] {post.title}
            </Link>
            <p className="text-xs text-[#a89b84]">{new Date(post.created_at).toLocaleDateString("ko-KR")}</p>
          </div>
          {(() => { const images = post.image_urls ? (JSON.parse(post.image_urls) as string[]) : []; return images[0] ? <img src={images[0]} alt="썸네일" className="mt-2 h-28 w-full rounded object-cover" /> : null; })()}
          <p className="mt-2 line-clamp-2 text-sm text-[#ddd0b8]">{post.content}</p>
          <p className="mt-2 text-xs text-[#a89b84]">
            작성자: {post.nickname || post.email.split("@")[0]} · 지역: {post.region || "미입력"} · 조회수: {post.view_count}
          </p>
        </Card>
      ))}
    </div>
  );
}
