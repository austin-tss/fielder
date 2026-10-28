import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { start } from './mock-server.mjs';
function fail(m) { throw new Error(m); }
const m = JSON.parse(fs.readFileSync(new URL('../manifest.webmanifest', import.meta.url)));
if (m.short_name !== 'Fielder' || m.display !== 'standalone' || m.theme_color !== '#112337') fail('manifest wrong');
const server = await start(0);
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
const waitText = (t) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 15000 }, t);
try {
  await page.goto(base + '/?api=' + encodeURIComponent(base + '/exec'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(async () => { const ks = await caches.keys(); if (!ks.length) return false; const c = await caches.open(ks[0]); return (await c.keys()).length >= 8; }, { timeout: 15000 });
  for (const d of '1234') await page.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
  await waitText('Finished Pine');
  const urls = await page.evaluate(async () => { const out = []; for (const k of await caches.keys()) { const c = await caches.open(k); (await c.keys()).forEach((r) => out.push(r.url)); } return out; });
  if (!urls.some((u) => u.endsWith('/index.html'))) fail('shell not cached');
  if (urls.some((u) => /exec|pin=|[?&]a=/.test(u))) fail('API response was cached: ' + urls.join(' '));
  if (!(await page.evaluate(() => JSON.parse(localStorage.fdCache).jobs.length))) fail('job list not cached');
  // Reload: the cached list shows right away, even with the API down.
  await page.setRequestInterception(true);
  page.on('request', (r) => (/\/exec/.test(r.url()) ? r.abort() : r.continue()));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitText('Finished Pine');
  await page.evaluate(() => logout());
  if (await page.evaluate(() => localStorage.fdCache)) fail('cache not cleared on sign out');
  console.log('fielder pwa e2e ok');
} finally { await browser.close(); server.close(); }
