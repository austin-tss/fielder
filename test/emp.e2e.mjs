import puppeteer from 'puppeteer-core';
import { start, outbox } from './mock-server.mjs';
const SHOTS = process.env.SHOTS || '';
function fail(m) { throw new Error(m); }
const server = await start(0);
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
page.on('dialog', (d) => d.accept());
const waitText = (t) => page.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 15000 }, t);
async function login(pin) {
  for (const d of pin) await page.evaluate((d) => [...document.querySelectorAll('.pin button')].find((b) => b.textContent === d).click(), d);
}
try {
  await page.goto(base + '/?api=' + encodeURIComponent(base + '/exec'), { waitUntil: 'networkidle0' });
  await waitText('Enter your PIN');
  await login('6789');
  await waitText('Employees');
  if (await page.$('#gear') && !(await page.$eval('#gear', (e) => e.hidden))) fail('admin should not see the settings gear');
  await page.click('#row-emp');
  await waitText('Ada Admin');
  if ((await page.evaluate(() => document.body.innerText)).includes('5511')) fail('codes must never be listed');
  await page.type('#enm', 'Pat Pruner');
  await page.type('#eem', 'pat@example.com');
  await page.select('#erl', 'Manager');
  await page.click('#eadd');
  await waitText('Code for Pat Pruner');
  const code = outbox[outbox.length - 1].code;
  if (!(await page.evaluate(() => document.getElementById('newcode').innerText)).includes(code)) fail('code not shown once');
  if (SHOTS) await page.screenshot({ path: SHOTS + '/employees_added.png' });
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Done').click());
  await waitText('Pat Pruner');
  if ((await page.evaluate(() => document.body.innerText)).includes(code)) fail('code should hide after Done');
  if (SHOTS) await page.screenshot({ path: SHOTS + '/employees_list.png', fullPage: true });
  await page.evaluate(() => logout());
  await login(code);
  await waitText('Estimator view');
  await page.evaluate(() => logout());
  await login('6789');
  await waitText('Employees');
  await page.click('#row-emp');
  await waitText('Pat Pruner');
  await page.evaluate(() => [...document.querySelectorAll('#emplist .job')].find((c) => c.innerText.includes('Pat Pruner')).querySelector('button').click());
  await waitText('Pat Pruner deleted');
  await page.evaluate(() => logout());
  await login(code);
  await waitText('Wrong PIN');
  console.log('fielder employees e2e ok');
} finally { await browser.close(); server.close(); }
