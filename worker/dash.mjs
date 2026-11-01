// Owner home summary for the Fielder Worker: POST /api/dash {pin}. A per-PIN cached copy (Cache API, hashed key) is served instantly;
// once older than 2 minutes it is refreshed in the background (kept stale up to a day). Apps Script still checks the PIN (Owner only).
// Inlined into the Worker by p2tools/build4.mjs.
export function makeDash(o) {
  const EXEC = o.exec, F = o.fetch || ((u, i) => fetch(u, i)), FRESH = 120000;
  const mem = new Map(), cacheApi = () => o.cache || (typeof caches !== 'undefined' ? caches.default : { match: async (r) => mem.get(r.url) && mem.get(r.url).clone(), put: async (r, v) => { mem.set(r.url, v); } });
  const gas = async (body) => { const r = await F(EXEC, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: JSON.stringify(body), redirect: 'follow' }); return r.json(); };
  return async function ownerDash(req, ctx) {
    const d = await req.json().catch(() => ({})), pin = String(d.pin || ''); if (!pin) return Response.json({ ok: false, err: 'PIN required' });
    const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('dash|' + pin)))].map((x) => x.toString(16).padStart(2, '0')).join('');
    const ck = new Request('https://ctx.fielder.internal/dash/' + h), cache = cacheApi();
    const pull = async () => { const v = await gas({ a: 'dash', pin }); if (v && v.ok) await cache.put(ck, new Response(JSON.stringify(v), { headers: { 'content-type': 'application/json', 'cache-control': 'max-age=86400', 'x-at': String(Date.now()) } })); return v; };
    const hit = await cache.match(ck);
    if (hit) { const age = Date.now() - (+hit.headers.get('x-at') || 0); if (age > FRESH) { const p = pull().catch(() => null); try { ctx && ctx.waitUntil ? ctx.waitUntil(p) : 0; } catch (e) {} }
      const v = await hit.json(); v.cachedAgeS = Math.round(age / 1000); return Response.json(v, { headers: { 'cache-control': 'no-store' } }); }
    return Response.json(await pull(), { headers: { 'cache-control': 'no-store' } });
  };
}
