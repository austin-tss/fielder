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
let employees = [{ id: 'E1', name: 'Ada Admin', email: 'ada@example.com', role: 'Admin', pin: '5511' }, { id: 'E2', name: 'Sam Saw', email: 'sam@example.com', role: 'Crew', pin: '5522' }];
export const outbox = [];
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
  return { form, quoteBody: settings.quoteBody || '', quoteSubject: settings.quoteSubject || '', quoteSign: settings.quoteSign || '', theme: settings.theme === 'dark' ? 'dark' : 'classic' };
}

function handleApi(req, res, body) {
  if (req.method === 'GET') {
    send(res, 200, JSON.stringify({ ok: true, root: 'https://drive.google.com/drive/folders/MOCK-ROOT', jobs, blocks: [], settings: publicSettings() }));
    return;
  }
  const d = JSON.parse(body || '{}');
  hits.push({ a: d.a || '', to: d.email || '', send: !!d.send, keys: Object.keys(d) });
  if (d.a === 'login') {
    const e = employees.find((u) => u.pin === String(d.pin || ''));
    const r = e ? e.role : ROLEPINS[String(d.pin || '')];
    return send(res, 200, JSON.stringify(r ? { ok: true, role: r, name: e ? e.name : '' } : { ok: false, err: 'Wrong PIN' }));
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
    jobs.unshift(job);
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
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };
    send(res, 200, fs.readFileSync(full), types[ext] || 'application/octet-stream');
  });
  return new Promise((resolve) => server.listen(port || 0, '127.0.0.1', () => resolve(server)));
}
