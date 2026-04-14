import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function ResourcesPage() {
  const resources = db.prepare("SELECT * FROM resources ORDER BY created_at DESC").all() as Array<{ id: number; title: string; url: string; category: string | null; thumbnail_url: string | null; created_at: string }>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">자료실</h1>
      {resources.map((resource) => (
        <Card key={resource.id}>
          {resource.thumbnail_url && <img src={resource.thumbnail_url} alt="자료 썸네일" className="mb-2 h-40 w-full rounded object-cover" />}
          <h2 className="font-semibold">{resource.title}</h2>
          <p className="text-sm text-slate-500">
            {resource.category || "기타"} · {resource.created_at}
          </p>
          <a className="mt-2 inline-block text-sm text-primary underline" href={resource.url} target="_blank" rel="noreferrer">
            자료 보기
          </a>
        </Card>
      ))}
    </div>
  );
}
