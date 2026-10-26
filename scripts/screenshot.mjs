/**
 * Bounded headless screenshotter for visual QA of invitation templates.
 *
 * Usage:
 *   node scripts/screenshot.mjs <outDir> <url>[|name][|#selector] ...
 *
 * Examples:
 *   node scripts/screenshot.mjs .shots http://localhost:3000/templates/velvet|velvet
 *   node scripts/screenshot.mjs .shots "http://localhost:3000/templates/bloom|bloom-rsvp|#rsvp"
 *
 * Why not `chrome --screenshot`? It captures before Framer Motion entrances
 * finish (names appear blank). This waits in real time (5.5s per page), can
 * scroll to a section, and hard-kills Chrome after a timeout.
 *
 * Env: CHROME_PATH overrides the browser binary; SHOT_SIZE sets the window, e.g.
 * "390x844" for a phone (default "1440x900"); SHOT_WAIT_MS sets the wait after
 * navigation (default 5500 — use ~1200 to capture an opening mid-animation).
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const [outDir, ...targets] = process.argv.slice(2);
if (!outDir || targets.length === 0) {
  console.error("Usage: node scripts/screenshot.mjs <outDir> <url>[|name][|#selector] ...");
  process.exit(1);
}

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chromePath = CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error("Chrome not found. Set CHROME_PATH to your Chrome/Chromium binary.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
// Unique port per process so parallel screenshot runs don't share a browser.
const PORT = 9300 + (process.pid % 600);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const size = /^\d{3,4}x\d{3,4}$/.test(process.env.SHOT_SIZE ?? "") ? process.env.SHOT_SIZE.replace("x", ",") : "1440,900";
const [viewportWidth, viewportHeight] = size.split(",").map(Number);
const chrome = spawn(chromePath, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--window-size=${size}`, "about:blank"], { stdio: "ignore" });
const watchdog = setTimeout(() => {
  console.error("Timed out — killing Chrome.");
  chrome.kill();
  process.exit(2);
}, 20000 * targets.length + 15000);

try {
  let list;
  for (let i = 0; i < 40 && !list; i++) {
    try {
      list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
    } catch {
      await sleep(250);
    }
  }
  if (!list) throw new Error("Chrome DevTools endpoint did not start.");
  const ws = new WebSocket(list.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });

  // Chrome clamps headless windows to ~500px wide; override device metrics so
  // a 390px phone capture uses the real mobile layout.
  await send("Emulation.setDeviceMetricsOverride", {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile: viewportWidth < 600,
  });

  let lastUrl = "";
  for (const [i, t] of targets.entries()) {
    const [url, name = `shot-${i + 1}`, selector] = t.split("|");
    if (url !== lastUrl) {
      await send("Page.navigate", { url });
      await sleep(Number(process.env.SHOT_WAIT_MS) || 5500);
      lastUrl = url;
    }
    if (selector) {
      await send("Runtime.evaluate", {
        expression: `(()=>{document.documentElement.style.scrollBehavior='auto';const el=document.querySelector(${JSON.stringify(selector)});if(el)window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70)})()`,
      });
      await sleep(3000);
    }
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(`${outDir}/${name}.png`, Buffer.from(shot.result.data, "base64"));
    console.log(`saved ${outDir}/${name}.png`);
  }
  ws.close();
} catch (err) {
  console.error("Screenshot failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
} finally {
  clearTimeout(watchdog);
  chrome.kill();
}
