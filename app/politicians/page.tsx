import PoliticiansClient from "./politicians-client";
import { getPoliticianItems } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function PoliticiansPage() {
  const items = await getPoliticianItems();

  return <PoliticiansClient items={items} />;
}
