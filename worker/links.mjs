// Fielder Worker link routes: /a (signed supply Approve/Deny), /x (customer quote answer pages: choice, time window or note, thanks),
// and /api/gas (JSON proxy for the customer pages).
// Apps Script /exec links fail on phones signed into Google, so the Worker calls /exec server-side (fmt=json) and shows a Fielder page.
// Approval links stay signed and single-use (checked in Apps Script). Inlined into the Worker by p2tools/build4.mjs.
export function makeLinks(o) {
  const EXEC = o.exec, F = o.fetch || ((u, i) => fetch(u, i));
  const he = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const frame = (title, col, inner) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${he(title)} · Fielder Tree</title><style>body{margin:0;background:#f4f6f1;font-family:-apple-system,system-ui,Arial,sans-serif;color:#112337}header{background:#112337;color:#fff;padding:14px 18px;display:flex;align-items:center;gap:12px;font-weight:800;font-size:19px}header img{width:44px;height:44px;border-radius:10px;background:#fff}main{max-width:560px;margin:28px auto;padding:0 18px}.c{background:#fff;border-radius:16px;padding:26px 22px;box-shadow:0 2px 10px rgba(0,0,0,.08);border-top:8px solid ${col}}h1{margin:0 0 10px;font-size:28px;color:${col}}h2{margin:0 0 10px;font-size:24px}p{font-size:18px;line-height:1.45;margin:0 0 18px}a.b{display:block;text-align:center;background:#78a22f;color:#fff;text-decoration:none;font-weight:800;font-size:20px;padding:18px;border-radius:12px}textarea,input[type=text]{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:12px;border:2px solid #d5dccb;border-radius:10px}input[type=radio]{position:absolute;opacity:0}input[type=radio]:checked+label.s{background:#78a22f;color:#fff;border-color:#78a22f}label.s{display:inline-block;margin:4px 6px 4px 0;padding:10px 14px;border:2px solid #d5dccb;border-radius:22px;font-weight:700}button.go,.go{display:block;width:100%;margin-top:18px;background:#78a22f;color:#fff;border:0;border-radius:12px;font:inherit;font-weight:800;font-size:20px;padding:18px}</style></head><body><header><img src="/logo.png" alt="">Fielder Field Desk</header><main><div class="c">${inner}</div></main></body></html>`;
  const json = (t, status) => new Response(t, { status: status || 200, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
  // /api/gas: JSON proxy (GET and POST) for the customer pages (quote, sign, portal/project, pay, book) so they never call script.google.com
  async function gasProxy(req) { const u = new URL(req.url), init = { redirect: 'follow' };
    if (req.method === 'POST') { init.method = 'POST'; init.headers = { 'content-type': 'text/plain' }; init.body = await req.text(); }
    let t = null; try { const r = await F(EXEC + (u.search || ''), init); t = await r.text(); } catch (e) { t = null; }
    return json(t == null ? JSON.stringify({ ok: false, err: 'Please try again in a minute.' }) : t); }
  const page = (html, status) => new Response(html, { status: status || 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' } });
  const call = async (q) => { q.set('fmt', 'json'); const r = await F(EXEC + '?' + q, { redirect: 'follow' }); return r.json(); };
  async function links(req) {
    const u = new URL(req.url);
    if (u.pathname === '/api/gas') return gasProxy(req);
    const a = u.searchParams.get('a') || (u.pathname === '/x' ? 'respond' : 'ok');
    if (a === 'respond') { // customer quote answer: multi-step form; the form posts back to /a
      const q = new URLSearchParams(); for (const [k, v] of u.searchParams) if (k !== 'fmt') q.set(k, v);
      let r; try { r = await call(q); } catch (e) { r = null; }
      if (!r || !r.ok || !r.page) return page(frame('Something went wrong', '#112337', '<h1>Something went wrong</h1><p>Nothing was saved. Please try again in a minute or call us.</p>'), 502);
      const body = String(r.page).replace(/action="[^"]*"/g, 'action="/x"');
      return page(frame('Your estimate', '#78a22f', body));
    }
    if (a !== 'ok') return page(frame('Link not valid', '#112337', '<h1>Link not valid</h1><p>Nothing changed.</p>'), 404);
    const q = new URLSearchParams({ a: 'ok' }); for (const k of ['k', 'id', 'v', 's']) q.set(k, u.searchParams.get(k) || '');
    let r; try { r = await call(q); } catch (e) { r = { ok: false, title: 'Something went wrong', msg: 'Nothing changed. Try the button again in a minute, or open the Field Desk.' }; }
    const what = { sup: 'supply request' }[u.searchParams.get('k')] || 'request';
    const good = !!r.ok, col = good ? (r.yes ? '#78a22f' : '#b42318') : '#112337', head = good ? (r.yes ? 'Approved' : 'Denied') + ': ' + r.name : (r.title || 'Link not valid');
    const msg = good ? (r.yes ? `The ${what} is now <b>${he(r.status)}</b>. The team sees it in the Field Desk.` : `The ${what} was denied. The team sees it in the Field Desk.`) : he(r.msg || '');
    return page(frame(head, col, `<h1>${good ? (r.yes ? '✔ ' : '✖ ') : ''}${he(head)}</h1><p>${msg}</p><a class="b" href="/">Open Field Desk</a>`));
  }
  return links;
}
