import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

async function checkAdmin() {
  const user = await getCurrentUser();
  return Boolean(user && (user.role === "admin" || user.role === "moderator" || user.role === "manager"));
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
  if (!(await checkAdmin())) return NextResponse.json({error:"Forbidden"},{status:403});
  const {id}=await params;
  const form = await req.formData();
  db.prepare("UPDATE notices SET title = ?, content = ?, is_pinned = ?, image_url = ? WHERE id = ?").run(
    String(form.get("title") || "").trim(),
    String(form.get("content") || "").trim(),
    form.get("is_pinned") ? 1 : 0,
    String(form.get("image_url") || "").trim() || null,
    id,
  );
  return redirectWithForwardedHeaders(req, "/notices");
}
export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
  if (!(await checkAdmin())) return NextResponse.json({error:"Forbidden"},{status:403});
  const {id}=await params;
  db.prepare("DELETE FROM notices WHERE id = ?").run(id);
  return redirectWithForwardedHeaders(req, "/notices");
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const form = Object.fromEntries((await req.formData()).entries());
  const method = String(form._method || "PATCH").toUpperCase();
  if (method === "DELETE") return DELETE(req, { params });
  return PATCH(req, { params });
}
