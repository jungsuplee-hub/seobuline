import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { db } from "@/lib/db";

export default async function EditIntroducePage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  const row = db.prepare("SELECT about_content, image_url FROM site_content WHERE id = 1").get() as { about_content: string | null; image_url: string | null } | undefined;

  return <div className="space-y-3"><h1 className="text-2xl font-bold">소개 수정</h1><form action="/api/site-content" method="post" className="space-y-3"><textarea name="about_content" defaultValue={row?.about_content || ""} className="min-h-40 w-full" /><AdminImageInput scope="site" defaultUrl={row?.image_url || ""} /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">저장</button></form></div>;
}
