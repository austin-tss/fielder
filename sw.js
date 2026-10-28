// Fielder Field Desk service worker: caches the app shell only.
// Never touches API calls (Apps Script /exec, ?a=, pin=), other sites, or anything that is not a GET.
// Bump VERSION on each release; old caches are deleted when the new worker activates.
const VERSION = 'fd-shell-2026-10-28c';
const SHELL = ['./', 'index.html', 'form.js', 'v5.js', 'logo.png', 'manifest.webmanifest',
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
// Stale-while-revalidate: answer from cache instantly, fetch a fresh copy for next open.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const nav = req.mode === 'navigate' && url.origin === self.location.origin && !/\/exec\b/.test(url.pathname);
  if (!nav && !isShell(url)) return;
  const key = nav ? new URL('index.html', self.location).href : req;
  e.respondWith(caches.open(VERSION).then(async (c) => {
    const hit = await c.match(key, { ignoreSearch: true });
    const fresh = fetch(req).then((r) => { if (r && r.ok && r.type === 'basic') c.put(key, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(fresh); return hit; }
    return (await fresh) || new Response('Offline', { status: 503 });
  }));
});
