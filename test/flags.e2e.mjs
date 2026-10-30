import puppeteer from 'puppeteer-core';
import { start } from './mock-server.mjs';
const server = await start(0);const base='http://127.0.0.1:'+server.address().port;
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();await page.setViewport({width:390,height:844,deviceScaleFactor:2});
const fail=m=>{throw new Error(m)};
try{
await page.goto(base+'/?api='+encodeURIComponent(base+'/exec'),{waitUntil:'networkidle0'});
for(const d of '1234')await page.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);
await page.waitForFunction(()=>document.body.innerText.includes('New customer quote'));
await page.evaluate(()=>newq());await page.waitForSelector('#ad');
const res={customer:{name:'Jon Smyth',phone:'850 555 12',email:'jon@example.com',address:'3660 Barbie Drive, Tallahassee, FL 32309'},uncertain:['name'],estimate:{items:[{service:'Removal',description:'Oak',price:900}]}};
await page.evaluate(r=>{aiFill(r);FDFlags.applyFlags(r,0.6)},res);
await page.waitForFunction(()=>/Barbary/.test($('#ad').value),{timeout:20000});
const v=await page.evaluate(()=>({ad:$('#ad').value,n:[...document.querySelectorAll('.lcn')].map(x=>x.id+':'+x.textContent)}));
console.log(JSON.stringify(v));
if(v.ad!=='3660 Barbary Drive, Tallahassee, FL 32309')fail('bad fix '+v.ad);
if(!v.n.some(x=>x.includes('Corrected from Barbie Drive'))||!v.n.some(x=>x.startsWith('ph-'))||!v.n.some(x=>x.startsWith('nm-')))fail('flags missing');
await page.evaluate(()=>window.scrollTo(0,$('#nm').getBoundingClientRect().top+scrollY-120));
await page.screenshot({path:process.env.SHOT||'/workspace/fielder-flags.png'});
await page.click('#ad-lc button');if(await page.$eval('#ad',e=>e.value)!=='3660 Barbie Drive, Tallahassee, FL 32309')fail('undo');
await page.click('#nm-lc button.ok');if(await page.$('#nm-lc'))fail('confirm');
// correct address passes
const ok=await page.evaluate(()=>FDFlags.checkAddress('3660 Barbary Dr, Tallahassee, FL'));if(!ok.ok)fail('valid flagged '+JSON.stringify(ok));
console.log('flags e2e OK');
}finally{await browser.close();server.close()}
