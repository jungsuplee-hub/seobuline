import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import BoardEditor from "@/components/board-editor";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/board/new");
  const { error } = await searchParams;

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">게시글 작성</h1>
      <BoardEditor
        mode="new"
        action="/api/posts"
        submitLabel="등록"
        defaultValue={{
          region: user.region ?? "",
          category: "자유게시판",
        }}
      />
      {error && <p className="text-sm text-red-300">{error}</p>}
    </Card>
  );
}
