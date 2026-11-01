// Fielder feature tour: short tip bubbles, shown once per person per tip. "?" in the header replays them.
// The bubble never covers the page: only the bubble itself takes taps.
(function(){
const T=[
 {id:'vh-mic',sel:'#vhmic',txt:'Tap the big mic and just say what you need. Buttons are always there as a backup.'},
 {id:'fab',sel:'#vhfab:not([hidden])',txt:'This mic is on every page. Tap it and talk: “go home”, “open Smith”, and more.'},
 {id:'m-new',sel:'[onclick^="newq"]',txt:'Start a quote here. You can talk it through and photos go straight to Drive.'},
 {id:'m-sched',sel:'#row-sched',txt:'Your calendar. Approved jobs wait here to be scheduled.'},
 {id:'m-qn',sel:'#row-qn',txt:'Quote requests from email land here.'},
 {id:'c-clock',sel:'#clockc',txt:'Tap Clock In when you start and Clock Out when you’re done.'},
 {id:'c-done',sel:'#jc',txt:'Done? Add after photos, then tap here. The office gets notified right away.'},
 {id:'a-emp',sel:'#row-emp',txt:'Add people and send them login codes.'},
 {id:'a-hours',sel:'[onclick^="openHours"]',txt:'See who is on the clock, fix a missed punch, export hours.'},
 {id:'a-inv',sel:'.job',role:'Admin',txt:'Tap an invoice to send it or mark it Paid.'}
];
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
 for(const t of T){if(s.includes(t.id)||(t.role&&t.role!==role))continue;const el=document.querySelector(t.sel);if(vis(el)){show(t,el);return}}}
window.fdTipsScan=scan;
window.fdTipsReplay=function(){try{localStorage.removeItem(who());if(localStorage.fdTips==='off')localStorage.removeItem('fdTips');if(navigator.webdriver)localStorage.fdTips='on'}catch(e){}close();scan();if(!CUR)toast('No tips for this page')};
function btn(){const out=document.getElementById('out');if(!out)return;let b=document.getElementById('tipsbtn');
 if(!b){b=document.createElement('button');b.id='tipsbtn';b.type='button';b.textContent='?';b.title='Show tips';b.setAttribute('aria-label','Show tips');b.onclick=()=>fdTipsReplay();out.parentNode.insertBefore(b,out)}b.hidden=!role}
new MutationObserver(()=>{btn();clearTimeout(tmr);tmr=setTimeout(scan,700)}).observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
addEventListener('resize',()=>{if(CUR){close();scan()}});addEventListener('scroll',()=>{if(CUR){const id=CUR;close();setTimeout(scan,300)}},{passive:true});
btn();
})();
