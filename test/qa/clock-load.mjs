// 30-crew clock contention vs LIVE Code.gs in worker threads (shared disk store + one script lock, ~1 s per Drive op). Local only.
import { Worker } from 'node:worker_threads'; import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const SCALE=Number(process.env.SCALE||0.01);const H=3600e3;const iso=t=>new Date(t).toISOString();const sleep=ms=>new Promise(s=>setTimeout(s,ms));
async function run(N,rounds,jobLoad){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fclk-'));const sab=new SharedArrayBuffer(8);
  const ws=[...Array(N+jobLoad)].map((_,i)=>new Worker(new URL('./ramp.mjs',import.meta.url),{workerData:{wid:'c'+i+'_',dir,sab},env:{...process.env,SCALE:String(SCALE)}}));
  const free=[...ws],waiters=[],pend=new Map();let kk=0;ws.forEach(w=>w.on('message',m=>{if(m.dump)return;pend.get(m.k)(m);pend.delete(m.k);free.push(w);const n=waiters.shift();if(n)n();}));
  const exec=async(msg)=>{while(!free.length)await new Promise(r=>waiters.push(r));const w=free.shift();const k=++kk;return new Promise(res=>{pend.set(k,res);w.postMessage({...msg,k});});};
  const acked=[];const st={first:0,busy:0,fail:0,lat:[],errs:{}};
  async function client(body){for(let n=0;;n++){const t=Date.now();const {r}=await exec({body});st.lat.push(Date.now()-t);if(n===0){st.first++;if(r.busy)st.busy++;}
    if(r.ok===false&&r.busy&&n<3){await sleep((1500*2**n+Math.random()*1000)*SCALE);continue}if(r.ok&&!r.dup&&body.cid)acked.push(body.cid);if(!r.ok&&!r.already&&!r.notIn){st.fail++;const e=String(r.err).slice(0,50);st.errs[e]=(st.errs[e]||0)+1;}return r;}}
  const names=[...Array(N)].map((_,i)=>'STRESS Crew '+(i+1));const base=Date.now()-70*H;const R=(o,t)=>({...o,pin:'0123',deviceId:'dev-'+o.who,at:iso(t),queuedAt:iso(t),offline:true});const exp=new Map(names.map(n=>[n,0]));let okIn=0,okOut=0,dblIn=0,dblInBlocked=0,dblOut=0,dblOutBlocked=0,lostIn=0;
  let stop=false;const bg=jobLoad?Promise.all([...Array(jobLoad)].map(async(_,j)=>{let i=0;while(!stop){i++;await client({a:'create',name:'bg'+j+'-'+i,address:'x',email:'a@example.com',quote:'T $1',pin:'1234'});}})):null;
  const t0=Date.now();
  for(let r=0;r<rounds;r++){const stag=r%2===1;
    await Promise.all(names.map(async(n,i)=>{if(stag)await sleep(Math.random()*30000*SCALE);const tin=base+r*12*H+8*H+i*60e3;const dur=(6+(i+r)%5)*H+i*60e3;
      const a=await client(R({a:'clockIn',who:n,cid:`in-${r}-${i}`},tin));
      if(i%5===0){dblIn++;const b=await client(R({a:'clockIn',who:n,cid:`in2-${r}-${i}`},tin+60e3));if(b.already)dblInBlocked++;}
      if(i%7===0)await client(R({a:'clockIn',who:n,cid:`in-${r}-${i}`},tin)); // offline replay, same cid
      if(!a.ok){lostIn++;return;}okIn++;
      if(stag)await sleep(Math.random()*30000*SCALE);
      const o=await client(R({a:'clockOut',who:n,cid:`out-${r}-${i}`},tin+dur));if(o.ok){okOut++;exp.set(n,exp.get(n)+dur);}
      if(i%6===0){dblOut++;const o2=await client(R({a:'clockOut',who:n,cid:`out2-${r}-${i}`},tin+dur+60e3));if(o2.notIn)dblOutBlocked++;}}));}
  stop=true;if(bg)await bg;const wall=Date.now()-t0;
  const shards=fs.readdirSync(dir).filter(f=>/^punches-.*\.json$/.test(f));const ps=shards.length?shards.flatMap(f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'))):JSON.parse(fs.readFileSync(path.join(dir,'punches.json'),'utf8'));
  // admin view via a fresh worker call
  const L=(await exec({body:{a:'clockList',pin:'6789'}})).r;ws.forEach(w=>w.terminate());
  const have=new Set(ps.flatMap(p=>[p.cid,p.ocid]));const ackedMissing=acked.filter(c=>!have.has(c)).length;const ids=ps.map(p=>p.id),cids=ps.map(p=>p.cid).filter(Boolean);
  const got=new Map();ps.forEach(p=>got.set(p.who,(got.get(p.who)||0)+(p.out?new Date(p.out)-new Date(p.in):0)));
  const wrongHrs=names.filter(n=>Math.abs((got.get(n)||0)-exp.get(n))>1000);
  const byWho=new Map();ps.forEach(p=>{if(!byWho.has(p.who))byWho.set(p.who,[]);byWho.get(p.who).push(p)});let overlaps=0;byWho.forEach(l=>{l.sort((a,b)=>a.in<b.in?-1:1);for(let i=1;i<l.length;i++){const e=l[i-1].out?new Date(l[i-1].out):Infinity;if(new Date(l[i].in)<e)overlaps++;}});
  const s=[...st.lat].sort((a,b)=>a-b);const sc=v=>Math.round(v/SCALE/100)/10;
  return {crew:N,rounds,bgJobWriters:jobLoad,requests:st.first,firstTryBusyRate:+(st.busy/st.first).toFixed(2),finalFailRate:+(st.fail/st.first).toFixed(3),errs:st.errs,p50s:sc(s[s.length>>1]),p95s:sc(s[Math.floor(s.length*.95)]),wallS:sc(wall),
    punchesStored:ps.length,expectedPunches:okIn,clockInsFailedAfterRetries:lostIn,clockOutsOk:okOut,openLeft:ps.filter(p=>!p.out).length,dupIds:ids.length-new Set(ids).size,dupCids:cids.length-new Set(cids).size,overlappingPunches:overlaps,
    doubleInBlocked:dblInBlocked+'/'+dblIn,doubleOutBlocked:dblOutBlocked+'/'+dblOut,wrongHoursPeople:wrongHrs.length,ackedMissing,acked:acked.length,adminListMatches:L.ok&&L.punches.length===ps.length&&L.now.length===ps.filter(p=>!p.out).length};}
const out=[];
for(const [N,R,J] of JSON.parse(process.env.PLAN||'[[30,5,0],[30,5,5],[10,3,0],[60,3,0],[100,3,0]]')){out.push(await run(N,R,J));console.log(JSON.stringify(out.at(-1)));}
fs.writeFileSync('/tmp/clock-load.json',JSON.stringify(out,null,1));
