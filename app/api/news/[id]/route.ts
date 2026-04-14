import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

async function checkAdmin() {
  const user = await getCurrentUser();
  return Boolean(user && (user.role === "admin" || user.role === "moderator"));
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  if (!(await checkAdmin())) return NextResponse.json({error:"Forbidden"},{status:403});
  const {id}=await params;
  const form = await req.formData();
  db.prepare("UPDATE news_articles SET title=?, source_name=?, summary=?, source_url=?, category=?, image_url=?, published_date=? WHERE id = ?").run(
    String(form.get("title") || "").trim(),
    String(form.get("source_name") || "").trim(),
    String(form.get("summary") || "").trim(),
    String(form.get("source_url") || "").trim(),
    String(form.get("category") || "").trim(),
    String(form.get("image_url") || "").trim() || null,
    String(form.get("published_date") || "").trim(),
    id,
  );
  return redirectWithForwardedHeaders(req, "/admin/news");
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
  if (!(await checkAdmin())) return NextResponse.json({error:"Forbidden"},{status:403});
  const {id}=await params;
  db.prepare("DELETE FROM news_articles WHERE id = ?").run(id);
  return redirectWithForwardedHeaders(req, "/admin/news");
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const form = Object.fromEntries((await req.formData()).entries());
  const method = String(form._method || "PATCH").toUpperCase();
  if (method === "DELETE") return DELETE(req, { params });
  return PATCH(req, { params });
}
