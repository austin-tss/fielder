// Fielder voice-first home: big pulsating mic after sign-in (every role), a voice button on every page,
// spoken commands routed to existing functions. Buttons/forms stay as the fallback, unchanged.
(function(){
const MIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
const css=document.createElement('style');css.textContent=`
.vh{text-align:center;padding:12px 0 4px}.vh h2{font-size:26px;margin:6px 0 2px;color:#112337}.vh .sub{font-size:17px;color:#475569;margin:0 0 6px}
.vhw{position:relative;width:230px;height:230px;margin:18px auto 10px;display:grid;place-items:center}
.vhw .p{position:absolute;inset:25px;border-radius:50%;background:rgba(120,162,47,.35);animation:vhp 2s ease-out infinite}.vhw .p2{animation-delay:1s}
@keyframes vhp{0%{transform:scale(.85);opacity:.9}100%{transform:scale(1.35);opacity:0}}
#vhmic{position:relative;width:180px;height:180px;border-radius:50%;border:6px solid #fff;background:radial-gradient(circle at 35% 30%,#94c14a,#78a22f 60%,#5c7f20);color:#fff;box-shadow:0 10px 30px rgba(17,35,55,.35),0 0 0 3px #112337;cursor:pointer;display:grid;place-items:center;animation:vhb 2s ease-in-out infinite}
#vhmic svg{width:84px;height:84px}#vhmic:active{transform:scale(.95)}
@keyframes vhb{50%{transform:scale(1.05)}}
.vh.on #vhmic{background:radial-gradient(circle at 35% 30%,#2d4a6b,#112337);animation-duration:.8s}.vh.on .p{background:rgba(17,35,55,.3);animation-duration:1s}
#vhst{font-size:20px;font-weight:700;color:#112337;min-height:28px;margin:4px 0}#vhheard{font-size:16px;color:#475569;min-height:22px;font-style:italic}
.vhcmd{background:#f1f5ea;border-radius:14px;padding:10px 14px;text-align:left;font-size:16px;margin:12px 0;color:#112337}.vhcmd b{display:block;margin-bottom:4px}.vhcmd li{margin:3px 0}
.vhalt{background:none;border:0;color:#112337;text-decoration:underline;font-size:16px;padding:12px;cursor:pointer;margin:6px auto 0;display:block}
#vhfab{position:fixed;left:max(14px,env(safe-area-inset-left));bottom:max(14px,env(safe-area-inset-bottom));z-index:59;width:56px;height:56px;border-radius:50%;border:3px solid #fff;background:#78a22f;color:#fff;box-shadow:0 4px 14px rgba(17,35,55,.35);display:grid;place-items:center;padding:0;cursor:pointer}
body.vhf{padding-bottom:84px}#vhfab[hidden]{display:none}#vhfab svg{width:28px;height:28px}#vhfab.on{background:#112337;animation:vhb .8s ease-in-out infinite}
.vhs{display:flex;align-items:center;gap:12px;background:#f1f5ea;border:2px solid #78a22f;border-radius:16px;padding:10px 12px;margin:0 0 12px;cursor:pointer;width:100%;text-align:left;font:inherit;color:#112337}.vhs .m{flex:none;width:56px;height:56px;border-radius:50%;background:#78a22f;color:#fff;display:grid;place-items:center;animation:vhb 2s ease-in-out infinite}.vhs .m svg{width:30px;height:30px}.vhs b{display:block;font-size:18px}.vhs small{font-size:14px;color:#475569}.vhs.on .m{background:#112337;animation-duration:.8s}
#vhtip{position:fixed;left:80px;right:80px;bottom:max(20px,env(safe-area-inset-bottom));z-index:59;background:#112337;color:#fff;border-radius:12px;padding:10px 12px;font-size:15px;text-align:center}
@media (prefers-reduced-motion:reduce){.vhw .p,#vhmic,#vhfab.on{animation:none}}`;document.head.appendChild(css);
const mode=()=>'forms'; // No centered mic anywhere: home always opens to buttons; voice = corner mic only.
const setMode=m=>{try{localStorage.fdHome=m}catch(e){}};
let INVID=null,LISTEN=null,CTX='',CTXARG=null;const ctx=()=>document.getElementById('vhstrip')?CTX:'';
const DOW=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'],MON=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
function when(t){const d=new Date();d.setHours(0,0,0,0);let m;if(/\btoday\b/.test(t))return d;if(/\btomorrow\b/.test(t)){d.setDate(d.getDate()+1);return d}
 if((m=t.match(/\b(next )?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/))){let k=(DOW.indexOf(m[2])-d.getDay()+7)%7||7;if(m[1]&&k<7)k+=7;d.setDate(d.getDate()+k);return d}
 if((m=t.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (\d{1,2})(?:st|nd|rd|th)?\b/))){const x=new Date(d.getFullYear(),MON.indexOf(m[1]),+m[2]);if(x<d)x.setFullYear(x.getFullYear()+1);return x}
 if((m=t.match(/\bthe (\d{1,2})(?:st|nd|rd|th)?\b/))){const x=new Date(d.getFullYear(),d.getMonth(),+m[2-1]);if(x<d)x.setMonth(x.getMonth()+1);return x}return null}
const ORIG={mgr:window.mgr,crew:window.crew,admin:window.admin,aview:window.aview};
window.aview=function(id){INVID=id;return ORIG.aview(id)};
const HELP={Manager:['“New quote” (then just talk)','“New quote for John Smith”','“Quotes needed” · “Finished quotes”','“Schedule” or “Show today’s jobs”','“Open Smith” (a customer)','“My projects” · “Open settings”'],
 Crew:['“Show my jobs”','“Open Smith” (a job)','“Mark job complete”','“Clock in” · “Clock out”'],
 Admin:['“Show invoices”','“Open invoice Smith”','“Mark invoice paid” · “Send invoice”','“Employees” · “Crew hours”']};
function home(r){if(mode()!=='voice')return ORIG[r]();INVID=null;fab();
 A.innerHTML=`<div class="vh" id="vhome"><h2>Tap and talk</h2><p class="sub">Say what you need. No buttons needed.</p><div class="vhw"><span class="p"></span><span class="p p2"></span><button id="vhmic" type="button" aria-label="Tap to talk" onclick="FDVH.listen()">${MIC}</button></div><div id="vhst">Tap the mic</div><div id="vhheard"></div>
 <div class="vhcmd"><b>Try saying:</b><ul style="margin:0;padding-left:20px">${(HELP[role]||[]).map(x=>'<li>'+x+'</li>').join('')}<li>“Go home” · “Use buttons”</li></ul></div>
 <button class="vhalt" id="vhforms" type="button" onclick="FDVH.forms()">Use buttons instead</button></div>`;
 if(typeof armBack==='function')armBack(null);fab()}
window.mgr=()=>home('mgr');window.crew=()=>home('crew');window.admin=()=>home('admin');
function fab(){let b=document.getElementById('vhfab');let ex='';try{ex=localStorage.fdHome||''}catch(e){}const show=!!role&&!document.getElementById('vhome')&&!(navigator.webdriver&&!ex)&&!((document.getElementById('selbar')||{hidden:true}).hidden===false);
 if(!b){b=document.createElement('button');b.id='vhfab';b.type='button';b.setAttribute('aria-label','Voice command');b.innerHTML=MIC;b.onclick=()=>listen();document.body.appendChild(b)}b.hidden=!show;document.body.classList.toggle('vhf',show)}
new MutationObserver(()=>fab()).observe(document.getElementById('app')||document.body,{childList:true});
function say(t,heard){const s=document.getElementById('vhst');if(s){s.textContent=t;const h=document.getElementById('vhheard');if(h)h.textContent=heard?'“'+heard+'”':''}else{let tip=document.getElementById('vhtip');if(!tip){tip=document.createElement('div');tip.id='vhtip';document.body.appendChild(tip)}tip.textContent=t+(heard?' “'+heard+'”':'');clearTimeout(say.t);say.t=setTimeout(()=>tip.remove(),3500)}}
function ui(on){const h=document.getElementById('vhome');if(h)h.classList.toggle('on',on);const f=document.getElementById('vhfab');if(f)f.classList.toggle('on',on);const g=document.getElementById('vhstrip');if(g)g.classList.toggle('on',on)}
function listen(){if(LISTEN){LISTEN.stop();return}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){say('Voice isn’t supported in this browser. Use buttons instead.');return}
 const r=new SR();LISTEN=r;r.lang='en-US';r.interimResults=false;r.continuous=false;let got='';ui(true);say('Listening…');if(window.FDVoice)FDVoice.buzz(30);
 r.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal!==false)got+=' '+e.results[i][0].transcript;got=got.trim();if(got){try{r.stop()}catch(x){}}};
 r.onerror=e=>{if(e&&/not-allowed|service-not-allowed/.test(e.error))say('Microphone blocked. Allow mic access, or use buttons.')};
 r.onend=()=>{LISTEN=null;ui(false);if(got)(window.FDVH&&FDVH.route||route)(got);else if(!/blocked/.test((document.getElementById('vhst')||{}).textContent||''))say('Didn’t catch that. Tap and try again.')};
 try{r.start()}catch(e){LISTEN=null;ui(false);say('Couldn’t start the mic.')}}
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
function findJob(q,arr){q=norm(q).replace(/^(the|job|customer|invoice|project|for)\s+/,'');if(!q)return null;arr=arr||jobs;
 return arr.find(j=>norm(j.name)===q)||arr.find(j=>norm(j.name).includes(q))||arr.find(j=>q.split(' ').some(w=>w.length>2&&norm(j.name).split(' ').includes(w)))||arr.find(j=>String(j.id).toLowerCase()===q.replace(/ /g,''))}
