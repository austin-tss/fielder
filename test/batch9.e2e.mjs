// Batch 9 (Miller 8226f7f + cf0bd01): Voice off by default each session, Gemini voice via Worker /api/tts with sentence prefetch,
// single play, phone-voice fallback (failure / no key); green outline SVG mics, red + stop while recording.
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { start, addJob, featOn, featOutbox, mockEmployees, mockJobs, setGemStream, STREAMS, GEMCALLS, TTSHITS, TTSGEM, setTts } from './mock-server.mjs';
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
  // ---- Voice is off at the start of each session ----
  let p = await open('4321', 390); await p.evaluate(() => ftTimber()); await p.waitForSelector('#tbspk');
  if (!/Read aloud off/.test(await p.$eval('#tbspk', (e) => e.textContent))) fail('voice should be off in a new session');
  // ---- green outline mic everywhere, no mic emoji; recording = red + stop ----
  const ic = await p.evaluate(() => { const b = document.getElementById('tbdict'), f = document.getElementById('vhfab'), cs = getComputedStyle(b);
    return { emoji: /🎙|🎤|⏹/.test(document.body.innerHTML), svg: !!b.querySelector('svg.fdmic .m rect'), col: cs.color, bord: cs.borderTopColor, fab: !!(f && f.querySelector('svg.fdmic')), fabCol: f && getComputedStyle(f).color, fabShown: !!f && getComputedStyle(f).display !== 'none' }; });
  if (ic.emoji || !ic.svg || ic.col !== 'rgb(120, 162, 47)' || ic.bord !== 'rgb(120, 162, 47)' || !ic.fab || ic.fabCol !== 'rgb(120, 162, 47)' || ic.fabShown) fail('mic icon ' + JSON.stringify(ic));
  await shot(p, 'voice-off');
  const rec = await p.evaluate(() => { const b = document.getElementById('tbdict'); b.classList.add('rec'); b.innerHTML = FDMIC(true); const s = b.querySelector('.s'), m = b.querySelector('.m'); const o = { bg: getComputedStyle(b).backgroundColor, col: getComputedStyle(b).color, stop: getComputedStyle(s).display, mic: getComputedStyle(m).display }; return o; });
  if (rec.bg !== 'rgb(192, 57, 43)' || rec.col !== 'rgb(255, 255, 255)' || rec.stop === 'none' || rec.mic !== 'none') fail('recording look ' + JSON.stringify(rec));
  await shot(p, 'mic-recording'); await p.evaluate(() => { const b = document.getElementById('tbdict'); b.classList.remove('rec'); b.innerHTML = FDMIC(); });
  // voice off: nothing is spoken
  GS = [[chunk('Labor today is $100.')]]; await p.type('#tbq', 'labor today'); await p.click('#tbsend'); await w(1500);
  if (TTSHITS.length || (await p.evaluate(() => SPOKE.filter((x) => x.t.trim()).length))) fail('spoke while voice off ' + JSON.stringify([TTSHITS, await p.evaluate(() => [SPOKE, window.PLAYED, TB_SAID])]));
  // ---- Voice on: Gemini voice via the Worker, sentence prefetch, each sentence once ----
  await p.click('#tbspk'); if (!/Read aloud on/.test(await p.$eval('#tbspk', (e) => e.textContent))) fail('turn voice on');
  GS = [[chunk('Labor today is $100. '), chunk('Nobody is on the clock right now. '), chunk('Two jobs are scheduled.')]];
  const p0 = await p.evaluate(() => (window.PLAYED || 0) + (TB_SAID.length = 0)); await p.type('#tbq', 'labor today'); await p.click('#tbsend');
  await p.waitForFunction(() => window.TB_SPOKE === 'gemini' && (window.PLAYED || 0) >= 3, { timeout: 8000 }).catch(() => {});
  await w(800); let r = await p.evaluate(() => ({ said: window.TB_SAID.slice(), played: (window.PLAYED || 0), dev: SPOKE.filter((x) => x.t.trim()).length }));
  if (r.dev) fail('device voice used while Gemini worked ' + JSON.stringify(r));
  if (r.said.length < 2 || r.played - p0 !== r.said.length || new Set(r.said).size !== r.said.length) fail('Gemini play once each ' + JSON.stringify(r));
  if (TTSHITS.length !== r.said.length || TTSGEM[0] !== 'gemini-3.8-flash-lite-tts') fail('tts route ' + JSON.stringify({ TTSHITS, TTSGEM }));
  await p.close();
  // ---- model fallback chain, then the phone voice when Gemini fails ----
  TTSGEM.length = 0; setTts('fail'); p = await open('4321', 390); await p.evaluate(() => ftTimber()); await p.waitForSelector('#tbspk'); await p.click('#tbspk');
  GS = [[chunk('Labor today is $100.')]]; await p.type('#tbq', 'labor today'); await p.click('#tbsend');
  await p.waitForFunction(() => SPOKE.filter((x) => x.t.trim()).length >= 1, { timeout: 8000 }).catch(() => fail('no device fallback on Gemini failure'));
  if (TTSGEM.join() !== 'gemini-3.8-flash-lite-tts,gemini-3.8-flash-tts,gemini-2.5-flash-preview-tts') fail('model order ' + TTSGEM.join());
  await w(500); if ((await p.evaluate(() => SPOKE.filter((x) => x.t.trim()).length)) !== 1) fail('double play on fallback'); await p.close();
  // ---- no GEMINI_API_KEY secret: 503, clean phone-voice fallback ----
  TTSGEM.length = 0; setTts('nokey'); p = await open('4321', 390); await p.evaluate(() => ftTimber()); await p.waitForSelector('#tbspk'); await p.click('#tbspk');
  GS = [[chunk('Labor today is $100. '), chunk('Nobody is on the clock right now.')]]; await p.type('#tbq', 'labor today'); await p.click('#tbsend');
  await p.waitForFunction(() => SPOKE.filter((x) => x.t.trim()).length >= 2, { timeout: 8000 }).catch(() => fail('no device fallback without key'));
  await w(500); r = await p.evaluate(() => ({ n: SPOKE.filter((x) => x.t.trim()).length, said: TB_SAID.length, played: window.PLAYED || 0, no: window.TB_NOTTS }));
  if (TTSGEM.length || r.n !== r.said || !r.no) fail('nokey fallback ' + JSON.stringify(r)); await p.close();
  // ---- c373cfa: expandable box (Enter sends small, newline big), Talk to type label ----
  p = await open('4321', 390); await p.evaluate(() => ftTimber()); await p.waitForSelector('#tbbig');
  if ((await p.$eval('#tbdict', (e) => e.title)) !== 'Talk to type') fail('mic label');
  GS = [[chunk('Two jobs.')]]; const s0 = STREAMS.length; await p.type('#tbq', 'jobs'); await p.keyboard.press('Enter'); await p.waitForFunction(() => /Two jobs/.test(document.getElementById('tbmsgs').innerText), { timeout: 8000 }).catch(() => fail('Enter should send when small'));
  await p.click('#tbbig'); await w(400); const h = await p.$eval('#tbq', (e) => e.getBoundingClientRect().height + ' ' + e.className + ' ' + e.style.cssText + ' ' + getComputedStyle(e).height + ' ' + getComputedStyle(e).maxHeight + ' ' + [...document.styleSheets].flatMap((ss) => { try { return [...ss.cssRules] } catch (x) { return [] } }).filter((r) => r.selectorText && e.matches(r.selectorText) && r.style.height).map((r) => r.selectorText + '=' + r.style.height).join('|')); if (parseFloat(h) < 180) fail('expanded height ' + h);
  const s1 = STREAMS.length; await p.type('#tbq', 'line one'); await p.keyboard.press('Enter'); await p.type('#tbq', 'line two'); await w(400);
  if (STREAMS.length !== s1 || !/line one\nline two/.test(await p.$eval('#tbq', (e) => e.value))) fail('Enter should add a line when expanded'); void s0;
  await shot(p, 'timber-expanded');
  await p.click('#tbbig'); await w(400); if ((await p.$eval('#tbq', (e) => e.getBoundingClientRect().height)) > 70) fail('collapse');
  await p.close();
  // ---- c373cfa: delete VNXT requests: Owner any, crew only their own, one confirm ----
  p = await open('7711', 390); await p.evaluate(() => api({ a: 'vxAdd', request: 'Crew wants a rain button' }));
  var p2 = await open('4321', 390); await p2.evaluate(() => api({ a: 'vxAdd', request: 'Owner wants a tip line' }));
  await p.evaluate(() => ftNeed()); await p.waitForFunction(() => /rain button/.test(document.getElementById('ndl').innerText), { timeout: 8000 });
  if (/tip line/.test(await p.$eval('#ndl', (e) => e.innerText))) fail('crew sees others');
  const ids = await p2.evaluate(async () => (await api({ a: 'vxList' })).items.map((x) => [x.id, x.request]));
  const tipId = ids.find((x) => /tip line/.test(x[1]))[0];
  const deny = await p.evaluate((id) => api({ a: 'vxDel', id }).then(() => 'ok', (e) => e.message), tipId); if (!/only delete your own/.test(deny)) fail('crew deleted Owner request');
  await p.evaluate(() => { window.CONF = 0; window.confirm = () => (++window.CONF, true); }); await p2.evaluate(() => { window.confirm = () => true; });
  await p.bringToFront(); await p.click('.vxdel'); await p.waitForFunction(() => !/rain button/.test(document.getElementById('ndl').innerText), { timeout: 8000 }).catch(() => fail('crew delete own'));
  const dialogs = await p.evaluate(() => window.CONF); if (dialogs !== 1) fail('confirm once ' + dialogs);
  await p2.bringToFront(); await p2.evaluate(() => ftVnxt()); await p2.waitForFunction(() => /tip line/.test(A.innerText), { timeout: 8000 }); if (/rain button/.test(await p2.evaluate(() => A.innerText))) fail('deleted still listed');
  await shot(p2, 'vnxt-delete'); await p2.click('.vxdel'); await p2.waitForFunction(() => !/tip line/.test(A.innerText), { timeout: 8000 }).catch(() => fail('owner delete'));
  await p.close(); await p2.close();
  // ---- e432ba3: no tips / no header ?, Add team member with plain-English role abilities, Timber hard reset on tuck ----
  p = await open('4321', 390); await w(600);
  if (await p.$('#tipsbtn') || await p.evaluate(() => !!document.querySelector('script[src*="tips.js"]'))) fail('tips still loaded');
  await p.evaluate(() => ownerSect('more')); await p.waitForSelector('#s-addp'); await p.click('#s-addp'); await p.waitForSelector('#owcan', { timeout: 8000 });
  if (!/What an Estimator can do|What Crew can do|What an Owner can do|What an Admin can do/.test(await p.$eval('#owcan', (e) => e.innerText))) fail('can-do box');
  await p.select('#owrole', 'Crew'); if (!/What Crew can do[\s\S]*Clock in and out/.test(await p.$eval('#owcan', (e) => e.innerText))) fail('can-do updates by role');
  if ((await p.$$eval('#owrole option', (o) => o.length)) !== 4) fail('four roles'); await shot(p, 'add-team-member');
  GS = [[chunk('Late reply that must not come back.')]]; setGemStream(() => GS.shift() || null, 700);
  await p.evaluate(() => ftTimber()); await p.waitForSelector('#tbq'); await p.type('#tbq', 'slow one'); await p.click('#tbsend'); await w(150);
  await p.click('#tbtop'); await w(1500); setGemStream(() => GS.shift() || null);
  if (/Late reply/.test(await p.evaluate(() => sessionStorage.tbHist || ''))) fail('in-flight reply leaked after tuck');
  await p.click('#tbtop'); await p.waitForSelector('#tbs1', { visible: true }); if (/slow one|Late reply/.test(await p.$eval('#tbmsgs', (e) => e.innerText))) fail('reopen not empty');
  GS = [[chunk('Fresh answer.')]]; await p.type('#tbq', 'next'); await p.click('#tbsend'); await p.waitForFunction(() => /Fresh answer/.test(document.getElementById('tbmsgs').innerText), { timeout: 8000 }).catch(() => fail('next question blocked'));
  await p.close();
  setTts('ok');
  console.log('batch9 e2e ok');
} finally { await browser.close(); server.close(); }
