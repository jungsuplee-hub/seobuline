import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";

export type Role = "user" | "moderator" | "admin";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  region: string | null;
  nickname: string | null;
  profileId: string | null;
};

export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, region, nickname")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email,
    role: (profile?.role as Role | undefined) ?? "user",
    region: profile?.region ?? null,
    nickname: profile?.nickname ?? null,
    profileId: profile?.id ?? null,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/mypage")}`);
  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) redirect("/unauthorized");
  return user;
}

export async function requireModeratorOrAdmin() {
  return requireRole(["moderator", "admin"]);
}
