export const dynamic = "force-dynamic";

import Link from "next/link";
import { CampaignBanner, HeroSection, HomeGrid, HomeLists, NeedSection } from "@/components/sections";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";
import { getHomeViewCount, getUserCount, incrementHomeViewCount } from "@/lib/stats";

export default async function HomePage() {
  incrementHomeViewCount();
  const [user, userCount, homeViewCount] = await Promise.all([
    getCurrentUser(),
    Promise.resolve(getUserCount()),
    Promise.resolve(getHomeViewCount()),
  ]);
  const canManage = canManageContent(user);

  return (
    <div className="space-y-6">
      {canManage && (
        <div className="flex justify-end">
          <Link href="/main/edit" className="rounded bg-[#d0a453] px-3 py-2 text-sm font-semibold text-[#1e1610]">메인 수정</Link>
        </div>
      )}
      <HeroSection />
      <NeedSection />
      <HomeGrid userCount={userCount} homeViewCount={homeViewCount} />
      <HomeLists />
      <CampaignBanner />
    </div>
  );
}
