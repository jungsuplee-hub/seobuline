import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase";

export default async function BoardPage() {
  const user = await getCurrentUser();
  const supabase = await getSupabaseServerClient();
  const { data: items } = await supabase
    .from("posts")
    .select("id,title,content,region,created_at,author_id,is_hidden,is_deleted")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">게시판</h1>
          <p className="text-sm text-[#d8caaf]">비회원은 열람만, 회원은 글쓰기 가능</p>
        </div>
        {user ? <Button href="/board/new">글쓰기</Button> : <Button href="/login?next=/board/new">로그인 후 글쓰기</Button>}
      </div>

      {(items ?? []).map((post) => (
        <Card key={post.id}>
          <div className="flex items-center justify-between gap-2">
            <Link href={`/board/${post.id}/edit`} className="font-semibold hover:text-[#f7d899]">{post.title}</Link>
            <p className="text-xs text-[#a89b84]">{new Date(post.created_at).toLocaleDateString("ko-KR")}</p>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-[#ddd0b8]">{post.content}</p>
          <p className="mt-2 text-xs text-[#a89b84]">지역: {post.region || "미입력"}</p>
        </Card>
      ))}
    </div>
  );
}
