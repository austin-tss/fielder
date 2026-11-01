// parity2 business features, end to end against the mock (real Code.gs feature code in the emulator, no network to Google/Stripe/Twilio).
import puppeteer from 'puppeteer-core';
import { start, addJob, featOn, featOutbox } from './mock-server.mjs';
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port; const api = base + '/exec';
const F = featOn();
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); }; const w = (ms) => new Promise((r) => setTimeout(r, ms));
const DAY = 864e5, iso = (ms) => new Date(ms).toISOString();
addJob({ id: 'FT-W', est: 'FT-EST-2026-0201', name: 'Linda Whitaker', address: '12 Oak Hollow Dr, Tallahassee, FL', email: 'linda.whitaker@example.com', phone: '8505550101', status: 'approved', items: [{ title: 'Removal', detail: 'Remove the leaning pine', price: 1200 }], created: iso(Date.now() - 4 * DAY), photos: [], crew: [] });
addJob({ id: 'FT-H', est: 'FT-EST-2026-0202', name: 'Tom Hartwell', address: '48 Cedar Bend Ln, Tallahassee, FL', email: 'tom.hartwell@example.com', status: 'sent', items: [{ title: 'Pruning', price: 650 }], created: iso(Date.now() - 2 * DAY), photos: [], crew: [] });
addJob({ id: 'FT-C', est: 'FT-EST-2026-0203', name: 'Rita Caldwell', address: '7 Magnolia Ct, Tallahassee, FL', email: 'rita.caldwell@example.com', status: 'invoiced', items: [{ title: 'Stump grind', price: 400 }], invoice: { amount: '$400.00', at: iso(Date.now() - DAY) }, created: iso(Date.now() - 8 * DAY), photos: [], crew: [] });
addJob({ id: 'FT-Y', est: 'FT-EST-2025-0099', name: 'Gary Oldham', address: '3 Elm St, Tallahassee, FL', email: 'gary.oldham@example.com', status: 'invoiced', finished: iso(Date.now() - 360 * DAY), items: [{ title: 'Trim', price: 300 }], created: iso(Date.now() - 370 * DAY), photos: [], crew: [] });
async function open(pin, url) {
  const p = await browser.newPage(); await p.setViewport({ width: 390, height: 844 });
  await p.evaluateOnNewDocument(() => { try { localStorage.fdHome = localStorage.fdHome || 'forms'; localStorage.fdTips = 'off'; } catch (e) {} });
  p.on('dialog', (d) => d.accept()); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(url || base + '/?api=' + encodeURIComponent(api), { waitUntil: 'domcontentloaded' });
  if (pin) { await p.waitForSelector('.pin button'); for (const d of pin) await p.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d); }
  return p;
}
const say = (p, t) => p.evaluate((t) => { FDVH.route(t); return (document.getElementById('vhst') || {}).textContent || ''; }, t);
const toastHas = (p, re) => p.waitForFunction((s) => new RegExp(s, 'i').test((document.getElementById('toast') || {}).textContent || ''), { timeout: 8000 }, re.source);
const shot = (p, n) => p.screenshot({ path: '/workspace/fielder-parity2-' + n + '.png' });
try {
  // Owner: Business tools card, keys screen that never shows keys back, storm mode by voice
  let o = await open('4321');
  await o.waitForSelector('#ftcard', { timeout: 10000 }); await shot(o, 'owner-tools');
  for (const id of ['ft-storm', 'ft-follow', 'ft-profit', 'ft-map', 'ft-saferep', 'ft-qb', 'ft-equip', 'ft-set']) if (!(await o.$('#' + id))) fail('owner card missing ' + id);
  await o.evaluate(() => ftSet()); await o.waitForSelector('#ftsk', { timeout: 8000 });
  const key = 'sk_test_' + 'Z'.repeat(28);
  await o.type('#ftsk', key); await o.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /save keys|save/i.test(x.textContent) && /ftKeys|ftSaveKeys|fKeys/.test(x.getAttribute('onclick') || '')); b && b.click(); });
  await w(800);
  if (F.props.STRIPE_SECRET_KEY !== key) fail('stripe key not saved');
  if ((await o.content()).includes(key)) fail('key shown back');
  await o.evaluate(() => ownerBack()); await w(300);
  await say(o, 'storm mode on'); await w(800);
  if (!JSON.parse(F.fileByName('feat.json').blob.getDataAsString()).storm) fail('storm not on');
  await say(o, 'tree on house at 12 Oak Street for Jim Hall'); await o.waitForSelector('#fthz button.on', { timeout: 8000 }); await shot(o, 'storm-form');
  await say(o, 'save'); await o.waitForFunction(() => view === 'ftstorm' && document.querySelector('.ftp'), { timeout: 8000 }); await shot(o, 'storm-queue');
  await say(o, 'job profit'); await o.waitForSelector('#ftproftot', { timeout: 8000 });
  await say(o, 'follow ups'); await o.waitForFunction(() => document.querySelectorAll('.ftfl').length === 1, { timeout: 8000 });
  await o.evaluate(() => ftFollowSend()); await toastHas(o, /Sent/);
  await say(o, 'quickbooks'); await o.waitForSelector('#ftqbiif', { timeout: 8000 }); await o.click('#ftqbiif'); await o.waitForFunction(() => window.FTQBLAST, { timeout: 8000 });
  if (!/!TRNS/.test(await o.evaluate(() => FTQBLAST))) fail('IIF header');
  await say(o, 'equipment'); await o.waitForFunction(() => view === 'fteq', { timeout: 8000 });
  await say(o, 'safety report'); await o.waitForFunction(() => view === 'ftsr', { timeout: 8000 });
  await say(o, 'crew map'); await o.waitForFunction(() => view === 'ftmap' || document.getElementById('ftmap'), { timeout: 8000 });
  await say(o, 'storm mode off'); await w(500);
  await o.close();
  // Estimator: job card, voice "dump fee 60", "send booking link", "on my way"
  let m = await open('1234');
  await m.waitForFunction(() => typeof mview === 'function' && typeof jobs !== 'undefined' && jobs.length, { timeout: 10000 });
  await m.evaluate(() => mview('FT-W')); await m.waitForSelector('#ftjob', { timeout: 8000 }); await shot(m, 'job-card');
  await say(m, 'dump fee 60'); await toastHas(m, /Added/);
  await say(m, 'send booking link'); await toastHas(m, /Scheduling link/);
  await say(m, 'on my way'); await toastHas(m, /on.the.way/);
  const links = await m.evaluate(async () => { const r = {}; for (const id of ['FT-W', 'FT-H', 'FT-C']) r[id] = await api({ a: 'portalLink', id }); return r; });
  await m.close();
  const W = (await (async () => (await import('./mock-server.mjs')))());
  void W;
  // Customer pages (served locally, pointed at the mock API)
  const q = (u) => u.replace('https://ft.vnxt.app/', base + '/') + '&api=' + encodeURIComponent(api);
  let c = await open(null, q(links['FT-W'].book)); await c.waitForSelector('.slot', { timeout: 8000 }); await shot(c, 'book');
  await c.click('.slot'); await c.waitForSelector('#bok', { timeout: 8000 });
  await c.goto(q(links['FT-H'].sign), { waitUntil: 'domcontentloaded' }); await c.waitForSelector('#cv', { timeout: 8000 });
  await c.click('.ch[data-c="A"]'); await c.type('#nm', 'Tom Hartwell');
  await c.evaluate(() => document.getElementById('cv').scrollIntoView({ block: 'center' })); await w(300); const r = await (await c.$('#cv')).boundingBox(); await c.mouse.move(r.x + 30, r.y + 120); await c.mouse.down(); for (let i = 0; i < 40; i++) await c.mouse.move(r.x + 30 + i * 7, r.y + 120 - Math.sin(i / 3) * 50); await c.mouse.up();
  await shot(c, 'sign'); await c.click('#go'); await c.waitForSelector('#sok', { timeout: 10000 }).catch(async (e) => { console.log('SIGN PAGE:', await c.evaluate(() => document.body.innerText.slice(0, 400))); throw e; });
  await c.goto(q(links['FT-C'].pay), { waitUntil: 'domcontentloaded' }); await c.waitForFunction(() => !/Loading/.test(document.getElementById('m').textContent), { timeout: 8000 }); await shot(c, 'pay');
  await c.goto(q(links['FT-W'].url), { waitUntil: 'domcontentloaded' }); await c.waitForSelector('#pi', { timeout: 8000 }); await shot(c, 'portal');
  await c.close();
  // Crew: Job complete blocked until the safety checklist is done
  let k = await open('5522');
  await k.waitForFunction(() => typeof cview === 'function' && typeof jobs !== 'undefined' && jobs.length, { timeout: 10000 });
  await k.waitForSelector('#ftcard', { timeout: 8000 });
  await k.evaluate(() => { window.confirm = () => true; cview('FT-W'); }); await k.waitForSelector('#jc', { timeout: 8000 });
  await k.evaluate(() => done(cur)); await k.waitForFunction(() => view === 'ftsafe', { timeout: 8000 }); await shot(k, 'safety-gate');
  await say(k, 'all checked'); await toastHas(k, /Safety checklist done/);
  await k.close();
  // Every email the features sent went only to the test inbox
  if (!featOutbox.length) fail('no feature emails recorded');
  for (const e of featOutbox) if (e.to !== 'austin@techsourcedsolutions.com') fail('email to ' + e.to);
  const subj = featOutbox.map((e) => e.subject).join(' | ');
  for (const s of ['Pick your work date', 'on the way', 'booked', 'Signed', 'yearly']) if (!subj.toLowerCase().includes(s.toLowerCase())) fail('missing email: ' + s + ' in ' + subj);
  if (F.fetches.some((f) => !/census\.gov/.test(f.url))) fail('unexpected network: ' + F.fetches.map((f) => f.url).join(','));
  console.log('feat e2e ok (' + featOutbox.length + ' test emails)');
} finally { await browser.close(); server.close(); }
