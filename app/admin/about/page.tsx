import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import AdminImageInput from "@/components/admin-image-input";

export default async function AdminAboutPage() {
  await requireAdmin("/admin/about");
  const row = db.prepare("SELECT about_content, image_url FROM site_content WHERE id = 1").get() as { about_content: string | null; image_url: string | null } | undefined;

  return <Card className="space-y-3"><h1 className="text-xl font-bold">서부선 소개 관리</h1><form action="/api/site-content" method="post" className="space-y-3"><textarea name="about_content" defaultValue={row?.about_content || ""} className="min-h-40 w-full" /><AdminImageInput scope="site" defaultUrl={row?.image_url || ""} /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">저장</button></form></Card>;
}
