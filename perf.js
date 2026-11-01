// Fielder speed layer (ported from Miller v7): instant tap feedback, cached reads (memory + localStorage, stale-while-revalidate),
// one bundled read call at sign-in, cache refresh after writes, keep-warm pings, and a thin activity bar.
(function(){
const css=document.createElement('style');css.textContent=`button,.btn,a.btn,.srow,.dc,.job{touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:transform .06s,filter .06s}
button:active,.btn:active,.srow:active,.dc:active,.job:active{transform:scale(.97);filter:brightness(.9)}
#pbar{position:fixed;left:0;top:0;height:3px;width:0;background:#78a22f;z-index:200;transition:width .3s;pointer-events:none}#pbar.on{width:70%;transition:width 4s ease-out}`;document.head.appendChild(css);
const bar=document.createElement('div');bar.id='pbar';document.body.appendChild(bar);let inflight=0;const busy=d=>{inflight+=d;bar.className=inflight>0?'on':'';if(inflight<=0){bar.style.width='100%';setTimeout(()=>{bar.style.width='';bar.className=''},250)}};
const READ={fGet:1,dash:1,empList:1,eqList:1,stormList:1,costSummary:1,followList:1,safetyReport:1,gpsMap:1,qnList:1,laborDay:1,laborCmp:1,sigImg:1,labor:1,clockList:1,portalLink:1};
const NOBUST={portalLink:1,sigImg:1};const LSK='fdc:';let MEM={};const who=()=>myPin();
const k=b=>{const o=Object.assign({},b);delete o.pin;delete o.who;return who()+'|'+JSON.stringify(o,Object.keys(o).sort())};
function get(key){if(MEM[key])return MEM[key];try{const v=JSON.parse(localStorage[LSK+key]||'null');if(v)MEM[key]=v;return v}catch(e){return null}}
function put(key,v){const e={t:Date.now(),v};MEM[key]=e;try{localStorage[LSK+key]=JSON.stringify(e)}catch(x){try{Object.keys(localStorage).filter(z=>z.indexOf(LSK)===0).forEach(z=>localStorage.removeItem(z));localStorage[LSK+key]=JSON.stringify(e)}catch(y){}}}
function bust(){const keep={};Object.keys(MEM).forEach(x=>{if(NOBUST[JSON.parse(x.split('|').slice(1).join('|')||'{}').a])keep[x]=MEM[x]});MEM=keep;try{Object.keys(localStorage).filter(z=>z.indexOf(LSK)===0&&!/"a":"(portalLink|sigImg)"/.test(z)).forEach(z=>localStorage.removeItem(z))}catch(e){}}
const RAW=window.api;const pend={};
async function fetchRead(body,key){if(pend[key])return pend[key];busy(1);pend[key]=RAW(body).then(v=>{put(key,v);return v}).finally(()=>{busy(-1);delete pend[key]});return pend[key]}
window.api=api=async function(body){if(!body||!body.a)return RAW(body);
 if(READ[body.a]){
  if(body.a==='costSummary'&&body.id){const all=get(k({a:'costSummary'}));if(all){const r=JSON.parse(JSON.stringify(all.v));r.jobs=(r.jobs||[]).filter(x=>x.id==body.id);if(Date.now()-all.t>20000)fetchRead({a:'costSummary'},k({a:'costSummary'})).catch(()=>{});return r}}
  const key=k(body),c=get(key);if(c&&Date.now()-c.t<15*60000){if(Date.now()-c.t>20000)fetchRead(body,key).catch(()=>{});return JSON.parse(JSON.stringify(c.v))}return fetchRead(body,key)}
 if(/^(login|aiKeys|fKeys|timber)$/.test(body.a))return RAW(body);
 const undo=optimistic(body);
 busy(1);try{const r=await RAW(body);bust();clearTimeout(window.__pfT);window.__pfT=setTimeout(prefetch,1200);return r}catch(e){if(undo){undo();toast('Not saved: '+(e.message||e))}throw e}finally{busy(-1)}};
// Optimistic writes: the screen changes on tap; if the server says no, the change is undone.
function optimistic(b){try{if(typeof jobs==='undefined')return null;const snap=[];const keep=j=>{snap.push([j,JSON.stringify(j)])};
 if(b.a==='paid'){const j=jobs.find(x=>x.id==b.id);if(!j||!j.invoice)return null;keep(j);j.invoice.paid=b.paid!==false}
 else if(b.a==='setStatus'&&Array.isArray(b.ids)){jobs.filter(x=>b.ids.indexOf(x.id)>=0).forEach(j=>{keep(j);j.status=b.status})}
 else if(b.a==='costAdd'){const j=jobs.find(x=>x.id==b.id);if(!j)return null;keep(j);j.costs=(j.costs||[]).concat([{id:'tmp',kind:b.kind,amt:+b.amt||0,note:b.note||'',at:new Date().toISOString()}])}
 else return null;if(!snap.length)return null;window.FDOPT=(window.FDOPT||0)+1;try{typeof saveCache==='function'&&saveCache()}catch(e){}
 return ()=>{snap.forEach(([j,s])=>{const o=JSON.parse(s);Object.keys(j).forEach(k=>delete j[k]);Object.assign(j,o)});try{typeof saveCache==='function'&&saveCache()}catch(e){}}}catch(e){return null}}
window.ftOptimistic=optimistic;
async function prefetch(){if(!role||!myPin())return;try{busy(1);const r=await RAW({a:'bundle'});(r.items||[]).forEach(x=>put(k(x.body),x.res))}catch(e){}finally{busy(-1)}}
window.fdPrefetch=prefetch;window.fdCacheBust=bust;
// Keep the Apps Script warm (a harmless public read, never a PIN check).
function warm(){if(document.hidden||typeof API==='undefined'||!API)return;fetch(API+(API.indexOf('?')<0?'?':'&')+'a=quotePublic&t=warm').catch(()=>{})}
setTimeout(warm,2500);setInterval(warm,4*60000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)warm()});
// Prefetch everything once per sign-in, and again on app open.
let lastRole='';setInterval(()=>{if(role&&role!==lastRole&&sessionStorage.fdPin){lastRole=role;if(!sessionStorage.fdPf){sessionStorage.fdPf='1';prefetch()}}if(!role){lastRole='';sessionStorage.removeItem('mtPf')}},300);
if(role)prefetch();
// always start each screen at the top; keep the header height in a CSS var for the sticky nav
try{history.scrollRestoration='manual'}catch(e){}
const hd=()=>{const h=document.getElementById('topstick')||document.querySelector('header');if(h)document.documentElement.style.setProperty('--hdrh',h.getBoundingClientRect().height+'px')};
hd();addEventListener('resize',hd);addEventListener('load',()=>{hd();scrollTo(0,0)});
let lastV=null;const top0=()=>{hd();const v=typeof view!=='undefined'?view:null;if(v!==lastV){lastV=v;scrollTo(0,0)}};
const app=document.getElementById('app');if(app)new MutationObserver(top0).observe(app,{childList:true});
})();
