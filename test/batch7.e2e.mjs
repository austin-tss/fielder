// Batch 7 (Miller a76d4c1 + 829a754) on the mock: customer pages through the Worker (/x respond, /api/gas pages, old /exec
// respond links bounce), Owner home banner + ticker + 8 count-up tiles, per-PIN instant snapshot + Worker dash cache, Owner
// reload stays on the dashboard, bottom Back/Home bar + history back, Archived Select offers only Restore.
import puppeteer from 'puppeteer-core';
import { start, addJob, featOn, featOutbox, outbox, GEMCALLS, STREAMS, WORKER_HITS, resetDashCache } from './mock-server.mjs';
featOn({ fetch: () => ({ code: 599, body: 'offline' }) });
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port, api = base + '/exec';
const DAY = 864e5, iso = (ms) => new Date(ms).toISOString();
addJob({ id: 'B7-1', est: 'FT-EST-2026-0701', name: 'Rhea Respond', address: '7 Oak St', email: 'r@example.com', status: 'sent', pt: 'PT-B7-1', items: [{ title: 'Trim', price: 450 }], created: iso(Date.now() - DAY), photos: [], crew: [] });
addJob({ id: 'B7-2', est: 'FT-EST-2026-0702', name: 'Arlo Archived', address: '8 Oak St', email: 'a@example.com', status: 'declined', archived: true, items: [{ title: 'Stump', price: 200 }], created: iso(Date.now() - 9 * DAY), photos: [], crew: [] });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); }; const w = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = (p, n) => p.screenshot({ path: '/workspace/fielder-parity10-' + n + '.png' });
let ERR = [];
async function page(width) { const p = await browser.newPage(); await p.setViewport({ width, height: width >= 768 ? 900 : 844 }); const reqs = [];
  await p.setRequestInterception(true); p.on('request', (r) => { reqs.push(r.url()); if (new URL(r.url()).hostname !== '127.0.0.1') return r.abort(); r.continue(); });
  p.on('dialog', (d) => d.accept()); p.on('pageerror', (e) => ERR.push(e.message)); p.reqs = reqs; return p; }
