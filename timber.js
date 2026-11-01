// Timber: business assistant page. Chat bubbles or hands-free voice. History kept for the session.
(function(){
const st=document.createElement('style');st.textContent=`
.tb .crumb{font-size:14px;color:#5b6168;margin:0 0 6px}.tb .crumb a{color:#34460d;font-weight:800;text-decoration:none}
.tb .seg{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:0 0 8px}.tb .seg button{margin:0;min-height:50px;border-radius:12px;border:2px solid var(--line);background:#fff;font:inherit;font-weight:800;font-size:17px;color:#112337}.tb .seg button.on{background:#78a22f;border-color:#78a22f;color:#fff}
.tb .msgs{display:flex;flex-direction:column;gap:8px;margin:6px 0 10px;min-height:120px}
.tb .b{max-width:85%;padding:10px 14px;border-radius:18px;font-size:17px;line-height:1.35;white-space:pre-wrap}
.tb .b.me{align-self:flex-end;background:#78a22f;color:#fff;border-bottom-right-radius:6px}.tb .b.tm{align-self:flex-start;background:#fff;border:2px solid var(--line);color:#112337;border-bottom-left-radius:6px}
.tb .b.wait{opacity:.7;font-style:italic}.tb .b.setup{background:#fff7e6;border-color:#e0a030}
.tb .sug{display:flex;flex-direction:column;gap:6px;margin:0 0 10px}.tb .sug button{margin:0;text-align:left;min-height:48px;border-radius:12px;border:2px solid var(--line);background:#fff;font:inherit;font-size:16px;font-weight:700;color:#34460d;padding:8px 12px}
.tb .ask{display:flex;gap:6px}.tb .ask input{flex:1;min-height:54px;font-size:17px;border-radius:12px;border:2px solid var(--line);padding:0 12px}.tb .ask button{margin:0;flex:0 0 88px;min-height:54px}
.tb .vbig{position:fixed;right:16px;bottom:16px;z-index:60;margin:0;width:64px;height:64px;min-height:0;padding:0;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(17,35,55,.3);background:#78a22f;color:#fff;font-size:26px}
.tb .vbig.on{background:#b42318;animation:tbp 1.4s infinite}@keyframes tbp{50%{box-shadow:0 0 0 14px rgba(180,35,24,.18)}}
.tb .vst{text-align:center;font-weight:800;font-size:18px;min-height:26px}`;document.head.appendChild(st);
const SUG=['How much did we spend on labor yesterday and what did we bring in?','How many quotes were done yesterday?','Who’s on the clock?','Which jobs made the most money this month?'];
const H=()=>{try{return JSON.parse(sessionStorage.tbHist||'[]')}catch(e){return []}},setH=h=>sessionStorage.tbHist=JSON.stringify(h.slice(-30));
let mode=sessionStorage.tbMode||'chat',live=false,busy=false,rec=null,state='';
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function bubbles(){return H().map(m=>`<div class="b ${m.who==='me'?'me':'tm'}${m.setup?' setup':''}">${esc(m.text)}${m.setup&&(role==='Owner'||sessionStorage.fdOwner==='1')?`<br><button class="btn n" type="button" style="margin-top:8px;min-height:44px" onclick="ftTimberSetup&&ftTimberSetup()">Set it up</button>`:''}</div>`).join('')+(busy?'<div class="b tm wait" id="tbwait">Timber is checking the numbers…</div>':'')}
function paint(){if(view!=='timber')return;const m=document.getElementById('tbmsgs');if(m){m.innerHTML=bubbles();const l=m.lastElementChild;if(l&&H().length>1)l.scrollIntoView({block:'nearest'})}const s=document.getElementById('tbvst');if(s)s.textContent=state;const v=document.getElementById('tbmic');if(v){v.classList.toggle('on',live);v.textContent=live?'■':'🎙'}}
window.ftTimber=function(m){if(m)mode=sessionStorage.tbMode=m;if(mode==='chat')stopVoice();view='timber';if(typeof armBack==='function')armBack(()=>{stopVoice();(role==='Owner'||sessionStorage.fdOwner==='1')&&window.ownerHome?ownerHome():render()});window.scrollTo(0,0);
 const h=H(),own=role==='Owner'||sessionStorage.fdOwner==='1';
 A.innerHTML=`<div class="card tb">${role==='Owner'&&window.ftDashNav?ftDashNav('tools'):''}<h2 style="margin:0 0 4px">🌲 Timber</h2><p style="margin:0 0 8px;color:#5b6168">Ask about money, labor, quotes and jobs. Timber checks the real numbers.</p>
 <div class="seg"><button type="button" id="tbchat" class="${mode==='chat'?'on':''}" onclick="ftTimber('chat')">💬 Type</button><button type="button" id="tbvoice" class="${mode==='voice'?'on':''}" onclick="ftTimber('voice')">🎙 Talk</button></div>
 ${mode==='voice'?`<button type="button" class="vbig" id="tbmic" onclick="ftTimberMic()">🎙</button><div class="vst" id="tbvst">${SR?'Tap the corner mic and ask. Timber answers out loud, then listens again.':'This phone can’t listen here. Use Type.'}</div>`:''}
 <div class="msgs" id="tbmsgs"></div>
 ${h.length?'':`<div class="sug" id="tbsug">${SUG.map((s,i)=>`<button type="button" id="tbs${i}" onclick="ftTimberAsk(this.textContent)">${esc(s)}</button>`).join('')}</div>`}
 ${mode==='chat'?`<div class="ask"><input id="tbq" placeholder="Ask Timber…" enterkeyhint="send" onkeydown="if(event.key==='Enter')ftTimberAsk()"><button class="btn" type="button" id="tbsend" onclick="ftTimberAsk()">Ask</button></div>`:''}
 ${h.length?`<div class="sug" style="margin-top:10px"><button type="button" onclick="sessionStorage.tbHist='[]';ftTimber()">Start over</button></div>`:''}</div>`;paint()};
window.ftTimberAsk=async function(q){q=String(q==null?(document.getElementById('tbq')||{}).value||'':q).trim();if(!q||busy)return;const prev=H(),h=prev.concat([{who:'me',text:q}]);setH(h);busy=true;state='Thinking…';if(view!=='timber')ftTimber();else{const s=document.getElementById('tbsug');if(s)s.remove();const i=document.getElementById('tbq');if(i)i.value=''}paint();
 let ans,setup=false;try{const r=await api({a:'timber',q,history:prev.filter(m=>!m.setup).slice(-10)});ans=r.answer}catch(e){ans=String(e.message||e);setup=/needs setup/i.test(ans)}
 busy=false;setH(H().concat([{who:'tm',text:ans,setup}]));state='';paint();if(mode==='voice'&&live)speak(ans);return ans};
function speak(t){state='Speaking…';paint();try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=1.02;u.onend=()=>{state='';if(live&&view==='timber')listen();else paint()};speechSynthesis.speak(u)}catch(e){if(live)listen()}}
function listen(){if(!SR){toast('This phone can’t listen here. Use Type.');live=false;return paint()}if(busy)return;try{rec&&rec.abort()}catch(e){}rec=new SR();rec.lang='en-US';rec.interimResults=false;rec.maxAlternatives=1;let got=false;
 rec.onresult=e=>{got=true;const t=e.results[0][0].transcript;if(/^(stop|stop listening|that'?s all|goodbye|bye)\.?$/i.test(t.trim())){stopVoice();return}ftTimberAsk(t)};
 rec.onerror=e=>{if(e.error==='not-allowed'){live=false;state='Microphone is blocked. Allow it in Settings, or use Type.';paint()}};
 rec.onend=()=>{if(!got&&live&&!busy&&view==='timber')setTimeout(()=>{if(live&&!busy&&view==='timber')listen()},300)};state='Listening…';paint();try{rec.start()}catch(e){}}
function stopVoice(){live=false;state='';try{rec&&rec.abort()}catch(e){}try{speechSynthesis.cancel()}catch(e){}}
window.ftTimberMic=function(){live=!live;if(live)listen();else{stopVoice();paint()}};
// nav tab, and an entry on Manager/Admin homes
const OS=window.ownerSect;window.ownerSect=function(k){if(k==='timber')return ftTimber();return OS?OS.apply(this,arguments):undefined};
['mgr','admin'].forEach(n=>{const f=window[n];if(typeof f!=='function')return;window[n]=function(){const x=f.apply(this,arguments);setTimeout(()=>{if(sessionStorage.fdOwner==='1'||document.getElementById('tbentry')||(view!==''&&view!=='home'&&view!=='mgr'&&view!=='admin'))return;const c=A.querySelector('.card');if(!c)return;const b=document.createElement('button');b.type='button';b.id='tbentry';b.className='btn huge';b.innerHTML='🌲 Ask Timber';b.onclick=()=>ftTimber();c.parentNode.insertBefore(b,c.nextSibling)},60);return x}});
// voice: "timber", "ask timber how much …"
const V0=window.FTV2;window.FTV2=function(t){t=String(t||'');const m=t.match(/^(?:hey |ask |open )?timber[,.]?\s*(.*)$/i);if(m&&role!=='Crew'&&role!=='Estimator'){if(m[1])ftTimberAsk(m[1]);else ftTimber();return 'Timber'}return V0?V0(t):false};
})();
