import Link from "next/link";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminPostsPage() {
  await requireAdmin("/admin/posts");
  const posts = db.prepare("SELECT id, title, created_at, image_urls FROM posts WHERE is_deleted = 0 ORDER BY created_at DESC LIMIT 50").all() as Array<{id:number;title:string;created_at:string;image_urls:string|null}>;

  return <div className="space-y-3"><h1 className="text-xl font-bold">게시판 관리</h1>{posts.map((post)=>{const images = post.image_urls ? JSON.parse(post.image_urls) as string[] : []; return <Card key={post.id}><Link href={`/board/${post.id}`} className="font-semibold underline">{post.title}</Link><p className="text-xs text-slate-400">{post.created_at}</p>{images[0] && <img src={images[0]} alt="게시글 이미지" className="mt-2 h-32 w-full rounded object-cover" />}</Card>;})}</div>;
}
