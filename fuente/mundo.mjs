// Graba el mundo 2D del portafolio en vivo (recordVideo) mientras el personaje camina.
// Uso: node mundo.mjs "espera:500,ArrowUp:450,..."  -> mundo.webm + caja.json (recorte)
import { chromium } from "/home/alexdev07/Projects/Freelance/ConectaU/node_modules/.pnpm/playwright-core@1.65.0/node_modules/playwright-core/index.mjs";
import { writeFileSync, rmSync, readdirSync, renameSync } from "node:fs";
rmSync("video", { recursive: true, force: true });
const b = await chromium.launch({ executablePath: "/usr/bin/chromium-browser", args: ["--use-angle=gl", "--ignore-gpu-blocklist"] });
const vp = { width: 1600, height: 1000 };
const ctx = await b.newContext({ viewport: vp, locale: "es-SV", recordVideo: { dir: "video", size: vp } });
const p = await ctx.newPage();
await p.goto("https://alexdev07.pages.dev/", { waitUntil: "networkidle" });
await p.waitForTimeout(2000);
const cv = p.locator("canvas").first();
await cv.scrollIntoViewIfNeeded(); await p.waitForTimeout(600);
const caja = await cv.locator("xpath=..").boundingBox();
const t0 = await p.evaluate(() => performance.now());
await cv.focus();
const ruta = (process.argv[2] || "").split(",").filter(Boolean).map((x) => x.split(":"));
const inicio = Date.now();
for (const [k, ms] of ruta) {
  if (k === "espera") { await p.waitForTimeout(+ms); continue; }
  await p.keyboard.down(k); await p.waitForTimeout(+ms); await p.keyboard.up(k);
}
const dur = (Date.now() - inicio) / 1000;
await ctx.close(); await b.close();
const f = readdirSync("video")[0]; renameSync(`video/${f}`, "mundo.webm");
// El video empieza al crear la página: el recorrido arranca unos segundos después
writeFileSync("caja.json", JSON.stringify({ ...caja, dur }));
console.log(caja, "duración", dur);
