export const dynamic = "force-dynamic";

import { CampaignBanner, HeroSection, HomeGrid, HomeLists, NeedSection } from "@/components/sections";
import { getHomeViewCount, getUserCount, incrementHomeViewCount } from "@/lib/stats";

export default function HomePage() {
  incrementHomeViewCount();
  const userCount = getUserCount();
  const homeViewCount = getHomeViewCount();

  return (
    <div className="space-y-6">
      <HeroSection />
      <NeedSection />
      <HomeGrid userCount={userCount} homeViewCount={homeViewCount} />
      <HomeLists />
      <CampaignBanner />
    </div>
  );
}
