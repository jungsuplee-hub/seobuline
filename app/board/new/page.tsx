import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/board/new");

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">게시글 작성</h1>
      <form action="/api/posts" method="post" className="mt-4 space-y-3">
        <select name="category" defaultValue="자유게시판" required>
          <option value="자유게시판">자유게시판</option>
          <option value="지역제보">지역제보</option>
          <option value="질문답변">질문답변</option>
        </select>
        <input name="title" placeholder="제목" required />
        <input name="region" placeholder="지역(선택)" defaultValue={user.region ?? ""} />
        <textarea name="content" placeholder="내용" className="min-h-48 w-full" required />
        <button className="rounded-md bg-[#d0a453] px-4 py-2 font-semibold text-[#1e1610]">등록</button>
      </form>
    </Card>
  );
}
