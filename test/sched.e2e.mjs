import puppeteer from 'puppeteer-core';
import { start, addJob } from './mock-server.mjs';
const SHOTS = process.env.SHOTS || '';
function fail(m) { throw new Error(m); }
addJob({ id: 'S1', est: 'FT-EST-2026-0201', name: 'Approved Maple', address: '5 Maple Ave, Tallahassee, FL 32301', email: 'm@example.com', status: 'approved', created: '2026-10-20T12:00:00Z', items: [], total: 1200, crew: [], photos: [] });
addJob({ id: 'S2', est: 'FT-EST-2026-0202', name: 'Approved Cedar', address: '9 Cedar Ct, Tallahassee, FL 32303', email: 'c@example.com', status: 'approved', created: '2026-10-21T12:00:00Z', items: [], total: 700, crew: [], photos: [] });
const server = await start(0);
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
page.on('dialog', (d) => d.accept());
const waitText = (t) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 15000 }, t);
try {
  await page.goto(base + '/?api=' + encodeURIComponent(base + '/exec'), { waitUntil: 'networkidle0' });
  for (const d of '1234') await page.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
  await waitText('Approved Maple');
  // 1) Schedule from the approved job
  await page.evaluate(() => mview('S1'));
  await page.waitForSelector('#schedbtn');
  await page.click('#schedbtn');
  await waitText('Schedule job');
  const day = await page.evaluate(() => { const d = new Date(); d.setDate(d.getDate() + 3); return ymd(d); });
  await page.$eval('#bd', (e, v) => { e.value = v; }, day);
  if ((await page.$eval('#bj', (e) => e.value)) !== 'S1') fail('job not preselected');
  await page.click('#bsv');
  await page.waitForFunction(() => document.getElementById('schedcard') && document.getElementById('schedcard').innerText.includes('Scheduled'));
  if (SHOTS) await page.screenshot({ path: SHOTS + '/schedule_job_scheduled.png', fullPage: true });
  const r = await page.evaluate(() => [...document.querySelectorAll('#schedcard button')].map((b) => b.textContent));
  if (!r.includes('Reschedule') || !r.includes('Unschedule')) fail('missing reschedule/unschedule');
  // 2) Calendar: tap the day, put the other approved job on it
  await page.evaluate(() => sched());
  await page.evaluate((day) => dayView(day), day);
  await waitText('Approved jobs not yet scheduled (1)');
  const onDay = await page.$eval('#dayon', (e) => e.innerText);
  if (!onDay.includes('Approved Maple')) fail('scheduled job missing from day');
  if (SHOTS) await page.screenshot({ path: SHOTS + '/schedule_day_view.png', fullPage: true });
  await page.evaluate(() => [...document.querySelectorAll('#dayun button')].find((b) => b.textContent === 'Put on this day').click());
  await waitText('Approved jobs not yet scheduled (0)');
  if (!(await page.$eval('#dayon', (e) => e.innerText)).includes('Approved Cedar')) fail('put on day failed');
  if (SHOTS) await page.screenshot({ path: SHOTS + '/schedule_day_after_put.png', fullPage: true });
  // Unschedule from the job screen
  await page.evaluate(() => mview('S2'));
  await page.evaluate(() => [...document.querySelectorAll('#schedcard button')].find((b) => b.textContent === 'Unschedule').click());
  await page.waitForSelector('#schedbtn');
  console.log('fielder schedule e2e ok');
} finally { await browser.close(); server.close(); }
