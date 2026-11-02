// Batch 5 (Miller 918c4d0) end to end on the mock: computer/iPad layout (sidebar per role, grids, centered Timber, 2-col forms;
// phone unchanged), Timber talks back (Voice toggle, device voice, Gemini TTS fallback), spreadsheets, Ask the VNXT team, Supplies, VNXT requests.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { start, addJob, featOn, featOutbox, mockEmployees } from './mock-server.mjs';
let GEM = [];
const F = featOn({ props: { GEMINI_API_KEY: 'test-key-not-real' }, fetch: (url, o) => {
  if (!/generativelanguage/.test(url)) return { code: 599, body: 'offline' };
  const b = JSON.parse(o.payload); if (b.generationConfig && b.generationConfig.responseModalities) return { code: 200, body: { candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/wav', data: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' } }] } }] } };
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
const shot = (p, n) => p.screenshot({ path: '/workspace/fielder-parity8-' + n + '.png' });
try {
  // ---- layout: sidebar per role at 1280 and 820, phone unchanged ----
  const SIDE = { '4321': ['home', 'quotes', 'jobs', 'money', 'rcps', 'timber', 'need', 'more'], '1234': ['home', 'quotes', 'jobs', 'sched', 'cust', 'need', 'more'], '6789': ['home', 'ready', 'inv', 'pay', 'cust', 'need', 'more'], '7711': ['home', 'jobs', 'clock', 'need', 'more'] };
  const NAME = { '4321': 'owner', '1234': 'estimator', '6789': 'office', '7711': 'crew' };
  for (const [pin, ids] of Object.entries(SIDE)) for (const width of [1280, 820]) {
    const p = await open(pin, width); await p.waitForSelector('#dside button', { timeout: 6000 });
    const L = await p.evaluate(() => ({ ids: [...document.querySelectorAll('#dside button')].map((b) => b.id.slice(3)), side: getComputedStyle(document.getElementById('dside')).display, app: A.getBoundingClientRect(), sw: document.getElementById('dside').getBoundingClientRect().width, h: Math.min(...[...document.querySelectorAll('#dside button')].map((b) => b.getBoundingClientRect().height)), dnav: document.getElementById('dnav') ? getComputedStyle(document.getElementById('dnav')).display : 'none' }));
    if (JSON.stringify(L.ids) !== JSON.stringify(ids) || L.side !== 'flex' || L.app.left < L.sw || L.app.width > 1040 || L.h < 52 || L.dnav !== 'none') fail('desk layout ' + pin + ' ' + width + ' ' + JSON.stringify(L));
    if (pin === '4321') { await p.waitForSelector('#dgrid'); const cols = await p.$eval('#dgrid', (g) => getComputedStyle(g).gridTemplateColumns.split(' ').length); if (cols !== (width >= 1100 ? 4 : 3)) fail('dashboard columns ' + cols + ' at ' + width); }
    if (pin !== '4321') { const cols = await p.$eval('#shome', (g) => getComputedStyle(g).gridTemplateColumns.split(' ').length); if (cols !== (width >= 1100 ? 3 : 2)) fail('home tiles ' + cols); }
    await shot(p, NAME[pin] + '-' + width);
    if (pin === '1234' && width === 1280) {
      await p.click('#ds-sched'); await w(200); if (!(await p.$eval('#ds-sched', (b) => b.classList.contains('on')))) fail('sidebar active');
      await p.evaluate(() => newq()); await p.waitForSelector('[data-field]'); const two = await p.evaluate(() => { const c = document.querySelector('.card:has(>[data-field])'); return c && getComputedStyle(c).gridTemplateColumns.split(' ').length; }); if (two !== 2) fail('form not 2 columns ' + two);
      await shot(p, 'quote-form-1280');
    }
    if (pin === '4321' && width === 1280) { await p.click('#ds-timber'); await p.waitForSelector('.tb'); const tw = await p.$eval('.tb', (e) => e.getBoundingClientRect().width); if (tw > 760.5) fail('Timber column ' + tw); await shot(p, 'timber-1280'); }
    await p.close();
  }
  { const p = await open('4321', 390); await p.waitForSelector('#dnav'); const m = await p.evaluate(() => ({ side: document.getElementById('dside') ? getComputedStyle(document.getElementById('dside')).display : 'none', nav: getComputedStyle(document.getElementById('dnav')).display, cols: getComputedStyle(document.getElementById('dgrid')).gridTemplateColumns.split(' ').length }));
    if (m.side !== 'none' || m.nav === 'none' || m.cols !== 2) fail('phone layout changed ' + JSON.stringify(m)); await shot(p, 'owner-phone'); await p.close(); }
  // ---- Timber talks back, spreadsheets, VNXT, supplies ----
  let p = await open('4321', 1280); await p.waitForSelector('#ds-timber'); await p.click('#ds-timber'); await p.waitForSelector('#tbspk');
  if (!/Voice on/.test(await p.$eval('#tbspk', (e) => e.textContent))) fail('voice should default on');
  GEM = [say('Labor today is $100.')]; await p.type('#tbq', 'labor today'); await p.click('#tbsend');
  await p.waitForFunction(() => SPOKE.some((x) => /\$100/.test(x.t)), { timeout: 8000 }); if ((await p.evaluate(() => SPOKE.at(-1).v)) !== 'Samantha') fail('voice pick');
  await p.click('#tbspk'); if (!/Voice off/.test(await p.$eval('#tbspk', (e) => e.textContent))) fail('toggle'); const n0 = await p.evaluate(() => SPOKE.length);
  GEM = [say('Two quotes sent.')]; await p.type('#tbq', 'how many quotes'); await p.click('#tbsend'); await p.waitForFunction(() => /Two quotes sent/.test(document.getElementById('tbmsgs').innerText)); await w(200);
  if ((await p.evaluate(() => SPOKE.length)) !== n0) fail('spoke while Voice off'); await p.click('#tbspk');
  GEM = [call('makeSpreadsheet', { what: 'jobs' }), say('Your spreadsheet is ready.')]; await p.type('#tbq', 'spreadsheet of jobs'); await p.click('#tbsend'); await p.waitForSelector('#tbsheet', { timeout: 8000 });
  const dl = '/tmp/fd5dl'; fs.rmSync(dl, { recursive: true, force: true }); fs.mkdirSync(dl); const cdp = await p.target().createCDPSession(); await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dl });
  await p.click('#tbsheet'); await w(800); const f = fs.readdirSync(dl).find((x) => /^Fielder jobs .*\.csv$/.test(x)); if (!f || !/Dana Desk/.test(fs.readFileSync(dl + '/' + f, 'utf8'))) fail('spreadsheet download ' + fs.readdirSync(dl));
  await shot(p, 'timber-sheet');
  GEM = [call('cannotDo', { request: 'Text every customer a coupon' }), say('I cannot do that yet. Want me to ask the VNXT team?')]; const m0 = featOutbox.length;
  await p.evaluate(() => ftTimber()); await p.waitForSelector('#tbq', { visible: true });
  await p.type('#tbq', 'Text every customer a coupon'); await p.click('#tbsend'); await p.waitForSelector('#tbvnxt', { timeout: 8000 }); await shot(p, 'timber-vnxt'); await p.click('#tbvnxt');
  await p.waitForFunction(() => /Sent to the VNXT team/.test(document.getElementById('tbmsgs').innerText), { timeout: 8000 });
  const vm = featOutbox.slice(m0); if (!vm.length || vm.some((m) => m.to !== 'austin@techsourcedsolutions.com')) fail('VNXT mail ' + JSON.stringify(vm.map((m) => m.to)));
  GEM = [call('addSupply', { item: 'chainsaw chains', qty: '4', store: 'Home Depot' }), say('Added chainsaw chains to Supplies.')]; await p.type('#tbq', 'order more chainsaw chains from Home Depot'); await p.click('#tbsend');
  await p.waitForFunction(() => [...document.querySelectorAll('#tbmsgs button')].some((b) => /Open Supplies/.test(b.textContent)), { timeout: 8000 });
  await p.evaluate(() => [...document.querySelectorAll('#tbmsgs button')].find((b) => /Open Supplies/.test(b.textContent)).click()); await p.waitForFunction(() => /chainsaw chains/.test(A.innerText) && /Supplies \(1\)/.test(A.innerText), { timeout: 8000 });
  await p.evaluate(() => [...document.querySelectorAll('[id^="sok-"]')][0].click()); await p.waitForFunction(() => /Needed/.test(A.innerText) && document.querySelector('[id^="sst-"]'), { timeout: 5000 }); await p.evaluate(() => [...document.querySelectorAll('[id^="sst-"]')][0].click()); await p.waitForFunction(() => /Ordered/.test(A.innerText), { timeout: 5000 }); await shot(p, 'supplies');
  await p.evaluate(() => ownerSect('more')); await p.waitForSelector('#s-vx'); await p.click('#s-vx'); await p.waitForFunction(() => /Text every customer a coupon/.test(A.innerText), { timeout: 5000 }); await shot(p, 'vnxt-requests');
  await p.close();
  // Gemini TTS fallback when the device cannot speak
  p = await open('4321', 1280, { noSS: true }); await p.waitForSelector('#ds-timber'); await p.click('#ds-timber'); await p.waitForSelector('#tbq'); GEM = [say('Labor today is $100.')];
  await p.type('#tbq', 'labor today'); await p.click('#tbsend'); await p.waitForFunction(() => window.TB_SPOKE === 'cloud' && window.PLAYED >= 1, { timeout: 8000 }); await p.close();
  // crew adds a supply from More; cannot advance it
  p = await open('7711', 390); await p.waitForSelector('#s-more'); await p.click('#s-more'); await p.waitForSelector('#m-sup'); await p.click('#m-sup'); await p.waitForSelector('#su-i');
  await p.type('#su-i', 'Bar oil'); await p.click('#su-add'); await p.waitForFunction(() => /Bar oil/.test(A.innerText), { timeout: 6000 }); if (!(await p.evaluate(() => [...document.querySelectorAll('[id^="sst-"]')].every((b) => b.disabled)))) fail('crew can advance supplies');
  await p.close();
  console.log('batch5 e2e ok');
} finally { await browser.close(); server.close(); }
