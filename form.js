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
