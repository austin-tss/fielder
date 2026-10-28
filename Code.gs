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
// Role PINs come from Script Properties PIN_MANAGER / PIN_CREW / PIN_ADMIN, falling back to the original values.
function pins_(){var p=PropertiesService.getScriptProperties();return {Manager:String(p.getProperty('PIN_MANAGER')||'1234'),Crew:String(p.getProperty('PIN_CREW')||'0123'),Admin:String(p.getProperty('PIN_ADMIN')||'6789')};}
function roleOf_(d){var p=String(d&&d.pin||''),m=pins_();if(!p)return '';for(var r in m)if(m[r]===p)return r;return '';}
var FORM_PIN_=null;
function pinOk_(d){return !!roleOf_(d);}
var ROLE_CAN_={Crew:{upload:1,finish:1,smsOnWay:1,feedback:1},Admin:{invoice:1,paid:1,iedit:1,feedback:1}};
function can_(r,a){if(r==='Manager')return true;return !!(ROLE_CAN_[r]&&ROLE_CAN_[r][a]);}
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
  var BUILTIN_IDS = ['name', 'address', 'email', 'phone', 'service', 'species', 'timing', 'access', 'photos', 'quote', 'addl', 'inote'];

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
      var customer = lock ? false : (typeof f.customer === 'boolean' ? f.customer : custDefault);
      fields.push({
        id: id,
        label: cleanName(f.label || (builtin && builtin.label) || 'Field', 80) || 'Field',
        kind: kind,
        show: lock ? true : f.show === false ? false : true,
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
    form.fields.forEach(function (f) {
      if (f.show === false) return;
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
      return '<div class="line" data-field-row="' + esc(f.id) + '"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-fld="' + i + '" data-k="show" ' + (f.show !== false ? 'checked' : '') + (f.lock ? ' disabled' : '') + '> Show</label>' +
        '<input data-fld="' + i + '" data-k="label" value="' + esc(f.label) + '">' +
        '<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-fld="' + i + '" data-k="customer" ' + (f.customer ? 'checked' : '') + (f.lock ? ' disabled' : '') + '> Customer sees this</label>' +
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
function settings_(){var o={};try{o=loadObj_('settings.json')}catch(e){o={}}var form;try{form=FDForm.normalizeForm(o.form)}catch(e2){form=FDForm.normalizeForm(null)}return {form:form,quoteBody:String(o.quoteBody||''),quoteSubject:String(o.quoteSubject||''),quoteSign:String(o.quoteSign||''),theme:o.theme==='dark'?'dark':'classic'}}
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
  '<div style="background:#f6f8f2;border-radius:10px;padding:16px;margin:20px 0"><p style="margin:0 0 4px;font-size:16px"><b style="color:'+NAVY+'">Ready to move forward? Tap one:</b></p><p style="margin:0 0 6px;color:#5b6168;font-size:13px">You will be asked for your preferred time window next.</p>'+
  btn('A','A) Approve &mdash; schedule my job',GREEN)+btn('B','B) Approve with changes',DG)+btn('C','C) Decline for now','#8a8f98')+btn('O','Other &mdash; send a question',NAVY)+'</div>'+
  '<p style="font-size:13px;color:#5b6168;line-height:1.6"><b>Terms:</b> '+TERMS.join(' ')+'</p>'+signHtml_(copy.sign)+foot_();}
function pdfHtml_(j){return '<html><head><style>@page{margin:28px}body{font-family:Arial,Helvetica,sans-serif}</style></head><body>'+head_('Estimate',j.est,LOGO)+meta_(j,'Estimate #',j.est)+custBlock_(j)+itemsTable_(j)+
  '<h3 style="color:'+NAVY+';margin:22px 0 6px;font-size:15px">Terms &amp; Conditions</h3><ul style="font-size:13px;color:#33383d;line-height:1.6;padding-left:18px">'+TERMS.map(function(t){return '<li>'+t+'</li>'}).join('')+'</ul>'+
  '<p style="font-size:13px">To approve, use the buttons in the estimate email or call '+CO.phone+'.</p><table width="100%" style="margin-top:28px;font-size:13px"><tr><td>Customer signature: ____________________________</td><td style="text-align:right">Date: ______________</td></tr></table>'+foot_()+'</body></html>';}
function makePdf_(j){var b=Utilities.newBlob(pdfHtml_(j),'text/html','e.html').getAs('application/pdf').setName('Fielder Estimate '+j.est+'.pdf');
  var f=folder_(j).createFile(b);j.pdf=f.getUrl();j.pdfId=f.getId();return b;}
function mustEmail_(j){if(!validEmail(j.email))throw new Error('Customer email is missing or invalid: "'+(j.email||'')+'". Fix it on the job before sending.');}
function sendQuote_(j){mustEmail_(j);var im=imgs_(j.photos,'q');im.inl.logo=logoBlob_();var pdf=makePdf_(j);
  MailApp.sendEmail({to:j.email,replyTo:CO.email,name:CO.name,subject:FDForm.quoteCopy(settings_(),j).subject,htmlBody:quoteHtml_(j,im.h,'cid:logo',function(k){return respUrl_(j,k)}),inlineImages:im.inl,attachments:[pdf]});}
function recapHtml_(j,bh,ah,logoSrc){var r=j.response||{},av=availText_(r);
  var REFER='<a href="mailto:?subject='+encodeURIComponent('Tree service I recommend: Fielder Tree Service')+'&body='+encodeURIComponent('I used Fielder Tree Service in Tallahassee and was really happy with the work. Free estimates: https://fieldertree.com/contact-us/ or (850) 656-8737')+'" style="display:block;padding:15px;background:'+GREEN+';color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;text-align:center;font-size:16px">Refer a neighbor</a>';
  return head_("Here's what we did",j.est,logoSrc)+'<p style="font-size:16px">Hi '+esc_(j.name)+',</p><p style="line-height:1.6">Your job at '+esc_(j.address)+' is complete. Here is a quick look at the work.</p>'+itemsTable_(j)+custBlock_(j)+
  (av?'<p><b style="color:'+NAVY+'">Scheduled per your preference:</b> '+esc_(av)+'</p>':'')+(j.crewNotes?'<p><b style="color:'+NAVY+'">Crew notes:</b> '+esc_(j.crewNotes)+'</p>':'')+
  '<h3 style="color:'+DG+'">Before</h3>'+(bh||'<p style="color:#8a8f98">No photos</p>')+'<h3 style="color:'+DG+'">After</h3>'+(ah||'<p style="color:#8a8f98">No photos</p>')+
  '<p style="line-height:1.6">Thank you for choosing Fielder Tree Service. If you were happy with our work, we would be grateful if you passed our name along.</p>'+REFER+foot_();}
function sendRecap_(j){mustEmail_(j);var ib=imgs_(j.crew.filter(function(p){return p.kind=='before'}),'b'),ia=imgs_(j.crew.filter(function(p){return p.kind=='after'}),'a'),inl={logo:logoBlob_()},k;
  for(k in ib.inl)inl[k]=ib.inl[k];for(k in ia.inl)inl[k]=ia.inl[k];
  MailApp.sendEmail({to:j.email,replyTo:CO.email,name:CO.name,subject:"Here's what we did - Fielder Tree Service",htmlBody:recapHtml_(j,ib.h,ia.h,'cid:logo'),inlineImages:inl});}
function invoiceHtml_(j,logoSrc){var v=j.invoice,inv=String(j.est||j.id).replace('EST','INV');
  return head_('Invoice',inv,logoSrc)+'<p style="font-size:16px">Dear '+esc_(j.name)+',</p><p>Thank you for your business. Here is your invoice for the completed work.</p>'+meta_(j,'Invoice #',inv)+custBlock_(j)+itemsTable_(j)+
  '<p style="font-size:18px;text-align:right"><b>Amount due: <span style="color:'+DG+'">'+esc_(v.amount)+'</span></b></p>'+(v.note?'<p>'+esc_(v.note)+'</p>':'')+'<p>Questions? Call '+CO.phone+' or email '+CO.email+'.</p>'+foot_();}
function sendInvoice_(j){mustEmail_(j);MailApp.sendEmail({to:j.email,replyTo:CO.email,name:CO.name,subject:'Invoice from Fielder Tree Service - '+j.invoice.amount,htmlBody:invoiceHtml_(j,'cid:logo'),inlineImages:{logo:logoBlob_()}});}
var LABELS={A:'Approved',B:'Approved with changes',C:'Declined',O:'Question / other'};
var SLOTS=['Weekdays 8-12','Weekdays 12-5','Weekends','Anytime'];
function respond_(j,p){j.response={ans:p.ans,label:LABELS[p.ans]||p.ans,text:p.text||'',avail:p.avail||'',when:p.when||'',at:new Date().toISOString()};
  j.status=(p.ans=='A'||p.ans=='B')?'approved':(p.ans=='C'?'declined':'reply');}
function page_(b){return HtmlService.createHtmlOutput('<meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#f4f6f1;font-family:Arial,sans-serif;color:#231f20}.w{max-width:520px;margin:0 auto;padding:18px}h2{color:'+NAVY+'}.s{display:block;width:100%;margin:8px 0;padding:18px;font-size:19px;font-weight:bold;border:3px solid '+NAVY+';background:#fff;color:'+NAVY+';border-radius:12px;text-align:center;cursor:pointer}input[type=radio]{display:none}input[type=radio]:checked+.s{background:'+GREEN+';border-color:'+GREEN+';color:#fff}textarea,input[type=text]{width:100%;box-sizing:border-box;font-size:17px;padding:14px;border:2px solid #cfd6c4;border-radius:10px}.go{width:100%;padding:20px;font-size:21px;font-weight:bold;background:'+GREEN+';color:#fff;border:0;border-radius:12px;margin-top:14px}</style><div style="background:'+NAVY+';color:#fff;padding:14px 18px;font-weight:bold;font-size:18px">'+CO.name+'</div><div class="w">'+b+'</div>').setTitle('Fielder Tree Service').addMetaTag('viewport','width=device-width,initial-scale=1');}
function respForm_(j,ans){var slots=SLOTS.map(function(s,i){return '<input type=radio name=avail id=s'+i+' value="'+s+'"'+(i==3?' checked':'')+'><label class=s for=s'+i+'>'+s+'</label>'}).join('');
  return page_('<h2>'+esc_(LABELS[ans])+'</h2><p>Estimate '+esc_(j.est||j.id)+' &middot; '+esc_(j.address)+'</p>'+custBlock_(j)+'<form method=get action="'+ScriptApp.getService().getUrl()+'" target="_top"><input type=hidden name=a value=respond><input type=hidden name=id value="'+esc_(j.id)+'"><input type=hidden name=ans value="'+ans+'"><input type=hidden name=done value=1>'+
   (ans=='B'||ans=='O'?'<p><b>'+(ans=='B'?'What would you like changed?':'Your question or message:')+'</b></p><textarea name=text rows=4></textarea>':'')+
   '<p><b>When works best for the work?</b> Tap one:</p>'+slots+'<p><b>Preferred date or time (optional)</b></p><input type=text name=when placeholder="e.g. Tuesday Nov 3 morning">'+
   '<button class=go>Send my answer</button></form>');}
function doGet(e){var p=e.parameter||{};
  if(p.a=='img'){var fi;try{fi=DriveApp.getFileById(p.id)}catch(x){return out_({ok:false,err:'Not found'})}if(!inRoot_(fi))return out_({ok:false,err:'Not found'});var b=fi.getBlob();return out_({ok:true,data:'data:'+b.getContentType()+';base64,'+Utilities.base64Encode(b.getBytes())});}
  if(p.a=='respond'){var js=load_(),j=js.filter(function(x){return x.id==p.id})[0];if(!j)return page_('<h2>Estimate not found</h2><p>Please call '+CO.phone+'.</p>');
    if(p.ans!='C'&&!p.done)return respForm_(j,p.ans);
    var L=LockService.getScriptLock();L.waitLock(20000);
    try{js=load_();j=js.filter(function(x){return x.id==p.id})[0];respond_(j,p);save_(js);}finally{L.releaseLock();}
    var av=availText_(j.response);
    return page_('<h2 style="color:'+DG+'">Thank you!</h2><p style="font-size:17px">Your answer was received: <b>'+esc_(j.response.label)+'</b></p>'+(av?'<p>Preferred time: <b>'+esc_(av)+'</b></p>':'')+(j.response.text?'<p>Your note: '+esc_(j.response.text)+'</p>':'')+'<p>We will be in touch shortly to confirm. Questions? Call '+CO.phone+'.</p>');}
  if(!pinOk_(p))return out_({ok:false,err:'PIN required'});
  return out_({ok:true,root:root_().getUrl(),jobs:load_(),blocks:load_('blocks.json'),settings:settings_()});}
function doPost(e){var d=JSON.parse(e.postData.contents),L=LockService.getScriptLock();L.waitLock(30000);var j,send=null,js;
  try{
    if(d.a=='login'){var lr=roleOf_(d);return out_(lr?{ok:true,role:lr}:{ok:false,err:'Wrong PIN'});}
    var me=roleOf_(d);if(!me)return out_({ok:false,err:'PIN required'});if(!can_(me,d.a))return out_({ok:false,err:'Your role cannot do that.'});
    var v5=v5Api_(d);if(v5)return out_(v5);
    if(d.a=='settings'){if(roleOf_(d)!=='Manager')return out_({ok:false,err:'That PIN cannot change the quote form.'});var curS=loadObj_('settings.json');if(d.form)curS.form=FDForm.normalizeForm(d.form);curS.quoteBody=clip_(d.quoteBody,4000);curS.quoteSubject=clip_(d.quoteSubject,300);curS.quoteSign=clip_(d.quoteSign,800);if(d.theme==='classic'||d.theme==='dark')curS.theme=d.theme;saveObj_(curS,'settings.json');return out_({ok:true,settings:settings_()})}
    if(d.a=='feedback'){if(!pinOk_(d))return out_({ok:false,err:'That PIN cannot send feedback.'});var fbText=clip_(d.text,4000);if(!fbText)return out_({ok:false,err:'Write a note first.'});var fb=[];try{fb=load_('feedback.json')}catch(eFb){fb=[]}if(!Array.isArray(fb))fb=[];fb.push({at:new Date().toISOString(),role:clip_(d.role,40),text:fbText});if(fb.length>500)fb=fb.slice(fb.length-500);save_(fb,'feedback.json');return out_({ok:true})}
    if(d.a=='cedit'){if(!pinOk_(d))return out_({ok:false,err:'That PIN cannot edit customers.'});if(d.email&&!validEmail(d.email))return out_({ok:false,err:'That email does not look right.'});var ids=d.ids||[],cjs=load_();cjs.forEach(function(x){if(ids.indexOf(x.id)<0)return;x.name=clip_(d.name,200);x.phone=clip_(d.phone,40);x.email=clip_(d.email,200);x.address=clip_(d.address,300);x.phone2=clip_(d.phone2,40);x.contact2=clip_(d.contact2,120)});save_(cjs);return out_({ok:true})}
    js=load_();
    if(d.a=='block'||d.a=='unblock'){var bl=load_('blocks.json');bl=bl.filter(function(b){return b.id!=d.block.id});
      if(d.a=='block'){if(!d.block.id)d.block.id='B'+Date.now().toString(36);bl.push(d.block);}save_(bl,'blocks.json');return out_({ok:true,blocks:bl});}
    if(d.a=='create'){if(!validEmail(d.email))return out_({ok:false,err:'Enter a valid customer email before sending.'});
      var items=(d.items&&d.items.length)?d.items:rewriteQuote(d.quote);
      j={id:'FT-'+Date.now().toString(36).toUpperCase(),est:estNo_(),name:d.name,address:d.address,email:String(d.email).trim(),quote:d.quote,items:items,total:num_(d.total,total_(items)),notes:d.notes||'',status:'sent',created:new Date().toISOString(),crew:[]};formFields_(j,d);
      j.photos=savePhotos_(j,d.photos,'quote');js.unshift(j);send=sendQuote_;}
    else{j=js.filter(function(x){return x.id==d.id})[0];if(!j)return out_({ok:false,err:'Job not found'});
      if(d.a=='upload'){j.crew=j.crew.concat(savePhotos_(j,d.photos,d.kind));}
      else if(d.a=='finish'){mustEmail_(j);j.crewNotes=d.notes||'';j.status='complete';j.finished=new Date().toISOString();send=sendRecap_;}
      else if(d.a=='invoice'){mustEmail_(j);j.invoice={amount:d.amount,note:d.note||'',at:new Date().toISOString()};j.status='invoiced';send=sendInvoice_;}
      else if(d.a=='paid'){j.invoice=j.invoice||{};j.invoice.paid=!!d.paid;j.invoice.paidAt=d.paid?new Date().toISOString():'';}
      else if(d.a=='email'){if(!validEmail(d.email))return out_({ok:false,err:'Invalid email'});j.email=String(d.email).trim();}
      else if(d.a=='respond'){respond_(j,d);}
      else if(d.a=='qedit'){if(d.email&&!validEmail(d.email))return out_({ok:false,err:'That email does not look right.'});j.name=clip_(d.name,200);j.address=clip_(d.address,300);j.email=clip_(d.email,200);j.quote=clip_(d.quote,8000);j.items=cleanItems_(d.items);j.total=total_(j.items);formFields_(j,d);j.updated=new Date().toISOString();if(d.send)send=sendQuote_;}
      else if(d.a=='iedit'){j.invoice=j.invoice||{};if('amount' in d)j.invoice.amount=clip_(d.amount,40);if('note' in d)j.invoice.note=clip_(d.note,2000);j.invoice.edited=new Date().toISOString();}
      else return out_({ok:false,err:'Bad action'});}
    if(send){try{send(j)}catch(x){return out_({ok:false,err:String(x.message||x)})}}
    save_(js);
  }finally{L.releaseLock();}
  return out_({ok:true,job:j});}
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
  if(!threads.length)return 0;var L=inLock===true?null:LockService.getScriptLock();if(L)L.waitLock(30000);var n=0;
  try{var list=qnLoad_(),seen={};list.forEach(function(q){seen[q.msgId]=1});
    threads.forEach(function(t){var m=t.getMessages()[0];if(!seen[m.getId()]&&!/^(re|fwd?):/i.test(m.getSubject()||'')){list.unshift(qnParse_(m));n++}t.addLabel(lab)});
    if(list.length>300)list=list.slice(0,300);save_(list,QN_FILE);}finally{if(L)L.releaseLock()}
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
  var L=LockService.getScriptLock();L.waitLock(30000);try{var js=load_(),bl=[];try{bl=load_('blocks.json')}catch(e){}var tm=tomorrow_(),n=0;
    js.forEach(function(j){if(!j.phone)return;var st=j.status;
      if((st=='approved')&&installDate_(j,bl)==tm&&!(j.sms||[]).some(function(s){return s.kind=='install-'+tm})){logSms_(j,'install-'+tm,sendSms_(j.phone,smsText_('install',j,prettyDate_(tm))));n++}
      if(j.debrisDate==tm&&!(j.sms||[]).some(function(s){return s.kind=='debris-'+tm})){logSms_(j,'debris-'+tm,sendSms_(j.phone,smsText_('debris',j,prettyDate_(tm))));n++}});
    save_(js);Logger.log('Daily reminders: '+n);}finally{L.releaseLock()}}
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
