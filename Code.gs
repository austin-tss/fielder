// Fielder Field Desk backend (Google Apps Script). LIVE MODE: customer emails go to the customer email on the job.
var ROOT_NAME='Fielder Field Desk';
var CO={name:'Fielder Tree Care & Service',legal:'Fielder Tree Service, LLC',addr:'1382 Timberlane Rd Suite C, Tallahassee, FL 32312',phone:'(850) 656-8737',email:'office@fieldertree.com',web:'fieldertree.com'};
var LOGO='data:image/png;base64,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';
var NAVY='#112337',GREEN='#78a22f',DG='#34460d';
var TERMS=['This estimate is valid for 30 days from the date above.','Any required permit paperwork is handled by Fielder Tree Service.','Estimates are always free. Payment is due upon completion of the work.','Fielder Tree Service is fully insured. Certificate of insurance available on request.','Work is scheduled after approval, weather permitting. 24 HR emergency service available.'];
// ---- Rule-based quote rewriter (shared by app + script) ----
var RW_SPECIES=['live oak','water oak','laurel oak','red oak','white oak','crepe myrtle','crape myrtle','sweetgum','sweet gum','magnolia','hickory','cypress','cedar','dogwood','maple','pecan','palm','pine','oak','elm','birch','holly','sycamore','poplar','willow','bamboo'];
var RW_SVC=[[/\b(emergency|storm|fallen|down(ed)? tree)\b/,'24-Hour Emergency Service'],[/\bstump/,'Stump Grinding'],[/\b(remov\w*|take down|takedown|cut down|fell\w*)\b/,'Removal'],[/\bprun\w*/,'Pruning'],[/\b(trim\w*|thin\w*|raise|lift|clearance)\b/,'Trimming'],[/\b(haul\w*|clean ?up|debris|brush)\b/,'Debris Haul-Away & Cleanup'],[/\bpermit/,'Permit Paperwork'],[/\b(assess\w*|inspect\w*|evaluat\w*)\b/,'Tree Health Assessment'],[/\b(cabl\w*|brac\w*)\b/,'Cabling & Bracing'],[/\b(lot clear\w*|land clear\w*)\b/,'Lot Clearing']];
function rwTitle(s){return s.replace(/\b[a-z]/g,function(c){return c.toUpperCase()}).replace(/\b(And|Of|The|By|To|In|On|At|With|A)\b/g,function(w,x,i){return i?w.toLowerCase():w})}
function rwSentence(s){s=s.replace(/\s+/g,' ').trim();return s?s.charAt(0).toUpperCase()+s.slice(1)+(/[.!?]$/.test(s)?'':'.'):''}
function rwPrice(s){var m=s.match(/\$\s?(\d[\d,]*(\.\d{1,2})?)\s*k?\b/i)||s.match(/(?:^|\s)(\d[\d,]{1,}(\.\d{1,2})?)\s*(dollars|bucks)?\s*$/i);
  if(!m)return {p:null,rest:s};var v=parseFloat(m[1].replace(/,/g,''));if(/k\b/i.test(m[0]))v*=1000;return {p:v,rest:s.replace(m[0],' ')}}
function rwItem(raw){var pr=rwPrice(raw),t=pr.rest.toLowerCase().replace(/\s+/g,' ').trim(),sp='',svc=[],dead=/\b(dead|dying|leaning|hazard\w*)\b/.exec(t),n=/\b(\d+|two|three|four|five)\s+(trees|oaks|pines|palms|stumps)\b/.exec(t);
  for(var i=0;i<RW_SPECIES.length;i++)if(t.indexOf(RW_SPECIES[i])>=0){sp=RW_SPECIES[i].replace('crape','crepe').replace('sweet gum','sweetgum');break}
  RW_SVC.forEach(function(r){if(r[0].test(t)&&svc.indexOf(r[1])<0)svc.push(r[1])});
  if(!sp&&/\btrees?\b/.test(t))sp=' ';
  var title;if(!svc.length)title=rwTitle(t.replace(/[.]+$/,''))||'Tree Service';
  else{var tree=svc.filter(function(x){return /Removal|Pruning|Trimming|Cabling/.test(x)}),other=svc.filter(function(x){return tree.indexOf(x)<0});
    var head=tree.length?((dead?rwTitle(dead[1])+' ':'')+(sp.trim()?rwTitle(sp)+' ':'')+'Tree '+tree.join(' & ')):'';
    title=[head].concat(other).filter(Boolean).join(' & ');if(n)title+=' ('+n[1]+')';}
  return {title:title,detail:rwSentence(pr.rest),price:pr.p}}
function rewriteQuote(raw){return String(raw||'').split(/\n|;|,(?!\d{3})|\+|\band then\b|\balso\b|(?<=\d)\s+and\b/i).map(function(s){return s.trim()}).filter(function(s){return s.length>1}).map(rwItem)
  .reduce(function(a,it){if(a.length&&it.price==null&&a[a.length-1].price==null&&false)return a;a.push(it);return a},[])}
