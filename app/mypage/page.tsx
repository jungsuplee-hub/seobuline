import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { REGIONS } from "@/lib/regions";

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage");
  const { error } = await searchParams;

  const myPosts = db
    .prepare("SELECT id, title, created_at FROM posts WHERE author_id = ? AND is_deleted = 0 ORDER BY created_at DESC")
    .all(user.id) as Array<{ id: number; title: string; created_at: string }>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      <Card>
        <h2 className="font-semibold">내 프로필</h2>
        <p className="mt-1 text-sm">이메일: {user.email}</p>
        <p className="mt-1 text-sm">권한(Role): {user.role}</p>
        <form action="/api/profile" method="post" className="mt-3 grid gap-2 md:grid-cols-2">
          <select name="region" defaultValue={user.region ?? ""} required>
            <option value="" disabled>
              지역을 선택하세요
            </option>
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input name="nickname" defaultValue={user.nickname ?? ""} placeholder="닉네임" />
          <button className="rounded-md bg-[#d0a453] px-4 py-2 font-semibold text-[#1e1610]">프로필 저장</button>
        </form>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      </Card>
      <Card>
        <h2 className="font-semibold">내 게시글</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {myPosts.map((post) => (
            <li key={post.id}>
              {new Date(post.created_at).toLocaleDateString("ko-KR")} · <Link className="underline" href={`/board/${post.id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
