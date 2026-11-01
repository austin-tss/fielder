// Big thumb-reach Back + Home bar on every sub-page (phone and desktop), a default Back on pages that never set one,
// and phone swipe / browser back through history state. Owner Back/Home go to the Owner dashboard. (Miller 829a754, Fielder look.)
(function(){
const st=document.createElement('style');st.textContent=`
#bbar{position:fixed;left:0;right:0;bottom:0;z-index:58;display:none;gap:10px;padding:10px max(12px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));background:rgba(255,255,255,.96);border-top:1px solid #dfe4da;box-shadow:0 -4px 16px rgba(17,35,55,.08);backdrop-filter:blur(6px)}
#bbar button{font:inherit;font-weight:800;font-size:20px;min-height:58px;border-radius:14px;border:0;cursor:pointer}
#bbar #bb-back{flex:1;background:#112337;color:#fff}#bbar #bb-home{flex:0 0 34%;background:#eef3e4;color:#112337}
body.hasbb #bbar{display:flex}body.hasbb{padding-bottom:calc(92px + env(safe-area-inset-bottom))}html:has(body.hasbb){scroll-padding-bottom:calc(110px + env(safe-area-inset-bottom))}
body.hasbb #vhfab,body.hasbb #micfab{bottom:calc(100px + env(safe-area-inset-bottom))!important}
body.hasbb #selbar,body.hasbb #undo,body.hasbb #qbulk{bottom:calc(92px + env(safe-area-inset-bottom))!important}
body.hasbb #navbar,body.hasbb #owbar{display:none!important}
@media (min-width:768px){body.dk #bbar{left:var(--sw,240px)}#bbar{justify-content:center}#bbar #bb-back{flex:0 1 420px}#bbar #bb-home{flex:0 1 220px}}`;document.head.appendChild(st);
const bar=document.createElement('div');bar.id='bbar';bar.innerHTML='<button id="bb-back" type="button">← Back</button><button id="bb-home" type="button">🏠 Home</button>';
const add=()=>document.body&&!document.getElementById('bbar')&&document.body.appendChild(bar);add();document.addEventListener('DOMContentLoaded',add);
const owner=()=>sessionStorage.fdOwner==='1'||(typeof role!=='undefined'&&role==='Owner');
const atHome=()=>typeof role==='undefined'||!role||(owner()?view==='odash':view==='');
function home(){try{if(typeof okToLeave==='function'&&!okToLeave())return}catch(e){}if(typeof armBack==='function')armBack(null);try{SEL=null;selBar()}catch(e){}if(owner()&&window.ownerHome)ownerHome();else{view='';render()}window.scrollTo(0,0)}
window.fdHome=home;
bar.querySelector('#bb-back').onclick=()=>{if(typeof BACKFN!=='undefined'&&BACKFN)goBack();else home()};bar.querySelector('#bb-home').onclick=home;
let pushed=false;
function sync(){add();const sub=!atHome();if(sub&&typeof BACKFN!=='undefined'&&!BACKFN&&typeof armBack==='function')armBack(home);document.body.classList.toggle('hasbb',sub);
 if(sub&&!pushed){try{history.pushState({fdsub:1},'')}catch(e){}pushed=true}if(!sub&&pushed&&history.state&&history.state.fdsub){pushed=false;try{history.back()}catch(e){}}if(!sub)pushed=false}
window.addEventListener('popstate',()=>{if(!pushed)return;pushed=false;if(!atHome()){if(typeof BACKFN!=='undefined'&&BACKFN)goBack();else home()}setTimeout(sync,50)});
const AB=window.armBack;if(AB)window.armBack=armBack=function(fn){AB(fn);setTimeout(sync,0)};
window.ftNavSync=sync;setInterval(sync,400);
})();
