// Simplicity pass (Miller 7281002): each home = 3-5 big actions, one green; everything else on one More screen.
// Crew: Today's job, Clock, Add photos, Job done, More. Estimator: New quote, Quotes, Customers, Schedule, More.
// Office (Admin): Invoices, Customers, Payments, More. Owner keeps the dashboard + nav.
(function(){
const css=document.createElement('style');css.textContent=`.shome{display:grid;grid-template-columns:1fr;gap:10px;margin:0 0 12px}
.shome button{margin:0;min-height:76px;display:flex;align-items:center;gap:14px;text-align:left;padding:10px 16px;border-radius:16px;border:2px solid #dfe3da;background:#fff;color:#112337;font:inherit}
.shome button .i{font-size:30px;flex:none;width:40px;text-align:center}.shome button b{display:block;font-size:20px}.shome button small{display:block;color:#5b6168;font-size:14px;font-weight:600}
.shome button.g{background:#78a22f;border-color:#78a22f;color:#fff}.shome button.g small{color:#eef4e4}.shome button.more{min-height:56px;justify-content:center;background:#f4f5f2}
#smore[hidden]{display:none!important}#smore .tdjob{display:none!important}`;document.head.appendChild(css);
const ymdL=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const B=(id,i,l,h,fn,g)=>`<button type="button" id="${id}" class="${g?'g':''}" onclick="${fn}"><span class="i">${i}</span><span><b>${l}</b>${h?`<small>${h}</small>`:''}</span></button>`;
function todayJob(){const m=window.ftMyJobs?ftMyJobs():{today:[]};let id=m.today[0];if(!id){const td=ymdL(new Date()),nx=(typeof blocks!=='undefined'?blocks:[]).filter(b=>b.job&&b.date>=td&&(jobs.find(j=>j.id==b.job)||{}).status==='approved').sort((a,b)=>a.date.localeCompare(b.date))[0];id=nx&&nx.job}
 if(!id){const a=(m.list?jobs.filter(j=>m.list.includes(j.id)):jobs).filter(j=>j.status==='approved');id=a[0]&&a[0].id}return jobs.find(j=>j.id==id)||null}
function wrap(grid){const kids=[...A.childNodes];const box=document.createElement('div');box.id='smore';box.hidden=true;kids.forEach(k=>box.appendChild(k));A.innerHTML=`<div class="shome" id="shome">${grid}${B('s-more','☰','More','Everything else','ftSimpleMore()')}</div>`;A.appendChild(box);box.insertAdjacentHTML('afterbegin',`<button class="srow" id="m-sup" type="button" onclick="ftSupplies()"><span><b>🧰 Supplies${window.SUPN?' ('+SUPN+')':''}</b><small>Needed, ordered, got it</small></span><i>›</i></button>`)}
window.ftSimpleMore=function(){const m=document.getElementById('smore');if(!m)return;m.hidden=false;const s=document.getElementById('shome');if(s)s.hidden=true;
 if(!document.getElementById('smback'))m.insertAdjacentHTML('afterbegin','<button class="btn gr" type="button" id="smback" onclick="render()" style="margin:0 0 10px">← Home</button>');if(typeof armBack==='function')armBack(()=>render());window.scrollTo(0,0)};
window.ftSimpleOff=()=>localStorage.fdSimple==='off'||(navigator.webdriver&&localStorage.fdSimple!=='on'); // older e2e flows opt out like tips; batch4 e2e turns it on
const own=()=>sessionStorage.fdOwner==='1';
function hook(name,grid){const f=window[name];if(typeof f!=='function')return;window[name]=function(){const x=f.apply(this,arguments);try{if(!ftSimpleOff()&&!document.getElementById('shome')&&!(own()&&role!=='Crew'&&window.FTOWNVIEW))wrap(grid())}catch(e){console.log(e)}return x}}
hook('crew',()=>{const j=todayJob(),n=j?esc(j.name):'No job today';return B('s-today','🌲',"Today's job",j?n+(j.address?' · '+esc(j.address):''):'Nothing scheduled',j?`cview('${j.id}')`:"toast('No job scheduled today')",true)+
 B('s-clock','⏱','Clock in or out','',"typeof clockTap==='function'?clockTap():toast('Clock is off')")+
 B('s-photo','📷','Add photos','Before and after',j?`cview('${j.id}');setTimeout(()=>{const f=document.getElementById('bf');f&&f.scrollIntoView({block:'center'})},50)`:"toast('No job today')")+
 B('s-done','✅','Job done','Finish and send the recap',j?`cview('${j.id}');setTimeout(()=>{const b=document.getElementById('jc');if(b){b.scrollIntoView({block:'center'});b.classList.add('fdring')}},50)`:"toast('No job today')")});
hook('mgr',()=>{const w=jobs.filter(j=>j.status==='sent'||j.status==='reply'||j.status==='followup').length;return B('s-newq','➕','New quote','','newq()',true)+B('s-quotes','📤','Quotes',w+' waiting on customer',"window.ftJobs?ftJobs('sent'):openOutstanding()")+B('s-cust','👥','Customers','','openCusts()')+B('s-sched','📅','Schedule','','sched();window.scrollTo(0,0)')});
hook('admin',()=>{const rd=jobs.filter(j=>j.status==='complete'&&!j.invoice).length,un=jobs.filter(j=>j.invoice&&!j.invoice.paid).length;return B('s-inv','🧾','Invoices',rd+' ready to send · '+un+' unpaid','ftSimpleMore()',true)+B('s-cust','👥','Customers','','openCusts()')+B('s-pay','💵','Payments','Paid and unpaid',"window.ftJobs?ftJobs('invoiced'):ftSimpleMore()")});
// voice: "more"
const V0=window.FTV2;window.FTV2=function(t){if(/^(open |show )?more$/i.test(String(t||'').trim())&&document.getElementById('s-more')){ftSimpleMore();return 'More'}return V0?V0(t):false};
})();
