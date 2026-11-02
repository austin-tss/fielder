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
  let p = await open('4321', 390); await w(600);
  await p.evaluate(() => ftNeed()); await p.waitForSelector('#ndl'); console.log('RT', await p.evaluate(() => sessionStorage.fdRoute + ' ' + !!ftNeed._rt)); await p.reload({ waitUntil: 'domcontentloaded' }); await w(2500);
  let r = await p.evaluate(() => ({ need: !!document.getElementById('ndl'), role, home: !!document.querySelector('.ohero') })); if (!r.need || r.role !== 'Owner') fail('reload on Need something? ' + JSON.stringify(r));
  await p.evaluate(() => ftJobs('invoiced')); await w(500); await p.reload({ waitUntil: 'domcontentloaded' }); await w(2500);
  r = await p.evaluate(() => ({ t: window.FTFIL, owner: sessionStorage.fdOwner, home: !!document.querySelector('.ohero') })); if (r.home || r.t !== 'invoiced') fail('reload on Invoiced ' + JSON.stringify(r));
  await p.evaluate(() => ftTimber()); await p.waitForSelector('#tbq'); await p.reload({ waitUntil: 'domcontentloaded' }); await w(2500);
  if (!(await p.evaluate(() => document.body.classList.contains('tbopen') && !!document.getElementById('tbq')))) fail('reload with Ask Timber open');
  await p.screenshot({ path: '/workspace/fielder-parity10-timber-clean.png' });
  const lay = await p.evaluate(() => { const q = document.getElementById('tbq').getBoundingClientRect(), c = document.querySelector('#tbdr .card.tb').getBoundingClientRect(), s = document.getElementById('tbsend').getBoundingClientRect(); return { qw: q.width, cw: c.width, sendIn: s.right <= q.right + 1 && s.left > q.left }; });
  if (lay.qw < lay.cw - 60 || !lay.sendIn) fail('box not full width ' + JSON.stringify(lay));
  await p.evaluate(() => logoHome()); await w(300); await p.reload({ waitUntil: 'domcontentloaded' }); await w(2500);
  if (!(await p.evaluate(() => !!document.querySelector('.ohero')))) fail('home after logo');
  console.log('reload e2e ok');
} finally { await browser.close(); server.close(); }