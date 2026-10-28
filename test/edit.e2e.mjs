import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { start } from './mock-server.mjs';

const shots = process.env.SHOTS_DIR || '/opt/cursor/artifacts/screenshots';
fs.mkdirSync(shots, { recursive: true });
const banned = [];
function fail(msg) { throw new Error(msg); }
async function shot(page, name) {
  await page.screenshot({ path: path.join(shots, name + '.png'), fullPage: true });
}
async function pressPin(page, pin) {
  for (const digit of pin) {
    await page.evaluate((digit) => {
      const btn = [...document.querySelectorAll('.pin button')].find((b) => b.textContent === digit);
      if (!btn) throw new Error('missing pin key ' + digit);
      btn.click();
    }, digit);
  }
}
async function waitText(page, text) {
  await page.waitForFunction((text) => document.body.innerText.includes(text), { timeout: 15000 }, text);
}

const server = await start(0);
const port = server.address().port;
const base = 'http://127.0.0.1:' + port;
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
});
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 900, deviceScaleFactor: 1 });
page.setDefaultTimeout(15000);
page.on('request', (req) => {
  let host = '';
  try { host = new URL(req.url()).hostname; } catch (e) { return; }
  if (/script\.google|mail\.google|gmail|googleusercontent/.test(host)) banned.push(req.url());
});
page.on('pageerror', (err) => console.log('PAGEERROR', err.message));
page.on('dialog', (d) => d.accept());

