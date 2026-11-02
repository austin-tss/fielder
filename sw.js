// Fielder Field Desk service worker: caches the app shell only.
// Never touches API calls (Apps Script /exec, ?a=, pin=), other sites, or anything that is not a GET.
// Bump VERSION on each release; old caches are deleted when the new worker activates.
const VERSION = 'fd-shell-2026-11-01-2026-11-02f';
const SHELL = ['./', 'index.html', 'form.js', 'v5.js', 'csv.js', 'flags.js', 'voice.js', 'clock.js', 'vhome.js', 'gps.js', 'quotes.js', 'owner.js', 'feat.js', 'dash.js', 'labor.js', 'timber.js', 'batch3.js', 'perf.js', 'crew.js', 'simple.js', 'desk.js', 'supplies.js', 'receipts.js', 'nav2.js', 'need.js', 'mic.js', 'book.html', 'pay.html', 'sign.html', 'portal.html', 'logo.png', 'logo.svg', 'mark.svg', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
function isShell(url) {
  if (url.origin !== self.location.origin) return false;
  if (/\/exec\b/.test(url.pathname) || url.searchParams.has('a') || url.searchParams.has('pin') || url.searchParams.has('api')) return false;
  const base = new URL('./', self.location).pathname;
  const rel = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : null;
  if (rel === null) return false;
  return rel === '' || SHELL.includes(rel) || rel.startsWith('icons/');
}
// Page: network first (so a new release's ?v= script URLs load right away); cached page only if offline or slower than 3 s.
// Assets: exact URL (including ?v=) from cache, else network; an old copy is used only when offline. (Miller c373cfa)
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const base = new URL('./', self.location).pathname;
  // Only app-shell navigations use the cached index; other pages (quote.html) always go to the network.
  const nav = req.mode === 'navigate' && url.origin === self.location.origin && (url.pathname === base || url.pathname === base + 'index.html');
  if (!nav && !isShell(url)) return;
  const key = nav ? new URL('index.html', self.location).href : req;
  e.respondWith(caches.open(VERSION).then(async (c) => {
    const net = fetch(req).then((r) => { if (r && r.ok && r.type === 'basic') c.put(key, r.clone()); return r; }).catch(() => null);
    if (nav) {
      const r = await Promise.race([net, new Promise((ok) => setTimeout(() => ok(null), 3000))]);
      return r || (await c.match(key, { ignoreSearch: true })) || (await net) || new Response('Offline', { status: 503 });
    }
    const exact = await c.match(req);
    if (exact) { e.waitUntil(net); return exact; }
    return (await net) || (await c.match(req, { ignoreSearch: true })) || new Response('Offline', { status: 503 });
  }));
});
