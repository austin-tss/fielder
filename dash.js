// Fielder Owner numbers dashboard (one screen, sticky tab bar, every number drills down) + job status chips.
// Ported from Miller v7 (e99cdbd) with Fielder branding. The old Owner home lives on as the "Team & Time" tab.
(function(){
const usd0=v=>'$'+Math.round(Number(v||0)).toLocaleString('en-US');
const ymdL=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const css=document.createElement('style');css.textContent=`
.dnav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin:0 -12px 8px;padding:6px 12px;position:sticky;top:var(--hdrh,0px);z-index:7;background:#f6f7f4;box-shadow:0 3px 6px -4px rgba(0,0,0,.2)}
.dnav button{margin:0;min-height:38px;border-radius:10px;border:1.5px solid #dfe3da;background:#fff;color:#112337;font-weight:800;font-size:11.5px;line-height:1.05;padding:2px 2px;display:flex;align-items:center;justify-content:center;gap:2px;white-space:normal;text-align:center;overflow:hidden}.dnav button i{font-style:normal;font-size:13px}
.dnav button.go{background:#112337;color:#fff;border-color:#112337}.dnav button.hm{background:#78a22f;color:#fff;border-color:#78a22f}
.dgrid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px}.dc{min-width:0;overflow:hidden;background:#fff;border:0;border-radius:14px;box-shadow:0 1px 3px rgba(17,35,55,.12);padding:6px 11px;text-align:left;font:inherit;color:#112337;cursor:pointer;min-height:0;margin:0}
.dc small{display:block;font-size:11.5px;color:#5b6168;font-weight:700;text-transform:uppercase;letter-spacing:.3px}.dc b{display:block;font-size:21px;line-height:1.12;color:#112337}.dc span{display:block;font-size:12px;color:#5b6168;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dc.g b{color:#34460d}.dc.w{grid-column:1/3}.dalert{background:#fdf0e6;border-radius:12px;color:#7a3e10;padding:6px 10px;margin:0 0 7px;font-weight:700;font-size:13.5px;cursor:pointer}.dalert div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dalert .amore{display:none;white-space:normal}.dalert.open .amore{display:block}.dalert.open .a1{display:none}
.dhead{display:flex;align-items:center;justify-content:space-between;margin:-8px 0 4px}.dhead h2{margin:0;font-size:19px;color:#112337}.dhead small{display:block;color:#5b6168;font-size:13px}
.dtb{margin:0;width:auto;min-height:40px;padding:0 12px;border-radius:12px;border:0;background:#78a22f;color:#fff;font-weight:800;font-size:15px}
.sect .btn{margin:8px 0}body:has(#dgrid){padding-bottom:0!important}body:has(#dgrid) #app{padding-bottom:76px!important}`;document.head.appendChild(css);
const NAV=[['dash','🏠','Home'],['quotes','📝','Quotes'],['sched','📅','Schedule'],['jobs','🌳','Jobs / Crew'],['inv','💵','Invoices'],['team','⏱','Team &amp; Time'],['tools','🧰','Business tools'],['set','⚙️','Settings']];
const nav=cur=>`<div class="dnav" id="dnav">${NAV.map(([k,i,l])=>`<button type="button" id="dn-${k}" class="${k==='dash'?'hm':k===cur?'go':''}" onclick="ownerSect('${k}')"><i>${i}</i>${l}</button>`).join('')}</div>`;
window.ftDashNav=nav;
let DASH=null;
const isO=()=>role==='Owner';
function alerts(d){const a=[];if(d.storm&&d.storm.on)a.push('🌀 Storm mode ON · '+d.storm.open+' open storm call(s)');else if(d.storm&&d.storm.open)a.push('🌀 '+d.storm.open+' open storm call(s)');
 if(d.safety&&d.safety.missing.length)a.push('🦺 No safety checklist today: '+d.safety.missing.join(', '));if(d.equipmentDue&&d.equipmentDue.length)a.push('🛠 Service overdue: '+d.equipmentDue.join(', '));
 if(d.toSchedule&&d.toSchedule.length)a.push('📅 Approved, not scheduled: '+d.toSchedule.join(', '));return a}
const card=(id,label,val,sub,fn,cls)=>`<button type="button" class="dc ${cls||''}" id="${id}" onclick="${fn}"><small>${label}</small><b>${val}</b>${sub?`<span>${sub}</span>`:''}</button>`;
// Labor card: labor $ vs that day's job $, % green under 30, amber 30-45, red over 45.
window.ftPct=window.ftPct||((p,txt)=>`<span class="pp ${p==null?'pn':p<30?'pg':p<=45?'pa':'pr'}">${txt||(p==null?'—':Math.round(p)+'%')}</span>`);
function labSub(c){if(!c)return 'no hours yet';if(c.cmp)return usd0(c.cmp)+' job $ · '+ftPct(c.pct);return c.hours?c.hours.toFixed(1)+' h, no job $':'no hours yet'}
function draw(){if(view!=='odash'||!DASH)return;const d=DASH,al=alerts(d),tm=s=>{const[h,m]=String(s||'0:00').split(':');return ((+h+11)%12+1)+(m!=='00'?':'+m:'')+(+h<12?'a':'p')};
 A.innerHTML=`<div class="dhead"><div><h2>Owner dashboard</h2><small>${new Date().toLocaleDateString([],{weekday:'long',month:'long',day:'numeric'})}</small></div><button class="dtb" id="dtimber" type="button" onclick="ftTimber()">🌲 Timber</button></div>
 ${nav('dash')}${al.length?`<div class="dalert" id="dalert" onclick="this.classList.toggle('open')"><div class="a1">⚠️ ${al.length} alert${al.length>1?'s':''}: ${esc(al[0])}${al.length>1?' · tap':''}</div>${al.map(x=>`<div class="amore">${esc(x)}</div>`).join('')}</div>`:''}
 <div class="dgrid" id="dgrid">${card('dc-lab','Labor today',usd0(d.laborToday),labSub(d.laborCmp),"ftLaborCmp({period:'day',date:'"+d.today+"',vs:'jobs',by:'job',fby:'',fkey:''})",'w')}
 ${card('dc-wk','Revenue this week',usd0(d.invoicedWeek),usd0(d.paidWeek)+' collected',"ftJobs('paid')",'g')}${card('dc-mo','Revenue this month',usd0(d.invoicedMonth),'invoiced',"ftJobs('invoiced')",'g')}
 ${card('dc-open','Open invoices',usd0(d.unpaid.total),d.unpaid.count+' unpaid',"ftJobs('invoiced')")}${card('dc-q','Quotes waiting',d.openQuotes.count,usd0(d.openQuotes.total)+' out',"window.openOutstanding?(ownerAs('Manager'),openOutstanding()):ftJobs('sent')")}
 ${card('dc-appr','Approved',d.approved.count,usd0(d.approved.total)+' · '+(d.toSchedule||[]).length+' to schedule',"ftJobs('approved')")}${card('dc-close','Close rate',d.closeRate+'%',d.closeN+' won · 90 days',"ftJobs('all')")}
 ${card('dc-now','On the clock',d.onClock.length,d.onClock.join(', ')||'Nobody',"ownerSect('team')")}${card('dc-jobs','Today’s jobs',d.todayJobs.length,d.todayJobs.map(j=>tm(j.start)+' '+j.name).join(', ')||'None scheduled',"ftJobs('progress')")}</div>`}
const OH0=window.ownerHome;window.ftOwnerTeamTime=OH0;
window.ownerHome=async function(){if(!isO()&&sessionStorage.fdOwner==='1'){if(typeof window.ownerAs==='function'){ownerAs('Owner');if(view==='odash')return}else role=sessionStorage.fdRole='Owner'}if(!isO())return OH0&&OH0();view='odash';if(typeof armBack==='function')armBack(null);window.scrollTo(0,0);
 if(!DASH){try{DASH=JSON.parse(localStorage.fdDash||'null')}catch(e){}}
 if(!DASH)A.innerHTML=`<div class="dhead"><div><h2>Owner dashboard</h2><small>Loading numbers…</small></div></div>${nav('dash')}`;else draw();
 try{const r=await api({a:'dash'});DASH=r;try{localStorage.fdDash=JSON.stringify(r)}catch(e){}}catch(e){if(view==='odash'&&!DASH)A.insertAdjacentHTML('beforeend','<div class="card"><p>'+esc(e.message)+'</p></div>');return}draw()};
const big=(id,l,fn,cls)=>`<button class="btn huge ${cls||''}" id="${id}" type="button" onclick="${fn}">${l}</button>`;
const asM=fn=>`ownerAs('Manager');${fn}`;
const SECT={
 quotes:['📝 Quotes',()=>big('s-newq','+ New customer quote',asM('newq()'))+big('s-out','📨 Outstanding quotes',asM("window.openOutstanding?openOutstanding():ftJobs('sent')"),'n')+big('s-qn','📥 Quotes needed',asM('qn()'),'n')+big('s-fq','📁 All projects (filter by status)',"ftJobs('all')",'n')+big('s-cust','👥 Customers',"openCusts()",'n')],
 jobs:['🌳 Jobs / Crew',()=>big('s-alljobs','📁 All jobs (filter by status)',"ftJobs('all')")+big('s-crew','🌳 Crew view',"ownerAs('Crew')",'n')+big('s-map','🗺 Crew map',"ftMap()",'n')+big('s-profit','📈 Job profit',"ftProfit()",'n')+big('s-safe','🦺 Safety compliance',"ftSafeRep()",'n')+big('s-eq','🛠 Equipment',"ftEquip()",'n')],
 inv:['💵 Invoices',()=>big('s-inv','💵 Invoices (send, mark paid)',"ownerAs('Admin')")+big('s-open','📬 Open invoices',"ftJobs('invoiced')",'n')+big('s-paid','✅ Paid',"ftJobs('paid')",'n')+big('s-qb','📒 QuickBooks export',"ftQB()",'n')],
 tools:['🧰 Business tools',()=>big('s-timber','🌲 Ask Timber',"ftTimber()")+big('s-lc','💲 Labor compare',"ftLaborCmp()",'n')+(window.ftGrid?ftGrid():'')],
 set:['⚙️ Settings',()=>big('s-form','📝 Quote form, prices &amp; wording',"openSet()")+big('ft-set','💳 Payments, texts &amp; reviews',"ftSet()",'n')+big('s-tbset','🌲 Timber &amp; voice quotes setup',"ftTimberSetup()",'n')]};
window.ownerSect=function(k){if(k==='dash')return ownerHome();if(k==='sched')return ownerAs('Manager'),sched();
 if(k==='team'){if(OH0)OH0();view='osect';armBack(()=>ownerHome());const v=document.getElementById('vhome');if(v)v.remove();A.insertAdjacentHTML('afterbegin',nav('team'));window.scrollTo(0,0);return}
 const s=SECT[k];if(!s)return;view='osect';armBack(()=>ownerHome());window.scrollTo(0,0);A.innerHTML=`${nav(k)}<div class="card sect" id="sect-${k}"><h2>${s[0]}</h2>${s[1]()}</div>`};
// Timber setup: write-only Gemini key (same aiKeys action as voice quotes); only ever shows set / missing.
window.ftTimberSetup=function(){view='otbset';armBack(()=>ownerSect('set'));A.innerHTML=`${nav('set')}<div class="card"><h2>🌲 Timber setup</h2><p class="muted">Timber and voice quotes use your Google Gemini key. It is saved on the server and never shown again.</p><input id="tbkey" autocomplete="off" placeholder="Paste the key"><p class="muted" id="tbkst"></p>${big('tbksave','Save key',"ftTimberKey()")}</div>`;
 api({a:'aiKeys'}).then(r=>{const e=document.getElementById('tbkst');if(e&&r&&r.keys)e.textContent='Gemini key: '+r.keys.GEMINI_API_KEY}).catch(()=>{})};
window.ftTimberKey=async function(){const v=($('#tbkey')||{}).value||'';if(!v.trim())return toast('Paste the key first');try{const r=await api({a:'aiKeys',GEMINI_API_KEY:v.trim()});$('#tbkey').value='';toast('Gemini key: '+(r.keys&&r.keys.GEMINI_API_KEY||'saved'));ftTimberSetup()}catch(e){toast(e.message)}};
// ---------- Job status filter chips with counts (Owner / Admin / Estimator) ----------
const blkJ=()=>{const m={};(typeof blocks!=='undefined'?blocks:[]).forEach(b=>{if(b.job)(m[b.job]=m[b.job]||[]).push(b.date)});return m};
const FIL=[['all','All'],['sent','Sent'],['approved','Approved'],['scheduled','Scheduled'],['progress','In progress'],['complete','Complete'],['invoiced','Invoiced'],['paid','Paid'],['declined','Declined']];
function fmatch(k,j,bm,td){const ds=bm[j.id]||[];switch(k){case 'all':return true;case 'sent':return j.status==='sent'||j.status==='reply';case 'approved':return j.status==='approved'&&!ds.length;
 case 'scheduled':return j.status==='approved'&&ds.length>0&&ds.every(d=>d>td);case 'progress':return j.status==='approved'&&ds.some(d=>d<=td);case 'complete':return j.status==='complete';case 'invoiced':return j.status==='invoiced'&&!(j.invoice&&j.invoice.paid);
 case 'paid':return !!(j.invoice&&j.invoice.paid);case 'declined':return j.status==='declined';default:return false}}
window.ftJobCount=k=>{const bm=blkJ(),td=ymdL(new Date());return jobs.filter(j=>fmatch(k,j,bm,td)).length};
function chips(cur){const bm=blkJ(),td=ymdL(new Date());return `<div id="fchips" style="display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px">${FIL.map(([k,l])=>{const n=jobs.filter(j=>fmatch(k,j,bm,td)).length;
 return `<button type="button" id="fc-${k}" class="fchip${k===cur?' on':''}" onclick="ftJobs('${k}')" style="margin:0;min-height:46px;padding:8px 14px;border-radius:999px;font-weight:800;font-size:16px;border:1.5px solid ${k===cur?'#112337':'#dfe3da'};background:${k===cur?'#112337':'#fff'};color:${k===cur?'#fff':'#112337'}">${l} <span style="opacity:.75">${n}</span></button>`}).join('')}</div>`}
window.ftJobs=function(k){k=k||'all';if(role==='Owner')ownerAs('Manager');const bm=blkJ(),td=ymdL(new Date()),arr=jobs.filter(j=>fmatch(k,j,bm,td));
 const go=role==='Admin'?'aview':'mview',lab=(FIL.find(f=>f[0]===k)||['','Jobs'])[1];window.FTFIL=k;
 list((k==='all'?'All jobs':lab+' jobs')+' ('+arr.length+')',arr.slice().sort((a,b)=>String(b.created||'').localeCompare(String(a.created||''))),go,chips(k));window.scrollTo(0,0)};
const LIST0=window.list;if(typeof LIST0==='function')window.list=list=function(title,arr,go,extra){if(/^(My projects|Invoices)/.test(title)&&(role==='Manager'||role==='Admin')&&!/fchips/.test(extra||'')){window.FTFIL='all';extra=chips('all')+(extra||'')}return LIST0.call(this,title,arr,go,extra)};
// voice: "show scheduled jobs", "paid jobs", "dashboard"
const V0=window.FTV2;window.FTV2=function(t){t=String(t||'').toLowerCase().trim();let m;
 if((m=t.match(/^(?:show|open|filter|list)?\s*(?:me\s+)?(?:the\s+)?(all|scheduled|approved|sent|invoiced|paid|complete(?:d)?|declined|in progress|unpaid)\s*(?:jobs|projects|quotes|invoices)?$/))){
  if(role==='Crew')return V0?V0(t):false;const w=m[1],k={completed:'complete','in progress':'progress',unpaid:'invoiced'}[w]||w;ftJobs(k);return 'Showing '+w+' jobs'}
 if(/^(show |open )?(all )?jobs( list)?$|^job filters?$/.test(t)&&role!=='Crew'){ftJobs('all');return 'All jobs'}
 if(/^(show |open )?(the )?(owner )?dashboard$|^numbers$/.test(t)&&sessionStorage.fdOwner==='1'){if(window.ownerBack)ownerBack();return 'Dashboard'}
 return V0?V0(t):false};
})();
// Owner voice wrapper (owner.js) runs before vhome's route, so put the batch-2 voice intents ahead of it.
if(window.FDVH&&typeof FDVH.route==='function'){const R0=FDVH.route;FDVH.route=async function(raw){if(window.FTV2){const n=String(raw||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();const r=FTV2(n);if(r){const s=document.getElementById('vhst');if(s)s.textContent=r;const h=document.getElementById('vhheard');if(h)h.textContent='“'+raw+'”';return r}}return R0.apply(this,arguments)}}
