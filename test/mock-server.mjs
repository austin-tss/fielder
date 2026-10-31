import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FD = require(path.join(root, 'form.js'));

const jobs = [{
  id: 'FT-OLD',
  est: 'FT-EST-2026-0001',
  name: 'Existing Oak',
  address: '10 Tree Ln, Tallahassee, FL',
  email: 'existing@example.com',
  service: 'Removal',
  species: 'Live oak',
  quote: 'Remove the oak by the driveway',
  items: [{ title: 'Removal', detail: 'Remove the oak.', price: 1800 }],
  total: 1800,
  additionalNotes: 'Visible oak note',
  internalNotes: 'SECRET-OLD-INTERNAL',
  notes: 'manager scratch',
  status: 'sent',
  created: '2026-10-01T12:00:00.000Z',
  photos: [],
  crew: []
}, {
  id: 'FT-DONE',
  est: 'FT-EST-2026-0002',
  name: 'Finished Pine',
  address: '2 Pine St, Tallahassee, FL',
  email: 'pine@example.com',
  service: 'Pruning',
  quote: 'Prune the pine',
  items: [{ title: 'Pruning', detail: 'Prune the pine.', price: 600 }],
  total: 600,
  additionalNotes: 'Pine note',
  internalNotes: 'SECRET-PINE',
  status: 'complete',
  created: '2026-10-02T12:00:00.000Z',
  photos: [],
  crew: []
}];
let settings = { form: null, quoteBody: '', quoteSubject: '', quoteSign: '', theme: 'classic' };
const feedback = [];
let VOICE = false;
export function setVoice(v) { VOICE = !!v; }
export const created = [];
let blocks = [];
let ARCH_DELAY = 0;
const ARCH_FAIL = new Set();
export function archiveMode(delay, failIds) { ARCH_DELAY = delay || 0; ARCH_FAIL.clear(); (failIds || []).forEach((x) => ARCH_FAIL.add(x)); }
let employees = [{ id: 'E1', name: 'Ada Admin', email: 'ada@example.com', role: 'Admin', pin: '5511' }, { id: 'E2', name: 'Sam Saw', email: 'sam@example.com', role: 'Crew', pin: '5522' }];
export const outbox = [];
export const texts = [];
export const customers = [];
let TWILIO = false;
export function setTwilio(v) { TWILIO = !!v; }
const tok = () => Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
const phoneOk = (p) => { const d = String(p || '').replace(/\D/g, ''); return d.length === 10 || (d.length === 11 && d[0] === '1'); };
function textLink(j) { if (!j.pt) j.pt = tok(); texts.push({ to: 'TEST_PHONE', customer: j.phone, link: 'quote.html?id=' + j.pt }); }
function pubQuote(t) { const j = jobs.find((x) => x.pt && x.pt === t && !x.archived); if (!j) return { ok: false, err: 'This quote link is not valid. Please call (850) 656-8737.' };
  return { ok: true, quote: { est: j.est, name: j.name, address: j.address, date: j.created, items: (j.items || []).map((i) => ({ title: i.title, detail: i.detail || '', price: i.price == null || i.price === '' ? null : Number(i.price) })), total: j.total, custHtml: '', approved: j.status === 'approved', status: j.status } }; }
const ROLEPINS = { '1234': 'Manager', '0123': 'Crew', '6789': 'Admin' };
const pub = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });
const hits = [];

function send(res, code, body, type) {
  const buf = Buffer.from(body);
  res.writeHead(code, { 'Content-Type': type || 'application/json; charset=utf-8', 'Content-Length': buf.length, 'Cache-Control': 'no-store' });
  res.end(buf);
}
function customerHtml(job) {
  const form = FD.normalizeForm(settings.form);
  const face = FD.customerJob(job);
  return FD.specHtml(face, form) + FD.additionalNotesHtml(face, form) + FD.customerPreviewHtml(job, form);
}
function publicSettings() {
  const form = FD.normalizeForm(settings.form);
  settings.form = form;
  return { form, quoteBody: settings.quoteBody || '', quoteSubject: settings.quoteSubject || '', quoteSign: settings.quoteSign || '', theme: settings.theme === 'dark' ? 'dark' : 'classic', voice: VOICE, placesKey: '' };
}

