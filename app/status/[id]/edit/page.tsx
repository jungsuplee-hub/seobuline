import { redirect } from "next/navigation";
export default async function EditStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/timeline/${id}/edit`);
}
