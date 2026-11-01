import puppeteer from 'puppeteer-core';
import { start, setVoice } from './mock-server.mjs';
const server=await start(0);const base='http://127.0.0.1:'+server.address().port;
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const fail=m=>{throw new Error(m)};const SH=process.env.SHOTS_DIR||'/workspace';const w=ms=>new Promise(r=>setTimeout(r,ms));
async function open(pin,shot){const page=await browser.newPage();await page.evaluateOnNewDocument(()=>{localStorage.fdAutoClock='off'});await page.setViewport({width:390,height:844,deviceScaleFactor:2});
 await page.evaluateOnNewDocument(()=>{if(!sessionStorage.vhinit){sessionStorage.vhinit=1;localStorage.fdHome='voice'}window.FAKESR=[];window.SpeechRecognition=class{constructor(){FAKESR.push(this)}start(){this.live=true}stop(){if(!this.live)return;this.live=false;setTimeout(()=>this.onend&&this.onend(),10)}abort(){this.stop()}
  say(t){const r=[{transcript:t,confidence:.9}];r.isFinal=true;this.onresult&&this.onresult({resultIndex:0,results:[r]})}}});
 page.on('dialog',d=>{page._dlg=(page._dlg||[]).concat(d.message());d.accept()});
 await page.goto(base+'/?api='+encodeURIComponent(base+'/exec'),{waitUntil:'networkidle0'});
 for(const d of pin)await page.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);
 await page.waitForSelector('#vhmic');if(shot)await page.screenshot({path:SH+'/'+shot});return page}
async function cmd(page,t,sel){await page.evaluate(t=>{FDVH.listen();FAKESR.at(-1).say(t)},t);await w(150);if(sel)await page.waitForSelector(sel,{timeout:5000})}
const txt=p=>p.evaluate(()=>document.body.innerText);
try{setVoice(true);
// Estimator
let p=await open('1234','fielder-voicehome.png');
if(await p.$('#vhfab:not([hidden])'))fail('fab on voice home');
await cmd(p,'quotes needed');if(!/Quotes Needed|quote request/i.test(await txt(p)))fail('qn');
if(!(await p.$('#vhfab:not([hidden])')))fail('no fab on page');
await p.screenshot({path:SH+'/fielder-voice-fab.png'});
await cmd(p,'go home','#vhmic');
await cmd(p,'new quote for john smith','#nm');if(await p.$eval('#nm',e=>e.value)!=='John Smith')fail('nm');
await p.evaluate(()=>{DIRTY=false});await cmd(p,'go home','#vhmic');
await cmd(p,'new quote','#aibtn');await w(100);const live=await p.evaluate(()=>FAKESR.length>=3&&FAKESR.at(-1).live);if(!live)fail('voice quote not started');
await p.evaluate(()=>{FAKESR.at(-1).abort();DIRTY=false});await w(100);await cmd(p,'go home','#vhmic');
await cmd(p,'schedule');await cmd(p,'go home','#vhmic');await cmd(p,'open settings');if(!/Settings/.test(await txt(p)))fail('settings');
await cmd(p,'go home','#vhmic');await p.click('#vhforms');await p.waitForFunction(()=>document.body.innerText.includes('New customer quote'));
await w(400);if(await p.$('#vhback'))fail('switch bar still shown');if(!(await p.$eval('#vhfab',e=>!e.hidden).catch(()=>false)))fail('no corner mic');await p.screenshot({path:SH+'/fielder-voicehome-forms.png'});
if(await p.evaluate(()=>localStorage.fdHome)!=='forms')fail('choice not remembered');await p.close();
// Crew
p=await open('0123','fielder-voicehome-crew.png');await cmd(p,'show my jobs');if(!/Your jobs|Clock/i.test(await txt(p)))fail('crew jobs');await p.close();
// Admin
p=await open('6789','fielder-voicehome-admin.png');await cmd(p,'show invoices');if(!/Invoices/.test(await txt(p)))fail('inv');
await cmd(p,'employees');if(!/Add employee/.test(await txt(p)))fail('emp');
await cmd(p,'go home','#vhmic');await cmd(p,'mark invoice paid');if(!/Open an invoice first/.test(await txt(p)))fail('guard');
console.log('vhome ok');
}finally{await browser.close();server.close()}
// Schedule voice
{const b2=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const s2=await start(0);const base2='http://127.0.0.1:'+s2.address().port;
try{const p=await b2.newPage();await p.setViewport({width:390,height:844,deviceScaleFactor:2});
 await p.evaluateOnNewDocument(()=>{localStorage.fdHome='voice';window.FAKESR=[];window.SpeechRecognition=class{constructor(){FAKESR.push(this)}start(){this.live=true}stop(){if(!this.live)return;this.live=false;setTimeout(()=>this.onend&&this.onend(),10)}abort(){this.stop()}say(t){const r=[{transcript:t}];r.isFinal=true;this.onresult&&this.onresult({resultIndex:0,results:[r]})}}});
 await p.goto(base2+'/?api='+encodeURIComponent(base2+'/exec'),{waitUntil:'networkidle0'});
 for(const d of '1234')await p.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);await p.waitForSelector('#vhmic');
 await cmd(p,'schedule','#vhstrip');if(!(await p.$('#vhfab:not([hidden])')))fail('no fab on schedule');
 const t0=await p.evaluate(()=>document.querySelector('#app h2[style]').textContent);await cmd(p,'next week');const t1=await p.evaluate(()=>document.querySelector('#app h2[style]').textContent);if(t0===t1)fail('next week');
 await cmd(p,'today');if(await p.evaluate(()=>document.querySelector('#app h2[style]').textContent)!==t0)fail('today');
 await p.screenshot({path:SH+'/fielder-voice-schedule.png'});
 const jn=await p.evaluate(()=>{const j=jobs.find(x=>x.status=='approved')||jobs[0];return j.name});
 await cmd(p,'schedule '+jn+' for tuesday','#bsv');const sel=await p.evaluate(()=>[$('#bj').value,$('#bd').value,new Date($('#bd').value+'T12:00').getDay()]);if(!sel[0]||sel[2]!==2)fail('sched job '+sel);
 if(!(await p.$('#vhstrip')))fail('no strip on blk');await cmd(p,'cancel','#vhstrip');
 await cmd(p,'open tomorrow','#dayon');await cmd(p,'go home','#vhmic');console.log('schedule voice ok')}finally{await b2.close();s2.close()}}
