import { db } from "@/lib/db";

export function incrementHomeViewCount() {
  db.prepare(
    `INSERT INTO site_stats (key, value, updated_at)
     VALUES ('home_view_count', 1, CURRENT_TIMESTAMP)
     ON CONFLICT(key) DO UPDATE SET value = value + 1, updated_at = CURRENT_TIMESTAMP`,
  ).run();
}

export function getHomeViewCount() {
  const row = db.prepare("SELECT value FROM site_stats WHERE key = 'home_view_count'").get() as { value: number } | undefined;
  return row?.value ?? 0;
}

export function getUserCount() {
  const row = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  return row.count;
}
