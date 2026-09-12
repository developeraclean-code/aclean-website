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

/* Sinkronisasi semua foto situs dari slot yang dikelola panel admin. */
(function () {
  var SUPA = 'https://apsbeppcmsxeldnejibz.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwc2JlcHBjbXN4ZWxkbmVqaWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NjI5OTAsImV4cCI6MjA4ODQzODk5MH0.ougABivpskSoQyFCOagV7GYah0yNV3-sGuc5ErplRo4';
  var ROOT = SUPA + '/storage/v1/object/public/web/';
  var PACKAGE_PATHS = [
    'paket/cleaning.jpg',
    'paket/service-besar.jpg',
    'paket/freon-original.jpg',
    'paket/pasang-baru.jpg',
    'paket/bongkar-pasang.jpg',
    'paket/perawatan-berkala.jpg'
  ];

  // File lokal tetap menjadi fallback; nama berikut menentukan slot pusatnya.
  var FILE_TO_SLOT = {
    'service-card-cleaning-v2.jpg': 'beranda/cuci.jpg',
    'service-card-repair-v2.jpg': 'beranda/service.jpg',
    'service-card-freon-v2.jpg': 'beranda/freon.jpg',
    'service-card-installation-v2.jpg': 'beranda/pasang.jpg',
    'service-card-relocation-v2.jpg': 'beranda/bongkar.jpg',
    'service-card-ducting-v2.jpg': 'beranda/ducting.jpg',
    'home-cleaning.jpg': 'beranda/cuci.jpg',
    'home-service.jpg': 'beranda/service.jpg',
    'home-freon.jpg': 'beranda/freon.jpg',
    'home-pasang.jpg': 'beranda/pasang.jpg',
    'home-bongkar.jpg': 'beranda/bongkar.jpg',
    'home-ducting.jpg': 'beranda/ducting.jpg',
    'blog-ac-tidak-dingin.png': 'beranda/artikel-ac-tidak-dingin.jpg',
    'blog-ac-tidak-dingin.jpg': 'beranda/artikel-ac-tidak-dingin.jpg',
    'blog-ac-tidak-dingin.webp': 'beranda/artikel-ac-tidak-dingin.jpg',
    'blog-ac-bocor.jpg': 'beranda/artikel-ac-bocor.jpg',
    'blog-ac-bocor.webp': 'beranda/artikel-ac-bocor.jpg',
    'blog-maintenance.jpg': 'beranda/artikel-maintenance.jpg',
    'blog-freon-r32-r410.jpg': 'beranda/artikel-freon.jpg',
    'blog-freon-r32-r410.webp': 'beranda/artikel-freon.jpg',
    'daikin-training-teknisi.jpg': 'beranda/sertifikasi-daikin.jpg',
    'hero-ac-service.jpg': 'hero/ac-service.jpg',
    'hero-teknisi-aclean.jpg': 'hero/teknisi-aclean.jpg',
    'hero-teknisi-aclean.webp': 'hero/teknisi-aclean.jpg',
    'hero-cleaning-ac.jpg': 'hero/cleaning-ac.jpg',
    'hero-cleaning-ac.webp': 'hero/cleaning-ac.jpg',
    'service-cuci-ac.jpg': 'halaman/cuci-ac.jpg',
    'service-cuci-ac.webp': 'halaman/cuci-ac.jpg',
    'service-repair-ac.jpg': 'halaman/perbaikan-ac.jpg',
    'service-pasang-ac.jpg': 'halaman/pasang-ac.jpg',
    'service-pasang-ac.webp': 'halaman/pasang-ac.jpg',
    'service-isi-freon.jpg': 'halaman/isi-freon.jpg',
    'service-isi-freon.webp': 'halaman/isi-freon.jpg',
    'service-bongkar-pasang.jpg': 'halaman/bongkar-pasang-ac.jpg',
    'service-ducting-ac.jpg': 'halaman/ducting-ac.jpg',
    'service-ac-central.jpg': 'halaman/service-ac-central.jpg',
    'service-ac-central.webp': 'halaman/service-ac-central.jpg',
    'service-ac-bsd.jpg': 'halaman/area-bsd.jpg',
    'service-ac-bsd-city.jpg': 'halaman/area-bsd.jpg',
    'service-ac-alam-sutera.jpg': 'halaman/area-alam-sutera.jpg',
    'service-ac-gading-serpong.jpg': 'halaman/area-gading-serpong.jpg',
    'tim-teknisi-aclean-service.jpg': 'halaman/tentang-tim.jpg',
    'pengisian-freon-ac-original-daikin.jpg': 'beranda/freon.jpg',
    'freon-ac-daikin-original.jpg': 'blog/freon-ac-daikin-original.jpg',
    'biaya-service-ac.jpg': 'blog/biaya-service-ac.jpg',
    'ducting-ac-pu-board-hero-v2.jpg': 'halaman/ducting-ac.jpg',
    'ducting-aclean-process-v2.jpg': 'halaman/ducting-proses.jpg'
  };

  function managedPath(value) {
    try {
      var u = new URL(value, location.href);
      var marker = '/storage/v1/object/public/web/';
      var at = u.pathname.indexOf(marker);
      if (at !== -1) return u.pathname.slice(at + marker.length);
      return FILE_TO_SLOT[u.pathname.split('/').pop()] || '';
    } catch (e) { return ''; }
  }

  function syncImage(img, versions) {
    if (!img || img.dataset.mediaSynced === 'true') return;
    var path = img.getAttribute('data-media-path') || managedPath(img.getAttribute('src') || '');

    // Enam kartu paket memakai foto sendiri, bukan foto hero/kartu yang kebetulan
    // memiliki nama file lokal sama.
    var paket = img.closest && img.closest('#paket');
    if (paket) {
      var packageImages = Array.prototype.slice.call(paket.querySelectorAll('.sc-img img'));
      var packageIndex = packageImages.indexOf(img);
      if (packageIndex >= 0 && PACKAGE_PATHS[packageIndex]) path = PACKAGE_PATHS[packageIndex];
    }
    if (!path || !versions.has(path)) return;

    var fallback = img.getAttribute('data-media-fallback') || img.getAttribute('src');
    var target = ROOT + path + '?v=' + encodeURIComponent(versions.get(path) || 1);
    var picture = img.closest && img.closest('picture');
    var source = picture && picture.querySelector('source');
    var sourceFallback = source && source.getAttribute('srcset');
    var sourceType = source && source.getAttribute('type');
    img.dataset.mediaSynced = 'true';
    img.addEventListener('error', function () {
      if (source) {
        if (sourceFallback) source.srcset = sourceFallback;
        else source.removeAttribute('srcset');
        if (sourceType) source.setAttribute('type', sourceType);
        else source.removeAttribute('type');
      }
      if (fallback && img.src !== new URL(fallback, location.href).href) img.src = fallback;
    }, { once: true });
    function applyTarget() {
      img.src = target;
      if (source) {
        source.removeAttribute('type');
        source.srcset = target;
      }
    }

    // Hero memakai URL aktif sejak HTML pertama kali diparsing. Jika admin
    // menerbitkan versi baru, unduh dan decode dahulu supaya pergantian src
    // tidak menampilkan ruang kosong atau kedipan gambar fallback.
    if (img.dataset.mediaSmooth === 'true' && img.src !== new URL(target, location.href).href) {
      var preload = new Image();
      preload.decoding = 'async';
      preload.onload = function () {
        if (typeof preload.decode === 'function') {
          preload.decode().catch(function () {}).then(applyTarget);
        } else {
          applyTarget();
        }
      };
      preload.src = target;
    } else {
      applyTarget();
    }
  }

  fetch(SUPA + '/rest/v1/media_slot?select=path,versi&aktif=is.true', {
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY }
  })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (rows) {
      var versions = new Map(rows.map(function (r) { return [r.path, r.versi]; }));
      document.querySelectorAll('img').forEach(function (img) { syncImage(img, versions); });
    })
    .catch(function () { /* src lokal tetap dipakai sebagai fallback */ });
})();
