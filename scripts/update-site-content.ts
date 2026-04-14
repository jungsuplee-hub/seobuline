import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SOURCE_PATH = path.join(DATA_DIR, "about-seobuline.json");
const TARGET_PATH = path.join(DATA_DIR, "site-content.json");

async function run() {
  const raw = await fs.readFile(SOURCE_PATH, "utf8");
  const content = JSON.parse(raw) as Record<string, unknown>;

  await fs.writeFile(TARGET_PATH, `${JSON.stringify(content, null, 2)}\n`, "utf8");
  console.log("[update-site-content] updated");
}

run().catch((error) => {
  console.error("[update-site-content] failed", error);
  process.exitCode = 1;
});
