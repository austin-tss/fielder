// Fielder "Use my location": GPS -> street address (Photon reverse, Nominatim fallback) into the quote's address field.
(function(){
const css=document.createElement('style');css.textContent='#gpsbtn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin:8px 0 0;padding:14px;font-size:18px;font-weight:700;border-radius:14px;border:2px solid #112337;background:#fff;color:#112337;cursor:pointer}#gpsbtn:disabled{opacity:.6}#gpsnote{font-size:14px;color:#92400e;margin:4px 0 0;min-height:0}';document.head.appendChild(css);
let BUSY=false;
function note(t){const n=document.getElementById('gpsnote');if(n)n.textContent=t||''}
async function rev(lat,lon){const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),8000);
 try{const r=await fetch('https://photon.komoot.io/reverse?lang=en&limit=1&lat='+lat+'&lon='+lon,{signal:ctl.signal});const j=await r.json();const p=((j.features||[])[0]||{}).properties;
  if(p&&(p.street||p.name)){const a=fmtAddr({num:p.housenumber,street:p.street,name:p.street?'':p.name,city:p.city||p.town||p.village||p.county,state:p.state,zip:p.postcode});if(p.housenumber)return a;var rough=a}}catch(e){}finally{clearTimeout(tm)}
 try{const r=await fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat='+lat+'&lon='+lon);const x=await r.json();const a=x.address||{};
  if(a.road)return fmtAddr({num:a.house_number,street:a.road,city:a.city||a.town||a.village||a.hamlet||a.county,state:a.state,zip:a.postcode})}catch(e){}
 return rough||''}
function pos(){return new Promise((ok,no)=>{if(!navigator.geolocation)return no({code:9});navigator.geolocation.getCurrentPosition(ok,no,{enableHighAccuracy:true,timeout:15000,maximumAge:30000})})}
async function fill(auto){const ad=document.getElementById('ad'),b=document.getElementById('gpsbtn');if(!ad||BUSY)return false;BUSY=true;if(b){b.disabled=true;b.textContent='📍 Finding where you are…'}note('');
 try{const p=await pos();const c=p.coords;try{window.GEO={lat:c.latitude,lon:c.longitude}}catch(e){}
  const a=await rev(c.latitude,c.longitude);if(!document.body.contains(ad))return false;
  if(!a){note('Couldn’t find a street address here. Type it in.');return false}
  if(auto&&ad.value.trim())return false;
  ad.value=a;ad.dispatchEvent(new Event('input',{bubbles:true}));const sg=document.getElementById('adsug');if(sg){sg.hidden=true;sg.innerHTML=''}
  if(window.FDFlags)FDFlags.flag('ad','From GPS'+(c.accuracy>60?' (about '+Math.round(c.accuracy*3.28)+' ft off)':'')+', check it');
  if(typeof toast==='function'&&!auto)toast('Address filled from your location');return true}
 catch(e){if(!auto)note(e&&e.code===1?'Location is blocked. Allow location for this site in your phone settings, or type the address.':e&&e.code===3?'Location took too long. Step outside or type the address.':e&&e.code===9?'This phone can’t share location. Type the address.':'Couldn’t get your location. Type the address.');return false}
 finally{BUSY=false;const b2=document.getElementById('gpsbtn');if(b2){b2.disabled=false;b2.textContent='📍 Use my location'}}}
function hook(){const ad=document.getElementById('ad');if(!ad||document.getElementById('gpsbtn'))return;const wrap=ad.parentElement;
 const b=document.createElement('button');b.id='gpsbtn';b.type='button';b.textContent='📍 Use my location';b.onclick=()=>fill(false);const n=document.createElement('div');n.id='gpsnote';
 wrap.after(b,n);
 // New empty quote: fill silently only if location was already allowed (no surprise prompt).
 if(!ad.value.trim()&&navigator.permissions&&navigator.permissions.query){navigator.permissions.query({name:'geolocation'}).then(s=>{if(s.state==='granted'&&!ad.value.trim()&&!(typeof editId!=='undefined'&&editId))fill(true)}).catch(()=>{})}}
new MutationObserver(hook).observe(document.getElementById('app')||document.body,{childList:true});
// For AI fill: GPS address in parallel, never prompts errors into the UI; resolves null if denied/unavailable.
async function get(){try{const p=await pos();const c=p.coords;try{window.GEO={lat:c.latitude,lon:c.longitude}}catch(e){}const a=await rev(c.latitude,c.longitude);if(!a)return null;
 const m=a.match(/,\s*([^,]+),\s*[A-Z]{2}\s*(\d{5})?\s*$/);return {address:a,city:m?m[1].trim():'',zip:m&&m[2]||''}}catch(e){return null}}
window.FDGPS={fill,rev,get};
})();
