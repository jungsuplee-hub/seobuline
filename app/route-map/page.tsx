import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { Card } from "@/components/ui/card";
import { getRouteMapImageUrl } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function RouteMapPage() {
  const imageUrl = getRouteMapImageUrl();
  const user = await getCurrentUser();
  const canManage = canManageContent(user);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        {canManage && <div className="flex justify-end"><Link href="/route-map/edit" className="rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">수정</Link></div>}
        <h1 className="text-2xl font-bold">서부선 예상노선도</h1>
        <p className="text-sm text-[#decfb8]">관리자가 등록한 최신 예상노선도입니다. 노선도 이미지는 수시로 업데이트될 수 있습니다.</p>
      </header>

      {!imageUrl ? (
        <Card>
          <p className="text-sm">등록된 예상노선도 이미지가 없습니다.</p>
        </Card>
      ) : (
        <section className="overflow-hidden rounded-xl border border-[#d0a453]/25 bg-[#0f1622] p-2 md:p-4">
          <a href={imageUrl} target="_blank" rel="noreferrer" className="block">
            <Image
              src={imageUrl}
              alt="서부선 예상노선도"
              width={2400}
              height={1600}
              className="mx-auto max-h-[70vh] h-auto w-auto max-w-full object-contain"
              priority
            />
          </a>
        </section>
      )}
    </div>
  );
}
