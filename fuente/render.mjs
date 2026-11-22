// Renderiza las piezas del README (../assets) desde piezas.html a 2x. Uso: node render.mjs
import { chromium } from "/home/alexdev07/Projects/Freelance/ConectaU/node_modules/.pnpm/playwright-core@1.65.0/node_modules/playwright-core/index.mjs";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const aqui = new URL(".", import.meta.url).pathname;
const OUT = aqui + "../assets/"; mkdirSync(OUT, { recursive: true });
const PS = JSON.parse(readFileSync(aqui + "proyectos.json", "utf8"));
const b = await chromium.launch({ executablePath: "/usr/bin/chromium-browser", args: ["--allow-file-access-from-files"] });
const p = await b.newPage({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
await p.addInitScript((ps) => { window.__PS = ps; }, PS);
async function pieza(nombre, params) {
  await p.goto("file://" + aqui + "piezas.html?" + new URLSearchParams(params));
  await p.waitForFunction(() => window.__listo);
  await p.locator("#lienzo").screenshot({ path: OUT + nombre + ".png", omitBackground: true });
  return p.evaluate(() => window.__hueco);
}
const hueco = await pieza("banner-fondo", { pieza: "banner" });
writeFileSync(aqui + "hueco.json", JSON.stringify(hueco));
const T = [["trabajo", { t: "Trabajo", n: "06", sub: "Lo que construí para empresas, para mi agencia y para la U." }],
  ["stack", { t: "Stack" }], ["hablemos", { t: "¿Hablamos?", sub: "Sitios, CRMs, automatizaciones y agentes de IA. Respondo en español o en inglés." }]];
for (const [n, q] of T) for (const tema of ["oscuro", "claro"]) await pieza(`t-${n}-${tema}`, { pieza: "titulo", tema, ...q });
for (const x of PS) await pieza("carta-" + x.slug, { pieza: "carta", slug: x.slug });
await pieza("stack", { pieza: "stack" });
await pieza("conceptos", { pieza: "conceptos" });
const BOT = [["b-portafolio", { t: "Ver el portafolio", s: "alexdev07.pages.dev", v: "lleno" }], ["b-linkedin", { t: "LinkedIn" }], ["b-cv", { t: "CV", s: "PDF" }], ["b-correo", { t: "Correo" }]];
for (const [n, q] of BOT) await pieza(n, { pieza: "boton", ...q });
await b.close();
console.log("listo", hueco);
