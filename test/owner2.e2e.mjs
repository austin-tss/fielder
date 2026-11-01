// Owner parity: stray name never creates a punch, Owner opens/saves quote-form Settings, crew auto clock-in at sign-in.
import puppeteer from 'puppeteer-core';
import { start, resetPunches } from './mock-server.mjs';
const server=await start(0);const base='http://127.0.0.1:'+server.address().port;
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const fail=m=>{throw new Error(m)};const w=ms=>new Promise(r=>setTimeout(r,ms));const OWNER='4321';// mock-only PIN
resetPunches();
async function open(pin,pre){const p=await browser.newPage();await p.setViewport({width:390,height:844});
 await p.evaluateOnNewDocument(pre=>{localStorage.fdHome='voice';if(pre)localStorage.fdClockName=JSON.stringify(pre);window.FAKESR=[];window.SpeechRecognition=class{constructor(){FAKESR.push(this)}start(){this.live=true}stop(){if(!this.live)return;this.live=false;setTimeout(()=>this.onend&&this.onend())}abort(){this.stop()}say(t){this.onresult&&this.onresult({resultIndex:0,results:[Object.assign([{transcript:t,confidence:.9}],{isFinal:true})]});this.stop()}};window.webkitSpeechRecognition=window.SpeechRecognition},pre||'');
 p.on('dialog',d=>d.accept());p.on('pageerror',e=>console.log('PAGEERR',e.message));
 await p.goto(base+'/?api='+encodeURIComponent(base+'/exec'),{waitUntil:'networkidle0'});
 for(const d of pin)await p.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);return p}
try{
let p=await open(OWNER);await p.waitForSelector('#ow-now');
await p.evaluate(()=>{FDVH.listen();FAKESR.at(-1).say('clock in Zebulon Nobody')});await w(800);
const n=await p.evaluate(()=>api({a:'clockList'}).then(r=>(r.now||[]).length));if(n!==0)fail('stray name punched '+n);
if(await p.$eval('#gear',e=>e.hidden))fail('owner gear hidden');
await p.evaluate(()=>openSet());await w(300);if(await p.evaluate(()=>view)!=='set')fail('owner settings');
const r=await p.evaluate(()=>api({a:'settings',form:formCfg()}).then(x=>!!x.ok,e=>e.message));if(r!==true)fail('owner settings save '+r);
await p.close();
p=await open('0123','Casey Crew');await p.waitForFunction(()=>document.getElementById('autoclk')&&/clocked in/.test(autoclk.textContent),{timeout:8000});
await w(1200);const n2=await p.evaluate(P=>{sessionStorage.fdPin=P;return api({a:'clockList'}).then(r=>(r.now||[]).filter(x=>x.who==='Casey Crew').length)},OWNER);if(n2!==1)fail('auto clock '+n2);
console.log('owner2 ok');
}finally{await browser.close();server.close()}
