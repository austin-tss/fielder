// Backend tests for batch 4: an accepted quote becomes a job once (customer link, staff, bulk), crew assignment on
// schedule blocks + job.assigned, labor split by assigned crew, Timber quote draft (returned for review, never sent).
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeGas } from './gas-harness.mjs';
const OWN = '4321', MGR = '1234', ADM = '6789', CREW = '5522', DAY = 864e5;
const iso = (ms) => new Date(ms).toISOString();
const ymd = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(ms));
const TOK = 'a'.repeat(48);
let GEMINI = [];
function gas(extra = {}) {
  const g = makeGas({ code: process.env.GAS_CODE, props: Object.assign({ EMPLOYEES_JSON: JSON.stringify([{ id: 'E1', name: 'Jake Saw', role: 'Crew', pin: CREW, payRate: 25 }, { id: 'E3', name: 'Rosa Limb', role: 'Crew', pin: '5533', payRate: 30 }]) }, extra),
    fetch: (url, o) => { if (/generativelanguage/.test(url)) { const r = GEMINI.shift(); return { code: 200, body: r(JSON.parse(o.payload)) }; } return { code: 599, body: 'offline' }; } });
  const now = Date.now();
  g.writeJson('jobs.json', [
    { id: 'J1', est: 'FT-EST-2026-0101', name: 'Linda Whitaker', address: '12 Oak', email: 'l@example.com', status: 'approved', items: [{ title: 'Removal', price: 1200 }], created: iso(now - DAY), photos: [], crew: [] },
    { id: 'J3', est: 'FT-EST-2026-0103', name: 'Rita Caldwell', address: '7 Magnolia', email: 'r@example.com', status: 'approved', items: [{ title: 'Stump grind', price: 400 }], created: iso(now - DAY), photos: [], crew: [] },
    { id: 'Q1', est: 'FT-EST-2026-0201', name: 'Hal Hartwell', address: '4 Elm', email: 'h@example.com', status: 'sent', pt: TOK, items: [{ title: 'Pruning', price: 650 }], created: iso(now - DAY), photos: [], crew: [] },
    { id: 'Q2', est: 'FT-EST-2026-0202', name: 'Bulk One', address: '5 Elm', email: 'b@example.com', status: 'sent', items: [{ title: 'Pruning', price: 300 }], created: iso(now - DAY), photos: [], crew: [] },
  ]);
  g.writeJson('blocks.json', [{ id: 'B1', date: ymd(now), start: '08:00', end: '12:00', job: 'J1' }, { id: 'B2', date: ymd(now), start: '12:30', end: '16:30', job: 'J3' }]);
  return g;
}
const job = (g, id) => g.readJson('jobs.json').find((j) => j.id === id);
function punch(g, who, hours) {
  g.post({ a: 'clockIn', pin: OWN, forWho: who });
  for (const n of g.ctx.clockNames_(Date.now() - DAY, Date.now())) { const arr = g.ctx.clockRead_(n); arr.forEach((p) => { if (p.who === who && !p.out) { const end = Date.now() - 60000; p.in = iso(end - hours * 3600000); p.out = iso(end); } }); g.ctx.clockWrite_(n, arr); }
}
test('customer link approval makes a job once, linked to the quote, Unscheduled', () => {
  const g = gas();
  assert.equal(g.post({ a: 'approvePublic', t: TOK }).ok, true);
  const j = job(g, 'Q1'); assert.equal(j.status, 'approved'); assert.equal(j.jobNo, 'FT-JOB-2026-0201'); assert.equal(j.quoteEst, 'FT-EST-2026-0201'); assert.equal(j.jobStatus, 'unscheduled');
  const at = j.wonAt; g.post({ a: 'approvePublic', t: TOK }); g.post({ a: 'setStatus', pin: MGR, status: 'approved', ids: ['Q1'] });
  assert.equal(job(g, 'Q1').wonAt, at, 'idempotent'); assert.equal(g.readJson('jobs.json').length, 4, 'same record, no duplicate');
});
test('bulk status approve makes jobs; declined does not', () => {
  const g = gas();
  assert.equal(g.post({ a: 'setStatus', pin: OWN, status: 'approved', ids: ['Q2'] }).ok, true); assert.equal(job(g, 'Q2').jobNo, 'FT-JOB-2026-0202');
  g.post({ a: 'setStatus', pin: OWN, status: 'declined', ids: ['Q1'] }); assert.equal(job(g, 'Q1').jobNo, undefined);
});
test('schedule block keeps its crew; job.assigned follows; scheduling moves the won job to Scheduled', () => {
  const g = gas(); g.post({ a: 'approvePublic', t: TOK });
  const r = g.post({ a: 'block', pin: MGR, block: { id: '', date: ymd(Date.now() + DAY), start: '08:00', end: '12:00', job: 'Q1', note: '', crew: ['jake saw', 'Tyler', 'Tyler', ''] } });
  assert.equal(r.ok, true, JSON.stringify(r)); const b = r.blocks.find((x) => x.job === 'Q1'); assert.deepEqual(b.crew, ['Jake Saw', 'Tyler']);
  assert.deepEqual(job(g, 'Q1').assigned, ['Jake Saw', 'Tyler']); assert.equal(job(g, 'Q1').jobStatus, 'scheduled');
});
test('assign action: Owner/Estimator/Admin can, Crew cannot', () => {
  const g = gas();
  const r = g.post({ a: 'assign', pin: ADM, id: 'J1', crew: ['Rosa Limb'] }); assert.equal(r.ok, true, JSON.stringify(r)); assert.equal(r.changed, 1);
  assert.deepEqual(g.readJson('blocks.json').find((b) => b.id === 'B1').crew, ['Rosa Limb']); assert.deepEqual(job(g, 'J1').assigned, ['Rosa Limb']);
  assert.equal(g.post({ a: 'assign', pin: MGR, id: 'J1', crew: ['Jake Saw', 'Rosa Limb'] }).ok, true);
  assert.equal(g.post({ a: 'assign', pin: CREW, id: 'J1', crew: [] }).ok, false);
  assert.equal(g.post({ a: 'assign', pin: OWN, id: 'NOPE', crew: [] }).ok, false);
});
test('labor split: assigned crew hours go to their job; unassigned split across the day', () => {
  const g = gas(); g.post({ a: 'assign', pin: OWN, id: 'J1', crew: ['Jake Saw'] }); punch(g, 'Jake Saw', 4); punch(g, 'Rosa Limb', 2);
  const r = g.post({ a: 'laborDay', pin: OWN }); assert.equal(r.ok, true);
  const l = (id) => r.jobs.find((x) => x.id === id).labor; assert.ok(Math.abs(l('J1') - (100 + 30)) < 0.6, 'J1 ' + l('J1')); assert.ok(Math.abs(l('J3') - 30) < 0.6, 'J3 ' + l('J3'));
});
test('Timber draft quote: returned for review, nothing saved or sent', () => {
  const g = gas({ GEMINI_API_KEY: 'test-key-not-real' }); const n0 = g.readJson('jobs.json').length;
  GEMINI = [() => ({ candidates: [{ content: { parts: [{ functionCall: { name: 'draftQuote', args: { name: 'Pat Pine', email: 'pat@example.com', phone: '850-555-0100', address: '9 Pine St', items: 'Remove two pines | $1,400\nGrind stumps | 300' } } }] } }] }),
    () => ({ candidates: [{ content: { parts: [{ text: 'Draft ready for Pat Pine. Check it and tap Send.' }] } }] })];
  const r = g.post({ a: 'timber', pin: OWN, q: 'create a quote for Pat Pine at 9 Pine St, two pines 1400 and stumps 300' });
  assert.equal(r.ok, true, JSON.stringify(r)); assert.equal(r.draft.name, 'Pat Pine'); assert.equal(r.draft.email, 'pat@example.com');
  assert.deepEqual(r.draft.items.map((i) => [i.title, i.price]), [['Remove two pines', 1400], ['Grind stumps', 300]]);
  assert.equal(g.readJson('jobs.json').length, n0, 'nothing saved'); assert.equal(g.mails ? g.mails.length : 0, 0, 'nothing sent');
  GEMINI = [() => ({ candidates: [{ content: { parts: [{ text: 'Hi.' }] } }] })];
  assert.equal(g.post({ a: 'timber', pin: OWN, q: 'hello' }).draft, undefined, 'draft does not leak into the next answer');
});
test('Timber actions run through the normal pipeline with the asker PIN; emails only to the test inbox; archive asks first', () => {
  const g = gas(); const run = (n, a, pin = OWN) => { g.ctx.FT_TBD_ = { pin }; g.ctx.FT_OPEN_ = null; return g.ctx.tbRun_(n, a); };
  const d1 = ymd(Date.now() + 2 * DAY);
  let r = run('scheduleJob', { customer: 'linda', date: d1, start: '09:00', end: '13:00', crew: 'Jake Saw and Rosa Limb' }); assert.equal(r.ok, true, JSON.stringify(r));
  const bl = g.readJson('blocks.json').filter((b) => b.job === 'J1'); assert.equal(bl.length, 1); assert.equal(bl[0].date, d1); assert.deepEqual(bl[0].crew, ['Jake Saw', 'Rosa Limb']); assert.equal(g.ctx.FT_OPEN_.id, 'J1');
  assert.equal(run('assignCrew', { customer: 'Linda Whitaker', crew: 'Rosa Limb' }).ok, true); assert.deepEqual(job(g, 'J1').assigned, ['Rosa Limb']);
  assert.equal(run('setQuoteStatus', { customer: 'Hartwell', status: 'accepted' }).ok, true); assert.ok(job(g, 'Q1').jobNo);
  assert.equal(run('completeJob', { customer: 'Rita' }).ok, true); assert.equal(job(g, 'J3').status, 'complete');
  assert.equal(run('invoice', { customer: 'Rita' }).ok, true); assert.equal(job(g, 'J3').invoice.amount, '$400.00');
  assert.equal(run('markPaid', { customer: 'Rita', paid: 'yes' }).ok, true); assert.equal(job(g, 'J3').invoice.paid, true);
  assert.equal(run('markPaid', { customer: 'Rita', paid: 'open' }).ok, true); assert.equal(job(g, 'J3').invoice.paid, false);
  assert.equal(run('addNote', { customer: 'Linda', note: 'Gate code 1234' }).ok, true); assert.match(job(g, 'J1').internalNotes, /Gate code/);
  assert.equal(run('addCustomer', { name: 'New Person', email: 'np@example.com' }).ok, true); assert.ok(g.readJson('customers.json').some((c) => c.name === 'New Person'));
  assert.equal(run('changeSettings', { discountPct: '15' }).ok, true); assert.equal(g.ctx.settings_().discountPct, 15);
  assert.ok(g.mails.length >= 2); for (const m of g.mails) assert.equal(m.to, 'austin@techsourcedsolutions.com', 'TEST RUN routing');
  r = run('archiveJob', { customer: 'Bulk One' }); assert.equal(r.ok, false); assert.equal(r.needConfirm, true); assert.ok(!job(g, 'Q2').archived);
  assert.equal(run('archiveJob', { customer: 'Bulk One', confirmed: 'yes' }).ok, true); assert.equal(job(g, 'Q2').archived, true);
  assert.equal(run('assignCrew', { customer: 'Linda', crew: 'Jake Saw' }, CREW).ok, false, 'crew PIN refused');
  assert.equal(run('invoice', { customer: 'zzz' }).ok, false);
});
test('extras: off by default, Owner turns them on with fSet {on}, status reports them', () => {
  const g = gas();
  let s = g.post({ a: 'fGet', pin: OWN }).status; assert.deepEqual(s.on, { permits: false, safety: false, equipment: false, coi: false, reviews: false, storm: false });
  s = g.post({ a: 'fSet', pin: OWN, on: { permits: true, equipment: true, bogus: true } }).status; assert.equal(s.on.permits, true); assert.equal(s.on.equipment, true); assert.equal(s.on.safety, false); assert.equal(s.on.bogus, undefined);
  assert.equal(g.post({ a: 'fSet', pin: OWN, on: { permits: false } }).status.on.permits, false);
  assert.equal(g.post({ a: 'fSet', pin: MGR, on: { safety: true } }).ok, false, 'Owner only');
});
