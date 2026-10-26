// Fielder Field Desk backend (Google Apps Script) - TEST RUN.
// Every customer-facing email goes ONLY to TEST_TO, whatever customer email is typed.
var TEST_TO = 'austin@techsourcedsolutions.com';
var ROOT_NAME = 'Fielder Field Desk';
function root_(){var p=PropertiesService.getScriptProperties(),id=p.getProperty('ROOT');
  if(id){try{return DriveApp.getFolderById(id)}catch(e){}}
  var it=DriveApp.getFoldersByName(ROOT_NAME),f=it.hasNext()?it.next():DriveApp.createFolder(ROOT_NAME);
  p.setProperty('ROOT',f.getId());return f;}
function db_(){var r=root_(),it=r.getFilesByName('jobs.json');return it.hasNext()?it.next():r.createFile('jobs.json','[]','application/json');}
function load_(){return JSON.parse(db_().getBlob().getDataAsString()||'[]');}
function save_(j){db_().setContent(JSON.stringify(j));}
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function folder_(j){var r=root_(),n=j.id+' - '+(j.name||'')+' - '+(j.address||''),it=r.getFoldersByName(n);
  var f=it.hasNext()?it.next():r.createFolder(n);j.folder=f.getUrl();return f;}
function savePhotos_(j,list,kind){var f=folder_(j);
  return (list||[]).map(function(d,i){var b=Utilities.newBlob(Utilities.base64Decode(d.split(',')[1]),'image/jpeg',kind+'-'+Date.now()+'-'+i+'.jpg');
    var x=f.createFile(b);x.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
    return {id:x.getId(),url:'https://drive.google.com/thumbnail?id='+x.getId()+'&sz=w1200',kind:kind};});}
function esc_(s){return String(s||'').replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]});}
function imgs_(ps,pre){var inl={},h='';ps.forEach(function(p,i){inl[pre+i]=DriveApp.getFileById(p.id).getBlob();
  h+='<img src="cid:'+pre+i+'" style="width:100%;max-width:520px;border-radius:8px;margin:6px 0">';});return {inl:inl,h:h};}
function head_(t){return '<div style="font-family:Arial,sans-serif;max-width:560px"><div style="background:#112337;color:#fff;padding:14px 18px;border-radius:10px 10px 0 0"><b style="font-size:18px">Fielder Tree Care &amp; Service</b><br><span style="color:#b9d68a">'+t+'</span></div><div style="border:1px solid #ddd;border-top:0;padding:16px;border-radius:0 0 10px 10px">';}
var REFER='<p><a href="mailto:?subject='+encodeURIComponent('Tree service I recommend: Fielder Tree Service')+'&body='+encodeURIComponent('I used Fielder Tree Service in Tallahassee and was happy with the work. Free estimates: https://fieldertree.com/contact-us/ or (850) 656-8737')+'" style="display:block;padding:14px;background:#78a22f;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;text-align:center">Refer a neighbor</a></p>';
var TAIL='<p style="color:#666;font-size:13px">Fielder Tree Service, LLC &middot; 1382 Timberlane Rd Suite C, Tallahassee, FL 32312 &middot; (850) 656-8737</p></div></div>';
function testNote_(j){return '<p style="background:#fff3cd;padding:6px;border-radius:6px">TEST email. Intended customer: '+esc_(j.email)+'</p>';}
function sendQuote_(j){var base=ScriptApp.getService().getUrl()+'?a=respond&id='+j.id+'&ans=',im=imgs_(j.photos,'q');
  var btn=function(k,t,c){return '<a href="'+base+k+'" style="display:block;margin:8px 0;padding:14px;background:'+c+';color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px">'+t+'</a>';};
  var h=head_('Your tree service quote')+testNote_(j)+'<p>Hi '+esc_(j.name)+',</p><p><b>Job site:</b> '+esc_(j.address)+'</p><p><b>Quote:</b><br>'+esc_(j.quote).replace(/\n/g,'<br>')+'</p><p><b>Photos of the work to be done:</b></p>'+im.h+
    '<p><b>Please tap one:</b></p>'+btn('A','A) Approve: schedule the job','#78a22f')+btn('B','B) Approve with changes','#34460d')+btn('C','C) Decline','#8a8f98')+btn('O','Other: write a reply','#112337')+TAIL;
  MailApp.sendEmail({to:TEST_TO,subject:'TEST - Fielder Tree Service quote '+j.id+' for '+j.name,htmlBody:h,inlineImages:im.inl,name:'Fielder Tree Service (TEST)'});}
function sendRecap_(j){var ib=imgs_(j.crew.filter(function(p){return p.kind=='before'}),'b'),ia=imgs_(j.crew.filter(function(p){return p.kind=='after'}),'a'),inl={},k;
  for(k in ib.inl)inl[k]=ib.inl[k];for(k in ia.inl)inl[k]=ia.inl[k];
  var h=head_("Here's what we did")+testNote_(j)+'<p>Hi '+esc_(j.name)+', your job at '+esc_(j.address)+' is complete.</p><p><b>Work done:</b><br>'+esc_(j.quote).replace(/\n/g,'<br>')+'</p>'+(j.crewNotes?'<p><b>Crew notes:</b> '+esc_(j.crewNotes)+'</p>':'')+'<h3 style="color:#34460d">Before</h3>'+ib.h+'<h3 style="color:#34460d">After</h3>'+ia.h+'<p>Thank you for choosing Fielder Tree Service.</p>'+REFER+TAIL;
  MailApp.sendEmail({to:TEST_TO,subject:"TEST - Fielder Tree Service: here's what we did ("+j.id+')',htmlBody:h,inlineImages:inl,name:'Fielder Tree Service (TEST)'});}
