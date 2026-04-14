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
  db.prepare("INSERT INTO politicians (name, party, district, office_type, summary, image_url, source_url) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    String(form.get("name") || "").trim(),
    String(form.get("party") || "").trim(),
    String(form.get("district") || "").trim(),
    String(form.get("office_type") || "").trim(),
    String(form.get("summary") || "").trim(),
    String(form.get("image_url") || "").trim() || null,
    String(form.get("source_url") || "").trim() || null,
  );
  return redirectWithForwardedHeaders(req, "/politicians");
}
