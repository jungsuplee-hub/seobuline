import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getNews, saveNews } from "@/lib/news-store";
import { newsSchema } from "@/lib/validations";

function createNewsId(sourceUrl: string) {
  return `manual-${createHash("sha1").update(sourceUrl).digest("hex").slice(0, 12)}`;
}

export async function GET() {
  const items = await getNews();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const parsed = newsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const newArticle = {
    ...parsed.data,
    id: createNewsId(parsed.data.source_url),
    is_featured: false,
  };

  const items = await getNews();
  await saveNews([newArticle, ...items]);

  return NextResponse.json({ message: "created", data: newArticle }, { status: 201 });
}
