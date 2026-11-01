// Parity batch 3 end to end on the mock (real Code.gs feature code in the emulator): permits/HOA + 811 on a job,
// lead source chips + report, weather (Open-Meteo stubbed) + dashboard alert, payroll with overtime, COI upload + send
// (test inbox only), multi-day progress, Spanish crew mode (UI + voice mapping). Corner mic only.
import puppeteer from 'puppeteer-core';
import { start, addJob, featOn, featOutbox } from './mock-server.mjs';
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port, api = base + '/exec';
const DAY = 864e5, iso = (ms) => new Date(ms).toISOString(), ymd = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(ms));
featOn({ props: { EMPLOYEES_JSON: '[]' } });
const now = Date.now();
addJob({ id: 'B3-1', est: 'FT-EST-2026-0401', name: 'Stella Stump', address: '3 Root Ln', email: 's@example.com', status: 'approved', items: [{ title: 'Stump grinding', price: 350 }], created: iso(now - DAY), photos: [], crew: [] });
addJob({ id: 'B3-2', est: 'FT-EST-2026-0402', name: 'Big Oak Removal', address: '8 Canopy Rd', email: 'b@example.com', status: 'approved', items: [{ title: 'Removal', price: 4000 }], created: iso(now - DAY), photos: [], crew: [] });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); }; const w = (ms) => new Promise((r) => setTimeout(r, ms));
const days = [...Array(7)].map((_, i) => ymd(now + i * DAY));
const WX = { daily: { time: days, weather_code: days.map((_, i) => (i === 1 ? 95 : 1)), precipitation_probability_max: days.map((_, i) => (i === 1 ? 80 : 10)), wind_gusts_10m_max: days.map(() => 12), temperature_2m_max: days.map(() => 78) } };
let wxHits = 0;
async function open(pin) {
  const p = await browser.newPage(); await p.setViewport({ width: 390, height: 844 });
  await p.evaluateOnNewDocument(() => { localStorage.fdHome = 'forms'; localStorage.fdTips = 'off'; });
  await p.setRequestInterception(true);
  p.on('request', (r) => { if (/open-meteo/.test(r.url())) { wxHits++; return r.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(WX) }); } const h = new URL(r.url()).hostname; if (h !== '127.0.0.1') return r.abort(); r.continue(); });
  p.on('dialog', (d) => d.accept()); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(base + '/?api=' + encodeURIComponent(api), { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.pin button'); for (const d of pin) await p.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
  return p;
}
const shot = (p, n) => p.screenshot({ path: '/workspace/fielder-parity4-' + n + '.png' });
const noBigMic = (p) => p.evaluate(() => ![...document.querySelectorAll('button')].some((b) => { const x = b.getBoundingClientRect(); return /🎙|🎤/.test(b.textContent) && x.width >= 100 && x.height >= 100 && b.offsetParent; }));
try {
  // Manager: job page cards (permit/HOA, 811, lead source, multi-day)
  let p = await open('1234'); await p.waitForFunction(() => typeof jobs !== 'undefined' && jobs.length > 0, { timeout: 10000 });
  await p.evaluate((d) => Promise.all([api({ a: 'block', block: { id: 'BB1', date: d[0], start: '08:00', end: '16:00', job: 'B3-2' } }), api({ a: 'block', block: { id: 'BB2', date: d[1], start: '08:00', end: '16:00', job: 'B3-2' } }), api({ a: 'block', block: { id: 'BB3', date: d[0], start: '08:00', end: '10:00', job: 'B3-1' } })]), days);
  await p.evaluate(() => refresh && refresh()); await w(300);
  await p.evaluate(() => mview('B3-1')); await p.waitForSelector('#ftpermit'); await p.waitForSelector('#ftsrc');
  if (!/call 811/i.test(await p.$eval('#ftpermit', (e) => e.innerText))) fail('stump job should ask for 811');
  await p.select('#pmt', 'HOA approval'); await p.select('#pms', 'applied'); await p.click('#pmsave');
  await p.waitForFunction(() => jobs.find((j) => j.id === 'B3-1').permit?.status === 'applied', { timeout: 6000 });
  await p.evaluate(() => { document.getElementById('lct').value = 'T-555'; }); await p.click('#lcsave');
  await p.waitForFunction(() => jobs.find((j) => j.id === 'B3-1').locate?.ticket === 'T-555', { timeout: 6000 });
  if (!/Ticket T-555/.test(await p.$eval('#ftpermit', (e) => e.innerText))) fail('811 ticket not shown');
  await p.evaluate(() => [...document.querySelectorAll('#ftsrc button')].find((b) => b.textContent.trim() === 'Yard sign').click());
  await p.waitForFunction(() => jobs.find((j) => j.id === 'B3-1').source === 'Yard sign', { timeout: 6000 });
  await shot(p, 'job-permit-811');
  // voice on the open job
  await p.evaluate(() => FDVH.route('permit approved')); await p.waitForFunction(() => jobs.find((j) => j.id === 'B3-1').permit?.status === 'approved', { timeout: 6000 }).catch(async (e) => { console.log('TOAST', await p.evaluate(() => [document.getElementById('toast')?.textContent, JSON.stringify(jobs.find((j) => j.id === 'B3-1').source), document.getElementById('lct')?.value])); throw e; });
  // multi-day progress card on a 2-day job
  await p.evaluate(() => mview('B3-2')); await p.waitForSelector('#ftprog');
  if (!/Day 1 of 2/.test(await p.$eval('#ftprog', (e) => e.innerText))) fail('multi-day header ' + (await p.$eval('#ftprog', (e) => e.innerText)));
  await p.type('#pgn', 'Dropped the top, cleanup tomorrow'); await p.evaluate(() => { document.getElementById('pgp').value = '60'; }); await p.click('#pgsave');
  await p.waitForFunction(() => (jobs.find((j) => j.id === 'B3-2').progress || []).some((x) => x.pct === 60), { timeout: 6000 });
  // permits list + lead report
  await p.evaluate(() => ftPermits()); await p.waitForFunction(() => /Stella Stump/.test(A.innerText), { timeout: 6000 }).catch(() => {}); if (!/Stella Stump/.test(await p.evaluate(() => A.innerText))) fail('permit list ' + (await p.$eval('#pmlist', (e) => e.innerText)));
  await p.evaluate(() => ftLeads()); await p.waitForFunction(() => /Yard sign/.test(document.getElementById('leadrep')?.innerText || ''), { timeout: 6000 }).catch(() => {}); if (!/Yard sign/.test(await p.$eval('#leadrep', (e) => e.innerText))) fail('lead report');
  // weather page flags the booked storm day
  await p.evaluate(() => ftWx()); await p.waitForSelector('.wxday'); const red = await p.$$eval('.wxday', (a) => a.filter((e) => /b42318|180, 35, 24/.test(e.getAttribute('style') || '')).length);
  if (red !== 1) fail('weather red days ' + red); if (!wxHits) fail('Open-Meteo not used'); await shot(p, 'weather');
  if (!(await noBigMic(p))) fail('big mic on manager pages');
  await p.close();
  // Owner: dashboard alerts (811 now has a ticket; weather on a booked day), payroll, COI
  p = await open('4321'); await p.waitForSelector('#dgrid', { timeout: 10000 });
  await p.waitForFunction(() => /⛈/.test(document.getElementById('dalert')?.textContent || ''), { timeout: 8000 }).catch(async (e) => { console.log(await p.evaluate(() => document.getElementById('dalert')?.innerText)); throw e; });
  const L = await p.evaluate(() => ({ sh: document.documentElement.scrollHeight, ih: innerHeight })); if (L.sh > L.ih) fail('dashboard scrolls with alerts ' + JSON.stringify(L));
  if (!(await noBigMic(p))) fail('big mic on dashboard');
  await p.evaluate(() => ownerSect('timber')); for (const id of ['s-pay', 's-leads2', 's-permits2', 's-wx2', 's-coi2']) if (!(await p.$('#' + id))) fail('tools button ' + id);
  await p.evaluate(() => document.getElementById('s-pay').click()); await p.waitForSelector('#prf'); await p.waitForFunction(() => /overtime/i.test(document.body.innerText));
  await p.evaluate(() => ftCOI()); await p.waitForSelector('#coicard');
  const exp = ymd(now + 20 * DAY);
  await p.evaluate((exp) => { const e = document.getElementById('coie'); if (e) e.value = exp; const i = document.getElementById('coii'); if (i) i.value = 'Acme Mutual'; return ftCoiUp(new File([new Uint8Array([37, 80, 68, 70])], 'COI 2026.pdf', { type: 'application/pdf' })); }, exp);
  await p.waitForFunction(() => /Acme Mutual/.test(document.getElementById('coicard')?.innerText || ''), { timeout: 8000 });
  const n0 = featOutbox.length;
  await p.evaluate(() => { document.getElementById('coito').value = 'astinson@howard.com'; return ftCoiSend(); }); await w(800);
  const m = featOutbox.slice(n0); if (m.length !== 1 || m[0].to !== 'austin@techsourcedsolutions.com') fail('COI mail routing ' + JSON.stringify(m.map((x) => x.to)));
  await shot(p, 'coi'); await p.close();
  // Crew: Spanish mode toggle + Spanish voice phrases map to English commands
  p = await open('0123'); await p.waitForSelector('#langbtn', { timeout: 10000 });
  await p.click('#langbtn'); await w(400);
  const es = await p.evaluate(() => ({ lang: FTLANG(), x1: FTX('marcar salida'), x2: FTX('lista de seguridad'), x3: FTX('todo marcado'), btn: document.getElementById('langbtn').textContent }));
  if (es.lang !== 'es-US' || es.x1 !== 'clock out' || es.x2 !== 'safety checklist' || es.x3 !== 'all checked' || es.btn !== 'EN') fail('Spanish ' + JSON.stringify(es));
  await shot(p, 'crew-spanish');
  await p.click('#langbtn'); await w(300); if (await p.evaluate(() => FTLANG()) !== 'en-US') fail('back to English');
  await p.close();
  console.log('batch3 e2e ok');
} finally { await browser.close(); server.close(); }
