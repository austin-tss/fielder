// Fielder Owner page (modeled on Miller's owner.js): team with roles, permissions, PINs and pay rates; view as any role;
// clock anyone in or out; who's on the clock; labor cost per day (hours x pay rate). Server enforces the same rules.
(function(){
const PL={quotes:'Quotes',schedule:'Schedule',projects:'Projects',crew:'Crew photos / job complete',clock:'Time clock',invoices:'Invoices',hours:'Crew hours',employees:'Employees'};
const PERMS=Object.keys(PL);
const DEF={Manager:['quotes','schedule','projects'],Crew:['crew','clock'],Admin:['invoices','hours','employees','projects'],Owner:PERMS.slice()};
const RL={Manager:'Estimator',Crew:'Crew',Admin:'Admin',Owner:'Owner'};
const MIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
let TEAM=null,EDIT=null,NOW=[],LAB={from:'',to:'',label:'Today',r:null,err:''};
const css=document.createElement('style');css.textContent=`
#owbar{display:block;width:100%;border:0;background:#78a22f;color:#fff;font-size:17px;font-weight:800;padding:10px;cursor:pointer}#owbar[hidden]{display:none}
.owc h2{margin-top:0}.owon{display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid #e3e8da}.owon:first-of-type{border-top:0}.owon b{flex:1;font-size:18px;color:#112337}.owon small{display:block;font-weight:400;color:#475569}
.owon .btn{width:auto;margin:0;padding:12px 16px;font-size:16px}.owgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.owgrid .btn{margin:0}
.owbig{font-size:34px;font-weight:800;color:#112337;margin:4px 0}.empc h3{margin:0 0 4px;font-size:21px;color:#112337}.pinv{font-size:22px;letter-spacing:4px;font-weight:800;color:#112337}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.chip{background:#eef5e2;color:#4d6b1a;border-radius:999px;padding:4px 10px;font-size:14px;font-weight:700}
.permg{display:grid;gap:8px;margin:8px 0}.permg label{display:flex;align-items:center;gap:12px;font-size:18px;background:#fff;border:2px solid #dde3d3;border-radius:12px;padding:14px;margin:0;font-weight:600}.permg input{width:26px;height:26px;flex:none}
.labd{border-top:1px solid #e3e8da;padding:10px 0}.labd .h{display:flex;justify-content:space-between;font-size:18px;font-weight:800;color:#112337}.labd .p{display:flex;justify-content:space-between;font-size:15px;color:#475569;padding:2px 0 0 10px}
.labr{display:flex;flex-wrap:wrap;gap:8px}.labr .btn{flex:1 1 40%;margin:0;padding:12px;font-size:16px}.labr .btn.on{background:#112337;color:#fff}`;document.head.appendChild(css);
const isOwner=()=>sessionStorage.fdOwner==='1';
const hrs=h=>(Math.round((+h||0)*100)/100).toFixed(2);
const tm=iso=>new Date(iso).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
async function team(){try{TEAM=(await api({a:'empList'})).employees||[]}catch(e){TEAM=TEAM||[]}return TEAM}
async function loadNow(){try{const r=await api({a:'clockList',from:ymd(new Date()),to:ymd(new Date())});NOW=r.now||[]}catch(e){NOW=[]}return NOW}
function bar(){let b=document.getElementById('owbar');const show=isOwner()&&role&&role!=='Owner';
 if(show&&!b){b=document.createElement('button');b.id='owbar';b.type='button';b.textContent='← Back to Owner page';b.onclick=()=>ownerBack();(document.getElementById('topstick')||document.body).appendChild(b)}if(b)b.hidden=!show}
window.ownerAs=function(r){if(!isOwner())return;role=sessionStorage.fdRole=r;view='';cur=null;editId='';render();bar();window.scrollTo(0,0)};
window.ownerBack=function(){if(!isOwner())return;role=sessionStorage.fdRole='Owner';view='';cur=null;render();bar();window.scrollTo(0,0)};
window.ownerHome=function(){view='';if(typeof armBack==='function')armBack(null);bar();
 A.innerHTML=`<h2 style="margin:6px 0 12px">Owner</h2>
 <button class="btn huge n" id="custbtn" type="button" onclick="openCusts()" style="margin-bottom:12px">👥 Customers</button>
 <div class="card owc" id="ow-now"><h2>On the clock now</h2><p class="muted">Loading…</p></div>
 <div class="card owc" id="ow-lab"><h2>Labor today</h2><p class="muted">Loading…</p></div>
 <div class="card owc"><h2>Clock someone in</h2><select id="ow-who" style="width:100%;font-size:18px;padding:14px;border:2px solid #cfd6c4;border-radius:10px"><option value="">Pick a person</option></select><button class="btn huge" id="ow-in" type="button" onclick="ownerClock('clockIn',$('#ow-who').value)">Clock In</button></div>
 <div class="card owc"><button class="btn huge" id="ow-team" type="button" onclick="ownerTeam()">👥 Team, PINs, pay &amp; permissions</button><button class="btn huge n" id="ow-labor" type="button" onclick="ownerLabor('today')">💲 Labor cost</button><button class="btn n" id="ow-hours" type="button" onclick="openHours()">🕒 Crew hours &amp; punch fixes</button>
 <div class="owgrid" style="margin-top:12px"><button class="btn gr" id="ow-mgr" type="button" onclick="ownerAs('Manager')">📝 Estimator view</button><button class="btn gr" id="ow-crew" type="button" onclick="ownerAs('Crew')">🌳 Crew view</button><button class="btn gr" id="ow-admin" type="button" onclick="ownerAs('Admin')">💵 Admin view</button><button class="btn gr" type="button" onclick="ownerAs('Manager');sched()">📅 Schedule</button></div></div>`;
 fill()};
async function fill(){const [t,n]=await Promise.all([team(),loadNow()]);let lab=null;try{lab=await api({a:'labor',from:ymd(new Date()),to:ymd(new Date())})}catch(e){}
 const c=document.getElementById('ow-now');if(!c)return;
 c.innerHTML='<h2>On the clock now ('+n.length+')</h2>'+(n.length?n.map(p=>`<div class="owon"><b>${esc(p.who)}<small>since ${tm(p.in)}${p.long?' · over 16 h':''}</small></b><button class="btn n" type="button" data-who="${esc(p.who)}" onclick="ownerClock('clockOut',this.dataset.who)">Clock Out</button></div>`).join(''):'<p class="muted">Nobody is clocked in.</p>');
 const l=document.getElementById('ow-lab');if(l)l.innerHTML='<h2>Labor today</h2>'+(lab&&lab.ok?`<div class="owbig">${money(lab.cost)}</div><p class="muted">${hrs(lab.hours)} hours${lab.missingRate&&lab.missingRate.length?' · no pay rate for '+esc(lab.missingRate.join(', ')):''}</p>`:'<p class="muted">Labor cost needs the Field Desk script update.</p>');
 const s=document.getElementById('ow-who');if(s){const on=new Set(n.map(p=>String(p.who).toLowerCase()));s.innerHTML='<option value="">Pick a person</option>'+t.filter(u=>!on.has(String(u.name).toLowerCase())).map(u=>`<option>${esc(u.name)}</option>`).join('')}}
window.ownerClock=async function(a,who){who=String(who||'').trim();if(!who)return toast('Pick a person'),false;
 try{const r=await api({a,forWho:who});toast((a==='clockIn'?'Clocked in ':'Clocked out ')+who+(r&&r.today!=null?' · '+hrs(r.today)+' h today':''));if(role==='Owner'&&document.getElementById('ow-now'))fill();return true}catch(e){toast(e.message);return false}};
// ---- Team ----
window.ownerTeam=async function(){view='owteam';EDIT=null;armBack(()=>ownerHome());A.innerHTML='<div class="card"><h2>Team</h2><p class="muted">Loading…</p></div>';window.scrollTo(0,0);await team();if(view==='owteam')teamScreen()};
function teamScreen(){armBack(()=>ownerHome());const order={Owner:0,Admin:1,Manager:2,Crew:3};const l=(TEAM||[]).slice().sort((a,b)=>(order[a.role]-order[b.role])||String(a.name).localeCompare(b.name));
 A.innerHTML=`<div class="card"><h2>Team (${l.length})</h2><p class="muted">Each person signs in with their own 4-digit PIN. Permissions decide what they can do. Pay rate is used for labor cost.</p><button class="btn huge" id="ow-add" type="button" onclick="ownerEdit('')">+ Add employee</button></div>`+
 l.map(u=>`<div class="card empc" data-id="${esc(u.id)}"><h3>${esc(u.name)}</h3><div class="muted">${esc(RL[u.role]||u.role)}${u.email?' · '+esc(u.email):''} · ${u.payRate!=null?money(u.payRate)+'/hr':'<b style="color:#b45309">no pay rate</b>'}</div>
 <div>PIN <span class="pinv">${esc(u.pin||'••••')}</span></div><div class="chips">${(u.perms||DEF[u.role]||[]).map(p=>`<span class="chip">${esc(PL[p]||p)}</span>`).join('')}</div>
 <div class="row"><button class="btn n" type="button" onclick="ownerEdit('${esc(u.id)}')" style="flex:1">✏️ Edit</button><button class="btn" type="button" onclick="ownerDel('${esc(u.id)}')" style="flex:1;background:#fff;color:#b42318;border:2px solid #b42318">🗑 Remove</button></div></div>`).join('')}
const rpin=()=>{const used=new Set((TEAM||[]).map(u=>String(u.pin)));let p='';for(let i=0;i<60&&(!p||used.has(p));i++)p=String(1000+Math.floor(Math.random()*9000));return p};
window.ownerRpin=rpin;
window.ownerEdit=function(id,pre){view='owedit';const u=id?(TEAM||[]).find(x=>x.id===id):null;EDIT=u?u.id:'';armBack(()=>{view='owteam';teamScreen()});window.scrollTo(0,0);
 const r=u?u.role:'Crew',pm=u&&u.perms?u.perms:DEF[r];
 A.innerHTML=`<div class="card"><h2>${u?'Edit '+esc(u.name):'Add employee'}</h2>
 <label>Name</label><input id="owname" maxlength="80" value="${esc(u?u.name:(pre&&pre.name)||'')}" placeholder="First and last name">
 <label>Role</label><select id="owrole" onchange="ownerRole()" style="width:100%;font-size:18px;padding:14px;border:2px solid #cfd6c4;border-radius:10px">${Object.keys(RL).map(k=>`<option value="${k}" ${k===r?'selected':''}>${RL[k]}</option>`).join('')}</select>
 <label>Pay rate ($ per hour)</label><input id="owpay" inputmode="decimal" value="${u&&u.payRate!=null?esc(u.payRate):''}" placeholder="e.g. 22.50">
 <label>Personal PIN (4 digits)</label><div class="row"><input id="owpin" inputmode="numeric" maxlength="4" value="${u?esc(u.pin||''):rpin()}" style="flex:1;font-size:24px;letter-spacing:6px"><button class="btn gr" type="button" style="flex:none;width:auto;padding:0 16px;margin-top:0" onclick="$('#owpin').value=ownerRpin()">🎲 New</button></div>
 <label>Email (optional, gets their PIN)</label><input id="owemail" type="email" value="${u?esc(u.email||''):''}" placeholder="name@example.com">
 <label>Permissions</label><div class="permg" id="owperms">${PERMS.map(p=>`<label><input type="checkbox" value="${p}" ${pm.includes(p)?'checked':''}>${PL[p]}</label>`).join('')}</div>
 <button class="btn huge" id="owsave" type="button" onclick="ownerSave()">💾 Save</button><button class="btn gr" type="button" onclick="view='owteam';teamScreen()">Cancel</button></div>`};
window.ownerRole=function(){const r=$('#owrole').value;document.querySelectorAll('#owperms input').forEach(i=>i.checked=DEF[r].includes(i.value))};
window.ownerSave=async function(){const d={a:EDIT?'empEdit':'empAdd',id:EDIT||undefined,name:$('#owname').value.trim(),role:$('#owrole').value,newPin:$('#owpin').value.trim(),email:$('#owemail').value.trim(),payRate:$('#owpay').value.trim(),perms:[...document.querySelectorAll('#owperms input:checked')].map(i=>i.value)};
 if(!d.name)return toast('Add the name');if(!/^\d{4}$/.test(d.newPin))return toast('PIN must be 4 digits');if(d.payRate&&!/^\$?\d+(\.\d{1,2})?$/.test(d.payRate))return toast('Pay rate like 22.50');
 const b=$('#owsave');b.disabled=true;b.textContent='Saving…';
 try{const r=await api(d);TEAM=r.employees||TEAM;toast((EDIT?'Saved ':'Added ')+d.name);view='owteam';teamScreen()}catch(e){toast(e.message);b.disabled=false;b.textContent='💾 Save'}};
window.ownerDel=async function(id){const u=(TEAM||[]).find(x=>x.id===id);if(!u||!confirm('Remove '+u.name+'? Their PIN stops working right away.'))return;
 try{const r=await api({a:'empDel',id});TEAM=r.employees||[];toast('Removed '+u.name);teamScreen()}catch(e){toast(e.message)}};
// ---- Labor cost ----
function range(k){const d=new Date();d.setHours(0,0,0,0);const t=new Date(d);let f=new Date(d),label='Today';
 if(k==='yesterday'){f.setDate(f.getDate()-1);t.setDate(t.getDate()-1);label='Yesterday'}
 else if(k==='week'){f.setDate(f.getDate()-f.getDay());label='This week'}
 else if(k==='lastweek'){f.setDate(f.getDate()-f.getDay()-7);t.setTime(f.getTime());t.setDate(t.getDate()+6);label='Last week'}
 return {from:ymd(f),to:ymd(t),label,k}}
window.ownerLabor=async function(k){const g=range(k||'today');Object.assign(LAB,g,{r:null,err:''});view='owlabor';armBack(()=>ownerHome());laborScreen();window.scrollTo(0,0);
 try{LAB.r=await api({a:'labor',from:g.from,to:g.to})}catch(e){LAB.err=e.message}if(view==='owlabor')laborScreen()};
window.ownerLaborRange=async function(){const f=$('#labf').value,t=$('#labt').value;if(!f||!t)return;Object.assign(LAB,{from:f,to:t,label:'Custom',k:'custom',r:null,err:''});laborScreen();try{LAB.r=await api({a:'labor',from:f,to:t})}catch(e){LAB.err=e.message}if(view==='owlabor')laborScreen()};
function laborScreen(){const r=LAB.r,fd=d=>new Date(d+'T12:00').toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'});
 A.innerHTML=`<div class="card"><h2>Labor cost · ${esc(LAB.label)}</h2><div class="labr">${[['today','Today'],['yesterday','Yesterday'],['week','This week'],['lastweek','Last week']].map(([k,l])=>`<button class="btn gr ${LAB.k===k?'on':''}" type="button" id="lab-${k}" onclick="ownerLabor('${k}')">${l}</button>`).join('')}</div>
 <div class="row" style="margin-top:10px"><input type="date" id="labf" value="${LAB.from}" style="flex:1"><input type="date" id="labt" value="${LAB.to}" style="flex:1"></div><button class="btn n" type="button" onclick="ownerLaborRange()">Show these dates</button></div>
 <div class="card" id="labout">${LAB.err?'<p>'+esc(LAB.err)+'</p>':!r?'<p class="muted">Loading…</p>':`<div class="owbig" id="labtot">${money(r.cost)}</div><p class="muted">${hrs(r.hours)} hours · hours × each person's pay rate</p>
 ${r.missingRate&&r.missingRate.length?`<p style="color:#b45309;font-weight:700">No pay rate for ${esc(r.missingRate.join(', '))}. Their hours are counted but cost $0. <button class="linkb" type="button" onclick="ownerTeam()">Set pay rates</button></p>`:''}
 ${r.days.slice().reverse().map(d=>`<div class="labd"><div class="h"><span>${fd(d.date)}</span><span>${money(d.cost)} · ${hrs(d.hours)} h</span></div>${d.people.map(p=>`<div class="p"><span>${esc(p.who)}</span><span>${hrs(p.hours)} h × ${p.rate!=null?money(p.rate):'—'} = ${p.cost!=null?money(p.cost):'—'}</span></div>`).join('')||'<div class="p"><span>No hours</span></div>'}</div>`).join('')}`}</div>`}
// ---- Voice: owner commands first, then the normal voice routes ----
function nameOf(q){q=String(q||'').toLowerCase().replace(/[^a-z' ]/g,' ').replace(/\s+/g,' ').trim();if(!q)return '';const l=TEAM||[];
 const hit=l.find(u=>u.name.toLowerCase()===q)||l.find(u=>u.name.toLowerCase().split(' ')[0]===q.split(' ')[0])||l.find(u=>u.name.toLowerCase().includes(q));
 return hit?hit.name:''}
function sayV(t){const s=document.getElementById('vhst');if(s)s.textContent=t;else toast(t)}
function hook(){if(!window.FDVH||FDVH._own)return;const base=FDVH.route;FDVH._own=1;
 FDVH.route=async function(raw){if(!isOwner())return base(raw);const t=String(raw||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();let m;
  const h=document.getElementById('vhheard');if(h)h.textContent='“'+raw+'”';
  if((m=t.match(/^(?:view|look|see|open) as (?:the )?(crew|estimator|manager|admin|office|owner)(?: view)?$/))||(m=t.match(/^(crew|estimator|admin) view$/))){const r={crew:'Crew',estimator:'Manager',manager:'Manager',admin:'Admin',office:'Admin'}[m[1]];if(!r)return ownerBack();ownerAs(r);return sayV('Viewing as '+RL[r])}
  if(/^(owner( page| home| view)?|back to owner( page)?|go to owner( page)?)$/.test(t)){ownerBack();return}
  m=t.match(/^(?:clock|punch) (in|out) (.+)$/);if(!m){const z=t.match(/^(?:clock|punch) (.+?) (in|out)$/);if(z)m=[z[0],z[2],z[1]]}
  if(m){await team();const who=nameOf(m[2]);if(!who){sayV('No one named '+m[2]+' on the team.');return}const ok=await ownerClock(m[1]==='in'?'clockIn':'clockOut',who);sayV(ok?(m[1]==='in'?'Clocked in ':'Clocked out ')+who:'Couldn’t clock '+who);return}
  if(/who'?s on the clock|who is on the clock|who'?s (working|clocked in)|who is (working|clocked in)|on the clock now/.test(t)){const n=await loadNow();if(role!=='Owner')ownerBack();else fill();sayV(n.length?n.length+' on the clock: '+n.map(p=>p.who).join(', '):'Nobody is on the clock.');return}
  if((m=t.match(/labor( cost)?|payroll|what did (labor|payroll) cost/))){const k=/yesterday/.test(t)?'yesterday':/last week/.test(t)?'lastweek':/week/.test(t)?'week':'today';await ownerLabor(k);const r=LAB.r;sayV(r&&r.ok!==false?LAB.label+': '+money(r.cost)+' for '+hrs(r.hours)+' hours':'Couldn’t load labor cost');return}
  if((m=t.match(/^(?:add|new|hire) (?:an |a )?(?:employee|person|crew member|worker)(?: (?:named|called))? ?(.*)$/))){await team();ownerEdit('',{name:(m[1]||'').replace(/\b\w/g,c=>c.toUpperCase())});return sayV('Add employee. Check role, pay and PIN, then Save.')}
  if(/^(team|employees|staff|my team|show (the )?team)$/.test(t)){ownerTeam();return}
  if((m=t.match(/^(?:set|change|make) (.+?)'?s? (?:pay|pay rate|rate|wage) (?:to )?\$?(\d+(?:\.\d{1,2})?)(?: dollars)?(?: an hour| per hour)?$/))){await team();const nm=nameOf(m[1]),u=(TEAM||[]).find(x=>x.name===nm);if(!u)return sayV('No employee named '+m[1]);
   if(!confirm('Set '+u.name+'’s pay to '+money(m[2])+'/hr?'))return sayV('Cancelled');try{await api({a:'empEdit',id:u.id,name:u.name,role:u.role,email:u.email||'',perms:u.perms||undefined,payRate:m[2]});await team();sayV(u.name+' is now '+money(m[2])+'/hr')}catch(e){sayV(e.message)}return}
  if(/^(crew hours|hours|time ?sheets?|punches)$/.test(t)&&role==='Owner'){openHours();return}
  if(/^(go )?home$/.test(t)&&role==='Owner'){ownerHome();return}
  if(role==='Owner'){const r={quote:'Manager',schedule:'Manager',invoice:'Admin',settings:'Manager'};const k=Object.keys(r).find(x=>t.includes(x));if(k){role=sessionStorage.fdRole=r[k];bar()}}
  return base(raw)};}
// ---- Hide what a signed-in employee has no permission for (Owner sees everything). ----
const HIDE={quotes:['[onclick^="newq"]','#row-qn','#row-fq'],schedule:['#row-sched'],employees:['#row-emp'],hours:['#row-hours'],clock:['#clockc'],crew:['#jc']};
function perms(){try{return JSON.parse(sessionStorage.fdPerms||'null')}catch(e){return null}}
function gate(){const p=perms();if(!p||isOwner())return;for(const k in HIDE)if(!p.includes(k))HIDE[k].forEach(s=>document.querySelectorAll(s).forEach(el=>{el.hidden=true;el.style.display='none'}))}
new MutationObserver(()=>{gate();bar();hook()}).observe(document.getElementById('app')||document.body,{childList:true});
hook();bar();
window.FDOwner={nameOf,range};
})();
