import puppeteer from 'puppeteer-core';
import { start, addJob, setTwilio, texts } from './mock-server.mjs';
const SHOTS = process.env.SHOTS || '';
function fail(m) { throw new Error(m); }
addJob({ id: 'T1', est: 'FT-EST-2026-0301', name: 'Text Tess', address: '5 Elm St, Tallahassee, FL 32312', email: '', phone: '(850) 555-0199', status: 'sent', created: '2026-10-20T12:00:00Z', items: [{ title: 'Removal', detail: 'Remove the dead pine.', price: 1200 }, { title: 'Cleanup', detail: '', price: null }], total: 1200, internalNotes: 'SECRET-T1', crew: [], photos: [] });
addJob({ id: 'T2', est: 'FT-EST-2026-0302', name: 'No Phone Ned', address: '6 Elm St, Tallahassee, FL 32312', email: 'ned@example.com', phone: '', status: 'sent', created: '2026-10-21T12:00:00Z', items: [{ title: 'Prune', price: 300 }], total: 300, crew: [], photos: [] });
const server = await start(0);
const base = 'http://127.0.0.1:' + server.address().port, api = encodeURIComponent(base + '/exec');
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
const waitText = (t) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 15000 }, t);
async function login(pin) { for (const d of pin) await page.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d); }
try {
  await page.goto(base + '/?api=' + api, { waitUntil: 'networkidle0' });
  await login('1234');
  await page.waitForFunction(() => typeof jobs !== 'undefined' && jobs.some((j) => j.id === 'T1'), { timeout: 15000 });
  // No phone: Text button disabled with a clear message.
  await page.evaluate(() => mview('T2'));
  await waitText('No phone number');
  if (!(await page.$eval('#tqb', (b) => b.disabled))) fail('text enabled without phone');
  // Twilio not set up: friendly message.
  await page.evaluate(() => mview('T1'));
  await page.click('#tqb');
  await waitText("Texting isn't set up yet");
  if (texts.length) fail('texted while not configured');
  setTwilio(true);
  await page.evaluate(() => mview('T1'));
  await page.click('#tqb');
  await waitText('Quote link texted');
  if (texts.length !== 1 || texts[0].to !== 'TEST_PHONE') fail('text not routed to TEST_PHONE');
  const link = texts[0].link;
  if (!/^quote\.html\?id=[a-f0-9]{48,}$/.test(link) || link.includes('T1')) fail('bad token link ' + link);
  // New quote form: two choices, Text disabled until a phone is typed.
  await page.evaluate(() => { newq(); });
  await page.waitForSelector('#nm');
  await page.evaluate(() => { IT = [{ title: 'Trim', detail: 'Trim oak', price: 450 }]; drawPv(); });
  await page.waitForSelector('#sqt');
  if (!(await page.$('#sq'))) fail('email option missing');
  if (!(await page.$eval('#sqt', (b) => b.disabled))) fail('new-quote text enabled without phone');
  await page.type('#nm', 'New Text Nina');
  await page.type('#ad', '9 Oak Ave, Tallahassee, FL 32312');
  await page.type('#ph', '850-555-0142');
  if (await page.$eval('#sqt', (b) => b.disabled)) fail('text still disabled with phone');
  if (SHOTS) await page.screenshot({ path: SHOTS + '/send_choices.png' });
  await page.click('#sqt');
  await waitText('Quote link texted to');
  if (texts.length !== 2) fail('new quote not texted');
  // Hosted page: renders, no internal notes, approve works.
  const q = await browser.newPage();
  await q.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await q.goto(base + '/' + link + '&api=' + api, { waitUntil: 'networkidle0' });
  const txt = await q.evaluate(() => document.body.innerText);
  for (const t of ['FT-EST-2026-0301', 'Text Tess', 'Remove the dead pine.', 'Included', '$1,200.00', 'Approve this estimate']) if (!txt.includes(t)) fail('quote page missing ' + t);
  if (txt.includes('SECRET')) fail('internal notes leaked');
  if (SHOTS) await q.screenshot({ path: SHOTS + '/quote_page.png', fullPage: true });
  await q.click('#ap');
  await q.waitForSelector('#okm');
  await q.goto(base + '/quote.html?id=deadbeef&api=' + api, { waitUntil: 'networkidle0' });
  if (!(await q.evaluate(() => document.body.innerText.includes('not valid')))) fail('bad token not rejected');
  const r = await (await fetch(base + '/exec')).json();
  if (r.jobs.find((j) => j.id === 'T1').status !== 'approved') fail('approve not saved');
  console.log('fielder text-link e2e ok');
} finally { await browser.close(); server.close(); }
