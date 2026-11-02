// Backend tests for batch 6 (Miller 2374915 + 46db9db, Fielder): Timber stream endpoints (ctx/tool with the caller's PIN),
// supply approval with signed single-use email links (test inbox only), receipt scanner (no approval email; Owner reviews; Drive Receipts/<month>; job materials cost).
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeGas } from './gas-harness.mjs';
import { makeLinks } from '../worker/links.mjs';
const OWN = '4321', MGR = '1234', ADM = '6789', CREW = '5522', DAY = 864e5;
const iso = (ms) => new Date(ms).toISOString();
let GEM = [], calls = [];
function gas() {
  calls = [];
  const g = makeGas({ code: process.env.GAS_CODE, props: { GEMINI_API_KEY: 'test-key-not-real', EMPLOYEES_JSON: JSON.stringify([{ id: 'E1', name: 'Jake Saw', role: 'Crew', pin: CREW, payRate: 25 }]) },
    fetch: (url, o) => { if (/generativelanguage/.test(url)) { const body = JSON.parse(o.payload); calls.push({ url, body }); const r = GEM.shift(); return r ? r(body, url) : { code: 500, body: '{}' }; } return { code: 599, body: 'offline' }; } });
  g.writeJson('jobs.json', [{ id: 'J1', est: 'FT-EST-2026-0101', jobNo: 'FT-JOB-2026-0101', wonAt: iso(Date.now()), name: 'Linda Whitaker', address: '12 Oak', email: 'l@example.com', status: 'approved', items: [{ title: 'Removal', price: 1200 }], created: iso(Date.now() - DAY), photos: [], crew: [] }]);
  g.writeJson('blocks.json', []);
  return g;
}
const ok = (x) => ({ code: 200, body: x });
const linkOf = (m, v) => new URL((m.body.match(new RegExp((v === 'yes' ? 'Approve' : 'Deny') + ': (\\S+)')) || [])[1]);
const execGet = (g, params) => g.ctx.doGet({ parameter: params }).getContent();
// the real Worker /a handler, with /exec served by the emulated Apps Script
const worker = (g) => makeLinks({ exec: 'https://script.google.com/macros/s/X/exec', fetch: async (url) => new Response(execGet(g, Object.fromEntries(new URL(url).searchParams)), { headers: { 'content-type': 'application/json' } }) });
const getPage = (g, u) => worker(g)(new Request(u.href)).then((r) => r.text());
const PHOTO = 'data:image/jpeg;base64,' + Buffer.from('fakejpeg').toString('base64');
test('supply request waits approval; email to test inbox only with signed single-use Approve/Deny links on ft.vnxt.app/a', async () => {
  const g = gas(); const a = g.post({ a: 'supAdd', pin: CREW, item: 'Bar oil', qty: '2 gallons' });
  assert.equal(a.item.status, 'Waiting approval'); assert.equal(a.item.nonce, undefined, 'nonce never sent to the app');
  assert.equal(g.mails.length, 1); assert.equal(g.mails[0].to, 'austin@techsourcedsolutions.com'); assert.match(g.mails[0].subject, /^Fielder Tree: supply request - Bar oil/); assert.match(g.mails[0].htmlBody, />Approve<\/a>/);
  assert.equal(g.post({ a: 'supStep', pin: OWN, id: a.item.id }).ok, false, 'no steps before approval');
  const yes = linkOf(g.mails[0], 'yes'); assert.equal(yes.origin + yes.pathname, 'https://ft.vnxt.app/a'); assert.ok(!/script\.google/.test(g.mails[0].htmlBody), 'no /exec links in the email');
  const bad = new URL(yes.href); bad.searchParams.set('s', 'forged'); assert.match(await getPage(g, bad), /Link not valid/); assert.equal(g.readJson('supplies.json')[0].status, 'Waiting approval');
  const old = execGet(g, Object.fromEntries(yes.searchParams)); assert.match(old, /ft\.vnxt\.app\/a\?a=ok&k=sup/, 'old /exec link bounces to the Worker'); assert.equal(g.readJson('supplies.json')[0].status, 'Waiting approval');
  const pg = await getPage(g, yes); assert.match(pg, /✔ Approved: Bar oil/); assert.match(pg, /Fielder Field Desk/); assert.match(pg, /Open Field Desk/); assert.equal(g.readJson('supplies.json')[0].status, 'Needed');
  assert.match(await getPage(g, yes), /Already Needed/, 'link works once'); assert.match(await getPage(g, linkOf(g.mails[0], 'no')), /Nothing changed/);
  assert.equal(g.readJson('supplies.json')[0].status, 'Needed');
});
test('in-app approve: Owner, Office, Estimator yes; Crew no; Timber approve the X', () => {
  const g = gas(); const a = g.post({ a: 'supAdd', pin: CREW, item: 'Chainsaw chains' }), b = g.post({ a: 'supAdd', pin: CREW, item: 'Rope' });
  assert.equal(g.post({ a: 'supDecide', pin: CREW, id: a.item.id, yes: true }).ok, false);
  assert.equal(g.post({ a: 'supList', pin: CREW }).canDecide, false); assert.equal(g.post({ a: 'supList', pin: ADM }).canDecide, true);
  assert.equal(g.post({ a: 'supDecide', pin: ADM, id: a.item.id, yes: false }).item.status, 'Denied');
  assert.equal(g.post({ a: 'supDecide', pin: MGR, id: a.item.id, yes: true }).ok, false, 'already decided');
  GEM = [() => ok({ candidates: [{ content: { parts: [{ functionCall: { name: 'approve', args: { name: 'rope' } } }] } }] }), () => ok({ candidates: [{ content: { parts: [{ text: 'Rope is now Needed.' }] } }] })];
  const r = g.post({ a: 'timber', pin: MGR, q: 'approve the rope' }); assert.equal(r.open.supplies, true);
  assert.equal(g.readJson('supplies.json').find((x) => x.id === b.item.id).status, 'Needed');
  for (const m of g.mails) assert.equal(m.to, 'austin@techsourcedsolutions.com');
});
test('receipt scan: Gemini reads it, photo in Drive Receipts/<month>, NO email, job materials cost; Owner reviews all', () => {
  const g = gas(); GEM = [(b, url) => { assert.match(url, /gemini-3\.1-flash-lite:generateContent/); return ok({ candidates: [{ content: { parts: [{ text: JSON.stringify({ store: 'Home Depot', date: '2026-10-28', total: 67.12, tax: 4.2, items: [{ name: 'Bar oil', qty: 2, price: 31.46 }] }) }] } }] }); }];
  const mails0 = g.mails.length; const r = g.post({ a: 'rcpScan', pin: CREW, photo: PHOTO, jobId: 'J1' }); assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.item.store, 'Home Depot'); assert.equal(r.item.total, 67.12); assert.equal(r.item.jobName, 'Linda Whitaker'); assert.equal(r.item.who, 'Jake Saw'); assert.equal(g.mails.length, mails0, 'no receipt email');
  const rf = Object.values(g.folders).find((f) => f.name === 'Receipts'); assert.ok(rf); assert.ok(Object.values(g.folders).find((f) => f.name === '2026-10' && f.parent === rf.id));
  const cost = g.readJson('jobs.json')[0].costs; assert.equal(cost.length, 1); assert.equal(cost[0].kind, 'materials'); assert.equal(cost[0].amt, 67.12);
  GEM = [() => ok({ candidates: [{ content: { parts: [{ text: '{"store":"Lowes","date":"2026-11-01","total":10}' }] } }] })];
  g.post({ a: 'rcpScan', pin: MGR, photo: PHOTO });
  const o = g.post({ a: 'rcpList', pin: OWN }); assert.equal(o.items.length, 2); assert.equal(o.canPay, true); assert.deepEqual(o.months, ['2026-11', '2026-10']);
  assert.equal(g.post({ a: 'rcpList', pin: OWN, month: '2026-10' }).items.length, 1);
  assert.equal(g.post({ a: 'rcpList', pin: CREW }).items.length, 1, 'crew sees only their own');
  assert.equal(g.post({ a: 'rcpPaid', pin: ADM, id: r.item.id }).ok, false, 'Owner only');
  assert.equal(g.post({ a: 'rcpPaid', pin: OWN, id: r.item.id }).item.reimbursed, true); assert.equal(g.post({ a: 'rcpPaid', pin: OWN, id: r.item.id }).item.reimbursed, false);
  assert.equal(g.ctx.TB_FUNCS.receipts.f({ store: 'home depot' }).total, 67.12);
  g.post({ a: 'rcpArchive', pin: OWN, id: r.item.id }); assert.equal(g.readJson('jobs.json')[0].costs.length, 0, 'archive removes the job cost');
});
test('Worker endpoints: ctx gives prompt, declarations, actions, snapshot; tool runs with the caller PIN and returns open', () => {
  const g = gas(); const c = g.post({ a: 'timber', pin: OWN, ctx: 1 }); assert.equal(c.ok, true, JSON.stringify(c));
  assert.match(c.sys, /You are Timber/); assert.match(c.sys, /SNAPSHOT: /); assert.ok(c.decl.find((d) => d.name === 'addSupply')); assert.ok(c.acts.includes('addSupply')); assert.ok(!c.acts.includes('today')); assert.equal(c.model, 'gemini-3.5-flash-lite');
  assert.equal(calls.length, 0, 'ctx does not call Gemini');
  const t = g.post({ a: 'timber', pin: MGR, tool: 'addSupply', args: { item: 'Wedges' } }); assert.equal(t.ok, true, JSON.stringify(t)); assert.equal(t.open.supplies, true); assert.equal(g.readJson('supplies.json')[0].status, 'Waiting approval');
  assert.equal(g.post({ a: 'timber', pin: CREW, tool: 'addSupply', args: { item: 'X' } }).ok, false, 'crew has no Timber (unchanged)');
  assert.equal(g.post({ a: 'timber', tool: 'today', args: {} }).ok, false, 'PIN required');
});
test('speak/voice requests: prompt says Voice is on and never cannotDo/askVnxt; no VNXT mail', () => {
  const g = gas(); const c = g.post({ a: 'timber', pin: OWN, ctx: 1 }); assert.equal(c.ok, true);
  assert.match(c.sys, /Your replies are spoken out loud by the app when Voice is on/); assert.match(c.sys, /cannot hear you, give short practical steps: turn the phone volume up/); assert.match(c.sys, /Never answer with only the words Voice is on/); assert.match(c.sys, /NEVER call cannotDo or askVnxt for speak, voice or audible requests/);
  assert.match(c.decl.find((d) => d.name === 'cannotDo').description, /Never for requests to speak/);
});
test('customer quote answer links go through ft.vnxt.app/x; the time-window form posts back to /x; old /exec links bounce', async () => {
  const g = gas(); const u = new URL(g.ctx.respUrl_({ id: 'J1' }, 'C')); assert.equal(u.origin + u.pathname, 'https://ft.vnxt.app/x');
  g.ctx.writeJson ? 0 : 0; const js = g.readJson('jobs.json'); js[0].status = 'sent'; g.writeJson('jobs.json', js);
  const f = await getPage(g, new URL('https://ft.vnxt.app/x?a=respond&id=J1&ans=B')); assert.match(f, /action="\/x"/); assert.match(f, /Fielder Field Desk/); assert.ok(!/script\.google/.test(f));
  const done = await getPage(g, new URL('https://ft.vnxt.app/x?a=respond&id=J1&ans=B&done=1&text=Less+please&avail=Weekends')); assert.match(done, /Thank you/);
  assert.equal(g.readJson('jobs.json')[0].response.text, 'Less please');
  assert.match(execGet(g, { a: 'respond', id: 'J1', ans: 'C' }), /ft\.vnxt\.app\/x\?a=respond&id=J1&ans=C/);
});
test('/api/gas proxies customer-page JSON calls (GET and POST) to Apps Script', async () => {
  const seen = []; const h = makeLinks({ exec: 'https://script.google.com/macros/s/X/exec', fetch: async (url, init) => { seen.push({ url, method: init.method || 'GET', body: init.body }); return new Response('{"ok":true,"n":1}'); } });
  const r1 = await h(new Request('https://ft.vnxt.app/api/gas?a=quotePublic&t=abc')); assert.deepEqual(await r1.json(), { ok: true, n: 1 }); assert.equal(seen[0].url, 'https://script.google.com/macros/s/X/exec?a=quotePublic&t=abc');
  const r2 = await h(new Request('https://ft.vnxt.app/api/gas', { method: 'POST', body: '{"a":"sign"}' })); assert.equal(r2.headers.get('content-type'), 'application/json; charset=utf-8'); assert.equal(seen[1].method, 'POST'); assert.equal(seen[1].body, '{"a":"sign"}');
});
