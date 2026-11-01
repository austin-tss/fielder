import puppeteer from 'puppeteer-core';
import { start, setVoice, lastVQ } from './mock-server.mjs';
const server=await start(0);const base='http://127.0.0.1:'+server.address().port;const SH=process.env.SHOTS_DIR||'/workspace';
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const fail=m=>{throw new Error(m)};const w=ms=>new Promise(r=>setTimeout(r,ms));
let revHits=0;
async function open(grant){const ctx=await browser.createBrowserContext();if(grant)await ctx.overridePermissions(base,['geolocation']);const page=await ctx.newPage();await page.setViewport({width:390,height:844,deviceScaleFactor:2});
 await page.setRequestInterception(true);page.on('request',r=>{const u=r.url();if(u.includes('photon.komoot.io/reverse')){revHits++;return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({features:[{properties:{housenumber:'3660',street:'Barbary Drive',city:'Tallahassee',state:'Florida',postcode:'32309',countrycode:'US'}}]})})}
  if(/photon|nominatim|googleapis/.test(u))return r.respond({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:'{"features":[]}'});r.continue()});
 await page.setGeolocation({latitude:30.5,longitude:-84.22,accuracy:10});
 await page.evaluateOnNewDocument(()=>{window.FAKESR=[];window.SpeechRecognition=class{constructor(){FAKESR.push(this)}start(){this.live=true}stop(){if(!this.live)return;this.live=false;setTimeout(()=>this.onend&&this.onend(),10)}abort(){this.stop()}say(t){const r=[{transcript:t}];r.isFinal=true;this.onresult&&this.onresult({resultIndex:0,results:[r]})}}});
 await page.goto(base+'/?api='+encodeURIComponent(base+'/exec'),{waitUntil:'networkidle0'});
 for(const d of '1234')await page.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);
 await page.waitForFunction(()=>document.body.innerText.includes('New customer quote'));return [ctx,page]}
try{
// granted: auto-fill on new quote, button works
let [c,p]=await open(true);await p.evaluate(()=>newq());await p.waitForSelector('#gpsbtn');
await p.waitForFunction(()=>$('#ad').value.includes('3660 Barbary'),{timeout:6000});
const v=await p.evaluate(()=>[$('#ad').value,$('#gpsnote').textContent,($('#ad-lc')||{}).textContent||'']);console.log(JSON.stringify(v));
if(!/Tallahassee, FL 32309/.test(v[0])||!/From GPS/.test(v[2]))fail('fill');
await p.evaluate(()=>{$('#ad').value=''});await p.click('#gpsbtn');await p.waitForFunction(()=>$('#ad').value.includes('Barbary'));
await p.evaluate(()=>document.getElementById('ad').scrollIntoView({block:'center'}));await p.screenshot({path:SH+'/fielder-gps.png'});
// voice: "I'm here"
await p.evaluate(()=>{$('#ad').value='';localStorage.fdHome='voice'});await p.evaluate(()=>{FDVH.listen();FAKESR.at(-1).say("I'm here")});await p.waitForFunction(()=>$('#ad').value.includes('Barbary'),{timeout:6000});
// AI + GPS: spoken address wins over GPS; no spoken address -> GPS; Gemini gets [GPS] context
setVoice(true);
const ai=async(txt)=>{await p.evaluate(()=>{SET.voice=true;DIRTY=false;newq()});await p.waitForSelector('#aibtn');await p.waitForFunction(()=>$('#ad').value.includes('Barbary'),{timeout:6000});
 await p.evaluate(t=>{$('#qt')&&($('#qt').value='');aiStart();FAKESR.at(-1).say(t);$('#aibtn').click()},txt);await p.waitForFunction(()=>/Filled in/.test($('#aistat').textContent),{timeout:9000}).catch(async e=>{console.log('STAT',await p.evaluate(()=>$('#aistat').textContent+'|'+(window.FAKESR||[]).length));throw e});return p.evaluate(()=>$('#ad').value)};
let a1=await ai('Pat Voice at 12 Live Oak Lane removal 1800');if(!/Live Oak/.test(a1))fail('spoken addr should win '+a1);
if(!/\[GPS\].*Barbary.*Tallahassee.*32309/.test(lastVQ()))fail('no gps context '+lastVQ());
let a2=await ai('NOADDR Pat Voice removal 1800');if(!/Barbary/.test(a2))fail('gps addr expected '+a2);console.log('ai+gps ok');
await c.close();
// denied: friendly message, no fill
[c,p]=await open(false);await p.evaluate(()=>newq());await p.waitForSelector('#gpsbtn');await w(500);if(await p.evaluate(()=>$('#ad').value))fail('auto-filled without permission');
await p.evaluate(()=>{navigator.geolocation.getCurrentPosition=(ok,no)=>no({code:1})});await p.click('#gpsbtn');await w(300);
const msg=await p.evaluate(()=>$('#gpsnote').textContent);if(!/blocked/.test(msg))fail('deny msg '+msg);
await p.evaluate(()=>{navigator.geolocation.getCurrentPosition=(ok,no)=>no({code:3})});await p.click('#gpsbtn');await w(300);if(!/too long/.test(await p.evaluate(()=>$('#gpsnote').textContent)))fail('timeout msg');
setVoice(true);await p.evaluate(()=>{SET.voice=true;$('#ad').value='';DIRTY=false;newq()});await p.waitForSelector('#aibtn');
await p.evaluate(()=>{navigator.geolocation.getCurrentPosition=(ok,no)=>no({code:1});aiStart();FAKESR.at(-1).say('NOADDR Pat removal 900');$('#aibtn').click()});
await p.waitForFunction(()=>/Filled in/.test($('#aistat').textContent),{timeout:9000});if(await p.evaluate(()=>$('#ad').value))fail('denied should leave address blank');if(/\[GPS\]/.test(lastVQ()))fail('gps ctx when denied');
await c.close();console.log('gps ok',revHits);
}finally{await browser.close();server.close()}
