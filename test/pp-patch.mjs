// Test helper: the sticky bottom Back/Home bar (nav2.js) covers the bottom ~92px of the screen, like a phone's tab bar.
// A person scrolls a button up before tapping it; puppeteer clicks anything that is merely in view. Center the target first.
import * as pp from 'puppeteer-core';
const P = (await import('puppeteer-core/lib/esm/puppeteer/api/Page.js')).Page;
const E = (await import('puppeteer-core/lib/esm/puppeteer/api/ElementHandle.js')).ElementHandle;
const pc = P.prototype.click;
P.prototype.click = async function (sel, opts) { try { await this.$eval(sel, (e) => e.scrollIntoView({ block: 'center' })); } catch (e) {} return pc.call(this, sel, opts); };
const ec = E.prototype.click;
E.prototype.click = async function (opts) { try { await this.evaluate((e) => e.scrollIntoView({ block: 'center' })); } catch (e) {} return ec.call(this, opts); };
void pp;
