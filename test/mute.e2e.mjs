import puppeteer from 'puppeteer-core';
import { start, setVoice } from './mock-server.mjs';
const server = await start(0);const base='http://127.0.0.1:'+server.address().port;
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();await page.setViewport({width:390,height:844,deviceScaleFactor:2});
const fail=m=>{throw new Error(m)};
// Fake speech recognition we can drive from the test.
await page.evaluateOnNewDocument(()=>{window.FAKESR=[];window.SpeechRecognition=class{constructor(){FAKESR.push(this);this.live=false}start(){this.live=true}stop(){if(!this.live)return;this.live=false;setTimeout(()=>this.onend&&this.onend(),10)}abort(){this.stop()}
 say(t,fin=true){const r=[{transcript:t,confidence:.9}];r.isFinal=fin;const ev={resultIndex:0,results:[r]};this.onresult&&this.onresult(ev)}}});
try{
setVoice(true);
await page.goto(base+'/?api='+encodeURIComponent(base+'/exec'),{waitUntil:'networkidle0'});
for(const d of '1234')await page.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);
await page.waitForFunction(()=>document.body.innerText.includes('New customer quote'));
await page.evaluate(()=>newq());await page.waitForSelector('#aibtn:not([disabled])');
let sent=[];await page.exposeFunction('logSend',b=>sent.push(b));await page.evaluate(()=>{const o=aiSend;window.aiSend=b=>{logSend(b);return o(b)}});
await page.click('#aibtn');await page.waitForSelector('#vmute:not([hidden])');
if(!(await page.$eval('#vmute',b=>b.textContent)).includes('Listening - tap to mute'))fail('live label');
await page.evaluate(()=>FAKESR.at(-1).say('Customer Pat Keep.'));
await page.evaluate(()=>FAKESR.at(-1).say('half said interim',false));
const live=await page.screenshot({encoding:'binary'});
await page.click('#vmute');
const m=await page.evaluate(()=>{const r=FAKESR.at(-1);r.say('SECRET muted words');r.onresult&&r.say('MORE SECRET');return {t:$('#vmute').textContent,live:r.live,muted:VMUTED,stat:$('#aistat').textContent}});
if(!m.t.includes('Muted - tap to resume')||m.live||!m.muted)fail('mute state '+JSON.stringify(m));
if(/SECRET/.test(m.stat))fail('muted text shown');
await new Promise(r=>setTimeout(r,100));if(sent.length)fail('sent while muted');
const muted=await page.screenshot({encoding:'binary'});
await page.click('#vmute');
const n=await page.evaluate(()=>FAKESR.length);if(n<2)fail('no new recognizer on resume');
await page.evaluate(()=>FAKESR.at(-1).say('Removal 900 dollars.'));
await page.click('#aibtn');await page.waitForFunction(()=>!document.querySelector('#vmute')||document.querySelector('#vmute').hidden);
await new Promise(r=>setTimeout(r,300));
const txt=sent.map(b=>b.text).join('|');console.log(txt);
if(sent.length!==1||/SECRET|interim/.test(txt)||!/Keep/.test(txt)||!/Removal/.test(txt))fail('bad send '+txt);
// stop while muted: no hang, no muted words
await page.evaluate(()=>newq());await page.waitForSelector('#aibtn:not([disabled])');sent.length=0;
await page.click('#aibtn');await page.evaluate(()=>FAKESR.at(-1).say('Before.'));await page.click('#vmute');await page.evaluate(()=>FAKESR.at(-1).say('SECRET'));
await page.click('#aibtn');await new Promise(r=>setTimeout(r,300));
if(sent.length!==1||/SECRET/.test(sent[0].text))fail('stop while muted '+JSON.stringify(sent));
if(process.env.SHOT!=='0'){const fs=await import('fs');fs.writeFileSync('/tmp/mute_live.png',live);fs.writeFileSync('/tmp/mute_muted.png',muted)}
console.log('mute e2e OK');
}finally{await browser.close();server.close()}
