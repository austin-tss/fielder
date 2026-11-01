import puppeteer from 'puppeteer-core';
import { start, texts, outbox, setCaps, mockJobs } from './mock-server.mjs';
const server=await start(0);const base='http://127.0.0.1:'+server.address().port;const SH=process.env.SHOTS_DIR||'/workspace';
const browser=await puppeteer.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const clk=(p,s)=>p.$eval(s,e=>e.click());const fail=m=>{throw new Error(m)};const w=ms=>new Promise(r=>setTimeout(r,ms));
async function open(){const p=await browser.newPage();await p.evaluateOnNewDocument(()=>{localStorage.fdHome='forms';localStorage.fdAutoClock='off'});await p.setViewport({width:390,height:844,deviceScaleFactor:2});
 await p.goto(base+'/?api='+encodeURIComponent(base+'/exec'),{waitUntil:'networkidle0'});
 for(const d of '1234')await p.evaluate(d=>[...document.querySelectorAll('.pin button')].find(b=>b.textContent===d).click(),d);
 await p.waitForFunction(()=>document.body.innerText.includes('New customer quote'));return p}
try{
 // make FT-OLD stale (sent 5 days ago) and add a second outstanding quote
 const old=mockJobs.find(j=>j.id==='FT-OLD');old.status='sent';old.created=new Date(Date.now()-5*864e5).toISOString();old.phone='850-555-0199';
 mockJobs.push({id:'FT-Q2',name:'Second Pine',address:'22 Pine St, Tallahassee, FL',email:'pine@example.com',phone:'850-555-0122',items:[{title:'Trim',price:500}],total:500,status:'sent',created:new Date().toISOString(),crew:[],photos:[]});
 let p=await open();
 const cnt=await p.$eval('#oqcount',e=>e.textContent);if(!/^2 /.test(cnt))fail('outstanding count '+cnt);
 await clk(p,'#row-oq');await p.waitForSelector('.qcard');
 const badges=await p.$$eval('.qbadge',l=>l.map(e=>e.textContent));if(!badges.some(b=>/No reply 5 days/.test(b))||!badges.includes('Sent'))fail('badges '+badges);
 await p.screenshot({path:SH+'/fielder-outstanding.png',fullPage:true});
 const t0=texts.length,o0=outbox.length;
 await clk(p,'[data-q="FT-OLD"] [data-fu="text"]:not([data-disc])');await p.waitForFunction(()=>/Text follow-up sent/.test($('#toast').textContent));
 if(texts.length!==t0+1||texts.at(-1).to!=='TEST_PHONE'||texts.at(-1).from!=='+18506131820')fail('text routing');
 await p.waitForSelector('[data-q="FT-OLD"]');let b2=await p.$eval('[data-q="FT-OLD"] .qbadge',e=>e.textContent);if(b2!=='Followed up')fail('after fu '+b2);
 await clk(p,'[data-q="FT-OLD"] [data-fu="email"][data-disc]');await p.waitForFunction(()=>/Email follow-up sent with 10% off/.test($('#toast').textContent));
 const em=outbox.at(-1);if(outbox.length!==o0+1||em.to!=='austin@techsourcedsolutions.com'||!/10% off: \$1620\.00 \(was \$1800\.00\)/.test(em.body))fail('email routing/discount '+JSON.stringify(em));
 if(/howard\.com/.test(JSON.stringify(outbox)))fail('howard address used');
 // bulk status: approve FT-OLD (applies discount), decline FT-Q2
 await clk(p,'[data-sel="FT-OLD"]');await p.select('#qbst','approved');await clk(p,'#qbgo');await p.waitForFunction(()=>/1 quote marked Approved/.test($('#toast').textContent));
 if(old.status!=='approved'||old.total!==1620)fail('approve+discount '+old.status+' '+old.total);
 await clk(p,'[data-sel="FT-Q2"]');await p.select('#qbst','followup');await clk(p,'#qbgo');await w(400);if(mockJobs.find(j=>j.id==='FT-Q2').status!=='followup')fail('bulk followup');
 await p.evaluate(()=>openSentQuotes());await p.waitForSelector('.qcard');const sb=await p.$$eval('.qbadge',l=>l.map(e=>e.textContent));if(!sb.includes('Approved (A)'))fail('sent view '+sb);
 // settings discount
 await p.evaluate(()=>{openSet();openDisc()});await p.waitForSelector('#discpct');await p.$eval('#discpct',e=>e.value='15');await clk(p,'#discsave');await p.waitForFunction(()=>/Discount saved: 15%/.test($('#toast').textContent));
 await p.evaluate(()=>openOutstanding());await p.waitForSelector('.qcard');if(!(await p.evaluate(()=>/Text 15% off/.test(document.body.innerText))))fail('pct not used');
 await p.close();
 // old backend (no caps): follow-up buttons hidden, bulk only Approved/Declined
 setCaps([]);p=await open();await p.evaluate(()=>openOutstanding());await p.waitForSelector('.qcard');
 if(await p.$('[data-fu]'))fail('fu buttons shown without caps');const opts=await p.$$eval('#qbst option',l=>l.map(o=>o.value).join());if(opts!=='approved,declined')fail('opts '+opts);
 await p.close();console.log('quotes e2e ok');
}finally{await browser.close();server.close()}
