import puppeteer from 'puppeteer-core';
import { start, addJob, customers, outbox, texts } from './mock-server.mjs';
const SHOTS = process.env.SHOTS || '';
function fail(m) { throw new Error(m); }
addJob({ id: 'X1', est: 'FT-EST-2026-0901', name: 'Existing Ed', address: '9 Pine St, Tallahassee, FL 32312', email: 'ed@example.com', phone: '(850) 555-0101', status: 'sent', created: '2026-10-20T12:00:00Z', items: [], total: 0, crew: [], photos: [] });
const server = await start(0);
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
const waitText = (t) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 15000 }, t);
async function login(pin) { for (const d of pin) await page.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d); }
const CSV = '\uFEFFFirst Name,Last Name,E-mail,Mobile Phone,Street,City,State,Zip\r\n'
  + 'Ann,Oak,ann@example.com,850-555-0001,"12 Elm St, Apt 2",Tallahassee,FL,32301\r\n'
  + '"Bob ""Bo""",Pine,,850-555-0002,3 Ash Rd,Tallahassee,FL,32303\r\n'
  + ',,nobody@example.com,,,,,\r\n'
  + 'Ed,Dup,ED@example.com,,1 X St,Tallahassee,FL,32301\r\n'
  + 'Ann,Twin,ann@example.com,,,,,\r\n'
  + 'Cal,Cedar,cal@example.com,(850) 555-0101,,,,\r\n';
try {
  // Parser unit checks in the page.
  await page.goto(base + '/?api=' + encodeURIComponent(base + '/exec'), { waitUntil: 'networkidle0' });
  const p = await page.evaluate(() => csvParse('\uFEFFa,b\r\n"x, y","he said ""hi"""\n\r\n1,\n'));
  if (JSON.stringify(p) !== JSON.stringify([['a', 'b'], ['x, y', 'he said "hi"'], ['1', '']])) fail('parse ' + JSON.stringify(p));
  await login('1234');
  await page.waitForFunction(() => typeof jobs !== 'undefined' && jobs.some((j) => j.id === 'X1'), { timeout: 15000 });
  await page.evaluate(() => openSet());
  await page.click('#row-imp');
  await waitText('Choose CSV file');
  if (SHOTS) await page.screenshot({ path: SHOTS + '/csv_step1.png' });
  const inp = await page.$('#csvf');
  const fs = await import('node:fs'); const tmp = '/tmp/fd_import_test.csv'; fs.writeFileSync(tmp, CSV);
  await inp.uploadFile(tmp);
  await waitText('Match the columns');
  const m = await page.evaluate(() => Object.fromEntries(['name', 'first', 'last', 'email', 'phone', 'street', 'city', 'state', 'zip'].map((k) => [k, document.getElementById('map-' + k).value])));
  if (m.name !== '' || m.first !== '0' || m.last !== '1' || m.email !== '2' || m.phone !== '3' || m.street !== '4' || m.zip !== '7') fail('guess ' + JSON.stringify(m));
  if (SHOTS) await page.screenshot({ path: SHOTS + '/csv_step2.png' });
  await page.click('#csvnext');
  await waitText('Check before importing');
  const cnt = await page.evaluate(() => [...['c-total', 'c-ok', 'c-skip']].map((i) => document.getElementById(i).textContent).join('/'));
  if (cnt !== '6/2/4') fail('counts ' + cnt);
  const why = await page.$eval('#c-why', (e) => e.innerText);
  for (const w of ['Missing name', 'Duplicate email', 'Duplicate phone']) if (!why.includes(w)) fail('reason missing ' + w);
  if (SHOTS) await page.screenshot({ path: SHOTS + '/csv_step3.png' });
  await page.click('#csvgo');
  await waitText('Import done');
  if ((await page.$eval('#d-ok', (e) => e.textContent)) !== '2') fail('done count');
  if (customers.length !== 2 || customers[0].address !== '12 Elm St, Apt 2, Tallahassee, FL 32301' || customers[1].name !== 'Bob "Bo" Pine') fail('stored ' + JSON.stringify(customers));
  if (SHOTS) await page.screenshot({ path: SHOTS + '/csv_done.png' });
  // Customer page -> New quote for customer, prefilled.
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'See customers').click());
  await waitText('Customers (');
  await page.evaluate(() => [...document.querySelectorAll('#cl .job')].find((c) => c.innerText.includes('Ann Oak')).click());
  await page.waitForSelector('#nqc');
  if (SHOTS) await page.screenshot({ path: SHOTS + '/cust_page.png' });
  await page.click('#nqc');
  await page.waitForSelector('#nm');
  const f = await page.evaluate(() => ({ nm: $('#nm').value, em: $('#em').value, ph: $('#ph') && $('#ph').value, ad: $('#ad').value, edit: editId }));
  if (f.nm !== 'Ann Oak' || f.em !== 'ann@example.com' || f.ph !== '850-555-0001' || !f.ad.startsWith('12 Elm St') || f.edit) fail('prefill ' + JSON.stringify(f));
  if (SHOTS) await page.screenshot({ path: SHOTS + '/cust_newquote.png' });
  // From a job detail page too.
  await page.evaluate(() => mview('X1'));
  await page.click('#nqc');
  await page.waitForSelector('#nm');
  const g = await page.evaluate(() => ({ nm: $('#nm').value, em: $('#em').value, edit: editId }));
  if (g.nm !== 'Existing Ed' || g.em !== 'ed@example.com' || g.edit) fail('job prefill ' + JSON.stringify(g));
  // Crew cannot import.
  const r = await page.evaluate(() => api({ a: 'importCustomers', pin: '0123', rows: [{ name: 'Z' }] }).then(() => 'ok', (e) => e.message));
  if (r === 'ok') fail('crew imported');
  if (outbox.length || texts.length) fail('sent something');
  console.log('csv import e2e: PASS');
} finally { await browser.close(); server.close(); }
