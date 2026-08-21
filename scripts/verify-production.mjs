import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const pages = JSON.parse(readFileSync(resolve(root, "src/pages.json"), "utf8"));
const failures = [];

for (const [pageName, page] of Object.entries(pages)) {
  if (!page.title || !page.body) failures.push(`${pageName}: missing title or body`);
  for (const script of page.scripts || []) {
    if (script.src && !existsSync(resolve(root, "public", script.src.replace(/^\//, "")))) {
      failures.push(`${pageName}: missing script ${script.src}`);
    }
  }
}

for (const file of ["index.html", "vite.config.js", "vercel.json"]) {
  if (!existsSync(resolve(root, file))) failures.push(`missing deployment file: ${file}`);
}

if (failures.length) {
  console.error(`Production verification failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(`Verified ${Object.keys(pages).length} page definitions and their script assets.`);
