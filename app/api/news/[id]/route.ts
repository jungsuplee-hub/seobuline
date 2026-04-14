import { NextResponse } from "next/server";
import { getNews, saveNews } from "@/lib/news-store";
import { newsSchema } from "@/lib/validations";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = newsSchema.partial().safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const items = await getNews();
  const index = items.findIndex((item) => item.id === id);

  if (index < 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const updated = { ...items[index], ...parsed.data };
  const next = [...items];
  next[index] = updated;

  await saveNews(next);

  return NextResponse.json({ id, data: updated });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const items = await getNews();
  const next = items.filter((item) => item.id !== id);

  if (next.length === items.length) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await saveNews(next);

  return NextResponse.json({ deletedId: id });
}
