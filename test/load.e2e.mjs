// PIN -> full-screen loading state (logo, spinner, Loading…) -> home; failed load shows error + Retry.
import puppeteer from 'puppeteer-core';
import { start } from './mock-server.mjs';
const server = await start(0), base = 'http://127.0.0.1:' + server.address().port;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
page.setDefaultTimeout(15000);
let mode = 'slow';
await page.setRequestInterception(true);
page.on('request', async (r) => {
  const u = new URL(r.url());
  if (/script\.google|googleusercontent/.test(u.hostname)) return r.abort();
  if (u.pathname === '/exec' && r.method() === 'GET' && !u.searchParams.has('a')) {
    if (mode === 'fail') { mode = 'slow'; return r.abort(); }
    if (mode === 'slow') await new Promise((s) => setTimeout(s, 1500));
  }
  r.continue();
});
const pin = async (p) => { for (const d of p) await page.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d); };
try {
  await page.goto(base + '/?api=' + encodeURIComponent(base + '/exec'), { waitUntil: 'networkidle0' });
  await pin('1234');
  await page.waitForFunction(() => { const o = document.getElementById('fdload'); return o && o.querySelector('.spin') && /Loading…/.test(o.innerText) && o.querySelector('img'); });
  if (process.env.LOAD_SHOT) await page.screenshot({ path: process.env.LOAD_SHOT });
  await page.waitForFunction(() => !document.getElementById('fdload') && document.body.innerText.includes('New customer quote'));
  // failure path (fetch fails twice in api() retries -> use abort for all attempts)
  await page.evaluate(() => { document.getElementById('out').click(); });
  mode = 'fail';
  page.on('request', () => {});
  await page.evaluate(() => { const f = window.fetch; let n = 0; window.fetch = (u, o) => (!o && n++ < 3 ? Promise.reject(new Error('x')) : f(u, o)); });
  await pin('1234');
  await page.waitForSelector('#fdretry');
  await page.click('#fdretry');
  await page.waitForFunction(() => !document.getElementById('fdload') && document.body.innerText.includes('New customer quote'));
  console.log('fielder loading e2e ok');
} finally { await browser.close(); server.close(); }
