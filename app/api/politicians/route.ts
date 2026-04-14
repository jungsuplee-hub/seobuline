import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

export async function GET(){
  const items = db.prepare("SELECT * FROM politicians ORDER BY id DESC").all();
  return NextResponse.json({entity:"politicians",items});
}

export async function POST(req:Request){
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator" && user.role !== "manager")) return NextResponse.json({error:"Forbidden"},{status:403});
  const form = await req.formData();
  const isVisible = String(form.get("is_visible") || "") === "1" ? 1 : 0;
  db.prepare(`INSERT INTO politicians (
    name, party, district, office_type, region_tags, summary, stance_or_relevance, election_2026_status,
    source_name, source_url, official_website, x_url, blog_url, office_phone, image_url, is_visible
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ).run(
    String(form.get("name") || "").trim(),
    String(form.get("party") || "").trim(),
    String(form.get("district") || "").trim(),
    String(form.get("office_type") || "").trim(),
    String(form.get("region_tags") || "").trim(),
    String(form.get("summary") || "").trim(),
    String(form.get("stance_or_relevance") || "").trim(),
    String(form.get("election_2026_status") || "").trim(),
    String(form.get("source_name") || "").trim() || null,
    String(form.get("source_url") || "").trim() || null,
    String(form.get("official_website") || "").trim() || null,
    String(form.get("x_url") || "").trim() || null,
    String(form.get("blog_url") || "").trim() || null,
    String(form.get("office_phone") || "").trim() || null,
    String(form.get("image_url") || "").trim() || null,
    isVisible,
  );
  return redirectWithForwardedHeaders(req, "/politicians");
}
