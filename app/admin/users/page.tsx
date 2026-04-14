import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { normalizeEmail } from "@/lib/auth-config";

const ROLES = ["user", "manager", "moderator", "admin"] as const;
const PROTECTED_ADMIN = normalizeEmail("4728740@hanmail.net");

export default async function AdminUsersPage() {
  await requireAdmin("/admin/users");
  const users = db
    .prepare("SELECT id, email, nickname, role, region, created_at FROM users ORDER BY created_at DESC")
    .all() as Array<{ id: number; email: string; nickname: string | null; role: string; region: string; created_at: string }>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">사용자 등급/권한 관리</h1>
      <div className="overflow-x-auto rounded-lg border border-[#d0a453]/25">
        <table className="w-full text-sm">
          <thead className="bg-[#121721] text-left">
            <tr>
              <th className="p-2">이메일</th>
              <th className="p-2">닉네임</th>
              <th className="p-2">지역</th>
              <th className="p-2">현재 role</th>
              <th className="p-2">변경</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => {
              const isProtected = normalizeEmail(item.email) === PROTECTED_ADMIN;
              return (
                <tr key={item.id} className="border-t border-[#d0a453]/15">
                  <td className="p-2">{item.email}</td>
                  <td className="p-2">{item.nickname || "-"}</td>
                  <td className="p-2">{item.region}</td>
                  <td className="p-2">{item.role}</td>
                  <td className="p-2">
                    <form action="/api/admin/users" method="post" className="flex items-center gap-2">
                      <input type="hidden" name="id" value={item.id} />
                      <select name="role" defaultValue={item.role} className="rounded border border-[#d0a453]/40 bg-[#0f1622] p-1" disabled={isProtected}>
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <button disabled={isProtected} className="rounded border border-[#d0a453]/40 px-2 py-1 disabled:opacity-60">
                        저장
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
