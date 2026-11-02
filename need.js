// "Need something?" (Miller 92221aa, Fielder look): any signed-in staff sends a request to the VNXT team and tracks its status.
// Same log + test-inbox email as Timber's Ask-the-VNXT-team (vxAdd → tbVnxt_). Each user sees their own; the Owner sees everyone's.
// The Owner still changes statuses in More ▸ VNXT requests.
(function(){
const st=document.createElement('style');st.textContent=`.dnav button{flex-direction:column!important;white-space:normal!important;font-size:14px!important;min-height:56px!important;gap:1px!important}
.need textarea{width:100%;min-height:110px;font:inherit;font-size:18px;padding:12px;border:2px solid #dfe3da;border-radius:12px;box-sizing:border-box}
.need .rq{border:2px solid #dfe3da;border-radius:12px;padding:12px;margin:10px 0;background:#fff}.need .rq p{margin:6px 0 0;font-size:17px;color:#112337}
.need .stt{display:inline-block;padding:4px 12px;border-radius:14px;font-weight:800;font-size:14px;color:#fff}`;document.head.appendChild(st);
const C={New:'#112337','In progress':'#d97706',Working:'#d97706',Done:'#78a22f',Closed:'#6b7280'};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
window.ftNeed=async function(){if(window.tbDrawer)tbDrawer(false);view='need';window.scrollTo(0,0);
 A.innerHTML=`${role==='Owner'&&window.ftDashNav?ftDashNav('need'):''}<div class="card need"><h2 style="margin:0 0 4px">🙋 Need something?</h2><p class="muted" style="margin:0 0 10px">Ask the VNXT team (the people who build this app) for a change, a fix or a new feature. You'll see its status here.</p>
 <textarea id="ndq" placeholder="What do you need? For example: add a tip line to invoices"></textarea>
 <button class="btn" type="button" id="ndsend" style="width:100%;min-height:58px;font-size:20px;margin-top:8px" onclick="ftNeedSend()">Send to VNXT team</button>
 <h3 style="margin:18px 0 4px">Your requests</h3><div id="ndl"><p class="muted">Loading…</p></div></div>`;
 try{const r=await api({a:'vxMine',pin:myPin()});if(r.ok===false)throw new Error(r.err||'Failed');const l=(r.items||[]).filter(x=>!x.archived);const el=document.getElementById('ndl');if(!el)return;
  el.innerHTML=l.length?l.map(x=>`<div class="rq"><span class="stt" style="background:${C[x.status]||'#112337'}">${esc(x.status)}</span> <small class="muted">${esc(x.at)}${r.me!==x.user?' · '+esc(x.user):''}</small><p>${esc(x.request)}</p></div>`).join(''):'<p class="muted">Nothing sent yet.</p>'}
 catch(e){const el=document.getElementById('ndl');if(el)el.innerHTML='<p class="muted">Could not load: '+esc(e.message)+'</p>'}};
window.ftNeedSend=async function(){const q=document.getElementById('ndq'),b=document.getElementById('ndsend'),t=(q.value||'').trim();if(!t){q.focus();return}
 b.disabled=true;b.textContent='Sending…';try{const r=await api({a:'vxAdd',pin:myPin(),request:t});if(r.ok===false)throw new Error(r.err||'Failed');toast('Sent to the VNXT team.');ftNeed()}catch(e){b.disabled=false;b.textContent='Send to VNXT team';toast(e.message)}};
})();
