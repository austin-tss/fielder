// Backend tests for parity batch 2: Owner dashboard numbers, bundled load, labor vs jobs, Labor compare, Timber (function calling).
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeGas } from './gas-harness.mjs';
const OWN = '4321', MGR = '1234', ADM = '6789', CREW = '5522', DAY = 864e5;
const iso = (ms) => new Date(ms).toISOString();
const ymd = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(ms));
let gem = [];
function gas(extra = {}) {
  gem = [];
  const g = makeGas({ code: process.env.GAS_CODE, props: Object.assign({ EMPLOYEES_JSON: JSON.stringify([{ id: 'E1', name: 'Jake Saw', role: 'Crew', pin: CREW, payRate: 25 }, { id: 'E3', name: 'Rosa Limb', role: 'Crew', pin: '5533', payRate: 30 }]) }, extra),
    fetch: (url, o) => { if (/generativelanguage/.test(url)) { const body = JSON.parse(o.payload); gem.push(body); const r = GEMINI.shift(); return { code: 200, body: r(body) }; } return { code: 599, body: 'offline' }; } });
  const now = Date.now();
  g.writeJson('jobs.json', [
    { id: 'J1', name: 'Linda Whitaker', address: '12 Oak Hollow Dr', email: 'l@example.com', status: 'approved', service: 'Removal', source: 'Google', items: [{ title: 'Removal', price: 1200 }], created: iso(now - DAY), photos: [], crew: [] },
    { id: 'J3', name: 'Rita Caldwell', address: '7 Magnolia Ct', email: 'r@example.com', status: 'invoiced', service: 'Stump grinding', source: 'Referral', items: [{ title: 'Stump grind', price: 400 }], invoice: { amount: '$400.00', at: iso(now), paid: true, paidAt: iso(now) }, created: iso(now - 9 * DAY), photos: [], crew: [] },
    { id: 'J6', name: 'Quote Yesterday', address: '9 Pine', email: 'q@example.com', status: 'sent', service: 'Pruning', items: [{ title: 'Pruning', price: 650 }], created: iso(now - DAY), photos: [], crew: [] },
  ]);
  g.writeJson('blocks.json', [{ id: 'B1', date: ymd(now), start: '08:00', end: '12:00', job: 'J1' }, { id: 'B2', date: ymd(now), start: '12:30', end: '16:30', job: 'J3' }]);
  return g;
}
let GEMINI = [];
// Put punches straight into the clock shards: who worked how many hours today.
function punch(g, who, hours) {
  g.post({ a: 'clockIn', pin: OWN, forWho: who });
  for (const n of g.ctx.clockNames_(Date.now() - DAY, Date.now())) { const arr = g.ctx.clockRead_(n); arr.forEach((p) => { if (p.who === who && !p.out) { const end = Date.now() - 60000; p.in = iso(end - hours * 3600000); p.out = iso(end); } }); g.ctx.clockWrite_(n, arr); }
}
const near = (a, b, m) => assert.ok(Math.abs(a - b) < 0.6, (m || '') + ' ' + a + ' vs ' + b);

test('labor vs jobs for today: labor split across the day\'s jobs, % of the day\'s job $', () => {
  const g = gas(); punch(g, 'Jake Saw', 4); punch(g, 'Rosa Limb', 2);
  const r = g.post({ a: 'laborDay', pin: OWN });
  assert.equal(r.ok, true); near(r.total.labor, 4 * 25 + 2 * 30, 'labor'); near(r.total.revenue, 1600, 'rev'); near(r.total.pct, 160 / 1600 * 100, 'pct');
  assert.equal(r.jobs.length, 2); near(r.jobs.find((x) => x.id === 'J1').labor, 80);
  assert.equal(g.post({ a: 'laborDay', pin: CREW }).ok, false, 'crew cannot see labor $');
});

