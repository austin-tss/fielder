// Batch 6 (Miller 2374915 + 46db9db + 25bea9d) end to end on the mock: Timber streaming through the real Worker /api/timber code
// (sentence-by-sentence speech, function calls through Apps Script, fallback), sidebar highlight, supply approval (in app + signed
// email links through the Worker /a page), customer quote links through /a, receipt scanner and the Owner Receipts page.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { start, addJob, featOn, featOutbox, mockEmployees, mockJobs, setGemStream, STREAMS, GEMCALLS } from './mock-server.mjs';
let GEM = [];
const F = featOn({ props: { GEMINI_API_KEY: 'test-key-not-real' }, fetch: (url, o) => {
  if (!/generativelanguage/.test(url)) return { code: 599, body: 'offline' };
  const b = JSON.parse(o.payload); if (b.generationConfig && b.generationConfig.responseSchema && b.generationConfig.responseSchema.properties && b.generationConfig.responseSchema.properties.store) return { code: 200, body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ store: 'Home Depot', date: '2026-10-28', total: 67.12, tax: 4.2, items: [{ name: 'Bar oil', qty: 2, price: 31.46 }] }) }] } }] } }; if (b.generationConfig && b.generationConfig.responseModalities) return { code: 200, body: { candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/wav', data: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' } }] } }] } };
  const r = GEM.shift(); return { code: 200, body: r ? r(b) : { candidates: [{ content: { parts: [{ text: 'OK.' }] } }] } }; } });
