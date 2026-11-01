// Fielder Labor compare (ported from Miller v7): labor $ against any measure, Day / Week / Month, broken down any way. Every row drills in.
(function(){
const st=document.createElement('style');st.textContent=`
.lc .crumb{font-size:14px;color:#5b6168;margin:0 0 6px}.lc .crumb a{color:#34460d;font-weight:800;text-decoration:none}
.lc .seg{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:0 0 8px}
.lc .seg button,.lc .lcch button{margin:0;min-height:48px;border-radius:12px;border:2px solid var(--line);background:#fff;color:#112337;font:inherit;font-weight:800;font-size:16px}
.lc .seg button.on,.lc .lcch button.on{background:#78a22f;border-color:#78a22f;color:#fff}
.lc .per{display:flex;align-items:center;gap:6px;margin:0 0 10px}.lc .per button{flex:0 0 56px;min-height:52px;margin:0;font-size:26px;border-radius:12px;border:2px solid var(--line);background:#fff;font-weight:900}
.lc .per b{flex:1;text-align:center;font-size:18px}
.lc .lbl{font-size:13px;font-weight:800;color:#5b6168;text-transform:uppercase;margin:6px 0 4px}
.lc .lcch{display:flex;flex-wrap:nowrap;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:4px;margin:0 0 6px;scrollbar-width:none}.lc .lcch button{flex:0 0 auto;padding:0 14px;min-height:44px;font-size:15px}
.lc .tot{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6px;margin:8px 0}
.lc .tot div{background:#fff;border:2px solid var(--line);border-radius:12px;padding:8px 10px}.lc .tot small{display:block;font-size:12px;font-weight:800;color:#5b6168;text-transform:uppercase}.lc .tot b{font-size:22px}
.lc .rw{display:block;width:100%;text-align:left;background:#fff;border:2px solid var(--line);border-radius:12px;padding:10px 12px;margin:0 0 6px;font:inherit;color:#112337;cursor:pointer}
.lc .rw .t{display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:16px;gap:8px}.lc .rw .t span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lc .bar{height:12px;border-radius:6px;margin:5px 0 0;min-width:2px}.lc .bl{background:#e0892b}.lc .bc{background:#78a22f}
.lc .rw .s{font-size:13px;color:#5b6168;margin-top:4px}.lc .rw .go{float:right;color:#34460d;font-weight:900}
.pp{display:inline-block;border-radius:999px;padding:2px 10px;font-weight:900;font-size:14px;color:#fff}.pg{background:#78a22f}.pa{background:#c77700}.pr{background:#b42318}.pn{background:#8a9099}
.lc .key{display:flex;gap:14px;font-size:13px;color:#5b6168;margin:2px 0 8px}.lc .key i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:4px;vertical-align:-1px}`;
document.head.appendChild(st);
const usd=v=>'$'+Math.round(v||0).toLocaleString(),pcls=p=>p==null?'pn':p<30?'pg':p<=45?'pa':'pr';
window.ftPct=(p,txt)=>`<span class="pp ${pcls(p)}">${txt||(p==null?'—':Math.round(p)+'%')}</span>`;
const VS={jobs:'Job $ worked',invoiced:'Invoiced',collected:'Collected',quoted:'Quoted',hours:'Hours'},BY={none:'Total only',job:'Job',crew:'Crew',customer:'Customer',source:'Lead source',service:'Job type'};
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
let S={period:'day',date:ymd(new Date()),vs:'jobs',by:'job',fby:'',fkey:''},STACK=[];
const lbl=r=>{const f=s=>new Date(s+'T12:00');if(S.period==='day'){const t=ymd(new Date()),y=ymd(new Date(Date.now()-864e5));return S.date===t?'Today':S.date===y?'Yesterday':f(S.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}
 if(S.period==='month')return f(S.date).toLocaleDateString('en-US',{month:'long',year:'numeric'});
 return r?f(r.from).toLocaleDateString('en-US',{month:'short',day:'numeric'})+' – '+f(r.to).toLocaleDateString('en-US',{month:'short',day:'numeric'}):'This week'};
window.ftLaborCmp=async function(o,push){if(push)STACK.push(Object.assign({},S));if(o)S=Object.assign({},S,o);view='ftlc';
 armBack(()=>{if(STACK.length){S=STACK.pop();ftLaborCmp()}else ownerHome()});window.scrollTo(0,0);
 const q={a:'laborCmp',period:S.period,date:S.date,vs:S.vs,by:S.by,fby:S.fby,fkey:S.fkey};
 const draw=r=>{if(view!=='ftlc')return;const T=r&&r.total,isH=S.vs==='hours';
  const seg=['day','week','month'].map(p=>`<button type="button" id="lp-${p}" class="${S.period===p?'on':''}" onclick="ftLaborCmp({period:'${p}'})">${p[0].toUpperCase()+p.slice(1)}</button>`).join('');
  const ch=(m,k,cur,id)=>Object.keys(m).map(x=>`<button type="button" id="${id}-${x}" class="${cur===x?'on':''}" onclick="ftLaborCmp({${k}:'${x}'})">${m[x]}</button>`).join('');
  const crumb=(role==='Owner'&&window.ftDashNav?ftDashNav('money'):'')+`<div class="crumb"><a href="#" onclick="ownerHome();return false">Dashboard</a> › ${S.fkey?`<a href="#" onclick="ftLaborCmp({fby:'',fkey:''});return false">Labor compare</a> › ${esc(S.fkey)}`:'Labor compare'}</div>`;
  let body='<p>Loading…</p>';
  if(T){const cmpTxt=isH?(T.hours.toFixed(1)+' h'):usd(T.cmp);
   body=`<div class="tot" id="lctot"><div><small>Labor</small><b>${usd(T.labor)}</b></div><div><small>${VS[S.vs]}</small><b>${cmpTxt}</b></div>
   <div><small>Labor %</small><b>${isH?'—':T.cmp?ftPct(T.pct):`<span style="font-size:15px">${T.hours.toFixed(1)} h, no job $</span>`}</b></div><div><small>${isH?'Labor $ / hour':'$ per labor hour'}</small><b>${T.perHr==null?'—':usd(T.perHr)}</b></div></div>
   ${T.unassignedHours?`<p style="margin:0 0 8px;color:#7a1610;font-weight:700">⚠️ ${T.unassignedHours.toFixed(1)} h not on any job</p>`:''}
   <div class="key"><span><i class="bl"></i>Labor</span>${isH?'':`<span><i class="bc"></i>${VS[S.vs]}</span>`}</div>`;
   const rows=S.by==='none'?r.series.filter(x=>S.period==='day'||x.labor||x.cmp).map(x=>({key:new Date(x.day+'T12:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}),day:x.day,labor:x.labor,cmp:x.cmp,hours:x.hours,pct:!isH&&x.cmp?x.labor/x.cmp*100:null})):r.rows;
   const mx=Math.max(1,...rows.map(x=>Math.max(x.labor,isH?0:x.cmp)));
   body+='<!--R-->'+(rows.length?rows.map((x,i)=>{const tap=x.day?`ftLaborCmp({period:'day',date:'${x.day}',by:'job'},1)`:S.by==='job'&&x.id?`ftOpenJob('${x.id}')`:S.by!=='none'&&S.by!==S.fby?`ftLaborCmp({fby:'${S.by}',fkey:${JSON.stringify(x.key).replace(/"/g,'&quot;')},by:'${S.by==='crew'?'job':'crew'}'},1)`:'';
     return `<button type="button" class="rw" id="lr-${i}" ${tap?`onclick="${tap}"`:''}><div class="t"><span>${esc(x.key)}</span>${isH?'':ftPct(x.pct==null?null:x.pct,x.pct==null?(x.cmp?'—':'no $'):null)}</div>
     <div class="bar bl" style="width:${x.labor/mx*100}%"></div>${isH?'':`<div class="bar bc" style="width:${x.cmp/mx*100}%"></div>`}
     <div class="s">${usd(x.labor)} labor · ${isH?'':usd(x.cmp)+' · '}${(x.hours||0).toFixed(1)} h${x.crew&&x.crew.length&&S.by!=='crew'?' · '+esc(x.crew.join(', ')):''}${tap?'<span class="go">›</span>':''}</div></button>`}).join(''):'<p>Nothing in this period.</p>');}
  body=body.replace(/(<div class="key">[\s\S]*?<\/div>)<!--R-->/,'<!--R-->$1');A.innerHTML=`<div class="card lc">${crumb}<h2 style="margin:0 0 8px">💲 Labor compare</h2><div class="seg">${seg}</div>
   <div class="per"><button type="button" id="lcprev" onclick="ftLaborStep(-1)">‹</button><b id="lcper">${lbl(r)}</b><button type="button" id="lcnext" onclick="ftLaborStep(1)">›</button></div>
   ${body.split('<!--R-->')[0]}<div class="lbl">Compare labor to</div><div class="lcch" id="lcvs">${ch(VS,'vs',S.vs,'lv')}</div>
   <div class="lbl">Break down by</div><div class="lcch" id="lcby">${ch(BY,'by',S.by,'lb')}</div>${body.split('<!--R-->')[1]||''}</div>`;
  const on=document.querySelector('#lcvs .on,#lcby .on');document.querySelectorAll('.lc .lcch .on').forEach(b=>b.scrollIntoView({inline:'center',block:'nearest'}));window.scrollTo(0,0)};
 draw(null);try{const r=await api(q);setTimeout(()=>Object.keys(VS).forEach(v=>{if(v!==S.vs)api(Object.assign({},q,{vs:v})).catch(()=>{})}),300);if(JSON.stringify(q)===JSON.stringify({a:'laborCmp',period:S.period,date:S.date,vs:S.vs,by:S.by,fby:S.fby,fkey:S.fkey}))draw(r)}catch(e){if(view==='ftlc')toast(e.message)}};
window.ftLaborStep=function(n){const d=new Date(S.date+'T12:00');if(S.period==='day')d.setDate(d.getDate()+n);else if(S.period==='week')d.setDate(d.getDate()+7*n);else{d.setDate(1);d.setMonth(d.getMonth()+n)}ftLaborCmp({date:ymd(d)})};
window.ftOpenJob=function(id){if(role==='Owner'||sessionStorage.fdOwner==='1'){if(role==='Owner')ownerDo('Manager','mgr')}const go=()=>{const j=(jobs||[]).find(x=>x.id===id);if(j){(window.mview||cview)(id)}else toast('Job not found')};if(jobs&&jobs.length)go();else setTimeout(go,800)};
window.ftLaborDay=function(day){ftLaborCmp({period:'day',date:day||ymd(new Date()),vs:'jobs',by:'job',fby:'',fkey:''})};
// voice: "labor vs collected this month by crew", "labor yesterday", "labor this week"
const V0=window.FTV2;window.FTV2=function(t){t=String(t||'').toLowerCase();
 if(/^(show )?(the )?labou?r\b|labou?r (compare|vs|versus|against|for|today|yesterday|this|last|by)/.test(t)&&role!=='Crew'&&!/clock|pay ?rate|labou?r costs?\b/.test(t)){
  const o={fby:'',fkey:''},d=new Date();
  if(/month/.test(t))o.period='month';else if(/week/.test(t))o.period='week';else o.period='day';
  if(/yesterday/.test(t))d.setDate(d.getDate()-1);if(/last (week)/.test(t))d.setDate(d.getDate()-7);if(/last month/.test(t)){d.setDate(1);d.setMonth(d.getMonth()-1)}o.date=ymd(d);
  if(/collect|paid/.test(t))o.vs='collected';else if(/invoic|billed/.test(t))o.vs='invoiced';else if(/quot/.test(t))o.vs='quoted';else if(/hours?\b/.test(t)&&!/per hour/.test(t))o.vs='hours';else if(/jobs?\b|worked|revenue/.test(t))o.vs='jobs';
  const m=t.match(/by (job|crew|customer|client|person|employee|source|lead source|service|job type|type|nothing|none|day)/);if(m)o.by={client:'customer',person:'crew',employee:'crew','lead source':'source','job type':'service',type:'service',nothing:'none',day:'none'}[m[1]]||m[1];
  ftLaborCmp(o);return 'Labor compare'}
 return V0?V0(t):false};
})();
