// Fielder: low-confidence "Double-check this" flags + spoken-address correction (Photon / OpenStreetMap, Tallahassee bias).
(function(){
const css=document.createElement('style');css.textContent=`
.lcf{border-left:5px solid #e0a526!important;background:#fffaf0!important}
.lcn{display:flex;align-items:center;gap:8px;margin:4px 0 10px;font-size:14px;color:#7a5a12}
.lcn i{width:9px;height:9px;border-radius:50%;background:#e0a526;flex:0 0 9px}
.lcn span{flex:1}.lcn button{border:1px solid #c9d3bd;background:#fff;color:#112337;border-radius:8px;padding:6px 10px;font-size:14px;font-weight:700;margin:0}
.lcn button.ok{border-color:#78a22f;color:#4f6e1c}`;document.head.appendChild(css);
const SFX={dr:'drive',st:'street',rd:'road',ave:'avenue',av:'avenue',ln:'lane',ct:'court',cir:'circle',blvd:'boulevard',pl:'place',trl:'trail',ter:'terrace',hwy:'highway',pkwy:'parkway',wy:'way',cv:'cove',xing:'crossing'};
const norm=s=>String(s||'').toLowerCase().replace(/[.,]/g,' ').split(/\s+/).filter(Boolean).map(w=>SFX[w]||w).join(' ');
function lev(a,b){const m=a.length,n=b.length,d=[...Array(n+1).keys()];for(let i=1;i<=m;i++){let p=d[0];d[0]=i;for(let j=1;j<=n;j++){const t=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,p+(a[i-1]===b[j-1]?0:1));p=t}}return d[n]}
const sim=(a,b)=>1-lev(a,b)/Math.max(a.length,b.length,1);
function clearFlag(el){if(!el)return;el.classList.remove('lcf');const n=document.getElementById(el.id+'-lc');if(n)n.remove();delete el.dataset.lc}
function flag(id,msg,undo){const el=document.getElementById(id);if(!el)return;clearFlag(el);el.classList.add('lcf');el.dataset.lc='1';el.title='Double-check this';
 const n=document.createElement('div');n.className='lcn';n.id=id+'-lc';n.innerHTML='<i></i><span></span>';n.querySelector('span').textContent=msg||'Double-check this';
 if(undo){const u=document.createElement('button');u.type='button';u.textContent='Undo';u.onclick=()=>{el.value=undo;clearFlag(el);el.dispatchEvent(new Event('input',{bubbles:true}))};n.appendChild(u)}
 const ok=document.createElement('button');ok.type='button';ok.className='ok';ok.textContent='✓ Looks right';ok.onclick=()=>clearFlag(el);n.appendChild(ok);
 el.insertAdjacentElement('afterend',n);
 const off=e=>{if(e.isTrusted){clearFlag(el);el.removeEventListener('input',off)}};el.addEventListener('input',off)}
function phoneOk(p){const d=String(p||'').replace(/\D/g,'');return d.length===10||(d.length===11&&d[0]==='1')}
// Returns {ok:true} | {fixed,from,to} | {unknown:true} | {offline:true}
async function checkAddress(addr){const a=String(addr||'').trim();const m=a.match(/^\s*(\d+[a-z]?)\s+([^,]+?)\s*(,.*)?$/i);if(!m)return {unknown:true};
 const num=m[1],street=m[2].trim(),rest=m[3]||', Tallahassee, FL';const cityM=(rest.split(',')[1]||'Tallahassee').trim();const city=cityM.toLowerCase();
 if(navigator.onLine===false)return {offline:true};
 const words=street.split(/\s+/),q=[street,words[0]+(words[1]?' '+words[1]:''),words[0].slice(0,4)+' '+(words.slice(1).join(' '))];
 const seen=new Map();
 try{for(const s of [...new Set(q)]){const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),6000);
   const r=await fetch('https://photon.komoot.io/api/?layer=street&limit=15&lat=30.44&lon=-84.28&q='+encodeURIComponent(s+' '+cityM),{signal:ctl.signal});clearTimeout(t);const j=await r.json();
   (j.features||[]).forEach(f=>{const p=f.properties||{};if(p.name&&(String(p.city||'').toLowerCase()===city||String(p.county||'').toLowerCase()==='leon'))seen.set(norm(p.name),p.name)});
   if(seen.has(norm(street)))return {ok:true}}}
 catch(e){return {offline:true}}
 const ns=norm(street);let best=null,bs=0;for(const [k,v] of seen){const sc=sim(ns,k);if(sc>bs){bs=sc;best=v}}
 if(best&&bs>=0.7){const fixed=num+' '+best+rest;return {fixed,from:street,to:best}}
 return {unknown:true}}
async function fixAddressField(id){const el=document.getElementById(id);if(!el||!el.value.trim())return;const orig=el.value;const r=await checkAddress(orig);
 if(el.value!==orig)return;
 if(r.fixed){el.value=r.fixed;el.dispatchEvent(new Event('input',{bubbles:true}));flag(id,'Corrected from '+r.from+'. Double-check this',orig)}
 else if(r.unknown)flag(id,'Could not find this street. Double-check this');
 else if(r.offline)flag(id,'Offline: address not checked. Double-check this')}
// o = Gemini result (optional o.uncertain:[...] or o.confidence:{field:0..1}); conf = lowest Web Speech confidence (0..1 or null)
function applyFlags(o,conf){o=o||{};const c=o.customer||{};const map={name:'nm',phone:'ph',email:'em',address:'ad'};
 const unc=new Set([].concat(o.uncertain||[],(c.uncertain||[])).map(x=>String(x).toLowerCase().replace(/^customer\./,'')));
 const cf=Object.assign({},o.confidence||{},c.confidence||{});Object.keys(cf).forEach(k=>{if(Number(cf[k])<0.7)unc.add(k.toLowerCase().replace(/^customer\./,''))});
 const low=conf!=null&&conf<0.75;
 Object.keys(map).forEach(k=>{const el=document.getElementById(map[k]);if(!el||!el.value.trim()||k==='address')return;
  if(k==='phone'&&!phoneOk(el.value))return flag('ph','Phone number looks incomplete. Double-check this');
  if(unc.has(k)||(low&&k==='name'))flag(map[k],'May not have heard this right. Double-check this')});
 if(unc.has('items')||unc.has('price')||unc.has('prices'))window.FD_ITEMS_LC=1;
 if(c.address)fixAddressField('ad').then(()=>{const el=document.getElementById('ad');if(el&&!el.dataset.lc&&(unc.has('address')||low))flag('ad','May not have heard this right. Double-check this')})}
window.FDFlags={flag,clearFlag,checkAddress,fixAddressField,applyFlags,phoneOk,sim,norm};
})();
