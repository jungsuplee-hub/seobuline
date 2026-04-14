import { execSync } from "node:child_process";

const commands = [
  "npm run update:site-content",
  "npm run update:timeline",
  "npm run update:politicians",
  "npm run update:news",
];

for (const command of commands) {
  console.log(`[update-all] ${command}`);
  execSync(command, { stdio: "inherit" });
}

console.log("[update-all] done");
