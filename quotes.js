// Sent quotes + Outstanding quotes: status badges, sent / last follow-up dates, text or email follow-ups
// (optionally with the Settings discount), and multi-select bulk status change.
// Follow-ups, Sent/Follow up statuses and the discount need the backend caps (followUp, setStatus, discount);
// until the Field Desk script is updated those buttons stay hidden and bulk status falls back to Approved/Declined via 'respond'.
(function(){
const css=document.createElement('style');css.textContent='.qcard{background:#fff;border-radius:14px;box-shadow:0 1px 4px rgba(17,35,55,.08);padding:16px;margin:0 0 14px}.qcard h3{margin:0 0 4px;color:#112337;font-size:20px}.qbadge{display:inline-block;padding:8px 14px;border-radius:999px;color:#fff;font-weight:800;font-size:16px;margin:6px 0}.qmeta{color:#5b6472;font-size:15px;margin:2px 0}.qbtns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.qbtns .btn{margin:0;padding:14px 8px;font-size:16px}.qsel{display:flex;align-items:center;gap:10px;font-size:17px;margin:0 0 6px}.qsel input{width:26px;height:26px}#qbulk{position:sticky;bottom:0;background:#fff;padding:12px;border-radius:14px;box-shadow:0 -2px 10px rgba(17,35,55,.12);margin-top:8px}#qbulk select{width:100%;font-size:18px;padding:12px;border-radius:10px;border:2px solid #cfd6c4;margin-bottom:8px}';document.head.appendChild(css);
const has=c=>Array.isArray(window.CAPS)&&CAPS.includes(c);
const DAY=86400000,STALE=3;
const OUT=j=>j.status=='sent'||j.status=='reply'||j.status=='followup';
const SENT=j=>OUT(j)||j.status=='declined'||(j.status=='approved'&&!!(j.est||j.pt||j.textedAt));
function sentAt(j){return j.sentAt||j.textedAt||j.created||''}
function dstr(s){if(!s)return '—';const d=new Date(s);return isNaN(d)?'—':d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
function qstat(j){if(j.status=='approved'){const a=j.response&&j.response.ans;return {t:'Approved'+(a?' ('+a+')':''),c:'#78a22f'}}
 if(j.status=='declined')return {t:'Declined',c:'#8a8f98'};if(j.status=='reply')return {t:'Customer replied',c:'#7c3aed'};
 const last=new Date(j.lastFollowUp||sentAt(j)).getTime(),days=Math.floor((Date.now()-last)/DAY);
 if(days>=STALE)return {t:'No reply '+days+' days',c:'#c2410c'};
 if(j.status=='followup')return {t:'Followed up',c:'#2563eb'};if(j.openedAt)return {t:'Opened',c:'#0e7490'};return {t:'Sent',c:'#112337'}}
function pct(){try{return (SET&&SET.discountPct)||10}catch(e){return 10}}
let QSEL=new Set(),QMODE='out';
function card(j){const s=qstat(j),tot=money(j.total!=null?j.total:(j.items||[]).reduce((a,i)=>a+(+i.price||0),0)),fu=has('followUp')&&OUT(j);
 const fuB=fu?`<div class="qbtns"><button class="btn" type="button" data-fu="text" data-id="${esc(j.id)}">💬 Text follow-up</button><button class="btn n" type="button" data-fu="email" data-id="${esc(j.id)}">✉️ Email follow-up</button>${has('discount')?`<button class="btn gr" type="button" data-fu="text" data-disc="1" data-id="${esc(j.id)}">💬 Text ${pct()}% off</button><button class="btn gr" type="button" data-fu="email" data-disc="1" data-id="${esc(j.id)}">✉️ Email ${pct()}% off</button>`:''}</div>`:'';
 return `<div class="qcard" data-q="${esc(j.id)}"><label class="qsel"><input type="checkbox" data-sel="${esc(j.id)}" ${QSEL.has(j.id)?'checked':''}> Select</label><h3>${esc(j.name||'(no name)')}</h3><div class="qmeta">${esc(j.address||'')}</div><span class="qbadge" style="background:${s.c}">${esc(s.t)}</span><div class="qmeta">Total ${tot}${j.discount?' · '+j.discount.pct+'% off offered':''}</div><div class="qmeta">Sent ${dstr(sentAt(j))} · Last follow-up ${dstr(j.lastFollowUp)}${j.openedAt?' · Opened '+dstr(j.openedAt):''}</div><button class="btn gr" type="button" style="margin-top:8px" onclick="mview('${esc(j.id)}')">Open quote ›</button>${fuB}</div>`}
let QBST='approved';
(function(){const c=document.createElement('style');c.textContent='.qbchips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}.qbchips button{margin:0;width:auto;min-height:48px;padding:8px 16px;border-radius:999px;border:1.5px solid #dfe3da;background:#fff;color:#112337;font:inherit;font-weight:800;font-size:16px}.qbchips button.on{background:#112337;border-color:#112337;color:#fff}';document.head.appendChild(c)})();
function bulk(){const opts=has('setStatus')?[['sent','Quote sent'],['followup','Follow up'],['approved','Approved'],['declined','Declined']]:[['approved','Approved'],['declined','Declined']];
 return `<div id="qbulk" ${QSEL.size?'':'hidden'}><b id="qbn">${QSEL.size} selected</b><div class="qbchips" id="qbst" role="radiogroup" aria-label="New status">${opts.map((o,i)=>`<button type="button" role="radio" data-st="${o[0]}" aria-checked="${o[0]===QBST?'true':'false'}" class="${o[0]===QBST?'on':''}">${o[1]}</button>`).join('')}</div><button class="btn huge" id="qbgo" type="button">Change status</button><button class="btn gr" type="button" id="qbclr">Clear selection</button></div>`}
function draw(){const out=QMODE=='out',arr=jobs.filter(out?OUT:SENT).sort((a,b)=>String(sentAt(b)).localeCompare(String(sentAt(a))));
 view=out?'oq':'sq';armBack(navHome);
 A.innerHTML=`<h2 style="margin-top:0">${out?'Outstanding quotes':'Sent quotes'} (${arr.length})</h2><p class="muted" style="margin:0 0 12px">${out?'Sent, not approved or declined yet.':'Every quote sent to a customer, newest first.'}${has('followUp')?'':' Follow-up buttons turn on after the Field Desk script update.'}</p>`+(arr.length?arr.map(card).join(''):'<p class="muted">Nothing here right now.</p>')+bulk();
 A.querySelectorAll('[data-sel]').forEach(c=>c.onchange=()=>{c.checked?QSEL.add(c.dataset.sel):QSEL.delete(c.dataset.sel);const b=$('#qbulk');b.hidden=!QSEL.size;$('#qbn').textContent=QSEL.size+' selected'});
 A.querySelectorAll('[data-fu]').forEach(b=>b.onclick=()=>followUp(b.dataset.id,b.dataset.fu,!!b.dataset.disc,b));
 A.querySelectorAll('#qbst [data-st]').forEach(c=>c.onclick=()=>{QBST=c.dataset.st;A.querySelectorAll('#qbst [data-st]').forEach(x=>{const on=x===c;x.classList.toggle('on',on);x.setAttribute('aria-checked',on?'true':'false')})});
 const go=$('#qbgo');if(go)go.onclick=bulkGo;const cl=$('#qbclr');if(cl)cl.onclick=()=>{QSEL.clear();draw()}}
async function followUp(id,via,disc,b){const j=jobs.find(x=>x.id==id);if(!j)return;
 if(b){b.disabled=true;b.textContent='Sending…'}
 try{const r=await api({a:'followUp',id,via,discount:disc});if(r.job){const i=jobs.findIndex(x=>x.id==id);if(i>=0)jobs[i]=r.job}toast((via=='text'?'Text':'Email')+' follow-up sent'+(disc?' with '+pct()+'% off':''))}
 catch(e){toast(e.message)}draw()}
async function bulkGo(){const st=QBST,ids=[...QSEL];if(!ids.length)return;const b=$('#qbgo');b.disabled=true;b.textContent='Saving…';
 try{if(has('setStatus')){const r=await api({a:'setStatus',ids,status:st});if(r.jobs)jobs=r.jobs.filter(j=>!j.archived)}
  else{for(const id of ids)await api({a:'respond',id,ans:st=='approved'?'A':'C'});await refresh()}
  toast(ids.length+' quote'+(ids.length>1?'s':'')+' marked '+(($('#qbst [data-st="'+st+'"]')||{}).textContent||st));QSEL.clear()}catch(e){toast(e.message)}draw()}
window.openOutstanding=function(){QMODE='out';QSEL.clear();draw();window.scrollTo(0,0)};
window.openSentQuotes=function(){QMODE='sent';QSEL.clear();draw();window.scrollTo(0,0)};
window.FDQ={draw,qstat,OUT,SENT,count:()=>jobs.filter(OUT).length};
// Settings: follow-up discount percent (saved through the existing settings action; needs the script update to stick).
window.openDisc=function(){view='disc';armBack(()=>{view='set';setScreen()});A.innerHTML=`<div class="card"><h2>Follow-up discount</h2><p class="muted">Used by the "% off" follow-up buttons on outstanding quotes. Approving through that link takes this much off the quote and its invoice.</p><label style="font-size:18px">Percent off<input id="discpct" type="number" min="1" max="50" step="1" value="${pct()}" style="font-size:22px"></label><button class="btn huge" id="discsave" type="button">Save</button></div>`;
 $('#discsave').onclick=async()=>{const v=Math.round(+$('#discpct').value);if(!(v>=1&&v<=50))return toast('Pick 1 to 50 percent');
  try{const r=await api({a:'settings',quoteBody:SET.quoteBody||'',quoteSubject:SET.quoteSubject||'',quoteSign:SET.quoteSign||'',theme:SET.theme,discountPct:v});if(r.settings)SET=r.settings;SET.discountPct=SET.discountPct||v;toast('Discount saved: '+v+'%')}catch(e){toast(e.message)}}};
})();
