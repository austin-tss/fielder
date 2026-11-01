// Tablet/computer layout (768px and up), mirrored from Miller 918c4d0 with Fielder colors. Phones (<768px) are untouched:
// every rule is inside a min-width media query, and the sidebar is display:none on phones.
(function(){
const st=document.createElement('style');st.textContent=`
#dside{display:none}
@media (min-width:768px){
 :root{--sw:212px}
 body{background:#eef1ec}
 #topstick{box-shadow:0 2px 12px rgba(17,35,55,.18)}
 #topstick header{max-width:none;padding:12px 28px;min-height:64px}
 #brand img{width:44px;height:44px}#brand b{font-size:20px;letter-spacing:.2px}#brand small{font-size:13px;opacity:.85}
 body.dk #dside{display:flex;flex-direction:column;gap:6px;position:fixed;left:0;top:var(--hdrh,76px);bottom:0;width:var(--sw);padding:18px 12px 96px;background:#fff;border-right:1px solid #dfe4da;overflow:auto;z-index:6}
 #dside button{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;margin:0;padding:0 14px;border:0;border-radius:12px;background:transparent;color:#112337;font:inherit;font-size:17px;font-weight:800;text-align:left;cursor:pointer}
 #dside button i{font-style:normal;font-size:20px;width:24px;text-align:center}
 #dside button:hover{background:#f1f5ea}#dside button.on{background:#78a22f;color:#fff}
 #dside .dsl{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6b7480;margin:6px 14px 4px}
 body.dk .dnav{display:none!important}
 body.dk #navbar{padding-left:calc(var(--sw) + 24px)}
 body.dk .wrap{max-width:1040px;margin:0 auto;margin-left:max(calc(var(--sw) + 24px),calc(var(--sw) + (100vw - var(--sw) - 1040px)/2));padding:24px 28px 120px}
 body:not(.dk) .wrap{max-width:720px;padding:24px}
 .card{border-radius:16px;padding:22px 24px;box-shadow:0 1px 2px rgba(17,35,55,.05),0 8px 24px rgba(17,35,55,.06)}
 #shome{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
 #shome>button{min-height:96px}
 .dgrid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important}
 .dc{padding:16px 18px!important;border-radius:16px!important;box-shadow:0 1px 2px rgba(17,35,55,.05),0 8px 24px rgba(17,35,55,.06)}
 .dc.w{grid-column:1/-1!important}
 .dc b{font-size:30px!important}.dc small{font-size:13px!important}
 #app:has(>.qcard){display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:16px;align-content:start}
 #app:has(>.qcard)>:not(.qcard){grid-column:1/-1}
 #app>.qcard{margin-bottom:16px}
 .tb{max-width:760px;margin-left:auto;margin-right:auto}
 .tb .b{font-size:18px}
 .card:has(>[data-field]){display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px;align-content:start}
 .card:has(>[data-field])>*{grid-column:1/-1}
 .card:has(>[data-field])>[data-field]{grid-column:auto}
 .card:has(>[data-field])>[data-field="ai"],.card:has(>[data-field])>[data-field]:has(textarea),.card:has(>[data-field])>[data-field]:has(.chips){grid-column:1/-1}
 body.dk #vhfab{left:calc(var(--sw)/2 - 28px)!important;right:auto!important}
 #toast{bottom:28px}
}
@media (min-width:1100px){
 :root{--sw:236px}
 .dgrid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
 #shome{grid-template-columns:repeat(3,minmax(0,1fr))}
 #jl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 16px}
 #jl>.pager,#jl>p,#jl>h2,#jl>.listhead{grid-column:1/-1}
}`;document.head.appendChild(st);
const own=()=>sessionStorage.fdOwner==='1'||(typeof role!=='undefined'&&role==='Owner');
const more="(view='',render(),window.ftSimpleMore&&ftSimpleMore())";
window.ftReadyInv=()=>list('Ready to invoice',jobs.filter(j=>j.status=='complete'&&!j.invoice).sort(byNew),'aview');
const T={
 own:[['home','🏠','Home',"ownerHome()"],['quotes','📝','Quotes',"ownerSect('quotes')"],['jobs','🌳','Jobs',"ownerSect('jobs')"],['money','💵','Money',"ownerSect('money')"],['rcps','🧾','Receipts',"ftReceipts()"],['timber','🌲','Ask Timber',"ftTimber()"],['more','☰','More',"ownerSect('more')"]],
 Manager:[['home','🏠','Home',"view='';render()"],['quotes','📝','Quotes',"ftJobs('sent')"],['jobs','🌳','Jobs',"ftJobs('jobs')"],['sched','📅','Schedule',"sched()"],['cust','👥','Customers',"openCusts()"],['timber','🌲','Ask Timber',"ftTimber()"],['more','☰','More',more]],
 Admin:[['home','🏠','Home',"view='';render()"],['ready','🧾','Ready to invoice',"ftReadyInv()"],['inv','💵','Invoices',more],['pay','💳','Payments',"ftJobs('invoiced')"],['cust','👥','Customers',"openCusts()"],['more','☰','More',more]],
 Crew:[['home','🏠','Home',"view='';render()"],['jobs','🌳','My jobs',"(view='',render(),window.ftSimpleMore&&ftSimpleMore())"],['clock','⏱','Clock in or out',"clockTap()"],['more','☰','More',more]]};
let KEY='',CUR='home';
function tabs(){if(typeof role==='undefined'||!role)return null;return own()?T.own:T[role]||null}
function draw(){const t=tabs(),k=(t?(own()?'own':role):'')+'|'+CUR;document.body.classList.toggle('dk',!!t);if(k===KEY)return;KEY=k;let s=document.getElementById('dside');
 if(!t){if(s)s.remove();return}if(!s){s=document.createElement('nav');s.id='dside';s.setAttribute('aria-label','Main');document.body.appendChild(s)}
 s.innerHTML=`<div class="dsl">${own()?'Owner':role==='Manager'?'Estimator':role==='Admin'?'Office':'Crew'}</div>`+t.map(([id,i,l,f])=>`<button type="button" id="ds-${id}" class="${id===CUR?'on':''}" data-f="${f.replace(/"/g,'&quot;')}"><i>${i}</i>${l}</button>`).join('');
 s.querySelectorAll('button').forEach(b=>b.onclick=()=>{CUR=b.id.slice(3);KEY='';draw();try{if(typeof armBack==='function')armBack(null);(new Function(b.dataset.f))();window.scrollTo(0,0)}catch(e){console.log(e)}})}
window.ftDeskDraw=()=>{KEY='';draw()};
// Highlight follows whichever page is open, however it was opened (sidebar, home buttons, Timber, back).
const HOOK={ownerHome:()=>'home',ftTimber:()=>'timber',sched:()=>'sched',openCusts:()=>'cust',ftReadyInv:()=>'ready',ftSimpleMore:()=>role==='Admin'?null:'more',clockTap:null,ftSupplies:()=>'more',ftVnxt:()=>'more',ftScanReceipt:()=>role==='Crew'&&!own()?'home':'more',ftReceipts:()=>own()?'rcps':'more',
 ownerSect:k=>({home:'home',dash:'home',quotes:'quotes',jobs:'jobs',money:'money',timber:'timber'})[k]||'more',
 ftJobs:k=>own()?null:role==='Admin'?(/invoiced|paid/.test(k||'')?'pay':null):role==='Manager'?(/sent|quote/.test(k||'')?'quotes':'jobs'):'jobs',render:()=>!view?'home':null};
function hook(){for(const n in HOOK){const f=window[n];if(typeof f!=='function'||f.__dk||!HOOK[n])continue;const g=function(){const r=f.apply(this,arguments);try{const c=HOOK[n].apply(null,arguments);if(c&&(tabs()||[]).some(t=>t[0]===c)&&c!==CUR){CUR=c;KEY='';draw()}}catch(e){}return r};g.__dk=1;window[n]=g}}
const hh=()=>{const h=document.getElementById('topstick');if(h)document.documentElement.style.setProperty('--hdrh',h.offsetHeight+'px')};
hook();setInterval(()=>{hook();draw();hh()},700);window.addEventListener('resize',hh);
window.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#brand,#navhome')){CUR='home';KEY=''}},true);
})();
