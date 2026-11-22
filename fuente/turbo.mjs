import { chromium } from "/home/alexdev07/Projects/Freelance/ConectaU/node_modules/.pnpm/playwright-core@1.65.0/node_modules/playwright-core/index.mjs";
const b = await chromium.launch({ executablePath: "/usr/bin/chromium-browser", args: ["--use-angle=gl","--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, locale: "es-SV", reducedMotion: "reduce" });
await p.goto("https://alexdev07.pages.dev/", { waitUntil: "networkidle" });
const v = p.locator('article[aria-labelledby="t-turbochats"] a span.relative').first();
await v.scrollIntoViewIfNeeded(); await p.waitForTimeout(2500);
await v.screenshot({ path: "img/turbochats.png" });
await b.close();
