import Link from "next/link";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AdminPage() {
  const user = await requireAdmin("/admin");

  const summary = db
    .prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role")
    .all() as Array<{ role: string; count: number }>;

  const totalUsers = summary.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">권한 관리 관리자</h1>
      <Card className="space-y-2">
        <p className="text-sm text-[#d6c5aa]">로그인 계정: {user.email}</p>
        <p className="text-sm text-[#d6c5aa]">내 권한: {user.role}</p>
        <p className="text-sm text-[#d6c5aa]">전체 사용자 수: {totalUsers}</p>
        <div className="text-sm text-[#d6c5aa]">
          <p className="font-semibold">권한 분포</p>
          <ul className="list-disc pl-5">
            {summary.map((item) => (
              <li key={item.role}>
                {item.role}: {item.count}명
              </li>
            ))}
          </ul>
        </div>
      </Card>
      <Card>
        <Link href="/admin/users" className="font-semibold underline">
          사용자 권한 관리로 이동
        </Link>
      </Card>
    </div>
  );
}
