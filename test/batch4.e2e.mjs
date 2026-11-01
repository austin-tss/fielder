// Batch 4 end to end on the mock: crew chips on the schedule form, crew names on entries, crew PIN sees only their
// jobs + Today's job, voice assign, Won quotes with job status, Owner Quotes/Jobs nav, Timber clears on leave,
// Timber quote draft opens for review (nothing sent), Have Timber wording, TEST RUN toast.
import puppeteer from 'puppeteer-core';
import { start, addJob, featOn, featOutbox, mockEmployees, created } from './mock-server.mjs';
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port, api = base + '/exec';
const DAY = 864e5, iso = (ms) => new Date(ms).toISOString(), ymd = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(ms));
featOn({ props: {} });
mockEmployees.push({ id: 'E7', name: 'Carlos Ruiz', role: 'Crew', pin: '7711' }, { id: 'E8', name: 'Tyler Reed', role: 'Crew', pin: '7712' });
const now = Date.now(), td = ymd(now);
addJob({ id: 'H-1', est: 'FT-EST-2026-0501', jobNo: 'FT-JOB-2026-0501', wonAt: iso(now), name: 'Hal Hartwell', address: '4 Elm', email: 'h@example.com', status: 'approved', items: [{ title: 'Removal', price: 2000 }], created: iso(now - DAY), photos: [], crew: [] });
addJob({ id: 'O-1', est: 'FT-EST-2026-0502', name: 'Olive Other', address: '6 Ash', email: 'o@example.com', status: 'approved', items: [{ title: 'Pruning', price: 500 }], created: iso(now - DAY), photos: [], crew: [] });
addJob({ id: 'C-1', est: 'FT-EST-2026-0503', name: 'Cora Complete', address: '8 Bay', email: 'c@example.com', status: 'complete', items: [{ title: 'Grind', price: 300 }], created: iso(now - 2 * DAY), photos: [], crew: [] });
addJob({ id: 'S-1', est: 'FT-EST-2026-0504', name: 'Sid Sent', address: '9 Fir', email: 's@example.com', status: 'sent', items: [{ title: 'Trim', price: 250 }], created: iso(now - 2 * DAY), photos: [], crew: [] });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); }; const w = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(pin, simple) {
  const p = await browser.newPage(); await p.setViewport({ width: 390, height: 844 });
  await p.evaluateOnNewDocument(() => { localStorage.fdHome = 'forms'; localStorage.fdTips = 'off'; }); if (simple) await p.evaluateOnNewDocument(() => { localStorage.fdSimple = 'on'; });
  await p.setRequestInterception(true);
  p.on('request', (r) => { const h = new URL(r.url()).hostname; if (h !== '127.0.0.1') return r.abort(); r.continue(); });
  p.on('dialog', (d) => d.accept()); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(base + '/?api=' + encodeURIComponent(api), { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.pin button'); for (const d of pin) await p.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
  await p.waitForFunction(() => typeof jobs !== 'undefined' && jobs.length > 0, { timeout: 10000 });
  return p;
}
const shot = (p, n) => p.screenshot({ path: '/workspace/fielder-parity6-' + n + '.png' });
try {
  let p = await open('4321');
  await p.evaluate((td) => api({ a: 'block', block: { id: 'BO', date: td, start: '08:00', end: '12:00', job: 'O-1', note: '' } }).then((r) => { blocks = r.blocks; }), td);
  // schedule form: crew chips from the Team list
  await p.evaluate((td) => blk('', td, 'H-1'), td); await p.waitForFunction(() => [...document.querySelectorAll('#crchips button')].some((b) => /Carlos Ruiz/.test(b.textContent)), { timeout: 6000 });
  await p.evaluate(() => { for (const n of ['Carlos Ruiz', 'Tyler Reed']) [...document.querySelectorAll('#crchips button')].find((b) => b.dataset.n === n).click(); });
  if (!(await p.evaluate(() => document.querySelectorAll('#crchips button.on').length === 2))) fail('chips not selected');
  await shot(p, 'crew-chips');
  await p.evaluate(() => saveBlk('')); await p.waitForFunction(() => blocks.some((b) => b.job === 'H-1' && (b.crew || []).length === 2), { timeout: 6000 });
  await p.evaluate((td) => dayView(td), td); await p.waitForFunction(() => /👷 Carlos Ruiz, Tyler Reed/.test(document.body.innerText), { timeout: 4000 });
  await p.evaluate(() => mview('H-1')); await p.waitForSelector('#crline');
  // voice: assign Tyler to Other (server action)
  const said = await p.evaluate(() => FTV2('assign tyler to other')); if (!/Tyler Reed/.test(String(said))) fail('voice assign ' + said);
  await p.waitForFunction(() => (blocks.find((b) => b.id === 'BO') || {}).crew?.includes('Tyler Reed'), { timeout: 6000 });
  // Won quotes show the job status; Quotes tab has the owner nav + New quote
  await p.evaluate(() => ownerHome()); await p.waitForSelector('#dn-quotes'); await p.click('#dn-quotes'); await p.waitForSelector('#qnew'); await p.waitForSelector('#dn-jobs');
  if (!/Quotes sent/.test(await p.evaluate(() => document.body.innerText)) || /\bIn progress\b.*quote/i.test(await p.evaluate(() => document.body.innerText))) fail('Quotes sent wording');
  await p.evaluate(() => ftJobs('won')); await p.waitForSelector('.wonst'); if (!/Job: Scheduled/.test(await p.evaluate(() => document.body.innerText))) fail('won job status');
  await shot(p, 'won-quotes');
  // invoiced filter: only real invoices
  if (await p.evaluate(() => { ftJobs('invoiced'); return /Cora Complete|Sid Sent/.test(A.innerText); })) fail('invoiced lists non-invoices');
  // Timber: header + examples; clears when leaving
  await p.evaluate(() => ownerHome()); await p.click('#dn-timber'); await p.waitForSelector('#tbx'); await p.waitForSelector('#tbs3');
  await p.evaluate(() => { sessionStorage.tbHist = JSON.stringify([{ who: 'me', text: 'hi' }, { who: 'tm', text: 'Hello', open: { id: 'H-1', label: 'Open Hal Hartwell' } }]); ftTimber(); });
  await p.waitForFunction(() => /Open Hal Hartwell/.test(document.getElementById('tbmsgs').innerText));
  await p.evaluate(() => document.getElementById('dn-dash').click()); await w(100);
  if (await p.evaluate(() => sessionStorage.tbHist !== '[]')) fail('Timber history not cleared on leave');
  // Timber draft -> quote screen for review, nothing created or sent
  const n0 = created.length, m0 = featOutbox.length;
  await p.evaluate(() => { ftTimber(); ftTimberDraft({ name: 'Pat Pine', email: 'pat@example.com', phone: '850-555-0100', address: '9 Pine St', items: [{ title: 'Remove two pines', price: 1400 }] }); });
  await p.waitForSelector('#tbdraft'); const f = await p.evaluate(() => ({ nm: document.getElementById('nm').value, em: document.getElementById('em').value, pv: document.getElementById('pv').innerText }));
  if (f.nm !== 'Pat Pine' || f.em !== 'pat@example.com' || !/1,?400/.test(f.pv)) fail('draft ' + JSON.stringify(f));
  if (created.length !== n0 || featOutbox.length !== m0) fail('draft was saved or sent');
  await w(50); { await p.evaluate(() => A.insertAdjacentHTML('beforeend', '<button id="aiw">Have AI fill this quote out</button>')); await w(50); const t = await p.evaluate(() => document.getElementById('aiw').textContent); if (!/Have Timber fill this quote/.test(t) || /Have AI/.test(t)) fail('Have Timber wording ' + t); }
  await shot(p, 'timber-draft');
  await p.evaluate(() => toast('Invoice sent to customer')); if (!/test run: went to austin@techsourcedsolutions\.com/.test(await p.$eval('#toast', (e) => e.textContent))) fail('test run toast');
  await p.close();
  // crew with a personal PIN: Today's job + only their jobs
  p = await open('7711'); await p.waitForSelector('#tdjob', { timeout: 8000 });
  const c = await p.evaluate(() => A.innerText); if (!/Hal Hartwell/.test(c) || /Olive Other/.test(c)) fail('crew sees wrong jobs ' + c.slice(0, 300));
  await shot(p, 'crew-today'); await p.close();
  // simple homes (Miller 7281002): 3-5 big actions, one green, everything else under More; screenshots of each role
  const EXP = { '1234': ['s-newq', 's-quotes', 's-cust', 's-sched', 's-more'], '6789': ['s-inv', 's-cust', 's-pay', 's-more'], '7711': ['s-today', 's-clock', 's-photo', 's-done', 's-more'] };
  for (const [pin, ids] of Object.entries(EXP)) {
    p = await open(pin, true); await p.waitForSelector('#shome', { timeout: 8000 });
    const h = await p.evaluate(() => ({ ids: [...document.querySelectorAll('#shome > button')].map((b) => b.id), green: [...document.querySelectorAll('#shome > button.g')].length, tall: Math.min(...[...document.querySelectorAll('#shome > button')].map((b) => b.getBoundingClientRect().height)), more: document.getElementById('smore').hidden, txt: document.body.innerText }));
    if (JSON.stringify(h.ids) !== JSON.stringify(ids) || h.green !== 1 || h.tall < 56 || !h.more || /\bAI\b/.test(h.txt)) fail('simple home ' + pin + ' ' + JSON.stringify(h).slice(0, 300));
    await shot(p, 'home-' + { '1234': 'estimator', '6789': 'admin', '7711': 'crew' }[pin]);
    await p.click('#s-more'); await p.waitForFunction(() => !document.getElementById('smore').hidden && document.getElementById('shome').hidden);
    if (pin === '7711') { await p.evaluate(() => render()); await p.waitForSelector('#s-today'); await p.click('#s-today'); await p.waitForSelector('#jc'); if (!/Hal Hartwell/.test(await p.evaluate(() => A.innerText))) fail('today job tap'); }
    if (pin === '1234') { await p.evaluate(() => render()); await p.waitForSelector('#s-newq'); await p.click('#s-newq'); await p.waitForSelector('#nm'); }
    await p.close();
  }
  p = await open('4321', true); await p.waitForSelector('#dgrid'); await shot(p, 'home-owner');
  if ((await p.$$eval('#dnav button', (b) => b.map((x) => x.textContent.trim()))).join('|').replace(/[^A-Za-z| ]/g, '').trim() === '') fail('owner nav');
  await p.close();
  console.log('batch4 e2e ok');
} finally { await browser.close(); server.close(); }
