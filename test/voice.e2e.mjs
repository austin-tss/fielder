import puppeteer from 'puppeteer-core';
import { start, setVoice } from './mock-server.mjs';
const server = await start(0);const base='http://127.0.0.1:'+server.address().port;
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage();await page.setViewport({width:390,height:844,deviceScaleFactor:2});
const fail=m=>{throw new Error(m)};
await page.evaluateOnNewDocument(()=>{window.FAKESR=[];window.SpeechRecognition=class{constructor(){FAKESR.push(this);this.live=false}start(){this.live=true}stop(){if(!this.live)return;this.live=false;setTimeout(()=>this.onend&&this.onend(),10)}abort(){this.stop()}
 timeout(){this.live=false;this.onend&&this.onend()}
 say(t,fin=true){const r=[{transcript:t,confidence:.9}];r.isFinal=fin;const ev={resultIndex:0,results:[r]};this.onresult&&this.onresult(ev)}}});
try{
setVoice(true);
await page.goto(base+'/?api='+encodeURIComponent(base+'/exec'),{waitUntil:'networkidle0'});
for(const d of '1234')await page.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);
await page.waitForFunction(()=>document.body.innerText.includes('New customer quote'));
await page.evaluate(()=>newq());await page.waitForSelector('#aibtn:not([disabled])');
let sent=[];await page.exposeFunction('logSend',b=>sent.push(b));await page.evaluate(()=>{const o=window.api;window.api=b=>{if(b.a==='voiceQuote')logSend(b);return o(b)}});
await page.click('#aibtn');
await page.evaluate(()=>FAKESR.at(-1).say("Customer name Lewis Johnson... oh wait, actually it's Johnny Walker."));
// recognizer times out mid-speech: must auto-restart, not send
await page.evaluate(()=>FAKESR.at(-1).timeout());await new Promise(r=>setTimeout(r,100));
if(sent.length)fail('sent on timeout');const n=await page.evaluate(()=>FAKESR.length);if(n<2)fail('no auto-restart');
await page.evaluate(()=>FAKESR.at(-1).say('Phone 850 555 0101, scratch that, 850 555 0199.'));
await page.evaluate(()=>FAKESR.at(-1).say('Live oak removal eighteen hundred dollars, no wait, make that 2000.'));
await page.click('#aibtn');
await page.waitForFunction(()=>/Filled in/.test(document.querySelector('#aistat').textContent),{timeout:8000});
const r=await page.evaluate(()=>({nm:$('#nm').value,ph:$('#ph').value,nmNote:($('#nm-lc')||{}).textContent||'',phNote:($('#ph-lc')||{}).textContent||'',prices:IT.map(i=>i.price),stat:$('#aistat').textContent}));
console.log(JSON.stringify(r),sent[0]&&sent[0].text);
if(!sent[0].text.startsWith('If the speaker corrects themselves, use only the corrected value.'))fail('no AI note');
if(/Lewis|0101|1800/.test(sent[0].text))fail('uncorrected text sent');
if(r.nm!=='Johnny Walker'||!/Corrected from Lewis Johnson/.test(r.nmNote))fail('name');
if(r.ph!=='850 555 0199'||!/Corrected from 850 555 0101/.test(r.phNote))fail('phone');
if(r.prices[0]!==2000||!/Price corrected from \$1800 to \$2000/.test(r.stat))fail('price');
await page.screenshot({path:'/tmp/voice_fix.png'});
// single-field mic: correction replaces
const has=await page.evaluate(()=>!!document.querySelector('.cmic'));console.log('field mics',has);
// Retry on failure: saved transcript, no re-speaking
await page.evaluate(()=>{DIRTY=false;newq()});await page.waitForSelector('#aibtn:not([disabled])');
await page.evaluate(()=>{const o=window.api;let k=0;window.api=b=>{if(b.a==='voiceQuote'&&!k++)return Promise.reject(new Error('Network error'));return o(b)}});
await page.evaluate(()=>$('#aibtn').click());await page.evaluate(()=>FAKESR.at(-1).say('Customer Ann Lee, oak trim 500 dollars.'));await page.evaluate(()=>$('#aibtn').click());
await page.waitForSelector('#airetry');if(!(await page.evaluate(()=>localStorage.fdLastTx||'')).includes('Ann Lee'))fail('not saved');
await page.click('#airetry');await page.waitForFunction(()=>/Filled in/.test(document.querySelector('#aistat').textContent),{timeout:8000});
if(await page.evaluate(()=>localStorage.fdLastTx))fail('saved not cleared');
console.log('voice e2e OK');
}finally{await browser.close();server.close()}
