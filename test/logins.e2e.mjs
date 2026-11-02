// Login monitoring: Owner sees More > Login activity with successes and failures; PINs never shown.
import puppeteer from 'puppeteer-core';
import { start, LOGINS } from './mock-server.mjs';
const server = await start(0); const base = 'http://127.0.0.1:' + server.address().port, api = base + '/exec';
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const fail = (m) => { throw new Error(m); }; const w = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(pin) {
  const p = await browser.newPage(); await p.setViewport({ width: 390, height: 844 });
  await p.evaluateOnNewDocument(() => { localStorage.fdHome = 'forms'; localStorage.fdTips = 'off'; localStorage.fdSimple = 'on'; });
  await p.goto(base + '/?api=' + encodeURIComponent(api), { waitUntil: 'domcontentloaded' }); await p.waitForSelector('.pin button');
  await p.evaluate((pin) => login(pin), pin);
  await w(1500); return p;
}
try {
  let p = await open('0000'); await p.close();
  p = await open('4321'); await p.waitForSelector('.ohero', { timeout: 10000 });
  if (LOGINS.length < 2 || LOGINS[0].ok || !LOGINS[1].ok || LOGINS[1].role !== 'Owner') fail('log ' + JSON.stringify(LOGINS));
  if (JSON.stringify(LOGINS).includes('4321') || JSON.stringify(LOGINS).includes('0000')) fail('PIN in log');
  await p.evaluate(() => ownerSect('more')); await p.waitForSelector('#s-logins'); await w(600); await p.evaluate(() => document.getElementById('s-logins').click());
  await p.waitForSelector('.lgrow'); const t = await p.$eval('#lgcard', (e) => e.innerText);
  if (!/Login activity/.test(t) || !/Wrong code/.test(t) || !/Owner|Signed in/.test(t) || /4321|0000/.test(t)) fail('screen ' + t);
  if (!(await p.$('#fddone'))) fail('no Done');
  await p.screenshot({ path: '/workspace/fielder-login-activity.png' }); await p.close();
  p = await open('1234'); const r = await p.evaluate(() => api({ a: 'loginsList' }).then(() => 'ok', (e) => e.message)); if (r === 'ok') fail('Manager can list logins');
  console.log('logins e2e ok');
} finally { await browser.close(); server.close(); }