test('Labor compare: one day vs that day\'s jobs only (Miller 39f0cd2), every breakdown', () => {
  const g = gas(); punch(g, 'Jake Saw', 4);
  const c = (o) => g.post(Object.assign({ a: 'laborCmp', pin: OWN, date: ymd(Date.now()) }, o));
  near(c({ period: 'day', vs: 'jobs', by: 'none' }).total.cmp, 1600);
  for (const vs of ['invoiced', 'collected', 'quoted', 'hours']) near(c({ period: 'day', vs, by: 'none' }).total.cmp, 1600);
  const m = c({ period: 'month', vs: 'jobs', by: 'job' }); assert.equal(m.series.length, 1); near(m.total.labor, 100);
  assert.deepEqual(c({ period: 'day', vs: 'jobs', by: 'crew' }).rows.map((x) => x.key), ['Jake Saw']);
  assert.deepEqual(c({ period: 'day', vs: 'jobs', by: 'source' }).rows.map((x) => x.key).sort(), ['Google', 'Referral']);
  assert.deepEqual(c({ period: 'day', vs: 'jobs', by: 'service' }).rows.map((x) => x.key).sort(), ['Removal', 'Stump grinding']);
  assert.deepEqual(c({ period: 'day', vs: 'jobs', by: 'customer' }).rows.map((x) => x.key).sort(), ['Linda Whitaker', 'Rita Caldwell']);
  const drill = c({ period: 'day', vs: 'jobs', by: 'job', fby: 'source', fkey: 'Google' }); assert.deepEqual(drill.rows.map((x) => x.key), ['Linda Whitaker']);
});

test('Owner dashboard numbers are Owner-only and exact', () => {
  const g = gas(); punch(g, 'Jake Saw', 4);
  assert.equal(g.post({ a: 'dash', pin: MGR }).ok, false);
  const d = g.post({ a: 'dash', pin: OWN });
  assert.equal(d.ok, true); assert.equal(d.openQuotes.count, 1); near(d.openQuotes.total, 650); near(d.paidWeek, 400); near(d.laborToday, 100);
  assert.equal(d.todayJobs.length, 2); near(d.laborCmp.cmp, 1600); assert.equal(d.approved.count, 1);
});

test('bundle: one call returns every read the person may see, through normal permission checks', () => {
  const g = gas();
  const o = g.post({ a: 'bundle', pin: OWN }); const oa = o.items.map((x) => x.body.a);
  for (const a of ['fGet', 'dash', 'laborDay', 'laborCmp', 'costSummary', 'gpsMap', 'empList']) assert.ok(oa.includes(a), 'owner bundle has ' + a);
  const c = g.post({ a: 'bundle', pin: CREW }).items.map((x) => x.body.a);
  for (const a of ['dash', 'gpsMap', 'laborDay', 'laborCmp']) assert.ok(!c.includes(a), 'crew bundle must not have ' + a);
  assert.ok(c.includes('fGet'));
});

test('Timber: needs the Gemini key; answers via server data functions with exact numbers; never says AI', () => {
  let g = gas();
  const r0 = g.post({ a: 'timber', pin: OWN, q: 'labor yesterday vs what we brought in' }); assert.equal(r0.ok, false); assert.equal(r0.setup, true);
  g = gas({ GEMINI_API_KEY: 'test-key-not-real' }); punch(g, 'Jake Saw', 4);
  const today = ymd(Date.now());
  GEMINI = [
    () => ({ candidates: [{ content: { role: 'model', parts: [{ functionCall: { name: 'labor', args: { from: today, to: today, by: 'none' } } }, { functionCall: { name: 'revenue', args: { from: today, to: today } } }] } }] }),
    (body) => { const fr = body.contents.at(-1).parts.map((p) => p.functionResponse); const lab = fr.find((x) => x.name === 'labor').response.result.total.labor, rev = fr.find((x) => x.name === 'revenue').response.result.invoiced;
      return { candidates: [{ content: { parts: [{ text: `As an AI: labor was $${lab} and you brought in $${rev}.` }] } }] }; },
  ];
  const r = g.post({ a: 'timber', pin: OWN, q: 'labor today vs what we brought in' });
  assert.equal(r.ok, true, JSON.stringify(r)); assert.deepEqual(r.used, ['labor', 'revenue']);
  assert.match(r.answer, /\$100\b/); assert.match(r.answer, /\$400\b/); assert.doesNotMatch(r.answer, /\bAI\b/);
  const decl = gem[0].tools[0].functionDeclarations.map((f) => f.name); for (const n of ['labor', 'revenue', 'quotes', 'jobs', 'invoices', 'onClock', 'dashboard']) assert.ok(decl.includes(n));
  assert.doesNotMatch(gem[0].systemInstruction.parts[0].text, /Miller/); assert.match(gem[0].systemInstruction.parts[0].text, /Fielder/);
  // data mode (no Gemini) is exact: "quotes done yesterday"
  const y = ymd(Date.now() - DAY);
  const q = g.post({ a: 'timber', pin: OWN, data: 'quotes', args: { from: y, to: y } });
  assert.equal(q.data.quotes.count, 2); near(q.data.quotes.total, 1850);
  assert.equal(g.post({ a: 'timber', pin: MGR, data: 'quotes' }).ok, false);
  assert.equal(g.post({ a: 'timber', pin: CREW, q: 'hi' }).ok, false, 'crew has no Timber');
  assert.ok(!g.fetches.some((f) => !/generativelanguage/.test(f.url)));
});

