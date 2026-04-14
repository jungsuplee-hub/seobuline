import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getNews } from "@/lib/news-store";
import { newsSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

function createNewsId(sourceUrl: string) {
  return `manual-${createHash("sha1").update(sourceUrl).digest("hex").slice(0, 12)}`;
}

export async function GET() {
  const items = await getNews();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator" && user.role !== "manager")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const isJson = (req.headers.get("content-type") || "").includes("application/json");
  if (isJson) {
    const parsed = newsSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const newArticle = {
      ...parsed.data,
      id: createNewsId(parsed.data.source_url),
      is_featured: false,
      image_url: null,
    };
    db.prepare("INSERT OR REPLACE INTO news_articles (id, title, source_name, summary, source_url, category, image_url, published_date, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(newArticle.id, newArticle.title, newArticle.source_name, newArticle.summary, newArticle.source_url, newArticle.category, null, newArticle.published_date, 0);
    return NextResponse.json({ message: "created", data: newArticle }, { status: 201 });
  }

  const form = await req.formData();
  const sourceUrl = String(form.get("source_url") || "").trim() || `local-${Date.now()}`;
  const id = createNewsId(sourceUrl + String(Date.now()));
  db.prepare("INSERT INTO news_articles (id, title, source_name, summary, source_url, category, image_url, published_date, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)").run(
    id,
    String(form.get("title") || "").trim(),
    String(form.get("source_name") || "관리자"),
    String(form.get("summary") || "").trim(),
    sourceUrl,
    String(form.get("category") || "일반"),
    String(form.get("image_url") || "").trim() || null,
    String(form.get("published_date") || new Date().toISOString().slice(0, 10)),
  );

  return redirectWithForwardedHeaders(req, "/news");
}
