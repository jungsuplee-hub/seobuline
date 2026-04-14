import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/board/${id}/edit`);

  const post = db
    .prepare("SELECT * FROM posts WHERE id = ? AND is_deleted = 0")
    .get(id) as { id: number; title: string; content: string; region: string | null; category: string | null; author_id: number } | undefined;

  if (!post) notFound();
  if (post.author_id !== user.id) redirect(`/board/${id}`);

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">게시글 수정</h1>
      <form action={`/api/posts/${id}`} method="post" className="mt-4 space-y-3">
        <input type="hidden" name="_method" value="PATCH" />
        <select name="category" defaultValue={post.category || "자유게시판"} required>
          <option value="자유게시판">자유게시판</option>
          <option value="지역제보">지역제보</option>
          <option value="질문답변">질문답변</option>
        </select>
        <input name="title" defaultValue={post.title} required />
        <input name="region" defaultValue={post.region ?? ""} />
        <textarea name="content" defaultValue={post.content} className="min-h-48 w-full" required />
        <div className="flex gap-2">
          <button className="rounded-md bg-[#d0a453] px-4 py-2 font-semibold text-[#1e1610]">저장</button>
        </div>
      </form>
      <form action={`/api/posts/${id}`} method="post" className="mt-3">
        <input type="hidden" name="_method" value="DELETE" />
        <button className="rounded-md border border-red-300/50 px-4 py-2 text-red-200">삭제</button>
      </form>
    </Card>
  );
}