test('Timber sendInvoice: most recent or named invoice, test inbox only, no double send, never VNXT', () => {
  const g = gas();
  const run = (pin, args) => g.post({ a: 'timber', pin, data: 'sendInvoice', args: args || {} });
  const r = run(OWN, {}); assert.equal(r.ok, true, JSON.stringify(r)); const d = JSON.stringify(r.data);
  assert.match(d, /Sent invoice for Rita Caldwell · \$400/);
  assert.equal(g.mails.length, 1); assert.equal(g.mails[0].to, 'austin@techsourcedsolutions.com'); assert.match(g.mails[0].subject, /Invoice/);
  assert.match(JSON.stringify(run(OWN, {})), /Already sent/); assert.equal(g.mails.length, 1, 'no double send');
  const n = run(OWN, { customer: 'Caldwell', to: 'billing@example.org' }); assert.match(JSON.stringify(n.data), /Sent invoice for Rita Caldwell/);
  assert.equal(g.mails.length, 2); assert.match(g.mails[1].subject, /^\[TEST to billing@example\.org\]/);
  assert.match(JSON.stringify(run(OWN, { customer: 'Linda Whitaker' })), /has no invoice yet/);
  assert.ok(g.mails.every((m) => m.to === 'austin@techsourcedsolutions.com'));
  assert.equal(g.post({ a: 'timber', pin: ADM, data: 'sendInvoice', args: {} }).ok, false, 'Timber is Owner-only in Fielder');
  assert.match(JSON.stringify(g.post({ a: 'timber', pin: MGR, data: 'sendInvoice', args: {} })), /"ok":false|Only the Owner/);
  const cd = g.post({ a: 'timber', pin: OWN, data: 'cannotDo', args: { request: 'Send the most recent invoice built to austin@techsourcedsolutions.com' } });
  assert.match(JSON.stringify(cd), /sendInvoice/); assert.doesNotMatch(JSON.stringify(cd), /"offered":true/);
});

test('login monitoring: every attempt logged without the PIN; loginsList is Owner-only; capped at 500', () => {
  const g = gas();
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1';
  assert.equal(g.post({ a: 'login', pin: OWN, ua }).ok, true);
  assert.equal(g.post({ a: 'login', pin: '0909', ua }).ok, false);
  assert.equal(g.post({ a: 'login', pin: MGR }).ok, true);
  const raw = JSON.stringify(g.readJson('logins.json'));
  for (const p of [OWN, '0909', MGR]) assert.ok(!raw.includes(p), 'PIN must never be stored');
  const l = g.post({ a: 'loginsList', pin: OWN }); assert.equal(l.ok, true, JSON.stringify(l));
  assert.equal(l.items.length, 3); assert.equal(l.items[0].role, 'Manager'); assert.equal(l.items[1].ok, false); assert.equal(l.items[2].role, 'Owner'); assert.equal(l.items[2].client, 'iPhone · Safari');
  assert.ok(!JSON.stringify(l).includes(OWN));
  assert.equal(g.post({ a: 'loginsList', pin: MGR }).ok, false); assert.equal(g.post({ a: 'loginsList', pin: CREW }).ok, false); assert.equal(g.post({ a: 'loginsList' }).ok, false);
  g.writeJson('logins.json', Array.from({ length: 499 }, (_, i) => ({ at: new Date(i).toISOString(), ok: true, role: 'Crew' })));
  g.post({ a: 'login', pin: OWN }); g.post({ a: 'login', pin: OWN }); assert.equal(g.readJson('logins.json').length, 500);
});
