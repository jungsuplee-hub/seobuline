import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

export async function GET(){
  const items = db.prepare("SELECT * FROM timeline_items ORDER BY sort_order ASC, timeline_date DESC").all();
  return NextResponse.json({entity:"events",items});
}

export async function POST(req:Request){
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator" && user.role !== "manager")) return NextResponse.json({error:"Forbidden"},{status:403});
  const form = await req.formData();
  db.prepare("INSERT INTO timeline_items (title, description, timeline_date, status, source_name, source_url, sort_order, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
    String(form.get("title") || "").trim(),
    String(form.get("description") || "").trim(),
    String(form.get("timeline_date") || new Date().toISOString().slice(0,10)),
    String(form.get("status") || "진행"),
    String(form.get("source_name") || "").trim() || null,
    String(form.get("source_url") || "").trim() || null,
    Number(form.get("sort_order") || 0),
    String(form.get("image_url") || "").trim() || null,
  );
  return redirectWithForwardedHeaders(req, "/status");
}
