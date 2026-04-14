import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import BoardEditor from "@/components/board-editor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/board/${id}/edit`);

  const post = db
    .prepare("SELECT * FROM posts WHERE id = ? AND is_deleted = 0")
    .get(id) as { id: number; title: string; content: string; region: string | null; category: string | null; image_urls: string | null; author_id: number } | undefined;

  if (!post) notFound();
  if (post.author_id !== user.id && user.role !== "admin" && user.role !== "moderator" && user.role !== "manager") redirect(`/board/${id}`);

  const imageUrls = post.image_urls ? (JSON.parse(post.image_urls) as string[]) : [];

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">게시글 수정</h1>
      <BoardEditor
        mode="edit"
        action={`/api/posts/${id}`}
        submitLabel="저장"
        defaultValue={{
          title: post.title,
          content: post.content,
          region: post.region ?? "",
          category: post.category || "자유게시판",
          imageUrls,
        }}
      />
      <form action={`/api/posts/${id}`} method="post" className="mt-3">
        <input type="hidden" name="_method" value="DELETE" />
        <button className="rounded-md border border-red-300/50 px-4 py-2 text-red-200">삭제</button>
      </form>
    </Card>
  );
}
