import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export default async function NewResourcePage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  return <div className="space-y-3"><h1 className="text-2xl font-bold">새 자료 등록</h1><form action="/api/resources" method="post" className="space-y-2"><input name="title" required className="w-full" /><input name="url" required className="w-full" /><input name="category" className="w-full" /><AdminImageInput scope="resources" name="thumbnail_url" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></div>;
}
