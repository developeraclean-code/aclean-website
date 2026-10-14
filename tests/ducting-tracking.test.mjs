import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';

const analytics = fs.readFileSync(new URL('../js/analytics.js', import.meta.url), 'utf8').split('/* Sinkronisasi semua foto situs')[0];
const lead = fs.readFileSync(new URL('../js/ducting-lead.js', import.meta.url), 'utf8');

function harness({search = '?utm_source=google&utm_medium=cpc&utm_campaign=dct_search', host = 'aclean.id', blocked = false, phone = '081234567890', failure = false} = {}) {
  const scriptLoads = [], popups = [], fallbackButtons = [], navigations = [];
  const formHandlers = {}, documentHandlers = {};
  const store = () => { const values = new Map(); return {getItem: k => values.get(k) || null, setItem: (k, v) => values.set(k, v), removeItem: k => values.delete(k)}; };
  const status = {textContent: '', insertAdjacentElement: (where, el) => fallbackButtons.push(el)};
  const button = {disabled: false, textContent: ''};
  const values = {nama: 'Nama uji lokal', phone, area: 'BSD City', project_type: 'Rumah tinggal', room_size: '50–100 m²', timeline: '1–3 bulan', notes: 'Catatan pribadi uji'};
  const elements = Object.fromEntries(Object.entries(values).map(([k, value]) => [k, {value, focus() {}}]));
  const form = {id: 'ductingLeadForm', elements, closest: () => ({getAttribute: () => ''}),
    querySelector: q => q.includes('button') ? button : status,
    reportValidity: () => true, addEventListener: (name, fn) => {formHandlers[name] = fn;}};
  const document = {readyState: 'complete', head: {appendChild: s => scriptLoads.push(s)},
    createElement: () => ({handlers: {}, addEventListener(name, fn) {this.handlers[name] = fn;}, remove() {this.removed = true;}}),
    querySelectorAll: q => q === '.ducting-lead-form' ? [form] : [],
    addEventListener: (name, fn) => {documentHandlers[name] = fn;}};
  const context = {document, location: {hostname: host, protocol: 'https:', origin: 'https://' + host,
    pathname: '/ducting-ac-bsd.html', search, href: 'https://' + host + '/ducting-ac-bsd.html' + search,
    assign: url => navigations.push(url)}, sessionStorage: store(), localStorage: store(),
    crypto: webcrypto, URL, URLSearchParams, Date, Intl, Uint32Array, setTimeout() {button.disabled = false;}};
  context.window = context;
  context.open = () => {
    if (blocked) return null;
    const popup = {opener: 'original', location: {}, close() {this.closed = true;}};
    if (failure) Object.defineProperty(popup.location, 'href', {set() {throw new Error('navigation blocked');}});
    popups.push(popup);
    return popup;
  };
  vm.createContext(context);
  vm.runInContext(analytics, context);
  vm.runInContext(lead, context);
  return {context, elements, values, status, formHandlers, documentHandlers, scriptLoads, popups, fallbackButtons, navigations,
    submit: () => formHandlers.submit({preventDefault() {}}),
    events: name => context.dataLayer.filter(a => a[0] === 'event' && (!name || a[1] === name)),
    message: () => new URL(popups.at(-1).location.href).searchParams.get('text')};
}

test('valid form correlates WA draft and GA4 by code and current page, without identity in GA4', () => {
  const h = harness(); h.submit();
  const event = h.events('generate_lead')[0][2];
  assert.match(event.lead_id, /^DCT-BSD-\d{8}-[a-f0-9]{16}$/);
  assert.equal(event.lead_type, 'whatsapp_handoff');
  assert.equal(event.source_page, '/ducting-ac-bsd.html');
  assert.equal(event.utm_campaign, 'dct_search');
  assert.ok(h.message().includes(event.lead_id));
  assert.ok(h.message().includes('Halaman asal: /ducting-ac-bsd.html'));
  assert.equal(h.popups[0].opener, null);
  const payload = JSON.stringify(event);
  for (const value of [h.values.nama, h.values.phone, h.values.notes]) assert.equal(payload.includes(value), false);
});

