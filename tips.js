// Fielder feature tour: short tip bubbles, shown once per person per tip. "?" in the header replays them.
// The bubble never covers the page: only the bubble itself takes taps.
(function(){
const T=[
 {id:'vh-mic',sel:'#vhmic',txt:'Tap the big mic and just say what you need. Buttons are always there as a backup.'},

 {id:'ow-mic',sel:'#ow-now',txt:'Owner page. Tap the mic and say “Clock in Jake”, “Who’s on the clock” or “Team”.'},
 {id:'ow-cin',sel:'#ow-in',txt:'Clock anyone in from here. Or say “clock in Jake”.'},
 {id:'ow-labor',sel:'#ow-labor',txt:'Labor cost per day: hours × each person’s pay rate. Set rates on the Team page.'},
 {id:'ow-team',sel:'#ow-team',txt:'Add or remove people, set their PIN and exactly what they can do.'},
 {id:'ow-view',sel:'#ow-crew',txt:'See the app exactly like your crew, estimator, or admin does.'},
 {id:'ow-add',sel:'#ow-add',txt:'Add someone new. They get their own 4-digit PIN.'},
 {id:'ow-perms',sel:'#owperms',txt:'Tick what this person can do. Untick to take it away.'},
 {id:'m-new',sel:'[onclick^="newq"]',txt:'Start a quote here. You can talk it through and photos go straight to Drive.'},
 {id:'m-sched',sel:'#row-sched',txt:'Your calendar. Approved jobs wait here to be scheduled.'},
 {id:'m-qn',sel:'#row-qn',txt:'Quote requests from email land here.'},
 {id:'c-clock',sel:'#clockc',txt:'You’re clocked in automatically when you sign in. Tap Clock Out when you’re done.'},
 {id:'c-done',sel:'#jc',txt:'Done? Add after photos, then tap here. The office gets notified right away.'},
 {id:'a-emp',sel:'#row-emp',txt:'Add people and send them login codes.'},
 {id:'a-hours',sel:'[onclick^="openHours"]',txt:'See who is on the clock, fix a missed punch, export hours.'},
 {id:'ft-storm',sel:'#ftstormbar',txt:'Storm mode is on: new calls use the fast storm form and land in a queue, most dangerous first.'},
 {id:'ft-card',sel:'#ftcard',txt:'Ask Timber: questions about your numbers, plus quick buttons for storm calls, crew map, job profit, equipment, safety, reviews and QuickBooks. Or just say it.'},
 {id:'ft-set',sel:'#ft-set',txt:'Connect Stripe for online payments, Twilio for texts, and your Google review link here.'},
 {id:'ft-map',sel:'#ftmap',txt:'Where everyone last clocked in, out or finished a job. Red means more than half a mile from the job.'},
 {id:'ft-safety',sel:'#ft-safety',txt:'Do the safety checklist once a day. Job complete needs it first.'},
 {id:'ft-portal',sel:'#ftportal',txt:'Each customer gets a private project page: quote, signature, schedule, photos, invoice and Pay button.'},
 {id:'ft-cost',sel:'#ftcost',txt:'Add dump fees and materials. Profit = quote minus labor and costs. Say “dump fee 60”.'},
 {id:'ft-onway',sel:'#ftonway',txt:'Tap when you leave for the job. The customer gets a “crew on the way” notice.'},
 {id:'ft-book',sel:'#ftbook',txt:'Email the customer a link to pick their own work date. It lands right on the schedule.'},
 {id:'ft-follow',sel:'#ftflsend',txt:'Past customers from about a year ago. One tap emails them a yearly trimming reminder.'},
 {id:'ft-qb',sel:'#ftqbiif',txt:'Download invoices and payments for QuickBooks. IIF for Desktop, CSV for Online.'},
 {id:'ft-eq',sel:'#fteqadd',txt:'Add each chipper, saw and truck with a service interval. Red cards are due.'},
 {id:'a-inv',sel:'.job',role:'Admin',txt:'Tap an invoice to send it or mark it Paid.'},
 {id:'s-today',sel:'#s-today',txt:'Your job for today. Tap it for the address, scope and photos.'},
 {id:'s-clock',sel:'#s-clock',txt:'Clock in when you start and out when you finish.'},
 {id:'s-newq',sel:'#s-newq',txt:'Start a quote here. You can talk it through.'},
 {id:'s-quotes',sel:'#s-quotes',txt:'Quotes you sent that are waiting on the customer.'},
 {id:'s-inv',sel:'#s-inv',txt:'Invoices to send and the ones still unpaid.'},
 {id:'s-pay',sel:'#s-pay',txt:'Payments: see what is paid and what is still open.'},
 {id:'o-num',sel:'#dgrid',txt:'Your numbers for today. Tap any number to see what is behind it.'},
 {id:'o-nav',sel:'#dnav',txt:'Quotes, Jobs, Money, Ask Timber and More are always here.'},
 {id:'mic3',sel:'#tbdict',txt:'Tap the mic to talk instead of typing.'}
];
// First run: at most 3 tips per role.
const ALLOW={Crew:['s-today','s-clock','mic3'],Manager:['s-newq','s-quotes','mic3'],Admin:['s-inv','s-pay','mic3'],Owner:['o-num','o-nav','mic3']};
const on=()=>{try{return localStorage.fdTips==='on'||(!navigator.webdriver&&localStorage.fdTips!=='off')}catch(e){return false}};
const who=()=>'fdTips:'+(sessionStorage.fdName||role||'x');
const seen=()=>{try{return JSON.parse(localStorage[who()]||'[]')}catch(e){return []}};
const mark=id=>{try{const s=seen();if(!s.includes(id)){s.push(id);localStorage[who()]=JSON.stringify(s)}}catch(e){}};
const css=document.createElement('style');css.textContent=`#fdtip{position:fixed;z-index:80;left:12px;right:12px;max-width:420px;margin:0 auto;background:#112337;color:#fff;border-radius:16px;padding:16px 16px 14px;box-shadow:0 10px 30px rgba(0,0,0,.3);font-size:18px;line-height:1.35}
#fdtip:after{content:'';position:absolute;left:var(--ax,50%);width:0;height:0;border:11px solid transparent}#fdtip.dn:after{top:-21px;border-bottom-color:#112337}#fdtip.up:after{bottom:-21px;border-top-color:#112337}
#fdtip b{display:block;color:#b9d68a;font-size:15px;margin-bottom:4px}#fdtip button{display:block;width:100%;margin-top:12px;min-height:54px;font-size:19px;font-weight:800;border:0;border-radius:12px;background:#78a22f;color:#fff}
.fdring{outline:4px solid #b9d68a!important;outline-offset:3px;border-radius:12px}#tipsbtn{width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,255,255,.6);background:transparent;color:#fff;font-size:22px;font-weight:800;flex:none}`;
document.head.appendChild(css);
let CUR=null,tmr=0;
function close(){const b=document.getElementById('fdtip');if(b)b.remove();document.querySelectorAll('.fdring').forEach(e=>e.classList.remove('fdring'));CUR=null}
function vis(el){if(!el||el.hidden)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(el).display!=='none'}
function show(t,el){close();CUR=t.id;el.classList.add('fdring');const b=document.createElement('div');b.id='fdtip';b.setAttribute('role','dialog');b.setAttribute('aria-label','Tip');
 b.innerHTML='<b>💡 Tip</b><div></div><button type="button" id="fdtipok">Got it</button>';b.children[1].textContent=t.txt;document.body.appendChild(b);
 const r=el.getBoundingClientRect(),h=b.offsetHeight,below=r.bottom+14+h<innerHeight||r.top<h+20;
 b.className=below?'dn':'up';b.style.top=(below?Math.min(r.bottom+14,innerHeight-h-8):Math.max(8,r.top-14-h))+'px';
 const br=b.getBoundingClientRect();b.style.setProperty('--ax',Math.max(14,Math.min(br.width-36,r.left+r.width/2-br.left-11))+'px');
 document.getElementById('fdtipok').onclick=()=>{mark(t.id);close();setTimeout(scan,250)}}
function scan(){if(!on()||!role){close();return}const s=seen();if(CUR){const el=document.querySelector('.fdring');if(el&&vis(el))return;close()}
 const al=ALLOW[sessionStorage.fdOwner==='1'?'Owner':role];for(const t of T){if(s.includes(t.id)||(t.role&&t.role!==role)||(al&&!al.includes(t.id)))continue;const el=document.querySelector(t.sel);if(vis(el)){show(t,el);return}}}
window.fdTipsScan=scan;
window.fdTipsReplay=function(){try{localStorage.removeItem(who());if(localStorage.fdTips==='off')localStorage.removeItem('fdTips');if(navigator.webdriver)localStorage.fdTips='on'}catch(e){}close();scan();if(!CUR)toast('No tips for this page')};
function btn(){const out=document.getElementById('out');if(!out)return;let b=document.getElementById('tipsbtn');
 if(!b){b=document.createElement('button');b.id='tipsbtn';b.type='button';b.textContent='?';b.title='Show tips';b.setAttribute('aria-label','Show tips');b.onclick=()=>fdTipsReplay();out.parentNode.insertBefore(b,out)}b.hidden=!role}
new MutationObserver(()=>{btn();clearTimeout(tmr);tmr=setTimeout(scan,700)}).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
addEventListener('resize',()=>{if(CUR){close();scan()}});addEventListener('scroll',()=>{if(CUR){const id=CUR;close();setTimeout(scan,300)}},{passive:true});
btn();
})();
