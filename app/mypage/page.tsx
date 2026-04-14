import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase";

export default async function MyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage");

  const supabase = await getSupabaseServerClient();
  const { data: myPosts } = await supabase
    .from("posts")
    .select("id,title,created_at")
    .eq("author_id", user.profileId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      <Card>
        <h2 className="font-semibold">내 프로필</h2>
        <p className="mt-1 text-sm">이메일: {user.email}</p>
        <form action="/api/profile" method="post" className="mt-3 grid gap-2 md:grid-cols-2">
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="email" value={user.email} />
          <input name="region" defaultValue={user.region ?? ""} placeholder="지역" required />
          <input name="nickname" defaultValue={user.nickname ?? ""} placeholder="닉네임" />
          <button className="rounded-md bg-[#d0a453] px-4 py-2 font-semibold text-[#1e1610]">프로필 저장</button>
        </form>
      </Card>
      <Card>
        <h2 className="font-semibold">내 게시글</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {(myPosts ?? []).map((post) => (
            <li key={post.id}>{new Date(post.created_at).toLocaleDateString("ko-KR")} · {post.title}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
