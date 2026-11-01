// Minimal in-memory Apps Script emulator: runs the real Code.gs in a Node vm so backend logic is tested
// without Google. No network: UrlFetchApp goes to a fake router; MailApp only records.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

export function makeGas(opts = {}) {
  const props = Object.assign({ PIN_OWNER: '4321', TEST_EMAIL_TO: 'austin@techsourcedsolutions.com' }, opts.props || {});
  const cache = {}; const mails = []; const fetches = []; const logs = [];
  let idn = 0; const nid = (p) => p + (++idn);
  const files = {}; const folders = {};
  const blob = (bytes, mime, name) => { const b = { bytes: Buffer.from(bytes || []), mime: mime || 'application/octet-stream', name: name || '' };
    return Object.assign(b, { getDataAsString: () => b.bytes.toString('utf8'), getBytes: () => Array.from(b.bytes).map((x) => (x > 127 ? x - 256 : x)),
      getAs: (m) => blob(b.bytes, m, b.name), setName: (n) => { b.name = n; return b; }, getName: () => b.name, copyBlob: () => blob(b.bytes, b.mime, b.name), getContentType: () => b.mime }); };
  const toBytes = (d) => (typeof d === 'string' ? Buffer.from(d, 'utf8') : Buffer.from((d || []).map((x) => x & 255)));
  const iter = (arr) => { let i = 0; return { hasNext: () => i < arr.length, next: () => arr[i++] }; };
  function mkFile(parent, name, content, mime) { const id = nid('F'); const f = { id, name, parent, trashed: false, blob: blob(toBytes(content), mime, name) };
    files[id] = f; return fileApi(f); }
  function fileApi(f) { return { getId: () => f.id, getName: () => f.name, getUrl: () => 'https://drive.mock/file/' + f.id, getBlob: () => f.blob.copyBlob(),
    setContent: (c) => { f.blob = blob(toBytes(c), f.blob.mime, f.name); }, setTrashed: (t) => { f.trashed = !!t; }, isTrashed: () => f.trashed,
    setSharing: () => {}, getDownloadUrl: () => '', getMimeType: () => f.blob.mime, getSize: () => f.blob.bytes.length, _f: f }; }
  function mkFolder(parent, name) { const id = nid('D'); folders[id] = { id, name, parent, trashed: false }; return folderApi(folders[id]); }
  function folderApi(d) { return { getId: () => d.id, getName: () => d.name, getUrl: () => 'https://drive.mock/folder/' + d.id,
    getFilesByName: (n) => iter(Object.values(files).filter((f) => f.parent === d.id && f.name === n && !f.trashed).map(fileApi)),
    getFiles: () => iter(Object.values(files).filter((f) => f.parent === d.id && !f.trashed).map(fileApi)),
    getFoldersByName: (n) => iter(Object.values(folders).filter((x) => x.parent === d.id && x.name === n && !x.trashed).map(folderApi)),
    getFolders: () => iter(Object.values(folders).filter((x) => x.parent === d.id && !x.trashed).map(folderApi)),
    createFile: (a, c, m) => (typeof a === 'string' ? mkFile(d.id, a, c, m) : (() => { const f = mkFile(d.id, a.name || 'blob', a.bytes, a.mime); return f; })()),
    createFolder: (n) => mkFolder(d.id, n), setTrashed: (t) => { d.trashed = !!t; }, setSharing: () => {}, addEditor: () => {} }; }
  const tzParts = (date, tz) => { const o = {}; new Intl.DateTimeFormat('en-US', { timeZone: tz || 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hourCycle: 'h23', weekday: 'short', timeZoneName: 'short' })
    .formatToParts(date).forEach((p) => { o[p.type] = p.value; }); return o; };
  const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function formatDate(date, tz, fmt) { const p = tzParts(new Date(date), tz), H = +p.hour, M = +p.month;
    const map = { yyyy: p.year, MMMM: MON[M - 1], MMM: MON[M - 1].slice(0, 3), MM: String(M).padStart(2, '0'), dd: String(p.day).padStart(2, '0'), d: String(+p.day), EEE: p.weekday,
      HH: String(H).padStart(2, '0'), H: String(H), hh: String((H + 11) % 12 + 1).padStart(2, '0'), h: String((H + 11) % 12 + 1), mm: p.minute, ss: p.second, a: H < 12 ? 'AM' : 'PM', z: p.timeZoneName, u: String(({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 })[p.weekday]) };
    return fmt.replace(/yyyy|MMMM|MMM|MM|dd|d|EEE|HH|H|hh|h|mm|ss|a|z|u/g, (t) => map[t]); }
  // 'yyyy-MM-dd[ HH:mm[:ss]]' read as wall time in tz (like Apps Script Utilities.parseDate)
  function parseDate(str, tz) { const m = String(str).match(/^(\d{4})-(\d\d)-(\d\d)(?:[ T](\d\d):(\d\d)(?::(\d\d))?)?$/); if (!m) return new Date(str);
    const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    const off = (ms) => { const p = tzParts(new Date(ms), tz); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - ms; };
    let t = guess - off(guess); t = guess - off(t); return new Date(t); }
  const routes = opts.fetch || (() => ({ code: 200, body: '{}' }));
  const G = {
    console, JSON, Math, Date, Object, Array, String, Number, RegExp, Error, isFinite, isNaN, parseInt, parseFloat, encodeURIComponent, decodeURIComponent, escape, unescape,
    Logger: { log: (...a) => logs.push(a.join(' ')) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (k in props ? props[k] : null), setProperty: (k, v) => { props[k] = String(v); }, deleteProperty: (k) => { delete props[k]; }, getProperties: () => Object.assign({}, props), setProperties: (o) => Object.assign(props, o) }) },
    CacheService: { getScriptCache: () => ({ get: (k) => (k in cache ? cache[k] : null), put: (k, v) => { cache[k] = String(v); }, remove: (k) => { delete cache[k]; } }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, waitLock: () => {}, releaseLock: () => {}, hasLock: () => true }), getUserLock: () => ({ tryLock: () => true, waitLock: () => {}, releaseLock: () => {} }) },
    DriveApp: { createFolder: (n) => mkFolder(null, n), getFolderById: (id) => { if (!folders[id]) throw new Error('no folder ' + id); return folderApi(folders[id]); },
      getFileById: (id) => { if (!files[id]) throw new Error('no file ' + id); return fileApi(files[id]); }, getFoldersByName: (n) => iter(Object.values(folders).filter((x) => x.name === n && !x.parent).map(folderApi)),
      Access: { ANYONE_WITH_LINK: 'A' }, Permission: { VIEW: 'V' } },
    Utilities: { formatDate, getUuid: () => crypto.randomUUID(), sleep: () => {},
      computeHmacSha256Signature: (v, k) => Array.from(crypto.createHmac('sha256', String(k)).update(String(v)).digest()).map((x) => (x > 127 ? x - 256 : x)),
      base64Encode: (d) => toBytes(d).toString('base64'), base64Decode: (s) => Array.from(Buffer.from(String(s), 'base64')).map((x) => (x > 127 ? x - 256 : x)),
      base64EncodeWebSafe: (d) => toBytes(d).toString('base64url'), newBlob: (d, m, n) => blob(toBytes(d), m, n),
      parseDate: (s, tz) => parseDate(s, tz), Charset: { UTF_8: 'UTF-8' } },
    UrlFetchApp: { fetch: (url, o) => { fetches.push({ url, o: o || {} }); const r = routes(url, o || {}) || { code: 404, body: '' }; return { getResponseCode: () => r.code, getContentText: () => (typeof r.body === 'string' ? r.body : JSON.stringify(r.body)) }; } },
    MailApp: { sendEmail: (m) => { mails.push(m); }, getRemainingDailyQuota: () => 100 },
    GmailApp: { search: () => [], getUserLabelByName: () => null, createLabel: () => ({}) },
    ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/MOCK/exec' }), getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ everyMinutes: () => ({ create: () => {} }), everyDays: () => ({ atHour: () => ({ create: () => {} }) }) }) }), deleteTrigger: () => {} },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (s) => ({ s, setMimeType() { return this; }, getContent() { return s; } }) },
    HtmlService: { createHtmlOutput: (s) => ({ s, setTitle() { return this; }, addMetaTag() { return this; }, setXFrameOptionsMode() { return this; }, getContent() { return s; } }), XFrameOptionsMode: { ALLOWALL: 1 } },
  };
  G.globalThis = G;
  const ctx = vm.createContext(G);
  vm.runInContext(fs.readFileSync(opts.code || path.join(root, 'Code.gs'), 'utf8'), ctx, { filename: 'Code.gs' });
  const post = (d) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(d) } }).getContent());
  const fileByName = (n) => Object.values(files).find((f) => f.name === n && !f.trashed);
  const readJson = (n) => { const f = fileByName(n); return f ? JSON.parse(f.blob.bytes.toString('utf8') || '[]') : null; };
  const writeJson = (n, v) => { let f = fileByName(n); if (!f) { ctx.root_(); const rid = props.ROOT; mkFile(rid, n, JSON.stringify(v), 'application/json'); } else f.blob = blob(toBytes(JSON.stringify(v)), 'application/json', n); };
  return { ctx, post, props, mails, fetches, logs, files, folders, readJson, writeJson, fileByName };
}
