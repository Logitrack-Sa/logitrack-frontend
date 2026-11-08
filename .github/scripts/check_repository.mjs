import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, appendFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean);
let failures = [];
for (const file of files.filter(file => file.endsWith(".md"))) {
  const text = readFileSync(file, "utf8");
  if (/^(<{7}|>{7})(?: |$)/m.test(text)) failures.push(`${file}: conflicto sin resolver`);
  for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^(https?:|mailto:|app:|codex:|file:|\/)/.test(target)) continue;
    if (!existsSync(resolve(dirname(file), decodeURIComponent(target)))) failures.push(`${file}: enlace local inválido ${target}`);
  }
}
const nextjs = existsSync("package.json") && existsSync("tsconfig.json");
const docker = existsSync("Dockerfile");
if (!nextjs && files.some(file => file.startsWith("src/") && (file.endsWith(".ts") || file.endsWith(".tsx")))) {
  failures.push("Hay código TypeScript/React pero falta package.json o tsconfig.json");
}
if (failures.length) throw new Error(failures.join("\n"));
const report = `Markdown válido (${files.filter(f => f.endsWith(".md")).length} archivos). Next.js/TS: ${nextjs}; Dockerfile: ${docker}.`;
console.log(report);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `nextjs=${nextjs}\ndocker=${docker}\n`);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY,
  `## Alcance real de la CI\n${report}\n${nextjs ? "La suite Next.js (TypeScript, ESLint y Build) corre de forma independiente." : "Repositorio aún documental/configuración."}\n`);
