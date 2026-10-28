import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const require = createRequire(import.meta.url);
const FD = require(path.join(root, 'form.js'));
const gs = fs.readFileSync(path.join(root, 'Code.gs'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('default form is tree service and keeps a full service list', () => {
  const form = FD.normalizeForm(null);
  const names = form.services.map((s) => s.name);
  assert.ok(names.includes('Removal'));
  assert.ok(names.includes('Stump Grinding'));
  assert.ok(names.includes('24-Hour Emergency Service'));
  assert.equal(form.fields.find((f) => f.id === 'inote').lock, true);
  assert.equal(form.fields.find((f) => f.id === 'inote').customer, false);
  assert.equal(FD.customerSees(form, 'inote'), false);
  assert.equal(FD.customerSees(form, 'internalNotes'), false);
  assert.equal(FD.customerSees(form, 'notes'), false);
});

test('saved quotes keep a service name that was deleted from the list', () => {
  const form = FD.normalizeForm({ services: [{ name: 'Pruning', price: '400' }], fields: [] });
  assert.deepEqual(form.services.map((s) => s.name), ['Pruning']);
  const job = { service: 'Removal', items: [{ title: 'Removal', detail: 'Remove the oak.', price: 1800 }] };
  const htmlOut = FD.specHtml(job, form);
  assert.match(htmlOut, /Removal/);
  assert.equal(job.service, 'Removal');
});

test('internal notes never appear on a customer-facing block', () => {
  const form = FD.normalizeForm(null);
  const secret = 'SECRET-INTERNAL-NOTE';
  const job = {
    name: 'Pat',
    service: 'Pruning',
    species: 'Live oak',
    additionalNotes: 'Gate code is 1234.',
    internalNotes: secret,
    notes: 'Manager scratch ' + secret,
    quote: 'raw talk ' + secret,
    crewNotes: 'crew ' + secret,
    custom: { secret: secret }
  };
  const block = FD.specHtml(job, form) + FD.additionalNotesHtml(job, form) + FD.customerPreviewHtml(job, form);
  assert.equal(FD.leaksInternal(block, [secret]), false);
  assert.match(block, /Gate code is 1234/);
  assert.match(block, /Live oak/);
  assert.equal(FD.customerJob(job).internalNotes, undefined);
  assert.equal(job.internalNotes, secret);
});

test('custom fields are customer-facing only when chosen', () => {
  const form = FD.normalizeForm({
    services: [{ name: 'Removal', price: '' }],
    fields: [{ id: 'cgate', label: 'Gate code', kind: 'select', show: true, customer: true, options: ['Call first', 'Text first'] }]
  });
  const hidden = FD.normalizeForm({
    services: [{ name: 'Removal', price: '' }],
    fields: [{ id: 'cgate', label: 'Gate code', kind: 'text', show: true, customer: false }]
  });
  const job = { custom: { cgate: 'Call first' } };
  assert.match(FD.specHtml(job, form), /Call first/);
  assert.equal(FD.specHtml(job, hidden), '');
  assert.equal(FD.customerSees(form, 'inote'), false);
});

test('hide, rename, and reorder survive normalize', () => {
  const base = FD.normalizeForm(null);
  const fields = base.fields.map((f) => Object.assign({}, f));
  const species = fields.find((f) => f.id === 'species');
  species.show = false;
  const service = fields.find((f) => f.id === 'service');
  service.label = 'Work';
  const addl = fields.splice(fields.findIndex((f) => f.id === 'addl'), 1)[0];
  fields.unshift(addl);
  const form = FD.normalizeForm({ services: base.services, fields });
  assert.equal(form.fields[0].id, 'addl');
  assert.equal(form.fields.find((f) => f.id === 'service').label, 'Work');
  assert.equal(form.fields.find((f) => f.id === 'species').show, false);
  assert.equal(FD.customerSees(form, 'species'), false);
  const fresh = FD.normalizeForm(null);
  assert.equal(fresh.fields.find((f) => f.id === 'species').show, true);
  assert.equal(fresh.fields.find((f) => f.id === 'service').label, 'Service');
});

test('default estimate wording matches the live Fielder email', () => {
  const copy = FD.quoteCopy({}, { name: 'Pat', est: 'FT-EST-2026-0007', address: '1 Oak St' });
  assert.equal(copy.subject, 'Your estimate from Fielder Tree Service - FT-EST-2026-0007');
  assert.match(copy.body, /care for the trees at your property/);
  assert.equal(copy.sign, FD.DEFAULT_SIGN);
  const custom = FD.quoteCopy({ quoteSubject: 'Tree estimate {estimate} for {name}', quoteBody: '', quoteSign: '' }, { name: 'Pat', est: 'FT-1' });
  assert.equal(custom.subject, 'Tree estimate FT-1 for Pat');
  assert.equal(custom.body, FD.DEFAULT_BODY);
});

test('Code.gs stays live, embeds the form, and strips internal notes before customer html', () => {
  const start = gs.indexOf('// FORMJS_START\n');
  const end = gs.indexOf('// FORMJS_END');
  assert.equal(gs.slice(start + '// FORMJS_START\n'.length, end), fs.readFileSync(path.join(root, 'form.js'), 'utf8'));
  assert.equal(gs.includes('TEST_TO'), false);
  assert.ok(gs.includes('mail_({to:j.email'));
  const quote = gs.slice(gs.indexOf('function quoteHtml_'), gs.indexOf('function pdfHtml_'));
  assert.equal(quote.includes('internalNotes'), false);
  assert.ok(quote.includes('custBlock_'));
  assert.ok(gs.includes("d.a=='settings'"));
  assert.ok(gs.includes('formFields_'));
  assert.equal(/concrete|coating|epoxy|flake/i.test(html + fs.readFileSync(path.join(root, 'form.js'), 'utf8')), false);
  assert.ok(html.includes('form.js?v=20261027q'));
  assert.ok(html.includes('openSet()'));
  assert.equal(gs.split('mail_({to:j.email').length - 1, 3);
  assert.equal(gs.split('MailApp.sendEmail(').length - 1, 1);
  assert.ok(gs.includes("d.a=='qedit'"));
  assert.ok(gs.includes("d.a=='cedit'"));
  assert.ok(gs.includes("d.a=='iedit'"));
  assert.ok(gs.includes("d.a=='feedback'"));
  const feedback = gs.slice(gs.indexOf("d.a=='feedback'"), gs.indexOf("d.a=='cedit'"));
  assert.equal(feedback.includes('MailApp'), false);
  assert.ok(gs.includes('if(d.send)send=sendQuote_'));
  assert.equal(FD.specHtml({ phone2: 'SECRET-PHONE2', contact2: 'SECRET-CONTACT', service: 'Pruning' }, FD.normalizeForm(null)).includes('SECRET-PHONE2'), false);
  assert.ok(html.includes('id="back"'));
  assert.ok(html.includes('id="fbhome"'));
  assert.ok(html.includes('Edit customer'));
});