mockEmployees.push({ id: 'E9', name: 'Carlos Ruiz', role: 'Crew', pin: '7711' });
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port, api = base + '/exec';
const DAY = 864e5, iso = (ms) => new Date(ms).toISOString();
addJob({ id: 'D5-1', est: 'FT-EST-2026-0601', jobNo: 'FT-JOB-2026-0601', wonAt: iso(Date.now()), name: 'Dana Desk', address: '1 Wide St', email: 'd@example.com', status: 'approved', items: [{ title: 'Removal', price: 900 }], created: iso(Date.now() - DAY), photos: [], crew: [] });
addJob({ id: 'D5-2', est: 'FT-EST-2026-0602', name: 'Quinn Quote', address: '2 Wide St', email: 'q@example.com', status: 'sent', items: [{ title: 'Trim', price: 300 }], created: iso(Date.now() - DAY), photos: [], crew: [] });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); }; const w = (ms) => new Promise((r) => setTimeout(r, ms));
const say = (t) => () => ({ candidates: [{ content: { parts: [{ text: t }] } }] });
const call = (name, args) => () => ({ candidates: [{ content: { parts: [{ functionCall: { name, args } }] } }] });
async function open(pin, width, opts = {}) {
  const p = await browser.newPage(); await p.setViewport({ width, height: width >= 768 ? 900 : 844 });
  await p.evaluateOnNewDocument((noSS) => { localStorage.fdHome = 'forms'; localStorage.fdTips = 'off'; localStorage.fdSimple = 'on'; window.SPOKE = [];
    if (noSS) Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined });
    else Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speaking: false, getVoices: () => [{ name: 'Samantha', lang: 'en-US' }, { name: 'Google US English', lang: 'en-US' }], addEventListener() {}, speak(u) { SPOKE.push({ t: u.text, v: u.voice && u.voice.name }); setTimeout(() => { u.onstart && u.onstart(); u.onend && u.onend(); }, 30); }, cancel() {} } });
    window.SpeechSynthesisUtterance = function (t) { this.text = t; };
    HTMLMediaElement.prototype.play = function () { window.PLAYED = (window.PLAYED || 0) + 1; setTimeout(() => this.onended && this.onended(), 30); return Promise.resolve(); };
  }, !!opts.noSS);
  await p.setRequestInterception(true); p.on('request', (r) => { if (new URL(r.url()).hostname !== '127.0.0.1') return r.abort(); r.continue(); });
  p.on('dialog', (d) => d.accept()); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(base + '/?api=' + encodeURIComponent(api), { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.pin button'); for (const d of pin) await p.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
  await p.waitForFunction(() => typeof jobs !== 'undefined' && jobs.length > 0, { timeout: 10000 });
  return p;
}
const shot = (p, n) => p.screenshot({ path: '/workspace/fielder-parity9-' + n + '.png' });
const chunk = (t) => ({ candidates: [{ content: { parts: [{ text: t }] } }] }), fc = (name, args) => ({ candidates: [{ content: { parts: [{ functionCall: { name, args } }] } }] });
const linkIn = (m, v) => new URL((m.body.match(new RegExp((v === 'yes' ? 'Approve' : 'Deny') + ': (\\S+)')) || [])[1]);
try {
  // ---- Timber streaming via the Worker route ----
  let GS = []; setGemStream(() => GS.shift() || null);
  let p = await open('4321', 1280); await p.waitForSelector('#ds-timber'); await p.click('#ds-timber'); await p.waitForSelector('#tbq');
  await p.waitForFunction(() => true); await w(300); await p.click('#tbspk'); if (!STREAMS.some((s) => s.warm && s.pin === '4321')) fail('Timber did not warm the context');
  GS = [[chunk('Labor today is $100. '), chunk('Nobody is on the clock.')]];
  await p.type('#tbq', 'labor today'); await p.click('#tbsend');
  await p.waitForFunction(() => window.TB_STREAM === 'stream' && /Nobody is on the clock/.test(document.getElementById('tbmsgs').innerText), { timeout: 8000 });
  await p.waitForFunction(() => window.TB_SAID.length >= 2, { timeout: 4000 }).catch(() => {}); const said = await p.evaluate(() => window.TB_SAID); if (said.length !== 2 || !/\$100\.$/.test(said[0])) fail('sentence by sentence ' + JSON.stringify(said));
  const g0 = GEMCALLS[0]; if (!/models\/gemini-3\.5-flash-lite:streamGenerateContent\?alt=sse/.test(g0.url) || g0.body.generationConfig.thinkingConfig.thinkingLevel !== 'minimal' || !/SNAPSHOT: /.test(g0.body.systemInstruction.parts[0].text)) fail('stream request ' + g0.url);
  if (!/Fielder/.test(g0.body.systemInstruction.parts[0].text)) fail('Fielder prompt');
  await shot(p, 'timber-stream');
  GS = [[fc('addSupply', { item: 'wedges', qty: '6' })], [chunk('Added wedges to Supplies. It is waiting approval.')]];
  await p.type('#tbq', 'order 6 wedges'); await p.click('#tbsend');
  await p.waitForFunction(() => [...document.querySelectorAll('#tbmsgs button')].some((b) => /Open Supplies/.test(b.textContent)), { timeout: 8000 });
  if (!GEMCALLS.at(-1).body.contents.some((c) => c.parts.some((x) => x.functionResponse && x.functionResponse.name === 'addSupply'))) fail('function result fed back');
  GS = []; GEM = [say('Fallback answer.')]; await p.type('#tbq', 'anything'); await p.click('#tbsend');
  await p.waitForFunction(() => window.TB_STREAM === 'fallback' && /Fallback answer/.test(document.getElementById('tbmsgs').innerText), { timeout: 8000 });
  // ---- sidebar highlight follows the page ----
  for (const [js, id] of [["ownerSect('money')", 'money'], ['ftNeed()', 'need'], ['ftReceipts()', 'rcps'], ['ownerHome()', 'home'], ["ownerSect('jobs')", 'jobs'], ["ftSupplies()", 'more']]) {
    await p.evaluate(js); await p.waitForFunction((id) => { const b = document.querySelector('#dside button.on'); return b && b.id === 'ds-' + id; }, { timeout: 4000 }, id).catch(() => fail('highlight ' + js));
  }
  await p.close();
  // ---- supply approval ----
  const m0 = featOutbox.length;
  p = await open('7711', 390); await p.waitForSelector('#s-more'); await p.click('#s-more'); await p.waitForSelector('#m-sup'); await p.click('#m-sup'); await p.waitForSelector('#su-i');
  await p.type('#su-i', 'Bar oil'); await p.click('#su-add'); await p.waitForFunction(() => /Bar oil/.test(A.innerText) && /Waiting approval/.test(A.innerText), { timeout: 6000 });
  if (await p.$('[id^="sok-"]')) fail('crew can approve'); await shot(p, 'supply-waiting-crew');
  await p.type('#su-i', 'Rope'); await p.click('#su-add'); await p.waitForFunction(() => /Rope/.test(A.innerText), { timeout: 6000 }); await p.close();
  const sm = featOutbox.slice(m0); if (sm.length !== 2 || sm.some((m) => m.to !== 'austin@techsourcedsolutions.com')) fail('supply mails ' + JSON.stringify(sm.map((m) => m.to)));
  const oilMail = sm.find((m) => /Bar oil/.test(m.subject)), ropeMail = sm.find((m) => /Rope/.test(m.subject));
  if (!/^https:\/\/fielder\.tss-receivables\.workers\.dev\/a\?a=ok&k=sup/.test(linkIn(oilMail, 'yes').href)) fail('link host ' + linkIn(oilMail, 'yes').href);
  p = await open('1234', 1280); await p.evaluate(() => ftSupplies()); await p.waitForSelector('[id^="sok-"]'); await shot(p, 'supply-approve-estimator');
  const oilId = linkIn(oilMail, 'yes').searchParams.get('id'); await p.click('#sok-' + oilId); await p.waitForFunction((id) => /Needed/.test((document.getElementById('sup-' + id) || {}).innerText || ''), { timeout: 6000 }, oilId); await p.close();
  // email link for Rope, opened on the Worker page (mock host stands in for ft.vnxt.app)
  p = await browser.newPage(); await p.setViewport({ width: 390, height: 844 });
  const rl = linkIn(ropeMail, 'yes'); await p.goto(base + rl.pathname + rl.search); if (!/✔ Approved: Rope/.test(await p.evaluate(() => document.body.innerText))) fail('approve page'); await shot(p, 'email-approve-page');
  await p.goto(base + rl.pathname + rl.search); if (!/Already Needed/.test(await p.evaluate(() => document.body.innerText))) fail('single use'); await shot(p, 'email-approve-again');
  const ol = linkIn(oilMail, 'no'); await p.goto(base + ol.pathname + ol.search); if (!/Nothing changed/.test(await p.evaluate(() => document.body.innerText))) fail('deny after approve');
  // customer quote answer through /a
  await p.goto(base + '/x?a=respond&id=D5-2&ans=B'); await p.waitForSelector('textarea[name=text]'); await shot(p, 'customer-respond-form');
  await p.type('textarea[name=text]', 'Can you do it for less?'); await Promise.all([p.waitForNavigation(), p.click('button.go')]);
  if (!/Thank you/.test(await p.evaluate(() => document.body.innerText)) || new URL(p.url()).pathname !== '/x') fail('respond via worker ' + p.url());
  if (mockJobs.find((j) => j.id === 'D5-2').response.text !== 'Can you do it for less?') fail('response saved'); await shot(p, 'customer-respond-done'); await p.close();
  // ---- receipt scanner (crew) and Owner Receipts page ----
  const m1 = featOutbox.length;
  p = await open('7711', 390); await p.waitForSelector('#s-rcp'); await shot(p, 'crew-home-receipt'); await p.click('#s-rcp'); await p.waitForSelector('#rc-file');
  await p.select('#rc-job', 'D5-1'); const inp = await p.$('#rc-file'); await inp.uploadFile('/workspace/fielder-parity8-owner-phone.png');
  await p.waitForSelector('#rc-done', { timeout: 10000 }); if (!/Home Depot/.test(await p.$eval('#rc-done', (e) => e.innerText)) || !/67\.12/.test(await p.$eval('#rc-done', (e) => e.innerText))) fail('receipt read');
  await shot(p, 'receipt-scanned'); await p.close();
  if (featOutbox.length !== m1) fail('receipt sent an email');
  const cost = (mockJobs.find((j) => j.id === 'D5-1').costs || []).find((c) => c.kind === 'materials'); if (!cost || cost.amt !== 67.12) fail('job materials cost');
  p = await open('4321', 1280); await p.waitForSelector('#ds-rcps'); await p.click('#ds-rcps'); await p.waitForSelector('.rcard');
  const rc = await p.evaluate(() => ({ t: A.innerText, months: [...document.querySelectorAll('#rc-month option')].map((o) => o.value) }));
  if (!/Home Depot/.test(rc.t) || !/Carlos Ruiz/.test(rc.t) || !/Dana Desk/.test(rc.t) || !/Tax \$4\.20/.test(rc.t) || !rc.months.includes('2026-10')) fail('receipts page ' + JSON.stringify(rc));
  if (!(await p.$eval('#ds-rcps', (b) => b.classList.contains('on')))) fail('receipts tab highlight');
  await p.evaluate(() => document.querySelector('.rcard details').open = true); await shot(p, 'owner-receipts');
  await p.evaluate(() => document.querySelector('[id^="rp-"]').click()); await p.waitForFunction(() => /✔ Reimbursed/.test(A.innerText), { timeout: 6000 });
  await p.select('#rc-month', '2026-10'); await p.waitForFunction(() => /1 receipt ·/.test(A.innerText) && document.getElementById('rc-month').value === '2026-10', { timeout: 6000 });
  await shot(p, 'owner-receipts-reimbursed');
  await p.evaluate(() => ownerSect('money')); await p.waitForSelector('#s-rcps'); await p.evaluate(() => ownerSect('more')); await p.waitForSelector('#s-rcps2'); await p.close();
  console.log('batch6 e2e ok');
} finally { await browser.close(); server.close(); }