function handleApi(req, res, body) {
  if (req.method === 'GET') {
    const q = new URL(req.url, 'http://x').searchParams;
    if (q.get('a') === 'quotePublic') return send(res, 200, JSON.stringify(pubQuote(q.get('t'))));
    send(res, 200, JSON.stringify({ ok: true, root: 'https://drive.google.com/drive/folders/MOCK-ROOT', jobs: jobs.filter((j) => !j.archived), blocks, customers, settings: publicSettings() }));
    return;
  }
  const d = JSON.parse(body || '{}');
  hits.push({ a: d.a || '', to: d.email || '', send: !!d.send, keys: Object.keys(d) });
  if (d.a === 'login') {
    const e = employees.find((u) => u.pin === String(d.pin || ''));
    const r = e ? e.role : ROLEPINS[String(d.pin || '')];
    return send(res, 200, JSON.stringify(r ? { ok: true, role: r, name: e ? e.name : '' } : { ok: false, err: 'Wrong PIN' }));
  }
  if (/^clock(Status|In|Out|List|Fix)$/.test(d.a || '')) {
    const e = employees.find((u) => u.pin === String(d.pin || ''));
    clockApi(d, e ? e.role : ROLEPINS[String(d.pin || '')], e ? e.name : '').then((r) => send(res, 200, JSON.stringify(r)));
    return;
  }
  if (d.a === 'empList' || d.a === 'empAdd' || d.a === 'empDel') {
    const me = employees.find((u) => u.pin === String(d.pin || ''));
    const role = me ? me.role : ROLEPINS[String(d.pin || '')];
    if (role !== 'Admin') return send(res, 200, JSON.stringify({ ok: false, err: 'Only Admin can manage employees.' }));
    if (d.a === 'empDel') {
      const t = employees.find((u) => u.id === d.id);
      if (!t) return send(res, 200, JSON.stringify({ ok: false, err: 'Employee not found' }));
      if (me && me.id === t.id) return send(res, 200, JSON.stringify({ ok: false, err: 'You cannot delete yourself.' }));
      if (t.role === 'Admin' && employees.filter((u) => u.role === 'Admin').length <= 1) return send(res, 200, JSON.stringify({ ok: false, err: 'You cannot delete the last Admin.' }));
      employees = employees.filter((u) => u.id !== t.id);
    }
    if (d.a === 'empAdd') {
      if (!d.name || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email || '')) return send(res, 200, JSON.stringify({ ok: false, err: 'That email does not look right' }));
      const e = { id: 'E' + (employees.length + 10), name: d.name, email: d.email, role: d.role, pin: String(7000 + employees.length) };
      employees.push(e);
      outbox.push({ to: e.email, code: e.pin });
      return send(res, 200, JSON.stringify({ ok: true, code: e.pin, mailed: true, employee: pub(e), employees: employees.map(pub) }));
    }
    return send(res, 200, JSON.stringify({ ok: true, employees: employees.map(pub) }));
  }
  if (d.a === 'block' || d.a === 'unblock') {
    blocks = blocks.filter((b) => b.id !== d.block.id);
    if (d.a === 'block') { if (!d.block.id) d.block.id = 'B' + Date.now() + Math.random().toString(36).slice(2, 5); blocks.push(d.block); }
    return send(res, 200, JSON.stringify({ ok: true, blocks }));
  }
  if (d.a === 'qnList') return send(res, 200, JSON.stringify({ ok: true, items: [{ id: 'Q1', name: 'Mock Request', subject: 'Quote request', received: '2026-10-27T12:00:00Z' }, { id: 'Q2', name: 'Mock Request 2', subject: 'Estimate', received: '2026-10-27T13:00:00Z' }] }));
  if (d.a === 'voiceQuote') {
    if (!VOICE) return send(res, 200, JSON.stringify({ ok: false, setup: true, err: 'Voice quotes need setup' }));
    if (!d.audio && !d.text) return send(res, 200, JSON.stringify({ ok: false, err: 'Say or type the quote first.' }));
    return send(res, 200, JSON.stringify({ ok: true, result: {
      transcript: 'mock',
      customer: { name: 'Pat Voice', phone: '850-555-0101', email: 'pat.voice@example.com', address: '12 Live Oak Ln, Tallahassee, FL 32312' },
      estimate: { items: [{ service: 'Live Oak Removal', description: 'Remove the leaning live oak by the driveway.', qty: 1, price: 1800 }, { service: 'Stump Grinding', description: 'Grind the stump below grade.', qty: 2, price: 150 }], total: 2100, customerNotes: 'Work can start next week.' },
      crew: { access: 'Gate code 4321, dog in yard', hazards: 'Power line over the oak', equipment: 'Bucket truck and stump grinder', cleanup: 'Haul all debris', trees: 'Oak on the left of the driveway, 30 inch', internalNotes: 'Customer is picky, price is firm' }
    } }));
  }
  if (d.a === 'archive') {
    if (ARCH_DELAY) return setTimeout(() => { if (ARCH_FAIL.has(d.id)) return send(res, 200, JSON.stringify({ ok: false, err: 'Job not found' })); const jb = jobs.find((j) => j.id === d.id); if (jb) jb.archived = !d.undo; send(res, 200, JSON.stringify({ ok: true })); }, ARCH_DELAY);
    const job = jobs.find((j) => j.id === d.id);
    if (!job) return send(res, 200, JSON.stringify({ ok: false, err: 'Job not found' }));
    job.archived = !d.undo;
    return send(res, 200, JSON.stringify({ ok: true }));
  }
  if (d.a === 'settings') {
    if (ROLEPINS[String(d.pin || '')] !== 'Manager' && !employees.some((u) => u.pin === String(d.pin || '') && u.role === 'Manager')) return send(res, 200, JSON.stringify({ ok: false, err: 'That PIN cannot change the quote form.' }));
    settings = {
      form: FD.normalizeForm(d.form),
      quoteBody: String(d.quoteBody || ''),
      quoteSubject: String(d.quoteSubject || ''),
      quoteSign: String(d.quoteSign || ''),
      theme: d.theme === 'dark' ? 'dark' : (d.theme === 'classic' ? 'classic' : settings.theme)
    };
    return send(res, 200, JSON.stringify({ ok: true, settings: publicSettings() }));
  }
  if (d.a === 'importCustomers') {
    if (!['1234', '6789'].includes(String(d.pin || ''))) return send(res, 200, JSON.stringify({ ok: false, err: 'Your role cannot do that.' }));
    const rows = d.rows || [];
    if (rows.length > 2000) return send(res, 200, JSON.stringify({ ok: false, err: 'Too many rows.' }));
    let added = 0, skipped = 0;
    const dig = (v) => String(v || '').replace(/\D/g, '');
    rows.forEach((r) => { if (!r.name || customers.some((c) => (r.email && c.email === r.email) || (dig(r.phone).length >= 7 && dig(c.phone) === dig(r.phone)))) { skipped++; return; } customers.push({ id: 'C' + (customers.length + 1), name: r.name, email: r.email || '', phone: r.phone || '', address: r.address || '', source: 'csv' }); added++; });
    return send(res, 200, JSON.stringify({ ok: true, added, skipped, customers }));
  }
  if (d.a === 'feedback') {
    feedback.push({ text: d.text || '', role: d.role || '' });
    return send(res, 200, JSON.stringify({ ok: true }));
  }
  if (d.a === 'cedit') {
    const ids = d.ids || [];
    jobs.forEach((j) => {
      if (!ids.includes(j.id)) return;
      j.name = d.name || '';
      j.phone = d.phone || '';
      j.email = d.email || '';
      j.address = d.address || '';
      j.phone2 = d.phone2 || '';
      j.contact2 = d.contact2 || '';
    });
    return send(res, 200, JSON.stringify({ ok: true }));
  }
  if (d.a === 'approvePublic') {
    const j = jobs.find((x) => x.pt && x.pt === d.t);
    if (!j) return send(res, 200, JSON.stringify({ ok: false, err: 'This quote link is not valid.' }));
    j.status = 'approved'; j.response = { ans: 'A', label: 'Approved', text: 'Approved on the quote page' };
    return send(res, 200, JSON.stringify({ ok: true }));
  }
  if (d.a === 'sendQuoteText') {
    if (!TWILIO) return send(res, 200, JSON.stringify({ ok: false, err: "Texting isn't set up yet. Use Email for now." }));
    const j = jobs.find((x) => x.id === d.id);
    if (!j) return send(res, 200, JSON.stringify({ ok: false, err: 'Job not found' }));
    if (!phoneOk(j.phone)) return send(res, 200, JSON.stringify({ ok: false, err: 'Add the customer phone number first.' }));
    textLink(j);
    return send(res, 200, JSON.stringify({ ok: true, job: j, link: 'quote.html?id=' + j.pt }));
  }
  if (d.a === 'create' && d.via === 'text') {
    if (!TWILIO) return send(res, 200, JSON.stringify({ ok: false, err: "Texting isn't set up yet. Use Email for now." }));
    if (!phoneOk(d.phone)) return send(res, 200, JSON.stringify({ ok: false, err: 'Add the customer phone number to text the quote.' }));
  }
  if (d.a === 'create') {
    const items = Array.isArray(d.items) ? d.items : [];
    const job = {
      id: 'FT-NEW',
      est: 'FT-EST-2026-0099',
      name: d.name || '',
      address: d.address || '',
      email: d.email || '',
      quote: d.quote || '',
      items,
      total: items.reduce((a, i) => a + (Number(i.price) || 0), 0),
      phone: d.phone || '',
      service: d.service || '',
      species: d.species || '',
      timing: d.timing || '',
      access: d.access || '',
      additionalNotes: d.additionalNotes || '',
      internalNotes: d.internalNotes || '',
      custom: d.custom || {},
      notes: d.notes || '',
      status: 'sent',
      created: new Date().toISOString(),
      photos: [],
      crew: []
    };
    if (d.via === 'text') textLink(job);
    jobs.unshift(job);
    created.push({ body: d, html: customerHtml(job) });
    return send(res, 200, JSON.stringify({ ok: true, job, customerHtml: customerHtml(job) }));
  }
  if (d.a === 'qedit') {
    const job = jobs.find((j) => j.id === d.id);
    if (!job) return send(res, 200, JSON.stringify({ ok: false, err: 'Job not found' }));
    job.name = d.name || job.name;
    job.address = d.address || '';
    job.email = d.email || '';
    job.quote = d.quote || '';
    job.items = Array.isArray(d.items) ? d.items : job.items;
    job.total = (job.items || []).reduce((a, i) => a + (Number(i.price) || 0), 0);
    ['phone', 'service', 'species', 'timing', 'access', 'additionalNotes', 'internalNotes'].forEach((k) => { if (k in d) job[k] = d[k] || ''; });
    if (d.custom) job.custom = d.custom;
    return send(res, 200, JSON.stringify({ ok: true, job, emailed: false }));
  }
  if (d.a === 'iedit') {
    const job = jobs.find((j) => j.id === d.id);
    if (!job) return send(res, 200, JSON.stringify({ ok: false, err: 'Job not found' }));
    job.invoice = job.invoice || {};
    job.invoice.amount = d.amount || '';
    job.invoice.note = d.note || '';
    return send(res, 200, JSON.stringify({ ok: true, job }));
  }
  send(res, 200, JSON.stringify({ ok: false, err: 'Bad action' }));
}

