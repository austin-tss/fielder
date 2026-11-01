// Backend tests for the parity2 business features. Runs the real Code.gs in an in-memory Apps Script
// emulator (test/gas-harness.mjs). No network, no real email/text/Stripe: everything is recorded.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeGas } from './gas-harness.mjs';

const OWN = '4321', MGR = '1234', ADM = '6789', CREW = '5522';
const DAY = 86400000;
const iso = (ms) => new Date(ms).toISOString();
const ymd = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(ms));
const HOME = { lat: 30.4790, lng: -84.3100 }, FAR = { lat: 30.5300, lng: -84.2000 };
let stripe = {};
function gas(extra = {}) {
  stripe = {};
  const g = makeGas({
    code: process.env.GAS_CODE,
    props: Object.assign({ EMPLOYEES_JSON: JSON.stringify([{ id: 'E1', name: 'Jake Saw', role: 'Crew', pin: CREW, payRate: 25 }, { id: 'E2', name: 'Ada Admin', role: 'Admin', pin: '5511' }]) }, extra),
    fetch: (url, o) => {
      if (/geocoding\.geo\.census\.gov/.test(url)) return { code: 200, body: { result: { addressMatches: [{ coordinates: { x: HOME.lng, y: HOME.lat } }] } } };
      if (/api\.stripe\.com\/v1\/checkout\/sessions$/.test(url)) { const id = 'cs_test_' + Object.keys(stripe).length + 'abc'; stripe[id] = { id, payment_status: 'unpaid', metadata: { job: o.payload['metadata[job]'] }, payment_method_types: ['card'], payload: o.payload }; return { code: 200, body: { id, url: 'https://checkout.stripe.com/c/pay/' + id } }; }
      const m = url.match(/api\.stripe\.com\/v1\/checkout\/sessions\/(cs_[A-Za-z0-9_]+)$/); if (m) return stripe[m[1]] ? { code: 200, body: stripe[m[1]] } : { code: 404, body: { error: { message: 'No such session' } } };
      if (/api\.twilio\.com/.test(url)) return { code: 201, body: { sid: 'SM1' } };
      return { code: 599, body: 'blocked ' + url };
    },
  });
  const now = Date.now();
  g.writeJson('jobs.json', [
    { id: 'J1', est: 'FT-EST-2026-0101', name: 'Linda Whitaker', address: '12 Oak Hollow Dr, Tallahassee, FL', email: 'linda.whitaker@example.com', phone: '8505550101', status: 'approved', items: [{ title: 'Removal', detail: 'Remove the pine', price: 1200 }], created: iso(now - 5 * DAY), photos: [], crew: [] },
    { id: 'J2', est: 'FT-EST-2026-0102', name: 'Tom Hartwell', address: '48 Cedar Bend Ln, Tallahassee, FL', email: 'tom.hartwell@example.com', status: 'sent', items: [{ title: 'Pruning', price: 650 }], created: iso(now - 3 * DAY), photos: [], crew: [] },
    { id: 'J3', est: 'FT-EST-2026-0103', name: 'Rita Caldwell', address: '7 Magnolia Ct, Tallahassee, FL', email: 'rita.caldwell@example.com', status: 'invoiced', items: [{ title: 'Stump grind', price: 400 }], invoice: { amount: '$400.00', at: iso(now - DAY) }, created: iso(now - 9 * DAY), photos: [], crew: [] },
    { id: 'J4', est: 'FT-EST-2025-0050', name: 'Old Customer', address: '3 Elm St, Tallahassee, FL', email: 'old.customer@example.com', status: 'invoiced', finished: iso(now - 360 * DAY), items: [{ title: 'Trim', price: 300 }], created: iso(now - 370 * DAY), photos: [], crew: [] },
    { id: 'J5', est: 'FT-EST-2025-0060', name: 'Too Recent', address: '4 Elm St', email: 'recent@example.com', status: 'invoiced', finished: iso(now - 100 * DAY), items: [], created: iso(now - 120 * DAY), photos: [], crew: [] },
  ]);
  g.writeJson('blocks.json', []);
  return g;
}
const tokOf = (g, id) => g.ctx.ftTok_(id);
const onlyTestInbox = (g) => { for (const m of g.mails) { assert.equal(m.to, 'austin@techsourcedsolutions.com'); assert.ok(!/howard\.com/i.test(JSON.stringify([m.to, m.cc, m.bcc]))); } };