function money(v){return v==null||isNaN(v)?'':'$'+Number(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
function validEmail(e){return /^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i.test(String(e||'').trim())}

// Quote form settings live in settings.json. Existing jobs.json rows still load if these fields are absent.
// Redeploy this web app after updating this file. Action "settings" does not send mail.
// Role PINs come from Script Properties PIN_MANAGER / PIN_CREW / PIN_ADMIN / PIN_OWNER, falling back to the original values.
// The Owner fallback placeholder below is swapped for the real PIN only in the deployed copy (never committed).
function pins_(){var p=PropertiesService.getScriptProperties(),m={Manager:String(p.getProperty('PIN_MANAGER')||'1234'),Crew:String(p.getProperty('PIN_CREW')||'0123'),Admin:String(p.getProperty('PIN_ADMIN')||'6789'),Owner:String(p.getProperty('PIN_OWNER')||OWNER_PIN_FALLBACK_)},o=m;if(!/^\d{4,8}$/.test(o.Owner))delete o.Owner;return o;}
var OWNER_PIN_FALLBACK_='__OWNER_PIN__';
// ---- Employees: Script Property EMPLOYEES_JSON = [{"id","name","email","role","pin","created"}] (same design as AIO's USERS_JSON).
// role is the internal key (Manager = Estimator on screen, Crew, Admin). Role PINs above keep working so nobody is locked out.
var EMP_ROLES={Manager:1,Crew:1,Admin:1,Owner:1};
function emps_(){var raw=prop_('EMPLOYEES_JSON');if(!raw)return [];try{var u=JSON.parse(raw);return Array.isArray(u)?u.filter(function(x){return x&&x.pin&&EMP_ROLES[x.role]}):[]}catch(e){return []}}
function saveEmps_(l){PropertiesService.getScriptProperties().setProperty('EMPLOYEES_JSON',JSON.stringify(l));}
function empOf_(d){var p=String(d&&d.pin||'');if(!p)return null;return emps_().filter(function(u){return String(u.pin)===p})[0]||null;}
// Wrong-code lockout: 20 wrong codes in 15 minutes pauses every code check for 15 minutes.
var LOGIN_MAX=20,LOGIN_WIN=900;
function locked_out_(){try{return CacheService.getScriptCache().get('fd_lock')==='1'}catch(e){return false}}
function badPin_(){try{var c=CacheService.getScriptCache(),n=Number(c.get('fd_bad')||0)+1;c.put('fd_bad',String(n),LOGIN_WIN);if(n>=LOGIN_MAX){c.put('fd_lock','1',LOGIN_WIN);c.remove('fd_bad');}}catch(e){}}
function roleOf_(d){var p=String(d&&d.pin||'');if(!p)return '';if(locked_out_())return '';var e=empOf_(d);if(e)return e.role;var m=pins_();for(var r in m)if(m[r]===p)return r;badPin_();return '';}
var FORM_PIN_=null;
function pinOk_(d){return !!roleOf_(d);}
var ROLE_CAN_={Crew:{upload:1,finish:1,smsOnWay:1,feedback:1},Admin:{invoice:1,paid:1,iedit:1,feedback:1,archive:1,importCustomers:1}};
function can_(r,a){if(r==='Manager'||r==='Owner')return true;return !!(ROLE_CAN_[r]&&ROLE_CAN_[r][a]);}
// FORMJS_START
/* Quote form editor model. Tree service wording only.
   The same rules are duplicated in Code.gs (Apps Script cannot load this file).
   Internal notes are never customer-facing. */
(function (root) {
  var DEFAULT_BODY = 'Thank you for the opportunity to care for the trees at your property. Below is your estimate for the work we discussed. A PDF copy is attached for your records.';
  var DEFAULT_SUBJECT = 'Your estimate from Fielder Tree Service - {estimate}';
  var DEFAULT_SIGN = 'Sincerely,\nFielder Tree Care & Service';
  var TREE_OPTIONS = ['Live oak', 'Water oak', 'Laurel oak', 'Red oak', 'White oak', 'Crepe myrtle', 'Sweetgum', 'Magnolia', 'Hickory', 'Cypress', 'Cedar', 'Dogwood', 'Maple', 'Pecan', 'Palm', 'Pine', 'Oak', 'Elm', 'Birch', 'Holly', 'Sycamore', 'Poplar', 'Willow', 'Bamboo', 'Other'];
  var TIMING_OPTIONS = ['Scheduled', 'Within a week', '24-hour emergency'];
  var ACCESS_OPTIONS = ['Street', 'Backyard', 'Gated', 'Tight access', 'Crane needed'];
  // Core fields can never be removed from the quote form. Everything else can be removed and added back.
  var CORE_IDS = ['name', 'address', 'email'];
  var BUILTIN_IDS = ['ai', 'name', 'address', 'email', 'phone', 'service', 'species', 'timing', 'access', 'photos', 'quote', 'addl', 'inote'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function cleanName(s, n) { return String(s || '').replace(/\u0000/g, '').trim().slice(0, n || 80); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function defaultForm() {
    return {
      services: [
        { name: 'Removal', price: '' },
        { name: 'Pruning', price: '' },
        { name: 'Trimming', price: '' },
        { name: 'Stump Grinding', price: '' },
        { name: 'Debris Haul-Away & Cleanup', price: '' },
        { name: '24-Hour Emergency Service', price: '' },
        { name: 'Tree Health Assessment', price: '' },
        { name: 'Cabling & Bracing', price: '' },
        { name: 'Lot Clearing', price: '' },
        { name: 'Permit Paperwork', price: '' }
      ],
      fields: [
        { id: 'ai', label: 'Have AI fill this quote out', kind: 'ai', show: true, customer: false },
        { id: 'name', label: 'Customer name', kind: 'text', show: true, customer: true },
        { id: 'address', label: 'Address', kind: 'address', show: true, customer: true },
        { id: 'email', label: 'Customer email', kind: 'email', show: true, customer: true },
        { id: 'phone', label: 'Customer phone', kind: 'phone', show: true, customer: false },
        { id: 'service', label: 'Service', kind: 'service', show: true, customer: true },
        { id: 'species', label: 'Tree', kind: 'select', show: true, customer: true, options: TREE_OPTIONS.slice() },
        { id: 'timing', label: 'Timing', kind: 'select', show: true, customer: true, options: TIMING_OPTIONS.slice() },
        { id: 'access', label: 'Site access', kind: 'select', show: true, customer: false, options: ACCESS_OPTIONS.slice() },
        { id: 'photos', label: 'Photos', kind: 'photos', show: true, customer: true },
        { id: 'quote', label: 'Quote (talk or type)', kind: 'notes', show: true, customer: false },
        { id: 'addl', label: 'Notes for customer', kind: 'addl', show: true, customer: true },
        { id: 'inote', label: 'Internal notes', kind: 'inote', show: true, customer: false, lock: true }
      ]
    };
  }

  function normalizeForm(saved) {
    var base = defaultForm();
    saved = saved && typeof saved === 'object' ? saved : {};
    var services = Array.isArray(saved.services) ? saved.services : base.services;
    services = services.map(function (s) {
      if (typeof s === 'string') s = { name: s, price: '' };
      var name = cleanName(s && s.name);
      if (!name) return null;
      var price = s.price == null || s.price === '' ? '' : String(s.price).replace(/[^0-9.]/g, '').slice(0, 10);
      return { name: name, price: price };
    }).filter(Boolean).slice(0, 80);
    var known = {};
    base.fields.forEach(function (f) { known[f.id] = f; });
    var seen = {};
    var fields = [];
    var src = Array.isArray(saved.fields) ? saved.fields : base.fields;
    src.forEach(function (f) {
      if (!f || !f.id || seen[f.id]) return;
      var id = cleanName(f.id, 40);
      if (!id) return;
      var builtin = known[id];
      var kind = builtin ? builtin.kind : cleanName(f.kind, 20);
      if (!builtin && ['text', 'number', 'select', 'check', 'price'].indexOf(kind) < 0) kind = 'text';
      var lock = !!(builtin && builtin.lock) || id === 'inote';
      var opts = [];
      var optSrc = Array.isArray(f.options) ? f.options : (builtin && builtin.options) || [];
      optSrc.forEach(function (x) {
        var name = cleanName(x, 60);
        if (name && opts.indexOf(name) < 0 && opts.length < 40) opts.push(name);
      });
      var custDefault = !!(builtin && builtin.customer);
      var customer = lock || id === 'ai' ? false : (typeof f.customer === 'boolean' ? f.customer : custDefault);
      fields.push({
        id: id,
        label: cleanName(f.label || (builtin && builtin.label) || 'Field', 80) || 'Field',
        kind: kind,
        show: CORE_IDS.indexOf(id) >= 0 ? true : f.show === false ? false : true,
        customer: customer,
        lock: lock,
        builtin: !!builtin,
        options: opts
      });
      seen[id] = 1;
    });
    base.fields.forEach(function (f) { if (!seen[f.id]) fields.push(clone(f)); });
    return { services: services, fields: fields };
  }

  function formField(form, id) {
    var list = (form && form.fields) || [];
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return null;
  }
  function customerSees(form, id) {
    if (id === 'inote' || id === 'internalNotes' || id === 'notes' || id === 'crewNotes') return false;
    var f = formField(form, id);
    if (!f) return false;
    if (f.lock || f.show === false || f.customer === false) return false;
    return true;
  }
  function serviceNames(form) {
    return ((form && form.services) || []).map(function (s) { return s.name; }).filter(Boolean);
  }
  function servicePrice(form, name) {
    var row = ((form && form.services) || []).filter(function (s) { return s.name === name; })[0];
    if (!row || row.price == null || row.price === '') return null;
    var n = Number(row.price);
    return isNaN(n) ? null : n;
  }
  function buildLines(form, service, spokenItems) {
    var items = [];
    var name = cleanName(service, 80);
    if (name) items.push({ title: name, detail: '', price: servicePrice(form, name) });
    (spokenItems || []).forEach(function (it) { if (it && it.title) items.push(it); });
    return items;
  }
  function customerJob(j) {
    var o;
    try { o = JSON.parse(JSON.stringify(j || {})); } catch (e) { o = {}; }
    delete o.internalNotes;
    delete o.notes;
    delete o.inote;
    delete o.phone2;
    delete o.contact2;
    delete o.hardness;
    delete o.hardnessHow;
    delete o.aiNote;
    return o;
  }
  function emailText(s) {
    return esc(s).replace(/\r\n/g, '\n').replace(/\n/g, '<br>');
  }
  function fillCopy(text, job) {
    job = job || {};
    return String(text)
      .replace(/\{name\}/gi, String(job.name || '').trim())
      .replace(/\{estimate\}/gi, String(job.est || '').trim())
      .replace(/\{address\}/gi, String(job.address || '').trim());
  }
  function quoteCopy(settings, job) {
    settings = settings || {};
    function pick(key, fallback) {
      var v = settings[key];
      v = v == null ? '' : String(v).replace(/\u0000/g, '').trim();
      return v || fallback;
    }
    return {
      body: fillCopy(pick('quoteBody', DEFAULT_BODY), job),
      subject: fillCopy(pick('quoteSubject', DEFAULT_SUBJECT), job).replace(/[\r\n]+/g, ' ').trim(),
      sign: fillCopy(pick('quoteSign', DEFAULT_SIGN), job)
    };
  }
  function specPairs(j, form) {
    j = j || {};
    var defs = [
      ['service', 'Service', j.service || ''],
      ['species', 'Tree', j.species || ''],
      ['timing', 'Timing', j.timing || ''],
      ['access', 'Site access', j.access || ''],
      ['phone', 'Phone', j.phone || '']
    ];
    var rows = [];
    defs.forEach(function (d) {
      if (!String(d[2]).trim()) return;
      if (!customerSees(form, d[0])) return;
      var f = formField(form, d[0]);
      rows.push([(f && f.label) || d[1], String(d[2]).trim()]);
    });
    var custom = j.custom || {};
    ((form && form.fields) || []).forEach(function (f) {
      if (!f || f.builtin) return;
      if (f.show === false || f.customer === false || f.lock) return;
      var v = custom[f.id];
      if (f.kind === 'check') v = v ? 'Yes' : '';
      v = String(v == null ? '' : v).trim();
      if (!v) return;
      if (f.kind === 'price' && !isNaN(Number(v))) v = '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      rows.push([f.label || 'Detail', v.slice(0, 400)]);
    });
    return rows;
  }
  function specHtml(j, form) {
    var rows = specPairs(customerJob(j), form);
    if (!rows.length) return '';
    return '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin:0 0 16px">' +
      rows.map(function (r) {
        return '<tr><td style="padding:6px 8px;border-bottom:1px solid #eef0ea;color:#5b6168;width:42%">' + esc(r[0]) + '</td><td style="padding:6px 8px;border-bottom:1px solid #eef0ea"><b>' + esc(r[1]) + '</b></td></tr>';
      }).join('') + '</table>';
  }
  function additionalNotesHtml(j, form) {
    if (!customerSees(form, 'addl')) return '';
    var t = String((j && j.additionalNotes) || '').trim();
    if (!t) return '';
    return '<p style="margin:18px 0 6px"><b style="color:#112337">Notes</b></p><p style="line-height:1.6;margin:0">' + emailText(t) + '</p>';
  }
  function customerPreviewHtml(j, form) {
    var face = customerJob(j);
    var rows = specPairs(face, form).map(function (r) {
      return '<p style="margin:6px 0"><b>' + esc(r[0]) + '</b> ' + esc(r[1]) + '</p>';
    }).join('');
    var notes = '';
    if (customerSees(form, 'addl') && String(face.additionalNotes || '').trim()) {
      notes = '<p style="margin:8px 0"><b>Notes</b><br>' + emailText(face.additionalNotes) + '</p>';
    }
    return rows + notes;
  }
  /* True when a customer-facing HTML blob leaked staff-only data. */
  function leaksInternal(html, secrets) {
    var h = String(html || '');
    return (secrets || []).some(function (s) { return s && h.indexOf(s) >= 0; });
  }

  function quoteFieldsHtml(form, opts) {
    opts = opts || {};
    form = normalizeForm(form);
    var html = '';
    var ai = formField(form, 'ai');
    // The AI button always sits at the very top of the form when it is shown.
    if (ai && ai.show !== false) html += '<div data-field="ai" id="aibox"><button class="btn huge" id="aibtn" type="button" onclick="aiStart()">🎙 ' + esc(ai.label) + '</button><div id="aistat" class="muted" style="text-align:center;margin-top:6px"></div></div>';
    form.fields.forEach(function (f) {
      if (f.show === false || f.id === 'ai') return;
      var label = '<label>' + esc(f.label) + '</label>';
      var wrap = function (inner) { return '<div data-field="' + esc(f.id) + '">' + inner + '</div>'; };
      if (f.id === 'name') html += wrap(label + '<input id="nm" autocomplete="name">');
      else if (f.id === 'address') html += wrap(label + '<div style="position:relative"><input id="ad" autocomplete="off" autocapitalize="words" placeholder="Start typing the address"><div class="sug" id="adsug" hidden></div></div>');
      else if (f.id === 'email') html += wrap(label + '<input id="em" type="email" inputmode="email" autocomplete="off">' + (opts.emailNote || ''));
      else if (f.id === 'phone') html += wrap(label + '<input id="ph" type="tel" inputmode="tel" autocomplete="tel" placeholder="Optional">');
      else if (f.kind === 'service') {
        var names = serviceNames(form);
        html += wrap(label + '<select id="svc"><option value="">Choose a service</option>' + names.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') + '</select><p class="muted">A saved quote keeps this name even if you later delete it in Settings.</p>');
      } else if (f.kind === 'select') {
        var sid = f.builtin ? f.id : ('cx-' + f.id);
        html += wrap(label + '<select id="' + esc(sid) + '"><option value="">Choose</option>' + (f.options || []).map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>');
      } else if (f.kind === 'photos') {
        html += wrap(label + '<input type="file" id="pf" accept="image/*" capture="environment" multiple hidden onchange="pick(this,showP)"><button class="btn d" type="button" onclick="var p=document.getElementById(\'pf\');if(p)p.click()">📷 Take photo</button><div id="pp"></div>');
      } else if (f.kind === 'notes') {
        html += wrap(label + '<textarea id="qt" rows="6" placeholder="Remove the oak by the driveway, grind stump… $1,800"></textarea><button class="btn mic" id="mb" type="button">🎤 Talk</button><p class="muted">This box stays on the job. The customer sees the line items, not this text.</p>');
      } else if (f.kind === 'addl') {
        html += wrap(label + '<textarea id="addl" rows="4" placeholder="What the price includes, a gate code, or when to call."></textarea><p class="muted">Shown on the estimate, PDF, and invoice. Not a price line.</p>');
      } else if (f.kind === 'inote' || f.lock) {
        html += wrap(label + '<textarea id="inote" rows="3" placeholder="Crew only. Never on the customer estimate."></textarea><p class="muted">Internal only. Never on the estimate, PDF, invoice, or any customer page.</p>');
      } else if (f.kind === 'check') {
        html += wrap('<label class="checks"><span style="display:flex;gap:10px;align-items:center"><input type="checkbox" id="cx-' + esc(f.id) + '"> ' + esc(f.label) + '</span></label>');
      } else {
        var mode = (f.kind === 'number' || f.kind === 'price') ? ' inputmode="decimal"' : '';
        html += wrap(label + '<input id="cx-' + esc(f.id) + '"' + mode + '>');
      }
    });
    return html;
  }

  function settingsHtml(form, mail) {
    form = form || defaultForm();
    mail = mail || {};
    var services = (form.services || []).map(function (s, i) {
      return '<div class="line"><input data-svc="' + i + '" data-k="name" value="' + esc(s.name) + '" placeholder="Service name"><input data-svc="' + i + '" data-k="price" inputmode="decimal" value="' + esc(s.price || '') + '" placeholder="Default price"><button class="btn gr" type="button" onclick="delService(' + i + ')">Remove</button></div>';
    }).join('');
    var fields = (form.fields || []).map(function (f, i) {
      var opts = f.kind === 'select'
        ? '<label>Dropdown choices, separated by commas</label><input data-fld="' + i + '" data-k="options" value="' + esc((f.options || []).join(', ')) + '">'
        : '';
      var remove = f.builtin ? '' : '<button class="btn gr" type="button" onclick="removeField(' + i + ')">Remove field</button>';
      return '<div class="line" data-field-row="' + esc(f.id) + '"' + (f.show === false ? ' style="opacity:.7"' : '') + '><input type="checkbox" class="sr" aria-hidden="true" tabindex="-1" data-fld="' + i + '" data-k="show" ' + (f.show !== false ? 'checked' : '') + (CORE_IDS.indexOf(f.id) >= 0 ? ' disabled' : '') + '>' +
        (CORE_IDS.indexOf(f.id) >= 0 ? '<p class="muted" style="margin:0 0 6px">Always on the form</p>' : f.show === false
          ? '<div class="row" style="align-items:center"><span class="muted" style="flex:1">Removed from the quote form</span><button class="btn n" type="button" style="margin:0;flex:0 0 auto;width:auto;padding:12px 18px" onclick="toggleField(' + i + ',true)">Add back</button></div>'
          : '<div class="row" style="justify-content:flex-end"><button class="btn gr" type="button" style="margin:0 0 6px;width:auto;padding:12px 18px;color:#b91c1c" onclick="toggleField(' + i + ',false)">Remove from form</button></div>') +
        '<input data-fld="' + i + '" data-k="label" value="' + esc(f.label) + '">' +
        '<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-fld="' + i + '" data-k="customer" ' + (f.customer ? 'checked' : '') + (f.lock || f.id === 'ai' ? ' disabled' : '') + '> Customer sees this</label>' +
        opts +
        '<div class="row"><button class="btn gr" type="button" onclick="moveField(' + i + ',-1)">Up</button><button class="btn gr" type="button" onclick="moveField(' + i + ',1)">Down</button></div>' +
        remove + '</div>';
    }).join('');
    return '<div class="card" id="formroot"><h2>Quote form</h2>' +
      '<p class="muted">Hide, rename, and reorder fields. Edit dropdown lists. Choose which custom fields the customer sees. Internal notes stay off every customer page.</p>' +
      '<h2 style="font-size:18px">Services and line prices</h2>' +
      '<p class="muted">These are the service dropdown and the default line on a new quote. Deleting one here does not change a quote you already saved.</p>' +
      services +
      '<button class="btn gr" type="button" onclick="addService()">Add service</button>' +
      '<h2 style="font-size:18px">Fields</h2>' + fields +
      '<h2 style="font-size:18px">Add a field</h2>' +
      '<label>New field label</label><input id="nfname" placeholder="Gate code">' +
      '<label>Kind</label><select id="nfkind"><option value="text">Text</option><option value="number">Number</option><option value="select">Dropdown</option><option value="check">Checkbox</option><option value="price">Price</option></select>' +
      '<label>Dropdown choices, separated by commas</label><input id="nfopts" placeholder="Only for a dropdown">' +
      '<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="nfcust"> Customer sees this</label>' +
      '<button class="btn n" type="button" onclick="addFormField()">Add field</button>' +
      '<button class="btn gr" type="button" onclick="resetForm()">Reset form to default</button>' +
      '<h2 style="font-size:18px">Estimate wording</h2>' +
      '<p class="muted">This is the estimate email. Leave a box blank to keep Fielder\'s original line. {name}, {estimate}, and {address} fill in for that customer.</p>' +
      '<label>Subject</label><textarea id="qsub" rows="2">' + esc(mail.subject || '') + '</textarea>' +
      '<label>Message</label><textarea id="qbody" rows="6">' + esc(mail.body || '') + '</textarea>' +
      '<label>Sign-off</label><textarea id="qsign" rows="3">' + esc(mail.sign || '') + '</textarea>' +
      '<button class="btn gr" type="button" onclick="resetWording()">Reset wording to default</button>' +
      '</div>' +
      '<button class="btn huge" id="ss" type="button" onclick="saveSet()">Save settings</button>' +
      '<button class="btn gr" type="button" onclick="closeSet()">Back</button>';
  }

  var FDForm = {
    CORE_IDS: CORE_IDS,
    DEFAULT_BODY: DEFAULT_BODY,
    DEFAULT_SUBJECT: DEFAULT_SUBJECT,
    DEFAULT_SIGN: DEFAULT_SIGN,
    BUILTIN_IDS: BUILTIN_IDS,
    esc: esc,
    defaultForm: defaultForm,
    normalizeForm: normalizeForm,
    formField: formField,
    customerSees: customerSees,
    serviceNames: serviceNames,
    servicePrice: servicePrice,
    buildLines: buildLines,
    customerJob: customerJob,
    emailText: emailText,
    quoteCopy: quoteCopy,
    specPairs: specPairs,
    specHtml: specHtml,
    additionalNotesHtml: additionalNotesHtml,
    customerPreviewHtml: customerPreviewHtml,
    leaksInternal: leaksInternal,
    quoteFieldsHtml: quoteFieldsHtml,
    settingsHtml: settingsHtml
  };
  root.FDForm = FDForm;
  if (typeof module !== 'undefined' && module.exports) module.exports = FDForm;
})(typeof globalThis !== 'undefined' ? globalThis : this);
// FORMJS_END
function loadObj_(n){var r=root_(),it=r.getFilesByName(n);if(!it.hasNext())return {};var raw='';try{raw=it.next().getBlob().getDataAsString()||''}catch(e){return {}}if(!raw||raw==='[]')return {};try{var o=JSON.parse(raw);if(!o||typeof o!=='object'||Array.isArray(o))return {};return o}catch(e2){return {}}}
function saveObj_(o,n){var r=root_(),it=r.getFilesByName(n),f=it.hasNext()?it.next():r.createFile(n,'{}','application/json');f.setContent(JSON.stringify(o))}
function settings_(){var o={};try{o=loadObj_('settings.json')}catch(e){o={}}var form;try{form=FDForm.normalizeForm(o.form)}catch(e2){form=FDForm.normalizeForm(null)}return {discountPct:discPct_(o),form:form,quoteBody:String(o.quoteBody||''),quoteSubject:String(o.quoteSubject||''),quoteSign:String(o.quoteSign||''),theme:o.theme==='dark'?'dark':'classic',qbo:qboPublic_(),voice:!!prop_('GEMINI_API_KEY'),placesKey:String(prop_('GOOGLE_PLACES_KEY')||'')}}
function bodyHtml_(body){if(body===FDForm.DEFAULT_BODY)return body;return FDForm.emailText(body)}
function signHtml_(sign){if(sign===FDForm.DEFAULT_SIGN)return '<p>Sincerely,<br><b>'+CO.name+'</b></p>';return '<p>'+FDForm.emailText(sign)+'</p>'}
function custBlock_(j){try{var form=settings_().form,face=FDForm.customerJob(j);return FDForm.specHtml(face,form)+FDForm.additionalNotesHtml(face,form)}catch(e){return ''}}
function clip_(s,n){return String(s==null?'':s).replace(/\u0000/g,'').trim().slice(0,n)}
function cleanCustom_(o){var out={},n=0,k;if(!o||typeof o!=='object'||Array.isArray(o))return out;for(k in o){if(!Object.prototype.hasOwnProperty.call(o,k))continue;if(n>=40)break;var key=clip_(k,40);if(!key)continue;var v=o[k];if(typeof v==='boolean')out[key]=v;else out[key]=clip_(v,400);n++}return out}
function cleanItems_(items){var out=[];(items||[]).forEach(function(i){if(!i||out.length>=80)return;var title=clip_(i.title,200);if(!title)return;var price=i.price;if(price==null||price==='')price=null;else{price=Number(price);if(isNaN(price))price=null}out.push({title:title,detail:clip_(i.detail,2000),price:price})});return out}
function formFields_(j,d){if(!d)return j;if('phone' in d)j.phone=clip_(d.phone,40);if('service' in d)j.service=clip_(d.service,80);if('species' in d)j.species=clip_(d.species,80);if('timing' in d)j.timing=clip_(d.timing,80);if('access' in d)j.access=clip_(d.access,80);if('additionalNotes' in d)j.additionalNotes=clip_(d.additionalNotes,4000);if('internalNotes' in d)j.internalNotes=clip_(d.internalNotes,4000);if('custom' in d)j.custom=cleanCustom_(d.custom);if('phone2' in d)j.phone2=clip_(d.phone2,40);if('contact2' in d)j.contact2=clip_(d.contact2,120);return j}

function root_(){var p=PropertiesService.getScriptProperties(),id=p.getProperty('ROOT');
  if(id){try{return DriveApp.getFolderById(id)}catch(e){}}
  var it=DriveApp.getFoldersByName(ROOT_NAME),f=it.hasNext()?it.next():DriveApp.createFolder(ROOT_NAME);
  p.setProperty('ROOT',f.getId());return f;}
function file_(n){var r=root_(),it=r.getFilesByName(n);return it.hasNext()?it.next():r.createFile(n,'[]','application/json');}
function load_(n){return JSON.parse(file_(n||'jobs.json').getBlob().getDataAsString()||'[]');}
function save_(j,n){file_(n||'jobs.json').setContent(JSON.stringify(j));}
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
// ---- Load safety: short tryLock, never send email / build PDFs / text while holding the lock. ----
var BUSY_={ok:false,busy:true,err:'Busy, please retry'};
function prop_(k){try{return PropertiesService.getScriptProperties().getProperty(k)}catch(e){return null}}
// Script Property TEST_SKIP_EMAIL='true' logs emails instead of sending them (default off).
function skipEmail_(){return String(prop_('TEST_SKIP_EMAIL')||'').toLowerCase()==='true';}
// TEST RUN: every customer-facing email goes ONLY to TEST_EMAIL_TO (default austin@techsourcedsolutions.com). Never howard.com.
function testTo_(){var t=String(prop_('TEST_EMAIL_TO')||'austin@techsourcedsolutions.com').trim();return /howard\.com/i.test(t)?'austin@techsourcedsolutions.com':t;}
function mail_(m){var orig=String(m.to||'');m.to=testTo_();delete m.cc;delete m.bcc;if(orig.toLowerCase()!==m.to.toLowerCase())m.subject='[TEST to '+orig+'] '+(m.subject||'');if(skipEmail_()){Logger.log('TEST_SKIP_EMAIL: not sent | to='+m.to+' | '+m.subject);return {skipped:true};}MailApp.sendEmail(m);return {sent:true};}
function newId_(pre){return pre+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,7).toUpperCase();}
function lock_(ms){var L=LockService.getScriptLock();try{if(L.tryLock(ms||20000))return L}catch(e){}return null;}
function trash_(id){try{if(id)DriveApp.getFolderById(id).setTrashed(true)}catch(e){}}
function unlock_(L){try{if(L)L.releaseLock()}catch(e){}}
function findJob_(js,id){return js.filter(function(x){return x.id==id})[0];}
function patchJob_(id,fn){var L=lock_(20000);if(!L){Logger.log('patchJob_ busy for '+id);return null;}try{var js=load_(),j=findJob_(js,id);if(!j)return null;fn(j);save_(js);return j;}finally{unlock_(L)}}
// Must-persist patch (PDF/folder links): retry with backoff so a busy lock never silently drops the link.
function patchJobRetry_(id,fn,tries){var w=[0,1500,3000,6000,10000,15000,20000,30000];for(var i=0;i<(tries||w.length);i++){if(w[i])Utilities.sleep(w[i]+Math.floor(Math.random()*500));var r=patchJob_(id,fn);if(r)return r;}Logger.log('patchJobRetry_ gave up for '+id);return null;}

function folder_(j){var r=root_();if(j.folderId){try{return DriveApp.getFolderById(j.folderId)}catch(e){}}
  var n=j.id+' - '+(j.name||'')+' - '+(j.address||''),it=r.getFoldersByName(n);
  var f=it.hasNext()?it.next():r.createFolder(n);j.folder=f.getUrl();j.folderId=f.getId();return f;}
function savePhotos_(j,list,kind){var f=folder_(j);
  return (list||[]).map(function(d,i){var b=Utilities.newBlob(Utilities.base64Decode(d.split(',')[1]),'image/jpeg',kind+'-'+Date.now()+'-'+i+'.jpg');
    var x=f.createFile(b);x.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
    return {id:x.getId(),url:'https://drive.google.com/thumbnail?id='+x.getId()+'&sz=w1200',kind:kind};});}
function esc_(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]});}
function estNo_(){var p=PropertiesService.getScriptProperties(),y=new Date().getFullYear(),k='EST'+y,n=Number(p.getProperty(k)||0)+1;p.setProperty(k,String(n));return 'FT-EST-'+y+'-'+(n<1000?('000'+n).slice(-4):String(n));}
function today_(){return Utilities.formatDate(new Date(),'America/New_York','MMMM d, yyyy');}
function num_(v,dflt){if(v==null||v==='')return dflt;var n=Number(String(v).replace(/[$,\s]/g,''));return isFinite(n)?n:dflt;}
function total_(items){return (items||[]).reduce(function(a,i){return a+num_(i.price,0)},0);}
function inRoot_(f){var rid=root_().getId(),seen=0,q=[f];while(q.length&&seen<40){var x=q.shift();seen++;if(!x.getParents)return false;var it=x.getParents();while(it.hasNext()){var par=it.next();if(par.getId()==rid)return true;q.push(par);}}return false;}
function availText_(r){if(!r||!(r.avail||r.when))return '';return [r.avail,r.when].filter(Boolean).join(' - ');}
// ---- shared branded pieces ----
function head_(title,sub,logoSrc){return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:0 auto;color:#231f20">'+
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:'+NAVY+';border-radius:12px 12px 0 0"><tr><td style="padding:18px 20px;width:70px"><img src="'+logoSrc+'" width="63" height="51" alt="Fielder" style="background:#fff;border-radius:8px;padding:4px;display:block"></td>'+
  '<td style="padding:18px 20px 18px 0;color:#fff"><div style="font-size:20px;font-weight:bold">'+CO.name+'</div><div style="color:#b9d68a;font-size:14px">'+title+(sub?' &middot; '+sub:'')+'</div></td></tr></table>'+
  '<div style="border:1px solid #dde3d3;border-top:0;padding:22px;border-radius:0 0 12px 12px;background:#fff">';}
function foot_(){return '<hr style="border:0;border-top:1px solid #e6e9e0;margin:22px 0 12px"><p style="color:#5b6168;font-size:12px;line-height:1.6;margin:0"><b style="color:'+NAVY+'">'+CO.legal+'</b><br>'+CO.addr+'<br>'+CO.phone+' &middot; <a href="mailto:'+CO.email+'" style="color:'+DG+'">'+CO.email+'</a> &middot; <a href="https://'+CO.web+'" style="color:'+DG+'">'+CO.web+'</a><br>Free estimates &middot; Fully insured &middot; 24 HR emergency service</p></div></div>';}
function itemsTable_(j){var rows=(j.items||[]).map(function(i,n){return '<tr><td style="padding:10px 8px;border-bottom:1px solid #eef0ea;vertical-align:top;color:#8a8f98">'+(n+1)+'</td><td style="padding:10px 8px;border-bottom:1px solid #eef0ea"><b>'+esc_(i.title)+'</b>'+(i.detail?'<br><span style="color:#5b6168;font-size:13px">'+esc_(i.detail)+'</span>':'')+'</td><td style="padding:10px 8px;border-bottom:1px solid #eef0ea;text-align:right;white-space:nowrap">'+(i.price==null||i.price===''?'Included':money(Number(i.price)))+'</td></tr>';}).join('');
  return '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:15px"><tr style="background:#f1f5ea"><th style="padding:8px;text-align:left;color:'+DG+'">#</th><th style="padding:8px;text-align:left;color:'+DG+'">Service</th><th style="padding:8px;text-align:right;color:'+DG+'">Amount</th></tr>'+rows+
    '<tr><td></td><td style="padding:12px 8px;text-align:right;font-weight:bold">Total</td><td style="padding:12px 8px;text-align:right;font-size:20px;font-weight:bold;color:'+DG+'">'+money(j.total!=null?Number(j.total):total_(j.items))+'</td></tr></table>';}
function meta_(j,label,no){return '<table width="100%" style="font-size:14px;margin:0 0 16px"><tr><td style="vertical-align:top"><b style="color:'+NAVY+'">Prepared for</b><br>'+esc_(j.name)+'<br>'+esc_(j.address)+'<br>'+esc_(j.email)+'</td><td style="vertical-align:top;text-align:right"><b style="color:'+NAVY+'">'+label+'</b> '+no+'<br>Date: '+today_()+'</td></tr></table>';}
function imgs_(ps,pre){var inl={},h='';(ps||[]).forEach(function(p,i){inl[pre+i]=DriveApp.getFileById(p.id).getBlob();
  h+='<img src="cid:'+pre+i+'" style="width:48%;max-width:290px;border-radius:8px;margin:4px 1%;display:inline-block">';});return {inl:inl,h:h};}
function logoBlob_(){return Utilities.newBlob(Utilities.base64Decode(LOGO.split(',')[1]),'image/png','logo.png');}
function respUrl_(j,k){return ScriptApp.getService().getUrl()+'?a=respond&id='+encodeURIComponent(j.id)+'&ans='+k;}
function quoteHtml_(j,photosHtml,logoSrc,baseFn){var copy=FDForm.quoteCopy(settings_(),j);var btn=function(k,t,c){return '<a href="'+baseFn(k)+'" style="display:block;margin:8px 0;padding:15px;background:'+c+';color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;font-size:16px;text-align:center">'+t+'</a>';};
  return head_('Estimate',j.est,logoSrc)+'<p style="font-size:16px">Dear '+esc_(j.name)+',</p><p style="line-height:1.6">'+bodyHtml_(copy.body)+'</p>'+
  meta_(j,'Estimate #',j.est)+custBlock_(j)+itemsTable_(j)+(photosHtml?'<p style="margin:18px 0 6px"><b style="color:'+NAVY+'">Site photos</b></p>'+photosHtml:'')+
  (typeof featSignBtn_==='function'?featSignBtn_(j):'')+'<div style="background:#f6f8f2;border-radius:10px;padding:16px;margin:20px 0"><p style="margin:0 0 4px;font-size:16px"><b style="color:'+NAVY+'">Ready to move forward? Tap one:</b></p><p style="margin:0 0 6px;color:#5b6168;font-size:13px">You will be asked for your preferred time window next.</p>'+
  btn('A','A) Approve &mdash; schedule my job',GREEN)+btn('B','B) Approve with changes',DG)+btn('C','C) Decline for now','#8a8f98')+btn('O','Other &mdash; send a question',NAVY)+'</div>'+
  '<p style="font-size:13px;color:#5b6168;line-height:1.6"><b>Terms:</b> '+TERMS.join(' ')+'</p>'+signHtml_(copy.sign)+foot_();}
function pdfHtml_(j){return '<html><head><style>@page{margin:28px}body{font-family:Arial,Helvetica,sans-serif}</style></head><body>'+head_('Estimate',j.est,LOGO)+meta_(j,'Estimate #',j.est)+custBlock_(j)+itemsTable_(j)+
  '<h3 style="color:'+NAVY+';margin:22px 0 6px;font-size:15px">Terms &amp; Conditions</h3><ul style="font-size:13px;color:#33383d;line-height:1.6;padding-left:18px">'+TERMS.map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul>'+
  '<p style="font-size:13px">To approve, use the buttons in the estimate email or call '+CO.phone+'.</p><table width="100%" style="margin-top:28px;font-size:13px"><tr><td>Customer signature: ____________________________</td><td style="text-align:right">Date: ______________</td></tr></table>'+foot_()+'</body></html>';}
function makePdf_(j){var b=Utilities.newBlob(pdfHtml_(j),'text/html','e.html').getAs('application/pdf').setName('Fielder Estimate '+j.est+'.pdf');
  var f=folder_(j).createFile(b);j.pdf=f.getUrl();j.pdfId=f.getId();return b;}
function mustEmail_(j){if(!validEmail(j.email))throw new Error('Customer email is missing or invalid: "'+(j.email||'')+'". Fix it on the job before sending.');}
function sendQuote_(j){mustEmail_(j);var im=imgs_(j.photos,'q');im.inl.logo=logoBlob_();var pdf=makePdf_(j);
  mail_({to:j.email,replyTo:CO.email,name:CO.name,subject:FDForm.quoteCopy(settings_(),j).subject,htmlBody:quoteHtml_(j,im.h,'cid:logo',function(k){return respUrl_(j,k)}),inlineImages:im.inl,attachments:[pdf]});}
function recapHtml_(j,bh,ah,logoSrc){var r=j.response||{},av=availText_(r);
  var REFER='<a href="mailto:?subject='+encodeURIComponent('Tree service I recommend: Fielder Tree Service')+'&body='+encodeURIComponent('I used Fielder Tree Service in Tallahassee and was really happy with the work. Free estimates: https://fieldertree.com/contact-us/ or (850) 656-8737')+'" style="display:block;padding:15px;background:'+GREEN+';color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;text-align:center;font-size:16px">Refer a neighbor</a>';
  return head_("Here's what we did",j.est,logoSrc)+'<p style="font-size:16px">Hi '+esc_(j.name)+',</p><p style="line-height:1.6">Your job at '+esc_(j.address)+' is complete. Here is a quick look at the work.</p>'+itemsTable_(j)+custBlock_(j)+
  (av?'<p><b style="color:'+NAVY+'">Scheduled per your preference:</b> '+esc_(av)+'</p>':'')+(j.crewNotes?'<p><b style="color:'+NAVY+'">Crew notes:</b> '+esc_(j.crewNotes)+'</p>':'')+
  '<h3 style="color:'+DG+'">Before</h3>'+(bh||'<p style="color:#8a8f98">No photos</p>')+'<h3 style="color:'+DG+'">After</h3>'+(ah||'<p style="color:#8a8f98">No photos</p>')+
  '<p style="line-height:1.6">Thank you for choosing Fielder Tree Service. If you were happy with our work, we would be grateful if you passed our name along.</p>'+REFER+(typeof ftPortalP_==='function'?ftPortalP_(j):'')+foot_();}
function sendRecap_(j){mustEmail_(j);var ib=imgs_(j.crew.filter(function(p){return p.kind=='before'}),'b'),ia=imgs_(j.crew.filter(function(p){return p.kind=='after'}),'a'),inl={logo:logoBlob_()},k;
  for(k in ib.inl)inl[k]=ib.inl[k];for(k in ia.inl)inl[k]=ia.inl[k];
  mail_({to:j.email,replyTo:CO.email,name:CO.name,subject:"Here's what we did - Fielder Tree Service",htmlBody:recapHtml_(j,ib.h,ia.h,'cid:logo'),inlineImages:inl});}
function invoiceHtml_(j,logoSrc){var v=j.invoice,inv=String(j.est||j.id).replace('EST','INV');
  return head_('Invoice',inv,logoSrc)+'<p style="font-size:16px">Dear '+esc_(j.name)+',</p><p>Thank you for your business. Here is your invoice for the completed work.</p>'+meta_(j,'Invoice #',inv)+custBlock_(j)+itemsTable_(j)+
  '<p style="font-size:18px;text-align:right"><b>Amount due: <span style="color:'+DG+'">'+esc_(v.amount)+'</span></b></p>'+(v.note?'<p>'+esc_(v.note)+'</p>':'')+(typeof featPayBtn_==='function'?featPayBtn_(j):'')+'<p>Questions? Call '+CO.phone+' or email '+CO.email+'.</p>'+foot_();}
function sendInvoice_(j){mustEmail_(j);mail_({to:j.email,replyTo:CO.email,name:CO.name,subject:'Invoice from Fielder Tree Service - '+j.invoice.amount,htmlBody:invoiceHtml_(j,'cid:logo'),inlineImages:{logo:logoBlob_()}});}
var LABELS={A:'Approved',B:'Approved with changes',C:'Declined',O:'Question / other'};
var SLOTS=['Weekdays 8-12','Weekdays 12-5','Weekends','Anytime'];
function respond_(j,p){if(p.ans=='A'||p.ans=='B')applyDiscount_(j);j.response={ans:p.ans,label:LABELS[p.ans]||p.ans,text:p.text||'',avail:p.avail||'',when:p.when||'',at:new Date().toISOString()};
  j.status=(p.ans=='A'||p.ans=='B')?'approved':(p.ans=='C'?'declined':'reply');if(typeof ftWon_==='function')ftWon_(j);}
function page_(b){return HtmlService.createHtmlOutput('<meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#f4f6f1;font-family:Arial,sans-serif;color:#231f20}.w{max-width:520px;margin:0 auto;padding:18px}h2{color:'+NAVY+'}.s{display:block;width:100%;margin:8px 0;padding:18px;font-size:19px;font-weight:bold;border:3px solid '+NAVY+';background:#fff;color:'+NAVY+';border-radius:12px;text-align:center;cursor:pointer}input[type=radio]{display:none}input[type=radio]:checked+.s{background:'+GREEN+';border-color:'+GREEN+';color:#fff}textarea,input[type=text]{width:100%;box-sizing:border-box;font-size:17px;padding:14px;border:2px solid #cfd6c4;border-radius:10px}.go{width:100%;padding:20px;font-size:21px;font-weight:bold;background:'+GREEN+';color:#fff;border:0;border-radius:12px;margin-top:14px}</style><div style="background:'+NAVY+';color:#fff;padding:14px 18px;font-weight:bold;font-size:18px">'+CO.name+'</div><div class="w">'+b+'</div>').setTitle('Fielder Tree Service').addMetaTag('viewport','width=device-width,initial-scale=1');}
function respForm_(j,ans){var slots=SLOTS.map(function(s,i){return '<input type=radio name=avail id=s'+i+' value="'+s+'"'+(i==3?' checked':'')+'><label class=s for=s'+i+'>'+s+'</label>'}).join('');
  return page_('<h2>'+esc_(LABELS[ans])+'</h2><p>Estimate '+esc_(j.est||j.id)+' &middot; '+esc_(j.address)+'</p>'+custBlock_(j)+'<form method=get action="'+ScriptApp.getService().getUrl()+'" target="_top"><input type=hidden name=a value=respond><input type=hidden name=id value="'+esc_(j.id)+'"><input type=hidden name=ans value="'+ans+'"><input type=hidden name=done value=1>'+
   (ans=='B'||ans=='O'?'<p><b>'+(ans=='B'?'What would you like changed?':'Your question or message:')+'</b></p><textarea name=text rows=4></textarea>':'')+
   '<p><b>When works best for the work?</b> Tap one:</p>'+slots+'<p><b>Preferred date or time (optional)</b></p><input type=text name=when placeholder="e.g. Tuesday Nov 3 morning">'+
   '<button class=go>Send my answer</button></form>');}
function doGet(e){try{return get_(e)}catch(x){return out_({ok:false,err:String(x&&x.message||x)})}}
function get_(e){var p=(e&&e.parameter)||{};
  if(p.code&&p.state)return qboFinish_(p);
  if(p.a=='img'){var fi;try{fi=DriveApp.getFileById(p.id)}catch(x){return out_({ok:false,err:'Not found'})}if(!inRoot_(fi))return out_({ok:false,err:'Not found'});var b=fi.getBlob();return out_({ok:true,data:'data:'+b.getContentType()+';base64,'+Utilities.base64Encode(b.getBytes())});}
  if(p.a=='respond'){var js=load_(),j=js.filter(function(x){return x.id==p.id})[0];if(!j)return page_('<h2>Estimate not found</h2><p>Please call '+CO.phone+'.</p>');
    if(p.ans!='C'&&!p.done)return respForm_(j,p.ans);
    var L=lock_(20000);if(!L)return page_('<h2>We are a little busy</h2><p>Your answer was not saved yet. Please go back and tap your choice again in a few seconds, or call '+CO.phone+'.</p>');
    try{js=load_();j=js.filter(function(x){return x.id==p.id})[0];respond_(j,p);save_(js);}finally{unlock_(L);}
    var av=availText_(j.response);
    return page_('<h2 style="color:'+DG+'">Thank you!</h2><p style="font-size:17px">Your answer was received: <b>'+esc_(j.response.label)+'</b></p>'+(av?'<p>Preferred time: <b>'+esc_(av)+'</b></p>':'')+(j.response.text?'<p>Your note: '+esc_(j.response.text)+'</p>':'')+'<p>We will be in touch shortly to confirm. Questions? Call '+CO.phone+'.</p>');}
  if(p.a=='quotePublic')return out_(quotePublic_(p.t));
  if(!pinOk_(p))return out_({ok:false,err:'PIN required'});
  return out_({ok:true,root:root_().getUrl(),jobs:load_().filter(function(x){return !x.archived||p.archived=='1'}),blocks:load_('blocks.json'),customers:load_('customers.json'),settings:settings_(),caps:CAPS_});}
// Backend always answers JSON. Login and read-only actions never take the lock; writes use a short tryLock
// and answer BUSY_ instead of waiting 30 s; emails, PDFs and texts run only after the lock is released.
function doPost(e){try{return out_(typeof featPost_==='function'?featPost_(e):post_(e))}catch(x){return out_({ok:false,err:String(x&&x.message||x)})}}
var KNOWN_={followUp:1,setStatus:1,login:1,aiKeys:1,approvePublic:1,empList:1,empAdd:1,empDel:1,qboconnect:1,qbodisconnect:1,voiceQuote:1,qnList:1,qnScan:1,qnDismiss:1,qnStart:1,smsOnWay:1,sendQuoteText:1,jdates:1,settings:1,feedback:1,cedit:1,importCustomers:1,block:1,unblock:1,create:1,upload:1,archive:1,finish:1,invoice:1,paid:1,email:1,respond:1,qedit:1,iedit:1,clockStatus:1,clockIn:1,clockOut:1,clockList:1,clockFix:1,clockDevice:1,empEdit:1,labor:1};
function post_(e){var d;try{d=JSON.parse(e.postData.contents)}catch(x){return {ok:false,err:'Bad request'}}
  if(!d||typeof d!=='object')return {ok:false,err:'Bad request'};
  if(!Object.prototype.hasOwnProperty.call(KNOWN_,String(d.a)))return {ok:false,err:'Bad action'};
  if(d.a=='login'){var lr=roleOf_(d);if(lr){var le=empOf_(d);return {ok:true,role:lr,name:le?le.name:'',perms:le&&Array.isArray(le.perms)?le.perms:null};}return {ok:false,err:locked_out_()?'Too many wrong codes. Try again in 15 minutes.':'Wrong PIN'};}
  if(d.a=='approvePublic')return approvePublic_(d);
  var me=roleOf_(d);if(!me)return {ok:false,err:locked_out_()?'Too many wrong codes. Try again in 15 minutes.':'PIN required'};
  if(d.a=='aiKeys'){if(me!=='Owner')return {ok:false,err:'Only the Owner can do that.'};return aiKeys_(d);}
  var OWN=me==='Owner';var pe_=empOf_(d),need_=PERM_OF_[d.a];if(!OWN&&pe_&&Array.isArray(pe_.perms)&&need_&&!(d.forWho)&&pe_.perms.indexOf(need_)<0)return {ok:false,err:'You do not have permission for that. Ask the Owner.'};
  if(d.a=='labor'){if(!OWN)return {ok:false,err:'Only the Owner can see labor cost.'};return laborApi_(d);}
  if(d.a=='empList'||d.a=='empAdd'||d.a=='empDel'||d.a=='empEdit'){if(me!=='Admin'&&!OWN)return {ok:false,err:'Only Admin can manage employees.'};if(d.a=='empEdit'&&!OWN)return {ok:false,err:'Only the Owner can edit employees.'};return empApi_(d,OWN);}var ck=clockApi_(d,me);if(ck)return ck;if(!can_(me,d.a))return {ok:false,err:'Your role cannot do that.'};var meName=me;
  if(d.a=='qboconnect'){if(me!=='Manager'&&!OWN)return {ok:false,err:'Your role cannot do that.'};var qUrl=qboConnectUrl_();if(!qUrl)return {ok:false,err:'QuickBooks is not set up yet. Add QBO_CLIENT_ID and QBO_CLIENT_SECRET in Script Properties.'};return {ok:true,url:qUrl};}
  if(d.a=='qbodisconnect'){if(me!=='Manager'&&!OWN)return {ok:false,err:'Your role cannot do that.'};saveObj_({},'qbo.json');return {ok:true,settings:settings_()};}
  if(d.a=='voiceQuote'){if(me!=='Manager'&&!OWN)return {ok:false,err:'Your role cannot do that.'};return voiceQuote_(d);}
  if(d.a=='qnList')return v5Api_(d);
  if(d.a=='qnScan'){var added=scanQuoteEmails();return added<0?BUSY_:{ok:true,added:added};}
  if(d.a=='smsOnWay')return smsOnWay_(d);
  if(d.a=='sendQuoteText')return quoteText_(d);
  if(d.a=='followUp')return followUp_(d);
  if(d.a=='setStatus')return setStatus_(d);
  // Slow Drive work (photos) happens before the lock.
  var pre={};
  if(d.a=='create'&&d.via=='text'){var tr=textReady_();if(tr)return {ok:false,err:tr};if(!e164_(d.phone))return {ok:false,err:'Add the customer phone number to text the quote.'};if(d.email&&!validEmail(d.email))return {ok:false,err:'That email does not look right.'};}
  if(d.a=='create'){if(d.via!='text'&&!validEmail(d.email))return {ok:false,err:'Enter a valid customer email before sending.'};
    var items=(d.items&&d.items.length)?d.items:rewriteQuote(d.quote);
    var nj={id:newId_('FT-'),est:'',name:d.name,address:d.address,email:String(d.email||'').trim(),quote:d.quote,items:items,total:num_(d.total,total_(items)),notes:d.notes||'',status:'sent',created:new Date().toISOString(),crew:[]};formFields_(nj,d);
    nj.photos=(d.photos&&d.photos.length)?savePhotos_(nj,d.photos,'quote'):[];pre={job:nj,newFolder:nj.folderId||''};}
  if(d.a=='upload'){var j0=findJob_(load_(),d.id);if(!j0)return {ok:false,err:'Job not found'};var had=j0.folderId;var ph=savePhotos_(j0,d.photos,d.kind);pre={photos:ph,folder:j0.folder,folderId:j0.folderId,newFolder:had?'':j0.folderId};}
  // Lock covers only read-change-write; Drive photo/folder work above and email/PDF/text below run unlocked.
  var L=lock_(20000);if(!L){trash_(pre.newFolder);return BUSY_;}var r;
  try{r=locked_(d,pre,meName);}catch(x){unlock_(L);L=null;trash_(pre.newFolder);throw x;}finally{unlock_(L);}
  if(pre.newFolder&&r.resp&&r.resp.ok===false)trash_(pre.newFolder);
  if(!r.send)return r.resp;
  var j=r.job,was={pdfId:j.pdfId,folderId:j.folderId};
  try{var sr=r.send(j);if(sr&&sr.ok===false){patchJob_(j.id,function(s){logSms_(s,'quote-link',sr)});return {ok:false,saved:true,job:j,err:'Saved, but the text was not sent: '+(sr.err||sr.skipped)};}}catch(x){var msg=String(x&&x.message||x);patchJob_(j.id,function(s){s.emailError=msg;s.emailErrorAt=new Date().toISOString();});
    return {ok:false,saved:true,job:j,err:'Saved, but the email was not sent: '+msg};}
  if(j.pdfId!==was.pdfId||j.folderId!==was.folderId||j.emailError){var pj=patchJobRetry_(j.id,function(s){if(j.pdfId){s.pdf=j.pdf;s.pdfId=j.pdfId;}if(j.folderId&&!s.folderId){s.folder=j.folder;s.folderId=j.folderId;}delete s.emailError;delete s.emailErrorAt;});if(pj)j=pj;}
  return {ok:true,job:j};}
// Runs while holding the lock: read, change, save. Returns {resp} or {job,send} (send runs after unlock).
function locked_(d,pre,meName){var j,send=null,js,R=function(o){return {resp:o}};
    var v5=v5Api_(d);if(v5)return R(v5);
    if(d.a=='settings'){var sr_=roleOf_(d);if(sr_!=='Manager'&&sr_!=='Owner')return R({ok:false,err:'That PIN cannot change the quote form.'});var curS=loadObj_('settings.json');if(d.form)curS.form=FDForm.normalizeForm(d.form);curS.quoteBody=clip_(d.quoteBody,4000);curS.quoteSubject=clip_(d.quoteSubject,300);curS.quoteSign=clip_(d.quoteSign,800);if(d.theme==='classic'||d.theme==='dark')curS.theme=d.theme;if(d.discountPct!=null&&d.discountPct!==''){var dp_=Math.round(Number(d.discountPct));if(dp_>=1&&dp_<=50)curS.discountPct=dp_;}saveObj_(curS,'settings.json');return R({ok:true,settings:settings_()})}
    if(d.a=='feedback'){if(!pinOk_(d))return R({ok:false,err:'That PIN cannot send feedback.'});var fbText=clip_(d.text,4000);if(!fbText)return R({ok:false,err:'Write a note first.'});var fb=[];try{fb=load_('feedback.json')}catch(eFb){fb=[]}if(!Array.isArray(fb))fb=[];fb.push({at:new Date().toISOString(),role:clip_(d.role,40),text:fbText});if(fb.length>500)fb=fb.slice(fb.length-500);save_(fb,'feedback.json');return R({ok:true})}
    if(d.a=='cedit'){if(!pinOk_(d))return R({ok:false,err:'That PIN cannot edit customers.'});if(d.email&&!validEmail(d.email))return R({ok:false,err:'That email does not look right.'});var ids=d.ids||[],cjs=load_();cjs.forEach(function(x){if(ids.indexOf(x.id)<0)return;x.name=clip_(d.name,200);x.phone=clip_(d.phone,40);x.email=clip_(d.email,200);x.address=clip_(d.address,300);x.phone2=clip_(d.phone2,40);x.contact2=clip_(d.contact2,120)});save_(cjs);return R({ok:true})}
    if(d.a=='importCustomers')return R(importCustomers_(d));
    js=load_();
    if(d.a=='block'||d.a=='unblock'){var bl=load_('blocks.json');bl=bl.filter(function(b){return b.id!=d.block.id});
      if(d.a=='block'){if(!d.block.id)d.block.id=newId_('B');if(typeof ftCrewList_==='function')d.block.crew=ftCrewList_(d.block.crew);bl.push(d.block);}save_(bl,'blocks.json');if(typeof ftAssignSync_==='function')ftAssignSync_(bl);return R({ok:true,blocks:bl});}
    if(d.a=='create'){j=pre.job;j.est=estNo_();if(d.via=='text'){pubTok_(j);send=sendQuoteLink_;}else send=sendQuote_;js.unshift(j);}
    else{j=js.filter(function(x){return x.id==d.id})[0];if(!j)return R({ok:false,err:'Job not found'});
      if(d.a=='upload'){j.crew=(j.crew||[]).concat(pre.photos);if(pre.folderId&&!j.folderId){j.folder=pre.folder;j.folderId=pre.folderId;}
        else if(pre.newFolder&&j.folderId&&pre.newFolder!==j.folderId){try{var keep=DriveApp.getFolderById(j.folderId);(pre.photos||[]).forEach(function(p){DriveApp.getFileById(p.id).moveTo(keep)});trash_(pre.newFolder);pre.newFolder='';}catch(eMv){Logger.log('upload folder merge failed: '+eMv);}}}
      else if(d.a=='archive'){j.archived=d.undo?false:true;j.archivedAt=j.archived?new Date().toISOString():'';j.archivedBy=String(meName||'');}
      else if(d.a=='finish'){mustEmail_(j);j.crewNotes=d.notes||'';j.status='complete';j.finished=new Date().toISOString();send=sendRecap_;}
      else if(d.a=='invoice'){mustEmail_(j);j.invoice={amount:d.amount,note:d.note||'',at:new Date().toISOString()};j.status='invoiced';send=sendInvoice_;}
      else if(d.a=='paid'){j.invoice=j.invoice||{};j.invoice.paid=!!d.paid;j.invoice.paidAt=d.paid?new Date().toISOString():'';}
      else if(d.a=='email'){if(!validEmail(d.email))return R({ok:false,err:'Invalid email'});j.email=String(d.email).trim();}
      else if(d.a=='respond'){respond_(j,d);}
      else if(d.a=='qedit'){if(d.email&&!validEmail(d.email))return R({ok:false,err:'That email does not look right.'});j.name=clip_(d.name,200);j.address=clip_(d.address,300);j.email=clip_(d.email,200);j.quote=clip_(d.quote,8000);j.items=cleanItems_(d.items);j.total=total_(j.items);formFields_(j,d);j.updated=new Date().toISOString();if(d.send)send=sendQuote_;}
      else if(d.a=='iedit'){j.invoice=j.invoice||{};if('amount' in d)j.invoice.amount=clip_(d.amount,40);if('note' in d)j.invoice.note=clip_(d.note,2000);j.invoice.edited=new Date().toISOString();}
      else return R({ok:false,err:'Bad action'});}
    save_(js);
    return send?{job:j,send:send}:R({ok:true,job:j});}
function smsOnWay_(d){var j=findJob_(load_(),d.id);if(!j)return {ok:false,err:'Job not found'};
  if(!j.phone)return {ok:false,err:'Add the customer phone first.'};var res=sendSms_(j.phone,smsText_('onway',j));
  var pj=patchJob_(j.id,function(s){logSms_(s,'onway',res)});if(pj)j=pj;
  return res.skipped=='not configured'?{ok:false,err:'Text messages are not set up yet (Twilio not configured).'}:res.ok?{ok:true,job:j}:{ok:false,err:'Text not sent ('+(res.skipped||res.code)+').'};}
// Run once from the editor to grant permissions and create the Drive folder.
function setup(){Logger.log(root_().getUrl());}

// ===================== v5: Quotes Needed + Text reminders =====================
// Quotes Needed: scans the admin Gmail for quote/estimate request emails, stores them in quotes_needed.json.
// Install the time trigger once from the editor: installQuoteTrigger()  (every 15 min).
var QN_FILE='quotes_needed.json',QN_LABEL='Fielder/QuoteProcessed';
function qnLoad_(){try{return load_(QN_FILE)}catch(e){return []}}
function qnParse_(msg){var body=msg.getPlainBody()||'',from=msg.getFrom()||'',subj=msg.getSubject()||'';
  function grab(re){var m=body.match(re);return m?String(m[1]).trim():''}
  var name=grab(/^\s*(?:full\s*)?name\s*[:\-]\s*(.+)$/im);
  var email=grab(/^\s*e-?mail(?:\s*address)?\s*[:\-]\s*([^\s<>]+@[^\s<>]+)/im);
  var phone=grab(/^\s*(?:phone|cell|mobile|tel(?:ephone)?)(?:\s*(?:number|#))?\s*[:\-]\s*([+()\d][\d()\s.\-]{6,})/im);
  var address=grab(/^\s*(?:service\s*|property\s*|street\s*)?address\s*[:\-]\s*(.+)$/im);
  var notes=grab(/^\s*(?:notes?|message|comments?|details|description|work needed)\s*[:\-]\s*([\s\S]{1,1500}?)(?:\n\s*\n|$)/im);
  var fm=from.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>/);var fromName=fm?fm[1].trim():'',fromEmail=fm?fm[2].trim():from.trim();
  if(!email&&!/no-?reply|wordpress|forms?@|notification/i.test(fromEmail))email=fromEmail;
  if(!email){var em=body.match(/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i);if(em)email=em[0]}
  if(!phone){var pm=body.match(/(?:\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/);if(pm)phone=pm[0].trim()}
  if(!address){var am=body.match(/\d{2,6}\s+[A-Za-z0-9.\s]{3,40}\b(?:Rd|Road|St|Street|Dr|Drive|Ave|Avenue|Ln|Lane|Blvd|Ct|Court|Cir|Way|Pkwy|Hwy|Trl|Pl)\b[^\n]{0,60}/i);if(am)address=am[0].trim()}
  if(!name)name=fromName&&!/no-?reply/i.test(fromName)?fromName:'';
  if(!notes)notes=body.replace(/\s+/g,' ').trim().slice(0,600);
  return {id:'QN-'+msg.getId(),msgId:msg.getId(),subject:clip_(subj,200),from:clip_(from,200),name:clip_(name,200),email:clip_(email,200),phone:clip_(phone,40),address:clip_(address,300),notes:clip_(notes,1500),received:msg.getDate().toISOString(),status:'open'};}
function scanQuoteEmails(inLock){var lab=GmailApp.getUserLabelByName(QN_LABEL)||GmailApp.createLabel(QN_LABEL);
  var threads=GmailApp.search('in:inbox newer_than:14d (subject:quote OR subject:estimate) -label:'+QN_LABEL.replace('/','-')+' -from:me',0,30);
  if(!threads.length)return 0;var L=null;if(inLock!==true){L=lock_(8000);if(!L){Logger.log('Quotes Needed: busy, will retry');return -1;}}var n=0;
  try{var list=qnLoad_(),seen={};list.forEach(function(q){seen[q.msgId]=1});
    threads.forEach(function(t){var m=t.getMessages()[0];if(!seen[m.getId()]&&!/^(re|fwd?):/i.test(m.getSubject()||'')){list.unshift(qnParse_(m));n++}});
    if(list.length>300)list=list.slice(0,300);save_(list,QN_FILE);}finally{unlock_(L)}
  threads.forEach(function(t){try{t.addLabel(lab)}catch(e){}});
  Logger.log('Quotes Needed: added '+n);return n;}
function installQuoteTrigger(){ScriptApp.getProjectTriggers().forEach(function(t){if(t.getHandlerFunction()=='scanQuoteEmails')ScriptApp.deleteTrigger(t)});
  ScriptApp.newTrigger('scanQuoteEmails').timeBased().everyMinutes(15).create();Logger.log('scanQuoteEmails trigger installed (every 15 min)');}

// Text reminders (Twilio). Script Properties: TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM (+1XXXXXXXXXX),
// TEST_SMS_ONLY ('true' = every text goes ONLY to TEST_PHONE), TEST_PHONE. Missing creds = no-op, logs 'not configured'.
var SMS_TPL={
  onway:'Hi {first}, this is {co}. We are on the way for your estimate at {addr}. See you soon! Questions: {phone}',
  install:'Hi {first}, reminder from {co}: you are still on for your tree work tomorrow ({date}) at {addr}. Reply or call {phone} with any questions.',
  debris:'Hi {first}, {co} here: our crew will be by tomorrow ({date}) for debris removal at {addr}. Call {phone} with any questions.'};
function smsCfg_(){var p=PropertiesService.getScriptProperties();return {sid:p.getProperty('TWILIO_SID'),tok:p.getProperty('TWILIO_TOKEN'),from:p.getProperty('TWILIO_FROM'),testOnly:String(p.getProperty('TEST_SMS_ONLY')||'true').toLowerCase()!=='false',testPhone:p.getProperty('TEST_PHONE')||''};}
function e164_(s){var d=String(s||'').replace(/\D/g,'');if(d.length==10)d='1'+d;return d.length==11?'+'+d:'';}
function smsText_(kind,j,date){var t=SMS_TPL[kind]||'';return t.replace('{first}',String(j.name||'there').split(' ')[0]).replace('{co}',CO.name).replace('{addr}',String(j.address||'your property').split(',')[0]).replace('{phone}',CO.phone).replace('{date}',date||'');}
function sendSms_(to,body){var c=smsCfg_();if(!c.sid||!c.tok||!c.from){Logger.log('SMS not configured');return {ok:false,skipped:'not configured'};}
  if(c.testOnly){if(!c.testPhone){Logger.log('SMS TEST_SMS_ONLY on but TEST_PHONE missing; not sent');return {ok:false,skipped:'no TEST_PHONE'};}body='[TEST to '+(to||'?')+'] '+body;to=c.testPhone;}
  to=e164_(to);if(!to)return {ok:false,skipped:'no valid phone'};
  var r=UrlFetchApp.fetch('https://api.twilio.com/2010-04-01/Accounts/'+c.sid+'/Messages.json',{method:'post',muteHttpExceptions:true,headers:{Authorization:'Basic '+Utilities.base64Encode(c.sid+':'+c.tok)},payload:{To:to,From:c.from,Body:body}});
  var ok=r.getResponseCode()<300;Logger.log('SMS '+(ok?'sent':'failed '+r.getResponseCode())+' to '+to);return {ok:ok,code:r.getResponseCode()};}
function logSms_(j,kind,res){j.sms=j.sms||[];j.sms.push({kind:kind,at:new Date().toISOString(),ok:!!res.ok,skipped:res.skipped||''});if(j.sms.length>30)j.sms=j.sms.slice(-30);}
function installDate_(j,blocks){if(j.installDate)return j.installDate;var b=(blocks||[]).filter(function(x){return x.job==j.id&&x.date}).map(function(x){return x.date}).sort();return b[0]||'';}
function tomorrow_(){var d=new Date();d.setDate(d.getDate()+1);return Utilities.formatDate(d,'America/New_York','yyyy-MM-dd');}
function prettyDate_(k){return Utilities.formatDate(new Date(k+'T12:00:00'),'America/New_York','EEE MMM d');}
function runDailyReminders(){var c=smsCfg_();if(!c.sid||!c.tok||!c.from){Logger.log('SMS not configured');return;}
  var js=load_(),bl=[];try{bl=load_('blocks.json')}catch(e){}var tm=tomorrow_(),todo=[];
  js.forEach(function(j){if(!j.phone||j.archived)return;var st=j.status;
    if((st=='approved')&&installDate_(j,bl)==tm&&!(j.sms||[]).some(function(s){return s.kind=='install-'+tm}))todo.push({id:j.id,kind:'install-'+tm,phone:j.phone,text:smsText_('install',j,prettyDate_(tm))});
    if(j.debrisDate==tm&&!(j.sms||[]).some(function(s){return s.kind=='debris-'+tm}))todo.push({id:j.id,kind:'debris-'+tm,phone:j.phone,text:smsText_('debris',j,prettyDate_(tm))});});
  var done=todo.map(function(t){return {t:t,r:sendSms_(t.phone,t.text)}});
  if(done.length){var L=LockService.getScriptLock();if(!L.tryLock(30000)){Logger.log('Daily reminders: sent '+done.length+' but could not log (busy)');return;}
    try{var js2=load_();done.forEach(function(x){var j=findJob_(js2,x.t.id);if(j)logSms_(j,x.t.kind,x.r)});save_(js2);}finally{unlock_(L)}}
  Logger.log('Daily reminders: '+done.length);}
function installReminderTrigger(){ScriptApp.getProjectTriggers().forEach(function(t){if(t.getHandlerFunction()=='runDailyReminders')ScriptApp.deleteTrigger(t)});
  ScriptApp.newTrigger('runDailyReminders').timeBased().everyDays(1).atHour(17).inTimezone('America/New_York').create();Logger.log('runDailyReminders trigger installed (daily ~5 PM ET)');}

// API for v5 (called from doPost). Returns a response object, or null if the action is not a v5 action.
function v5Api_(d){
  if(d.a=='qnList'){if(!pinOk_(d))return {ok:false,err:'That PIN cannot view quote requests.'};var l=qnLoad_();return {ok:true,items:d.all?l:l.filter(function(q){return q.status=='open'})};}
  if(d.a=='qnDismiss'||d.a=='qnStart'){if(!pinOk_(d))return {ok:false,err:'That PIN cannot change quote requests.'};var l2=qnLoad_(),q=l2.filter(function(x){return x.id==d.id})[0];if(!q)return {ok:false,err:'Request not found'};
    q.status=d.a=='qnDismiss'?'dismissed':'started';q.updated=new Date().toISOString();save_(l2,QN_FILE);return {ok:true,item:q};}
  if(d.a=='qnScan'){if(!pinOk_(d))return {ok:false,err:'That PIN cannot scan email.'};return {ok:true,added:scanQuoteEmails(true)};}
  if(d.a=='jdates'||d.a=='smsOnWay'){if(!pinOk_(d))return {ok:false,err:'That PIN cannot do that.'};var js=load_(),j=js.filter(function(x){return x.id==d.id})[0];if(!j)return {ok:false,err:'Job not found'};
    if(d.a=='jdates'){var ok=function(s){return /^\d{4}-\d{2}-\d{2}$/.test(s||'')?s:''};if('installDate' in d)j.installDate=ok(d.installDate);if('debrisDate' in d)j.debrisDate=ok(d.debrisDate);if('phone' in d)j.phone=clip_(d.phone,40);save_(js);return {ok:true,job:j};}
    if(!j.phone)return {ok:false,err:'Add the customer phone first.'};var res=sendSms_(j.phone,smsText_('onway',j));logSms_(j,'onway',res);save_(js);
    return res.skipped=='not configured'?{ok:false,err:'Text messages are not set up yet (Twilio not configured).'}:res.ok?{ok:true,job:j}:{ok:false,err:'Text not sent ('+(res.skipped||res.code)+').'};}
  return null;}

// ===== QuickBooks Online connection (same OAuth flow as the Southern Concrete desk). Needs Script Properties QBO_CLIENT_ID, QBO_CLIENT_SECRET, optional QBO_ENV=production. =====
function qboProp_(n){try{return String(PropertiesService.getScriptProperties().getProperty(n)||'')}catch(e){return ''}}
function qboEnv_(){return qboProp_('QBO_ENV').toLowerCase()==='production'?'production':'sandbox'}
function qboRedirect_(){return ScriptApp.getService().getUrl()}
function qboPublic_(){var o={};try{o=loadObj_('qbo.json')}catch(e){o={}}return {connected:!!(o.refreshToken&&o.realmId),env:o.env||qboEnv_(),ready:!!(qboProp_('QBO_CLIENT_ID')&&qboProp_('QBO_CLIENT_SECRET'))}}
function qboExchange_(body){var res=UrlFetchApp.fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',{method:'post',contentType:'application/x-www-form-urlencoded',muteHttpExceptions:true,headers:{Authorization:'Basic '+Utilities.base64Encode(qboProp_('QBO_CLIENT_ID')+':'+qboProp_('QBO_CLIENT_SECRET')),Accept:'application/json'},payload:body});
  if(res.getResponseCode()<200||res.getResponseCode()>=300)throw new Error('QuickBooks auth failed');return JSON.parse(res.getContentText()||'{}')}
function qboApplyTok_(cur,tok,realm){cur=cur||{};cur.accessToken=tok.access_token;if(tok.refresh_token)cur.refreshToken=tok.refresh_token;cur.accessExp=Date.now()+(Number(tok.expires_in)||3000)*1000-60000;if(realm)cur.realmId=realm;cur.env=qboEnv_();saveObj_(cur,'qbo.json');return cur}
function qboConnectUrl_(){var id=qboProp_('QBO_CLIENT_ID'),sec=qboProp_('QBO_CLIENT_SECRET');if(!id||!sec)return '';var st=Utilities.getUuid();PropertiesService.getScriptProperties().setProperty('QBO_STATE',st);
  return 'https://appcenter.intuit.com/connect/oauth2?client_id='+encodeURIComponent(id)+'&response_type=code&scope='+encodeURIComponent('com.intuit.quickbooks.accounting')+'&redirect_uri='+encodeURIComponent(qboRedirect_())+'&state='+encodeURIComponent(st)}
function qboFinish_(p){var expect=qboProp_('QBO_STATE');if(!p.code||!p.state||p.state!==expect)return page_('<h2>QuickBooks</h2><p>That connection link was not valid. Use Connect in Settings again.</p>');
  try{PropertiesService.getScriptProperties().deleteProperty('QBO_STATE')}catch(e){}
  try{qboApplyTok_({},qboExchange_('grant_type=authorization_code&code='+encodeURIComponent(p.code)+'&redirect_uri='+encodeURIComponent(qboRedirect_())),p.realmId)}catch(e2){return page_('<h2>QuickBooks</h2><p>Could not finish connecting. Check the Intuit keys and try again.</p>')}
  return page_('<h2>QuickBooks connected</h2><p>You can close this tab and return to the app.</p><p><a href="https://austin-tss.github.io/fielder/">Back to Fielder Field Desk</a></p>')}

// ===== Crew clock in/out (modeled on TSShourtracker). =====
// Punches are sharded by week and name bucket: punches-YYYY-MM-DD-b.json (Sunday-start week in America/New_York, b = name hash % 4):
// [{id,who,in,out,cid,ocid,by,src,dev,odev,devName,flag,edited}]. A person's punches for a week are always in one small file.
// The clock has its OWN lock (LockService user lock: this web app runs as the owner, so it is one global lock separate from the
// job/script lock). Inside it a punch only touches CacheService (the live copy, written only by lock holders). Drive files are then
// written by a short flush that coalesces every dirty shard, so 30 crew punching at once cost a few Drive writes, not 30 rewrites.
var CLOCK_TZ='America/New_York',CLOCK_ACTS_={clockStatus:1,clockIn:1,clockOut:1,clockList:1,clockFix:1,clockDevice:1};
var CLOCK_SKEW=15*60000,CLOCK_REPLAY=72*3600000,CLOCK_MAXSHIFT=16*3600000,CLOCK_FIXBACK=14*86400000,CLOCK_BUSY_={ok:false,busy:true,err:'Busy, please retry'};
function clockLock_(ms){var L=null;try{L=LockService.getUserLock()}catch(e){}if(!L)try{L=LockService.getScriptLock()}catch(e){}try{if(L&&L.tryLock(ms||20000))return L}catch(e){}return null;}
function clockWho_(d,me){var e=empOf_(d);if(e&&e.name)return clip_(e.name,60);return clip_(String(d.who||'').replace(/[\u0000-\u001f<>]/g,'').replace(/\s+/g,' '),60);}
function clockKey_(s){return String(s||'').trim().toLowerCase();}
function clockDayStart_(ms,back){var s=Utilities.formatDate(new Date(ms),CLOCK_TZ,'yyyy-MM-dd'),p=s.split('-').map(Number),u=new Date(Date.UTC(p[0],p[1]-1,p[2]-(back||0)));return Utilities.parseDate(Utilities.formatDate(u,'UTC','yyyy-MM-dd')+' 00:00',CLOCK_TZ,'yyyy-MM-dd HH:mm').getTime();}
function clockWeekStart_(ms){var dow=Number(Utilities.formatDate(new Date(ms),CLOCK_TZ,'u'))%7;return clockDayStart_(ms,dow);}// Sunday start, like TSShourtracker
var CLOCK_BUCKETS=4;
function clockBucket_(who){var k=clockKey_(who),h=0;for(var i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))|0;return Math.abs(h)%CLOCK_BUCKETS;}
function clockShard_(ms,who){return 'punches-'+Utilities.formatDate(new Date(clockWeekStart_(ms)),CLOCK_TZ,'yyyy-MM-dd')+'-'+clockBucket_(who)+'.json';}
function clockIndex_(){try{var a=JSON.parse(prop_('CLOCK_SHARDS')||'[]');return Array.isArray(a)?a:[]}catch(e){return []}}
// Cache 'ck:<shard>' = {v,p} is the live copy (only lock holders put it); 'ckv:<shard>' = version last written to Drive.
function clockC_(){try{return CacheService.getScriptCache()}catch(e){return null}}
function clockRead_(n){var c=clockC_();try{var x=c&&c.get('ck:'+n);if(x)return JSON.parse(x).p}catch(e){}return load_(n);}
function clockWrite_(n,arr){var c=clockC_(),v=newId_('V'),s=JSON.stringify({v:v,p:arr}),cached=false;
  if(c&&s.length<95000)try{c.put('ck:'+n,s,21600);cached=true}catch(e){}
  if(!cached){if(c)try{c.remove('ck:'+n)}catch(e){}save_(arr,n);}else{var d=clockDirty_();if(d.indexOf(n)<0){d.push(n);c.put('ckdirty',JSON.stringify(d),21600);}}
  var ix=clockIndex_();if(ix.indexOf(n)<0){ix.push(n);ix.sort();PropertiesService.getScriptProperties().setProperty('CLOCK_SHARDS',JSON.stringify(ix));}}
function clockDirty_(){var c=clockC_();try{var d=JSON.parse(c&&c.get('ckdirty')||'[]');return Array.isArray(d)?d:[]}catch(e){return []}}
// Write every dirty shard's latest cached copy to Drive. Called after a punch releases the lock; whoever gets the lock writes all
// pending punches, so later callers usually find nothing left to do. Also run by clockFlushAll (time trigger, every minute is fine).
function clockFlush_(ms){var c=clockC_();if(!c||!clockDirty_().length)return true;var L=clockLock_(ms||20000);if(!L)return false;
  try{var d=clockDirty_();d.forEach(function(n){var x=c.get('ck:'+n);if(!x)return;var o=JSON.parse(x);if(c.get('ckv:'+n)===o.v)return;save_(o.p,n);c.put('ckv:'+n,o.v,21600);});c.put('ckdirty','[]',21600);}
  finally{unlock_(L)}return true;}
function clockFlushAll(){clockFlush_(25000);}
// Run once from the editor after deploying: safety net that writes any punch still only in the cache (e.g. a flush that timed out).
function installClockFlushTrigger(){ScriptApp.getProjectTriggers().forEach(function(t){if(t.getHandlerFunction()=='clockFlushAll')ScriptApp.deleteTrigger(t)});
  ScriptApp.newTrigger('clockFlushAll').timeBased().everyMinutes(1).create();Logger.log('clockFlushAll trigger installed (every minute)');}
// One-time move of the old single punches.json into weekly shards (runs under the clock lock).
function clockMigrate_(){if(prop_('CLOCK_MIGRATED')==='1')return;var old=[];try{var r=root_(),it=r.getFilesByName('punches.json');if(it.hasNext())old=JSON.parse(it.next().getBlob().getDataAsString()||'[]')}catch(e){old=[]}
  var by={};old.forEach(function(p){var n=clockShard_(new Date(p.in).getTime(),p.who);(by[n]=by[n]||[]).push(p)});
  for(var n in by){var cur=clockRead_(n),ids={};cur.forEach(function(p){ids[p.id]=1});clockWrite_(n,cur.concat(by[n].filter(function(p){return !ids[p.id]})));}
  PropertiesService.getScriptProperties().setProperty('CLOCK_MIGRATED','1');}
// Shards whose week could hold punches touching [a,b] (one extra week back for shifts that cross Sunday midnight).
function clockNames_(a,b,who){var lo=clockShard_(a-7*86400000,'').slice(0,18),hi=clockShard_(b,'').slice(0,18),bk=who==null?null:'-'+clockBucket_(who)+'.json';
  return clockIndex_().filter(function(n){var w=n.slice(0,18);return w>=lo&&w<=hi&&(bk==null||n.slice(18)===bk)});}
function clockLoad_(names){var m={},all=[];names.forEach(function(n){m[n]=clockRead_(n);all=all.concat(m[n])});return {m:m,all:all};}
function clockEnd_(p,now){return p.out?new Date(p.out).getTime():Math.min(now,new Date(p.in).getTime()+CLOCK_MAXSHIFT);}
function clockHrs_(ps,who,a,b,now){var k=clockKey_(who),ms=0;ps.forEach(function(p){if(who&&clockKey_(p.who)!==k)return;var s=new Date(p.in).getTime(),e=clockEnd_(p,now);s=Math.max(s,a);e=Math.min(e,b);if(e>s)ms+=e-s;});return Math.round(ms/36000)/100;}
function clockOpen_(ps,who){var k=clockKey_(who);return ps.filter(function(p){return !p.out&&clockKey_(p.who)===k})[0]||null;}
function clockPub_(p,now){if(!p)return p;var o=Object.assign({},p);if(!o.out&&now-new Date(o.in).getTime()>CLOCK_MAXSHIFT){o.long=true;o.flag=o.flag||'Open more than 16 h. Check with crew.';}return o;}
function clockSum_(ps,who){var now=Date.now(),d0=clockDayStart_(now),w0=clockWeekStart_(now);return {who:who,open:clockPub_(clockOpen_(ps,who),now),today:clockHrs_(ps,who,d0,now,now),week:clockHrs_(ps,who,w0,now,now)};}
// Time for a live punch or an offline replay. Live: phone time must be within 15 min of the server, otherwise the server time is used.
// Replay (offline:true with its original queuedAt + cid): the punch time must match when it was queued, and that must be within 72 h.
function clockTime_(d,now){var t=d.at?Date.parse(d.at):NaN;if(!isFinite(t))return {t:now};
  if(d.offline&&d.queuedAt&&d.cid){var q=Date.parse(d.queuedAt);if(!isFinite(q)||Math.abs(t-q)>CLOCK_SKEW||q>now+CLOCK_SKEW)return {err:'This saved punch has a bad time. Ask Admin to add it.',badTime:true};
    if(q<now-CLOCK_REPLAY)return {err:'This punch was saved on the phone more than 72 hours ago, so it was not sent. Ask Admin to add it.',tooOld:true};return {t:Math.min(t,now),replay:true};}
  if(Math.abs(t-now)>CLOCK_SKEW)return {t:now,skew:Math.round((t-now)/60000)};return {t:Math.min(t,now)};}
function clockDevs_(){try{var o=JSON.parse(prop_('CLOCK_DEVICES')||'{}');o.byDev=o.byDev||{};o.byName=o.byName||{};return o}catch(e){return {byDev:{},byName:{}}}}
function clockDevSave_(o){PropertiesService.getScriptProperties().setProperty('CLOCK_DEVICES',JSON.stringify(o));}
function clockBind_(o,dev,who){var k=clockKey_(who),old=o.byDev[dev];if(old&&o.byName[old]===dev)delete o.byName[old];var od=o.byName[k];if(od)delete o.byDev[od];o.byDev[dev]=k;o.byName[k]=dev;o.names=o.names||{};o.names[k]=who;}
// Name is locked to the phone after first use; a name is on one phone at a time. Employee logins (own PIN) skip this.
function clockDevCheck_(d,who,emp){var dev=clip_(d.deviceId,64);if(emp)return {dev:dev};if(!dev)return {err:'Update the app to clock in (this phone has no device ID).',needUpdate:true};
  var o=clockDevs_(),k=clockKey_(who),had=o.byDev[dev];
  if(had&&had!==k)return {err:'This phone is set to '+((o.names||{})[had]||had)+'. Admin PIN is needed to change it.',nameLocked:true};
  if(o.byName[k]&&o.byName[k]!==dev)return {err:who+' is set up on another phone. Admin PIN is needed to move it to this phone.',nameLocked:true};
  if(!had){clockBind_(o,dev,who);clockDevSave_(o);}return {dev:dev};}
function clockApi_(d,me){if(!CLOCK_ACTS_[d.a])return null;var r=clockApi0_(d,me);if(r&&r.ok&&(d.a=='clockFix'||d.a=='clockDevice'))clockFlush_(15000);return r;}
function clockApi0_(d,me){var boss=me==='Admin'||me==='Owner',now=Date.now();
  if(d.a=='clockDevice'){// change this phone's name: needs the Admin PIN (adminPin), or an Admin login.
    var okA=boss||(d.adminPin&&(roleOf_({pin:d.adminPin})==='Admin'||roleOf_({pin:d.adminPin})==='Owner'));if(!okA)return {ok:false,err:'Admin PIN needed to change the name on this phone.'};
    var dv=clip_(d.deviceId,64),nw=clockWho_({who:d.who},me);if(!dv||!nw)return {ok:false,err:'Pick the name.'};
    var Ld=clockLock_(10000);if(!Ld)return CLOCK_BUSY_;try{var o=clockDevs_();clockBind_(o,dv,nw);clockDevSave_(o);}finally{unlock_(Ld);}return {ok:true,who:nw};}
  if(d.a=='clockList'){if(!boss)return {ok:false,err:'Only Admin can see everyone\'s hours.'};var f=d.from?Utilities.parseDate(d.from+' 00:00',CLOCK_TZ,'yyyy-MM-dd HH:mm').getTime():0,t=d.to?Utilities.parseDate(d.to+' 23:59',CLOCK_TZ,'yyyy-MM-dd HH:mm').getTime()+60000:now+86400000;
    var ps=clockLoad_(f?clockNames_(f,t):clockIndex_()).all,recent=clockLoad_(clockNames_(now-14*86400000,now)).all;
    var sel=ps.filter(function(p){var s=new Date(p.in).getTime(),e=p.out?new Date(p.out).getTime():now;return e>=f&&s<t&&(!d.who||clockKey_(p.who)===clockKey_(d.who))});
    return {ok:true,punches:sel.map(function(p){return clockPub_(p,now)}),now:recent.filter(function(p){return !p.out}).map(function(p){return clockPub_(p,now)})};}
  if(d.a=='clockFix'){if(!boss)return {ok:false,err:'Only Admin can fix punches.'};
    var ni=0,no=0;if(!d.del){ni=d.in?Date.parse(d.in):NaN;no=d.out?Date.parse(d.out):0;
      if(!isFinite(ni))return {ok:false,err:'Enter the clock-in time.'};if(!isFinite(no))return {ok:false,err:'That clock-out time is not valid.'};
      if(ni<now-CLOCK_FIXBACK)return {ok:false,err:'Clock-in is more than 14 days ago. Only the last 14 days can be fixed here.',outOfWindow:true};
      if(ni>now+5*60000)return {ok:false,err:'Clock-in cannot be in the future.',outOfWindow:true};
      var clamped=false;if(no&&no>now){no=now;clamped=true;}
      if(no&&no<=ni)return {ok:false,err:clamped?'Clock-out was in the future, so it was set to now, which is before the clock-in.':'Clock-out must be after clock-in.'};
      if(no&&no-ni>24*3600000)return {ok:false,err:'A shift cannot be longer than 24 hours.'};}
    var L=clockLock_(10000);if(!L)return CLOCK_BUSY_;var r;try{clockMigrate_();
      var all=d.id?clockIndex_():clockNames_(ni,now,clip_(d.who,60)),S=clockLoad_(all),p=null,pn=null;
      if(d.id){for(var n in S.m){var hit=S.m[n].filter(function(x){return x.id===d.id})[0];if(hit){p=hit;pn=n;break}}if(!p)return {ok:false,err:'Punch not found'};}
      if(d.del){clockWrite_(pn,S.m[pn].filter(function(x){return x.id!==d.id}));return {ok:true,deleted:d.id};}
      var w=p?p.who:clip_(d.who,60);if(!w)return {ok:false,err:'Pick the person.'};var k=clockKey_(w),e1=no||now;
      var clash=S.all.filter(function(x){if(x===p||clockKey_(x.who)!==k)return false;var s=new Date(x.in).getTime(),e=x.out?new Date(x.out).getTime():now;return s<e1&&ni<e})[0];
      if(clash)return {ok:false,err:w+' already has a punch from '+Utilities.formatDate(new Date(clash.in),CLOCK_TZ,'MMM d h:mm a')+' that overlaps this one.',overlap:true};
      if(!no){var op=clockOpen_(S.all,w);if(op&&op!==p)return {ok:false,err:w+' already has an open punch.'};}
      var ed={by:me,at:new Date().toISOString()},tn=clockShard_(ni,w);
      if(p){p.in=new Date(ni).toISOString();p.out=no?new Date(no).toISOString():null;p.edited=ed;delete p.flag;
        if(tn!==pn){clockWrite_(pn,S.m[pn].filter(function(x){return x!==p}));var dst=S.m[tn]||clockRead_(tn);dst.push(p);clockWrite_(tn,dst);}else clockWrite_(pn,S.m[pn]);}
      else{p={id:newId_('P-'),who:w,in:new Date(ni).toISOString(),out:no?new Date(no).toISOString():null,by:me,src:'fix',edited:ed};var arr=S.m[tn]||clockRead_(tn);arr.push(p);clockWrite_(tn,arr);}
      r={ok:true,punch:p,clamped:clamped};}finally{unlock_(L);}return r;}
  var emp=empOf_(d),who=clockWho_(d,me);
  if(d.forWho&&(d.a=='clockIn'||d.a=='clockOut'||d.a=='clockStatus')){if(me!=='Owner')return {ok:false,err:'Only the Owner can clock someone else in or out.'};who=clockWho_({who:d.forWho},me);emp={owner:1};d.at=null;}
  if(!who)return {ok:false,err:'Pick your name first.',needName:true};
  if(d.a=='clockStatus')return Object.assign({ok:true},clockSum_(clockLoad_(clockNames_(now-7*86400000,now,who)).all,who));
  var tm=clockTime_(d,now);if(tm.err)return {ok:false,err:tm.err,tooOld:!!tm.tooOld,badTime:!!tm.badTime};
  var at=tm.t,cid=clip_(d.cid,40),L2=clockLock_(20000);if(!L2)return CLOCK_BUSY_;var res,all2;
  try{clockMigrate_();var S2=clockLoad_(clockNames_(now-7*86400000,now,who));all2=S2.all;
    var dup=cid&&all2.filter(function(x){return x.cid===cid||x.ocid===cid})[0];if(dup)res={ok:true,dup:true};
    else{var dc=clockDevCheck_(d,who,emp);if(dc.err)res={ok:false,err:dc.err,nameLocked:!!dc.nameLocked,needUpdate:!!dc.needUpdate};
    else{var op2=clockOpen_(all2,who),src=tm.replay?'offline':'app',devName=clip_(d.deviceName,40);
      if(d.a=='clockIn'){var auto=null;
        if(op2&&at-new Date(op2.in).getTime()>CLOCK_MAXSHIFT){op2.out=new Date(new Date(op2.in).getTime()+CLOCK_MAXSHIFT).toISOString();op2.flag='Auto-closed at 16 h (no clock-out). Check with crew.';auto=op2;
          var on=clockShard_(new Date(op2.in).getTime(),op2.who);clockWrite_(on,S2.m[on]);op2=null;}
        if(op2)res={ok:false,already:true,err:who+' is already clocked in.'};
        else{if(auto&&at<new Date(auto.out).getTime())at=new Date(auto.out).getTime();var np={id:newId_('P-'),who:who,in:new Date(at).toISOString(),out:null,cid:cid,by:me,src:src,dev:dc.dev,devName:devName};if(tm.skew)np.skewMin=tm.skew;
          var sn=clockShard_(at,who),sa=S2.m[sn]||clockRead_(sn);sa.push(np);all2.push(np);clockWrite_(sn,sa);res={ok:true,autoClosed:auto?auto.id:undefined};}}
      else{if(!op2)res={ok:false,notIn:true,err:who+' is not clocked in.'};else{var oin=new Date(op2.in).getTime();if(at<oin)at=oin;
        if(at-oin>CLOCK_MAXSHIFT){at=oin+CLOCK_MAXSHIFT;op2.flag='Over 16 h, capped at 16 h. Check with crew.';}
        op2.out=new Date(at).toISOString();op2.ocid=cid;op2.odev=dc.dev;if(tm.skew)op2.oskewMin=tm.skew;var osn=clockShard_(oin,op2.who);clockWrite_(osn,S2.m[osn]);res={ok:true,capped:!!op2.flag};}}}}
  }finally{unlock_(L2);}
  if(res.ok&&!res.dup&&!clockFlush_(5000))res.pending=true;
  if(tm.skew&&res.ok)res.note='Phone clock is off by '+tm.skew+' min; server time was used.';
  return Object.assign(res,clockSum_(all2,who));}
// ===== Employees (Admin + Owner). Codes are 4 digits, unique. Only the Owner sees PINs and pay rates, and can edit.
var PERM_OF_={create:'quotes',qedit:'quotes',sendQuoteText:'quotes',voiceQuote:'quotes',qnList:'quotes',qnScan:'quotes',qnStart:'quotes',qnDismiss:'quotes',block:'schedule',unblock:'schedule',invoice:'invoices',paid:'invoices',iedit:'invoices',clockList:'hours',clockFix:'hours',empList:'employees',empAdd:'employees',empDel:'employees',upload:'crew',finish:'crew',clockIn:'clock',clockOut:'clock'};
var EMP_PERMS={quotes:1,schedule:1,projects:1,crew:1,clock:1,invoices:1,hours:1,employees:1,labor:1};
function empPublic_(u,own){var o={id:u.id,name:u.name,email:u.email,role:u.role,created:u.created,perms:u.perms||null};if(own){o.pin=u.pin;o.payRate=u.payRate==null?null:u.payRate;}return o}
function empPerms_(a){return Array.isArray(a)?a.filter(function(x){return EMP_PERMS[x]}).slice(0,20):null}
function empRate_(v){if(v===''||v==null)return null;var n=Number(String(v).replace(/[^\d.]/g,''));return isFinite(n)&&n>=0&&n<1000?Math.round(n*100)/100:null}
function empApi_(d,own){var pub=function(l){return l.map(function(u){return empPublic_(u,own)})};
  if(d.a=='empList')return {ok:true,employees:pub(emps_())};
  var L=lock_(7000);if(!L)return BUSY_;var add=null,list;
  try{list=emps_();var used={},pm=pins_();list.forEach(function(u){used[u.pin]=1});for(var r in pm)used[pm[r]]=1;
    if(d.a=='empDel'){var me=empOf_(d),t=list.filter(function(u){return u.id==d.id})[0];if(!t)return {ok:false,err:'Employee not found'};
      if(me&&me.id==t.id)return {ok:false,err:'You cannot delete yourself.'};
      if(t.role=='Owner'&&!own)return {ok:false,err:'Only the Owner can remove an Owner.'};
      if(t.role=='Admin'&&list.filter(function(u){return u.role=='Admin'}).length<=1&&!own)return {ok:false,err:'You cannot delete the last Admin.'};
      list=list.filter(function(u){return u.id!=t.id});saveEmps_(list);return {ok:true,employees:pub(list)};}
    var name=clip_(d.name,80),email=String(d.email||'').trim().slice(0,200),role=String(d.role||''),np=String(d.newPin||'').trim();
    if(!name)return {ok:false,err:'Add the employee name'};if((email||!own)&&!validEmail(email))return {ok:false,err:'That email does not look right'};if(!EMP_ROLES[role])return {ok:false,err:'Pick a role'};
    if(role=='Owner'&&!own)return {ok:false,err:'Only the Owner can add an Owner.'};
    if(np&&!own)return {ok:false,err:'Only the Owner can set PINs.'};if(np&&!/^\d{4}$/.test(np))return {ok:false,err:'PIN must be 4 digits'};
    if(d.a=='empEdit'){var u=list.filter(function(x){return x.id==d.id})[0];if(!u)return {ok:false,err:'Employee not found'};
      if(np&&np!==String(u.pin)&&used[np])return {ok:false,err:'That PIN is already in use.'};
      if(email&&list.some(function(x){return x!==u&&String(x.email).toLowerCase()==email.toLowerCase()}))return {ok:false,err:'Another employee has that email.'};
      u.name=name;u.email=email;u.role=role;if(np)u.pin=np;if(d.perms)u.perms=empPerms_(d.perms);if('payRate' in d)u.payRate=empRate_(d.payRate);u.edited=new Date().toISOString();saveEmps_(list);
      return {ok:true,employee:empPublic_(u,own),employees:pub(list)};}
    if(email&&list.some(function(u){return String(u.email).toLowerCase()==email.toLowerCase()}))return {ok:false,err:'That email already has a code. Delete them first to make a new one.'};
    if(np&&used[np])return {ok:false,err:'That PIN is already in use.'};var pin=np;
    for(var i=0;i<50&&(!pin||used[pin]);i++)pin=String(1000+Math.floor(Math.random()*9000));
    add={id:newId_('E'),name:name,email:email,role:role,pin:pin,created:new Date().toISOString()};if(own){add.perms=empPerms_(d.perms);add.payRate=empRate_(d.payRate);}list.push(add);saveEmps_(list);
  }finally{unlock_(L)}
  var label={Manager:'Estimator',Crew:'Crew',Admin:'Admin',Owner:'Owner'}[add.role],mailed=false,mailErr='';
  if(add.email)try{var mr=mail_({to:add.email,replyTo:CO.email,name:CO.name,subject:'Your Fielder Field Desk login code',htmlBody:'<p>Hi '+esc_(add.name)+',</p><p>You have been added to Fielder Field Desk as <b>'+label+'</b>.</p><p>Your login code is <b style="font-size:22px;letter-spacing:3px">'+add.pin+'</b></p><p>Open <a href="https://austin-tss.github.io/fielder/">austin-tss.github.io/fielder</a> and enter the code. Keep it private.</p>'});mailed=!!(mr&&mr.sent);}catch(x){mailErr=String(x&&x.message||x)}
  return {ok:true,code:add.pin,mailed:mailed,mailErr:mailErr,employee:empPublic_(add,own),employees:pub(emps_())};}
// ===== Owner labor cost: hours per person per day (from punches) x that employee's pay rate. =====
function laborApi_(d){var now=Date.now(),re=/^\d{4}-\d{2}-\d{2}$/,to=re.test(d.to||'')?d.to:Utilities.formatDate(new Date(now),CLOCK_TZ,'yyyy-MM-dd'),fr=re.test(d.from||'')?d.from:to;
  var a=Utilities.parseDate(fr+' 00:00',CLOCK_TZ,'yyyy-MM-dd HH:mm').getTime(),b=Utilities.parseDate(to+' 00:00',CLOCK_TZ,'yyyy-MM-dd HH:mm').getTime();if(b<a){var t=a;a=b;b=t}
  if(b-a>62*86400000)return {ok:false,err:'Pick 62 days or less.'};
  var ps=clockLoad_(clockNames_(a,b+86400000)).all,rates={};emps_().forEach(function(u){rates[clockKey_(u.name)]={rate:u.payRate==null?null:Number(u.payRate),name:u.name}});
  var names={};ps.forEach(function(p){names[clockKey_(p.who)]=p.who});var days=[],tot=0,th=0,miss={};
  for(var x=a;x<=b+3600000;){var ds=Utilities.formatDate(new Date(x),CLOCK_TZ,'yyyy-MM-dd'),d0=Utilities.parseDate(ds+' 00:00',CLOCK_TZ,'yyyy-MM-dd HH:mm').getTime(),d1=d0+86400000+3600000;d1=Utilities.parseDate(Utilities.formatDate(new Date(d1),CLOCK_TZ,'yyyy-MM-dd')+' 00:00',CLOCK_TZ,'yyyy-MM-dd HH:mm').getTime();
    var people=[],dc=0,dh=0;for(var k in names){var h=clockHrs_(ps,names[k],d0,Math.min(d1,now),now);if(!h)continue;var r=rates[k],rate=r&&r.rate!=null?r.rate:null,c=rate==null?null:Math.round(h*rate*100)/100;if(rate==null)miss[names[k]]=1;people.push({who:names[k],hours:h,rate:rate,cost:c});dh+=h;dc+=c||0;}
    days.push({date:ds,people:people,hours:Math.round(dh*100)/100,cost:Math.round(dc*100)/100});tot+=dc;th+=dh;x=d1;if(d0>=b)break;}
  return {ok:true,from:fr,to:to,days:days,hours:Math.round(th*100)/100,cost:Math.round(tot*100)/100,missingRate:Object.keys(miss)};}

// ===== Voice quotes: Gemini sorts a spoken walk-through into customer, estimate, and crew-only parts. =====
// Needs Script Property GEMINI_API_KEY. Nothing is saved or sent here; the app pre-fills the form for review.
// Crew-only details are returned separately and the app puts them only in Internal notes (never on the estimate or email).
var VOICE_MODEL='gemini-3.8-flash'; // gemini-2.5-flash now returns 404 for new keys
function voiceSchema_(){var S={type:'STRING'},N={type:'NUMBER'};
  return {type:'OBJECT',properties:{
    transcript:S,
    customer:{type:'OBJECT',properties:{name:S,phone:S,email:S,address:S}},
    estimate:{type:'OBJECT',properties:{items:{type:'ARRAY',items:{type:'OBJECT',properties:{service:S,description:S,qty:N,price:N},required:['service','description']}},total:N,customerNotes:S}},
    crew:{type:'OBJECT',properties:{access:S,hazards:S,equipment:S,cleanup:S,trees:S,internalNotes:S}}},
    required:['customer','estimate','crew']};}
function voicePrompt_(){var svc=[];try{svc=(settings_().form.services||[]).map(function(x){return x.name+(x.price?' ($'+x.price+')':'')})}catch(e){}
  return 'You are the estimator assistant for '+CO.name+', a tree service in Tallahassee, Florida. The estimator is walking a job and talking out loud. '+
  'Split what they say into three parts. CUSTOMER: name, phone, email, street address with city, state, zip if said. '+
  'ESTIMATE (customer sees this): one line item per piece of work with a short professional service title, a one-sentence customer-friendly description, qty (default 1), and price in US dollars if a price was said (else 0); total of the prices; customerNotes = only things meant for the customer (scheduling promises, warranty, what is included). '+
  'CREW (internal only, never shown to the customer): access and gate codes, dogs, parking; hazards such as power lines, structures, dead wood, bees; equipment needed such as bucket truck, crane, stump grinder, mats; haul-away and cleanup instructions; tree locations and details such as species, size, which side of the house; and any other internal remark, opinion, or margin talk. '+
  'Never put gate codes, hazards, equipment, opinions about the customer, or internal pricing talk in the estimate. Leave a field empty if it was not said. Do not invent prices or contact details. '+
  'Also return the plain transcript. Common services: '+svc.join(', ')+'.';}
function voiceQuote_(d){var key=prop_('GEMINI_API_KEY');if(!key)return {ok:false,setup:true,err:'Voice quotes need setup: add GEMINI_API_KEY in Script Properties.'};
  var parts=[{text:voicePrompt_()}],text=clip_(d.text,8000),audio=String(d.audio||''),mime=String(d.mime||'audio/webm').split(';')[0].trim().toLowerCase();if(mime==='audio/x-m4a'||mime==='audio/m4a')mime='audio/mp4';
  if(audio){if(audio.length>14000000)return {ok:false,err:'That recording is too long. Keep it under about 5 minutes.'};parts.push({inline_data:{mime_type:mime,data:audio}});}
  if(text)parts.push({text:'Estimator notes:\n'+text});
  if(!audio&&!text)return {ok:false,err:'Say or type the quote first.'};
  var res=UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/'+VOICE_MODEL+':generateContent?key='+encodeURIComponent(key),{method:'post',contentType:'application/json',muteHttpExceptions:true,
    payload:JSON.stringify({contents:[{role:'user',parts:parts}],generationConfig:{temperature:0.2,responseMimeType:'application/json',responseSchema:voiceSchema_()}})});
  var code=res.getResponseCode(),body={};try{body=JSON.parse(res.getContentText()||'{}')}catch(e){}
  if(code<200||code>=300){Logger.log('Gemini '+code+' '+res.getContentText().slice(0,500));var gm='';try{gm=String((body.error||{}).message||'').slice(0,200)}catch(e3){}return {ok:false,err:'Gemini could not read that ('+code+(gm?': '+gm:'')+'). Try again or type the notes.'};}
  var out={};try{out=JSON.parse(body.candidates[0].content.parts.map(function(x){return x.text||''}).join(''))}catch(e2){return {ok:false,err:'Gemini answer was not readable. Try again.'};}
  return {ok:true,result:voiceClean_(out)};}
function voiceClean_(o){o=o||{};var c=o.customer||{},e=o.estimate||{},k=o.crew||{},S=function(v,n){return clip_(v,n||1000)};
  var items=(e.items||[]).slice(0,30).map(function(i){var q=Number(i.qty)||1,p=Number(i.price)||0;return {service:S(i.service,120),description:S(i.description,600),qty:q,price:p}});
  return {transcript:S(o.transcript,8000),customer:{name:S(c.name,120),phone:S(c.phone,40),email:S(c.email,200),address:S(c.address,300)},
    estimate:{items:items,total:items.reduce(function(a,i){return a+i.qty*i.price},0),customerNotes:S(e.customerNotes,1500)},
    crew:{access:S(k.access),hazards:S(k.hazards),equipment:S(k.equipment),cleanup:S(k.cleanup),trees:S(k.trees),internalNotes:S(k.internalNotes,2000)}};}

// ===================== Text-a-link quotes (hosted page quote.html?id=<token>) =====================
// Script Properties: TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM, TEST_PHONE (required during the test run), QUOTE_PAGE_URL (optional).
// TEST RUN: quote links are texted ONLY to TEST_PHONE; with no TEST_PHONE nothing is sent.
function quotePageBase_(){return String(prop_('QUOTE_PAGE_URL')||'https://austin-tss.github.io/fielder/quote.html');}
function pubTok_(j){if(!j.pt)j.pt=(Utilities.getUuid()+Utilities.getUuid()).replace(/-/g,'');return j.pt;}
function quoteLink_(j){return quotePageBase_()+'?id='+encodeURIComponent(j.pt);}
function textReady_(){var c=smsCfg_();if(!c.sid||!c.tok||!c.from)return "Texting isn't set up yet. Use Email for now.";if(!c.testPhone)return "Texting is in test mode and TEST_PHONE isn't set yet, so nothing was sent.";return '';}
function quoteSmsBody_(j){return 'Hi '+String(j.name||'there').split(' ')[0]+', your estimate from '+CO.name+' is ready: '+quoteLink_(j)+' Tap to view and approve. Questions: '+CO.phone;}
// Always test-routed: the real customer number is only shown inside the text.
function sendQuoteLink_(j){var tr=textReady_();if(tr)return {ok:false,err:tr};var c=smsCfg_(),to=e164_(j.phone);if(!to)return {ok:false,err:'No valid customer phone.'};
  var r=UrlFetchApp.fetch('https://api.twilio.com/2010-04-01/Accounts/'+c.sid+'/Messages.json',{method:'post',muteHttpExceptions:true,headers:{Authorization:'Basic '+Utilities.base64Encode(c.sid+':'+c.tok)},payload:{To:e164_(c.testPhone),From:c.from,Body:'[TEST to '+to+'] '+quoteSmsBody_(j)}});
  var ok=r.getResponseCode()<300;Logger.log('Quote link SMS '+(ok?'sent':'failed '+r.getResponseCode()));return ok?{ok:true}:{ok:false,err:'Twilio said '+r.getResponseCode()};}
function quoteText_(d){var tr=textReady_();if(tr)return {ok:false,err:tr};
  var j=patchJob_(d.id,function(s){pubTok_(s);if(!s.status||s.status=='new')s.status='sent';});if(!j)return findJob_(load_(),d.id)?BUSY_:{ok:false,err:'Job not found'};
  if(!e164_(j.phone))return {ok:false,err:'Add the customer phone number first.'};
  var res=sendQuoteLink_(j),pj=patchJob_(j.id,function(s){logSms_(s,'quote-link',res);if(res.ok)s.textedAt=new Date().toISOString();});if(pj)j=pj;
  return res.ok?{ok:true,job:j,link:quoteLink_(j)}:{ok:false,err:'Text not sent: '+res.err};}
function byTok_(js,t){t=String(t||'');if(!/^[a-f0-9]{48,}$/i.test(t))return null;return js.filter(function(x){return x.pt===t&&!x.archived})[0]||null;}
function quotePublic_(t){var j=byTok_(load_(),t);if(!j)return {ok:false,err:'This quote link is not valid. Please call '+CO.phone+'.'};
  if(!j.openedAt){try{var oj=patchJob_(j.id,function(s){if(!s.openedAt)s.openedAt=new Date().toISOString();});if(oj)j=oj;}catch(e){}}
  var dq_=discInfo_(j);
  return {ok:true,co:CO,quote:{est:j.est||'',name:j.name||'',address:j.address||'',date:j.updated||j.created||'',items:(j.items||[]).map(function(i){return {title:i.title||'',detail:i.detail||'',price:i.price==null||i.price===''?null:Number(i.price)}}),total:total_(j.items),custHtml:custBlock_(j),approved:j.status=='approved'||!!(j.response&&(j.response.ans=='A'||j.response.ans=='B')),status:j.status||'',discount:dq_}};}
function approvePublic_(d){var L=lock_(8000);if(!L)return BUSY_;try{var js=load_(),j=byTok_(js,d.t);if(!j)return {ok:false,err:'This quote link is not valid. Please call '+CO.phone+'.'};
  if(!(j.response&&(j.response.ans=='A'||j.response.ans=='B'))){respond_(j,{ans:'A',text:'Approved on the quote page'});save_(js);}return {ok:true};}finally{unlock_(L)}}

// ===== Sent-quote follow-ups, bulk status, discount offer (TEST RUN: emails only to testTo_(), texts only to TEST_PHONE) =====
var CAPS_=['followUp','setStatus','discount','opened'];
var FU_STATUS_={sent:1,followup:1,approved:1,declined:1};
function discPct_(o){var n=Math.round(Number(o&&o.discountPct));return n>=1&&n<=50?n:10;}
function discInfo_(j){if(!j.discount)return null;var base=j.discount.applied?num_(j.discount.base,total_(j.items)):total_(j.items);var off=Math.round(base*j.discount.pct)/100;
  return {pct:j.discount.pct,base:base,off:off,total:Math.round((base-off)*100)/100,applied:!!j.discount.applied};}
// Adds a negative "X% off" line once, so the quote total and the invoice pre-filled from it both carry the discount.
function applyDiscount_(j){if(!j.discount||j.discount.applied)return;var base=total_(j.items),off=Math.round(base*j.discount.pct)/100;if(!(off>0))return;
  j.items=(j.items||[]).concat([{title:'Discount ('+j.discount.pct+'% off)',detail:'Follow-up offer',price:-off}]);j.total=total_(j.items);j.discount.applied=true;j.discount.base=base;j.discount.appliedAt=new Date().toISOString();}
function money_(n){return '$'+Number(n||0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
function fuMsg_(j,disc){var first=String(j.name||'there').split(' ')[0],link=quoteLink_(j),di=discInfo_(j);
  if(disc&&di)return 'Hi '+first+', just checking in on your estimate from '+CO.name+'. If you approve this week we can take '+di.pct+'% off, bringing it to '+money_(di.total)+' (was '+money_(di.base)+'). View and approve here: '+link+' Questions: '+CO.phone;
  return 'Hi '+first+', just following up on your estimate from '+CO.name+'. You can view and approve it here: '+link+' Any questions, call or text '+CO.phone+'. Thank you!';}
function followUp_(d){var rl=roleOf_(d);if(rl!=='Manager'&&rl!=='Owner'&&rl!=='Admin')return {ok:false,err:'That PIN cannot send follow-ups.'};
  var via=d.via==='email'?'email':'text',disc=!!d.discount;if(via=='text'){var tr=textReady_();if(tr)return {ok:false,err:tr};}
  var pct=discPct_(loadObj_('settings.json'));
  var j=patchJob_(d.id,function(s){pubTok_(s);if(disc&&!(s.discount&&s.discount.applied))s.discount={pct:pct,at:new Date().toISOString()};});if(!j)return findJob_(load_(),d.id)?BUSY_:{ok:false,err:'Job not found'};
  var body=fuMsg_(j,disc),res;
  if(via=='text'){var c=smsCfg_(),to=e164_(j.phone);if(!to)return {ok:false,err:'Add the customer phone number first.'};
    var r=UrlFetchApp.fetch('https://api.twilio.com/2010-04-01/Accounts/'+c.sid+'/Messages.json',{method:'post',muteHttpExceptions:true,headers:{Authorization:'Basic '+Utilities.base64Encode(c.sid+':'+c.tok)},payload:{To:e164_(c.testPhone),From:c.from,Body:'[TEST to '+to+'] '+body}});
    res=r.getResponseCode()<300?{ok:true}:{ok:false,err:'Twilio said '+r.getResponseCode()};}
  else{if(!validEmail(j.email))return {ok:false,err:'Add the customer email first.'};try{mail_({to:j.email,subject:(disc?'A '+pct+'% offer on your estimate':'Following up on your estimate')+' from '+CO.name,body:body});res={ok:true}}catch(x){res={ok:false,err:String(x&&x.message||x)}}}
  var pj=patchJob_(j.id,function(s){if(via=='text')logSms_(s,disc?'followup-discount':'followup',res);if(res.ok){var at=new Date().toISOString();s.followUps=(s.followUps||[]).concat([{at:at,via:via,disc:disc}]).slice(-20);s.lastFollowUp=at;if(s.status=='sent'||s.status=='reply'||!s.status)s.status='followup';}});if(pj)j=pj;
  return res.ok?{ok:true,job:j}:{ok:false,err:'Follow-up not sent: '+res.err};}
function setStatus_(d){var rl=roleOf_(d);if(rl!=='Manager'&&rl!=='Owner'&&rl!=='Admin')return {ok:false,err:'That PIN cannot change quote status.'};
  var st=String(d.status||''),ids=Array.isArray(d.ids)?d.ids.slice(0,200):[];if(!FU_STATUS_[st])return {ok:false,err:'Unknown status'};if(!ids.length)return {ok:false,err:'Pick at least one quote.'};
  var L=lock_(20000);if(!L)return BUSY_;try{var js=load_(),n=0;ids.forEach(function(id){var j=findJob_(js,id);if(!j)return;
    if(st=='approved')respond_(j,{ans:'A',text:'Marked approved in the app'});else if(st=='declined')respond_(j,{ans:'C',text:'Marked declined in the app'});else j.status=st;j.updated=new Date().toISOString();n++;});
    save_(js);return {ok:true,changed:n,jobs:js.filter(function(x){return !x.archived})};}finally{unlock_(L)}}

// CSV import: appends to customers.json. Skips rows with no name or a duplicate email/phone (existing jobs, customers, or earlier rows). Never emails or texts.
function importCustomers_(d){var rows=Array.isArray(d.rows)?d.rows:[];if(!rows.length)return {ok:false,err:'No rows to import.'};if(rows.length>2000)return {ok:false,err:'Too many rows. Import 2000 at a time.'};
  var cs=load_('customers.json');if(!Array.isArray(cs))cs=[];var seen={},dig=function(v){var x=String(v||'').replace(/\D/g,'');return x.length>10&&x[0]=='1'?x.slice(1):x};
  load_().concat(cs).forEach(function(x){var e=String(x.email||'').trim().toLowerCase(),ph=dig(x.phone);if(e)seen['e:'+e]=1;if(ph.length>=7)seen['p:'+ph]=1});
  var added=0,skipped=[],now=new Date().toISOString();
  rows.forEach(function(r,i){r=r||{};var c={id:newId_('C-'),name:clip_(r.name,200),email:clip_(r.email,200).toLowerCase(),phone:clip_(r.phone,40),address:clip_(r.address,300),source:'csv',created:now},e=c.email,ph=dig(c.phone);
    if(!c.name){skipped.push({row:i+1,why:'No name'});return}
    if(e&&!validEmail(e))c.email='';
    if((c.email&&seen['e:'+c.email])||(ph.length>=7&&seen['p:'+ph])){skipped.push({row:i+1,why:'Duplicate'});return}
    if(c.email)seen['e:'+c.email]=1;if(ph.length>=7)seen['p:'+ph]=1;cs.push(c);added++});
  if(added)save_(cs,'customers.json');return {ok:true,added:added,skipped:skipped.length,reasons:skipped.slice(0,50),customers:cs};}

// Owner-only, write-only setup for GEMINI_API_KEY / GOOGLE_PLACES_KEY (same names Miller uses). Values are never returned: set, present, missing or invalid.
function aiKeys_(d){var P=PropertiesService.getScriptProperties(),r={};['GEMINI_API_KEY','GOOGLE_PLACES_KEY'].forEach(function(k){var v=String(d[k]||'').trim();if(v){if(!/^[A-Za-z0-9_\-]{20,80}$/.test(v)){r[k]='invalid';return}P.setProperty(k,v);r[k]='set'}else r[k]=prop_(k)?'present':'missing'});return {ok:true,keys:r};}

// ===================== Fielder Field Desk: business features (parity2) =====================
// Self-scheduling, reminders/on-the-way, Stripe payments, e-signature, crew GPS, job costing,
// equipment + safety, reviews + yearly follow-ups, storm mode, QuickBooks export, customer portal.
// Entry: featPost_(e) wraps post_(e). Everything customer-facing goes through mail_() (testTo_() only) and sendSms_() (TEST_PHONE only).
var FT_SITE='https://ft.vnxt.app/';
var FT_ACTS={fGet:1,fSet:1,fKeys:1,bookSend:1,onWay:1,remindNow:1,gpsMap:1,costAdd:1,costDel:1,costSummary:1,eqList:1,eqSave:1,eqDel:1,eqService:1,safetySave:1,safetyStatus:1,safetyReport:1,reviewSend:1,followList:1,followSend:1,stormAdd:1,stormList:1,stormSet:1,qbExport:1,portalLink:1,sigImg:1,fDemo:1};
var FT_PUB={bookInfo:1,bookPick:1,signInfo:1,signSubmit:1,payStart:1,payConfirm:1,portalInfo:1};
var FT_NEED={bookSend:['quotes','schedule'],onWay:['schedule','crew'],remindNow:['schedule'],gpsMap:['hours'],costAdd:['crew','quotes','projects'],costDel:['quotes','projects'],costSummary:['projects','invoices'],
 eqList:['crew','schedule','hours'],eqSave:['schedule','hours'],eqDel:['hours'],eqService:['crew','schedule','hours'],safetySave:['crew','clock'],safetyStatus:['crew','clock','hours'],safetyReport:['hours'],
 reviewSend:['projects','invoices'],followList:['projects','quotes'],followSend:['projects','quotes'],stormAdd:['quotes','schedule','crew'],stormList:['quotes','schedule','crew'],stormSet:['quotes','schedule'],
 qbExport:['invoices'],portalLink:['quotes','projects','invoices','schedule'],sigImg:['quotes','projects','invoices'],fGet:[]};
var FT_HAZ={house:{p:1,l:'Tree on house / structure'},line:{p:1,l:'On power line'},road:{p:2,l:'Blocking road'},car:{p:2,l:'On vehicle'},drive:{p:3,l:'Blocking driveway'},fence:{p:3,l:'On fence / shed'},hang:{p:4,l:'Hanging or leaning'},yard:{p:5,l:'Down in yard'}};
var FT_SAFE=['ppe','saws','chipper','dropzone','lines','weather','firstaid','briefing'];
function ftR_(d){return roleOf_(d)}
function ftCan_(d,a){var r=roleOf_(d);if(!r)return false;if(r==='Owner')return true;var need=FT_NEED[a]||(typeof FT2_NEED!=='undefined'&&FT2_NEED[a])||[];if(!need.length)return true;var e=empOf_(d),p=(e&&Array.isArray(e.perms)?e.perms:null)||FT_PERM_DEF_[r]||[];return need.some(function(x){return p.indexOf(x)>=0})}
function ftCfg_(){var o={};try{o=loadObj_('feat.json')}catch(e){o={}}return o}
function ftSaveCfg_(o){saveObj_(o,'feat.json')}
function ftSecret_(){var P=PropertiesService.getScriptProperties(),s=P.getProperty('FEAT_SECRET');if(!s){s=Utilities.getUuid()+Utilities.getUuid();P.setProperty('FEAT_SECRET',s)}return s}
function ftHex_(b){return b.map(function(x){return ('0'+(x&255).toString(16)).slice(-2)}).join('')}
function ftTok_(id){return String(id)+'.'+ftHex_(Utilities.computeHmacSha256Signature('job:'+id,ftSecret_())).slice(0,32)}
function ftJobOfTok_(t){t=String(t||'');var i=t.lastIndexOf('.');if(i<1)return null;var id=t.slice(0,i);if(ftTok_(id)!==t)return null;var j=findJob_(load_(),id);return j&&!j.archived?j:null}
function ftLink_(page,j){return FT_SITE+page+'?t='+encodeURIComponent(ftTok_(j.id))}
function ftBtn_(href,txt,c){return '<a href="'+href+'" style="display:block;margin:8px 0;padding:15px;background:'+(c||GREEN)+';color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;font-size:16px;text-align:center">'+txt+'</a>'}
function ftPortalP_(j){return '<p style="margin:14px 0;font-size:14px">Your project page (quote, schedule, photos, invoice): <a href="'+ftLink_('portal.html',j)+'" style="color:'+DG+';font-weight:bold">open my project</a></p>'}
// Hooks used by Code.gs email builders
function featSignBtn_(j){try{return ftBtn_(ftLink_('sign.html',j),'✍ Review &amp; sign online (A / B / C)',NAVY)+ftPortalP_(j)}catch(e){return ''}}
function featPayBtn_(j){try{return (ftStripeKey_()?ftBtn_(ftLink_('pay.html',j),'💳 Pay online (card or bank)',GREEN):'')+ftPortalP_(j)}catch(e){return ''}}
function ftMail_(j,subj,inner){if(!validEmail(j.email))return {ok:false,err:'No customer email'};mail_({to:j.email,replyTo:CO.email,name:CO.name,subject:subj,htmlBody:head_(subj,'',  'cid:logo')+'<p style="font-size:16px">Hi '+esc_(String(j.name||'there').split(' ')[0])+',</p>'+inner+ftPortalP_(j)+foot_(),inlineImages:{logo:logoBlob_()}});return {ok:true}}
function ftSms_(j,body){var c=ftCfg_();if(!c.smsOn)return {skipped:'SMS off'};var r=sendSms_(j.phone,body);return r}
function ftLog_(j,kind,extra){patchJob_(j.id,function(s){s.notices=s.notices||[];s.notices.push(Object.assign({kind:kind,at:new Date().toISOString()},extra||{}));if(s.notices.length>40)s.notices=s.notices.slice(-40)})}
function ftYmd_(ms){return Utilities.formatDate(new Date(ms),CLOCK_TZ,'yyyy-MM-dd')}
function ftHm_(s){var p=String(s||'0:0').split(':');return (+p[0])*60+(+p[1]||0)}
function ftT12_(s){var m=ftHm_(s),h=Math.floor(m/60),mm=m%60;return ((h+11)%12+1)+(mm?':'+('0'+mm).slice(-2):'')+(h<12?' AM':' PM')}
function ftStripeKey_(){return String(prop_('STRIPE_SECRET_KEY')||'')}
function ftReviewUrl_(){return String(prop_('GOOGLE_REVIEW_URL')||ftCfg_().reviewUrl||'')}
function ftStatus_(){var c=smsCfg_(),q={};try{q=qboPublic_()}catch(e){}var cfg=ftCfg_();
 return {storm:!!cfg.storm,smsOn:!!cfg.smsOn,smsReady:!!(c.sid&&c.tok&&c.from),stripe:!!ftStripeKey_(),stripeMode:/^sk_live/.test(ftStripeKey_())?'live':(ftStripeKey_()?'test':''),
  reviewUrl:ftReviewUrl_(),reviewDirect:!!ftReviewUrl_(),qbo:q,on:(function(o){o=o||{};return {permits:!!o.permits,safety:!!o.safety,equipment:!!o.equipment,coi:!!o.coi,reviews:!!o.reviews,storm:!!(o.storm||cfg.storm)}})(cfg.on),gemini:!!prop_('GEMINI_API_KEY'),site:FT_SITE}}

function featPost_(e){var d;try{d=JSON.parse(e.postData.contents)}catch(x){return post_(e)}
 if(d&&d.object==='event'&&d.type&&d.data)return ftStripeHook_(d);
 if(!d||typeof d!=='object')return post_(e);
 if(FT_PUB[d.a])return ftPublic_(d);
 if(FT_ACTS[d.a]||(typeof FT2_ACTS!=='undefined'&&FT2_ACTS[d.a])){if(!roleOf_(d))return {ok:false,err:'PIN required'};if(!ftCan_(d,d.a))return {ok:false,err:'You do not have permission for that. Ask the owner.'};ftSweep_();return ftStaff_(d)}
 // Pre-checks on core actions
 if(d.a=='finish'&&roleOf_(d)==='Crew'){var who=ftWho_(d);if(!ftSafeDone_(who))return {ok:false,needSafety:true,err:'SAFETY: Finish today’s safety checklist first, then tap Job complete again.'}}
 var r=post_(e);
 try{if(r&&r.ok!==false){
  if((d.a=='clockIn'||d.a=='clockOut')&&d.gps)ftGpsRec_(d,d.a=='clockIn'?'in':'out',null);
  if(d.a=='finish'){if(d.gps)ftGpsRec_(d,'done',d.id);var j=findJob_(load_(),d.id);if(j)ftReview_(j,true)}
  if(d.a=='login'||d.a=='clockIn')ftSweep_();}}catch(x){Logger.log('feat post-hook: '+x)}
 return r}

// ---------- public (customer) actions: token = HMAC(job id) ----------
function ftPublic_(d){var j=ftJobOfTok_(d.t);if(!j)return {ok:false,err:'This link is not valid. Please call '+CO.phone+'.'};
 if(d.a=='portalInfo')return {ok:true,p:ftPortal_(j)};
 if(d.a=='bookInfo')return {ok:true,name:j.name,address:j.address,booked:ftBooked_(j),slots:ftSlots_()};
 if(d.a=='bookPick'){var L=lock_(10000);if(!L)return BUSY_;try{var free=ftSlots_().filter(function(s){return s.date===d.date&&s.slot===d.slot})[0];if(!free)return {ok:false,err:'That time was just taken. Please pick another.'};
   var bl=load_('blocks.json');bl=bl.filter(function(b){return !(b.job==j.id&&b.src=='customer')});var b={id:newId_('B'),date:free.date,start:free.start,end:free.end,job:j.id,note:'Booked by customer',src:'customer'};bl.push(b);save_(bl,'blocks.json');
   var js=load_(),jj=findJob_(js,j.id);jj.booked={date:b.date,start:b.start,end:b.end,at:new Date().toISOString()};save_(js,'jobs.json');j=jj}finally{unlock_(L)}
  ftMail_(j,'You’re booked: '+prettyDate_(d.date)+' '+ftT12_(free.start),'<p>Thanks! Your tree work at <b>'+esc_(j.address)+'</b> is booked for <b>'+prettyDate_(d.date)+', '+ftT12_(free.start)+'–'+ftT12_(free.end)+'</b>. We’ll send a reminder the day before and a heads-up when the crew is on the way.</p>');
  return {ok:true,booked:[{date:b.date,label:prettyDate_(b.date)+' · '+ftT12_(b.start)+'–'+ftT12_(b.end)}]}}
 if(d.a=='signInfo'){return {ok:true,quote:ftQuoteFace_(j),sig:j.sig?{name:j.sig.name,choice:j.sig.choice,at:j.sig.at}:null}}
 if(d.a=='signSubmit'){var ch=String(d.choice||'');if(!/^[ABC]$/.test(ch))return {ok:false,err:'Pick A, B or C.'};var nm=clip_(d.name,80);if(nm.length<2)return {ok:false,err:'Type your full name.'};
  var sig=String(d.sig||'');if(!/^data:image\/png;base64,[A-Za-z0-9+\/=]+$/.test(sig)||sig.length<800||sig.length>400000)return {ok:false,err:'Please sign in the box.'};
  var blob=Utilities.newBlob(Utilities.base64Decode(sig.split(',')[1]),'image/png','signature-'+j.id+'.png'),f=folder_(j).createFile(blob);
  var rec={name:nm,choice:ch,label:LABELS[ch],at:new Date().toISOString(),fileId:f.getId(),note:clip_(d.note,1000)};
  var js2,j2;var L2=lock_(10000);if(!L2){trash_f_(f);return BUSY_}try{js2=load_();j2=findJob_(js2,j.id);j2.sig=rec;if(j.folderId&&!j2.folderId){j2.folderId=j.folderId;j2.folder=j.folder}respond_(j2,{ans:ch,text:rec.note||('Signed online by '+nm)});save_(js2)}finally{unlock_(L2)}
  var pdf=Utilities.newBlob(ftSignedHtml_(j2,sig),'text/html','s.html').getAs('application/pdf').setName('Fielder Signed Estimate '+(j2.est||j2.id)+'.pdf');try{folder_(j2).createFile(pdf.copyBlob())}catch(x){}
  mail_({to:j2.email||testTo_(),replyTo:CO.email,name:CO.name,subject:'Signed: Estimate '+(j2.est||'')+' - '+LABELS[ch],htmlBody:head_('Signed estimate',j2.est,'cid:logo')+'<p>Thank you, '+esc_(nm)+'. Your choice: <b>'+esc_(LABELS[ch])+'</b>, signed '+Utilities.formatDate(new Date(rec.at),CLOCK_TZ,'MMM d, yyyy h:mm a')+'.</p><p><img src="cid:sig" style="max-width:320px;border-bottom:2px solid #112337"></p>'+ftPortalP_(j2)+foot_(),inlineImages:{logo:logoBlob_(),sig:blob},attachments:[pdf]});
  return {ok:true,sig:{name:nm,choice:ch,at:rec.at},bookUrl:(ch!='C'?ftLink_('book.html',j2):'')}}
 if(d.a=='payStart'){var key=ftStripeKey_();if(!key)return {ok:false,inactive:true,err:'Online payment is not switched on yet. Please call '+CO.phone+' to pay by card.'};
  if(!j.invoice)return {ok:false,err:'There is no invoice on this project yet.'};if(j.invoice.paid)return {ok:true,paid:true};
  var amt=Math.round(num_(j.invoice.amount,total_(j.items))*100);if(!(amt>=50))return {ok:false,err:'Invoice amount is missing. Please call '+CO.phone+'.'};var tk=ftTok_(j.id);
  var pl={'mode':'payment','payment_method_types[0]':'card','payment_method_types[1]':'us_bank_account','line_items[0][quantity]':'1','line_items[0][price_data][currency]':'usd','line_items[0][price_data][unit_amount]':String(amt),
   'line_items[0][price_data][product_data][name]':'Invoice '+String(j.est||j.id).replace('EST','INV')+' - '+CO.name,'metadata[job]':j.id,'client_reference_id':j.id,
   'success_url':FT_SITE+'pay.html?t='+encodeURIComponent(tk)+'&sid={CHECKOUT_SESSION_ID}','cancel_url':FT_SITE+'pay.html?t='+encodeURIComponent(tk)};if(validEmail(j.email))pl.customer_email=testTo_();
  var res=UrlFetchApp.fetch('https://api.stripe.com/v1/checkout/sessions',{method:'post',payload:pl,muteHttpExceptions:true,headers:{Authorization:'Bearer '+key}}),o={};try{o=JSON.parse(res.getContentText())}catch(x){}
  if(!o.url)return {ok:false,err:'Payment page could not open ('+((o.error&&o.error.message)||res.getResponseCode())+').'};return {ok:true,url:o.url}}
 if(d.a=='payConfirm'){if(j.invoice&&j.invoice.paid)return {ok:true,paid:true};var s=ftStripeSession_(d.sid);if(s&&s.payment_status=='paid'&&(s.metadata||{}).job==j.id){ftMarkPaid_(j.id,s);return {ok:true,paid:true}}return {ok:true,paid:false,pending:!!s}}
 return {ok:false,err:'Bad action'}}
function pubTokSafe_(j){return j.pt||''}
function trash_f_(f){try{f.setTrashed(true)}catch(e){}}
function ftQuoteFace_(j){return {est:j.est||'',name:j.name||'',address:j.address||'',date:j.updated||j.created||'',items:(j.items||[]).map(function(i){return {title:i.title||'',detail:i.detail||'',price:i.price==null||i.price===''?null:Number(i.price)}}),total:total_(j.items),custHtml:custBlock_(j),status:j.status||''}}
function ftSignedHtml_(j,sig){return '<html><body style="font-family:Arial;color:#231f20"><h2 style="color:'+NAVY+'">'+CO.name+' - Signed Estimate '+esc_(j.est||'')+'</h2><p>'+esc_(j.name)+'<br>'+esc_(j.address)+'</p>'+itemsTable_(j)+'<p><b>Customer choice:</b> '+esc_(j.sig.label)+'</p>'+(j.sig.note?'<p><b>Note:</b> '+esc_(j.sig.note)+'</p>':'')+'<p><b>Signed by:</b> '+esc_(j.sig.name)+' on '+Utilities.formatDate(new Date(j.sig.at),CLOCK_TZ,'MMM d, yyyy h:mm a z')+'</p><img src="'+sig+'" style="width:300px;border-bottom:2px solid #112337"><p style="font-size:11px;color:#666">'+TERMS.join(' ')+'</p></body></html>'}
function ftStripeSession_(sid){var key=ftStripeKey_();if(!key||!/^cs_[A-Za-z0-9_]+$/.test(String(sid||'')))return null;var r=UrlFetchApp.fetch('https://api.stripe.com/v1/checkout/sessions/'+sid,{muteHttpExceptions:true,headers:{Authorization:'Bearer '+key}});try{return JSON.parse(r.getContentText())}catch(e){return null}}
function ftMarkPaid_(id,s){patchJobRetry_(id,function(x){x.invoice=x.invoice||{};x.invoice.paid=true;x.invoice.paidAt=new Date().toISOString();x.invoice.paidVia='Stripe '+((s.payment_method_types||[])[0]||'');x.invoice.stripe=s.id;x.status='invoiced'})}
// Stripe webhook (checkout.session.completed): never trusts the body, re-reads the session from Stripe.
function ftStripeHook_(ev){try{if(!/^checkout\.session\.(completed|async_payment_succeeded)$/.test(ev.type))return {ok:true,ignored:true};var s=ftStripeSession_(ev.data&&ev.data.object&&ev.data.object.id);if(s&&s.payment_status=='paid'&&s.metadata&&s.metadata.job)ftMarkPaid_(s.metadata.job,s);return {ok:true}}catch(e){return {ok:false}}}

// ---------- scheduling ----------
function ftSlots_(){var bl=load_('blocks.json'),out=[],now=Date.now(),SL=[['am','08:00','12:00'],['pm','12:30','16:30']];
 for(var i=1;i<=14;i++){var k=ftYmd_(now+i*86400000),dow=new Date(k+'T12:00:00').getDay();if(dow===0)continue;
  SL.forEach(function(s){var a=ftHm_(s[1]),b=ftHm_(s[2]);var busy=bl.some(function(x){return x.date===k&&ftHm_(x.start)<b&&ftHm_(x.end)>a});if(!busy)out.push({date:k,slot:s[0],start:s[1],end:s[2],label:prettyDate_(k)+' · '+(s[0]=='am'?'Morning 8–12':'Afternoon 12:30–4:30')})})}
 return out}
function ftBooked_(j){var b=load_('blocks.json').filter(function(x){return x.job==j.id&&x.date}).sort(function(a,b){return a.date<b.date?-1:1});return b.map(function(x){return {date:x.date,start:x.start,end:x.end,label:prettyDate_(x.date)+' · '+ftT12_(x.start)+'–'+ftT12_(x.end)}})}
var FT_SWEEP_LOCK=false;
function ftSweep_(){if(FT_SWEEP_LOCK)return;FT_SWEEP_LOCK=true;try{var P=PropertiesService.getScriptProperties(),today=ftYmd_(Date.now()),h=+Utilities.formatDate(new Date(),CLOCK_TZ,'H');if(h<7||P.getProperty('FEAT_SWEEP')===today)return;P.setProperty('FEAT_SWEEP',today);ftRemind_()}catch(e){Logger.log('sweep '+e)}finally{FT_SWEEP_LOCK=false}}
function ftRemind_(){var tm=ftYmd_(Date.now()+86400000),bl=load_('blocks.json').filter(function(b){return b.date===tm&&b.job}),js=load_(),n=0,c=ftCfg_();c.remSent=c.remSent||{};
 bl.forEach(function(b){if(c.remSent[b.id])return;var j=findJob_(js,b.job);if(!j||!validEmail(j.email))return;
  ftMail_(j,'Reminder: tree work tomorrow, '+prettyDate_(b.date),'<p>Just a reminder: our crew is scheduled at <b>'+esc_(j.address)+'</b> tomorrow, <b>'+prettyDate_(b.date)+'</b>, starting about <b>'+ftT12_(b.start)+'</b>. Please make sure gates are unlocked and vehicles are clear of the work area.</p><p>Need to change it? Call '+CO.phone+'.</p>');
  ftSms_(j,smsText_('install',j,prettyDate_(b.date)));c.remSent[b.id]=new Date().toISOString();n++});
 var ks=Object.keys(c.remSent);if(ks.length>400)ks.slice(0,ks.length-400).forEach(function(k){delete c.remSent[k]});ftSaveCfg_(c);return n}

// ---------- GPS ----------
function ftWho_(d){var e=empOf_(d);if(e&&e.name&&!e.shared)return e.name;return clip_(String(d.who||'').replace(/[\u0000-\u001f<>]/g,''),60)||(e?e.name:'Crew')}
function ftMi_(a,b){var R=3958.8,t=Math.PI/180,dl=(b.lat-a.lat)*t,dn=(b.lng-a.lng)*t,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a.lat*t)*Math.cos(b.lat*t)*Math.sin(dn/2)*Math.sin(dn/2);return 2*R*Math.asin(Math.sqrt(x))}
function ftGeo_(addr){addr=String(addr||'').trim();if(!addr)return null;var g=loadObj_('geo.json');if(g[addr]!==undefined)return g[addr];var out=null;
 try{var r=UrlFetchApp.fetch('https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=Public_AR_Current&format=json&address='+encodeURIComponent(addr),{muteHttpExceptions:true}),m=JSON.parse(r.getContentText()).result.addressMatches;if(m&&m.length)out={lat:m[0].coordinates.y,lng:m[0].coordinates.x}}catch(e){}
 g[addr]=out;saveObj_(g,'geo.json');return out}
function ftGpsRec_(d,kind,jobId){var p=d.gps||{},lat=Number(p.lat),lng=Number(p.lng);if(!isFinite(lat)||!isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return;
 var who=ftWho_(d),js=load_(),today=ftYmd_(Date.now()),cands=[];
 if(jobId){var jj=findJob_(js,jobId);if(jj)cands=[jj]}else{load_('blocks.json').filter(function(b){return b.date===today&&b.job}).forEach(function(b){var x=findJob_(js,b.job);if(x)cands.push(x)})}
 var best=null;cands.forEach(function(j){var g=ftGeo_(j.address);if(!g)return;var mi=ftMi_({lat:lat,lng:lng},g);if(!best||mi<best.mi)best={mi:mi,job:j.id,name:j.name}});
 var rec={id:newId_('G-'),who:who,kind:kind,at:new Date().toISOString(),lat:lat,lng:lng,acc:Number(p.acc)||null,job:best?best.job:'',jobName:best?best.name:'',mi:best?Math.round(best.mi*100)/100:null,flag:!!(best&&best.mi>0.5&&kind=='in')};
 var L=lock_(8000);if(!L)return;try{var l=load_('gps.json');l.push(rec);if(l.length>3000)l=l.slice(-3000);save_(l,'gps.json')}finally{unlock_(L)}return rec}

// ---------- job costing ----------
function ftCosting_(){var now=Date.now(),js=load_().filter(function(j){return !j.archived}),bl=load_('blocks.json'),ps=ftPunches_(now-400*86400000,now),rm=ftRateMap_(),byDay={},lab={};
 bl.forEach(function(b){if(b.job&&b.date){(byDay[b.date]=byDay[b.date]||[]);if(byDay[b.date].indexOf(b.job)<0)byDay[b.date].push(b.job)}});
 ps.forEach(function(p){var s=new Date(p.in).getTime(),e=p.out?new Date(p.out).getTime():now,h=Math.max(0,e-s)/3600000,day=ftYmd_(s),rate=rm[clockKey_(p.who)]||0,list=p.job?[p.job]:(byDay[day]||[]);if(!list.length)return;
  list.forEach(function(id){var x=lab[id]=lab[id]||{hours:0,cost:0,people:{}};x.hours+=h/list.length;x.cost+=h*rate/list.length;x.people[p.who]=1})});
 return js.filter(function(j){return lab[j.id]||(j.costs&&j.costs.length)||/complete|invoiced/.test(j.status)}).map(function(j){var l=lab[j.id]||{hours:0,cost:0,people:{}},dump=0,mat=0;(j.costs||[]).forEach(function(c){if(c.kind=='dump')dump+=c.amt;else mat+=c.amt});
  var quoted=num_(j.invoice&&j.invoice.amount,total_(j.items)),cost=l.cost+dump+mat,profit=quoted-cost;
  return {id:j.id,est:j.est,name:j.name,status:j.status,quoted:quoted,laborHours:Math.round(l.hours*100)/100,labor:Math.round(l.cost*100)/100,dump:dump,materials:mat,cost:Math.round(cost*100)/100,profit:Math.round(profit*100)/100,margin:quoted?Math.round(profit/quoted*1000)/10:0,crew:Object.keys(l.people),costs:j.costs||[]}})}

// ---------- safety ----------
function ftSafeDone_(who){var t=ftYmd_(Date.now()),k=clockKey_(who);return load_('safety.json').some(function(s){return s.date===t&&(clockKey_(s.who)===k||(s.crew||[]).map(clockKey_).indexOf(k)>=0)})}

// ---------- reviews ----------
function ftReview_(j,auto){var c=ftCfg_();if(auto&&c.reviewAuto===false)return {skipped:'off'};if(j.reviewSent&&auto)return {skipped:'already'};
 var url=ftReviewUrl_()||('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(CO.name+' '+CO.addr));
 var r=ftMail_(j,'How did we do? - '+CO.name,'<p>Thanks for choosing '+CO.name+'! If you were happy with the work, a quick Google review helps a local business more than anything.</p>'+ftBtn_(url,'⭐ Leave a Google review',GREEN)+'<p>Anything we could do better? Just reply to this email.</p>');
 if(r.ok)patchJob_(j.id,function(s){s.reviewSent=new Date().toISOString();s.reviewDirect=!!ftReviewUrl_()});return r}

// ---------- staff actions ----------
function ftStaff_(d){var me=roleOf_(d),own=me==='Owner',S=function(o){return Object.assign({ok:true},o||{})};
 if(typeof ft2Staff_==='function'){var r2=ft2Staff_(d,me);if(r2)return r2}
 if(d.a=='fDemo'){if(!own)return {ok:false,err:'Owner only'};return ftDemo_(d)}
 if(d.a=='fGet')return S({status:ftStatus_(),hazards:FT_HAZ});
 if(d.a=='fSet'){if(!own)return {ok:false,err:'Only the Owner can change that.'};var c=ftCfg_();if('storm' in d)c.storm=!!d.storm;if('smsOn' in d)c.smsOn=!!d.smsOn;if('reviewAuto' in d)c.reviewAuto=!!d.reviewAuto;if(d.on&&typeof d.on==='object'){c.on=c.on||{};['permits','safety','equipment','coi','reviews','storm'].forEach(function(k){if(k in d.on)c.on[k]=!!d.on[k]});if(d.on.storm===false)c.storm=false}if('reviewUrl' in d){var u=clip_(d.reviewUrl,400);if(u&&!/^https:\/\//.test(u))return {ok:false,err:'Review link must start with https://'};c.reviewUrl=u}ftSaveCfg_(c);return S({status:ftStatus_()})}
 if(d.a=='fKeys'){if(!own)return {ok:false,err:'Only the Owner can change that.'};var P=PropertiesService.getScriptProperties(),r={};
  var v=String(d.STRIPE_SECRET_KEY||'').trim();if(v==='-'){P.deleteProperty('STRIPE_SECRET_KEY');r.STRIPE_SECRET_KEY='removed'}else if(v){if(!/^(sk|rk)_(test|live)_[A-Za-z0-9]{10,}$/.test(v))r.STRIPE_SECRET_KEY='invalid';else{P.setProperty('STRIPE_SECRET_KEY',v);r.STRIPE_SECRET_KEY='set'}}
  ['TWILIO_SID','TWILIO_TOKEN','TWILIO_FROM','TEST_PHONE'].forEach(function(k){var x=String(d[k]||'').trim();if(x){P.setProperty(k,clip_(x,80));r[k]='set'}});return S({result:r,status:ftStatus_()})}
 if(d.a=='portalLink'){var jp=findJob_(load_(),d.id);if(!jp)return {ok:false,err:'Job not found'};return S({url:ftLink_('portal.html',jp),sign:ftLink_('sign.html',jp),book:ftLink_('book.html',jp),pay:ftLink_('pay.html',jp)})}
 if(d.a=='sigImg'){var js0=findJob_(load_(),d.id);if(!js0||!js0.sig)return {ok:false,err:'No signature'};var b=DriveApp.getFileById(js0.sig.fileId).getBlob();return S({data:'data:image/png;base64,'+Utilities.base64Encode(b.getBytes()),sig:js0.sig})}
 if(d.a=='bookSend'){var jb=findJob_(load_(),d.id);if(!jb)return {ok:false,err:'Job not found'};var url=ftLink_('book.html',jb);
  var m=ftMail_(jb,'Pick your work date - '+CO.name,'<p>Your job is ready to schedule. Tap below to pick an open morning or afternoon that works for you. It goes straight onto our calendar.</p>'+ftBtn_(url,'📅 Pick my date',GREEN));if(!m.ok)return {ok:false,err:'Add the customer email first.',url:url};ftLog_(jb,'bookLink');return S({url:url})}
 if(d.a=='onWay'){var jo=findJob_(load_(),d.id);if(!jo)return {ok:false,err:'Job not found'};var mins=Math.max(5,Math.min(180,+d.mins||30));
  var mo=ftMail_(jo,'Our crew is on the way','<p>Our crew is <b>on the way</b> to '+esc_(jo.address)+' and should arrive in about <b>'+mins+' minutes</b>. Please make sure gates are open and vehicles are clear.</p>');var so=ftSms_(jo,smsText_('crewway',jo));ftLog_(jo,'onway',{sms:so.ok?'sent':(so.skipped||'failed')});
  return mo.ok?S({sms:so.ok?'sent':(so.skipped||'not sent')}):{ok:false,err:'Add the customer email first.'}}
 if(d.a=='remindNow')return S({sent:ftRemind_()});
 if(d.a=='gpsMap'){var l=load_('gps.json'),last={};l.forEach(function(g){if(!last[g.who]||g.at>last[g.who].at)last[g.who]=g});var since=Date.now()-14*86400000;
  return S({last:Object.keys(last).map(function(k){return last[k]}),flags:l.filter(function(g){return g.flag&&new Date(g.at).getTime()>since}).slice(-50).reverse(),geo:loadObj_('geo.json')})}
 if(d.a=='costAdd'){var amt=num_(d.amt,NaN);if(!(amt>0&&amt<100000))return {ok:false,err:'Enter the amount.'};var kind=d.kind=='dump'?'dump':'materials';var by=ftWho_(d);
  var jc=patchJob_(d.id,function(s){s.costs=s.costs||[];s.costs.push({id:newId_('C-'),kind:kind,amt:Math.round(amt*100)/100,note:clip_(d.note,200),by:by,at:new Date().toISOString()})});return jc?S({job:jc}):BUSY_}
 if(d.a=='costDel'){var jd=patchJob_(d.id,function(s){s.costs=(s.costs||[]).filter(function(c){return c.id!==d.cid})});return jd?S({job:jd}):BUSY_}
 if(d.a=='costSummary'){var rows=ftCosting_();if(d.id)rows=rows.filter(function(x){return x.id==d.id});var t=rows.reduce(function(a,x){a.quoted+=x.quoted;a.cost+=x.cost;a.profit+=x.profit;return a},{quoted:0,cost:0,profit:0});t.margin=t.quoted?Math.round(t.profit/t.quoted*1000)/10:0;if(!own&&me!=='Admin'&&me!=='Manager')rows.forEach(function(x){x.labor=null;x.profit=null;x.margin=null});return S({jobs:rows,total:t})}
 if(d.a=='eqList'){var eq=load_('equipment.json');return S({items:eq.map(ftEqDue_)})}
 if(d.a=='eqSave'||d.a=='eqDel'||d.a=='eqService'){var L=lock_(8000);if(!L)return BUSY_;try{var eq2=load_('equipment.json'),x=eq2.filter(function(q){return q.id==d.id})[0];
   if(d.a=='eqDel')eq2=eq2.filter(function(q){return q.id!=d.id});
   else if(d.a=='eqService'){if(!x)return {ok:false,err:'Not found'};if('hours' in d&&d.hours!==''&&d.hours!=null)x.hours=Math.max(0,num_(d.hours,x.hours||0));if(!d.hoursOnly){x.lastSvcDate=ftYmd_(Date.now());x.lastSvcHours=x.hours||0;x.log=(x.log||[]).concat([{at:new Date().toISOString(),by:ftWho_(d),hours:x.hours||0,note:clip_(d.note,200)}]).slice(-30)}}
   else{if(!x){x={id:newId_('E-')};eq2.push(x)}x.name=clip_(d.name,80)||'Equipment';x.type=clip_(d.type,40);x.hours=num_(d.hours,0);x.svcEveryHours=num_(d.svcEveryHours,0);x.svcEveryDays=num_(d.svcEveryDays,0);x.lastSvcDate=/^\d{4}-\d\d-\d\d$/.test(d.lastSvcDate||'')?d.lastSvcDate:(x.lastSvcDate||ftYmd_(Date.now()));x.lastSvcHours=num_(d.lastSvcHours,x.lastSvcHours||x.hours||0);x.notes=clip_(d.notes,300)}
   save_(eq2,'equipment.json');return S({items:eq2.map(ftEqDue_)})}finally{unlock_(L)}}
 if(d.a=='safetySave'){var it=d.items||{},miss=FT_SAFE.filter(function(k){return !it[k]});if(miss.length)return {ok:false,err:'Check every item before starting work.',missing:miss};var who=ftWho_(d);
  var L3=lock_(8000);if(!L3)return BUSY_;try{var sl=load_('safety.json');sl.push({id:newId_('S-'),who:who,crew:(d.crew||[]).map(function(x){return clip_(x,60)}).slice(0,12),date:ftYmd_(Date.now()),at:new Date().toISOString(),items:FT_SAFE,hazards:clip_(d.hazards,400),job:clip_(d.job,60)});if(sl.length>3000)sl=sl.slice(-3000);save_(sl,'safety.json')}finally{unlock_(L3)}return S({done:true,who:who})}
 if(d.a=='safetyStatus')return S({done:ftSafeDone_(ftWho_(d)),who:ftWho_(d)});
 if(d.a=='safetyReport'){var days=Math.min(31,+d.days||7),sl2=load_('safety.json'),ps=ftPunches_(Date.now()-32*86400000,Date.now()),out=[];for(var i=0;i<days;i++){var k=ftYmd_(Date.now()-i*86400000),wk=[];ps.forEach(function(p){if(ftYmd_(new Date(p.in).getTime())===k&&wk.indexOf(p.who)<0)wk.push(p.who)});
   var done=sl2.filter(function(s){return s.date===k});var people=wk.map(function(w){var kk=clockKey_(w),s=done.filter(function(s){return clockKey_(s.who)===kk||(s.crew||[]).map(clockKey_).indexOf(kk)>=0})[0];return {who:w,ok:!!s,at:s?s.at:''}});
   out.push({day:k,people:people,lists:done.length,ok:people.filter(function(x){return x.ok}).length})}
  var eqd=load_('equipment.json').map(ftEqDue_).filter(function(x){return x.due});return S({days:out,equipmentDue:eqd})}
 if(d.a=='reviewSend'){var jr=findJob_(load_(),d.id);if(!jr)return {ok:false,err:'Job not found'};var rr=ftReview_(jr,false);return rr.ok?S({}):{ok:false,err:rr.err||'Not sent'}}
 if(d.a=='followList'){var now=Date.now(),seen={},fl=[];load_().forEach(function(j){var f=j.finished||(j.status=='invoiced'||j.status=='complete'?j.updated||j.created:'');if(!f)return;var age=(now-new Date(f).getTime())/86400000;if(age<330||age>400)return;var k=customerKey_(j);if(seen[k])return;seen[k]=1;
   fl.push({id:j.id,name:j.name,address:j.address,email:j.email,finished:f,months:Math.round(age/30.4*10)/10,service:(j.items&&j.items[0]&&j.items[0].title)||j.service||'',sent:j.followSent||''})});fl.sort(function(a,b){return a.finished<b.finished?-1:1});return S({items:fl})}
 if(d.a=='followSend'){var ids=Array.isArray(d.ids)?d.ids.slice(0,100):[],n=0,js=load_();ids.forEach(function(id){var j=findJob_(js,id);if(!j||!validEmail(j.email))return;
   var r=ftMail_(j,'Time for your yearly tree check? - '+CO.name,'<p>It’s been about a year since we worked at <b>'+esc_(j.address)+'</b>. Yearly trimming keeps trees healthy and storm-ready, especially before hurricane season.</p><p>Want a free estimate? Reply to this email or call '+CO.phone+'.</p>');if(r.ok){n++;patchJob_(j.id,function(s){s.followSent=new Date().toISOString()})}});return S({sent:n})}
 if(d.a=='stormAdd'){var hz=FT_HAZ[d.hazard]?d.hazard:'yard',L4=lock_(8000);if(!L4)return BUSY_;try{var st=load_('storm.json'),it2={id:newId_('ST-'),at:new Date().toISOString(),name:clip_(d.name,120)||'Unknown caller',phone:clip_(d.phone,40),address:clip_(d.address,300),hazard:hz,prio:FT_HAZ[hz].p,notes:clip_(d.notes,1000),status:'open',by:ftWho_(d)};st.push(it2);save_(st,'storm.json');return S({item:it2,items:ftStormSort_(st)})}finally{unlock_(L4)}}
 if(d.a=='stormList')return S({items:ftStormSort_(load_('storm.json')),storm:!!ftCfg_().storm});
 if(d.a=='stormSet'){var L5=lock_(8000);if(!L5)return BUSY_;try{var st2=load_('storm.json'),s2=st2.filter(function(x){return x.id==d.id})[0];if(!s2)return {ok:false,err:'Not found'};if(/^(open|crew sent|done|dismissed)$/.test(d.status||''))s2.status=d.status;if(d.hazard&&FT_HAZ[d.hazard]){s2.hazard=d.hazard;s2.prio=FT_HAZ[d.hazard].p}s2.updated=new Date().toISOString();save_(st2,'storm.json');return S({items:ftStormSort_(st2)})}finally{unlock_(L5)}}
 if(d.a=='qbExport'){var f0=d.from||'0000',t0=d.to||'9999',inv=[];load_().forEach(function(j){if(!j.invoice||!j.invoice.at)return;var dt=String(j.invoice.at).slice(0,10);if(dt<f0||dt>t0)return;
   inv.push({no:String(j.est||j.id).replace('EST','INV'),date:dt,customer:j.name,email:j.email,address:j.address,amount:num_(j.invoice.amount,total_(j.items)),memo:(j.items||[]).map(function(i){return i.title}).join('; ').slice(0,200),paid:!!j.invoice.paid,paidAt:j.invoice.paidAt?String(j.invoice.paidAt).slice(0,10):'',paidVia:j.invoice.paidVia||'',items:(j.items||[]).map(function(i){return {title:i.title,price:num_(i.price,0)}})})});return S({invoices:inv,qbo:ftStatus_().qbo})}
 return {ok:false,err:'Bad action'}}
function customerKey_(j){var em=String(j.email||'').trim().toLowerCase();return em||(String(j.name||'').toLowerCase()+'|'+String(j.address||'').toLowerCase())}
function ftStormSort_(l){return l.filter(function(x){return x.status!='dismissed'}).sort(function(a,b){var da=a.status=='done'?1:0,db=b.status=='done'?1:0;return da-db||a.prio-b.prio||(a.at<b.at?-1:1)})}
function ftEqDue_(x){var o=JSON.parse(JSON.stringify(x)),why=[];if(x.svcEveryHours){var left=x.svcEveryHours-((x.hours||0)-(x.lastSvcHours||0));o.hoursLeft=Math.round(left*10)/10;if(left<=0)why.push('Service due by hours ('+Math.round(-left)+' h over)');else if(left<=10)why.push('Service soon: '+Math.round(left)+' h left')}
 if(x.svcEveryDays&&x.lastSvcDate){var nd=new Date(x.lastSvcDate+'T12:00:00').getTime()+x.svcEveryDays*86400000,dl=Math.round((nd-Date.now())/86400000);o.nextDate=ftYmd_(nd);o.daysLeft=dl;if(dl<=0)why.push('Service due by date ('+(-dl)+' days over)');else if(dl<=7)why.push('Service soon: '+dl+' days')}
 o.due=why.some(function(w){return /due/.test(w)});o.soon=!o.due&&why.length>0;o.why=why;return o}
// ---------- customer portal ----------
function ftPortal_(j){var v=j.invoice||null,ph=function(l){return (l||[]).filter(function(p){return p&&p.id}).slice(0,24).map(function(p){return {id:p.id,kind:p.kind||'quote'}})};
 return {co:{name:CO.name,phone:CO.phone,email:CO.email},quote:ftQuoteFace_(j),status:j.status,response:j.response?{label:j.response.label,at:j.response.at}:null,sig:j.sig?{name:j.sig.name,label:j.sig.label,at:j.sig.at}:null,
  schedule:ftBooked_(j),photos:ph(j.photos).concat(ph(j.crew)),finished:j.finished||'',
  invoice:v?{no:String(j.est||j.id).replace('EST','INV'),amount:num_(v.amount,total_(j.items)),at:v.at,paid:!!v.paid,paidAt:v.paidAt||'',note:v.note||''}:null,
  payOn:!!ftStripeKey_(),links:{sign:ftLink_('sign.html',j),book:ftLink_('book.html',j),pay:ftLink_('pay.html',j)}}}
// Owner-only demo seeding (made-up data). Only touches the feature files and appends demo jobs.
function ftDemo_(d){var o={};if(d.gps){save_(d.gps,'gps.json');o.gps=d.gps.length}if(d.geo){var g=loadObj_('geo.json');for(var k in d.geo)g[k]=d.geo[k];saveObj_(g,'geo.json');o.geo=1}
 if(d.safety){save_(d.safety,'safety.json');o.safety=d.safety.length}if(d.equipment){save_(d.equipment,'equipment.json');o.eq=d.equipment.length}if(d.storm){save_(d.storm,'storm.json');o.storm=d.storm.length}
 if(d.jobs||d.patch){var L=lock_(15000);if(!L)return BUSY_;try{var js=load_();(d.jobs||[]).forEach(function(j){if(!findJob_(js,j.id)){j.demo=true;js.push(j)}});(d.patch||[]).forEach(function(p){var j=findJob_(js,p.id);if(j)for(var k in p.set)j[k]=p.set[k]});save_(js);o.jobs=js.length}finally{unlock_(L)}}
 return Object.assign({ok:true},o)}

// ---------- Fielder shims (names Miller has that Fielder does not) ----------
var FT_PERM_DEF_={Manager:['quotes','schedule','projects'],Crew:['crew','clock'],Admin:['invoices','hours','employees','projects']};
function ftPunches_(a,b){try{return clockLoad_(clockNames_(a,b)).all}catch(e){return []}}
function ftRateMap_(){var m={};emps_().forEach(function(u){if(u.name&&u.payRate!=null)m[clockKey_(u.name)]=Number(u.payRate)||0});return m}
SMS_TPL.crewway='Hi {first}, {co} here: our crew is on the way to {addr} now. Please make sure gates are open and vehicles are clear. Questions: {phone}';

// ===================== Fielder Field Desk: parity batch 2 (Owner dashboard, Labor compare, Timber, speed) =====================
// Ported from Miller v7 (e99cdbd); only the dashboard, labor and Timber parts (no photo estimates, permits, payroll or COI).
var FT2_ACTS={timber:1,laborDay:1,laborCmp:1,bundle:1,dash:1};
var FT2_NEED={timber:['hours','invoices','schedule'],laborDay:['hours'],laborCmp:['hours'],bundle:[],dash:['__owner']};
function ftAllPunches_(){var n=Date.now();return ftPunches_(n-400*86400000,n+86400000)}
// One bundled read at sign-in: every read the person is allowed, each through the normal permission checks.
function ft2Staff_(d,me){if(!FT2_ACTS[d.a])return null;var r3=ft3Staff_(d,me);if(r3)return r3;var r4=typeof ft4Staff_==='function'?ft4Staff_(d,me):null;if(r4)return r4;var own=me==='Owner',S=function(o){return Object.assign({ok:true},o||{})};
 if(d.a=='bundle'){var R=[],t0=Date.now();FT2_BUNDLE.concat([{a:'laborDay',date:ftYmd_(Date.now())},{a:'laborCmp',period:'day',date:ftYmd_(Date.now()),vs:'jobs',by:'job'}]).forEach(function(b){if(Date.now()-t0>20000)return;var q=Object.assign({},b,{pin:d.pin,who:d.who});if(q.a=='dash'&&!own)return;
   try{var r=featPost_({postData:{contents:JSON.stringify(q)}});if(r&&r.ok!==false)R.push({body:b,res:r})}catch(e){}});return S({items:R,ms:Date.now()-t0})}
 if(d.a=='laborDay')return S(ft2LaborDay_(d.date));
 if(d.a=='laborCmp')return S(ft2LaborCmp_(d));
 if(d.a=='timber'){if(d.data&&!own)return {ok:false,err:'Owner only'};return S(timber_(d))}
 if(d.a=='dash'){if(!own)return {ok:false,err:'Owner only'};return S(ft2Dash_())}
 return null}
function ft2Dash_(){var js=load_().filter(function(j){return !j.archived}),now=Date.now(),today=ftYmd_(now),wk0=clockWeekStart_(now),ps=ftAllPunches_(),rm=ftRateMap_(),bl=load_('blocks.json');
 var on=ps.filter(function(p){return !p.out}),lab=0;ps.forEach(function(p){var s=Math.max(new Date(p.in).getTime(),clockDayStart_(now)),e=p.out?new Date(p.out).getTime():now;if(e>s)lab+=(e-s)/3600000*(rm[clockKey_(p.who)]||0)});
 var inv=js.filter(function(j){return j.invoice&&j.invoice.at}),amt=function(j){return num_(j.invoice.amount,total_(j.items))};
 var unpaid=inv.filter(function(j){return !j.invoice.paid}),paidWk=inv.filter(function(j){return j.invoice.paid&&new Date(j.invoice.paidAt||0).getTime()>=wk0}),invWk=inv.filter(function(j){return new Date(j.invoice.at).getTime()>=wk0});
 var sent=js.filter(function(j){return j.status=='sent'}),appr=js.filter(function(j){return j.status=='approved'}),sched={};bl.forEach(function(b){if(b.job)sched[b.job]=1});
 var next7=[];for(var i=0;i<7;i++){var k=ftYmd_(now+i*86400000);next7.push({day:k,jobs:bl.filter(function(b){return b.date===k&&b.job}).map(function(b){var j=findJob_(js,b.job);return j?j.name:''}).filter(String)})}
 var eqDue=load_('equipment.json').map(ftEqDue_).filter(function(x){return x.due}).map(function(x){return x.name});
 var sl=load_('safety.json').filter(function(s){return s.date===today}),cov={};sl.forEach(function(s){cov[clockKey_(s.who)]=1;(s.crew||[]).forEach(function(c){cov[clockKey_(c)]=1})});var todayPeople={};ps.forEach(function(p){if(ftYmd_(new Date(p.in).getTime())===today)todayPeople[p.who]=1});
 var tp=Object.keys(todayPeople),miss=tp.filter(function(w){return !cov[clockKey_(w)]});
 var perm=js.filter(function(j){return (j.permit&&j.permit.needed&&!/approved|not needed/.test(j.permit.status))||(j.locate&&j.locate.needed&&j.locate.status!='clear'&&j.locate.clear>today)}).map(function(j){return j.name});
 var stumpNo811=appr.filter(function(j){return /stump/i.test(JSON.stringify(j.items||[]))&&!j.locate}).map(function(j){return j.name});
 var c=loadObj_('coi.json'),storm=load_('storm.json').filter(function(x){return x.status=='open'}).length,cfg=ftCfg_();
 var lr={};js.forEach(function(j){var s=j.source||'Unknown';lr[s]=(lr[s]||0)+(/approved|complete|invoiced/.test(j.status)?total_(j.items):0)});var top=Object.keys(lr).sort(function(a,b){return lr[b]-lr[a]})[0]||'';
 var cs=ftCosting_(),mq=cs.reduce(function(a,x){a.q+=x.quoted;a.p+=x.profit;return a},{q:0,p:0});
 var r2=function(v){return Math.round(v*100)/100};
 var m0=Utilities.parseDate(Utilities.formatDate(new Date(now),CLOCK_TZ,'yyyy-MM-01')+' 00:00',CLOCK_TZ,'yyyy-MM-dd HH:mm').getTime(),invMo=inv.filter(function(j){return new Date(j.invoice.at).getTime()>=m0});
 var d90=now-90*86400000,dec=js.filter(function(j){return new Date(j.created||0).getTime()>=d90&&/sent|approved|complete|invoiced|declined/.test(j.status)}),won=dec.filter(function(j){return /approved|complete|invoiced/.test(j.status)});
 var todayJobs=bl.filter(function(b){return b.date===today&&b.job}).map(function(b){var j=findJob_(js,b.job);return j?{id:j.id,name:j.name,start:b.start}:null}).filter(Boolean);
 return {invoicedMonth:r2(invMo.reduce(function(a,j){return a+amt(j)},0)),closeRate:dec.length?Math.round(won.length/dec.length*100):0,closeN:won.length+'/'+dec.length,todayJobs:todayJobs,today:today,onClock:on.map(function(p){return p.who}),laborToday:r2(lab),laborCmp:(function(){try{var c=ft2LaborCmp_({period:'day',vs:'jobs',by:'none'});return c.total}catch(e){return null}})(),unpaid:{count:unpaid.length,total:r2(unpaid.reduce(function(a,j){return a+amt(j)},0))},invoicedWeek:r2(invWk.reduce(function(a,j){return a+amt(j)},0)),paidWeek:r2(paidWk.reduce(function(a,j){return a+amt(j)},0)),
  openQuotes:{count:sent.length,total:r2(sent.reduce(function(a,j){return a+total_(j.items)},0))},toSchedule:appr.filter(function(j){return !sched[j.id]}).map(function(j){return j.name}),approved:{count:appr.length,total:r2(appr.reduce(function(a,j){return a+total_(j.items)},0))},next7:next7,
  equipmentDue:eqDue,safety:{people:tp.length,missing:miss},permits:perm,stumpNo811:stumpNo811,coi:c.fileId?{expires:c.expires,daysLeft:c.expires?Math.round((new Date(c.expires+'T12:00:00')-now)/86400000):null}:null,storm:{on:!!cfg.storm,open:storm},topSource:top,margin:mq.q?Math.round(mq.p/mq.q*1000)/10:0}}

var FT2_BUNDLE=[{a:'fGet'},{a:'dash'},{a:'empList'},{a:'eqList'},{a:'stormList'},{a:'costSummary'},{a:'followList'},{a:'safetyReport',days:7},{a:'gpsMap'},{a:'qnList'}];

// Labor vs jobs for one day: punches x pay rate split across that day's scheduled jobs; revenue = job price / its scheduled days.
function ft2LaborDay_(day){day=/^\d{4}-\d\d-\d\d$/.test(day||'')?day:ftYmd_(Date.now());var tz=CLOCK_TZ,a=Utilities.parseDate(day+' 00:00',tz,'yyyy-MM-dd HH:mm').getTime(),b=a+86400000,now=Date.now();
 var js=load_(),bl=load_('blocks.json'),ps=ftAllPunches_(),rm=ftRateMap_(),days={},today=[];bl.forEach(function(x){if(!x.job)return;(days[x.job]=days[x.job]||{})[x.date]=1;if(x.date===day&&today.indexOf(x.job)<0)today.push(x.job)});
 var J={},un={hours:0,cost:0,people:{}};today.forEach(function(id){J[id]={hours:0,cost:0,people:{}}});
 ps.forEach(function(p){var s=Math.max(new Date(p.in).getTime(),a),e=Math.min(p.out?new Date(p.out).getTime():now,b);if(e<=s)return;var h=(e-s)/3600000,r=rm[clockKey_(p.who)]||0,l=p.job&&J[p.job]?[p.job]:(typeof ftCrewJobs_==='function'?(FT_BLK_=bl,ftCrewJobs_(today,day,p.who)):today);
  if(!l.length){un.hours+=h;un.cost+=h*r;un.people[p.who]=1;return}l.forEach(function(id){var x=J[id];x.hours+=h/l.length;x.cost+=h*r/l.length;x.people[p.who]=1})});
 var r2=function(v){return Math.round(v*100)/100};var rows=today.map(function(id){var j=findJob_(js,id)||{name:'(deleted job)'},nd=Object.keys(days[id]||{}).length||1,price=num_(j.invoice&&j.invoice.amount,total_(j.items)),rev=price/nd,x=J[id];
  return {id:id,name:j.name,address:j.address,dayOf:Object.keys(days[id]).sort().indexOf(day)+1,days:nd,crew:Object.keys(x.people),hours:r2(x.hours),labor:r2(x.cost),revenue:r2(rev),pct:rev?Math.round(x.cost/rev*1000)/10:null}});
 var tl=rows.reduce(function(s,x){return s+x.labor},0)+un.cost,tr=rows.reduce(function(s,x){return s+x.revenue},0);
 return {date:day,jobs:rows,unassigned:{hours:r2(un.hours),labor:r2(un.cost),people:Object.keys(un.people)},total:{labor:r2(tl),revenue:r2(tr),pct:tr?Math.round(tl/tr*1000)/10:null,hours:r2(rows.reduce(function(s,x){return s+x.hours},0)+un.hours)}}}

// ---- Labor compare: labor $ vs any measure, by day/week/month, broken down any way ----
function ft2Range_(period,day){var tz=CLOCK_TZ,d=Utilities.parseDate(day+' 12:00',tz,'yyyy-MM-dd HH:mm'),s,e,lab;
 if(period=='range'&&arguments[2]){var t0=arguments[2],t1=arguments[3]>=t0?arguments[3]:t0;s=Utilities.parseDate(t0+' 12:00',tz,'yyyy-MM-dd HH:mm');e=new Date(Utilities.parseDate(t1+' 12:00',tz,'yyyy-MM-dd HH:mm').getTime()+86400000)}else
 if(period=='week'){var w=Number(Utilities.formatDate(d,tz,'u'))%7;s=new Date(d.getTime()-w*86400000);e=new Date(s.getTime()+7*86400000)}
 else if(period=='month'){var ym=day.slice(0,7);s=Utilities.parseDate(ym+'-01 12:00',tz,'yyyy-MM-dd HH:mm');var m=Number(ym.slice(5)),y=Number(ym.slice(0,4));e=Utilities.parseDate((m==12?(y+1)+'-01':y+'-'+('0'+(m+1)).slice(-2))+'-01 12:00',tz,'yyyy-MM-dd HH:mm')}
 else{s=d;e=new Date(d.getTime()+86400000)}
 var days=[];for(var t=s.getTime();t<e.getTime()-3600000;t+=86400000)days.push(Utilities.formatDate(new Date(t),tz,'yyyy-MM-dd'));
 return {days:days,from:days[0],to:days[days.length-1]}}
function ft2LaborCmp_(d){var period={day:1,week:1,month:1,range:1}[d.period]?d.period:'day',day=/^\d{4}-\d\d-\d\d$/.test(d.date||'')?d.date:ftYmd_(Date.now());
 var vs={jobs:1,invoiced:1,collected:1,quoted:1,hours:1}[d.vs]?d.vs:'jobs',by={none:1,job:1,crew:1,customer:1,source:1,service:1}[d.by]?d.by:'none';
 var R=ft2Range_(period,period=='range'?d.from:day,d.from,d.to),tz=CLOCK_TZ,now=Date.now(),js=load_(),bl=load_('blocks.json'),ps=ftAllPunches_(),rm=ftRateMap_(),sched={},jd={};
 bl.forEach(function(x){if(!x.job||!x.date)return;(jd[x.job]=jd[x.job]||{})[x.date]=1;(sched[x.date]=sched[x.date]||[]);if(sched[x.date].indexOf(x.job)<0)sched[x.date].push(x.job)});
 var U={},perDay={},inR={};R.days.forEach(function(x){inR[x]=1;perDay[x]={labor:0,cmp:0,hours:0}});
 var add=function(job,who,h,c,dy){var k=(job||'')+'|'+who;U[k]=U[k]||{job:job,who:who,h:0,c:0};U[k].h+=h;U[k].c+=c;perDay[dy].labor+=c;perDay[dy].hours+=h};
 R.days.forEach(function(dy){var a=Utilities.parseDate(dy+' 00:00',tz,'yyyy-MM-dd HH:mm').getTime(),b=a+86400000,tj=sched[dy]||[];
  ps.forEach(function(p){var s=Math.max(new Date(p.in).getTime(),a),e=Math.min(p.out?new Date(p.out).getTime():now,b);if(e<=s)return;var h=(e-s)/3600000,r=rm[clockKey_(p.who)]||0,l=p.job&&tj.indexOf(p.job)>=0?[p.job]:(typeof ftCrewJobs_==='function'?ftCrewJobs_(tj,dy,p.who):tj);
   if(!l.length)return add(null,p.who,h,h*r,dy);l.forEach(function(id){add(id,p.who,h/l.length,h*r/l.length,dy)})})});
 var price=function(j){return num_(j.invoice&&j.invoice.amount,total_(j.items))},V={},dayOf=function(t){return t?Utilities.formatDate(new Date(t),tz,'yyyy-MM-dd'):''};
 js.forEach(function(j){var v=0;if(vs=='jobs'){var nd=Object.keys(jd[j.id]||{}).length||1;R.days.forEach(function(dy){if((sched[dy]||[]).indexOf(j.id)>=0){v+=price(j)/nd;perDay[dy].cmp+=price(j)/nd}})}
  else if(vs=='invoiced'){var dd=j.invoice&&dayOf(j.invoice.at);if(dd&&inR[dd]){v=price(j);perDay[dd].cmp+=v}}
  else if(vs=='collected'){var pd=j.invoice&&j.invoice.paid&&dayOf(j.invoice.paidAt||j.invoice.at);if(pd&&inR[pd]){v=price(j);perDay[pd].cmp+=v}}
  else if(vs=='quoted'){var qd=dayOf(j.created);if(qd&&inR[qd]){v=total_(j.items);perDay[qd].cmp+=v}}
  if(v)V[j.id]=v});
 if(vs=='hours')R.days.forEach(function(dy){perDay[dy].cmp=perDay[dy].hours});
 var J={};js.forEach(function(j){J[j.id]=j});
 var gkb=function(by,job,who){var j=job&&J[job];if(by=='none')return 'All';if(by=='crew')return who||'(no labor logged)';if(!job)return 'Unassigned labor';if(!j)return '(deleted job)';
  return by=='job'?j.name:by=='customer'?(j.name||'').trim():by=='source'?(j.source||'Not set'):(j.service||'Other')},gk=function(job,who){return gkb(by,job,who)};
 var fb={job:1,crew:1,customer:1,source:1,service:1}[d.fby]?d.fby:'',fk=String(d.fkey||'');
 if(fb){Object.keys(U).forEach(function(k){if(gkb(fb,U[k].job,U[k].who)!==fk)delete U[k]});if(fb=='crew'){var keep={};Object.keys(U).forEach(function(k){if(U[k].job)keep[U[k].job]=1});Object.keys(V).forEach(function(id){if(!keep[id])delete V[id]})}else Object.keys(V).forEach(function(id){if(gkb(fb,id,'')!==fk)delete V[id]})}
 var G={},g=function(k){return G[k]=G[k]||{key:k,labor:0,hours:0,cmp:0,people:{}}};
 Object.keys(U).forEach(function(k){var u=U[k],x=g(gk(u.job,u.who));if(by=='job'&&u.job)x.id=u.job;x.labor+=u.c;x.hours+=u.h;x.people[u.who]=1;if(vs=='hours')x.cmp+=u.h});
 if(vs!='hours'){var jh={};Object.keys(U).forEach(function(k){var u=U[k];if(u.job)jh[u.job]=(jh[u.job]||0)+u.h});
  Object.keys(V).forEach(function(id){if(by=='crew'){var any=false;Object.keys(U).forEach(function(k){var u=U[k];if(u.job==id&&jh[id]){g(u.who).cmp+=V[id]*u.h/jh[id];any=true}});if(!any)g('(no labor logged)').cmp+=V[id]}else{var y=g(gk(id,''));y.cmp+=V[id];if(by=='job')y.id=id}})}
 var r2=function(v){return Math.round(v*100)/100},pc=function(l,c){return vs!='hours'&&c?Math.round(l/c*1000)/10:null};
 var rows=Object.keys(G).map(function(k){var x=G[k];return {key:k,id:x.id||'',labor:r2(x.labor),hours:r2(x.hours),cmp:r2(x.cmp),pct:pc(x.labor,x.cmp),perHr:x.hours?r2((vs=='hours'?x.labor:x.cmp)/x.hours):null,crew:Object.keys(x.people)}}).sort(function(a,b){return (b.labor+b.cmp)-(a.labor+a.cmp)});
 var T={labor:0,hours:0,cmp:0};rows.forEach(function(x){T.labor+=x.labor;T.hours+=x.hours;T.cmp+=x.cmp});
 var un=0;Object.keys(U).forEach(function(k){if(!U[k].job)un+=U[k].h});
 return {ok:true,fby:fb,fkey:fk,period:period,date:day,from:R.from,to:R.to,vs:vs,by:by,rows:by=='none'?[]:rows,
  series:R.days.map(function(dy){var p=perDay[dy];return {day:dy,labor:r2(p.labor),cmp:r2(p.cmp),hours:r2(p.hours)}}),
  total:{labor:r2(T.labor),hours:r2(T.hours),cmp:r2(T.cmp),pct:pc(T.labor,T.cmp),perHr:T.hours?r2((vs=='hours'?T.labor:T.cmp)/T.hours):null,unassignedHours:r2(un)}}}

// Timber: the Field Desk business assistant. Answers from exact numbers via server-side data functions.
function tbDay_(s){return /^\d{4}-\d\d-\d\d$/.test(s||'')?s:ftYmd_(Date.now())}
function tbIn_(t,from,to){if(!t)return false;var d=Utilities.formatDate(new Date(t),CLOCK_TZ,'yyyy-MM-dd');return d>=from&&d<=to}
function tbJobs_(){return load_().filter(function(j){return !j.archived})}
function tbPrice_(j){return num_(j.invoice&&j.invoice.amount,total_(j.items))}
var TB_FUNCS={
 today:{d:'Today\'s date, weekday and time in Tallahassee (ET).',p:{},f:function(){var n=new Date();return {date:ftYmd_(n.getTime()),weekday:Utilities.formatDate(n,CLOCK_TZ,'EEEE'),time:Utilities.formatDate(n,CLOCK_TZ,'h:mm a')}}},
 labor:{d:'Labor cost and hours between two dates (inclusive), with job $ worked, labor %, and breakdown. by: job, crew, customer, source, service or none.',p:{from:'YYYY-MM-DD',to:'YYYY-MM-DD',by:'job|crew|customer|source|service|none',compare:'jobs|invoiced|collected|quoted|hours'},
  f:function(a){var r=ft2LaborCmp_({period:'range',from:tbDay_(a.from),to:tbDay_(a.to||a.from),vs:a.compare||'jobs',by:a.by||'job'});return {from:r.from,to:r.to,compare:r.vs,total:r.total,rows:(r.rows||[]).slice(0,15)}}},
 revenue:{d:'Revenue between two dates: invoiced $ (by invoice date) and collected $ (by paid date), with the invoices.',p:{from:'YYYY-MM-DD',to:'YYYY-MM-DD'},
  f:function(a){var f=tbDay_(a.from),t=tbDay_(a.to||a.from),inv=[],col=[];tbJobs_().forEach(function(j){if(!j.invoice)return;var v=tbPrice_(j);if(tbIn_(j.invoice.at,f,t))inv.push({customer:j.name,amount:v,paid:!!j.invoice.paid});if(j.invoice.paid&&tbIn_(j.invoice.paidAt||j.invoice.at,f,t))col.push({customer:j.name,amount:v,via:j.invoice.paidVia||''})});
   var s=function(l){return Math.round(l.reduce(function(x,y){return x+y.amount},0)*100)/100};return {from:f,to:t,invoiced:s(inv),invoicedCount:inv.length,collected:s(col),collectedCount:col.length,invoices:inv,payments:col}}},
 quotes:{d:'Quotes created between two dates: count, total $, and each quote with status.',p:{from:'YYYY-MM-DD',to:'YYYY-MM-DD'},
  f:function(a){var f=tbDay_(a.from),t=tbDay_(a.to||a.from),l=tbJobs_().filter(function(j){return tbIn_(j.created,f,t)}).map(function(j){return {customer:j.name,service:j.service||'',total:total_(j.items),status:j.status||'',estimator:j.estimator||j.by||''}});
   return {from:f,to:t,count:l.length,total:Math.round(l.reduce(function(x,y){return x+y.total},0)*100)/100,quotes:l}}},
 jobs:{d:'Jobs, optionally filtered by status (draft, sent, approved, invoiced, declined) and/or scheduled date range.',p:{status:'optional',from:'optional YYYY-MM-DD',to:'optional YYYY-MM-DD'},
  f:function(a){var bl=load_('blocks.json'),l=tbJobs_().filter(function(j){return !j.archived&&(!a.status||String(j.status||'').toLowerCase()==String(a.status).toLowerCase())}).map(function(j){var days=bl.filter(function(b){return b.job==j.id&&b.date}).map(function(b){return b.date}).sort();return {customer:j.name,address:j.address,service:j.service||'',status:j.status||'',price:tbPrice_(j),scheduled:days,source:j.source||''}});
   if(a.from){var f=tbDay_(a.from),t=tbDay_(a.to||a.from);l=l.filter(function(x){return x.scheduled.some(function(d){return d>=f&&d<=t})})}return {count:l.length,jobs:l.slice(0,40)}}},
 onClock:{d:'Who is clocked in right now, since when, and their cost so far.',p:{},f:function(){var rm=ftRateMap_(),now=Date.now();return {people:ftAllPunches_().filter(function(p){return !p.out}).map(function(p){var h=(now-new Date(p.in).getTime())/3600000;return {who:p.who,since:Utilities.formatDate(new Date(p.in),CLOCK_TZ,'h:mm a'),hours:Math.round(h*100)/100,costSoFar:Math.round(h*(rm[clockKey_(p.who)]||0)*100)/100}})}}},
 invoices:{d:'Invoices: unpaid (open, with age in days) or paid.',p:{status:'unpaid|paid|all'},
  f:function(a){var st={paid:1,all:1}[a.status]?a.status:'unpaid',now=Date.now(),l=tbJobs_().filter(function(j){return !j.archived&&j.invoice&&(st=='all'||(st=='paid')==!!j.invoice.paid)}).map(function(j){return {customer:j.name,amount:tbPrice_(j),invoiced:j.invoice.at?ftYmd_(new Date(j.invoice.at).getTime()):'',paid:!!j.invoice.paid,paidAt:j.invoice.paidAt||'',ageDays:j.invoice.at?Math.floor((now-new Date(j.invoice.at).getTime())/864e5):null}});
   return {status:st,count:l.length,total:Math.round(l.reduce(function(x,y){return x+y.amount},0)*100)/100,invoices:l}}},
 topJobs:{d:'Jobs ranked by money between two dates: revenue (invoiced in range, else job $ worked), labor cost, and profit after labor.',p:{from:'YYYY-MM-DD',to:'YYYY-MM-DD'},
  f:function(a){var f=tbDay_(a.from),t=tbDay_(a.to||a.from),lab=ft2LaborCmp_({period:'range',from:f,to:t,vs:'jobs',by:'job'}),L={};(lab.rows||[]).forEach(function(r){if(r.id)L[r.id]=r});
   var l=tbJobs_().map(function(j){var inv=j.invoice&&tbIn_(j.invoice.at,f,t)?tbPrice_(j):0,w=L[j.id]?L[j.id].cmp:0,rev=inv||w,lc=L[j.id]?L[j.id].labor:0;return {customer:j.name,service:j.service||'',revenue:Math.round(rev*100)/100,labor:lc,profitAfterLabor:Math.round((rev-lc)*100)/100,basis:inv?'invoiced':'job $ worked'}}).filter(function(x){return x.revenue||x.labor}).sort(function(x,y){return y.revenue-x.revenue});
   return {from:f,to:t,jobs:l.slice(0,10)}}},
 dashboard:{d:'Snapshot: revenue this week/month, open invoices, quotes waiting, close rate, labor today, alerts.',p:{},f:function(){var d=ft2Dash_();return {invoicedWeek:d.invoicedWeek,paidWeek:d.paidWeek,invoicedMonth:d.invoicedMonth,unpaid:d.unpaid,openQuotes:d.openQuotes,closeRate:d.closeRate,closeN:d.closeN,laborToday:d.laborToday,laborVsJobsToday:d.laborCmp,onClock:d.onClock,todayJobs:d.todayJobs}}}
};
function tbRun_(name,args){var F=TB_FUNCS[name];if(!F)return {error:'unknown function '+name};try{return F.f(args||{})}catch(e){return {error:String(e)}}}
function tbDecl_(){return Object.keys(TB_FUNCS).map(function(k){var F=TB_FUNCS[k],props={};Object.keys(F.p).forEach(function(p){props[p]={type:'STRING',description:F.p[p]}});
 return {name:k,description:F.d,parameters:Object.keys(props).length?{type:'OBJECT',properties:props}:{type:'OBJECT',properties:{}}}})}
function timber_(d){
 if(d.data){var o={};String(d.data).split(',').forEach(function(n){o[n]=tbRun_(n,d.args||{})});return {ok:true,data:o}}
 var key=prop_('GEMINI_API_KEY');if(!key)return {ok:false,setup:true,err:'Timber needs setup. The Owner adds the Gemini key under Settings → Smart features.'};
 FT_DRAFT_=null;FT_OPEN_=null;FT_TBD_=d;var q=String(d.q||'').slice(0,1000);if(!q)return {ok:false,err:'Ask Timber a question.'};
 var hist=(Array.isArray(d.history)?d.history:[]).slice(-12).map(function(h){return {role:h.who=='me'?'user':'model',parts:[{text:String(h.text||'').slice(0,1500)}]}});
 var now=new Date(),sys='You are Timber, the business assistant inside the '+CO.name+' Field Desk app (Tallahassee, FL). Today is '+Utilities.formatDate(now,CLOCK_TZ,'EEEE yyyy-MM-dd h:mm a')+' ET. The person asking is the '+(roleOf_(d)||'user')+'. '+
  'Always get numbers by calling the functions; never guess or invent numbers. Weeks run Sunday to Saturday. "Yesterday" means the calendar day before today. Answer briefly (1-3 short sentences, plain words, no markdown, no tables) and lead with the numbers, in dollars rounded to whole dollars. Your answer may be read aloud. Never call yourself an AI, a model, or a bot; you are Timber.';
 var contents=hist.concat([{role:'user',parts:[{text:q}]}]),used=[];
 for(var i=0;i<6;i++){
  var res=UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/'+VOICE_MODEL+':generateContent?key='+encodeURIComponent(key),{method:'post',contentType:'application/json',muteHttpExceptions:true,
   payload:JSON.stringify({systemInstruction:{parts:[{text:sys}]},contents:contents,tools:[{functionDeclarations:tbDecl_()}],generationConfig:{temperature:0.2}})});
  if(res.getResponseCode()!==200)return {ok:false,err:'Timber could not answer right now ('+res.getResponseCode()+'). Try again in a minute.'};
  var c=JSON.parse(res.getContentText()),parts=(((c.candidates||[])[0]||{}).content||{}).parts||[],calls=parts.filter(function(p){return p.functionCall});
  if(!calls.length){var txt=parts.map(function(p){return p.text||''}).join('').trim().replace(/\bAI\b/g,'').replace(/[*#_`]/g,'');var rr={ok:true,answer:txt||'I could not find that.',used:used};if(typeof FT_DRAFT_!=='undefined'&&FT_DRAFT_&&(roleOf_(d)==='Owner'||roleOf_(d)==='Manager'))rr.draft=FT_DRAFT_;if(typeof FT_OPEN_!=='undefined'&&FT_OPEN_)rr.open=FT_OPEN_;return rr}
  contents.push({role:'model',parts:parts});
  contents.push({role:'user',parts:calls.map(function(p){used.push(p.functionCall.name);return {functionResponse:{name:p.functionCall.name,response:{result:tbRun_(p.functionCall.name,p.functionCall.args)}}}})})}
 return {ok:false,err:'Timber got stuck on that one. Try asking it a simpler way.'}}

// ===================== Fielder Field Desk: parity batch 3 (permits/HOA, 811, lead sources, payroll OT, COI, multi-day jobs) =====================
// Ported from Miller v7 Features2.gs (no photo estimates). COI email goes through mail_() (TEST RUN routing).
var FT3_ACTS={permitSet:1,locateSet:1,permList:1,setSource:1,leadReport:1,payroll:1,coiUpload:1,coiInfo:1,coiSend:1,progNote:1};
var FT3_NEED={permitSet:['quotes','schedule','projects'],locateSet:['quotes','schedule','projects','crew'],permList:['quotes','schedule','projects','crew'],setSource:['quotes','projects'],leadReport:['quotes','projects','invoices'],
 payroll:['hours'],coiUpload:['employees','invoices'],coiInfo:[],coiSend:['quotes','projects','invoices','schedule'],progNote:['crew','projects']};
Object.keys(FT3_ACTS).forEach(function(k){FT2_ACTS[k]=1;FT2_NEED[k]=FT3_NEED[k]});
FT2_BUNDLE.push({a:'coiInfo'},{a:'permList'},{a:'leadReport'});
var LEAD_SRC=['Google','Referral','Facebook','Nextdoor','Yard sign','Truck sign','Repeat customer','Website','Storm call','Other'];
function ft3Staff_(d,me){if(!FT3_ACTS[d.a])return null;var own=me==='Owner',S=function(o){return Object.assign({ok:true},o||{})};
 if(d.a=='permitSet'||d.a=='locateSet'||d.a=='setSource'||d.a=='progNote'){var j=patchJob_(d.id,function(x){
   if(d.a=='permitSet'){var p=d.permit||{};x.permit={needed:!!p.needed,type:/^(City permit|County permit|HOA approval|Both)$/.test(p.type)?p.type:'County permit',status:/^(not started|applied|approved|denied|not needed)$/.test(p.status)?p.status:'not started',number:clip_(p.number,60),contact:clip_(p.contact,120),notes:clip_(p.notes,400),updated:new Date().toISOString(),by:ftWho_(d)}}
   if(d.a=='locateSet'){var l=d.locate||{};var called=/^\d{4}-\d\d-\d\d$/.test(l.called||'')?l.called:ftYmd_(Date.now());x.locate={needed:l.needed!==false,ticket:clip_(l.ticket,40),called:called,clear:ft2Clear_(called),expires:ft2AddDays_(called,28),status:/^(called|clear|conflict|not needed)$/.test(l.status)?l.status:'called',notes:clip_(l.notes,300),by:ftWho_(d)}}
   if(d.a=='setSource')x.source=LEAD_SRC.indexOf(d.source)>=0?d.source:'Other';
   if(d.a=='progNote'){x.progress=x.progress||[];var day=/^\d{4}-\d\d-\d\d$/.test(d.day||'')?d.day:ftYmd_(Date.now());x.progress=x.progress.filter(function(p){return p.day!==day});x.progress.push({day:day,note:clip_(d.note,1000),pct:Math.max(0,Math.min(100,+d.pct||0)),by:ftWho_(d),at:new Date().toISOString()});x.progress.sort(function(a,b){return a.day<b.day?-1:1})}});
  return j?S({job:j}):{ok:false,err:'Job not found or busy. Try again.'}}
 if(d.a=='permList'){var js=load_().filter(function(j){return !j.archived&&/sent|approved|complete/.test(j.status)});return S({items:js.filter(function(j){return j.permit||j.locate||/stump/i.test(JSON.stringify(j.items||[]))}).map(function(j){return {id:j.id,name:j.name,address:j.address,status:j.status,permit:j.permit||null,locate:j.locate||null,stump:/stump/i.test(JSON.stringify(j.items||[])),sched:ftBooked_(j).map(function(b){return b.date})}})})}
 if(d.a=='leadReport'){var m={};load_().filter(function(j){return !j.archived}).forEach(function(j){var s=j.source||'Unknown',x=m[s]=m[s]||{source:s,leads:0,won:0,quoted:0,wonValue:0};x.leads++;var t=total_(j.items);x.quoted+=t;if(/approved|complete|invoiced/.test(j.status)){x.won++;x.wonValue+=num_(j.invoice&&j.invoice.amount,t)}});
  var rows=Object.keys(m).map(function(k){var x=m[k];x.close=x.leads?Math.round(x.won/x.leads*100):0;return x}).sort(function(a,b){return b.wonValue-a.wonValue});return S({rows:rows,sources:LEAD_SRC})}
 if(d.a=='payroll')return S(ft2Payroll_(d.from,d.to));
 if(d.a=='coiInfo'){var c=loadObj_('coi.json');return S({coi:c.fileId?{name:c.name,expires:c.expires,uploaded:c.uploaded,insurer:c.insurer,daysLeft:c.expires?Math.round((new Date(c.expires+'T12:00:00')-Date.now())/86400000):null}:null})}
 if(d.a=='coiUpload'){if(!own&&me!=='Admin')return {ok:false,err:'Only the Owner or Admin can upload the COI.'};var data=String(d.data||'');if(!/^data:application\/pdf;base64,/.test(data)||data.length>12000000)return {ok:false,err:'Pick a PDF under 8 MB.'};
  var fo=root_(),it=fo.getFoldersByName('COI'),cf=it.hasNext()?it.next():fo.createFolder('COI');var f=cf.createFile(Utilities.newBlob(Utilities.base64Decode(data.split(',')[1]),'application/pdf',clip_(d.name,100)||'Certificate of Insurance.pdf'));
  var old=loadObj_('coi.json');saveObj_({fileId:f.getId(),name:f.getName(),expires:/^\d{4}-\d\d-\d\d$/.test(d.expires||'')?d.expires:'',insurer:clip_(d.insurer,120),uploaded:new Date().toISOString(),prev:old.fileId||''},'coi.json');return S({name:f.getName()})}
 if(d.a=='coiSend'){var c2=loadObj_('coi.json');if(!c2.fileId)return {ok:false,err:'Upload the COI first (Owner → Insurance).'};if(!validEmail(d.to))return {ok:false,err:'Enter the email to send it to.'};var jj=d.id?findJob_(load_(),d.id):null;
  var blob=DriveApp.getFileById(c2.fileId).getBlob().setName(CO.name+' - Certificate of Insurance.pdf');
  mail_({to:String(d.to).trim(),replyTo:CO.email,name:CO.name,subject:'Certificate of Insurance - '+CO.name+(jj?' - '+jj.address:''),htmlBody:head_('Certificate of Insurance','','cid:logo')+'<p>Hello'+(d.toName?' '+esc_(d.toName):'')+',</p><p>Attached is our current Certificate of Insurance'+(jj?' for tree work at <b>'+esc_(jj.address)+'</b> ('+esc_(jj.name)+')':'')+'.'+(c2.expires?' It is valid through '+esc_(c2.expires)+'.':'')+'</p>'+(d.note?'<p>'+esc_(clip_(d.note,600))+'</p>':'')+'<p>Questions? Call '+CO.phone+'.</p>'+foot_(),inlineImages:{logo:logoBlob_()},attachments:[blob]});
  if(jj)ftLog_(jj,'coi',{to:String(d.to).trim()});return S({sent:true})}
 return null}
function ft2AddDays_(k,n){return ftYmd_(new Date(k+'T12:00:00').getTime()+n*86400000)}
// Sunshine 811 (FL): wait 2 full business days after the call; digging can start the next business day.
function ft2Clear_(k){var d=new Date(k+'T12:00:00'),n=0;while(n<3){d.setDate(d.getDate()+1);var w=d.getDay();if(w!==0&&w!==6)n++}return ftYmd_(d.getTime())}
function ft2Payroll_(from,to){var tz=CLOCK_TZ,f=from?Utilities.parseDate(from+' 00:00',tz,'yyyy-MM-dd HH:mm').getTime():clockWeekStart_(Date.now())-7*86400000,t=to?Utilities.parseDate(to+' 23:59',tz,'yyyy-MM-dd HH:mm').getTime()+60000:f+7*86400000;
 var ps=ftPunches_(f-86400000,t),rm=ftRateMap_(),now=Date.now(),W={};
 ps.forEach(function(p){var s=new Date(p.in).getTime(),e=p.out?new Date(p.out).getTime():now;s=Math.max(s,f);e=Math.min(e,t);if(e<=s)return;var wk=ftYmd_(clockWeekStart_(s)),k=p.who+'|'+wk,x=W[k]=W[k]||{who:p.who,week:wk,hours:0,open:false};x.hours+=(e-s)/3600000;if(!p.out)x.open=true});
 var rows=Object.keys(W).map(function(k){var x=W[k],r=rm[clockKey_(x.who)]||0,reg=Math.min(40,x.hours),ot=Math.max(0,x.hours-40);return {who:x.who,week:x.week,hours:Math.round(x.hours*100)/100,regular:Math.round(reg*100)/100,overtime:Math.round(ot*100)/100,rate:r,otRate:Math.round(r*1.5*100)/100,regPay:Math.round(reg*r*100)/100,otPay:Math.round(ot*r*1.5*100)/100,gross:Math.round((reg*r+ot*r*1.5)*100)/100,open:x.open,noRate:!r}}).sort(function(a,b){return a.week<b.week?-1:a.week>b.week?1:a.who.localeCompare(b.who)});
 return {from:ftYmd_(f),to:ftYmd_(t-60000),rows:rows,total:rows.reduce(function(a,x){a.hours+=x.hours;a.overtime+=x.overtime;a.gross+=x.gross;return a},{hours:0,overtime:0,gross:0})}}

// ===================== Fielder Field Desk: batch 4 (won quote -> job, crew assignment) =====================
// A quote that is accepted (customer link, staff, or bulk status) becomes a job exactly once: jobNo is set on the same
// record, linked to the quote number, and lands Unscheduled. Assigned crew live on schedule blocks (block.crew) and on the job (job.assigned).
function ftWon_(j){if(j.status!=='approved'&&j.status!=='complete'&&j.status!=='invoiced')return;if(j.jobNo)return;
 var est=String(j.est||'');j.jobNo=/EST/.test(est)?est.replace('EST','JOB'):'FT-JOB-'+String(j.id||'');j.quoteEst=est;j.wonAt=new Date().toISOString();j.jobStatus='unscheduled';}
function ftCrewList_(c){var names={};try{(JSON.parse(prop_('EMPLOYEES_JSON')||'[]')||[]).forEach(function(e){if(e&&e.name)names[String(e.name).trim().toLowerCase()]=String(e.name).trim()})}catch(e){}
 return (Array.isArray(c)?c:[]).map(function(x){return String(x||'').trim()}).filter(function(x){return x&&x.length<=80}).map(function(x){return names[x.toLowerCase()]||x}).filter(function(x,i,a){return a.indexOf(x)===i}).slice(0,20)}
// job.assigned = everyone on any of the job's blocks; jobStatus moves Unscheduled -> Scheduled once a block exists.
function ftAssignSync_(bl){FT_BLK_=null;try{var by={};bl.forEach(function(b){if(!b.job)return;var x=by[b.job]=by[b.job]||{crew:[],n:0};x.n++;(b.crew||[]).forEach(function(c){if(x.crew.indexOf(c)<0)x.crew.push(c)})});
 var L=lock_(20000);if(!L)return;try{var js=load_(),ch=false;js.forEach(function(j){var x=by[j.id];var a=x?x.crew:[];if(JSON.stringify(j.assigned||[])!==JSON.stringify(a)){j.assigned=a;ch=true}
   if(j.jobNo){var st=x&&x.n?'scheduled':'unscheduled';if(j.status==='approved'&&j.jobStatus!==st){j.jobStatus=st;ch=true}}});if(ch)save_(js)}finally{L.releaseLock()}}catch(e){}}
// Labor split: a person's hours on a day go to the jobs they are assigned to that day; else across all that day's jobs.
var FT_BLK_=null;function ftCrewJobs_(tj,dy,who){if(!tj.length)return tj;if(!FT_BLK_)FT_BLK_=load_('blocks.json');var k=clockKey_(who);
 var mine=FT_BLK_.filter(function(b){return b.date===dy&&tj.indexOf(b.job)>=0&&(b.crew||[]).some(function(c){return clockKey_(c)===k})}).map(function(b){return b.job}).filter(function(x,i,a){return a.indexOf(x)===i});
 return mine.length?mine:tj}
// assign: {id, crew:[names], date?} sets the crew on that job's blocks (that date, else today and later); Owner/Estimator/Admin.
FT2_ACTS.assign=1;FT2_NEED.assign=['schedule','projects'];
function ft4Staff_(d,me){if(d.a!=='assign')return null;if(me==='Crew')return {ok:false,err:'Only the Owner, Estimator or Admin can assign crew.'};
 var crew=ftCrewList_(d.crew),bl=load_('blocks.json'),td=ftYmd_(Date.now()),n=0;bl.forEach(function(b){if(b.job!=d.id)return;if(d.date?b.date===d.date:b.date>=td){b.crew=crew;n++}});
 if(!n){var j0=findJob_(load_(),d.id);if(!j0)return {ok:false,err:'Job not found'}}save_(bl,'blocks.json');ftAssignSync_(bl);return {ok:true,blocks:bl,changed:n,job:findJob_(load_(),d.id)}}
// Timber: start a quote draft (nothing is saved or sent; the app opens it on the quote screen for review and Send).
var FT_DRAFT_=null;
TB_FUNCS.draftQuote={d:'Start a NEW quote/estimate draft for a customer when asked to create, write or make an estimate or quote. Nothing is saved or sent; the app opens the draft for review. items: one line per item as "title | price", e.g. "Cut down pines | 1400".',
 p:{name:'customer full name',email:'customer email, if given',phone:'customer phone, if given',address:'job address, if given',items:'line items, one per line: title | price'},
 f:function(a){var it=String(a.items||'').split(/\n|;/).map(function(l){var m=l.split('|');var t=String(m[0]||'').trim(),pr=Number(String(m[1]||'').replace(/[^\d.]/g,''));return t?{title:t.slice(0,200),detail:'',price:isFinite(pr)?Math.round(pr*100)/100:0}:null}).filter(Boolean).slice(0,20);
  FT_DRAFT_={name:String(a.name||'').trim().slice(0,120),email:String(a.email||'').trim().slice(0,120),phone:String(a.phone||'').trim().slice(0,40),address:String(a.address||'').trim().slice(0,200),items:it};
  return {ok:true,draft:FT_DRAFT_,note:'The draft is open for review. Tell the person to check it and tap Send. Do not say it was sent.'}}};
// ===== Timber actions (Miller 7997e81): every action re-enters the normal request pipeline with the asker's own PIN,
// so the same role/permission checks apply. Quotes are drafts (open for review, Send on tap); archive asks first.
// TEST RUN: emails go through mail_() -> the test inbox. Reply carries open:{id,label} or draft for the app.
var FT_TBD_=null,FT_OPEN_=null;
function tbSub_(a,o){var base={};Object.keys(FT_TBD_||{}).forEach(function(k){if(k!=='q'&&k!=='history'&&k!=='data'&&k!=='args')base[k]=FT_TBD_[k]});
 var r=featPost_({postData:{contents:JSON.stringify(Object.assign(base,o||{},{a:a}))}});return r&&typeof r.getContent==='function'?JSON.parse(r.getContent()):r}
function tbJob_(q,acc){q=String(q||'').trim().toLowerCase();if(!q)return {err:'Which customer or job?'};var js=load_().filter(function(j){return !j.archived&&(!acc||/approved|complete|invoiced/.test(j.status))});
 var ex=js.filter(function(j){return String(j.name||'').toLowerCase()===q||String(j.est||'').toLowerCase()===q||String(j.jobNo||'').toLowerCase()===q});
 var m=ex.length?ex:js.filter(function(j){return String(j.name||'').toLowerCase().indexOf(q)>=0||String(j.address||'').toLowerCase().indexOf(q)>=0});
 if(!m.length)return {err:'No job matches "'+q+'".'};if(m.length>1&&!ex.length){var nm={};m.forEach(function(j){nm[j.name]=1});if(Object.keys(nm).length>1)return {err:'More than one match: '+Object.keys(nm).slice(0,5).join(', ')+'. Which one?'}}
 m.sort(function(a,b){return String(b.created||'').localeCompare(String(a.created||''))});return {job:m[0]}}
function tbNames_(s){return String(s||'').split(/\s*(?:,|\band\b|&)\s*/i).map(function(x){return x.trim()}).filter(Boolean)}
function tbDo_(acc,fn){return function(a){var f=tbJob_(a.customer,acc);if(f.err)return {ok:false,error:f.err};var r=fn(f.job,a);if(r&&r.ok!==false)FT_OPEN_={id:f.job.id,label:'Open '+f.job.name};return r}}
var TBD_='Runs right away. ';
TB_FUNCS.createQuote=TB_FUNCS.draftQuote;
TB_FUNCS.setQuoteStatus={d:TBD_+'Mark a quote approved/accepted (it becomes a job), declined, or sent.',p:{customer:'customer name',status:'approved, declined or sent'},
 f:tbDo_(false,function(j,a){var s=/accept|approv|won/i.test(a.status)?'approved':/declin|lost|reject/i.test(a.status)?'declined':'sent';var r=tbSub_('setStatus',{status:s,ids:[j.id]});return r.ok?{ok:true,done:j.name+' marked '+s}:{ok:false,error:r.err}})};
TB_FUNCS.scheduleJob={d:TBD_+'Schedule or reschedule a job (replaces its existing schedule). date YYYY-MM-DD, start/end HH:MM 24h (default 08:00-17:00), optional crew names.',p:{customer:'customer name',date:'YYYY-MM-DD',start:'HH:MM',end:'HH:MM',crew:'crew names, comma separated (optional)'},
 f:tbDo_(true,function(j,a){if(!/^\d{4}-\d\d-\d\d$/.test(a.date||''))return {ok:false,error:'Which date?'};var bl=load_('blocks.json').filter(function(b){return b.job==j.id}),crew=a.crew?tbNames_(a.crew):((bl[0]||{}).crew||[]);
  bl.forEach(function(b){tbSub_('unblock',{block:{id:b.id}})});var r=tbSub_('block',{block:{id:'',date:a.date,start:/^\d\d:\d\d$/.test(a.start||'')?a.start:'08:00',end:/^\d\d:\d\d$/.test(a.end||'')?a.end:'17:00',job:j.id,note:'',crew:crew}});
  return r.ok?{ok:true,done:j.name+' scheduled '+a.date+(crew.length?' with '+crew.join(', '):'')}:{ok:false,error:r.err}})};
TB_FUNCS.assignCrew={d:TBD_+'Assign crew people to a job (sets the crew on its scheduled days).',p:{customer:'customer name',crew:'crew names, comma separated'},
 f:tbDo_(true,function(j,a){var r=tbSub_('assign',{id:j.id,crew:tbNames_(a.crew)});return r.ok?{ok:true,done:'Assigned '+tbNames_(a.crew).join(', ')+' to '+j.name+(r.changed?'':' (not scheduled yet)')}:{ok:false,error:r.err}})};
TB_FUNCS.completeJob={d:TBD_+'Mark a job complete; emails the customer the job recap.',p:{customer:'customer name',notes:'crew notes (optional)'},
 f:tbDo_(true,function(j,a){var r=tbSub_('finish',{id:j.id,notes:String(a.notes||'')});return r.ok?{ok:true,done:j.name+' marked complete and recap sent'}:{ok:false,error:r.err}})};
TB_FUNCS.sendRecap={d:TBD_+'Email the job recap to the customer again.',p:{customer:'customer name'},
 f:tbDo_(true,function(j){var rl=roleOf_(FT_TBD_);if(rl!=='Owner'&&rl!=='Manager')return {ok:false,error:'That PIN cannot send recaps.'};try{sendRecap_(j)}catch(e){return {ok:false,error:String(e.message||e)}}return {ok:true,done:'Recap sent for '+j.name}})};
TB_FUNCS.invoice={d:TBD_+'Create and email an invoice for a job. amount like $1200 (default: the job total).',p:{customer:'customer name',amount:'amount (optional)',note:'invoice note (optional)'},
 f:tbDo_(true,function(j,a){var n=Number(String(a.amount||'').replace(/[^\d.]/g,''))||Number(j.total)||(j.items||[]).reduce(function(s,i){return s+(Number(i.price)||0)},0);var r=tbSub_('invoice',{id:j.id,amount:'$'+n.toFixed(2),note:String(a.note||'')});return r.ok?{ok:true,done:'Invoice for $'+n.toFixed(2)+' sent to '+j.name}:{ok:false,error:r.err}})};
TB_FUNCS.markPaid={d:TBD_+'Mark a job\'s invoice Paid, or back to Open (unpaid).',p:{customer:'customer name',paid:'yes for Paid, no for Open'},
 f:tbDo_(true,function(j,a){var p=!/^(no|open|unpaid|false)/i.test(String(a.paid||'yes'));var r=tbSub_('paid',{id:j.id,paid:p});return r.ok?{ok:true,done:j.name+' marked '+(p?'Paid':'Open')}:{ok:false,error:r.err}})};
TB_FUNCS.addCustomer={d:TBD_+'Add a customer to the customer list.',p:{name:'full name',email:'email (optional)',phone:'phone (optional)',address:'address (optional)'},
 f:function(a){if(!a.name)return {ok:false,error:'What is the customer\'s name?'};var r=tbSub_('importCustomers',{rows:[{name:a.name,email:a.email||'',phone:a.phone||'',address:a.address||''}]});return r.ok?{ok:true,done:(r.added?'Added ':'Already have ')+a.name}:{ok:false,error:r.err}}};
TB_FUNCS.addNote={d:TBD_+'Add an internal note to a job (not shown to the customer).',p:{customer:'customer name',note:'the note'},
 f:tbDo_(false,function(j,a){var rl=roleOf_(FT_TBD_);if(rl!=='Owner'&&rl!=='Manager')return {ok:false,error:'That PIN cannot add notes.'};var t=String(a.note||'').trim();if(!t)return {ok:false,error:'What should the note say?'};
  var L=lock_(20000);if(!L)return {ok:false,error:'Busy, try again.'};try{var js=load_(),x=findJob_(js,j.id);x.internalNotes=clip_((x.internalNotes?x.internalNotes+'\n':'')+t,4000);save_(js)}finally{L.releaseLock()}return {ok:true,done:'Note added to '+j.name}})};
TB_FUNCS.clockPerson={d:TBD_+'Clock a person in or out (Owner).',p:{who:'person name',action:'in or out'},
 f:function(a){var out=/out/i.test(a.action||'');var r=tbSub_(out?'clockOut':'clockIn',{forWho:String(a.who||'')});return r.ok?{ok:true,done:a.who+' clocked '+(out?'out':'in')}:{ok:false,error:r.err}}};
TB_FUNCS.changeSettings={d:TBD_+'Change settings: follow-up discount percent (1-50), quote email subject, body, sign-off, theme (classic or dark). Only give what changes.',p:{discountPct:'number (optional)',quoteSubject:'(optional)',quoteBody:'(optional)',quoteSign:'(optional)',theme:'classic or dark (optional)'},
 f:function(a){var s=settings_(),o={quoteBody:s.quoteBody,quoteSubject:s.quoteSubject,quoteSign:s.quoteSign,theme:s.theme,discountPct:s.discountPct};['quoteBody','quoteSubject','quoteSign','theme','discountPct'].forEach(function(k){if(a[k]!=null&&String(a[k]).trim()!=='')o[k]=a[k]});
  var r=tbSub_('settings',o);return r.ok?{ok:true,done:'Settings saved'}:{ok:false,error:r.err}}};
TB_FUNCS.archiveJob={d:'Archive (remove) a job. ALWAYS ask the person "Archive NAME? Say yes to confirm." first and only call with confirmed=yes after they say yes.',p:{customer:'customer name',confirmed:'yes only after the person confirmed'},
 f:tbDo_(false,function(j,a){if(!/^yes$/i.test(String(a.confirmed||'').trim()))return {ok:false,needConfirm:true,error:'Ask: Archive '+j.name+'? Say yes to confirm.'};var r=tbSub_('archive',{id:j.id});return r.ok?{ok:true,done:j.name+' archived'}:{ok:false,error:r.err}})};
