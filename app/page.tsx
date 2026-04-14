import { CampaignBanner, HeroSection, HomeGrid, HomeLists, NeedSection } from "@/components/sections";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <HeroSection />
      <NeedSection />
      <HomeGrid />
      <HomeLists />
      <CampaignBanner />
    </div>
  );
}
