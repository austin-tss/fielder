// Fielder batch 4: assign crews to jobs. Crew chips on the schedule form (block.crew; server keeps job.assigned),
// crew names on schedule entries and job pages, "Today's job" for crew (only their jobs, else all of today's),
// voice "assign Carlos and Tyler to Hartwell".
(function(){
const ymdL=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const css=document.createElement('style');css.textContent=`.crchips{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}.crchips button{margin:0;width:auto;min-height:46px;padding:8px 14px;border-radius:999px;border:1.5px solid #dfe3da;background:#fff;color:#112337;font:inherit;font-weight:700;font-size:16px}
.crchips button.on{background:#112337;border-color:#112337;color:#fff}.crline{margin:6px 0;font-weight:700;color:#112337}.tdjob{border:2px solid #78a22f}`;document.head.appendChild(css);
let SEL=[],NAMES=[];
const canAssign=()=>role==='Owner'||role==='Manager'||role==='Admin'||sessionStorage.fdOwner==='1';
async function names(){if(NAMES.length)return NAMES;let e=(typeof EMPS!=='undefined'&&EMPS.length)?EMPS:[];if(!e.length){try{e=(await api({a:'empList',pin:myPin()})).employees||[]}catch(x){e=[]}}
 const n=e.filter(x=>x&&x.name&&(!x.role||x.role==='Crew'||x.role==='Manager')).map(x=>x.name);(typeof blocks!=='undefined'?blocks:[]).forEach(b=>(b.crew||[]).forEach(c=>{if(!n.includes(c))n.push(c)}));NAMES=n;return n}
function draw(){const w=document.getElementById('crchips');if(!w)return;w.innerHTML=NAMES.length?NAMES.map(n=>`<button type="button" class="${SEL.includes(n)?'on':''}" onclick="ftCrewTap(this.dataset.n)" data-n="${esc(n)}">${SEL.includes(n)?'✓ ':''}${esc(n)}</button>`).join(''):'<small class="muted">Add people under Team first.</small>'}
window.ftCrewChips=function(b){SEL=(b&&b.crew||[]).slice();if(!canAssign())return '';setTimeout(()=>names().then(draw),0);return `<label>Crew</label><div class="crchips" id="crchips"><small class="muted">Loading team…</small></div>`};
window.ftCrewTap=n=>{SEL=SEL.includes(n)?SEL.filter(x=>x!==n):SEL.concat([n]);draw()};
window.ftCrewSel=()=>SEL.slice();
// assigned crew for a job (server job.assigned, else from its blocks)
const crewOf=j=>{const s=(j.assigned||[]).slice();(typeof blocks!=='undefined'?blocks:[]).filter(b=>b.job==j.id).forEach(b=>(b.crew||[]).forEach(c=>{if(!s.includes(c))s.push(c)}));return s};
window.ftCrewOf=crewOf;
['mview','cview','aview'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(id){const x=f.apply(this,arguments);try{const j=jobs.find(q=>q.id==id);const c=j&&crewOf(j);if(c&&c.length&&!document.getElementById('crline')){const h=A.querySelector('h2');if(h)h.insertAdjacentHTML('afterend',`<p class="crline" id="crline">👷 Crew: ${esc(c.join(', '))}</p>`)}}catch(e){}return x}});
// Crew home: Today's job, only my jobs (by name on today's blocks / job.assigned), else all of today's jobs
const me=()=>String(sessionStorage.fdName||'').trim().toLowerCase();
window.ftMyJobs=function(){const td=ymdL(new Date()),bl=(typeof blocks!=='undefined'?blocks:[]),n=me();
 const todayIds=[...new Set(bl.filter(b=>b.date===td&&b.job).map(b=>b.job))];
 const mineToday=n?[...new Set(bl.filter(b=>b.date===td&&b.job&&(b.crew||[]).some(c=>c.toLowerCase()===n)).map(b=>b.job))]:[];
 const mineAll=n?jobs.filter(j=>j.status==='approved'&&crewOf(j).some(c=>c.toLowerCase()===n)).map(j=>j.id):[];
 return {today:mineToday.length?mineToday:todayIds,list:mineToday.length||mineAll.length?[...new Set(mineToday.concat(mineAll))]:null}};
if(typeof window.crew==='function'){const C0=window.crew;window.crew=function(){const m=ftMyJobs(),all=jobs;let x;
  if(m.list){jobs=all.filter(j=>m.list.includes(j.id));try{x=C0.apply(this,arguments)}finally{jobs=all}}else x=C0.apply(this,arguments);
  try{const t=m.today.map(id=>all.find(j=>j.id==id)).filter(Boolean);if(t.length&&!document.getElementById('tdjob')){const j=t[0];
   A.insertAdjacentHTML('afterbegin',`<button type="button" class="card tdjob" id="tdjob" onclick="cview('${j.id}')" style="display:block;width:100%;text-align:left;font:inherit"><small class="muted" style="font-weight:800;text-transform:uppercase">Today’s job${t.length>1?' (1 of '+t.length+')':''}</small><br><b style="font-size:21px">${esc(j.name)}</b><br><span class="muted">${esc(j.address||'')}</span>${crewOf(j).length?'<br>👷 '+esc(crewOf(j).join(', ')):''}</button>`)}}catch(e){}
  return x}}
// voice: "assign Carlos and Tyler to Hartwell"
window.ftAssign=async function(id,crew){try{const r=await api({a:'assign',id,crew});if(r.blocks)blocks=r.blocks;if(r.job){const i=jobs.findIndex(x=>x.id==id);if(i>=0)jobs[i]=r.job}toast(crew.length?'Assigned '+crew.join(', '):'Crew cleared');return r}catch(e){toast(e.message)}};
const V0=window.FTV2;window.FTV2=function(t){let m;t=String(t||'');
 if((m=t.match(/^assign (.+?) to (?:the )?(.+?)(?: job)?$/i))&&canAssign()){const q=m[2].toLowerCase(),j=jobs.find(x=>String(x.name||'').toLowerCase()===q)||jobs.find(x=>String(x.name||'').toLowerCase().includes(q)||String(x.address||'').toLowerCase().includes(q));if(!j)return 'No job matches '+m[2];
  const ns=m[1].split(/\s*(?:,|\band\b|&)\s*/i).map(x=>x.trim()).filter(Boolean);const pool=NAMES.length?NAMES:[];const crew=ns.map(x=>pool.find(p=>p.toLowerCase()===x.toLowerCase())||pool.find(p=>p.toLowerCase().split(' ')[0]===x.toLowerCase())||x.replace(/\b\w/g,c=>c.toUpperCase()));
  names().then(()=>ftAssign(j.id,crew));return 'Assigning '+crew.join(' and ')+' to '+j.name}
 return V0?V0(t):false};
})();
// Wording: "Have Timber fill this quote" (form.js stays byte-identical; swap the label on screen).
(function(){const fix=()=>{document.querySelectorAll('button,summary,h3,b,span,label').forEach(e=>{if(e.childNodes.length&&/Have AI fill this quote/.test(e.textContent))e.childNodes.forEach(n=>{if(n.nodeType===3&&/AI/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/Have AI fill/g,'Have Timber fill')})})};
 try{new MutationObserver(fix).observe(document.getElementById('app')||document.body,{childList:true,subtree:true})}catch(e){}})();
