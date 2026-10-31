// Fielder voice helpers: spoken self-corrections, spoken numbers, screen wake lock, haptics, saved transcript.
(function(){
const ONES={zero:0,oh:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
const TENS={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
// "twelve hundred" -> 1200, "two thousand five hundred" -> 2500, "eighteen fifty" stays words-free as 1850 only after a price word.
function normNums(s){s=String(s||'');
 return s.replace(/\b(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|and|a)[\s-]+)*(?:hundred|thousand)\b(?:[\s-]+(?:and[\s-]+)?(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b)*/gi,m=>{
  const w=m.toLowerCase().split(/[\s-]+/).filter(x=>x&&x!=='and');if(w[0]==='a')w[0]='one';let tot=0,cur=0,any=false;
  for(const x of w){if(x in ONES){cur+=ONES[x];any=true}else if(x in TENS){cur+=TENS[x];any=true}else if(x==='hundred'){cur=(cur||1)*100;any=true}else if(x==='thousand'){tot+=(cur||1)*1000;cur=0;any=true}else return m}
  return any?String(tot+cur):m})}
const CUE=/[\s,.;:!?-]*(?:\b(?:oh\s+wait|no\s+wait|wait|actually|i\s+mean|scratch\s+that|correction|sorry|make\s+that|no)\b[\s,.;:!-]*)+(?:(?:it'?s|it\s+is|that'?s|that\s+is|make\s+(?:that|it)|the\s+(?:name|number|phone|price|address)\s+is|is)\b[\s,:]*)?/i;
const SFX=/\b(?:drive|dr|street|st|road|rd|avenue|ave|lane|ln|court|ct|circle|cir|boulevard|blvd|place|pl|trail|trl|way|parkway|pkwy|highway|hwy|terrace|cove)\b/i;
const digits=s=>String(s||'').replace(/\D/g,'');
// Returns {text, fixes:[{kind,from,to}]}. Later value replaces the earlier one of the same kind.
function resolve(text){let t=normNums(text),fixes=[],guard=0,m,pos=0;
 // only treat plain "no"/"actually"/"sorry" as a cue when something follows that looks like a value
 while(guard++<20){const sub=t.slice(pos);m=CUE.exec(sub);if(!m)break;const i=pos+m.index,before=t.slice(0,i),after=t.slice(i+m[0].length);
  const seg=(after.match(/^[^.;\n]*?(?=,\s|\.\s|\.$|;|\n|\band\b|$)/i)||[''])[0].trim();
  let fix=null;
  const ph=seg.match(/^\(?\d[\d\s().-]{5,}\d/);
  if(ph&&digits(ph[0]).length>=7){const prev=[...before.matchAll(/\(?\d[\d\s().-]{5,}\d/g)].filter(x=>digits(x[0]).length>=7).pop();if(prev)fix={kind:'phone',from:prev[0].trim(),to:ph[0].trim(),at:prev.index}}
  else if(/^\d+\s+\w+/.test(seg)&&SFX.test(seg)){const prev=[...before.matchAll(/\b\d+\s+[A-Za-z][^,.;\n]*?\b(?:drive|dr|street|st|road|rd|avenue|ave|lane|ln|court|ct|circle|cir|boulevard|blvd|place|pl|trail|trl|way|parkway|pkwy|highway|hwy|terrace|cove)\b/gi)].pop();if(prev)fix={kind:'address',from:prev[0].trim(),to:seg.match(/^\d+\s+[^,]*/)[0].trim(),at:prev.index}}
  else if(/^\$?\d[\d,]*(?:\.\d+)?(?:\s*(?:dollars|bucks))?$/i.test(seg)||/^\$?\d[\d,]*(?:\.\d+)?\s*(?:dollars|bucks)?\b/i.test(seg)&&!/[a-z]{3,}/i.test(seg.replace(/dollars|bucks/ig,''))){
   const to=seg.match(/\$?\d[\d,]*(?:\.\d+)?/)[0];const prev=[...before.matchAll(/\$?\d[\d,]*(?:\.\d+)?(?:\s*(?:dollars|bucks))?/gi)].pop();
   if(prev){const pd=digits(prev[0]);const kind=/\$|dollar|buck|price|cost|for\s*$/i.test(prev[0]+before.slice(Math.max(0,prev.index-12),prev.index))||Number(pd)>=50?'price':'qty';fix={kind,from:prev[0].replace(/\s*(dollars|bucks)/i,'').trim(),to:to+(/dollars|bucks/i.test(seg)?'':''),at:prev.index}}}
  else if(seg&&/^[A-Za-z'.-]+(?:\s+[A-Za-z'.-]+){0,3}$/.test(seg)){
   const nm=before.match(/\b(?:name(?:\s+is)?|customer(?:\s+name)?(?:\s+is)?|this\s+is|for)\s+((?:[A-Za-z'.-]+\s*){1,4})$/i);
   if(nm){const from=nm[1].trim();fix={kind:'name',from,to:seg.split(/\s+/).map(w=>w[0].toUpperCase()+w.slice(1)).join(' '),at:before.length-nm[1].length}}
   else{const pw=/wait|mean|scratch|correction|make/i.test(m[0])?before.trim().split(/\s+/):[],n=seg.split(/\s+/).length;if(pw.length>=n&&n<=3){const from=pw.slice(-n).join(' ').replace(/[,.]$/,'');if(!/^\d/.test(from)&&from.toLowerCase()!==seg.toLowerCase())fix={kind:'item',from,to:seg,at:before.trimEnd().length-from.length}}}}
  if(fix){fixes.push({kind:fix.kind,from:fix.from,to:fix.to});const b2=before.slice(0,fix.at)+fix.to+before.slice(fix.at+fix.from.length);const rest=after.slice(seg.length);t=(b2.replace(/[\s,]+$/,'')+(/^\s*,/.test(rest)?', ':/^\s*[.;]/.test(rest)?rest.trim()[0]+' ':' ')+rest.replace(/^[\s,.;]+/,'')).trim();pos=0}
  else pos=i+m[0].length}
 return {text:t,fixes}}
const NOTE='If the speaker corrects themselves, use only the corrected value.';
// Apply fixes after the AI fill so the corrected value wins even if the AI kept the first one.
function applyFixes(fixes,IT,redraw){const notes=[];if(!fixes||!fixes.length)return notes;const F=window.FDFlags;const set=(id,v,from)=>{const el=document.getElementById(id);if(!el)return;el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));if(F)F.flag(id,'Corrected from '+from)};
 fixes.forEach(f=>{if(f.kind==='name')set('nm',f.to,f.from);else if(f.kind==='phone')set('ph',f.to,f.from);else if(f.kind==='address'){const el=document.getElementById('ad');if(el){const rest=(el.value.match(/,.*$/)||[', Tallahassee, FL'])[0];set('ad',f.to+rest,f.from)}}
  else if(f.kind==='price'&&Array.isArray(IT)){const fr=Number(digits(f.from)),to=Number(String(f.to).replace(/[^\d.]/g,''));let hit=false;IT.forEach(it=>{if(!hit&&Number(it.price)===fr){it.price=to;hit=true}});if(hit){notes.push('Price corrected from $'+fr+' to $'+to+'.');redraw&&redraw()}}});return notes}
// Screen wake lock while listening
let WL=null;async function wake(on){try{if(on){if(navigator.wakeLock&&!WL){WL=await navigator.wakeLock.request('screen');WL.addEventListener('release',()=>{WL=null})}}else if(WL){const w=WL;WL=null;await w.release()}}catch(e){WL=null}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&window.VMCTL)wake(true)});
function buzz(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
// Saved transcript so a failed AI call can retry without re-speaking
function save(text){try{localStorage.fdLastTx=JSON.stringify({text,at:Date.now()})}catch(e){}}
function saved(){try{const o=JSON.parse(localStorage.fdLastTx||'null');return o&&Date.now()-o.at<86400000?o.text:''}catch(e){return ''}}
function clear(){try{localStorage.removeItem('fdLastTx')}catch(e){}}
window.FDVoice={normNums,resolve,applyFixes,NOTE,wake,buzz,save,saved,clear};
})();
