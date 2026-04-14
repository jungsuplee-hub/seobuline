import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizeEmail } from "@/lib/auth-config";

const PROTECTED_ADMIN = normalizeEmail("4728740@hanmail.net");
const ALLOWED_ROLES = new Set(["user", "manager", "moderator", "admin"]);

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = db
    .prepare("SELECT id, email, nickname, role, region, created_at FROM users ORDER BY created_at DESC")
    .all();
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const id = Number(form.get("id") || 0);
  const role = String(form.get("role") || "").trim();

  if (!id || !ALLOWED_ROLES.has(role)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const target = db.prepare("SELECT id, email, role FROM users WHERE id = ?").get(id) as
    | { id: number; email: string; role: string }
    | undefined;
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (normalizeEmail(target.email) === PROTECTED_ADMIN && role !== "admin") {
    return NextResponse.json({ error: "Protected admin cannot be downgraded" }, { status: 400 });
  }

  db.prepare("UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(role, id);
  return NextResponse.redirect(new URL("/admin/users", req.url));
}
