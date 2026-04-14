import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SOURCE_PATH = path.join(DATA_DIR, "politicians-manual.json");
const TARGET_PATH = path.join(DATA_DIR, "politicians.json");

type ManualPolitician = {
  name?: string;
  updated_at?: string;
  [key: string]: unknown;
};

async function run() {
  const raw = await fs.readFile(SOURCE_PATH, "utf8");
  const items = JSON.parse(raw) as ManualPolitician[];

  const normalized = items
    .map((item) => ({
      ...item,
      updated_at: String(item.updated_at || new Date().toISOString().slice(0, 10)),
    }))
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "ko"));

  await fs.writeFile(TARGET_PATH, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
  console.log(`[update-politicians] total=${normalized.length}`);
}

run().catch((error) => {
  console.error("[update-politicians] failed", error);
  process.exitCode = 1;
});