export function start(port) {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    if (u.pathname === '/__hits') return send(res, 200, JSON.stringify(hits));
    if (u.pathname === '/exec') {
      const chunks = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => handleApi(req, res, Buffer.concat(chunks).toString('utf8')));
      return;
    }
    let file = u.pathname === '/' ? '/index.html' : u.pathname;
    file = path.normalize(file).replace(/^(\.\.[/\\])+/, '');
    const full = path.join(root, file);
    if (!full.startsWith(root) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
      send(res, 404, 'missing', 'text/plain');
      return;
    }
    const ext = path.extname(full);
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
    send(res, 200, fs.readFileSync(full), types[ext] || 'application/octet-stream');
  });
  return new Promise((resolve) => server.listen(port || 0, '127.0.0.1', () => resolve(server)));
}
export function addJob(j) { jobs.push(j); }
// ---- Crew clock (same rules as Code.gs clockApi_) ----
export const punches = [];
let CLOCK = true; export function setClock(v) { CLOCK = !!v; }
export function resetPunches() { punches.length = 0; }
const ck = (s) => String(s || '').trim().toLowerCase();
const cOpen = (who) => punches.find((p) => !p.out && ck(p.who) === ck(who)) || null;
function cDay(ms, back = 0) { const d = new Date(ms); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - back); return d.getTime(); }
function cHrs(who, a, b, now) { let ms = 0; punches.forEach((p) => { if (who && ck(p.who) !== ck(who)) return; const s = Math.max(+new Date(p.in), a), e = Math.min(p.out ? +new Date(p.out) : now, b); if (e > s) ms += e - s; }); return Math.round(ms / 36000) / 100; }
function cSum(who) { const now = Date.now(); return { who, open: cOpen(who), today: cHrs(who, cDay(now), now, now), week: cHrs(who, cDay(now, new Date(now).getDay()), now, now) }; }
function cAt(v) { const now = Date.now(); let t = v ? +new Date(v) : now; if (!isFinite(t)) t = now; if (t > now + 300000) t = now; if (t < now - 14 * 864e5) t = now - 14 * 864e5; return new Date(t).toISOString(); }
let LOCK = Promise.resolve();
function locked(fn) { const run = LOCK.then(() => new Promise((r) => setTimeout(r, Math.random() * 8)).then(fn)); LOCK = run.catch(() => {}); return run; }
export async function clockApi(d, role, empName) {
  if (!CLOCK) return { ok: false, err: 'Bad action' };
  if (!role) return { ok: false, err: 'PIN required' };
  const boss = role === 'Admin' || role === 'Manager';
  if (d.a === 'clockList') {
    if (!boss) return { ok: false, err: "Only Admin can see everyone's hours." };
    const f = d.from ? +new Date(d.from + 'T00:00') : 0, t = d.to ? +new Date(d.to + 'T23:59') + 60000 : Date.now() + 864e5;
    return { ok: true, punches: punches.filter((p) => { const s = +new Date(p.in), e = p.out ? +new Date(p.out) : Date.now(); return e >= f && s < t && (!d.who || ck(p.who) === ck(d.who)); }), now: punches.filter((p) => !p.out) };
  }
  if (d.a === 'clockFix') {
    if (!boss) return { ok: false, err: 'Only Admin can fix punches.' };
    const ni = d.in ? cAt(d.in) : '', no = d.out ? new Date(d.out).toISOString() : '';
    if (!d.del) { if (!ni) return { ok: false, err: 'Enter the clock-in time.' }; if (no && no <= ni) return { ok: false, err: 'Clock-out must be after clock-in.' }; if (no && new Date(no) - new Date(ni) > 864e5) return { ok: false, err: 'A shift cannot be longer than 24 hours.' }; }
    return locked(() => {
      if (d.id) { const i = punches.findIndex((x) => x.id === d.id); if (i < 0) return { ok: false, err: 'Punch not found' }; if (d.del) { punches.splice(i, 1); return { ok: true, deleted: d.id }; }
        const p = punches[i], o = cOpen(p.who); if (!no && o && o.id !== p.id) return { ok: false, err: p.who + ' already has an open punch.' };
        Object.assign(p, { in: ni, out: no || null, edited: { by: role, at: new Date().toISOString() } }); return { ok: true, punch: p }; }
      const w = String(d.who || '').trim().slice(0, 60); if (!w) return { ok: false, err: 'Pick the person.' }; if (!no && cOpen(w)) return { ok: false, err: w + ' is already clocked in.' };
      const p = { id: 'P-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), who: w, in: ni, out: no || null, by: role, src: 'fix', edited: { by: role, at: new Date().toISOString() } }; punches.push(p); return { ok: true, punch: p };
    });
  }
  const who = empName || String(d.who || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (!who) return { ok: false, err: 'Pick your name first.', needName: true };
  if (d.a === 'clockStatus') return { ok: true, ...cSum(who) };
  return locked(() => {
    const at = cAt(d.at), cid = String(d.cid || '').slice(0, 40); let res;
    const op = cOpen(who);
    if (cid && punches.some((x) => x.cid === cid || x.ocid === cid)) res = { ok: true, dup: true };
    else if (d.a === 'clockIn') { if (op) res = { ok: false, already: true, err: who + ' is already clocked in.' }; else { punches.push({ id: 'P-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), who, in: at, out: null, cid, by: role, src: d.offline ? 'offline' : 'app' }); res = { ok: true }; } }
    else { if (!op) res = { ok: false, notIn: true, err: who + ' is not clocked in.' }; else { op.out = at < op.in ? op.in : at; op.ocid = cid; res = { ok: true }; } }
    return { ...res, ...cSum(who) };
  });
}
