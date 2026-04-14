import { redirect } from "next/navigation";
import AdminImageInput from "@/components/admin-image-input";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export default async function NewPoliticianPage() {
  const user = await getCurrentUser();
  if (!canManageContent(user)) redirect("/unauthorized");
  return <div className="space-y-3"><h1 className="text-2xl font-bold">새 정치인 정보 등록</h1><form action="/api/politicians" method="post" className="space-y-2"><input name="name" required placeholder="이름" className="w-full" /><input name="party" placeholder="정당" className="w-full" /><input name="district" placeholder="지역" className="w-full" /><input name="office_type" placeholder="직책" className="w-full" /><input name="source_url" placeholder="출처 URL" className="w-full" /><textarea name="summary" required className="min-h-24 w-full" /><AdminImageInput scope="politicians" /><button className="rounded bg-[#d0a453] px-3 py-2 font-semibold text-[#1e1610]">등록</button></form></div>;
}
