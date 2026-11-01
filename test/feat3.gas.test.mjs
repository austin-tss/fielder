// Backend tests for parity batch 3: permits/HOA, 811, lead sources, payroll overtime, COI, multi-day progress.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeGas } from './gas-harness.mjs';
const OWN = '4321', MGR = '1234', CREW = '5522', DAY = 864e5;
const iso = (ms) => new Date(ms).toISOString();
function gas() {
  const g = makeGas({ code: process.env.GAS_CODE, props: { EMPLOYEES_JSON: JSON.stringify([{ id: 'E1', name: 'Jake Saw', role: 'Crew', pin: CREW, payRate: 20 }]) } });
  g.writeJson('jobs.json', [
    { id: 'J1', name: 'Linda Whitaker', address: '12 Oak Hollow Dr', email: 'l@example.com', status: 'approved', source: 'Google', items: [{ title: 'Stump grinding', price: 400 }], created: iso(Date.now() - DAY), photos: [], crew: [] },
    { id: 'J2', name: 'Rita Caldwell', address: '7 Magnolia Ct', email: 'r@example.com', status: 'sent', source: 'Referral', items: [{ title: 'Pruning', price: 600 }], created: iso(Date.now() - 2 * DAY), photos: [], crew: [] },
    { id: 'J3', name: 'Gus Paid', address: '1 Elm', email: 'g@example.com', status: 'invoiced', source: 'Google', items: [{ title: 'Removal', price: 1000 }], invoice: { amount: '$1000.00', at: iso(Date.now()), paid: true }, created: iso(Date.now() - 9 * DAY), photos: [], crew: [] },
  ]);
  return g;
}
const job = (g, id) => g.readJson('jobs.json').find((j) => j.id === id);
test('permit/HOA saved on the job; bad values fall back; crew cannot set permits', () => {
  const g = gas();
  const r = g.post({ a: 'permitSet', pin: MGR, id: 'J1', permit: { needed: true, type: 'HOA approval', status: 'applied', number: 'H-22' } });
  assert.equal(r.ok, true); assert.deepEqual([job(g, 'J1').permit.type, job(g, 'J1').permit.status, job(g, 'J1').permit.number], ['HOA approval', 'applied', 'H-22']);
  g.post({ a: 'permitSet', pin: MGR, id: 'J1', permit: { type: 'Bogus', status: 'whatever' } });
  assert.deepEqual([job(g, 'J1').permit.type, job(g, 'J1').permit.status], ['County permit', 'not started']);
  assert.equal(g.post({ a: 'permitSet', pin: CREW, id: 'J1', permit: { status: 'approved' } }).ok, false);
});
test('811: clear after 2 full business days (dig on the 3rd), expires +28 days; dashboard flags stump job without a ticket', () => {
  const g = gas();
  let d = g.post({ a: 'dash', pin: OWN }); assert.ok(d.stumpNo811.some((x) => /Linda/.test(x)), JSON.stringify(d.stumpNo811));
  const r = g.post({ a: 'locateSet', pin: MGR, id: 'J1', locate: { ticket: '123456789', called: '2026-10-30' } }); // Friday
  assert.equal(r.ok, true); const l = job(g, 'J1').locate;
  assert.deepEqual([l.ticket, l.called, l.clear, l.expires, l.status], ['123456789', '2026-10-30', '2026-11-04', '2026-11-27', 'called']); // Mon+Tue full days, dig Wed
  assert.equal(g.post({ a: 'locateSet', pin: MGR, id: 'J1', locate: { ticket: '123456789', called: '2026-11-02', status: 'clear' } }).ok, true);
  assert.equal(job(g, 'J1').locate.clear, '2026-11-05');
  d = g.post({ a: 'dash', pin: OWN }); assert.equal((d.stumpNo811 || []).some((x) => /Linda/.test(x)), false);
  const pl = g.post({ a: 'permList', pin: MGR }); assert.ok(pl.items.some((x) => x.id === 'J1' && x.locate && x.stump));
  // crew can log the 811 call from the field
  assert.equal(g.post({ a: 'locateSet', pin: CREW, id: 'J1', locate: { ticket: '9', called: '2026-11-02' } }).ok, true);
});
test('lead sources: set on a job (unknown -> Other), report shows leads, won, close %, revenue', () => {
  const g = gas();
  g.post({ a: 'setSource', pin: MGR, id: 'J2', source: 'Nextdoor' }); assert.equal(job(g, 'J2').source, 'Nextdoor');
  g.post({ a: 'setSource', pin: MGR, id: 'J2', source: 'Billboard' }); assert.equal(job(g, 'J2').source, 'Other');
  const r = g.post({ a: 'leadReport', pin: OWN }); const go = r.rows.find((x) => x.source === 'Google');
  assert.deepEqual([go.leads, go.won, go.close, go.wonValue], [2, 2, 100, 1400]);
  assert.ok(r.sources.includes('Yard sign') && r.sources.includes('Storm call'));
});
test('payroll: Sun-Sat weeks, hours over 40 at 1.5x', () => {
  const g = gas();
  // 5 x 9 h shifts Mon-Fri of the week of Sun 2026-10-18 = 45 h -> 40 reg + 5 OT at $20
  const ps = []; for (let i = 1; i <= 5; i++) { const s = Date.parse(`2026-10-${String(18 + i).padStart(2, '0')}T11:00:00Z`); ps.push({ id: 'P' + i, who: 'Jake Saw', in: iso(s), out: iso(s + 9 * 3600000) }); }
  const by = {}; ps.forEach((p) => { const n = g.ctx.clockShard_(Date.parse(p.in), p.who); (by[n] = by[n] || g.ctx.clockRead_(n)).push(p); }); Object.keys(by).forEach((n) => g.ctx.clockWrite_(n, by[n]));
  const r = g.post({ a: 'payroll', pin: OWN, from: '2026-10-18', to: '2026-10-24' });
  assert.equal(r.ok, true, JSON.stringify(r)); const x = r.rows.find((y) => y.who === 'Jake Saw');
  assert.deepEqual([x.week, x.hours, x.regular, x.overtime, x.rate, x.otRate, x.regPay, x.otPay, x.gross], ['2026-10-18', 45, 40, 5, 20, 30, 800, 150, 950]);
  assert.equal(g.post({ a: 'payroll', pin: CREW }).ok, false);
});
test('COI: Owner uploads a PDF to the COI folder, info shows days left, Send COI goes only to the test inbox', () => {
  const g = gas();
  assert.equal(g.post({ a: 'coiSend', pin: MGR, to: 'hoa@example.com' }).ok, false); // nothing uploaded yet
  assert.equal(g.post({ a: 'coiUpload', pin: MGR, data: 'data:application/pdf;base64,JVBERi0=' }).ok, false); // Manager cannot upload
  assert.equal(g.post({ a: 'coiUpload', pin: OWN, data: 'data:image/png;base64,AAAA' }).ok, false);
  const exp = new Date(Date.now() + 20 * DAY).toISOString().slice(0, 10);
  assert.equal(g.post({ a: 'coiUpload', pin: OWN, data: 'data:application/pdf;base64,JVBERi0=', name: 'COI 2026.pdf', expires: exp, insurer: 'Acme Mutual' }).ok, true);
  const info = g.post({ a: 'coiInfo', pin: MGR }); assert.equal(info.coi.insurer, 'Acme Mutual'); assert.ok(info.coi.daysLeft >= 19 && info.coi.daysLeft <= 21);
  assert.ok(g.post({ a: 'dash', pin: OWN }).coi.daysLeft <= 21);
  const before = g.mails.length;
  const s = g.post({ a: 'coiSend', pin: MGR, to: 'astinson@howard.com', toName: 'HOA', id: 'J1' }); assert.equal(s.ok, true, JSON.stringify(s));
  const m = g.mails.slice(before); assert.equal(m.length, 1);
  assert.equal(m[0].to, 'austin@techsourcedsolutions.com'); assert.ok(!JSON.stringify(m[0]).includes('Miller'));
  assert.ok((m[0].attachments || []).length === 1 && /Certificate of Insurance\.pdf$/.test(m[0].attachments[0].getName()));
});
test('multi-day progress note: one per day, % clamped, crew can add', () => {
  const g = gas();
  assert.equal(g.post({ a: 'progNote', pin: CREW, id: 'J1', day: '2026-11-01', note: 'Felled 2 of 4', pct: 50 }).ok, true);
  g.post({ a: 'progNote', pin: CREW, id: 'J1', day: '2026-11-01', note: 'Felled 3 of 4', pct: 140 });
  g.post({ a: 'progNote', pin: CREW, id: 'J1', day: '2026-10-31', note: 'Set up', pct: 10 });
  assert.deepEqual(job(g, 'J1').progress.map((p) => [p.day, p.note, p.pct]), [['2026-10-31', 'Set up', 10], ['2026-11-01', 'Felled 3 of 4', 100]]);
});
test('bundle includes COI and permit list reads', () => {
  const g = gas(); const r = g.post({ a: 'bundle', pin: OWN }); const as = r.items.map((x) => x.body.a);
  assert.ok(as.includes('coiInfo') && as.includes('permList') && as.includes('leadReport'), as.join(','));
});
