// Miller f15fe30: quote fill never writes "null"; spoken/typed email and phone are recovered.
import test from 'node:test'; import assert from 'node:assert'; import fs from 'fs'; import vm from 'vm';
const src = fs.readFileSync(new URL('../Code.gs', import.meta.url), 'utf8');
const ctx = { clip_: (v, n) => String(v == null ? '' : v).slice(0, n || 1000) }; vm.createContext(ctx);
vm.runInContext(src.match(/function voiceClean_[\s\S]*?\n(?=function |var |\/\/)/)[0], ctx);
test('null strings become empty; email/phone pulled from words', () => {
  const a = ctx.voiceClean_({ customer: { name: 'Jane Doe', phone: 'null', email: 'jane@example.com', address: 'N/A' }, estimate: {}, crew: {} }, '');
  assert.equal(a.customer.phone, ''); assert.equal(a.customer.email, 'jane@example.com'); assert.equal(a.customer.address, '');
  const b = ctx.voiceClean_({ customer: { name: 'Bob Lane', phone: null, email: 'none' }, estimate: {}, crew: {}, transcript: 'email bob.lane@example.com phone 850-555-0142' }, '');
  assert.equal(b.customer.email, 'bob.lane@example.com'); assert.equal(b.customer.phone, '850-555-0142');
});
