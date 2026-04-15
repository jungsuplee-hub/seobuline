export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import RenderRichContent from "@/components/render-rich-content";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;

  db.prepare("UPDATE posts SET view_count = view_count + 1 WHERE id = ? AND is_deleted = 0").run(id);

  const post = db
    .prepare(
      `SELECT p.id, p.title, p.content, p.image_urls, p.region, p.category, p.created_at, p.author_id, p.view_count, u.nickname, u.email
       FROM posts p
       JOIN users u ON u.id = p.author_id
       WHERE p.id = ? AND p.is_deleted = 0`,
    )
    .get(id) as
    | {
        id: number;
        title: string;
        content: string;
        image_urls: string | null;
        region: string | null;
        category: string | null;
        created_at: string;
        author_id: number;
        view_count: number;
        nickname: string | null;
        email: string;
      }
    | undefined;

  if (!post) notFound();

  const canManage = user?.id === post.author_id || user?.role === "admin" || user?.role === "moderator" || user?.role === "manager";
  const uploadedUrls = post.image_urls ? (JSON.parse(post.image_urls) as string[]) : [];
  const isImageUrl = (url: string) => /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i.test(url);
  const imageUrls = uploadedUrls.filter((url) => isImageUrl(url));
  const attachmentUrls = uploadedUrls.filter((url) => !isImageUrl(url));
  const fileNameFromUrl = (url: string) => {
    const clean = url.split("?")[0] || url;
    return clean.split("/").pop() || "첨부파일";
  };

  return (
    <Card className="space-y-3">
      <p className="text-xs text-[#a89b84]">{post.category || "자유게시판"}</p>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-xs text-[#a89b84]">
        {new Date(post.created_at).toLocaleString("ko-KR")} · 작성자: {post.nickname || post.email.split("@")[0]} · 지역: {post.region || "미입력"} · 조회수: {post.view_count}
      </p>
      {!!imageUrls.length && (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {imageUrls.map((url) => (
            <img key={url} src={url} alt="첨부 이미지" className="h-32 w-full rounded-md object-cover" />
          ))}
        </div>
      )}
      {!!attachmentUrls.length && (
        <div className="rounded-md border border-[#d0a453]/35 p-3">
          <p className="mb-2 text-xs font-semibold text-[#f7d899]">첨부파일</p>
          <ul className="space-y-1">
            {attachmentUrls.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer" className="text-sm text-[#d9cbad] underline decoration-[#d0a453]/50 hover:text-[#f7d899]">
                  {fileNameFromUrl(url)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <RenderRichContent content={post.content} />
      <div className="flex gap-2 pt-2">
        <Link href="/board" className="rounded-md border border-[#d0a453]/40 px-3 py-2 text-sm">목록</Link>
        {canManage && <Link href={`/board/${post.id}/edit`} className="rounded-md bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">수정/삭제</Link>}
      </div>
    </Card>
  );
}
