import puppeteer from 'puppeteer-core';
import { start, setVoice, created } from './mock-server.mjs';
const SHOTS = process.env.SHOTS || '';
function fail(m) { throw new Error(m); }
const CREW = ['4321', 'Power line', 'Bucket truck', 'picky', 'Haul all debris', '30 inch'];
const server = await start(0);
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
page.on('dialog', (d) => d.accept());
const waitText = (t) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 20000 }, t);
async function login() { await page.goto(base + '/?api=' + encodeURIComponent(base + '/exec'), { waitUntil: 'networkidle0' }); for (const d of '1234') await page.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d); await waitText('New customer quote'); }
try {
  // No key: button says setup.
  await login();
  await page.evaluate(() => newq());
  await page.waitForSelector('#aibtn');
  if (!(await page.$eval('#aibtn', (b) => b.textContent)).includes('Voice quotes need setup')) fail('setup label missing');
  const first = await page.evaluate(() => document.querySelector('#app .card').children[1].id);
  if (first !== 'aibox') fail('AI button must be at the very top, got ' + first);
  // Key set: record (fake mic), AI fills.
  setVoice(true);
  await page.evaluate(() => { localStorage.removeItem('fdCache'); logout(); });
  await login();
  await page.evaluate(() => newq());
  await page.waitForSelector('#aibtn:not([disabled])');
  if (!(await page.$eval('#aibtn', (b) => b.textContent)).includes('Have AI fill this quote out')) fail('label wrong');
  await page.evaluate(() => { AINOSR = true; }); // headless Chrome has no speech service; exercise the audio path
  await page.click('#aibtn');
  await waitText('Stop and fill the quote');
  await new Promise((r) => setTimeout(r, 1500));
  await page.click('#aibtn');
  await waitText('Filled in. Check anything marked');
  const v = await page.evaluate(() => ({ nm: $('#nm').value, em: $('#em').value, ad: $('#ad').value, addl: $('#addl').value, inote: $('#inote').value, qt: $('#qt').value, items: IT }));
  if (v.nm !== 'Pat Voice' || v.em !== 'pat.voice@example.com' || !v.ad.includes('Tallahassee')) fail('customer not filled');
  if (v.items.length !== 2 || v.items[1].price !== 300) fail('items wrong ' + JSON.stringify(v.items));
  for (const c of CREW) { if (!v.inote.includes(c)) fail('crew missing ' + c); if ((v.addl + JSON.stringify(v.items) + v.qt).includes(c)) fail('crew leaked to customer: ' + c); }
  if (SHOTS) await page.screenshot({ path: SHOTS + '/ai_filled_top.png' });
  if (SHOTS) await page.screenshot({ path: SHOTS + '/ai_filled_full.png', fullPage: true });
  // Send (mock only) and make sure nothing crew-only reaches the customer html.
  await page.evaluate(() => sendQ());
  await waitText('Quote + PDF sent');
  const sent = created[created.length - 1];
  for (const c of CREW) if (sent.html.includes(c)) fail('customer html leaked ' + c);
  // Trash (bottom-left) clears with Undo; mic sits bottom-right.
  await page.evaluate(() => newq());
  await page.waitForSelector('#addl');
  await page.type('#addl', 'Customer note to clear');
  const pos = await page.evaluate(() => { const w = document.getElementById('addl').closest('.tbox'); const t = w.querySelector('.ctrash').getBoundingClientRect(), m = w.querySelector('.cmic').getBoundingClientRect(), b = w.getBoundingClientRect(); return { tl: t.left - b.left, mr: b.right - m.right, tb: b.bottom - t.bottom }; });
  if (pos.tl > 20 || pos.mr > 20 || pos.tb > 20) fail('corner buttons misplaced ' + JSON.stringify(pos));
  await page.evaluate(() => document.getElementById('addl').closest('.tbox').querySelector('.ctrash').click());
  if ((await page.$eval('#addl', (e) => e.value)) !== '') fail('not cleared');
  await waitText('Cleared');
  await page.evaluate(() => document.getElementById('addl').scrollIntoView({ block: 'center' }));
  if (SHOTS) await page.screenshot({ path: SHOTS + '/clear_notes.png' });
  await page.click('#undob');
  if ((await page.$eval('#addl', (e) => e.value)) !== 'Customer note to clear') fail('undo failed');
  // Settings: remove the AI button and a text box, then add back.
  await page.evaluate(() => { DIRTY = false; openSet(); openForm(); });
  await page.evaluate(() => [...document.querySelector('[data-field-row="ai"]').querySelectorAll('button')].find((b) => b.textContent === 'Remove from form').click());
  await page.evaluate(() => [...document.querySelector('[data-field-row="addl"]').querySelectorAll('button')].find((b) => b.textContent === 'Remove from form').click());
  if (await page.$('[data-field-row="name"] button')) { const t = await page.$eval('[data-field-row="name"]', (e) => e.innerText); if (t.includes('Remove from form')) fail('core field removable'); }
  if (SHOTS) await page.screenshot({ path: SHOTS + '/settings_remove_boxes.png', fullPage: true });
  await page.click('#ss');
  await waitText('Quote form saved');
  await page.evaluate(() => newq());
  await page.waitForSelector('#nm');
  if (await page.$('#aibtn') || await page.$('#addl')) fail('removed boxes still showing');
  await page.evaluate(() => { openSet(); openForm(); });
  await page.evaluate(() => { for (const id of ['ai', 'addl']) [...document.querySelector('[data-field-row="' + id + '"]').querySelectorAll('button')].find((b) => b.textContent === 'Add back').click(); });
  await page.click('#ss');
  await page.waitForFunction(() => SET.form.fields.find((f) => f.id === 'ai').show && SET.form.fields.find((f) => f.id === 'addl').show);
  await page.evaluate(() => newq());
  await page.waitForSelector('#aibtn');
  await page.waitForSelector('#addl');
  console.log('fielder ai e2e ok');
} finally { await browser.close(); server.close(); }