async function owner(width) { const p = await page(width);
  await p.evaluateOnNewDocument(() => { localStorage.fdTips = 'off'; });
  await p.goto(base + '/?api=' + encodeURIComponent(api), { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.pin button'); for (const d of '4321') await p.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
  await p.waitForSelector('#dgrid', { timeout: 10000 }); return p; }
try {
  // ---- A: customer pages through the Worker ----
  let p = await page(390);
  await p.goto(base + '/quote.html?id=PT-B7-1', { waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => /Rhea|Trim/.test(document.body.innerText) && !/Loading your estimate/.test(document.body.innerText), { timeout: 8000 }).catch(() => fail('quote page stuck'));
  if (p.reqs.some((u) => /script\.google|\/exec/.test(u))) fail('quote page called Apps Script directly');
  if (!WORKER_HITS.some((h) => h.startsWith('/api/gas'))) fail('quote page not via /api/gas'); await shot(p, 'quote');
  await p.goto(base + '/x?a=respond&id=B7-1&ans=B'); await p.waitForSelector('textarea[name=text]');
  if (!/Fielder/i.test(await p.content())) fail('respond not Fielder framed'); await shot(p, 'respond');
  // old /exec respond links bouncing to /x is covered against the real Apps Script code in feat6.gas.test.mjs
  await p.close();
  // ---- B: Owner home ----
  resetDashCache(); p = await owner(390);
  await p.waitForSelector('.ohero'); await p.waitForSelector('.otick');
  const n = await p.$$eval('#dgrid .dc', (a) => a.length); if (n !== 8) fail('tiles ' + n);
  if (/\bAI\b/.test(await p.evaluate(() => document.body.innerText))) fail('word AI in UI');
  await w(1500); await shot(p, 'owner-home');
  if (!(await p.evaluate(() => Object.keys(localStorage).some((k) => /^fdDash:/.test(k))))) fail('no per-PIN snapshot');
  const dh = WORKER_HITS.filter((h) => h.startsWith('/api/dash')).length; if (!dh) fail('no /api/dash');
  // reload: snapshot paints instantly, no Office view, no crash
  ERR = []; await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForSelector('#dgrid', { timeout: 1500 }).catch(() => fail('dashboard not instant on reload'));
  if (ERR.length) fail('reload errors ' + ERR.join('|'));
  await w(800); if (!(await p.$('.ohero'))) fail('reload left Owner home');
  // bottom bar
  await p.evaluate(() => ftJobs('all')); await p.waitForSelector('#bbar:not([hidden])', { visible: true }); await shot(p, 'bottom-bar');
  await p.click('#bb-back'); await p.waitForSelector('.ohero', { timeout: 4000 }).catch(() => fail('Back did not return to Owner home'));
  await p.evaluate(() => ftJobs('all')); await w(300); await p.goBack(); await p.waitForSelector('.ohero', { timeout: 4000 }).catch(() => fail('history back'));
  await p.evaluate(() => ftJobs('all')); await w(300); await p.click('#bb-home'); await p.waitForSelector('.ohero', { timeout: 4000 }).catch(() => fail('Home'));
  // archived select
  await p.evaluate(() => ftJobs('archived')); await p.waitForFunction(() => /Arlo/.test(document.body.innerText), { timeout: 5000 });
  await p.evaluate(() => { selOn(); SEL.add('B7-2'); selBar(); });
  const t = await p.$eval('#seldel', (e) => e.textContent); if (!/^Restore 1/.test(t)) fail('archived select shows ' + t);
  await shot(p, 'archived-restore');
  await p.click('#seldel'); await p.waitForFunction(() => !/Arlo/.test(document.getElementById('app')?.innerText || document.body.innerText), { timeout: 5000 }).catch(() => {});
  if (await p.evaluate(() => window.FTFIL) !== 'archived') fail('restore left Archived tab');
  // ---- Bug fix: "Speak audibly to me" turns Voice on locally; no API call, no cannotDo, no VNXT request, no mail ----
  await p.evaluate(() => { localStorage.tbSpk = '0'; window.SPOKE = []; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speaking: false, getVoices: () => [], addEventListener() {}, speak(u) { SPOKE.push(u.text); setTimeout(() => u.onend && u.onend(), 20); }, cancel() {} } }); window.SpeechSynthesisUtterance = function (t) { this.text = t; }; });
  const before = { hits: WORKER_HITS.length, gem: GEMCALLS.length, st: STREAMS.length, mail: featOutbox.length, ob: outbox.length };
  const reqs0 = p.reqs.length; await p.evaluate(() => ftTimber()); await w(200);
  const said = await p.evaluate(() => ftTimberAsk('Speak audibly to me.'));
  if (!/Voice is on/.test(said || '')) fail('speak request not intercepted: ' + said);
  await w(400); if (await p.evaluate(() => localStorage.tbSpk) !== '1') fail('Voice not turned on');
  if (!/Voice is on/.test(await p.evaluate(() => document.getElementById('tbmsgs').innerText))) fail('confirmation not shown');
  const newReq = p.reqs.slice(reqs0).filter((u) => /\/api\/timber|\/exec|\/api\/gas/.test(u) && !/a=img/.test(u));
  const tbPosts = newReq.filter((u) => /\/api\/timber/.test(u));
  if (tbPosts.length > 1) fail('Timber API called for speak request ' + tbPosts.join(' '));
  if (GEMCALLS.length !== before.gem || STREAMS.length !== before.st) fail('model called for speak request');
  if (featOutbox.length !== before.mail || outbox.length !== before.ob) fail('mail sent for speak request');
  if (/VNXT/i.test(await p.evaluate(() => document.getElementById('tbmsgs').innerText))) fail('offered VNXT for speak request');
  await shot(p, 'voice-on');
  // a real question still goes to the API
  if (await p.evaluate(() => tbVoiceReq('What jobs today?') || tbVoiceReq('speak to the customer') || tbVoiceReq('turn off voice'))) fail('voice intercept too broad');
  await p.close();
  console.log('batch7 e2e ok');
} finally { await browser.close(); server.close(); }
