// Batch 8 (Miller 26a1c14 + 6f683b9 + 92221aa): Ask Timber drop-down bar, notifications, persisted chat, one Talk button,
// text box under Type/Talk, no Back bars (logo = home, corner mic kept), Need something? tab, narrowed voice intercept, single TTS fallback.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { start, addJob, featOn, featOutbox, mockEmployees, mockJobs, setGemStream, STREAMS, GEMCALLS } from './mock-server.mjs';
let GEM = [];
const F = featOn({ props: { GEMINI_API_KEY: 'test-key-not-real' }, fetch: (url, o) => {
  if (!/generativelanguage/.test(url)) return { code: 599, body: 'offline' };
  const b = JSON.parse(o.payload); if (b.generationConfig && b.generationConfig.responseSchema && b.generationConfig.responseSchema.properties && b.generationConfig.responseSchema.properties.store) return { code: 200, body: { candidates: [{ content: { parts: [{ text: JSON.stringify({ store: 'Home Depot', date: '2026-10-28', total: 67.12, tax: 4.2, items: [{ name: 'Bar oil', qty: 2, price: 31.46 }] }) }] } }] } }; if (b.generationConfig && b.generationConfig.responseModalities) return { code: 200, body: { candidates: [{ content: { parts: [{ inlineData: { mimeType: 'audio/wav', data: 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=' } }] } }] } };
  const r = GEM.shift(); return { code: 200, body: r ? r(b) : { candidates: [{ content: { parts: [{ text: 'OK.' }] } }] } }; } });
mockEmployees.push({ id: 'E9', name: 'Carlos Ruiz', role: 'Crew', pin: '7711' });
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port, api = base + '/exec';
const DAY = 864e5, iso = (ms) => new Date(ms).toISOString();
addJob({ id: 'D5-1', est: 'FT-EST-2026-0601', jobNo: 'FT-JOB-2026-0601', wonAt: iso(Date.now()), name: 'Dana Desk', address: '1 Wide St', email: 'd@example.com', status: 'approved', items: [{ title: 'Removal', price: 900 }], created: iso(Date.now() - DAY), photos: [], crew: [] });
addJob({ id: 'D5-2', est: 'FT-EST-2026-0602', name: 'Quinn Quote', address: '2 Wide St', email: 'q@example.com', status: 'sent', items: [{ title: 'Trim', price: 300 }], created: iso(Date.now() - DAY), photos: [], crew: [] });
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); }; const w = (ms) => new Promise((r) => setTimeout(r, ms));
const say = (t) => () => ({ candidates: [{ content: { parts: [{ text: t }] } }] });
const call = (name, args) => () => ({ candidates: [{ content: { parts: [{ functionCall: { name, args } }] } }] });
async function open(pin, width, opts = {}) {
  const p = await browser.newPage(); await p.setViewport({ width, height: width >= 768 ? 900 : 844 });
  await p.evaluateOnNewDocument((noSS) => { localStorage.fdHome = 'forms'; localStorage.fdTips = 'off'; localStorage.fdSimple = 'on'; window.SPOKE = [];
    if (noSS) Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: undefined });
    else Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speaking: false, getVoices: () => [{ name: 'Samantha', lang: 'en-US' }, { name: 'Google US English', lang: 'en-US' }], addEventListener() {}, speak(u) { SPOKE.push({ t: u.text, v: u.voice && u.voice.name }); setTimeout(() => { u.onstart && u.onstart(); u.onend && u.onend(); }, 30); }, cancel() {} } });
    window.SpeechSynthesisUtterance = function (t) { this.text = t; };
    HTMLMediaElement.prototype.play = function () { window.PLAYED = (window.PLAYED || 0) + 1; setTimeout(() => this.onended && this.onended(), 30); return Promise.resolve(); };
  }, !!opts.noSS);
  await p.setRequestInterception(true); p.on('request', (r) => { if (new URL(r.url()).hostname !== '127.0.0.1') return r.abort(); r.continue(); });
  p.on('dialog', (d) => d.accept()); p.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await p.goto(base + '/?api=' + encodeURIComponent(api), { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.pin button'); for (const d of pin) await p.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
  await p.waitForFunction(() => typeof jobs !== 'undefined' && jobs.length > 0, { timeout: 10000 });
  return p;
}
const shot = (p, n) => p.screenshot({ path: '/workspace/fielder-parity10-' + n + '.png' });
const chunk = (t) => ({ candidates: [{ content: { parts: [{ text: t }] } }] }), fc = (name, args) => ({ candidates: [{ content: { parts: [{ functionCall: { name, args } }] } }] });
const linkIn = (m, v) => new URL((m.body.match(new RegExp((v === 'yes' ? 'Approve' : 'Deny') + ': (\\S+)')) || [])[1]);
try {
  let GS = []; setGemStream(() => GS.shift() || null);
  let p = await open('4321', 390);
  // bar in the header; drop-down over the current page (page stays)
  await p.waitForSelector('#tbtop', { visible: true }); await p.evaluate(() => ownerSect('jobs')); await w(300);
  const before = await p.evaluate(() => A.innerHTML.length);
  await p.click('#tbtop'); await p.waitForSelector('#tbdrb .tb', { visible: true });
  if (await p.evaluate(() => !document.body.classList.contains('tbopen') || document.getElementById('tbar').textContent !== '▴')) fail('drop-down not open');
  if (await p.evaluate((b) => A.innerHTML.length !== b, before)) fail('page replaced by Timber');
  const lay = await p.evaluate(() => { const s = document.getElementById('tbvoice').getBoundingClientRect(), q = document.getElementById('tbq').getBoundingClientRect(), m = document.getElementById('tbmsgs').getBoundingClientRect(); return { under: q.top >= s.bottom - 2 && q.top - s.bottom < 30, sug: document.querySelectorAll('#tbsug button').length, mic: !!document.getElementById('tbmic'), h: document.getElementById('tbdr').getBoundingClientRect().height, ih: innerHeight }; });
  if (!lay.under) fail('text box not under Type/Talk'); if (lay.sug !== 2) fail('suggestions ' + lay.sug); if (lay.mic) fail('separate mic'); if (lay.h > lay.ih * 0.66) fail('drop-down too tall ' + JSON.stringify(lay));
  await shot(p, 'timber-dropdown');
  // nav tab opens the same drop-down, not a page
  await p.click('#tbtop'); await w(100); await p.evaluate(() => ownerSect('timber')); await w(200);
  if (await p.evaluate(() => !document.body.classList.contains('tbopen') || view === 'timber')) fail('Owner nav Ask Timber not the drop-down');
  // reply while tucked away: badge + ring + subtitle + toast; chat keeps going
  GS.push([chunk('You have 2 jobs today.')]); setGemStream(() => GS.shift() || null, 900);
  await p.type('#tbq', 'how many jobs today'); await p.click('#tbsend'); await p.click('#tbtop');
  await p.waitForFunction(() => document.getElementById('tbtop').classList.contains('new'), { timeout: 8000 }).catch(async () => fail('no badge when tucked ' + await p.evaluate(() => document.body.className + ' / ' + document.getElementById('tbmsgs').innerText + ' / ' + window.ftTimberAsk._nb + ' / ' + document.getElementById('tbtop').className + ' / ' + (() => { try { return tbNotify('x') } catch (e) { return 'ERR ' + e.message } })() + ' / ' + sessionStorage.tbHist.slice(-120))));
  const nt = await p.evaluate(() => ({ bd: document.getElementById('tbbd').textContent, sub: document.getElementById('tbtsub').textContent, toast: (document.getElementById('tbtoast') || {}).textContent || '' }));
  if (nt.bd !== '1' || !/New: You have 2 jobs/.test(nt.sub) || !/Timber: You have 2 jobs/.test(nt.toast)) fail('notify ' + JSON.stringify(nt));
  await shot(p, 'timber-badge');
  setGemStream(() => GS.shift() || null);
  await p.click('#tbtoast'); await p.waitForFunction(() => document.body.classList.contains('tbopen') && !document.getElementById('tbtop').classList.contains('new'));
  // chat persists across pages for the session
  await p.click('#brand'); await p.waitForSelector('.ohero'); await p.evaluate(() => ownerSect('money')); await w(200); await p.click('#tbtop');
  if (!/2 jobs today/.test(await p.$eval('#tbmsgs', (e) => e.innerText))) fail('chat cleared on leave');
  // one Talk button -> red Stop
  await p.click('#tbvoice'); await p.waitForFunction(() => /Stop/.test(document.getElementById('tbvoice').textContent)); await shot(p, 'timber-stop');
  await p.click('#tbvoice'); await p.waitForFunction(() => /Talk/.test(document.getElementById('tbvoice').textContent)); await p.click('#tbchat');
  // voice intercept only while Voice is off
  await p.evaluate(() => { localStorage.tbSpk = '1'; }); GS.push([chunk('Yes, I can hear you. What do you need?')]);
  const s0 = STREAMS.length; await p.evaluate(() => ftTimberAsk('Can you hear me?'));
  if (STREAMS.length === s0) fail('hearing question did not go to Timber');
  await p.evaluate(() => { localStorage.tbSpk = '0'; }); const s1 = STREAMS.length; const ok = await p.evaluate(() => ftTimberAsk('turn voice on'));
  if (!/Voice is on/.test(ok) || STREAMS.length !== s1) fail('voice-on intercept while off');
  if (await p.evaluate(() => tbVoiceReq('talk to me') || tbVoiceReq("I can't hear you"))) fail('intercept too broad');
  // single TTS fallback: device error + timeout must not play the backup twice
  const plays = await p.evaluate(async () => { window.PLAYED = 0; Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { speaking: false, pending: false, getVoices: () => [], addEventListener() {}, speak(u) { setTimeout(() => u.onerror && u.onerror({}), 10); }, cancel() {} } }); await new Promise((r) => { tbSpeak('Testing one fallback.'); setTimeout(r, 3500); }); return window.PLAYED; });
  if (plays > 1) fail('backup voice played ' + plays + ' times');
  // no Back bars; logo = home; corner mic kept
  if (await p.evaluate(() => { const b = document.getElementById('bbar'); return !!(b && b.offsetParent) || !!(document.getElementById('owbar') && document.getElementById('owbar').offsetParent); })) fail('back bar or Owner page pill showing');
  if (!(await p.$('#vhfab'))) fail('corner mic removed');
  await p.close();
  // Need something?: send + own status; Owner sees everyone's
  p = await open('1234', 390); await p.evaluate(() => ftNeed()); await p.waitForSelector('#ndq');
  const m0 = featOutbox.length; await p.type('#ndq', 'Add a tip line to invoices'); await p.click('#ndsend');
  await p.waitForFunction(() => /Add a tip line/.test((document.getElementById('ndl') || {}).innerText || ''), { timeout: 8000 });
  if (!/New/.test(await p.$eval('#ndl', (e) => e.innerText))) fail('status chip');
  if (featOutbox.length !== m0 + 1 || featOutbox.some((m) => m.to !== 'austin@techsourcedsolutions.com')) fail('VNXT mail not to test inbox ' + JSON.stringify(featOutbox.map((m) => m.to)));
  await shot(p, 'need-something'); await p.close();
  p = await open('7711', 390); await p.evaluate(() => ftNeed()); await p.waitForFunction(() => !/Loading/.test(document.getElementById('ndl').innerText));
  if (/tip line/.test(await p.$eval('#ndl', (e) => e.innerText))) fail('crew sees others requests');
  if (await p.evaluate(() => document.body.classList.contains('hastb'))) fail('crew has Timber bar'); await p.close();
  p = await open('4321', 390); await p.evaluate(() => ftNeed()); await p.waitForFunction(() => /tip line/.test(document.getElementById('ndl').innerText), { timeout: 8000 }).catch(() => fail('Owner does not see all requests'));
  await p.close();
  console.log('batch8 e2e ok');
} finally { await browser.close(); server.close(); }
