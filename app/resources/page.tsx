import { Card } from "@/components/ui/card";
import { resourceItems } from "@/lib/public-data";

export default function ResourcesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">자료실</h1>
      {resourceItems.map((resource) => (
        <Card key={resource.title}>
          <h2 className="font-semibold">{resource.title}</h2>
          <p className="mt-1 text-sm">{resource.description}</p>
          <p className="text-sm text-slate-500">
            {resource.category} · {resource.file_type} · 공개일 {resource.published_date}
          </p>
          <a
            className="mt-2 inline-block text-sm text-primary underline"
            href={resource.file_url || resource.source_url}
            target="_blank"
            rel="noreferrer"
          >
            자료 보기
          </a>
        </Card>
      ))}
    </div>
  );
}
