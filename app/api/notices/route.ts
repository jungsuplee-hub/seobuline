import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

export async function GET(){
  const items = db.prepare("SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC").all();
  return NextResponse.json({entity:"notices",items});
}

export async function POST(req:Request){
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator" && user.role !== "manager")) return NextResponse.json({error:"Forbidden"},{status:403});
  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const content = String(form.get("content") || "").trim();
  const imageUrl = String(form.get("image_url") || "").trim() || null;
  if (!title || !content) return NextResponse.json({error:"제목/내용 필수"},{status:400});
  db.prepare("INSERT INTO notices (title, content, is_pinned, image_url) VALUES (?, ?, ?, ?)").run(title, content, form.get("is_pinned") ? 1 : 0, imageUrl);
  return redirectWithForwardedHeaders(req, "/notices");
}