test('signed links: bad or tampered token is rejected', () => {
  const g = gas();
  assert.equal(g.post({ a: 'bookInfo', t: 'J1.deadbeef' }).ok, false);
  const t = tokOf(g, 'J1');
  assert.match(t, /^J1\.[0-9a-f]{32}$/);
  assert.equal(g.post({ a: 'bookInfo', t: 'J2' + t.slice(2) }).ok, false);
  assert.equal(g.post({ a: 'bookInfo', t }).ok, true);
});

test('self-scheduling: 14 days, AM/PM, no Sundays, taken slots skipped, pick becomes a block', () => {
  const g = gas();
  const tomorrow = ymd(Date.now() + DAY);
  g.writeJson('blocks.json', [{ id: 'BX', date: tomorrow, start: '08:00', end: '12:00', job: 'J2' }]);
  const r = g.post({ a: 'bookInfo', t: tokOf(g, 'J1') });
  assert.ok(r.slots.length > 0 && r.slots.length <= 28);
  for (const s of r.slots) { assert.notEqual(new Date(s.date + 'T12:00:00').getDay(), 0, 'no Sundays'); assert.ok(['am', 'pm'].includes(s.slot)); }
  assert.ok(!r.slots.some((s) => s.date === tomorrow && s.slot === 'am'), 'taken slot skipped');
  const pick = r.slots[0];
  const b = g.post({ a: 'bookPick', t: tokOf(g, 'J1'), date: pick.date, slot: pick.slot });
  assert.equal(b.ok, true);
  const bl = g.readJson('blocks.json').filter((x) => x.job === 'J1');
  assert.equal(bl.length, 1); assert.equal(bl[0].src, 'customer'); assert.equal(bl[0].date, pick.date);
  assert.equal(g.readJson('jobs.json').find((j) => j.id === 'J1').booked.date, pick.date);
  const again = g.post({ a: 'bookPick', t: tokOf(g, 'J3'), date: pick.date, slot: pick.slot });
  assert.equal(again.ok, false, 'same slot cannot be booked twice');
  assert.ok(g.mails.some((m) => /booked/i.test(m.subject))); onlyTestInbox(g);
});

test('day-before reminder: one email per block, never twice; texts only when the setting is on', () => {
  const g = gas({ TWILIO_SID: 'AC1', TWILIO_TOKEN: 'tok', TWILIO_FROM: '+18506131820', TEST_PHONE: '+14045565179' });
  g.writeJson('blocks.json', [{ id: 'B1', date: ymd(Date.now() + DAY), start: '08:00', end: '12:00', job: 'J1' }]);
  // the daily sweep (first staff action after 7 AM) or remindNow sends it; either way only once
  const n1 = g.post({ a: 'remindNow', pin: MGR }).sent, n2 = g.post({ a: 'remindNow', pin: MGR }).sent;
  assert.equal(n2, 0);
  assert.equal(g.mails.filter((m) => /Reminder/.test(m.subject)).length, 1);
  assert.equal(g.fetches.filter((f) => /twilio/.test(f.url)).length, 0, 'SMS off by default');
  onlyTestInbox(g);
});