function sendInvoice_(j){var v=j.invoice,h=head_('Invoice '+j.id)+testNote_(j)+'<p>Hi '+esc_(j.name)+',</p><p>Thank you for your business. Here is your invoice for the completed work.</p><table style="width:100%;border-collapse:collapse;font-size:15px"><tr><td style="padding:6px;border-bottom:1px solid #eee"><b>Invoice #</b></td><td style="padding:6px;border-bottom:1px solid #eee">'+j.id+'</td></tr><tr><td style="padding:6px;border-bottom:1px solid #eee"><b>Date</b></td><td style="padding:6px;border-bottom:1px solid #eee">'+Utilities.formatDate(new Date(),'America/New_York','MMM d, yyyy')+'</td></tr><tr><td style="padding:6px;border-bottom:1px solid #eee"><b>Customer</b></td><td style="padding:6px;border-bottom:1px solid #eee">'+esc_(j.name)+'<br>'+esc_(j.address)+'</td></tr><tr><td style="padding:6px;border-bottom:1px solid #eee"><b>Work</b></td><td style="padding:6px;border-bottom:1px solid #eee">'+esc_(j.quote)+'</td></tr><tr><td style="padding:6px"><b>Amount due</b></td><td style="padding:6px;font-size:20px;color:#34460d"><b>'+esc_(v.amount)+'</b></td></tr></table>'+(v.note?'<p>'+esc_(v.note)+'</p>':'')+'<p>Questions? Call (850) 656-8737 or email office@fieldertree.com.</p>'+TAIL;
  MailApp.sendEmail({to:TEST_TO,subject:'TEST - Fielder Tree Service invoice '+j.id+' - '+v.amount,htmlBody:h,name:'Fielder Tree Service (TEST)'});}
var LABELS={A:'Approved',B:'Approved with changes',C:'Declined',O:'Other'};
function respond_(j,ans,text){j.response={ans:ans,label:LABELS[ans]||ans,text:text||'',at:new Date().toISOString()};
  j.status=(ans=='A'||ans=='B')?'approved':(ans=='C'?'declined':'reply');}
function page_(b){return HtmlService.createHtmlOutput('<meta name="viewport" content="width=device-width,initial-scale=1"><div style="font-family:Arial;padding:24px;max-width:520px"><h2 style="color:#112337">Fielder Tree Service</h2>'+b+'</div>');}
function doGet(e){var p=e.parameter||{};
  if(p.a=='respond'){var L=LockService.getScriptLock();L.waitLock(20000);
    try{var js=load_(),j=js.filter(function(x){return x.id==p.id})[0];if(!j)return page_('Quote not found.');
      if(p.ans=='O'&&!p.text)return page_('<form><input type=hidden name=a value=respond><input type=hidden name=id value="'+esc_(j.id)+'"><input type=hidden name=ans value=O><p>Type your reply:</p><textarea name=text rows=5 style="width:100%;font-size:16px"></textarea><br><br><button style="padding:14px 24px;font-size:18px;background:#78a22f;color:#fff;border:0;border-radius:10px">Send</button></form>');
      respond_(j,p.ans,p.text);save_(js);
      return page_('<h3 style="color:#34460d">Thank you!</h3><p>Your answer was recorded: <b>'+esc_(j.response.label)+'</b>'+(p.text?' - '+esc_(p.text):'')+'</p>');
    }finally{L.releaseLock();}}
  return out_({ok:true,root:root_().getUrl(),jobs:load_()});}
function doPost(e){var d=JSON.parse(e.postData.contents),L=LockService.getScriptLock();L.waitLock(30000);var j,send=null;
  try{var js=load_();
    if(d.a=='create'){j={id:'FT-'+Date.now().toString(36).toUpperCase(),name:d.name,address:d.address,email:d.email,quote:d.quote,notes:d.notes||'',status:'sent',created:new Date().toISOString(),crew:[]};
      j.photos=savePhotos_(j,d.photos,'quote');js.unshift(j);save_(js);send=sendQuote_;}
    else{j=js.filter(function(x){return x.id==d.id})[0];if(!j)return out_({ok:false,err:'Job not found'});
      if(d.a=='upload'){j.crew=j.crew.concat(savePhotos_(j,d.photos,d.kind));save_(js);}
      else if(d.a=='finish'){j.crewNotes=d.notes||'';j.status='complete';j.finished=new Date().toISOString();save_(js);send=sendRecap_;}
      else if(d.a=='invoice'){j.invoice={amount:d.amount,note:d.note||'',at:new Date().toISOString()};j.status='invoiced';save_(js);send=sendInvoice_;}
      else if(d.a=='paid'){j.invoice=j.invoice||{};j.invoice.paid=!!d.paid;j.invoice.paidAt=d.paid?new Date().toISOString():'';save_(js);}
      else if(d.a=='respond'){respond_(j,d.ans,d.text);save_(js);}
      else return out_({ok:false,err:'Bad action'});}
  }finally{L.releaseLock();}
  if(send)send(j);return out_({ok:true,job:j});}
// Run once from the editor to grant permissions and create the Drive folder.
function setup(){Logger.log(root_().getUrl());}
