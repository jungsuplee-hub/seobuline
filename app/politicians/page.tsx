import PoliticiansClient from "./politicians-client";
import { getPoliticianItems } from "@/lib/content-store";
import { getCurrentUser } from "@/lib/auth";
import { canManageContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function PoliticiansPage() {
  const [items, user] = await Promise.all([getPoliticianItems(), getCurrentUser()]);
  return <PoliticiansClient items={items} canManage={canManageContent(user)} />;
}
