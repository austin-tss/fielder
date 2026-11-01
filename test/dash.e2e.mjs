// Parity batch 2 end to end on the mock: Owner one-screen dashboard + tabs, status chips + voice, speed layer,
// Labor card + Labor compare, Timber (chat + hands-free voice). Real Code.gs feature code runs in the emulator.
import puppeteer from 'puppeteer-core';
import { start, addJob, featOn, mockEmployees } from './mock-server.mjs';
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port, api = base + '/exec';
const DAY = 864e5, iso = (ms) => new Date(ms).toISOString(), ymd = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(ms));
let gemQ = [];
const F = featOn({ props: { GEMINI_API_KEY: 'test-key-not-real', EMPLOYEES_JSON: '[]' }, fetch: (url, o) => {
  if (!/generativelanguage/.test(url)) return { code: 599, body: 'offline' };
  const b = JSON.parse(o.payload), last = b.contents.at(-1); gemQ.push(b);
  if (last.parts[0].text) return { code: 200, body: { candidates: [{ content: { parts: [{ functionCall: { name: 'labor', args: { from: ymd(Date.now()), to: ymd(Date.now()), by: 'none' } } }] } }] } };
  const t = last.parts[0].functionResponse.response.result.total; return { code: 200, body: { candidates: [{ content: { parts: [{ text: `Labor today is $${Math.round(t.labor)} against $${Math.round(t.cmp)} of jobs.` }] } }] } };
} });
const now = Date.now();
addJob({ id: 'D-1', est: 'FT-EST-2026-0301', name: 'Linda Whitaker', address: '12 Oak Hollow Dr', email: 'l@example.com', status: 'approved', service: 'Removal', source: 'Google', items: [{ title: 'Removal', price: 1200 }], created: iso(now - DAY), photos: [], crew: [] });
addJob({ id: 'D-2', est: 'FT-EST-2026-0302', name: 'Rita Caldwell', address: '7 Magnolia Ct', email: 'r@example.com', status: 'approved', service: 'Pruning', source: 'Referral', items: [{ title: 'Pruning', price: 300 }], created: iso(now - 3 * DAY), photos: [], crew: [] });
addJob({ id: 'D-3', est: 'FT-EST-2026-0303', name: 'Gus Future', address: '1 Later Rd', email: 'g@example.com', status: 'approved', items: [{ title: 'Trim', price: 500 }], created: iso(now - 2 * DAY), photos: [], crew: [] });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); }; const w = (ms) => new Promise((r) => setTimeout(r, ms));
const shot = async (p, n) => { await p.evaluate(() => document.querySelectorAll('#toast').forEach((e) => e.remove())); await p.screenshot({ path: '/workspace/fielder-parity3-' + n + '.png' }); };
const reqs = [];
async function open(pin) {
  const p = await browser.newPage(); await p.setViewport({ width: 390, height: 844 });
  await p.evaluateOnNewDocument(() => { localStorage.fdHome = 'forms'; localStorage.fdTips = 'off'; window.SPOKE = [];
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speak(u) { SPOKE.push(u.text); setTimeout(() => u.onend && u.onend(), 50); }, cancel() {} } }); window.SpeechSynthesisUtterance = function (t) { this.text = t; };
    window.FAKESR = []; window.SpeechRecognition = class { constructor() { FAKESR.push(this); } start() { this.live = true; } stop() { this.live = false; this.onend && this.onend(); } abort() { this.live = false; }
      say(t) { this.onresult && this.onresult({ results: [[{ transcript: t, confidence: 0.9 }]], resultIndex: 0 }); this.live = false; this.onend && this.onend(); } }; });
  p.on('dialog', (d) => d.accept()); p.on('pageerror', (e) => console.log('PAGEERR', e.message)); p.on('request', (r) => reqs.push({ url: r.url(), body: r.postData() || '' }));
  await p.goto(base + '/?api=' + encodeURIComponent(api), { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.pin button'); for (const d of pin) await p.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
  return p;
}
const say = (p, t) => p.evaluate((t) => FDVH.route(t), t);
try {
  // Labor today: Jake 4 h at $25 on today's two jobs ($1,500 of job $) -> $100 = 6.7% (green)
  mockEmployees.push({ id: 'E9', name: 'Jake Saw', role: 'Crew', pin: '5599', payRate: 25 });
  let p = await open('4321');
  await p.waitForSelector('#dgrid', { timeout: 10000 });
  await p.evaluate((d) => Promise.all([api({ a: 'block', block: { id: 'BD1', date: d, start: '08:00', end: '12:00', job: 'D-1' } }), api({ a: 'block', block: { id: 'BD2', date: d, start: '12:30', end: '16:30', job: 'D-2' } }), api({ a: 'block', block: { id: 'BD3', date: '2099-01-02', start: '08:00', end: '12:00', job: 'D-3' } })]), ymd(now));
  F.post({ a: 'clockIn', pin: '4321', forWho: 'Jake Saw' });
  for (const n of F.ctx.clockNames_(now - DAY, now)) { const a = F.ctx.clockRead_(n); a.forEach((x) => { x.in = iso(now - 4 * 3600000 - 60000); x.out = iso(now - 60000); }); F.ctx.clockWrite_(n, a); }
  await p.evaluate(() => { localStorage.removeItem('fdDash'); window.fdCacheBust && fdCacheBust(); return refresh && refresh(); }); await p.evaluate(() => ownerHome()); await w(600);
  await p.waitForFunction(() => /\$100/.test(document.getElementById('dc-lab')?.textContent), { timeout: 8000 }).catch(async (e) => { console.log(await p.$eval('#dc-lab', (x) => x.textContent), JSON.stringify(F.post({ a: 'dash', pin: '4321' })).slice(0, 400)); throw e; });
  // (A) one screen, sticky tab bar with the 7 sections, nothing below the fold
  const L = await p.evaluate(() => ({ sh: document.documentElement.scrollHeight, ih: innerHeight, bottom: document.getElementById('dgrid').getBoundingClientRect().bottom, tabs: [...document.querySelectorAll('#dnav button')].map((b) => b.textContent.trim()), pos: getComputedStyle(document.getElementById('dnav')).position }));
  if (L.sh > L.ih) console.log(await p.evaluate(() => [...document.querySelectorAll('body *')].map((e) => [e.tagName + '#' + e.id + '.' + e.className, Math.round(e.getBoundingClientRect().bottom), getComputedStyle(e).position]).sort((a, b) => b[1] - a[1]).slice(0, 6).concat([getComputedStyle(document.body).paddingBottom, getComputedStyle(A).paddingBottom, getComputedStyle(A).marginBottom, A.getBoundingClientRect().bottom])));
  if (L.sh > L.ih || L.bottom > L.ih - 70) fail('dashboard scrolls ' + JSON.stringify(L));
  for (const t of ['Quotes', 'Schedule', 'Jobs / Crew', 'Invoices', 'Team & Time', 'Business tools', 'Settings']) if (!L.tabs.some((x) => x.includes(t))) fail('tab ' + t);
  if (L.pos !== 'sticky') fail('tab bar not sticky');
  const lab = await p.$eval('#dc-lab', (e) => e.innerHTML); if (!/pp pg/.test(lab) || !/7%/.test(lab) || !/\$1,500/.test(lab)) fail('labor card ' + lab);
  if (/\bAI\b/.test(await p.evaluate(() => document.body.innerText))) fail('AI word on dashboard');
  if (!/Owner view/.test(await p.evaluate(() => document.body.innerText))) fail('header not Owner view');
  await shot(p, 'owner-dash');
  // every number drills down, and Home comes back to the dashboard
  for (const id of ['dc-lab', 'dc-wk', 'dc-mo', 'dc-open', 'dc-q', 'dc-appr', 'dc-close', 'dc-now', 'dc-jobs']) {
    await p.evaluate(() => ownerHome()); await p.waitForSelector('#' + id, { timeout: 5000 });
    const before = await p.evaluate(() => A.innerHTML.length); await p.click('#' + id); await w(250);
    const st = await p.evaluate(() => ({ v: view, dg: !!document.getElementById('dgrid') })); if (st.dg) fail('card did not drill down: ' + id + ' ' + before);
  }
  // tabs: each page has the bar with Home (and the app Back/Home); Home returns to the dashboard
  for (const k of ['quotes', 'jobs', 'inv', 'team', 'tools', 'set']) { await p.evaluate(() => ownerHome()); await p.waitForSelector('#dn-' + k); await p.click('#dn-' + k); await w(150);
    if (!(await p.$('#dn-dash'))) fail('no Home on tab ' + k); await p.click('#dn-dash'); await p.waitForSelector('#dgrid', { timeout: 4000 }); }
  // Team & Time keeps the old Owner tools (clock in/out, who is on, labor)
  await p.click('#dn-team'); await p.waitForSelector('#ow-now'); await p.waitForSelector('#ow-in');
  await p.click('#dn-tools'); await p.waitForSelector('#ftcard'); await p.waitForSelector('#s-timber');
  // (C) speed: tab switch and cached screens render well under 150 ms
  await p.evaluate(() => ownerHome()); await p.waitForSelector('#dgrid');
  const ms = await p.evaluate(async () => { const t = []; const m = (f) => { const a = performance.now(); f(); t.push(performance.now() - a); };
    m(() => ownerSect('quotes')); m(() => ownerSect('jobs')); m(() => ownerHome()); m(() => ftJobs('all')); m(() => ownerSect('set')); m(() => ownerHome()); return t; });
  if (Math.max(...ms) > 150) fail('slow taps ' + ms.map((x) => x.toFixed(0)));
  if (!reqs.some((r) => /"a":"bundle"/.test(r.body))) fail('no bundled load at sign-in');
  if (!reqs.some((r) => /a=quotePublic&t=warm/.test(r.url))) fail('no keep-warm ping');
  // optimistic write: changes on tap, undone if the server refuses (mock has no 'paid' action)
  const opt = await p.evaluate(async () => { const j = jobs.find((x) => x.id === 'D-1'); j.invoice = { amount: '$1200' }; const pr = api({ a: 'paid', id: 'D-1', paid: true }); const now = !!j.invoice.paid; let err = ''; try { await pr; } catch (e) { err = e.message; } return { now, after: !!jobs.find((x) => x.id === 'D-1').invoice.paid, err }; });
  if (!opt.now || opt.after) fail('optimistic ' + JSON.stringify(opt));
  // (D) Labor compare: Day/Week/Month, every measure and breakdown, chart + table, drill-down, voice
  await p.evaluate(() => ownerHome()); await p.waitForSelector('#dc-lab'); await p.click('#dc-lab'); await p.waitForSelector('#lctot', { timeout: 6000 });
  for (const id of ['lp-day', 'lp-week', 'lp-month', 'lv-jobs', 'lv-invoiced', 'lv-collected', 'lv-quoted', 'lv-hours', 'lb-job', 'lb-crew', 'lb-customer', 'lb-source', 'lb-service']) if (!(await p.$('#' + id))) fail('labor compare control ' + id);
  await p.click('#lb-source'); await p.waitForFunction(() => /Google/.test(document.body.innerText) && /Referral/.test(document.body.innerText), { timeout: 6000 });
  if (!(await p.$('.lc .bar'))) fail('no chart bars'); await shot(p, 'labor-compare');
  await p.click('#lp-week'); await p.waitForFunction(() => document.getElementById('lp-week').classList.contains('on'));
  await say(p, 'labor this month by crew'); await p.waitForFunction(() => document.getElementById('lp-month')?.classList.contains('on') && document.getElementById('lb-crew')?.classList.contains('on') && /Jake Saw/.test(document.body.innerText), { timeout: 6000 }).catch(async (e) => { console.log(await p.evaluate(() => A.innerText.slice(0, 900))); throw e; });
  // (B) status chips with counts + voice
  await say(p, 'show scheduled jobs'); await p.waitForSelector('#fchips');
  const ch = await p.evaluate(() => ({ title: document.querySelector('.listhead h2').textContent, sch: document.getElementById('fc-scheduled').textContent, prog: document.getElementById('fc-progress').textContent }));
  if (!/^Scheduled jobs \(1\)/.test(ch.title) || !/1/.test(ch.sch) || !/2/.test(ch.prog)) fail('chips ' + JSON.stringify(ch));
  await p.click('#fc-progress'); await p.waitForFunction(() => /^In progress jobs \(2\)/.test(document.querySelector('.listhead h2').textContent));
  await shot(p, 'job-chips');
  await p.evaluate(() => ownerHome());
  // (E) Timber: chat + hands-free voice; exact numbers from the server; never the word AI
  if (!/Owner view/.test(await p.evaluate(() => document.body.innerText))) fail('header lost Owner view after drill-down'); await p.waitForSelector('#dtimber'); await p.click('#dtimber'); await p.waitForSelector('#tbchat');
  await p.type('#tbq', 'labor today vs jobs'); await p.click('#tbsend');
  await p.waitForFunction(() => /Labor today is \$100 against \$1500/.test(document.getElementById('tbmsgs').innerText), { timeout: 8000 });
  if (/\bAI\b/.test(await p.evaluate(() => document.body.innerText))) fail('AI word in Timber');
  await shot(p, 'timber');
  await p.click('#tbvoice'); await p.waitForSelector('#tbmic'); await p.click('#tbmic'); await w(100);
  await p.evaluate(() => FAKESR.at(-1).say('what was labor today'));
  await p.waitForFunction(() => SPOKE.some((t) => /\$100/.test(t)), { timeout: 8000 }).catch(async (e) => { console.log(await p.$eval('#tbmsgs', (x) => x.innerText), gemQ.length, JSON.stringify(gemQ.at(-1)?.contents.at(-1)).slice(0, 600)); throw e; });
  await p.waitForFunction(() => FAKESR.at(-1).live, { timeout: 4000 }); // listens again after talking back
  await shot(p, 'timber-voice');
  if (!gemQ.length || gemQ.some((b) => !b.tools[0].functionDeclarations.length)) fail('Gemini function calling not used');
  await p.close();
  console.log('dash e2e ok');
} finally { await browser.close(); server.close(); }
