/* AClean — qualified lead form for ducting landing pages. */
(function () {
  var WA_NUMBER = '6281289898937';

  function clean(value, max) {
    return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max || 500);
  }

  function init(form) {
    var section = form.closest('.lead-section');
    var defaultArea = section && section.getAttribute('data-default-area');
    var area = form.elements.area;
    var status = form.querySelector('.lead-form-status');
    var button = form.querySelector('button[type="submit"]');

    if (defaultArea && area && !area.value) area.value = defaultArea;

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

      if (!/^[-+()\d\s]{8,30}$/.test(data.phone)) {
        status.textContent = 'Nomor WhatsApp belum valid. Periksa kembali.';
        form.elements.phone.focus();
        return;
      }

      if (window.acleanTrack) {
        window.acleanTrack('generate_lead', {
          service: 'ducting_ac',
          lead_type: 'qualified_wa',
          area: data.area,
          project_type: data.project_type,
          room_size: data.room_size,
          timeline: data.timeline,
          form_id: form.id || 'ductingLeadForm'
        });
      }

      var sourceTag = window.acleanAttributionTag ? window.acleanAttributionTag() : '';
      var attribution = window.acleanAttribution ? window.acleanAttribution() : {};
      var message = [
        'Halo AClean, saya ingin konsultasi DUCTING AC.',
        '',
        'Nama: ' + data.nama,
        'No. WhatsApp: ' + data.phone,
        'Area proyek: ' + data.area,
        'Jenis proyek: ' + data.project_type,
        'Perkiraan luas: ' + data.room_size,
        'Target waktu: ' + data.timeline,
        'Catatan: ' + (data.notes || '-'),
        '',
        'Sumber: ' + (sourceTag || 'ORGANIK'),
        'Kampanye: ' + (attribution.campaign || '-')
      ].join('\n');

      button.disabled = true;
      button.textContent = 'Membuka WhatsApp…';
      status.textContent = 'Detail tersimpan di pesan WhatsApp. Mohon lanjutkan pengiriman pesan.';
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(message), '_blank', 'noopener');

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
