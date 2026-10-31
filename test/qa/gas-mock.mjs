// In-memory/shared mock of Apps Script services for LIVE fielder Code.gs. No network.
// shared mode: {dir, sab, scale, driveMs, folderMs} -> JSON files + props on disk, cross-thread lock in a SharedArrayBuffer,
// Drive read/write delays via Atomics.wait so worker threads really contend for the lock.
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export function loadBackend(opts = {}) {
  const S = opts.shared || null; const scale = S ? S.scale : 0;
  const nap = (ms) => { if (S && ms > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms * scale); };
  const lockArr = S ? new Int32Array(S.sab) : null;
  const memProps = new Map(Object.entries(opts.props || {}));
  const pf = (k) => path.join(S.dir, 'prop_' + encodeURIComponent(k));
  const props = S ? { get: (k) => fs.existsSync(pf(k)) ? fs.readFileSync(pf(k), 'utf8') : (memProps.has(k) ? memProps.get(k) : null), set: (k, v) => fs.writeFileSync(pf(k), String(v)) }
                  : { get: (k) => memProps.has(k) ? memProps.get(k) : null, set: (k, v) => memProps.set(k, String(v)) };
  const mail = [], fetches = [], logs = []; const st = { held: 0, mailWhileLocked: 0, waits: [], lockCalls: 0, busy: !!opts.lockBusy };
  let seq = 0; const wid = opts.wid || 'w0'; const nid = (p) => p + wid + '_' + (++seq);
  const files = new Map(), folders = new Map(), cache = new Map();
  class Blob { constructor(d, t, n) { this.data = Buffer.isBuffer(d) ? d : Buffer.from(String(d ?? '')); this.type = t || 'text/plain'; this.name = n || ''; }
    getDataAsString() { return this.data.toString('utf8'); } getBytes() { return [...this.data]; } getContentType() { return this.type; }
    getAs(t) { return new Blob(this.data, t, this.name); } setName(n) { this.name = n; return this; } getName() { return this.name; } }
  const iter = (a) => { let i = 0; return { hasNext: () => i < a.length, next: () => a[i++] }; };
  const isData = (parent, name) => S && parent && folders.get(parent)?.isRoot && /\.json$/.test(name);
  function mkFile(parent, name, content, type) {
    const id = nid('file'); const blob = content instanceof Blob ? content : new Blob(content, type, name); const nm = blob.name || name;
    const disk = isData(parent, nm) ? path.join(S.dir, nm) : null; if (disk && !fs.existsSync(disk)) fs.writeFileSync(disk, blob.getDataAsString());
    if (!disk) nap(S ? S.folderMs : 0);
    const f = { id, name: nm, parent, blob, sharing: null, getId: () => id, getName: () => f.name, getUrl: () => 'https://drive.mock/file/' + id,
      getBlob: () => { if (disk) { nap(S.driveMs); return new Blob(fs.readFileSync(disk), 'application/json', nm); } return new Blob(f.blob.data, f.blob.type, f.name); },
      getParents: () => iter(folders.has(parent) ? [folders.get(parent)] : []),
      setContent: (s) => { if (disk) { nap(S.driveMs); fs.writeFileSync(disk + '.tmp' + wid, s); fs.renameSync(disk + '.tmp' + wid, disk); } else f.blob = new Blob(s, f.blob.type, f.name); return f; },
      setSharing: (a, p) => { f.sharing = [a, p]; return f; }, setTrashed: (t) => { f.trashed = !!t; return f; }, moveTo: (F) => { f.parent = F.getId(); return f; } };
    files.set(id, f); return f;
  }
  function mkFolder(parent, name, isRoot) {
    const id = nid('folder'); nap(S && !isRoot ? S.folderMs : 0);
    const F = { id, name, parent, isRoot: !!isRoot, trashed: false, getId: () => id, getName: () => name, getUrl: () => 'https://drive.mock/folder/' + id,
      getParents: () => iter(folders.has(parent) ? [folders.get(parent)] : []),
      getFilesByName: (n) => { const l = [...files.values()].filter((x) => x.parent === id && x.name === n); if (!l.length && F.isRoot && S && fs.existsSync(path.join(S.dir, n))) l.push(mkFile(id, n, '[]', 'application/json')); return iter(l); },
      getFoldersByName: (n) => iter([...folders.values()].filter((x) => x.parent === id && x.name === n && !x.trashed)),
      getFiles: () => iter([...files.values()].filter((x) => x.parent === id)),
      createFile: (a, b, c) => mkFile(id, typeof a === 'string' ? a : a.name, a instanceof Blob ? a : b, c),
      createFolder: (n) => mkFolder(id, n), setTrashed: (t) => { F.trashed = !!t; return F; }, isTrashed: () => F.trashed };
    folders.set(id, F); return F;
  }
  const drive = { Access: { ANYONE_WITH_LINK: 'A' }, Permission: { VIEW: 'V' },
    getFolderById: (id) => { const f = folders.get(id); if (!f) throw new Error('No folder ' + id); return f; },
    getFileById: (id) => { const f = files.get(id); if (!f) throw new Error('No file ' + id); return f; },
    getFoldersByName: (n) => iter([...folders.values()].filter((x) => x.parent === null && x.name === n)),
    createFolder: (n) => mkFolder(null, n, true) };
  // Two independent locks: script lock (slot 0) and user lock (slot 1; shared only if the SharedArrayBuffer has room).
  const userArr = S && S.sab.byteLength >= 8 ? new Int32Array(S.sab) : new Int32Array(new SharedArrayBuffer(8));
  const mkLock = (arr, slot) => { let mine = 0; const tl = (ms) => { st.lockCalls++; st.waits.push(ms); if (st.busy) return false; if (!S) { mine++; return true; }
      const end = Date.now() + ms * scale; for (;;) { if (Atomics.compareExchange(arr, slot, 0, 1) === 0) { mine++; return true; } const left = end - Date.now(); if (left <= 0) return false; Atomics.wait(arr, slot, 1, Math.min(left, 50)); } };
    return { tryLock: tl, waitLock: (ms) => { if (!tl(ms)) throw new Error('Lock timeout'); }, releaseLock: () => { if (mine > 0) { mine--; if (S) { Atomics.store(arr, slot, 0); Atomics.notify(arr, slot, 1); } } } }; };
  const userLock = mkLock(userArr, 1);
  const cf = (k) => path.join(S.dir, 'cache_' + encodeURIComponent(k));
  const sharedCache = S ? { get: (k) => { nap(30); try { return fs.readFileSync(cf(k), 'utf8'); } catch (e) { return null; } }, put: (k, v) => { nap(30); fs.writeFileSync(cf(k) + '.t' + wid, String(v)); fs.renameSync(cf(k) + '.t' + wid, cf(k)); }, remove: (k) => { try { fs.unlinkSync(cf(k)); } catch (e) {} } } : null;
  const tryLock = (ms) => { st.lockCalls++; st.waits.push(ms); if (st.busy) return false;
    if (!S) { st.held++; return true; }
    const end = Date.now() + ms * scale;
    for (;;) { if (Atomics.compareExchange(lockArr, 0, 0, 1) === 0) { st.held++; return true; } const left = end - Date.now(); if (left <= 0) return false; Atomics.wait(lockArr, 0, 1, Math.min(left, 50)); } };
  const release = () => { if (st.held > 0) { st.held--; if (S) { Atomics.store(lockArr, 0, 0); Atomics.notify(lockArr, 0, 1); } } };
  const out = (s) => ({ content: s, mime: null, setMimeType(m) { this.mime = m; return this; }, setTitle() { return this; }, addMetaTag() { return this; }, setXFrameOptionsMode() { return this; }, getContent() { return this.content; } });
  const sandbox = { console, Date, JSON, Math, Number, String, Object, Array, RegExp, Error, encodeURIComponent, decodeURIComponent, isNaN, parseFloat, parseInt, Buffer,
    PropertiesService: { getScriptProperties: () => ({ getProperty: props.get, setProperty: (k, v) => { props.set(k, v); }, deleteProperty: () => {}, getProperties: () => ({}) }) },
    CacheService: { getScriptCache: () => sharedCache || ({ get: (k) => cache.get(k) ?? null, put: (k, v) => cache.set(k, String(v)), remove: (k) => cache.delete(k) }) },
    DriveApp: drive,
    MailApp: { sendEmail: (m) => { if (st.held) st.mailWhileLocked++; mail.push(m); }, getRemainingDailyQuota: () => 100 },
    UrlFetchApp: { fetch: (url, o) => { fetches.push({ url, o }); return { getResponseCode: () => 201, getContentText: () => '{}' }; } },
    GmailApp: { getUserLabelByName: () => ({}), createLabel: () => ({}), search: () => [] },
    Utilities: { newBlob: (d, t, n) => new Blob(Buffer.isBuffer(d) ? d : Array.isArray(d) ? Buffer.from(d) : d, t, n), base64Decode: (s) => Buffer.from(s, 'base64'),
      base64Encode: (b) => Buffer.from(typeof b === 'string' ? b : b).toString('base64'), getUuid: () => crypto.randomUUID(), sleep: (ms) => nap(ms),
      formatDate: (d, tz, f) => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' }).formatToParts(d).map((x) => [x.type, x.value]));
        if (f === 'u') return String({ Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[p.weekday]);
        if (f === 'yyyy-MM-dd') return p.year + '-' + p.month + '-' + p.day; if (f === 'yyyy-MM-dd HH:mm') return p.year + '-' + p.month + '-' + p.day + ' ' + p.hour + ':' + p.minute;
        return d.toLocaleDateString('en-US', { timeZone: tz, month: 'long', day: 'numeric', year: 'numeric' }); },
      parseDate: (s, tz, f) => { const m = String(s).match(/(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?/); const g = Date.UTC(+m[1], m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
        const off = (t) => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(t)).map((x) => [x.type, x.value])); return Date.UTC(+p.year, p.month - 1, +p.day, +p.hour, +p.minute) - t; };
        let t = g - off(g); t = g - off(t); return new Date(t); } },
    ContentService: { createTextOutput: out, MimeType: { JSON: 'json' } }, HtmlService: { createHtmlOutput: out, XFrameOptionsMode: { ALLOWALL: 1 } },
    LockService: { getScriptLock: () => ({ tryLock, waitLock: (ms) => { if (!tryLock(ms)) throw new Error('Lock timeout'); }, releaseLock: release }), getUserLock: () => userLock },
    ScriptApp: { getService: () => ({ getUrl: () => 'https://script.mock/exec' }), getProjectTriggers: () => [], newTrigger: () => ({ timeBased: () => ({ everyHours: () => ({ create() {} }), everyDays: () => ({ atHour: () => ({ create() {} }) }) }) }), deleteTrigger() {} },
    Logger: { log: (s) => logs.push(String(s)) } };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8'), sandbox, { filename: 'Code.gs' });
  const post = (body) => JSON.parse(sandbox.doPost({ postData: { contents: JSON.stringify('pin' in body ? body : { pin: '1234', ...body }) } }).getContent());
  const get = (p = {}) => { if (!('pin' in p) && !p.a) p = { pin: '1234', ...p }; const r = sandbox.doGet({ parameter: p }); return r.mime === 'json' ? JSON.parse(r.getContent()) : r.getContent(); };
  return { g: sandbox, st, mail, fetches, logs, files, folders, post, get, props };
}
