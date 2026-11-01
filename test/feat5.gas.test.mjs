// Backend tests for batch 5 (Miller 918c4d0): fast Timber model + minimal thinking (retry without on 400), cached reads,
// Gemini TTS, spreadsheets (CSV to Drive), cannotDo/askVnxt (email only to austin@techsourcedsolutions.com), Supplies + VNXT lists.
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeGas } from './gas-harness.mjs';
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
const say = (t) => () => ok({ candidates: [{ content: { parts: [{ text: t }] } }] });
const call = (name, args) => () => ok({ candidates: [{ content: { parts: [{ functionCall: { name, args } }] } }] });
test('Timber uses gemini-3.5-flash-lite with minimal thinking; retries without thinking on a 400', () => {
  const g = gas(); GEM = [() => ({ code: 400, body: { error: { message: 'thinking not supported' } } }), say('Hi.')];
  const r = g.post({ a: 'timber', pin: OWN, q: 'hello' }); assert.equal(r.ok, true, JSON.stringify(r));
  assert.match(calls[0].url, /models\/gemini-3\.5-flash-lite:generateContent/); assert.deepEqual(calls[0].body.generationConfig.thinkingConfig, { thinkingLevel: 'minimal' });
  assert.equal(calls[1].body.generationConfig.thinkingConfig, undefined);
});
test('voice quote fill uses gemini-3.1-flash-lite with minimal thinking', () => {
  const g = gas(); GEM = [() => ok({ candidates: [{ content: { parts: [{ text: '{"customer":{"name":"Pat"},"items":[]}' }] } }] })];
  g.post({ a: 'voiceQuote', pin: MGR, text: 'Pat wants two oaks removed' });
  assert.match(calls[0].url, /models\/gemini-3\.1-flash-lite:generateContent/); assert.deepEqual(calls[0].body.generationConfig.thinkingConfig, { thinkingLevel: 'minimal' });
});
test('read functions are cached; a write action clears the cache', () => {
  const g = gas(); let n = 0; const F = g.ctx.TB_FUNCS.jobs.f; g.ctx.TB_FUNCS.jobs.f = (a) => { n++; return F(a); };
  g.ctx.tbRun_('jobs', {}); g.ctx.tbRun_('jobs', {}); assert.equal(n, 1, 'second read served from cache');
  g.ctx.tbBust_(); g.ctx.tbRun_('jobs', {}); assert.equal(n, 2, 'bust re-reads');
});
test('TTS: Gemini voice Sulafat, audio returned', () => {
  const g = gas(); GEM = [(b) => { assert.equal(b.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName, 'Sulafat'); return ok({ candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/wav', data: 'UklGRg==' } }] } }] }); }];
  const r = g.post({ a: 'timber', pin: OWN, tts: 'Labor today is $100.' }); assert.equal(r.ok, true); assert.equal(r.audio, 'UklGRg=='); assert.match(calls[0].url, /gemini-3\.8-flash-lite-tts/);
});
test('makeSpreadsheet: CSV saved to Drive, Open spreadsheet button; role checks', () => {
  const g = gas(); GEM = [call('makeSpreadsheet', { what: 'jobs' }), say('Your spreadsheet is ready.')];
  const r = g.post({ a: 'timber', pin: OWN, q: 'make me a spreadsheet of jobs' }); assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.open.label, '📊 Open spreadsheet'); assert.match(r.open.csv, /^Job #,Customer/); assert.match(r.open.csv, /Linda Whitaker/); assert.match(r.open.name, /^Fielder jobs /);
  g.ctx.FT_TBD_ = { pin: ADM }; assert.equal(g.ctx.tbRun_('makeSpreadsheet', { what: 'quotes' }).ok, false, 'Office cannot export quotes');
});
test('cannotDo offers Ask the VNXT team; askVnxt logs it and emails only austin@techsourcedsolutions.com', () => {
  const g = gas(); GEM = [call('cannotDo', { request: 'Text every customer a coupon' }), say('I cannot do that yet. Want me to ask the VNXT team?')];
  const r = g.post({ a: 'timber', pin: OWN, q: 'Text every customer a coupon' }); assert.equal(r.offer.request, 'Text every customer a coupon');
  const v = g.post({ a: 'timber', pin: OWN, vnxt: 'Text every customer a coupon' }); assert.equal(v.answer, 'Sent to the VNXT team.');
  assert.equal(g.readJson('vnxt_requests.json')[0].request, 'Text every customer a coupon');
  assert.ok(g.mails.length >= 1); for (const m of g.mails) assert.equal(m.to, 'austin@techsourcedsolutions.com');
  assert.match(g.mails.at(-1).subject, /Fielder Tree: Timber request/);
  assert.equal(g.post({ a: 'vxList', pin: OWN }).items.length, 1); assert.equal(g.post({ a: 'vxList', pin: MGR }).ok, false, 'Owner only');
  const id = g.post({ a: 'vxList', pin: OWN }).items[0].id; assert.equal(g.post({ a: 'vxStep', pin: OWN, id }).item.status, 'Working on it');
});
test('Supplies: any role adds (crew too), approved, then Owner/Office advance Needed -> Ordered -> Got it; Timber addSupply opens Supplies', () => {
  const g = gas();
  const a = g.post({ a: 'supAdd', pin: CREW, item: 'Chainsaw chains', qty: '4', store: 'Home Depot' }); assert.equal(a.ok, true); assert.equal(a.item.who, 'Jake Saw');
  assert.equal(g.post({ a: 'supStep', pin: CREW, id: a.item.id }).ok, false);
  assert.equal(g.post({ a: 'supDecide', pin: MGR, id: a.item.id, yes: true }).item.status, 'Needed');
  assert.equal(g.post({ a: 'supStep', pin: ADM, id: a.item.id }).item.status, 'Ordered'); assert.equal(g.post({ a: 'supStep', pin: OWN, id: a.item.id }).item.status, 'Got it');
  assert.equal(g.post({ a: 'supList', pin: MGR }).open, 0);
  GEM = [call('addSupply', { item: 'bar oil', qty: '2 gallons' }), say('Added bar oil to Supplies.')];
  const r = g.post({ a: 'timber', pin: OWN, q: 'order more bar oil' }); assert.equal(r.open.supplies, true); assert.equal(r.open.label, 'Open Supplies');
  assert.equal(g.post({ a: 'supList', pin: OWN }).open, 1); for (const m of g.mails) assert.equal(m.to, 'austin@techsourcedsolutions.com');
});
