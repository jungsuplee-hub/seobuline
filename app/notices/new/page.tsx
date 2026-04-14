import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export default async function NewNoticePage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");

  return <div className="space-y-3"><h1 className="text-2xl font-bold">새 공지 등록</h1><form action="/api/notices" method="post" className="space-y-2"><input name="title" placeholder="제목" className="w-full" required /><textarea name="content" placeholder="내용" className="min-h-24 w-full" required /><AdminImageInput scope="notices" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></div>;
}
