// CSV customer import wizard (Settings) + customer pages with "New quote for customer".
window.CUSTS = window.CUSTS || [];
var CSVI = null; // {headers, rows, map, plan}
function csvParse(t) {
  t = String(t || '').replace(/^\uFEFF/, '');
  var rows = [], row = [], f = '', q = false, i = 0, c;
  for (; i < t.length; i++) {
    c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; continue; }
    if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows.filter(function (r) { return r.some(function (x) { return String(x).trim() !== ''; }); });
}
var CSV_FIELDS = [['name', 'Full name'], ['first', 'First name'], ['last', 'Last name'], ['email', 'Email'], ['phone', 'Phone'], ['address', 'Full address'], ['street', 'Street'], ['city', 'City'], ['state', 'State'], ['zip', 'Zip']];
function csvGuess(headers) {
  var m = {}, pats = { name: /^(full ?name|name|customer( name)?|client( name)?|display ?name|contact( name)?)$/, first: /^first|given/, last: /^last|surname|family/, email: /e-?mail/, phone: /phone|mobile|cell|tel/, address: /^(full )?address$|^billing address$|^service address$/, street: /street|address ?1|addr(ess)? line ?1/, city: /city|town/, state: /^state|province|^st$/, zip: /zip|postal/ };
  headers.forEach(function (h, i) { var k = String(h).trim().toLowerCase(); for (var f in pats) if (m[f] == null && pats[f].test(k)) { m[f] = i; break; } });
  return m;
}
function csvDig(v) { var x = String(v || '').replace(/\D/g, ''); return x.length > 10 && x[0] === '1' ? x.slice(1) : x; }
function csvRow(r, m) {
  var g = function (k) { return m[k] == null || m[k] === '' ? '' : String(r[m[k]] || '').trim(); };
  var name = g('name') || [g('first'), g('last')].filter(Boolean).join(' ');
  var addr = g('address');
  if (!addr) { var sz = [g('state'), g('zip')].filter(Boolean).join(' '); addr = [g('street'), g('city'), sz].filter(Boolean).join(', '); }
  return { name: name, email: g('email').toLowerCase(), phone: g('phone'), address: addr };
}
function csvPlan() {
  var m = CSVI.map, seen = {}, out = { ok: [], skip: [] };
  (jobs || []).concat(window.CUSTS || []).forEach(function (x) { var e = String(x.email || '').trim().toLowerCase(), p = csvDig(x.phone); if (e) seen['e:' + e] = 1; if (p.length >= 7) seen['p:' + p] = 1; });
  CSVI.rows.forEach(function (r, i) {
    var c = csvRow(r, m), p = csvDig(c.phone), why = '';
    if (!c.name) why = 'Missing name';
    else if (c.email && seen['e:' + c.email]) why = 'Duplicate email';
    else if (p.length >= 7 && seen['p:' + p]) why = 'Duplicate phone';
    if (why) { out.skip.push({ row: i + 2, name: c.name, why: why }); return; }
    if (c.email) seen['e:' + c.email] = 1; if (p.length >= 7) seen['p:' + p] = 1;
    out.ok.push(c);
  });
  return out;
}
function csvShell(step, body) { A.innerHTML = '<h2 style="margin-top:0">Import customers (CSV)</h2><p class="muted">Step ' + step + ' of 4</p>' + body; window.scrollTo(0, 0); }
function openImport() { if (typeof readEditor === 'function') readEditor(); view = 'imp'; CSVI = null; csvStep1(); }
function csvStep1() {
  csvShell(1, '<div class="card"><h2>Choose a CSV file</h2><p class="muted">Export your customer list as CSV (from QuickBooks, Excel, Google Sheets, or your old system). The first row should be column names.</p><input id="csvf" type="file" accept=".csv,text/csv" hidden onchange="csvLoad(this.files[0])"><button class="btn huge" id="csvpick" type="button" onclick="document.getElementById(\'csvf\').click()">📄 Choose CSV file</button></div><button class="btn gr" type="button" onclick="backToSet()">← Back to Settings</button>');
  armBack(backToSet);
}
function csvLoad(file) {
  if (!file) return;
  var rd = new FileReader();
  rd.onload = function () { csvText(String(rd.result || '')); };
  rd.readAsText(file);
}
function csvText(t) {
  var all = csvParse(t);
  if (all.length < 2) return toast('That file has no customer rows');
  if (all.length - 1 > 2000) return toast('Too many rows (' + (all.length - 1) + '). Split the file into 2000 rows or fewer.');
  CSVI = { headers: all[0].map(function (h) { return String(h).trim(); }), rows: all.slice(1) };
  CSVI.map = csvGuess(CSVI.headers);
  csvStep2();
}
function csvStep2() {
  var opts = function (f) { return '<option value="">— not in file —</option>' + CSVI.headers.map(function (h, i) { return '<option value="' + i + '"' + (String(CSVI.map[f]) === String(i) ? ' selected' : '') + '>' + esc(h || 'Column ' + (i + 1)) + '</option>'; }).join(''); };
  var sel = CSV_FIELDS.map(function (f) { return '<label>' + f[1] + (f[0] === 'name' ? ' <span class="muted">(or First + Last)</span>' : '') + '</label><select id="map-' + f[0] + '" style="font-size:18px;padding:10px;width:100%">' + opts(f[0]) + '</select>'; }).join('');
  csvShell(2, '<div class="card"><h2>Match the columns</h2><p class="muted">We guessed from your column names. Fix anything that looks wrong. A name is required.</p>' + sel + '</div><button class="btn huge" id="csvnext" type="button" onclick="csvMapDone()">Next: preview →</button><button class="btn gr" type="button" onclick="csvStep1()">← Choose a different file</button>');
  armBack(csvStep1);
}
function csvMapDone() {
  var m = {}; CSV_FIELDS.forEach(function (f) { var v = $('#map-' + f[0]).value; if (v !== '') m[f[0]] = Number(v); });
  if (m.name == null && m.first == null && m.last == null) return toast('Pick the column with the customer name');
  CSVI.map = m; CSVI.plan = csvPlan(); csvStep3();
}
function csvStep3() {
  var p = CSVI.plan, tot = CSVI.rows.length;
  var prev = p.ok.slice(0, 5).map(function (c) { return '<div class="job" style="cursor:default"><b>' + esc(c.name) + '</b><br><small>' + esc([c.phone, c.email].filter(Boolean).join(' · ') || 'No phone or email') + '</small><br><small>' + esc(c.address || 'No address') + '</small></div>'; }).join('');
  var sk = p.skip.slice(0, 20).map(function (s) { return '<li>Row ' + s.row + (s.name ? ' (' + esc(s.name) + ')' : '') + ': ' + s.why + '</li>'; }).join('');
  csvShell(3, '<div class="card" id="csvcounts"><h2>Check before importing</h2><p style="font-size:20px;margin:4px 0">Total rows: <b id="c-total">' + tot + '</b></p><p style="font-size:20px;margin:4px 0;color:#2f6b12">Will import: <b id="c-ok">' + p.ok.length + '</b></p><p style="font-size:20px;margin:4px 0;color:#b91c1c">Skipped: <b id="c-skip">' + p.skip.length + '</b></p>' + (sk ? '<ul id="c-why">' + sk + (p.skip.length > 20 ? '<li>…and ' + (p.skip.length - 20) + ' more</li>' : '') + '</ul>' : '') + '</div>' + (prev ? '<div class="card"><h2>First customers</h2>' + prev + '</div>' : '') + (p.ok.length ? '<button class="btn huge" id="csvgo" type="button" onclick="csvImport()">Import ' + p.ok.length + ' customer' + (p.ok.length === 1 ? '' : 's') + '</button>' : '<p class="muted">Nothing new to import.</p>') + '<button class="btn gr" type="button" onclick="csvStep2()">← Fix columns</button>');
  armBack(csvStep2);
}
async function csvImport() {
  var b = $('#csvgo'); if (b) { b.disabled = true; b.textContent = 'Importing…'; }
  try {
    var r = await api({ a: 'importCustomers', pin: myPin(), rows: CSVI.plan.ok });
    if (r && r.customers) window.CUSTS = r.customers;
    csvDone(r.added || 0, CSVI.plan.skip.length + (r.skipped || 0));
  } catch (e) {
    toast(String(e.message || e) === 'Bad action' ? 'Import needs a Field Desk script redeploy first.' : e.message);
    if (b) { b.disabled = false; b.textContent = 'Import'; }
  }
}
function csvDone(added, skipped) {
  csvShell(4, '<div class="card" id="csvdone"><h2>✅ Import done</h2><p style="font-size:22px;margin:4px 0">Imported: <b id="d-ok">' + added + '</b></p><p style="font-size:20px;margin:4px 0">Skipped: <b id="d-skip">' + skipped + '</b></p><p class="muted">No emails or texts were sent.</p></div><button class="btn huge" type="button" onclick="openCusts()">See customers</button><button class="btn gr" type="button" onclick="backToSet()">← Back to Settings</button>');
  armBack(backToSet);
}
// Customer list + detail page.
function custAll() {
  var map = {}, out = [];
  (window.CUSTS || []).forEach(function (c) { var k = 'c:' + c.id; map[k] = { key: k, name: c.name, email: c.email, phone: c.phone, address: c.address, cid: c.id }; out.push(map[k]); });
  (jobs || []).forEach(function (j) { var k = customerKey(j); var hit = out.find(function (c) { return (c.email && j.email && c.email.toLowerCase() === String(j.email).toLowerCase()) || c.key === k; }); if (hit) { hit.jid = hit.jid || j.id; return; } var c = { key: k, name: j.name, email: j.email, phone: j.phone, address: j.address, jid: j.id }; out.push(c); });
  return out.sort(function (a, b) { return String(a.name || '').localeCompare(String(b.name || '')); });
}
function openCusts() {
  view = 'custs'; var l = custAll();
  A.innerHTML = '<h2 style="margin-top:0">Customers (' + l.length + ')</h2><div id="cl">' + l.map(function (c, i) { return '<div class="job" onclick="custView(' + i + ')"><b>' + esc(c.name || '(no name)') + '</b><br><small>' + esc([c.phone, c.email].filter(Boolean).join(' · ')) + '</small></div>'; }).join('') + '</div><button class="btn gr" type="button" onclick="backToSet()">← Back to Settings</button>';
  window.CUSTL = l; armBack(backToSet); window.scrollTo(0, 0);
}
function custView(i) {
  var c = (window.CUSTL || [])[i]; if (!c) return; window.CUSTCUR = c;
  A.innerHTML = '<div class="card" id="custcard"><h2>' + esc(c.name || '') + '</h2><p style="font-size:18px">' + esc(c.address || 'No address') + '</p><p>📞 ' + esc(c.phone || '—') + '</p><p>📧 ' + esc(c.email || '—') + '</p><button class="btn huge" id="nqc" type="button" onclick="newQuoteFor(window.CUSTCUR)">➕ New quote for customer</button></div><button class="btn gr" type="button" onclick="openCusts()">← All customers</button>';
  armBack(openCusts); window.scrollTo(0, 0);
}
function newQuoteForJob(id) { var j = jobs.find(function (x) { return x.id === id; }); if (j) newQuoteFor({ name: j.name, email: j.email, phone: j.phone, address: j.address, jid: j.id }); }
// Prefills a fresh quote (no edit id). The customer stays linked by email (same customerKey), so no duplicate customer.
function newQuoteFor(c) {
  if (!c) return; window.QCUST = { cid: c.cid || '', jid: c.jid || '' };
  newq(); fillQuote({ name: c.name || '', email: c.email || '', phone: c.phone || '', address: c.address || '' });
  if (typeof txtState === 'function') txtState(); window.scrollTo(0, 0);
}
