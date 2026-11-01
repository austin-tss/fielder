// Timber streaming for the Fielder Worker (POST /api/timber -> server-sent events).
// Gemini streamGenerateContent with the GEMINI_API_KEY Worker secret. The data context and every function call go through
// the Apps Script backend with the caller's own PIN, so the same permission checks apply. Inlined into the Worker by p2tools/build4.mjs.
export function makeTimber(o) {
  const EXEC = o.exec, F = o.fetch || ((u, i) => fetch(u, i)), CTX = new Map(), MODEL = 'gemini-3.5-flash-lite', TTL = 120000;
  const gas = async (body) => { const r = await F(EXEC, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: JSON.stringify(body), redirect: 'follow' }); return r.json(); };
  async function ctxFor(auth, fresh) {
    const k = JSON.stringify(auth), c = CTX.get(k); if (c && !fresh && Date.now() - c.t < TTL) return c.v;
    let ck = null, cache = null;
    try { cache = typeof caches !== 'undefined' ? caches.default : null; if (cache) { const h = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('tbctx|' + k)))].map((x) => x.toString(16).padStart(2, '0')).join(''); ck = new Request('https://ctx.fielder.internal/' + h); } } catch (e) { cache = null; }
    if (!fresh && cache && ck) { const hit = await cache.match(ck); if (hit) { const v = await hit.json(); CTX.set(k, { t: Date.now(), v }); return v; } }
    const v = await gas(Object.assign({ a: 'timber', ctx: 1 }, auth));
    if (v && v.ok) { CTX.set(k, { t: Date.now(), v }); if (cache && ck) await cache.put(ck, new Response(JSON.stringify(v), { headers: { 'content-type': 'application/json', 'cache-control': 'max-age=120' } })); }
    return v;
  }
  return async function timberStream(req, env, ctx) {
    const d = await req.json().catch(() => ({})); const auth = {}; if (d.pin != null) auth.pin = String(d.pin);
    const bg = (p) => { try { ctx && ctx.waitUntil ? ctx.waitUntil(p) : p; } catch (e) {} };
    if (d.warm) { if (!env.GEMINI_API_KEY) return Response.json({ ok: false }); const v = await ctxFor(auth); return Response.json({ ok: !!(v && v.ok) }); }
    const { readable, writable } = new TransformStream(), w = writable.getWriter(), enc = new TextEncoder();
    const send = (x) => w.write(enc.encode('data: ' + JSON.stringify(x) + '\n\n'));
    bg((async () => {
      try {
        if (!env.GEMINI_API_KEY) { await send({ err: 'fallback' }); return; }
        const c = await ctxFor(auth); if (!c || !c.ok) { await send({ err: 'fallback' }); return; }
        const q = String(d.q || '').slice(0, 1000), hist = (Array.isArray(d.history) ? d.history : []).slice(-12).map((h) => ({ role: h.who == 'me' ? 'user' : 'model', parts: [{ text: String(h.text || '').slice(0, 1500) }] }));
        const contents = hist.concat([{ role: 'user', parts: [{ text: q }] }]); let open = null, offer = null, draft = null, used = [], acted = false; const gc = { temperature: 0.2, thinkingConfig: { thinkingLevel: 'minimal' } };
        for (let i = 0; i < 6; i++) {
          const r = await F(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY }, body: JSON.stringify({ systemInstruction: { parts: [{ text: c.sys }] }, contents, tools: [{ functionDeclarations: c.decl }], generationConfig: gc }) });
          if (r.status === 400 && gc.thinkingConfig) { delete gc.thinkingConfig; i--; continue; }
          if (!r.ok || !r.body) { await send({ err: 'fallback' }); return; }
          const rd = r.body.pipeThrough(new TextDecoderStream()).getReader(); let buf = ''; const parts = [];
          for (;;) { const { value, done } = await rd.read(); if (done) break; buf += value; let n;
            while ((n = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, n).trim(); buf = buf.slice(n + 1); if (!line.startsWith('data:')) continue; let j; try { j = JSON.parse(line.slice(5)); } catch (e) { continue; }
              for (const p of ((((j.candidates || [])[0] || {}).content || {}).parts || [])) { parts.push(p); if (p.text && !p.thought) await send({ t: p.text.replace(/\bAI\b/g, '').replace(/[*#_`]/g, '') }); } } }
          const calls = parts.filter((p) => p.functionCall);
          if (!calls.length) { if (acted) bg(ctxFor(auth, true)); await send({ done: true, used, acted, open, offer, draft }); return; }
          await send({ working: calls.map((p) => p.functionCall.name) });
          contents.push({ role: 'model', parts });
          const res = await Promise.all(calls.map(async (p) => { const n = p.functionCall.name; used.push(n);
            const rr = (await gas(Object.assign({ a: 'timber', tool: n, args: p.functionCall.args || {} }, auth))) || {};
            if (rr.open) open = rr.open; if (rr.offer) offer = rr.offer; if (rr.draft) draft = rr.draft; if ((c.acts || []).includes(n)) acted = true;
            return { functionResponse: { name: n, response: { result: rr.ok ? rr.result : { error: rr.err || 'failed' } } } }; }));
          contents.push({ role: 'user', parts: res });
        }
        await send({ t: 'Timber got stuck on that one. Try asking it a simpler way.' }); await send({ done: true, used, acted, open, offer, draft });
      } catch (e) { try { await send({ err: 'fallback' }); } catch (x) {} } finally { try { await w.close(); } catch (e) {} }
    })());
    return new Response(readable, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-store' } });
  };
}
