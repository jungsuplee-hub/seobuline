import type { SessionUser } from "@/lib/auth";

export function canManageContent(user: SessionUser | null | undefined) {
  return Boolean(user && (user.role === "admin" || user.role === "moderator" || user.role === "manager"));
}

export function canManageUserRoles(user: SessionUser | null | undefined) {
  return Boolean(user && user.role === "admin");
}