try {
  await page.goto(base + '/?api=' + encodeURIComponent(base + '/exec'), { waitUntil: 'networkidle0' });
  await waitText(page, 'Enter your PIN');
  const backOnPin = await page.$eval('#navbar', (el) => el.hidden);
  if (!backOnPin) fail('back button should be hidden on the PIN screen');
  await pressPin(page, '1234');
  await waitText(page, 'Contact my account rep');
  if ((await page.evaluate(() => document.body.innerText)).includes('Drive folder')) fail('drive link should not be on the home list');
  await page.evaluate(() => { openSet(); openConn(); });
  await waitText(page, 'Open Drive folder');
  if (!(await page.$eval('#conn-drive a', (a) => a.href)).includes('MOCK-ROOT')) fail('drive link wrong');
  await page.evaluate(() => navHome());
  await waitText(page, 'Contact my account rep');
  await page.evaluate(() => document.getElementById('row-fq').click());
  await waitText(page, 'Existing Oak');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Existing Oak')).click());
  await waitText(page, 'SECRET-OLD-INTERNAL');
  const backShown = await page.$eval('#navbar', (el) => !el.hidden);
  if (!backShown) fail('back button missing on the job');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Edit quote').click());
  await waitText(page, 'Edit quote');
  await page.evaluate(() => {
    const title = document.querySelector('#pv input');
    title.value = 'Kept removal';
    title.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('inote').value = 'SECRET-EDIT-INTERNAL';
    document.getElementById('addl').value = 'Visible after edit';
  });
  await page.evaluate(() => document.getElementById('sqsave').click());
  await waitText(page, 'Quote saved');
  await waitText(page, 'Kept removal');
  await waitText(page, 'SECRET-EDIT-INTERNAL');
  await shot(page, 'fielder-08-edited-quote');
  const saved = await page.evaluate(async () => {
    const d = await (await fetch(location.origin + '/exec')).json();
    const job = d.jobs.find((j) => j.id === 'FT-OLD');
    const block = FDForm.specHtml(job, d.settings.form) + FDForm.additionalNotesHtml(job, d.settings.form) + FDForm.customerPreviewHtml(job, d.settings.form);
    return { block, title: job.items[0].title, phone2: job.phone2 || '' };
  });
  if (saved.title !== 'Kept removal') fail('line item was not saved');
  if (saved.block.includes('SECRET-EDIT-INTERNAL')) fail('edited internal note leaked');
  if (!saved.block.includes('Visible after edit')) fail('customer note missing after edit');

  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Edit customer').click());
  await waitText(page, 'Advanced');
  await page.evaluate(() => document.querySelector('button.btn.gr').click());
  await page.waitForSelector('#cph2');
  await page.$eval('#cph2', (el) => { el.value = '850-555-0199'; });
  await page.$eval('#cct2', (el) => { el.value = 'SECRET-CONTACT'; });
  await page.evaluate(() => document.getElementById('csave').click());
  await waitText(page, 'Customer saved');
  const cust = await page.evaluate(async () => {
    const d = await (await fetch(location.origin + '/exec')).json();
    const job = d.jobs.find((j) => j.id === 'FT-OLD');
    const block = FDForm.specHtml(job, d.settings.form) + FDForm.customerPreviewHtml(job, d.settings.form);
    return { phone2: job.phone2, contact2: job.contact2, block };
  });
  if (cust.phone2 !== '850-555-0199' || cust.contact2 !== 'SECRET-CONTACT') fail('secondary contact was not saved');
  if (cust.block.includes('SECRET-CONTACT') || cust.block.includes('850-555-0199')) fail('secondary contact leaked to the customer');
  await shot(page, 'fielder-09-edit-customer');

  await page.evaluate(() => document.getElementById('brand').click());
  await waitText(page, 'New customer quote');
  const homeBack = await page.$eval('#navbar', (el) => el.hidden);
  if (!homeBack) fail('logo home should hide the back button');
  await page.evaluate(() => document.getElementById('rephome').click());
  await waitText(page, 'William Griffin');
  if (!(await page.$eval('#repcall', (a) => a.href)).startsWith('tel:8505550100')) fail('call link wrong');
  if (!(await page.$eval('#reptext', (a) => a.href)).startsWith('sms:8505550100')) fail('text link wrong');
  if (await page.$('#fbtext')) fail('feedback form should be gone');
  await shot(page, 'fielder-10-account-rep');
  await page.evaluate(() => document.getElementById('back').click());
  await waitText(page, 'New customer quote');

  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.id === 'gear').click());
  await waitText(page, 'Appearance');
  await page.evaluate(() => document.querySelector('input[name="theme"][value="dark"]').click());
  await page.evaluate(() => document.getElementById('ss').click());
  await waitText(page, 'Quote form saved');
  const dark = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (dark !== 'dark') fail('modern dark did not apply');
  await shot(page, 'fielder-11-dark-home');
  await page.evaluate(() => document.getElementById('back').click());
  await waitText(page, 'Contact my account rep');
  const stillDark = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (stillDark !== 'dark') fail('dark theme did not stay on home');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.id === 'gear').click());
  await page.evaluate(() => document.querySelector('input[name="theme"][value="classic"]').click());
  await page.evaluate(() => document.getElementById('ss').click());
  await waitText(page, 'Quote form saved');
  await page.evaluate(() => document.getElementById('back').click());
  const classic = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (classic) fail('classic should clear the dark theme');

  await page.evaluate(() => document.getElementById('out').click());
  await waitText(page, 'Enter your PIN');
  await pressPin(page, '6789');
  await waitText(page, 'Finished Pine');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Finished Pine')).click());
  await waitText(page, 'Save invoice');
  await page.$eval('#an', (el) => { el.value = 'Due on completion of the tree work.'; });
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Save invoice').click());
  await waitText(page, 'Invoice saved');
  const inv = await page.evaluate(async () => {
    const d = await (await fetch(location.origin + '/exec')).json();
    return d.jobs.find((j) => j.id === 'FT-DONE').invoice;
  });
  if (!inv || inv.note !== 'Due on completion of the tree work.') fail('invoice note was not saved');
  const hits = await (await fetch(base + '/__hits')).json();
  if (hits.some((h) => h.send)) fail('an edit sent mail: ' + JSON.stringify(hits));
  if (hits.some((h) => h.a === 'create' || h.a === 'invoice' || h.a === 'finish')) fail('a customer email action ran');
  await shot(page, 'fielder-12-invoice-saved');
  if (banned.length) fail('live or mail host was contacted: ' + banned.join(' '));
  console.log('fielder edit e2e ok');
} catch (err) {
  const info = await page.evaluate(() => ({
    toast: (document.getElementById('toast') || {}).textContent || '',
    body: document.body.innerText.slice(0, 1600)
  })).catch((e) => ({ evalError: e.message }));
  console.error('DEBUG', JSON.stringify(info, null, 2));
  throw err;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
