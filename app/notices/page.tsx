import Link from "next/link";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function NoticesPage() {
  const notices = db.prepare("SELECT id, title, created_at, image_url FROM notices ORDER BY created_at DESC").all() as Array<{ id: number; title: string; created_at: string; image_url: string | null }>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">공지사항</h1>
      {notices.map((n) => (
        <Card key={n.id}>
          {n.image_url && <img src={n.image_url} alt="공지 이미지" className="mb-2 h-40 w-full rounded object-cover" />}
          <Link className="font-semibold hover:text-primary" href={`/notices/${n.id}`}>
            {n.title}
          </Link>
          <p className="text-sm text-slate-500">{n.created_at}</p>
        </Card>
      ))}
    </div>
  );
}
