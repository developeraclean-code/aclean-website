/*
 * AClean — Google Analytics 4 + pelacakan konversi
 * Properti: AClean Service (388394552) — akun developer.aclean@gmail.com
 *
 * Satu-satunya tempat Measurement ID ditulis. Semua halaman memuat file ini,
 * jadi ganti ID cukup di sini.
 *
 * Event yang dikirim:
 *   wa_click    — klik link WhatsApp mana pun (KONVERSI UTAMA)
 *   phone_click — klik link tel:
 * Parameter: service (halaman), cta_position (letak tombol), link_url,
 *            traffic_type (paid/organic), ads_campaign
 *
 * PENANDA ASAL PENGUNJUNG
 * Pengunjung dari Google Ads mendarat dengan parameter gclid (atau
 * utm_source=google&utm_medium=cpc). Saat itu terdeteksi, penanda seperti
 * [IKLAN-DCT] disisipkan ke teks WhatsApp, sehingga tim yang membalas
 * langsung tahu lead ini datang dari iklan berbayar — bukan organik.
 * Penanda disimpan di sessionStorage agar tetap terbawa saat pengunjung
 * berpindah halaman sebelum menekan tombol WhatsApp.
 *
 * Tombol WhatsApp yang belum punya teks otomatis akan diisi teks default
 * sesuai nama halaman, jadi tidak ada lagi pesan kosong yang masuk.
 *
 * Tandai wa_click sebagai Key Event di GA4:
 *   Admin > Events > toggle "Mark as key event"
 * lalu import ke Google Ads: Tools > Conversions > Import > GA4.
 */
(function () {
  var GA_ID = 'G-0HNM9V7R7W';
  var WA_RE = /(?:wa\.me|api\.whatsapp\.com)/i;
  var STORAGE_KEY = 'aclean_ads_src';

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  // Nama halaman dipakai untuk memisahkan lead per layanan di laporan GA4.
  function serviceFromPath() {
    var f = location.pathname.split('/').pop() || '';
    return f.replace(/\.html$/, '') || 'home';
  }

  // "dct-ducting" -> "IKLAN-DCT". Tanpa nama campaign, cukup "IKLAN".
  function campaignTag(name) {
    if (!name) return 'IKLAN';
    var first = String(name).split(/[-_\s]/)[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
    return first ? 'IKLAN-' + first : 'IKLAN';
  }

  function readStore() {
    try { return sessionStorage.getItem(STORAGE_KEY) || ''; } catch (e) { return ''; }
  }

  function writeStore(v) {
    try { sessionStorage.setItem(STORAGE_KEY, v); } catch (e) {}
  }

  // Deteksi sekali saat halaman dimuat, lalu diingat selama sesi berlangsung.
  function detectSource() {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return readStore(); }
    var gclid = q.get('gclid') || q.get('wbraid') || q.get('gbraid');
    var src = (q.get('utm_source') || '').toLowerCase();
    var med = (q.get('utm_medium') || '').toLowerCase();
    var isPaid = !!gclid || (src === 'google' && med === 'cpc');
    if (isPaid) {
      var tag = campaignTag(q.get('utm_campaign'));
      writeStore(tag);
      return tag;
    }
    return readStore();
  }

  var ADS_SRC = detectSource();

  function defaultText() {
    var svc = serviceFromPath();
    if (svc === 'home' || svc === 'index') {
      return 'Halo AClean, saya mau tanya layanan AC';
    }
    return 'Halo AClean, saya mau tanya soal ' + svc.replace(/-/g, ' ');
  }

  // Isi teks default bila kosong, lalu sisipkan penanda iklan bila ada.
  function decorateWA(a) {
    var raw = a.getAttribute('href') || '';
    if (!WA_RE.test(raw)) return;
    var u;
    try { u = new URL(raw, location.href); } catch (e) { return; }
    var txt = u.searchParams.get('text') || '';
    if (!txt) txt = defaultText();
    if (ADS_SRC && txt.indexOf('[IKLAN') === -1) {
      txt = txt + ' [' + ADS_SRC + ']';
    }
    // encodeURIComponent dipakai agar spasi jadi %20, bukan '+'.
    // WhatsApp menampilkan '+' sebagai karakter literal, bukan spasi.
    u.searchParams.delete('text');
    var rest = u.searchParams.toString();
    var qs = 'text=' + encodeURIComponent(txt) + (rest ? '&' + rest : '');
    a.setAttribute('href', u.origin + u.pathname + '?' + qs + (u.hash || ''));
  }

  function decorateAll() {
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      decorateWA(links[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateAll);
  } else {
    decorateAll();
  }

  // Membedakan tombol mana yang menghasilkan lead (hero vs kartu harga vs float).
  function ctaPosition(a) {
    if (a.classList.contains('wa')) return 'float_button';
    if (a.closest('nav')) return 'nav';
    if (a.closest('footer')) return 'footer';
    if (a.classList.contains('sc-cta')) return 'pricing_card';
    if (a.classList.contains('btn-accent')) return 'cta_section';
    if (a.classList.contains('btn-p') || a.classList.contains('btn-s')) return 'hero';
    return 'other';
  }

  function track(a, href) {
    var isWA = WA_RE.test(href);
    gtag('event', isWA ? 'wa_click' : 'phone_click', {
      service: serviceFromPath(),
      cta_position: ctaPosition(a),
      link_url: href,
      traffic_type: ADS_SRC ? 'paid' : 'organic',
      ads_campaign: ADS_SRC || 'none'
    });
  }

  // Capture phase: event terkirim sebelum browser berpindah halaman.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (WA_RE.test(href) || /^tel:/i.test(href)) {
      if (WA_RE.test(href)) {
        decorateWA(a);
        href = a.getAttribute('href') || href;
      }
      track(a, href);
    }
  }, true);
})();