test('blocked popup produces no handoff until user chooses the same-tab fallback', () => {
  const h = harness({blocked: true}); h.submit();
  assert.equal(h.events('generate_lead').length, 0);
  assert.equal(h.events('ducting_wa_blocked').length, 1);
  assert.equal(h.fallbackButtons.length, 1);
  h.fallbackButtons[0].handlers.click();
  assert.equal(h.events('generate_lead').length, 1);
  assert.match(h.navigations[0], /^https:\/\/wa.me\/6281289898937\?text=/);
});

test('failed popup navigation does not count a handoff', () => {
  const h = harness({failure: true}); h.submit();
  assert.equal(h.events('generate_lead').length, 0);
  assert.equal(h.popups[0].closed, true);
  assert.equal(h.fallbackButtons.length, 1);
});

test('reopening identical details does not inflate events; changed details get a new code', () => {
  const h = harness(); h.submit(); const code = h.events('generate_lead')[0][2].lead_id;
  h.submit(); assert.equal(h.events('generate_lead').length, 1);
  h.elements.notes.value = 'Kebutuhan lain'; h.submit();
  assert.equal(h.events('generate_lead').length, 2);
  assert.notEqual(h.events('generate_lead')[1][2].lead_id, code);
});

test('hyphens, too many digits, whitespace name, and malformed phone do not submit', () => {
  for (const phone of ['--------', '1234567890123456', 'abc08123456789', '0812++3456789']) {
    const h = harness({phone}); h.submit();
    assert.equal(h.events('generate_lead').length, 0);
    assert.equal(h.popups.length, 0);
  }
  const h = harness(); h.elements.nama.value = '   '; h.submit(); assert.equal(h.popups.length, 0);
});

test('form start is measured once without field values', () => {
  const h = harness(); h.formHandlers.input(); h.formHandlers.input();
  assert.equal(h.events('ducting_form_start').length, 1);
  assert.equal(JSON.stringify(h.events()).includes(h.values.phone), false);
});

test('local preview never injects or configures a production GA4 tag', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    const h = harness({host}); h.submit();
    assert.equal(h.scriptLoads.length, 0);
    assert.equal(h.context.dataLayer.some(a => a[0] === 'config'), false);
    assert.equal(h.events('generate_lead').length, 1);
  }
  assert.equal(harness().scriptLoads.length, 1);
});

test('braid identifiers remain separate from gclid', () => {
  const h = harness({search: '?wbraid=synthetic-local-test'});
  const saved = JSON.parse(h.context.localStorage.getItem('aclean_ads_attribution'));
  assert.equal(saved.gclid, '');
  assert.equal(saved.wbraid, 'synthetic-local-test');
  assert.equal(saved.source, 'google');
  assert.equal(saved.landing_page, 'https://aclean.id/ducting-ac-bsd.html');
});

test('direct WA clicks strip message query and recognize the bottom CTA', () => {
  const h = harness();
  const attributes = {href: 'https://wa.me/6281289898937?text=private-note'};
  const anchor = {getAttribute: k => attributes[k], setAttribute: (k, v) => {attributes[k] = v;},
    classList: {contains: () => false}, closest: s => s === '.cta-section' ? {} : null};
  h.documentHandlers.click({target: {closest: () => anchor}});
  const params = h.events('wa_click')[0][2];
  assert.equal(params.link_url, 'https://wa.me/6281289898937');
  assert.equal(params.cta_position, 'cta_section');
  assert.equal(JSON.stringify(params).includes('private-note'), false);
});

test('tracking failure does not stop WA draft opening', () => {
  const h = harness(); h.context.acleanTrack = () => {throw new Error('tracking unavailable');};
  h.submit(); assert.ok(h.message().includes('Kode konsultasi: DCT-BSD-'));
});
