// Crew clock in/out (modeled on TSShourtracker). Punches queue on this phone first, then sync, so a dead zone never loses a punch.
(function(){
const LSK={name:'fdClockName',names:'fdClockNames',q:'fdClockQ',st:'fdClockSt'};
const rd=(k,d)=>{try{const v=JSON.parse(localStorage[k]||'null');return v==null?d:v}catch(e){return d}};
const wr=(k,v)=>{try{localStorage[k]=JSON.stringify(v)}catch(e){}};
let SOON=false,OFF=false,SYNCING=null;
window.clockName=()=>sessionStorage.fdName||rd(LSK.name,'');
const Q=()=>rd(LSK.q,[]);
const hrs=ms=>Math.max(0,ms)/36e5;
const fmtH=h=>(Math.round(h*100)/100).toFixed(2);
const tm=iso=>new Date(iso).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
const dt=iso=>new Date(iso).toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'});
function st(){const s=rd(LSK.st,null),w=clockName();return s&&s.who===w?s:{who:w,open:null,today:0,week:0,asOf:Date.now()}}
function liveSt(){const s=st(),now=Date.now();let t=s.today,wk=s.week;if(s.open){const from=Math.max(s.asOf,+new Date(s.open));t+=hrs(now-from);wk+=hrs(now-from)}
 if(new Date(s.asOf).toDateString()!==new Date(now).toDateString())t=s.open?hrs(now-new Date(new Date(now).toDateString())):0;return {open:s.open,today:t,week:wk}}
function fromServer(r){if(!r||r.who==null)return;wr(LSK.st,{who:r.who,open:r.open?r.open.in:null,today:+r.today||0,week:+r.week||0,asOf:Date.now()})}
window.clockCard=function(){const w=clockName();
 if(!w)return `<div class="card clockc" id="clockc"><h2>Time clock</h2><p class="muted">Pick your name once. This phone remembers it.</p><button class="btn huge" id="clockbtn" onclick="clockNameScreen()">Clock In</button></div>`;
 const s=liveSt(),q=Q();
 return `<div class="card clockc" id="clockc"><div class="clockwho">${esc(w)} <button type="button" class="linkb" onclick="clockNameScreen()">Not you?</button></div>
<div class="clockst ${s.open?'on':''}">${s.open?'● On the clock since '+tm(s.open):'○ Off the clock'}</div>
<button class="btn huge clockbig ${s.open?'n':''}" id="clockbtn" onclick="clockTap()">${s.open?'Clock Out':'Clock In'}</button>
<div class="clockh"><div><b id="clockToday">${fmtH(s.today)}</b><small>hours today</small></div><div><b id="clockWeek">${fmtH(s.week)}</b><small>hours this week</small></div></div>
${q.length?`<p class="clockq" id="clockq">${SOON?'Clock-in coming soon. ':OFF?'No signal. ':''}${q.length} punch${q.length>1?'es':''} saved on this phone${SOON?' and will sync when it goes live.':', will sync automatically.'}</p>`:''}</div>`};
function redraw(){const c=$('#clockc');if(c)c.outerHTML=clockCard()}
window.clockTap=function(){const w=clockName();if(!w)return clockNameScreen();const s=st(),now=Date.now(),at=new Date(now).toISOString(),a=s.open?'clockOut':'clockIn';
 const L=liveSt();wr(LSK.st,{who:w,open:s.open?null:at,today:L.today,week:L.week,asOf:now});
 const q=Q();q.push({a,who:w,at,cid:'C'+now.toString(36)+Math.random().toString(36).slice(2,8)});wr(LSK.q,q);
 if(navigator.vibrate)try{navigator.vibrate(40)}catch(e){}
 toast(a=='clockIn'?'Clocked in at '+tm(at):'Clocked out at '+tm(at));redraw();clockSync()};
window.clockSync=function(){if(SYNCING)return SYNCING;SYNCING=(async()=>{let changed=false;await 0;
 try{while(Q().length){const it=Q()[0];let r=null,err='';
  try{r=await api(Object.assign({},it,{offline:Date.now()-new Date(it.at)>60000}))}catch(e){err=e.message||''}
  if(/Bad action/i.test(err)){SOON=true;OFF=false;break}
  if(/did not answer|Failed to fetch|Busy|NetworkError/i.test(err)||(err&&!navigator.onLine)){OFF=true;break}
  SOON=false;OFF=false;wr(LSK.q,Q().slice(1));changed=true;
  if(err){toast(err);if(/PIN required|Wrong PIN/.test(err))break}
  if(r)fromServer(r)}
 if(!Q().length&&clockName()){try{const r=await api({a:'clockStatus',who:clockName()});SOON=false;fromServer(r);changed=true}catch(e){if(/Bad action/i.test(e.message||''))SOON=true}}
 }finally{SYNCING=null}redraw();return changed})();return SYNCING};
window.clockNameScreen=function(){const names=rd(LSK.names,[]);armBack(()=>{view='';render()});
 A.innerHTML=`<div class="card"><h2>Who is clocking in?</h2><p class="muted">Pick or type your name once. This phone remembers it.</p>
${names.map(n=>`<button class="btn gr" onclick="clockSetName(this.dataset.n)" data-n="${esc(n)}">${esc(n)}</button>`).join('')}
<label>Your name</label><input id="clockname" autocomplete="name" maxlength="60" placeholder="First and last name"><button class="btn huge" id="clocksave" onclick="clockSetName($('#clockname').value)">Save my name</button></div>`};
window.clockSetName=function(n){n=String(n||'').replace(/\s+/g,' ').trim().slice(0,60);if(!n)return toast('Type your name');wr(LSK.name,n);const l=rd(LSK.names,[]).filter(x=>x!==n);l.unshift(n);wr(LSK.names,l.slice(0,8));view='';render();clockSync()};
addEventListener('online',()=>{if(Q().length)clockSync()});
setInterval(()=>{if(Q().length&&navigator.onLine)clockSync();else if(role==='Crew')redraw()},30000);
// ---- Admin: Crew hours ----
const H={from:'',to:'',who:'',rows:null,now:[],err:''};
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function wkStart(){const d=new Date();d.setDate(d.getDate()-d.getDay());return ymd(d)}
const ph=p=>hrs((p.out?+new Date(p.out):Date.now())-new Date(p.in));
window.openHours=function(){view='hours';if(!H.from){H.from=wkStart();H.to=ymd(new Date())}render();hoursLoad()};
window.hoursLoad=async function(){try{const r=await api({a:'clockList',from:H.from,to:H.to,who:H.who});H.rows=r.punches||[];H.now=r.now||[];H.err=''}catch(e){H.rows=[];H.now=[];H.err=/Bad action/i.test(e.message)?'soon':e.message}if(view==='hours')hoursScreen()};
window.hoursScreen=function(){armBack(()=>{view='';render()});
 if(H.err==='soon'){A.innerHTML=`<div class="card"><h2>Crew hours</h2><p style="font-size:18px">Clock-in coming soon.</p><p class="muted">The server update for the time clock is waiting to go live. Crew punches are being saved on their phones until then.</p></div>`;return}
 const rows=(H.rows||[]).slice().sort((a,b)=>a.in<b.in?1:-1),tot={};rows.forEach(p=>{tot[p.who]=(tot[p.who]||0)+ph(p)});
 const people=[...new Set(rows.map(p=>p.who).concat(H.now.map(p=>p.who),H.who?[H.who]:[]))].sort();
 A.innerHTML=`<div class="card"><h2>On the clock now (${H.now.length})</h2>${H.now.length?H.now.map(p=>`<div class="hrow"><b>${esc(p.who)}</b><span>since ${tm(p.in)}${new Date(p.in).toDateString()!==new Date().toDateString()?' '+dt(p.in):''} · ${fmtH(ph(p))} h</span></div>`).join(''):'<p class="muted">Nobody is clocked in.</p>'}</div>
<div class="card"><h2>Hours</h2><div class="row"><div style="flex:1"><label>From</label><input type="date" id="hfrom" value="${H.from}"></div><div style="flex:1"><label>To</label><input type="date" id="hto" value="${H.to}"></div></div>
<label>Person</label><select id="hwho"><option value="">Everyone</option>${people.map(n=>`<option${n===H.who?' selected':''}>${esc(n)}</option>`).join('')}</select>
<button class="btn n" onclick="H_set()">Show hours</button>${H.err?`<p class="clockq">${esc(H.err)}</p>`:''}
${H.rows==null?'<p class="muted">Loading…</p>':`<table class="htab" id="htot"><tr><th>Person</th><th>Hours</th></tr>${Object.keys(tot).sort().map(n=>`<tr><td>${esc(n)}</td><td>${fmtH(tot[n])}</td></tr>`).join('')||'<tr><td colspan=2 class="muted">No punches in these dates.</td></tr>'}</table>`}
<div class="row"><button class="btn" id="hcsv" onclick="hoursCsv()">⬇ Export CSV</button><button class="btn gr" onclick="punchEdit('')">+ Add missed punch</button></div></div>
<div class="card"><h2>Punches</h2><div id="hlist">${rows.map(p=>`<button class="hrow hp" type="button" onclick="punchEdit('${esc(p.id)}')"><b>${esc(p.who)}</b><span>${dt(p.in)} · ${tm(p.in)} – ${p.out?tm(p.out):'<i>open</i>'} · ${fmtH(ph(p))} h${p.edited?' · edited':''}${p.src=='offline'?' · synced later':''}</span><i>Fix ›</i></button>`).join('')||'<p class="muted">None.</p>'}</div></div>`};
window.H_set=function(){H.from=$('#hfrom').value;H.to=$('#hto').value;H.who=$('#hwho').value;H.rows=null;hoursScreen();hoursLoad()};
const csvq=v=>{v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
window.hoursCsvText=function(){const rows=(H.rows||[]).slice().sort((a,b)=>a.who.localeCompare(b.who)||(a.in<b.in?-1:1));
 return [['Name','Date','Clock in','Clock out','Hours','Edited']].concat(rows.map(p=>[p.who,ymd(new Date(p.in)),new Date(p.in).toLocaleString(),p.out?new Date(p.out).toLocaleString():'(open)',fmtH(ph(p)),p.edited?'yes':''])).map(r=>r.map(csvq).join(',')).join('\r\n')+'\r\n'};
window.hoursCsv=function(){const b=new Blob([hoursCsvText()],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='fielder-hours-'+H.from+'-to-'+H.to+'.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
const loc=iso=>{if(!iso)return '';const d=new Date(iso);return ymd(d)+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
window.punchEdit=function(id){const p=(H.rows||[]).find(x=>x.id===id)||null;armBack(()=>hoursScreen());
 A.innerHTML=`<div class="card"><h2>${p?'Fix punch':'Add missed punch'}</h2>${p?`<p style="font-size:18px"><b>${esc(p.who)}</b></p>`:`<label>Person</label><input id="pwho" maxlength="60" list="pwl"><datalist id="pwl">${[...new Set((H.rows||[]).map(x=>x.who))].map(n=>`<option value="${esc(n)}">`).join('')}</datalist>`}
<label>Clock in</label><input type="datetime-local" id="pin" value="${loc(p&&p.in)}"><label>Clock out</label><input type="datetime-local" id="pout" value="${loc(p&&p.out)}"><p class="muted">Leave clock out empty if they are still working.</p>
<button class="btn huge" id="psave" onclick="punchSave('${p?esc(p.id):''}')">Save</button>${p?`<button class="btn red" onclick="punchDel('${esc(p.id)}')">Delete punch</button>`:''}<button class="btn gr" onclick="hoursScreen()">Cancel</button></div>`};
window.punchSave=async function(id){const i=$('#pin').value,o=$('#pout').value;if(!i)return toast('Enter the clock-in time');const b={a:'clockFix',id:id||undefined,in:new Date(i).toISOString(),out:o?new Date(o).toISOString():''};if(!id){b.who=($('#pwho').value||'').trim();if(!b.who)return toast('Type the person\'s name')}
 try{await api(b);toast('Saved');await hoursLoad()}catch(e){toast(e.message)}};
window.punchDel=async function(id){if(!confirm('Delete this punch?'))return;try{await api({a:'clockFix',id,del:true});toast('Deleted');await hoursLoad()}catch(e){toast(e.message)}};
// Hook into home screens.
const _crew=window.crew,_admin=window.admin;
window.crew=function(){const a=jobs.filter(j=>j.status=='approved').sort(byNew);list('Your jobs',a,'cview',clockCard());clockSync()};
window.admin=function(){_admin();const l=$('.listhead');if(l)l.insertAdjacentHTML('beforebegin','<button class="srow" id="row-hours" type="button" onclick="openHours()"><span><b>Crew hours</b><small>Who is on the clock, hours, fix a missed punch, CSV</small></span><i>›</i></button>')};
})();
