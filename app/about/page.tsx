import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export default async function AboutPage() {
  const [user, row] = await Promise.all([
    getCurrentUser(),
    Promise.resolve(db.prepare("SELECT about_content, image_url FROM site_content WHERE id = 1").get() as { about_content: string | null; image_url: string | null } | undefined),
  ]);
  const canManage = canManageContent(user);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">추진위원회 소개</h1>
        {canManage && <Link href="/introduce/edit" className="rounded border px-2 py-1 text-xs">수정</Link>}
      </div>
      {row?.image_url && <img src={row.image_url} alt="소개 이미지" className="w-full rounded-lg object-cover" />}
      <p className="whitespace-pre-wrap">{row?.about_content || "소개 내용이 아직 등록되지 않았습니다."}</p>
    </div>
  );
}
