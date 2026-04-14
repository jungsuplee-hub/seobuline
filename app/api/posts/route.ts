import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("id,title,content,created_at,region,is_hidden,is_deleted")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });
  return NextResponse.json({ entity: "posts", items: data ?? [] });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const contentType = req.headers.get("content-type") || "";
  const payload = contentType.includes("form") ? Object.fromEntries((await req.formData()).entries()) : await req.json();

  const supabase = await getSupabaseServerClient();
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", user.id).maybeSingle();
  if (!profile?.id) return NextResponse.json({ error: "프로필을 찾을 수 없습니다." }, { status: 400 });

  const { error } = await supabase.from("posts").insert({
    author_id: profile.id,
    title: String(payload.title || ""),
    content: String(payload.content || ""),
    region: payload.region ? String(payload.region) : null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.redirect(new URL("/board", req.url), { status: 303 });
}
