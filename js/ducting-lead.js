/* AClean — form konsultasi dan penerusan WhatsApp; bukan bukti pesan diterima. */
(function () {
  var WA_NUMBER = '6281289898937';

  function clean(value, max) {
    return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max || 500);
  }

  function track(name, params) {
    if (typeof window.acleanTrack !== 'function') return;
    try { window.acleanTrack(name, params); } catch (e) { /* WhatsApp tetap berfungsi. */ }
  }

  function newLeadId() {
    var areaCode = location.pathname.indexOf('ducting-ac-bsd') !== -1 ? 'BSD' :
      location.pathname.indexOf('ducting-ac-bintaro') !== -1 ? 'BAS' : 'TS';
    var day = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    var date = ['year', 'month', 'day'].map(function (part) {
      return day.find(function (item) { return item.type === part; }).value;
    }).join('');
    var random = new Uint32Array(2);
    window.crypto.getRandomValues(random);
    return 'DCT-' + areaCode + '-' + date + '-' +
      Array.from(random).map(function (value) { return value.toString(16).padStart(8, '0'); }).join('');
  }

  function init(form) {
    var section = form.closest('.lead-section');
    var defaultArea = section && section.getAttribute('data-default-area');
    var area = form.elements.area;
    var status = form.querySelector('.lead-form-status');
    var button = form.querySelector('button[type="submit"]');
    var started = false;
    var lastSignature = '';
    var leadId = '';
    var trackedId = '';
    var fallbackButton = null;

    if (defaultArea && area && !area.value) area.value = defaultArea;

    form.addEventListener('input', function () {
      if (started) return;
      started = true;
      track('ducting_form_start', {service: 'ducting_ac', form_id: form.id});
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var data = {
        nama: clean(form.elements.nama.value, 100),
        phone: clean(form.elements.phone.value, 30),
        area: clean(form.elements.area.value, 80),
        project_type: clean(form.elements.project_type.value, 80),
        room_size: clean(form.elements.room_size.value, 40),
        timeline: clean(form.elements.timeline.value, 40),
        notes: clean(form.elements.notes.value, 500)
      };

      var digits = data.phone.replace(/\D/g, '');
      if (!data.nama || !/^\+?[\d()\s-]+$/.test(data.phone) || !/^\d{8,15}$/.test(digits)) {
        status.textContent = 'Nomor WhatsApp belum valid. Periksa kembali.';
        form.elements.phone.focus();
        return;
      }

      var signature = JSON.stringify(data);
      if (signature !== lastSignature) {
        leadId = newLeadId();
        lastSignature = signature;
      }

      var params = {
        service: 'ducting_ac',
        lead_type: 'whatsapp_handoff',
        lead_id: leadId,
        area: data.area,
        project_type: data.project_type,
        room_size: data.room_size,
        timeline: data.timeline,
        form_id: form.id || 'ductingLeadForm'
      };

      function recordHandoff() {
        if (trackedId === leadId) return;
        trackedId = leadId;
        track('generate_lead', params);
      }

      var sourceTag = window.acleanAttributionTag ? window.acleanAttributionTag() : '';
      var attribution = window.acleanAttribution ? window.acleanAttribution() : {};
      var message = [
        'Halo AClean, saya ingin konsultasi DUCTING AC.',
        'Kode konsultasi: ' + leadId,
        'Halaman asal: ' + location.pathname,
        '',
        'Nama: ' + data.nama,
        'No. WhatsApp: ' + data.phone,
        'Area proyek: ' + data.area,
        'Jenis proyek: ' + data.project_type,
        'Perkiraan luas: ' + data.room_size,
        'Target waktu: ' + data.timeline,
        'Catatan: ' + (data.notes || '-'),
        '',
        'Sumber: ' + (sourceTag || 'WEBSITE'),
        'Kampanye: ' + (attribution.campaign || '-')
      ].join('\n');

      button.disabled = true;
      button.textContent = 'Membuka WhatsApp…';
      if (fallbackButton) {
        fallbackButton.remove();
        fallbackButton = null;
      }
      var waURL = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message);
      var opened = null;
      try {
        // Buka sinkron dari submit. noopener pada window.open dapat mengembalikan
        // null walaupun berhasil; putus opener sebelum mengunjungi situs luar.
        opened = window.open('', '_blank');
        if (opened) {
          opened.opener = null;
          opened.location.href = waURL;
        }
      } catch (e) {
        if (opened) opened.close();
        opened = null;
      }
      if (opened) {
        recordHandoff();
        status.textContent = 'WhatsApp dibuka. Tekan Kirim di WhatsApp agar tim menerima detail Anda. Kode: ' + leadId;
      } else {
        track('ducting_wa_blocked', {service: 'ducting_ac', form_id: form.id});
        status.textContent = 'Browser tidak membuka WhatsApp. Lanjutkan melalui tombol di bawah.';
        fallbackButton = document.createElement('button');
        fallbackButton.type = 'button';
        fallbackButton.className = 'lead-submit';
        fallbackButton.textContent = 'Buka WhatsApp di tab ini';
        fallbackButton.addEventListener('click', function () {
          recordHandoff();
          location.assign(waURL);
        });
        status.insertAdjacentElement('afterend', fallbackButton);
      }

      setTimeout(function () {
        button.disabled = false;
        button.textContent = '💬 Kirim detail & buka WhatsApp';
      }, 1500);
    });
  }

  function boot() {
    document.querySelectorAll('.ducting-lead-form').forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