test('crew on the way: email always, text only with smsOn and only to TEST_PHONE', () => {
  const g = gas({ TWILIO_SID: 'AC1', TWILIO_TOKEN: 'tok', TWILIO_FROM: '+18506131820', TEST_PHONE: '+14045565179' });
  let r = g.post({ a: 'onWay', pin: CREW, id: 'J1' });
  assert.equal(r.ok, true); assert.equal(r.sms, 'SMS off');
  assert.equal(g.post({ a: 'fSet', pin: MGR, smsOn: true }).ok, false, 'only Owner changes settings');
  assert.equal(g.post({ a: 'fSet', pin: OWN, smsOn: true }).ok, true);
  r = g.post({ a: 'onWay', pin: CREW, id: 'J1' });
  const tw = g.fetches.filter((f) => /twilio/.test(f.url));
  assert.equal(tw.length, 1); assert.equal(tw[0].o.payload.To, '+14045565179'); assert.match(tw[0].o.payload.Body, /on the way/);
  onlyTestInbox(g);
});

test('e-signature: validation, image saved to job folder, sig on job, signed PDF emailed, quote email has Review & sign', () => {
  const g = gas();
  const t = tokOf(g, 'J2');
  const png = 'data:image/png;base64,' + Buffer.alloc(900, 7).toString('base64');
  assert.equal(g.post({ a: 'signSubmit', t, choice: 'Z', name: 'Tom Hartwell', sig: png }).ok, false);
  assert.equal(g.post({ a: 'signSubmit', t, choice: 'A', name: 'T', sig: png }).ok, false);
  assert.equal(g.post({ a: 'signSubmit', t, choice: 'A', name: 'Tom Hartwell', sig: 'data:image/png;base64,AAAA' }).ok, false);
  const r = g.post({ a: 'signSubmit', t, choice: 'A', name: 'Tom Hartwell', sig: png });
  assert.equal(r.ok, true); assert.match(r.bookUrl, /^https:\/\/ft\.vnxt\.app\/book\.html\?t=/);
  const j = g.readJson('jobs.json').find((x) => x.id === 'J2');
  assert.equal(j.sig.name, 'Tom Hartwell'); assert.equal(j.sig.choice, 'A'); assert.ok(j.sig.at);
  const img = g.files[j.sig.fileId]; assert.ok(img && img.parent === j.folderId, 'signature PNG in the job folder');
  const m = g.mails.find((x) => /^\[TEST.*Signed|^Signed/.test(x.subject));
  assert.ok(m && m.attachments && /Fielder Signed Estimate/.test(m.attachments[0].getName()));
  assert.equal(g.post({ a: 'sigImg', pin: MGR, id: 'J2' }).ok, true);
  const html = g.ctx.quoteHtml_(j, '', 'cid:logo', (k) => 'x?' + k);
  assert.match(html, /Review &amp; sign online/); assert.match(html, /portal\.html\?t=/);
  onlyTestInbox(g);
});

test('Stripe: inactive without key, Checkout card+ACH, paid only after re-reading the session from Stripe', () => {
  let g = gas();
  let t = tokOf(g, 'J3');
  assert.equal(g.post({ a: 'payStart', t }).inactive, true);
  assert.doesNotMatch(g.ctx.invoiceHtml_(g.readJson('jobs.json').find((x) => x.id === 'J3'), 'cid:logo'), /Pay online/);
  g = gas({ STRIPE_SECRET_KEY: 'sk_test_' + 'x'.repeat(24) }); t = tokOf(g, 'J3');
  assert.match(g.ctx.invoiceHtml_(g.readJson('jobs.json').find((x) => x.id === 'J3'), 'cid:logo'), /Pay online/);
  const s = g.post({ a: 'payStart', t });
  assert.equal(s.ok, true, JSON.stringify(s)); assert.match(s.url, /^https:\/\/checkout\.stripe\.com\//);
  const sid = Object.keys(stripe)[0], pl = stripe[sid].payload;
  assert.equal(pl['payment_method_types[0]'], 'card'); assert.equal(pl['payment_method_types[1]'], 'us_bank_account');
  assert.equal(pl['line_items[0][price_data][unit_amount]'], '40000'); assert.equal(pl.customer_email, 'austin@techsourcedsolutions.com');
  assert.match(pl.success_url, /^https:\/\/ft\.vnxt\.app\/pay\.html\?t=.*sid=\{CHECKOUT_SESSION_ID\}$/);
  // forged webhook claiming paid: Stripe says unpaid, so nothing changes
  g.post({ object: 'event', type: 'checkout.session.completed', data: { object: { id: sid, payment_status: 'paid', metadata: { job: 'J3' } } } });
  assert.ok(!g.readJson('jobs.json').find((x) => x.id === 'J3').invoice.paid);
  assert.equal(g.post({ a: 'payConfirm', t, sid }).paid, false);
  stripe[sid].payment_status = 'paid';
  assert.equal(g.post({ a: 'payConfirm', t, sid }).paid, true);
  const inv = g.readJson('jobs.json').find((x) => x.id === 'J3').invoice; assert.equal(inv.paid, true); assert.equal(inv.stripe, sid);
  // webhook path on its own
  const g2 = gas({ STRIPE_SECRET_KEY: 'sk_test_' + 'x'.repeat(24) }); g2.post({ a: 'payStart', t: tokOf(g2, 'J3') }); const sid2 = Object.keys(stripe)[0]; stripe[sid2].payment_status = 'paid';
  g2.post({ object: 'event', type: 'checkout.session.completed', data: { object: { id: sid2 } } });
  assert.equal(g2.readJson('jobs.json').find((x) => x.id === 'J3').invoice.paid, true);
  // a session for another job never marks this one
  assert.equal(g2.post({ a: 'payConfirm', t: tokOf(g2, 'J1'), sid: sid2 }).paid, false);
});

test('keys: owner-only, write-only, never echoed back', () => {
  const g = gas();
  const key = 'sk_test_' + 'Q'.repeat(30);
  assert.equal(g.post({ a: 'fKeys', pin: MGR, STRIPE_SECRET_KEY: key }).ok, false);
  assert.equal(g.post({ a: 'fKeys', pin: OWN, STRIPE_SECRET_KEY: 'nope' }).result.STRIPE_SECRET_KEY, 'invalid');
  const r = g.post({ a: 'fKeys', pin: OWN, STRIPE_SECRET_KEY: key });
  assert.equal(r.result.STRIPE_SECRET_KEY, 'set'); assert.ok(!JSON.stringify(r).includes(key));
  assert.ok(!JSON.stringify(g.post({ a: 'fGet', pin: OWN })).includes(key));
  assert.equal(g.post({ a: 'fGet', pin: OWN }).status.stripeMode, 'test');
  assert.equal(g.post({ a: 'fSet', pin: OWN, reviewUrl: 'http://bad' }).ok, false);
});

test('GPS: clock-in far from the day\'s job is flagged; map lists last positions', () => {
  const g = gas();
  g.writeJson('blocks.json', [{ id: 'B1', date: ymd(Date.now()), start: '08:00', end: '12:00', job: 'J1' }]);
  assert.equal(g.post({ a: 'clockIn', pin: CREW, who: 'Jake Saw', gps: FAR }).ok, true);
  let gl = g.readJson('gps.json'); assert.equal(gl.length, 1); assert.equal(gl[0].flag, true, JSON.stringify(gl[0])+JSON.stringify(g.fetches.map(f=>f.url))); assert.ok(gl[0].mi > 0.5);
  assert.equal(g.post({ a: 'clockOut', pin: CREW, who: 'Jake Saw', gps: HOME }).ok, true);
  gl = g.readJson('gps.json'); assert.equal(gl[1].kind, 'out'); assert.equal(gl[1].flag, false);
  assert.ok(g.fetches.some((f) => /geocoding\.geo\.census\.gov/.test(f.url)));
  const m = g.post({ a: 'gpsMap', pin: ADM }); assert.equal(m.ok, true); assert.equal(m.flags.length, 1); assert.equal(m.last[0].who, 'Jake Saw');
  assert.equal(g.post({ a: 'gpsMap', pin: CREW }).ok, false, 'crew cannot see the map');
});

test('job costing: punches x pay rate split across the day\'s jobs, plus costs; profit and margin', () => {
  const g = gas();
  const today = ymd(Date.now());
  g.writeJson('blocks.json', [{ id: 'B1', date: today, start: '08:00', end: '12:00', job: 'J1' }, { id: 'B2', date: today, start: '12:30', end: '16:30', job: 'J3' }]);
  g.post({ a: 'clockIn', pin: CREW, who: 'Jake Saw' });
  const ps = g.ctx.ftPunches_(Date.now() - DAY, Date.now()); assert.equal(ps.length, 1);
  // backdate the punch 4 h so labor = 4 h x $25 = $100 split over 2 jobs
  for (const n of g.ctx.clockNames_(Date.now() - DAY, Date.now())) { const arr = g.ctx.clockRead_(n); arr.forEach((p) => { if (p.id === ps[0].id) { p.in = iso(Date.now() - 4 * 3600000); p.out = iso(Date.now()); } }); g.ctx.clockWrite_(n, arr); }
  assert.equal(g.post({ a: 'costAdd', pin: CREW, id: 'J1', kind: 'dump', amt: 60 }).ok, true);
  assert.equal(g.post({ a: 'costAdd', pin: CREW, id: 'J1', kind: 'dump', amt: 0 }).ok, false);
  const r = g.post({ a: 'costSummary', pin: OWN, id: 'J1' });
  const x = r.jobs[0];
  assert.equal(x.quoted, 1200); assert.equal(x.dump, 60); assert.ok(Math.abs(x.labor - 50) < 0.5, 'labor ' + x.labor); assert.ok(Math.abs(x.profit - 1090) < 0.5);
  assert.ok(Math.abs(x.margin - 90.8) < 0.2);
  const all = g.post({ a: 'costSummary', pin: OWN }); assert.ok(all.total.quoted >= 1600);
});

test('safety: crew cannot finish a job before today\'s 8-item checklist; enforced on the server', () => {
  const g = gas();
  const f1 = g.post({ a: 'finish', pin: CREW, id: 'J1', who: 'Jake Saw', notes: 'done' });
  assert.equal(f1.ok, false); assert.equal(f1.needSafety, true);
  assert.equal(g.post({ a: 'safetySave', pin: CREW, items: { ppe: 1, saws: 1 } }).ok, false);
  const all = Object.fromEntries(['ppe', 'saws', 'chipper', 'dropzone', 'lines', 'weather', 'firstaid', 'briefing'].map((k) => [k, true]));
  assert.equal(g.post({ a: 'safetySave', pin: CREW, items: all }).ok, true);
  assert.equal(g.post({ a: 'safetyStatus', pin: CREW }).done, true);
  const f2 = g.post({ a: 'finish', pin: CREW, id: 'J1', who: 'Jake Saw', notes: 'done', gps: HOME });
  assert.notEqual(f2.needSafety, true, JSON.stringify(f2));
  const rep = g.post({ a: 'safetyReport', pin: ADM, days: 3 }); assert.equal(rep.ok, true); assert.equal(rep.days.length, 3);
  // review email goes out automatically on Job complete (Maps search fallback without a review link)
  const rv = g.mails.find((m) => /How did we do/.test(m.subject)); assert.ok(rv, 'review email'); assert.match(rv.htmlBody, /google\.com\/maps\/search/);
  assert.ok(g.readJson('jobs.json').find((x) => x.id === 'J1').reviewSent);
  assert.ok(g.readJson('gps.json').some((x) => x.kind === 'done'));
  onlyTestInbox(g);
});

test('equipment: service due by hours or days', () => {
  const g = gas();
  let r = g.post({ a: 'eqSave', pin: MGR, name: 'Chipper', hours: 260, svcEveryHours: 50, lastSvcHours: 200, svcEveryDays: 0 });
  assert.equal(r.items[0].due, true);
  r = g.post({ a: 'eqSave', pin: MGR, name: 'Saw', hours: 0, svcEveryDays: 30, lastSvcDate: ymd(Date.now() - 40 * DAY) });
  assert.equal(r.items.find((x) => x.name === 'Saw').due, true);
  const id = r.items[0].id; r = g.post({ a: 'eqService', pin: CREW, id });
  assert.equal(r.items.find((x) => x.id === id).due, false);
});

test('reviews + yearly follow-ups: 330-400 days only, one-tap send, review link setting used', () => {
  const g = gas();
  const l = g.post({ a: 'followList', pin: MGR }).items;
  assert.deepEqual(l.map((x) => x.id), ['J4']);
  assert.equal(g.post({ a: 'followSend', pin: MGR, ids: ['J4'] }).sent, 1);
  assert.ok(g.readJson('jobs.json').find((x) => x.id === 'J4').followSent);
  g.post({ a: 'fSet', pin: OWN, reviewUrl: 'https://g.page/r/fielder-review' });
  assert.equal(g.post({ a: 'reviewSend', pin: MGR, id: 'J3' }).ok, true);
  assert.match(g.mails.at(-1).htmlBody, /g\.page\/r\/fielder-review/);
  onlyTestInbox(g);
});

test('storm mode: owner toggle, P1-P5 hazards, priority queue with statuses', () => {
  const g = gas();
  assert.equal(Object.keys(g.post({ a: 'fGet', pin: OWN }).hazards).length, 8);
  assert.equal(g.post({ a: 'fSet', pin: CREW, storm: true }).ok, false);
  assert.equal(g.post({ a: 'fSet', pin: OWN, storm: true }).status.storm, true);
  g.post({ a: 'stormAdd', pin: MGR, name: 'Yard Call', hazard: 'yard', address: '1 A St' });
  const r = g.post({ a: 'stormAdd', pin: MGR, name: 'House Call', hazard: 'house', address: '2 B St' });
  assert.deepEqual(r.items.map((x) => x.prio), [1, 5]);
  const s = g.post({ a: 'stormSet', pin: MGR, id: r.items[0].id, status: 'done' });
  assert.equal(s.items.at(-1).status, 'done');
  assert.equal(g.post({ a: 'stormList', pin: CREW }).storm, true);
});

test('QuickBooks export + customer portal', () => {
  const g = gas();
  const q = g.post({ a: 'qbExport', pin: ADM });
  assert.equal(q.ok, true); assert.equal(q.invoices.find((x) => x.customer === 'Rita Caldwell').amount, 400);
  assert.equal(g.post({ a: 'qbExport', pin: CREW }).ok, false);
  const l = g.post({ a: 'portalLink', pin: MGR, id: 'J3' });
  assert.match(l.url, /^https:\/\/ft\.vnxt\.app\/portal\.html\?t=J3\./);
  const p = g.post({ a: 'portalInfo', t: decodeURIComponent(l.url.split('t=')[1]) }).p;
  assert.equal(p.invoice.amount, 400); assert.equal(p.co.name, 'Fielder Tree Care & Service'); assert.ok(p.links.pay && p.links.sign && p.links.book);
  assert.ok(!JSON.stringify(p).includes('internalNotes'));
  // every customer email links the portal
  g.post({ a: 'bookSend', pin: MGR, id: 'J1' });
  assert.match(g.mails.at(-1).htmlBody, /portal\.html\?t=/);
  onlyTestInbox(g);
});

test('test-run guard: howard.com customer email still only reaches the test inbox', () => {
  const g = gas({ TEST_EMAIL_TO: 'astinson@howard.com' });
  const js = g.readJson('jobs.json'); js[0].email = 'astinson@howard.com'; g.writeJson('jobs.json', js);
  g.post({ a: 'bookSend', pin: MGR, id: 'J1' });
  onlyTestInbox(g);
});
