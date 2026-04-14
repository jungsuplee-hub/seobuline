import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirectWithForwardedHeaders } from "@/lib/request";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "moderator" && user.role !== "manager")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await req.formData();
  const section = String(form.get("section") || "introduce").trim();
  const toLines = (value: FormDataEntryValue | null) =>
    String(value || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  db.prepare("INSERT INTO site_content (id, about_content, image_url) VALUES (1, '', NULL) ON CONFLICT(id) DO NOTHING").run();

  if (section === "home") {
    const imageUrl = String(form.get("home_image_url") || "").trim() || "/assets/hero-campaign.svg";
    const imagePosition = String(form.get("home_image_position") || "").trim() || "center center";
    const homeJson = JSON.stringify({
      badge: String(form.get("home_badge") || "").trim() || "공공 캠페인 아카이브",
      title: String(form.get("home_title") || "").trim() || "서부선 정상화로,\n서부권의 출퇴근과 생활권 연결을 되찾겠습니다.",
      description:
        String(form.get("home_description") || "").trim()
        || "서부선은 은평·서대문·마포·영등포·동작·관악을 잇는 핵심 연결축입니다. 공개 출처로 확인된 사실만 정리해 주민 참여와 정책 감시를 돕습니다.",
      image_url: imageUrl,
      image_position: imagePosition,
    });
    db.prepare("UPDATE site_content SET home_sections_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1").run(homeJson);
    return redirectWithForwardedHeaders(req, "/");
  }

  const businessSummary = String(form.get("business_summary") || "").trim();
  const routeOverview = String(form.get("route_overview") || "").trim();
  const residentPerspectiveSummary = String(form.get("resident_perspective_summary") || "").trim();
  const backgroundItems = toLines(form.get("추진_background"));
  const stationItems = toLines(form.get("major_stations_or_sections"));
  const expectedEffects = toLines(form.get("expected_effects"));
  const imageUrl = String(form.get("image_url") || "").trim() || null;
  const imagePosition = String(form.get("image_position") || "").trim() || "center center";
  const sectionJson = JSON.stringify({
    business_summary: businessSummary,
    route_overview: routeOverview,
    resident_perspective_summary: residentPerspectiveSummary,
    추진_background: backgroundItems,
    major_stations_or_sections: stationItems,
    expected_effects: expectedEffects,
    hero_image_position: imagePosition,
  });

  db.prepare("UPDATE site_content SET about_content = ?, image_url = ?, introduce_sections_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1").run(
    businessSummary,
    imageUrl,
    sectionJson,
  );

  return redirectWithForwardedHeaders(req, "/introduce");
}
