import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { start } from './mock-server.mjs';

const shots = '/opt/cursor/artifacts/screenshots';
fs.mkdirSync(shots, { recursive: true });
const banned = [];

function fail(msg) { throw new Error(msg); }
async function shot(page, name) {
  const file = path.join(shots, name + '.png');
  await page.screenshot({ path: file, fullPage: true });
  return file;
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
async function setVal(page, sel, value) {
  await page.waitForSelector(sel);
  await page.$eval(sel, (el, value) => { el.value = value; el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
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
page.on('dialog', (d) => d.accept());
page.on('pageerror', (err) => console.log('PAGEERROR', err.message));

try {
  await page.goto(base + '/?api=' + encodeURIComponent(base + '/exec'), { waitUntil: 'networkidle0' });
  await waitText(page, 'Enter your PIN');
  await shot(page, 'fielder-01-pin');
  await pressPin(page, '1234');
  await waitText(page, 'New customer quote');
  await waitText(page, 'Existing Oak');
  await page.evaluate(() => document.getElementById('gear').click());
  await page.evaluate(() => document.getElementById('row-form').click());
  await waitText(page, 'Services and line prices');
  await waitText(page, 'Customer sees this');
  await shot(page, 'fielder-02-quote-form-editor');

  await page.evaluate(() => {
    document.querySelector('[data-field-row="species"] input[data-k="show"]').click();
    document.querySelector('[data-field-row="service"] input[data-k="label"]').value = 'Work';
    const timing = document.querySelector('[data-field-row="timing"] input[data-k="options"]');
    timing.value = timing.value + ', After the storm';
  });
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Add service').click());
  await page.waitForFunction(() => [...document.querySelectorAll('[data-k="name"]')].some((el) => el.value === ''));
  await page.evaluate(() => {
    const empty = [...document.querySelectorAll('[data-k="name"]')].find((el) => el.value === '');
    empty.value = 'Hazard prune';
    empty.parentElement.querySelector('[data-k="price"]').value = '450';
    const row = [...document.querySelectorAll('[data-k="name"]')].find((el) => el.value === 'Removal');
    row.parentElement.querySelector('button').click();
  });
  await waitText(page, 'Add a field');
  await setVal(page, '#nfname', 'Gate code');
  await page.select('#nfkind', 'select');
  await setVal(page, '#nfopts', 'Call first, Text first');
  await page.click('#nfcust');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Add field').click());
  await page.waitForFunction(() => [...document.querySelectorAll('[data-k="label"]')].some((el) => el.value === 'Gate code'));
  await setVal(page, '#qsub', 'Tree estimate {estimate} for {name}');
  await shot(page, 'fielder-03-form-edited');
  await page.click('#ss');
  await waitText(page, 'Quote form saved');

  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === '← Back to Settings').click());
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Back').click());
  await waitText(page, 'Existing Oak');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Existing Oak')).click());
  await waitText(page, 'SECRET-OLD-INTERNAL');
  await waitText(page, 'Visible oak note');
  await waitText(page, 'Removal');
  await shot(page, 'fielder-04-saved-quote-keeps-name');

  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => /Back/.test(b.textContent)).click());
  await waitText(page, 'New customer quote');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('New customer quote')).click());
  await waitText(page, 'Work');
  await page.waitForSelector('[data-field="service"]');
  const hiddenSpecies = await page.$('[data-field="species"]');
  if (hiddenSpecies) fail('Tree field should be hidden');
  const options = await page.$$eval('#svc option', (els) => els.map((e) => e.textContent));
  if (options.includes('Removal')) fail('deleted service still on the new quote dropdown: ' + options.join(','));
  if (!options.includes('Hazard prune')) fail('new service missing');
  if (!options.includes('Pruning')) fail('kept service missing');
  const timing = await page.$$eval('#timing option', (els) => els.map((e) => e.textContent));
  if (!timing.includes('After the storm')) fail('timing dropdown was not edited: ' + timing.join(','));
  await waitText(page, 'Gate code');
  await shot(page, 'fielder-05-new-quote-uses-form');

  await page.type('#nm', 'Pat Homeowner');
  await page.type('#ad', '1 Oak');
  await page.type('#em', 'pat@example.com');
  await page.select('#svc', 'Hazard prune');
  const gateId = await page.evaluate(() => {
    const wrap = [...document.querySelectorAll('[data-field]')].find((el) => el.innerText.includes('Gate code'));
    const sel = wrap && wrap.querySelector('select');
    return sel ? sel.id : '';
  });
  if (!gateId) fail('gate dropdown missing');
  await page.select('#' + gateId, 'Call first');
  await page.type('#addl', 'VISIBLE-NOTE for the customer');
  await page.type('#inote', 'SECRET-NEW-INTERNAL');
  await page.type('#qt', 'Prune the live oak over the roof $900');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Preview polished quote')).click());
  await waitText(page, 'Customer will see');
  const preview = await page.$eval('#pv', (el) => el.innerText);
  if (!preview.includes('VISIBLE-NOTE')) fail('customer note missing from preview');
  if (!preview.includes('Hazard prune')) fail('service line missing from preview');
  if (preview.includes('SECRET-NEW-INTERNAL')) fail('internal note leaked into the customer preview');
  if (preview.includes('SECRET-OLD-INTERNAL')) fail('old internal note leaked');
  await shot(page, 'fielder-06-customer-preview');

  await page.evaluate(() => { const b = document.getElementById('sq'); if (!b) throw new Error('send button missing'); b.click(); });
  await page.waitForFunction(() => {
    const t = document.getElementById('toast');
    return !!(t && t.style.display !== 'none' && t.textContent.indexOf('Quote + PDF sent to pat@example.com') >= 0);
  });
  const created = await page.evaluate(async (url) => {
    const r = await fetch(url);
    const j = await r.json();
    return j.jobs[0];
  }, base + '/exec');
  if (created.internalNotes !== 'SECRET-NEW-INTERNAL') fail('internal note was not saved on the job');
  if (created.service !== 'Hazard prune') fail('service was not saved');
  const check = await page.evaluate(async () => {
    const FD = window.FDForm;
    const d = await (await fetch(location.origin + '/exec')).json();
    const job = d.jobs.find((j) => j.internalNotes === 'SECRET-NEW-INTERNAL');
    const block = FD.specHtml(job, d.settings.form) + FD.additionalNotesHtml(job, d.settings.form) + FD.customerPreviewHtml(job, d.settings.form);
    return { block, subject: FD.quoteCopy(d.settings, job).subject, job };
  });
  if (check.block.includes('SECRET-NEW-INTERNAL')) fail('customer html leaked the new internal note');
  if (!check.block.includes('VISIBLE-NOTE')) fail('customer html missed the customer note');
  if (!check.block.includes('Call first')) fail('customer-visible custom field missing');
  if (check.subject !== 'Tree estimate FT-EST-2026-0099 for Pat Homeowner') fail('wording was ' + check.subject);

  await page.evaluate(() => document.getElementById('gear').click());
  await page.evaluate(() => document.getElementById('row-form').click());
  await waitText(page, 'Reset form to default');
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Reset form to default').click());
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Reset wording to default').click());
  const subject = await page.$eval('#qsub', (el) => el.value);
  if (!subject.includes('Your estimate from Fielder Tree Service')) fail('wording reset failed: ' + subject);
  await page.click('#ss');
  await waitText(page, 'Quote form saved');
  await page.evaluate(() => document.getElementById('navhome').click());
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('New customer quote')).click());
  await waitText(page, 'Tree');
  await page.waitForSelector('[data-field="species"]');
  const restored = await page.$$eval('#svc option', (els) => els.map((e) => e.textContent));
  if (!restored.includes('Removal')) fail('reset did not restore Removal');
  await shot(page, 'fielder-07-reset-default');

  if (banned.length) fail('live or mail host was contacted: ' + banned.join(' '));
  console.log('fielder e2e ok');
} catch (err) {
  const info = await page.evaluate(() => ({
    toast: (document.getElementById('toast') || {}).textContent || '',
    toastDisplay: document.getElementById('toast') ? document.getElementById('toast').style.display : '',
    sq: document.getElementById('sq') ? document.getElementById('sq').textContent : '',
    body: document.body.innerText.slice(0, 1800)
  })).catch((e) => ({ evalError: e.message }));
  let hits = [];
  try { hits = await (await fetch(base + '/__hits')).json(); } catch (e) { hits = [String(e)]; }
  console.error('DEBUG', JSON.stringify({ info, hits, banned }, null, 2));
  throw err;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
