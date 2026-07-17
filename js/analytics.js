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
 * Parameter: service (halaman), cta_position (letak tombol), link_url
 *
 * Tandai wa_click sebagai Key Event di GA4:
 *   Admin > Events > toggle "Mark as key event"
 * lalu import ke Google Ads: Tools > Conversions > Import > GA4.
 */
(function () {
  var GA_ID = 'G-0HNM9V7R7W';

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
    var isWA = /(?:wa\.me|api\.whatsapp\.com)/i.test(href);
    gtag('event', isWA ? 'wa_click' : 'phone_click', {
      service: serviceFromPath(),
      cta_position: ctaPosition(a),
      link_url: href
    });
  }

  // Capture phase: event terkirim sebelum browser berpindah halaman.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/(?:wa\.me|api\.whatsapp\.com)/i.test(href) || /^tel:/i.test(href)) {
      track(a, href);
    }
  }, true);
})();
