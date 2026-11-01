import puppeteer from 'puppeteer-core';
import { start, resetPunches } from './mock-server.mjs';
const server=await start(0);const base='http://127.0.0.1:'+server.address().port;const SH=process.env.SHOTS_DIR||'/workspace';
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const fail=m=>{throw new Error(m)};const w=ms=>new Promise(r=>setTimeout(r,ms));const OWNER='4321';// mock-only PIN
resetPunches();
async function open(pin){const p=await browser.newPage();await p.setViewport({width:390,height:844,deviceScaleFactor:2});
 await p.evaluateOnNewDocument(()=>{localStorage.fdHome='voice';window.FAKESR=[];window.SpeechRecognition=class{constructor(){FAKESR.push(this)}start(){this.live=true}stop(){if(!this.live)return;this.live=false;setTimeout(()=>this.onend&&this.onend(),10)}abort(){this.stop()}say(t){const r=[{transcript:t}];r.isFinal=true;this.onresult&&this.onresult({resultIndex:0,results:[r]})}}});
 p.on('dialog',d=>d.accept());p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.goto(base+'/?api='+encodeURIComponent(base+'/exec'),{waitUntil:'networkidle0'});
 for(const d of pin)await p.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);return p}
const say=async(p,t)=>{await p.evaluate(t=>{FDVH.listen();FAKESR.at(-1).say(t)},t);await w(400)};
const txt=p=>p.evaluate(()=>document.body.innerText);
try{
let p=await open(OWNER);await p.waitForSelector('#ow-now');if(!/Owner/.test(await p.$eval('#who',e=>e.textContent)))fail('label');
// add employee by voice -> form prefilled, set pay, save
await say(p,'add employee Jake Limb');await p.waitForSelector('#owsave');if(await p.$eval('#owname',e=>e.value)!=='Jake Limb')fail('prefill');
await p.$eval('#owpay',e=>e.value='20');await p.$eval('#owpin',e=>e.value='4466');await p.click('#owsave');await p.waitForFunction(()=>/Jake Limb/.test(document.body.innerText)&&/\$20\.00\/hr/.test(document.body.innerText));
if(!/4466/.test(await txt(p)))fail('pin not shown to owner');
// earlier shift today (3 h) + clock in by voice
await p.evaluate(()=>{const d=new Date();d.setHours(0,0,0,0);const s=Math.max(d.getTime(),Date.now()-5*36e5);return api({a:'clockFix',who:'Jake Limb',in:new Date(s).toISOString(),out:new Date(s+3*36e5>Date.now()-6e4?Date.now()-6e4:s+3*36e5).toISOString()})});
await p.evaluate(()=>ownerHome());await p.waitForSelector('#ow-now');
await say(p,'clock in Jake');await p.waitForFunction(()=>/On the clock now \(1\)/.test(document.body.innerText)&&/Jake Limb/.test(document.querySelector('#ow-now').innerText),{timeout:5000});
await say(p,"who's on the clock");if(!/1 on the clock: Jake Limb/.test(await txt(p)))fail('who');
await p.evaluate(()=>window.scrollTo(0,0));await w(300);await p.screenshot({path:SH+'/fielder-owner.png'});
await say(p,'labor cost today');await p.waitForSelector('#labtot');const L=await p.evaluate(()=>[$('#labtot').textContent,document.querySelector('#labout').innerText]);
console.log(JSON.stringify(L[0]));if(!/\$\d/.test(L[0])||!/Jake Limb/.test(L[1])||!/× \$20\.00/.test(L[1]))fail('labor '+L[1]);
await p.screenshot({path:SH+'/fielder-owner-labor.png'});
await say(p,'labor cost this week');await p.waitForFunction(()=>/This week/.test(document.body.innerText));
await say(p,'clock out Jake');await w(300);await p.evaluate(()=>ownerHome());await p.waitForFunction(()=>/On the clock now \(0\)/.test(document.body.innerText),{timeout:5000});
// owner clock in via button
await p.waitForFunction(()=>[...$('#ow-who').options].some(o=>o.value==='Jake Limb'));await p.select('#ow-who','Jake Limb');await p.click('#ow-in');await p.waitForFunction(()=>/On the clock now \(1\)/.test(document.body.innerText),{timeout:5000});
// view as
await say(p,'view as crew');if(await p.evaluate(()=>role)!=='Crew')fail('view as crew');if(!(await p.$('#owbar:not([hidden])')))fail('no back bar');
await say(p,'view as estimator');if(await p.evaluate(()=>role)!=='Manager')fail('view as est');
await say(p,'quotes needed');if(!/Quotes Needed/i.test(await txt(p)))fail('owner as estimator voice');
await p.click('#owbar');await p.waitForSelector('#ow-now');
await say(p,'view as admin');await say(p,'show invoices');if(!/Invoices/.test(await txt(p)))fail('admin view');await p.click('#owbar');await p.waitForSelector('#ow-now');
await say(p,'set jake pay to 25');await w(300);await p.evaluate(()=>ownerTeam());await p.waitForFunction(()=>/\$25\.00\/hr/.test(document.body.innerText));
await say(p,'crew hours');await p.waitForFunction(()=>/hours/i.test(document.body.innerText)&&view==='hours');
await p.close();
// Admin: no pins/pay, no owner page; new Jake PIN logs in as Crew
p=await open('6789');await p.waitForSelector('#vhmic');const el=await p.evaluate(()=>api({a:'empList'}));if(el.employees.some(u=>u.pin||u.payRate!=null))fail('admin sees pins');
if(await p.$('#ow-now'))fail('admin got owner page');const lb=await p.evaluate(()=>api({a:'labor'}).then(()=>'ok',e=>e.message));if(!/Only the Owner/.test(lb))fail('admin labor');await p.close();
p=await open('4466');await p.waitForSelector('#vhmic');if(await p.evaluate(()=>role)!=='Crew')fail('jake role');await p.close();
console.log('owner e2e OK');
}finally{await browser.close();server.close()}
