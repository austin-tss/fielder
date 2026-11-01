// Receipt scanner (anyone) and the Receipts page (Owner reviews every receipt; others see their own). No approval step:
// Timber reads the photo (store, date, total, tax, items), the photo goes to Drive Receipts/<month>, a job's receipt adds to its materials cost.
(function(){
const money=n=>'$'+(Number(n)||0).toFixed(2);
const own=()=>role==='Owner'||sessionStorage.fdOwner==='1';
function back(to){if(typeof armBack==='function')armBack(to||(()=>{if(own()&&window.ownerHome)ownerHome();else{view='';render()}}))}
function jobOpts(){const js=(typeof jobs!=='undefined'?jobs:[]).filter(j=>!j.archived&&(j.wonAt||j.jobNo||/approved|complete|invoiced/.test(j.status||'')));
 return '<option value="">No job</option>'+js.slice(0,80).map(j=>`<option value="${esc(j.id)}">${esc(j.name)}${j.address?' · '+esc(String(j.address).split(',')[0]):''}</option>`).join('')}
function shrink(f){return new Promise((ok,no)=>{const r=new FileReader();r.onerror=()=>no(Error('Could not read the photo'));r.onload=()=>{const im=new Image();im.onerror=()=>ok(r.result);im.onload=()=>{const k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',0.8))};im.src=r.result};r.readAsDataURL(f)})}
window.ftScanReceipt=async function(){view='rcp';back();window.scrollTo(0,0);
 A.innerHTML=`<div class="card"><h2>🧾 Scan receipt</h2><p class="muted" style="margin:0 0 10px">Take a photo. Timber reads the store, date and total, and the owner sees it on the Receipts page.</p>
 <label>Job (optional)</label><select id="rc-job">${jobOpts()}</select><label>Supply item (optional)</label><select id="rc-sup"><option value="">None</option></select>
 <input id="rc-file" type="file" accept="image/*" capture="environment" hidden onchange="ftRcpGo(this.files[0])"><button class="btn huge" type="button" id="rc-go" onclick="document.getElementById('rc-file').click()">📷 Take photo of receipt</button><div id="rc-out"></div>
 <button class="btn n" type="button" id="rc-list" style="margin-top:10px" onclick="ftReceipts()">${own()?'🧾 All receipts':'🧾 My receipts'}</button></div>`;
 try{const r=await api({a:'supList'});const el=document.getElementById('rc-sup');if(el)el.innerHTML='<option value="">None</option>'+(r.items||[]).filter(s=>/Needed|Ordered/.test(s.status)).map(s=>`<option value="${esc(s.id)}">${esc(s.item)}</option>`).join('')}catch(e){}};
window.ftRcpGo=async function(f){if(!f)return;const b=document.getElementById('rc-go'),o=document.getElementById('rc-out');b.disabled=true;b.textContent='Reading the receipt…';
 try{const photo=await shrink(f),jobId=document.getElementById('rc-job').value,supId=document.getElementById('rc-sup').value;let r=await api({a:'rcpScan',photo,jobId});if(supId)r=await api({a:'rcpSet',id:r.item.id,supId});const x=r.item;
  o.innerHTML=`<div class="card" id="rc-done" style="margin-top:14px;border:3px solid #78a22f"><b style="font-size:20px">${esc(x.store)}</b> · ${esc(x.date)}<div style="font-size:30px;font-weight:900;margin:6px 0">${money(x.total)}</div><div class="muted">${x.tax?'Tax '+money(x.tax)+' · ':''}${(x.items||[]).length} items${x.jobName?' · Job: '+esc(x.jobName):''}${x.supName?' · For: '+esc(x.supName):''}</div><p style="margin:8px 0 0">Saved. The owner sees it on the Receipts page.</p></div>`;
  b.textContent='📷 Scan another';b.disabled=false;toast('Receipt saved')}catch(e){toast(e.message);b.textContent='📷 Take photo of receipt';b.disabled=false}
 const fi=document.getElementById('rc-file');if(fi)fi.value=''};
let MONTH='';
const mName=m=>{const [y,mo]=m.split('-');return new Date(+y,+mo-1,1).toLocaleDateString([],{month:'long',year:'numeric'})};
window.ftReceipts=async function(hl,month){if(month!=null)MONTH=month;view='rcps';back(()=>{if(own()&&window.ownerSect)ownerSect('money');else{view='';render();window.ftSimpleMore&&ftSimpleMore()}});window.scrollTo(0,0);
 A.innerHTML='<div class="card"><h2>🧾 Receipts</h2><p class="muted">Loading…</p></div>';
 let r;try{r=await api({a:'rcpList',month:MONTH})}catch(e){return toast(e.message)}if(view!=='rcps')return;const it=r.items||[],tot=it.reduce((a,x)=>a+x.total,0),owe=it.filter(x=>!x.reimbursed).reduce((a,x)=>a+x.total,0);
 const ms=r.months||[];
 A.innerHTML=`<div class="card" id="rcps"><h2>🧾 Receipts</h2><div class="row" style="align-items:flex-end;gap:10px"><div style="flex:1"><label for="rc-month">Month</label><select id="rc-month" onchange="ftReceipts('',this.value)"><option value="">All months</option>${ms.map(m=>`<option value="${m}" ${m===MONTH?'selected':''}>${esc(mName(m))}</option>`).join('')}</select></div></div>
 <p style="margin:10px 0" id="rc-sum"><b>${it.length} receipt${it.length===1?'':'s'} · ${money(tot)}</b>${r.canPay?` · <span style="color:#b42318;font-weight:800">${money(owe)} not reimbursed</span>`:''}</p><button class="btn huge" type="button" onclick="ftScanReceipt()">📷 Scan receipt</button></div>`+
 (it.map(x=>`<div class="card rcard" id="rc-${x.id}" style="${x.id===hl?'border:3px solid #78a22f':''}"><div style="display:flex;gap:12px;align-items:flex-start">
  ${x.photoId?`<a href="${esc(x.photo||'#')}" target="_blank" rel="noopener" class="rcth" data-id="${esc(x.photoId)}" style="flex:none;width:72px;height:92px;border-radius:8px;background:#eef2e6;display:flex;align-items:center;justify-content:center;font-size:30px;text-decoration:none;overflow:hidden">🧾</a>`:''}
  <div style="flex:1;min-width:0"><b style="font-size:19px">${esc(x.store)} · ${money(x.total)}</b><div class="muted">${[x.date,x.tax?'Tax '+money(x.tax):'','By '+x.who,x.jobName&&('Job: '+x.jobName),x.supName&&('For: '+x.supName)].filter(Boolean).map(esc).join(' · ')}</div>
  ${(x.items||[]).length?`<details style="margin-top:6px"><summary style="cursor:pointer;font-weight:700">${x.items.length} item${x.items.length===1?'':'s'}</summary><table style="width:100%;font-size:15px;margin-top:4px">${x.items.map(i=>`<tr><td>${esc(i.name)}${i.qty>1?' ×'+i.qty:''}</td><td style="text-align:right">${money(i.price)}</td></tr>`).join('')}</table></details>`:''}
  ${x.photo?`<a href="${esc(x.photo)}" target="_blank" rel="noopener" style="font-weight:700">Open photo</a>`:''}</div>
  ${r.canPay?`<button type="button" id="rp-${x.id}" role="switch" aria-checked="${!!x.reimbursed}" style="flex:none;margin:0;min-height:48px;padding:0 16px;border-radius:24px;border:2px solid #78a22f;background:${x.reimbursed?'#78a22f':'#fff'};color:${x.reimbursed?'#fff':'#4f6d1d'};font:inherit;font-weight:800" onclick="ftRcpPaid('${x.id}')">${x.reimbursed?'✔ Reimbursed':'Mark reimbursed'}</button>`:`<span style="flex:none;padding:10px 14px;border-radius:24px;background:${x.reimbursed?'#78a22f':'#112337'};color:#fff;font-weight:800">${x.reimbursed?'Reimbursed':'Submitted'}</span>`}</div></div>`).join('')||'<p class="muted" style="padding:0 6px">No receipts'+(MONTH?' this month':' yet')+'.</p>');
 if(typeof API!=='undefined'&&API)document.querySelectorAll('.rcth').forEach(async a=>{try{const j=await (await fetch(API+'?a=img&id='+encodeURIComponent(a.dataset.id))).json();if(j.ok&&j.data)a.innerHTML=`<img src="${j.data}" alt="Receipt" style="width:100%;height:100%;object-fit:cover">`}catch(e){}});
 if(hl){const e=document.getElementById('rc-'+hl);if(e)e.scrollIntoView({block:'center'})}};
window.ftRcpPaid=async function(id){const b=document.getElementById('rp-'+id);if(b)b.disabled=true;try{await api({a:'rcpPaid',id})}catch(e){toast(e.message)}ftReceipts(id)};
})();
