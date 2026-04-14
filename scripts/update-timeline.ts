import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SOURCE_PATH = path.join(DATA_DIR, "timeline-source.json");
const TARGET_PATH = path.join(DATA_DIR, "timeline.json");

async function run() {
  const raw = await fs.readFile(SOURCE_PATH, "utf8");
  const items = JSON.parse(raw) as Array<Record<string, unknown>>;

  const normalized = items.sort((a, b) => {
    const aDate = new Date(String(a.timeline_date)).getTime();
    const bDate = new Date(String(b.timeline_date)).getTime();
    return bDate - aDate;
  });

  await fs.writeFile(TARGET_PATH, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  console.log(`[update-timeline] total=${normalized.length}`);
}

run().catch((error) => {
  console.error("[update-timeline] failed", error);
  process.exitCode = 1;
});
