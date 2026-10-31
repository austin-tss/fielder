import puppeteer from 'puppeteer-core';
import { start, punches, resetPunches, setClock, clockApi } from './mock-server.mjs';
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port, EXEC = base + '/exec';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); };
const post = (b) => fetch(EXEC, { method: 'POST', body: JSON.stringify(b) }).then((r) => r.json());
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  // 1) Server rules on the mock: no double clock-in, 30 crew at once, idempotent offline replays.
  resetPunches();
  const names = Array.from({ length: 30 }, (_, i) => 'Crew ' + (i + 1));
  const r1 = await Promise.all(names.flatMap((n, i) => [post({ a: 'clockIn', pin: '0123', who: n, cid: 'A' + i }), post({ a: 'clockIn', pin: '0123', who: n, cid: 'B' + i })]));
  const ok = r1.filter((r) => r.ok).length, already = r1.filter((r) => r.already).length;
  if (ok !== 30 || already !== 30) fail('30 concurrent: ok ' + ok + ' already ' + already);
  if (punches.filter((p) => !p.out).length !== 30) fail('open punches ' + punches.length);
  const replay = await post({ a: 'clockIn', pin: '0123', who: 'Crew 1', cid: 'A0' }); if (!replay.ok || !replay.dup) fail('replay not idempotent');
  const r2 = await Promise.all(names.map((n, i) => post({ a: 'clockOut', pin: '0123', who: n, cid: 'O' + i })));
  if (r2.some((r) => !r.ok) || punches.some((p) => !p.out)) fail('30 concurrent clock-out');
  if ((await post({ a: 'clockOut', pin: '0123', who: 'Crew 1', cid: 'O-x' })).notIn !== true) fail('clock-out when out');
  if ((await post({ a: 'clockList', pin: '0123' })).ok) fail('crew can list');
  if (!(await post({ a: 'clockIn', pin: '0123', who: '' })).needName) fail('no name');
  console.log('clock concurrency ok: 30 in + 30 duplicate rejected + 30 out');
  resetPunches();
  // Seed history for totals.
  const now = Date.now(); punches.push({ id: 'P-old', who: 'Sam Oak', in: new Date(now - 3 * 3600e3).toISOString(), out: new Date(now - 1 * 3600e3).toISOString(), src: 'app' });

  // 2) Crew UI.
  const page = await browser.newPage(); await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const login = async (p) => { for (const d of p) await page.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d); };
  await page.goto(base + '/?api=' + encodeURIComponent(EXEC), { waitUntil: 'networkidle0' });
  await login('0123'); await page.waitForSelector('#clockbtn');
  await page.click('#clockbtn'); await page.waitForSelector('#clockname');
  await page.type('#clockname', 'Sam Oak'); await page.click('#clocksave');
  await page.waitForFunction(() => document.querySelector('#clockToday') && document.querySelector('#clockToday').textContent === '2.00');
  if ((await page.$eval('#clockbtn', (b) => b.textContent)) !== 'Clock In') fail('label in');
  await page.click('#clockbtn');
  await page.waitForFunction(() => $('#clockbtn').textContent === 'Clock Out' && !JSON.parse(localStorage.fdClockQ || '[]').length);
  if (punches.filter((p) => !p.out && p.who === 'Sam Oak').length !== 1) fail('server punch missing');
  { const sp0 = punches.find((p) => !p.out && p.who === 'Sam Oak'); const did = await page.evaluate(() => JSON.parse(localStorage.fdDevId || '""')); if (!did || sp0.dev !== did || !sp0.devName) fail('deviceId not sent ' + JSON.stringify(sp0)); }
  // Double tap from a second phone is rejected by the server.
  const dbl = await page.evaluate(() => api({ a: 'clockIn', who: 'Sam Oak', cid: 'X1' }).then(() => 'ok', (e) => e.message)); if (!/already clocked in/.test(dbl)) fail('double clock-in allowed: ' + dbl);
  await page.screenshot({ path: '/workspace/fielder-clock-crew.png' });
  // Name remembered across sign out.
  await page.evaluate(() => logout()); await login('0123'); await page.waitForSelector('#clockbtn');
  if (!(await page.$eval('#clockc', (e) => e.innerText)).includes('Sam Oak')) fail('name not remembered');
  // Offline: clock out queues locally, then syncs with the original time.
  await page.setOfflineMode(true);
  const tapAt = Date.now(); await page.click('#clockbtn');
  await page.waitForFunction(() => document.querySelector('#clockq') && /saved on this phone/.test($('#clockq').textContent));
  if ((await page.$eval('#clockbtn', (b) => b.textContent)) !== 'Clock In') fail('offline label');
  await wait(1500);
  await page.setOfflineMode(false); await page.evaluate(() => clockSync());
  await page.waitForFunction(() => !JSON.parse(localStorage.fdClockQ || '[]').length);
  const sp = punches.find((p) => p.who === 'Sam Oak' && p.id !== 'P-old'); if (!sp || !sp.out || Math.abs(new Date(sp.out) - tapAt) > 3000) fail('offline out time ' + JSON.stringify(sp));
  console.log('clock crew ok (name, in, double rejected, offline queue + sync)');
  // Live backend without the clock actions: degrade, keep the punch locally.
  setClock(false);
  await page.click('#clockbtn');
  await page.waitForFunction(() => document.querySelector('#clockq') && /coming soon/i.test($('#clockq').textContent));
  if ((await page.$eval('#clockbtn', (b) => b.textContent)) !== 'Clock Out') fail('soon label');
  setClock(true); await page.evaluate(() => clockSync());
  await page.waitForFunction(() => !JSON.parse(localStorage.fdClockQ || '[]').length && !document.querySelector('#clockq'));
  if (punches.filter((p) => !p.out && p.who === 'Sam Oak').length !== 1) fail('soon punch not synced');
  console.log('clock degrade ok (Bad action -> coming soon, queued, synced later)');

  // 3) Admin UI.
  await page.evaluate(() => logout()); await login('6789'); await page.waitForSelector('#row-hours'); await page.click('#row-hours');
  await page.waitForFunction(() => document.body.innerText.includes('On the clock now (1)') && document.querySelector('#htot'));
  const tot = await page.$eval('#htot', (t) => t.innerText); if (!/Sam Oak\s+2\.0\d/.test(tot)) fail('totals ' + tot);
  const csv = await page.evaluate(() => hoursCsvText()); if (!/^Name,Date,Clock in,Clock out,Hours,Edited,Device,Flag\r\n/.test(csv) || (csv.match(/Sam Oak/g) || []).length !== 3) fail('csv ' + csv);
  await page.screenshot({ path: '/workspace/fielder-clock-admin.png', fullPage: true });
  // Fix a missed punch: close the open one.
  const open = punches.find((p) => !p.out); await page.evaluate((id) => punchEdit(id), open.id);
  const outLocal = await page.evaluate(() => { const d = new Date(Date.now() + 60000); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); });
  await page.$eval('#pout', (e, v) => { e.value = v; }, outLocal); await page.click('#psave');
  await page.waitForFunction(() => document.body.innerText.includes('On the clock now (0)'));
  if (!punches.find((p) => p.id === open.id).edited) fail('fix not saved');
  // Add a missed punch.
  await page.evaluate(() => punchEdit(''));
  await page.type('#pwho', 'Lee Pine');
  await page.$eval('#pin', (e) => { e.value = '2026-10-29T08:00'; }); await page.$eval('#pout', (e) => { e.value = '2026-10-29T16:30'; });
  await page.click('#psave'); await wait(300);
  if (!punches.find((p) => p.who === 'Lee Pine' && p.src === 'fix')) fail('missed punch not added');
  const bad = await post({ a: 'clockFix', pin: '6789', who: 'X', in: '2026-10-29T10:00:00Z', out: '2026-10-29T09:00:00Z' }); if (bad.ok) fail('out before in accepted');
  console.log('clock admin ok (now, totals, csv, fix, add missed)');
  console.log('fielder clock e2e ok');
} finally { await browser.close(); server.close(); }
