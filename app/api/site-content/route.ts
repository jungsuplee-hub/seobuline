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
  const toLines = (value: FormDataEntryValue | null) =>
    String(value || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  const businessSummary = String(form.get("business_summary") || "").trim();
  const routeOverview = String(form.get("route_overview") || "").trim();
  const residentPerspectiveSummary = String(form.get("resident_perspective_summary") || "").trim();
  const backgroundItems = toLines(form.get("추진_background"));
  const stationItems = toLines(form.get("major_stations_or_sections"));
  const expectedEffects = toLines(form.get("expected_effects"));
  const imageUrl = String(form.get("image_url") || "").trim() || null;
  const sectionJson = JSON.stringify({
    business_summary: businessSummary,
    route_overview: routeOverview,
    resident_perspective_summary: residentPerspectiveSummary,
    추진_background: backgroundItems,
    major_stations_or_sections: stationItems,
    expected_effects: expectedEffects,
  });

  db.prepare("INSERT INTO site_content (id, about_content, image_url) VALUES (1, '', NULL) ON CONFLICT(id) DO NOTHING").run();
  db.prepare("UPDATE site_content SET about_content = ?, image_url = ?, introduce_sections_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1").run(
    businessSummary,
    imageUrl,
    sectionJson,
  );

  return redirectWithForwardedHeaders(req, "/introduce");
}
