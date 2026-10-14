# Pengukuran DCT dan akses akun dari VS Code

Perubahan HTML/JavaScript mengatur website. Status iklan, bid, jadwal, target,
penautan GA4, serta conversion goals berada di akun Google. Deploy website
tidak otomatis mengubah pengaturan tersebut.

## Event dan definisinya

| Event | Arti | Penggunaan |
| --- | --- | --- |
| `ducting_form_start` | Mulai mengisi form | Analisis funnel |
| `ducting_wa_blocked` | Browser tidak membuka WhatsApp | Diagnosis hambatan |
| `generate_lead` | Form valid diteruskan ke WhatsApp | Interaksi; Secondary |
| `wa_click` | Klik WhatsApp langsung | Interaksi; Secondary |
| `phone_click` | Klik nomor telepon | Interaksi; Secondary |
| Lead diterima / terkualifikasi | Tim memverifikasi chat masuk dan kebutuhan | Primary setelah proses pencatatan/import tersedia |

`generate_lead` mempertahankan nama event lama, tetapi `lead_type` kini
`whatsapp_handoff`. Ini belum membuktikan pesan dikirim, diterima, atau proyek menang.
Tidak ada event `qualified_lead`/`survey_booked`/`won_project` otomatis saat ini.

Kode konsultasi acak dibuat per isian form dan dimasukkan ke pesan WhatsApp
serta event. Pengajuan ulang isian yang sama pada halaman yang sama memakai
kode yang sama dan tidak menggandakan event. Halaman asal dicatat sebagai
`source_page`; `landing_page` adalah halaman awal atribusi paid terakhir.
Preview localhost/file tidak memuat tag GA4 production.

Nama, telepon, dan catatan hanya diteruskan dalam pesan yang harus dikirim
pengguna di WhatsApp. Form belum menyimpan data ke database. Jangan membuat
custom dimension untuk kode unik (cardinality tinggi); gunakan kode di log chat
dan detail/export event untuk pencocokan.

## Membaca akun dari terminal VS Code

Script `scripts/audit-google-accounts.mjs` hanya membaca akun, tanpa mengubah
campaign/budget/konversi. Tidak memerlukan package tambahan; gunakan Node 20.6+.

1. Buat `.env.local` menggunakan field pada `.env.example` dan isi kredensial
   secara lokal. `.env.local` sudah diabaikan Git. Pastikan property ID cocok
   dengan GA4 milik website; angka dalam contoh berasal dari konfigurasi lama.
2. OAuth Google harus memiliki izin membaca Analytics (`analytics.readonly`)
   dan akses Google Ads (`adwords`). Untuk Google Ads diperlukan developer token
   yang boleh mengakses akun production serta customer ID akun yang benar.
3. Jalankan pemeriksaan konfigurasi, lalu audit:

```sh
node --env-file=.env.local scripts/audit-google-accounts.mjs --check --ga4 --ads
node --env-file=.env.local scripts/audit-google-accounts.mjs --ga4
node --env-file=.env.local scripts/audit-google-accounts.mjs --ads
```

Access token bersifat sementara. Jika kadaluarsa, login ulang melalui workflow
OAuth resmi. Jangan menyimpan developer token atau OAuth token dalam JavaScript
website, HTML, CSV publik, atau commit. Script belum menyiapkan login OAuth.

## Pemeriksaan akun sebelum mengubah kampanye

- Periode laporan 13–14 Oktober 2026 untuk launch ini; `TODAY` ikut dibaca script.
- Campaign/ad group Enabled, ads Eligible; periksa alasan policy/review.
- Keyword aktif dan tidak terblokir negative keywords; evaluasi search volume/bid.
- Jadwal, lokasi, audience, dan bid sesuai kebutuhan bisnis; jangan menaikkan
  budget hanya karena impressions nol sebelum alasan serving diketahui.
- Verifikasi link GA4 dan auto-tagging, kemudian import event yang diperlukan.
  Primary/Secondary harus diperiksa di Google Ads, bukan diasumsikan dari kode.
- Selama tracking masih berbasis WhatsApp handoff, gunakan manual CPC/klik sesuai
  strategi yang disetujui. Gunakan lead terkualifikasi yang tercatat sebagai
  sasaran bidding setelah datanya tersedia.

## Evaluasi 14 hari

Catat kode konsultasi chat yang benar-benar masuk, area, kebutuhan, valid/tidak,
jadwal survei, penawaran, hasil proyek, dan biaya iklan harian. Bandingkan dengan
klik/form handoff; angka handoff bisa lebih besar atau lebih kecil dari jumlah
chat masuk. Chat langsung tanpa form tidak mempunyai kode form.

Referensi resmi:

- [Google Ads API: authorization](https://developers.google.com/google-ads/api/rest/auth)
- [Google Analytics Admin API](https://developers.google.com/analytics/devguides/config/admin/v1/rest)
- [Import GA4 ke Google Ads](https://support.google.com/google-ads/answer/2375435)
