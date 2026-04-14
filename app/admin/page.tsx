import Link from "next/link";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
  await requireAdmin("/admin");

  const links = [
    ["소개 관리", "/admin/about"],
    ["예상노선도 관리", "/admin/route-map"],
    ["진행현황 관리", "/admin/timeline"],
    ["뉴스 관리", "/admin/news"],
    ["공지 관리", "/admin/notices"],
    ["게시판 관리", "/admin/posts"],
    ["정치인정보 관리", "/admin/politicians"],
    ["자료실 관리", "/admin/resources"],
  ] as const;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">운영 관리자</h1>
      {links.map(([label, href]) => (
        <Card key={href}>
          <Link href={href} className="font-semibold underline">{label}</Link>
        </Card>
      ))}
    </div>
  );
}
