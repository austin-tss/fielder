try{window.FD_TBO0=sessionStorage.fdTbOpen==='1'}catch(e){}
// Big thumb-reach Back + Home bar on every sub-page (phone and desktop), a default Back on pages that never set one,
// and phone swipe / browser back through history state. Owner Back/Home go to the Owner dashboard. (Miller 829a754, Fielder look.)
(function(){
const st=document.createElement('style');st.textContent=`
#bbar{position:fixed;left:0;right:0;bottom:0;z-index:58;display:none;gap:10px;padding:10px max(12px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));background:rgba(255,255,255,.96);border-top:1px solid #dfe4da;box-shadow:0 -4px 16px rgba(17,35,55,.08);backdrop-filter:blur(6px)}
#bbar button{font:inherit;font-weight:800;font-size:20px;min-height:58px;border-radius:14px;border:0;cursor:pointer}
#bbar #bb-back{flex:1;background:#112337;color:#fff}#bbar #bb-home{flex:0 0 34%;background:#eef3e4;color:#112337}
body.hasbb #bbar{display:flex}body.hasbb{padding-bottom:calc(92px + env(safe-area-inset-bottom))}html:has(body.hasbb){scroll-padding-bottom:calc(110px + env(safe-area-inset-bottom))}
body.hasbb #vhfab,body.hasbb #micfab{bottom:calc(100px + env(safe-area-inset-bottom))!important}
body.hasbb #selbar,body.hasbb #undo,body.hasbb #qbulk{bottom:calc(92px + env(safe-area-inset-bottom))!important}
body.hasbb #navbar,body.hasbb #owbar,#bbar,#navbar,#vhfab{display:none!important}#brand{cursor:pointer}
@media (min-width:768px){body.dk #bbar{left:var(--sw,240px)}#bbar{justify-content:center}#bbar #bb-back{flex:0 1 420px}#bbar #bb-home{flex:0 1 220px}}`;document.head.appendChild(st);
const bar=document.createElement('div');bar.id='bbar';bar.innerHTML='<button id="bb-back" type="button">← Back</button><button id="bb-home" type="button">🏠 Home</button>';
const add=()=>document.body&&!document.getElementById('bbar')&&document.body.appendChild(bar);add();document.addEventListener('DOMContentLoaded',add);
const owner=()=>sessionStorage.fdOwner==='1'||(typeof role!=='undefined'&&role==='Owner');
const atHome=()=>typeof role==='undefined'||!role||(owner()?view==='odash':view==='');
function home(){try{if(typeof okToLeave==='function'&&!okToLeave())return}catch(e){}if(typeof armBack==='function')armBack(null);try{SEL=null;selBar()}catch(e){}if(owner()&&window.ownerHome)ownerHome();else{view='';render()}window.scrollTo(0,0)}
window.fdHome=home;
bar.querySelector('#bb-back').onclick=()=>{if(typeof BACKFN!=='undefined'&&BACKFN)goBack();else home()};bar.querySelector('#bb-home').onclick=home;
let pushed=false;
/* Miller 94e8b90: big non-sticky Done (lists) / Cancel (edit forms) at the end of every non-home screen; logo still goes home */
function done(){const A0=document.getElementById('app')||(typeof A!=='undefined'?A:null);if(!A0)return;const sub=!atHome()&&!(typeof view!=='undefined'&&view==='timber');let d=document.getElementById('fddone');
 if(!sub||!A0.children.length){if(d)d.remove();return}if(d&&d.parentNode===A0&&d===A0.lastElementChild)return;if(d)d.remove();
 const form=!!A0.querySelector('input:not([type=checkbox]):not([type=radio]):not([type=hidden]),select,textarea')&&!!A0.querySelector('#owsave,#eadd,button.btn.huge[onclick*="save" i],button.btn.huge[onclick*="Save"]');
 d=document.createElement('button');d.id='fddone';d.type='button';d.className='btn huge';d.style.cssText='margin:18px 0 8px;background:#112337;color:#fff';d.textContent=form&&/owedit/.test(view)?'✕ Cancel':'✓ Done';
 d.onclick=()=>{if(typeof BACKFN!=='undefined'&&BACKFN)goBack();else home();window.scrollTo(0,0)};A0.appendChild(d)}
function sync(){add();done();const sub=!atHome();if(sub&&typeof BACKFN!=='undefined'&&!BACKFN&&typeof armBack==='function')armBack(home);document.body.classList.toggle('hasbb',false);
 if(sub&&!pushed){try{history.pushState({fdsub:1},'')}catch(e){}pushed=true}if(!sub&&pushed&&history.state&&history.state.fdsub){pushed=false;try{history.back()}catch(e){}}if(!sub)pushed=false}
window.addEventListener('popstate',()=>{if(!pushed)return;pushed=false;if(!atHome()){if(typeof BACKFN!=='undefined'&&BACKFN)goBack();else home()}setTimeout(sync,50)});
const AB=window.armBack;if(AB)window.armBack=armBack=function(fn){AB(fn);setTimeout(sync,0)};
window.ftNavSync=sync;setInterval(sync,400);
})();
// Ask Timber chat bar at the top (Miller 6f683b9, Fielder look): every role with Timber (not Crew). Tap ▾ to drop the chat down over
// the page, ▴ to tuck it away; chat/voice keep running while tucked. Replies that land while tucked or hidden: browser notification
// (if allowed; asked the first time the chat opens), red badge + yellow ring + reply subtitle on the bar, and a 6 s toast.
// The old "← Back to Owner page" pill is gone everywhere; the bottom Back/Home bar is the only back control.
(function(){
const st=document.createElement('style');st.textContent=`#owbar{display:none!important}
header{flex-wrap:wrap}
#tbtop{display:none;order:9;flex:1 0 100%;align-items:center;gap:8px;min-height:44px;margin:4px 0 2px;padding:0 12px;border:0;border-radius:12px;background:#fff;color:#112337;font:inherit;font-weight:700;font-size:17px;cursor:pointer;box-shadow:none;text-align:left;width:auto}
#tbtop .tl{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#tbtop .tl small{display:block;font-weight:500;font-size:12px;color:#5b6168;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#tbtop .ar{font-size:22px;color:#78a22f}#tbtop .bd{display:none;min-width:26px;height:26px;border-radius:13px;background:#d64545;color:#fff;font-size:14px;align-items:center;justify-content:center;padding:0 7px}
#tbtop.new .bd{display:inline-flex}#tbtop.new{box-shadow:0 0 0 3px #f2c94c,0 2px 8px rgba(0,0,0,.22)}
body.hastb #tbtop{display:flex}
#tbdr{display:none;position:fixed;left:0;right:0;z-index:57;top:var(--tbt,140px);max-height:min(62dvh,calc(100dvh - var(--tbt,140px) - 10px));overflow:auto;background:#f6f7f3;border-bottom:1px solid #dfe4da;box-shadow:0 6px 14px rgba(17,35,55,.10);padding:10px max(10px,env(safe-area-inset-right)) 12px max(10px,env(safe-area-inset-left))}#tbdr .card.tb{margin:0 auto;max-width:760px;box-shadow:none;border:1px solid #e3e7df}#tbdr .msgs{min-height:0!important}#tbdr .msgs:empty{display:none}#tbdr .tbsg button{min-height:44px;font-size:16px;padding:8px 12px}#tbdr .msgs{min-height:0!important}#tbdr .msgs:empty{display:none}#tbdr #tbx{font-size:14px;margin:0 0 6px!important}html[data-theme=dark] #tbx,html[data-theme=dark] #tbvst,html[data-theme=dark] .tb small{color:#d5dde4!important}html[data-theme=dark] #tbdr{background:#0f1c2b;border-bottom-color:#2b3b4c}#tbdr .tb h2{font-size:20px}
body.tbopen #tbdr{display:block}#tbdr .card.tb{margin:0 auto;max-width:760px}
#tbtoast{position:fixed;left:50%;transform:translateX(-50%);top:calc(var(--tbt,140px) + 8px);z-index:70;background:#112337;color:#fff;font-weight:700;font-size:16px;padding:12px 18px;border-radius:14px;box-shadow:0 8px 20px rgba(0,0,0,.25);max-width:92vw;cursor:pointer;border-left:5px solid #78a22f}
@media (min-width:768px){#tbtop{order:0;flex:0 1 440px;margin:0 8px 0 auto}body.dk #tbdr{left:var(--sw,240px)}}`;document.head.appendChild(st);
const b=document.createElement('button');b.id='tbtop';b.type='button';b.setAttribute('aria-expanded','false');
b.innerHTML='<span style="font-size:24px">🌲</span><span class="tl">Ask Timber<small id="tbtsub">Tap to ask</small></span><span class="bd" id="tbbd">1</span><span class="ar" id="tbar">▾</span>';
const d=document.createElement('div');d.id='tbdr';d.innerHTML='<div id="tbdrb"></div>';document.body.appendChild(d);
let unread=0;const isOpen=()=>document.body.classList.contains('tbopen');
function place(){const h=document.querySelector('header');if(h)document.documentElement.style.setProperty('--tbt',Math.round(h.getBoundingClientRect().bottom)+'px')}
function sub(t){const s=b.querySelector('#tbtsub');if(s)s.textContent=t}
window.tbDrawer=function(open){try{sessionStorage.fdTbOpen=open?'1':''}catch(e){}/* Miller c373cfa: tucking Timber away stops read-aloud/dictation and clears the chat; every open starts fresh */if(!open&&document.body.classList.contains('tbopen')){try{window.tbStop&&tbStop()}catch(e){}sessionStorage.tbHist='[]';const db=document.getElementById('tbdrb');if(db)db.innerHTML=''}document.body.classList.toggle('tbopen',open);b.setAttribute('aria-expanded',open?'true':'false');b.querySelector('#tbar').textContent=open?'▴':'▾';
 if(open){unread=0;b.classList.remove('new');sub('Tap ▴ to tuck away');place();try{if(window.Notification&&Notification.permission==='default')Notification.requestPermission()}catch(e){}setTimeout(()=>{const q=document.getElementById('tbq');if(q&&matchMedia('(min-width:768px)').matches)q.focus()},50)}else sub('Tap to ask')};
b.onclick=()=>{try{window.tbUnlock&&tbUnlock()}catch(e){}if(isOpen())tbDrawer(false);else{sessionStorage.tbHist='[]';ftTimber()}};
function toast(t){let e=document.getElementById('tbtoast');if(!e){e=document.createElement('div');e.id='tbtoast';e.setAttribute('role','status');e.onclick=()=>{e.remove();ftTimber()};document.body.appendChild(e)}e.textContent='🌲 Timber: '+t;clearTimeout(e._t);e._t=setTimeout(()=>e.remove(),6000)}
window.tbNotify=function(text){const t=String(text||'Done').replace(/[*_#`>]/g,'').replace(/\s+/g,' ').trim().slice(0,140);window.TB_LAST=t;
 if(isOpen()&&!document.hidden){sub('Tap ▴ to tuck away');return 'open'}
 unread++;const bd=b.querySelector('#tbbd');if(bd)bd.textContent=unread;b.classList.add('new');sub('Timber answered. Tap to ask again');let how='badge';
 try{if(window.Notification&&Notification.permission==='granted'){const n=new Notification('Timber',{body:t,icon:'mark.svg',tag:'timber'});n.onclick=()=>{window.focus();ftTimber();n.close()};how='notification'}}catch(e){}
 window.TB_NOTE=how;return how};
const wrap=()=>{const f=window.ftTimberAsk;if(!f||f._nb)return;const g=async function(){const r=await f.apply(this,arguments);try{const h=JSON.parse(sessionStorage.tbHist||'[]'),l=h[h.length-1];if(l&&l.who==='tm')tbNotify(l.text)}catch(e){}return r};g._nb=1;window.ftTimberAsk=g};
function sync(){const h=document.querySelector('header');if(!h)return;if(b.parentNode!==h){const g=document.getElementById('gear');h.insertBefore(b,g||null)}wrap();
 let r='';try{r=role}catch(e){}const on=!!r&&(r==='Owner'||sessionStorage.fdOwner==='1')&&!!window.ftTimber;/* Ask Timber chat is Owner-only (Austin, Nov 1); Estimators keep Have Timber fill this quote */document.body.classList.toggle('hastb',on);if(!on&&isOpen())tbDrawer(false);if(!on&&!r&&document.querySelector('#tbdrb .tb')){document.getElementById('tbdrb').innerHTML=''}place()}
d.addEventListener('click',e=>{const x=e.target.closest('button,a');if(!x)return;const oc=x.getAttribute('onclick')||'';if(/ftTimberOpen|ftTimberSheet|ftSupplies|ftTimberDraft/.test(oc)||(oc&&!/ftTimber|tbUnlock|localStorage\.tbSpk|sessionStorage\.tbHist/.test(oc)&&!/^tb/.test(x.id||'')))setTimeout(()=>tbDrawer(false),60)});
// Going somewhere else (bottom Back/Home, sidebar, owner tabs, voice home commands, swipe back) tucks the chat away; Ask Timber links reopen it.
document.addEventListener('click',e=>{if(!isOpen()||d.contains(e.target)||b.contains(e.target))return;const x=e.target.closest('#bbar button,#dside button,#dside a,.dnav button,#navbar button,#brand');if(x&&!/ftTimber|ownerSect\('timber'\)/.test(x.getAttribute('onclick')||''))tbDrawer(false)},true);
addEventListener('popstate',()=>{if(isOpen())tbDrawer(false)});
function wrapOS(){for(const n of ['ownerSect','ownerHome','ftJobs','sched','openCusts','ftReadyInv','ftReceipts','ftSupplies']){const o=window[n];if(typeof o!=='function'||o._tb)continue;const g=function(k){if(isOpen()&&!(n==='ownerSect'&&k==='timber'))tbDrawer(false);return o.apply(this,arguments)};g._tb=1;window[n]=g}}
function wrapVH(){const v=window.FDVH;if(!v||!v.route||v.route._tb)return;const r=v.route;v.route=function(){if(isOpen())tbDrawer(false);return r.apply(this,arguments)};v.route._tb=1}
addEventListener('resize',place);setInterval(()=>{sync();wrapVH();wrapOS()},400);wrapOS();document.addEventListener('DOMContentLoaded',sync);sync()})();
// No Back bars (Miller 92221aa): the Fielder logo at the top left always goes to the role's home in one tap and tucks Timber away.
// Phone/browser back gestures still work through history. The floating corner mic stays (Fielder keeps it on every page).
window.logoHome=function(){let r='';try{r=role}catch(e){}if(!r)return;if(window.tbDrawer)tbDrawer(false);try{if(typeof okToLeave==='function'&&!okToLeave())return}catch(e){}try{typeof armBack==='function'&&armBack(null)}catch(e){}if(typeof navHome==='function')navHome();else{view='';render()}window.scrollTo(0,0)};
/* Reload stays on the current screen (Austin, Nov 1): remember the last top-level screen this session and reopen it after a refresh,
   instead of falling back to a role home (the Owner used to land on the Office list for a moment, or stay there). */
(function(){const R=['ownerHome','ownerSect','ftJobs','ftNeed','ftVnxt','ftSupplies','ftReceipts','ownerTeam','ownerTeamAdd','openCusts','ftReadyInv','sched','openSet','ftSet','ftExtras','ftLeads','ftLaborCmp','ftLaborDay','ftPayroll','ftMap','ftProfit','ftWx','ftStorm','ftFollow','ftEquip','ftPermits','ftCOI','ftSafeRep','openOutstanding','empScreen'];
 let replaying=false;
 function wrap(){for(const n of R){const o=window[n];if(typeof o!=='function'||o._rt)continue;const g=function(){if(!replaying){try{const a=[...arguments].filter(x=>x==null||/^(string|number|boolean)$/.test(typeof x));sessionStorage.fdRoute=JSON.stringify([n,a])}catch(e){}}return o.apply(this,arguments)};g._rt=1;Object.keys(o).forEach(k=>{try{g[k]=o[k]}catch(e){}});window[n]=g}}
 wrap();setTimeout(wrap,0);{let n=0;const iv=setInterval(()=>{wrap();if(++n>50)clearInterval(iv)},100)}document.addEventListener('click',wrap,true);
 const lh=window.logoHome;if(lh)window.logoHome=function(){sessionStorage.fdRoute='';return lh.apply(this,arguments)};
 const lo=window.logout;if(typeof lo==='function')window.logout=function(){sessionStorage.fdRoute='';return lo.apply(this,arguments)};
 let rt=null;try{rt=JSON.parse(sessionStorage.fdRoute||'null')}catch(e){}const TBO=!!window.FD_TBO0;if(!rt&&TBO)rt=['ownerHome',[]];
 if(rt&&(rt[0]!=='ownerHome'||TBO)&&typeof role!=='undefined'&&role){window.FD_ROUTE_ON=1;const t0=Date.now();
  const go=()=>{const f=window[rt[0]];const ready=typeof jobs!=='undefined'&&(jobs.length||Date.now()-t0>4000);if(!f||!ready){if(Date.now()-t0<8000)return setTimeout(go,60);window.FD_ROUTE_ON=0;return}
   replaying=true;try{f.apply(window,rt[1]||[])}catch(e){}replaying=false;if(TBO&&window.ftTimber)setTimeout(()=>{try{ftTimber()}catch(e){}},150);setTimeout(()=>{window.FD_ROUTE_ON=0},3000)};setTimeout(go,0)}
})();