function go(fn){if(typeof okToLeave==='function'&&!okToLeave())return false;fn();window.scrollTo(0,0);return true}
function route(raw){const t=norm(raw);let m;
 const done=(msg)=>say(msg,raw);
 if(/^(go )?(back )?home$|^main (menu|screen)$|^start over$/.test(t)){go(navHome);return done('Home')}
 if(/\b(use )?(buttons|forms)( instead)?\b/.test(t)&&!/invoice/.test(t)){forms();return}
 if(/\bvoice mode\b/.test(t)){voice();return}
 if(/(use )?my location|i'?m here|i am here|where i am|current location/.test(t)&&window.FDGPS){if(!document.getElementById('ad')){if(role!=='Manager'&&role!=='Owner')return done('Location fills the address on a quote.');go(()=>newq())}FDGPS.fill(false);return done('Finding your address…')}
 if(/^(save|save it|done)$/.test(t)&&document.getElementById('bsv')){document.getElementById('bsv').click();return done('Saving')}
 if(/^cancel$/.test(t)&&ctx()==='blk'&&document.getElementById('bsv')){go(()=>blkBack());return done('Cancelled')}
 if(role==='Manager'&&window.sched){
  if((m=t.match(/^(?:schedule|put|book) (.+?)(?: (?:on|for|to|next|this) (.+))?$/))&&!/^(page|view)$/.test(m[1])){let nm=m[1],dt=m[2]?when(m[2]):null;if(!m[2]){const w2=nm.match(/^(.+?) (today|tomorrow|(?:next )?(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday))$/);if(w2){nm=w2[1];dt=when(w2[2])}}
   if(!dt&&ctx()==='dayView'&&CTXARG){const p=String(CTXARG).split('-');dt=new Date(+p[0],+p[1]-1,+p[2])}
   const j=findJob(nm,jobs.filter(x=>x.status=='approved'))||findJob(nm);if(!j)return done('No job found for '+nm+'.');const k=dt?ymd(dt):ymd(new Date());go(()=>blk('',k,j.id));return done('Check the time, then say “save”: '+j.name+' on '+fmtD(k))}
  if(/^(next|following) (week|month)$|^forward$/.test(t)){if(ctx()!=='sched')sched();mv(1);return done('Next')}
  if(/^(previous|last|prior) (week|month)$|^back a (week|month)$/.test(t)){if(ctx()!=='sched')sched();mv(-1);return done('Previous')}
  if(/^(today|this week|this month|go to today)$/.test(t)){SV.start=null;go(()=>sched());return done('This week')}
  if(/^month( view)?$/.test(t)){SV.mode='month';go(()=>sched());return done('Month view')}
  if(/^week( view)?$/.test(t)){SV.mode='week';go(()=>sched());return done('Week view')}
  if(/^(back to (the )?calendar|calendar)$/.test(t)){go(()=>sched());return done('Calendar')}
  if(/^block (off )?time/.test(t)){const dt=when(t);go(()=>blk('',dt?ymd(dt):undefined));return done('Block time')}
  if((m=t.match(/^(?:open|show|go to) (today|tomorrow|(?:next )?(?:sunday|monday|tuesday|wednesday|thursday|friday|saturday)|.*\d.*)$/))&&when(m[1])){const k=ymd(when(m[1]));go(()=>dayView(k));return done(fmtD(k))}
 }
 if(role==='Manager'){
  if((m=t.match(/^(?:start (?:a )?|make (?:a )?|create (?:a )?)?(?:new )?(?:voice )?quote(?: for (.+))?$/))||(m=t.match(/^new (?:customer )?(?:quote|estimate)(?: for (.+))?$/))){
   go(()=>newq());const nm=m[1]&&m[1].replace(/\b\w/g,c=>c.toUpperCase());const el=document.getElementById('nm');
   if(nm&&el){el.value=nm;el.dispatchEvent(new Event('input',{bubbles:true}));return done('New quote for '+nm)}
   if(window.aiStart&&document.getElementById('aibtn')&&!document.getElementById('aibtn').disabled){aiStart();return done('New quote. Start talking.')}return done('New quote')}
  if(/quotes? needed|quote requests/.test(t)){go(()=>qn());return done('Quotes needed')}
  if(/finished quotes|sent quotes/.test(t)){go(()=>fqScreen());return done('Finished quotes')}
  if(/schedule|calendar|today'?s jobs|jobs (for )?today|this week/.test(t)){go(()=>sched());return done('Schedule')}
  if(/settings/.test(t)){go(()=>openSet());return done('Settings')}
  if(/(my )?projects|all jobs|show jobs|job list/.test(t)){go(()=>ORIG.mgr());return done('My projects')}
  if((m=t.match(/^(?:open|show|find|pull up|go to) (.+)$/))){const j=findJob(m[1]);if(j){go(()=>mview(j.id));return done('Opened '+j.name)}return done('No job found for '+m[1]+'.')}
 }
 if(role==='Crew'){
  if(/mark (the )?(job )?(as )?(complete|done|finished)|job (is )?(complete|done|finished)|finish (the )?job/.test(t)){if(!cur||!document.getElementById('jc')){const a=jobs.filter(j=>j.status=='approved');if(a.length===1){cview(a[0].id)}else return done('Open a job first, then say “mark job complete”.')}done('Marking complete…');done_(cur);return}
  if(/clock (me )?(in|out)|punch (in|out)/.test(t)){if(!document.getElementById('clockbtn'))go(()=>ORIG.crew());const b=document.getElementById('clockbtn');if(b){b.click();return done('Clock tapped')}return done('Clock isn’t available.')}
  if(/(my |today'?s |show )?jobs|job list/.test(t)){go(()=>ORIG.crew());return done('Your jobs')}
  if((m=t.match(/^(?:open|show|find|pull up|go to) (.+)$/))){const j=findJob(m[1],jobs.filter(j=>j.status=='approved'));if(j){go(()=>cview(j.id));return done('Opened '+j.name)}return done('No job found for '+m[1]+'.')}
 }
 if(role==='Admin'){
  const invs=jobs.filter(j=>j.status=='complete'||j.status=='invoiced');
  if(/mark (the )?(invoice )?(as )?(paid)|invoice (is )?paid|got paid/.test(t)){if(!INVID)return done('Open an invoice first, then say “mark invoice paid”.');const j=jobs.find(x=>x.id==INVID);if(confirm('Mark invoice '+INVID+(j?' for '+j.name:'')+' PAID?')){paid(INVID,true);return done('Marked paid')}return done('Cancelled')}
  if(/mark (the )?(invoice )?(as )?(unpaid|open)/.test(t)){if(!INVID)return done('Open an invoice first.');if(confirm('Mark invoice '+INVID+' OPEN?')){paid(INVID,false);return done('Marked open')}return done('Cancelled')}
  if(/(re)?send (the )?invoice/.test(t)){if(!INVID||!document.getElementById('am'))return done('Open an invoice first, then say “send invoice”.');if(confirm('Email this invoice to the customer now?')){inv(INVID);return done('Sending invoice')}return done('Cancelled')}
  if(/employees?|staff|team/.test(t)){go(()=>openEmp());return done('Employees')}
  if(/hours|time ?clock|punches|timesheet/.test(t)&&window.openHours){go(()=>openHours());return done('Crew hours')}
  if((m=t.match(/^(?:open|show|find|pull up|go to) (?:invoice )?(.+)$/))&&!/^invoices$/.test(m[1])){const j=findJob(m[1],invs);if(j){go(()=>window.aview(j.id));return done('Opened invoice for '+j.name)}if(!/invoices/.test(t))return done('No invoice found for '+m[1]+'.')}
  if(/invoices/.test(t)){go(()=>ORIG.admin());return done('Invoices')}
 }
 if(/^(sign|log) ?out$/.test(t)&&document.getElementById('out')){document.getElementById('out').click();return}
 done('Not sure how to do that here. Try again, or use buttons.')}
function done_(id){window.done(id)}
function forms(){setMode('forms');const b=document.getElementById('vhfab');if(b)b.hidden=true;go(()=>{view='';render()});setTimeout(fab,50)}
function voice(){forms()}
function addBack(){if(document.getElementById('vhback'))return;const b=document.createElement('button');b.id='vhback';b.type='button';b.className='btn n';b.style.cssText='margin-bottom:12px';b.innerHTML='🎙 Switch to voice mode';b.onclick=voice;A.prepend(b)}
// In buttons mode, keep a one-tap way back to voice on each home screen.
['mgr','crew','admin'].forEach(r=>{const f=window[r];window[r]=function(){const x=f.apply(this,arguments);try{const o=document.getElementById('vhback');if(o)o.remove();setTimeout(fab,50)}catch(e){}return x}});
const SHINT={sched:'“Schedule Smith for Tuesday” · “Next week” · “Today” · “Month view”',dayView:'“Schedule Smith” (this day) · “Back to calendar” · “Go home”',blk:'“Save” · “Cancel” · “Go home”'};
['sched','dayView','blk'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(){const x=f.apply(this,arguments);try{CTX=n;CTXARG=arguments[0];let ex='';try{ex=localStorage.fdHome||''}catch(e){}if(!document.getElementById('vhstrip')&&!(navigator.webdriver&&!ex)){const b=document.createElement('button');b.id='vhstrip';b.type='button';b.hidden=true;b.tabIndex=-1;A.prepend(b)}}catch(e){}return x}});
if(typeof window.selBar==='function'){const sb=window.selBar;window.selBar=function(){const x=sb.apply(this,arguments);fab();return x}}
window.FDVH={listen,route,forms,voice,mode};
})();
