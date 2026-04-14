import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase";

async function canManage(postId: string, userId: string, role: string) {
  if (role === "admin" || role === "moderator") return true;
  const supabase = await getSupabaseServerClient();
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", userId).maybeSingle();
  const { data: post } = await supabase.from("posts").select("author_id").eq("id", postId).maybeSingle();
  return Boolean(profile?.id && post?.author_id === profile.id);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!(await canManage(id, user.id, user.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const contentType = req.headers.get("content-type") || "";
  const payload = contentType.includes("form") ? Object.fromEntries((await req.formData()).entries()) : await req.json();
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("posts").update({ title: payload.title, content: payload.content, region: payload.region || null }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.redirect(new URL("/board", req.url), { status: 303 });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!(await canManage(id, user.id, user.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await getSupabaseServerClient();
  const patch = user.role === "admin" || user.role === "moderator" ? { is_hidden: true } : { is_deleted: true };
  const { error } = await supabase.from("posts").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.redirect(new URL("/board", req.url), { status: 303 });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const form = Object.fromEntries((await req.formData()).entries());
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!(await canManage(id, user.id, user.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await getSupabaseServerClient();
  if (form._method === "DELETE") {
    const patch = user.role === "admin" || user.role === "moderator" ? { is_hidden: true } : { is_deleted: true };
    await supabase.from("posts").update(patch).eq("id", id);
  } else {
    await supabase.from("posts").update({ title: form.title, content: form.content, region: form.region || null }).eq("id", id);
  }

  return NextResponse.redirect(new URL("/board", req.url), { status: 303 });
}
