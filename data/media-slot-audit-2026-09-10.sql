-- Slot gambar yang ditemukan belum terdaftar pada audit 10 September 2026.
-- Aman dijalankan berulang: slug yang sudah ada tidak ditimpa.

insert into public.media_slot
  (slug, kelompok, ref, judul, halaman, keterangan, path, alt,
   versi, urutan, aktif, sumber_lokal)
values
  ('paket/cleaning', 'paket', 'cleaning',
   'Paket — Jasa Cleaning AC', 'index.html#paket',
   'Kartu Jasa Cleaning AC pada Detail Layanan & Paket Perawatan',
   'paket/cleaning.jpg', 'Jasa cleaning AC profesional AClean',
   1, 10, true, 'images/hero-cleaning-ac.webp'),
  ('paket/service-besar', 'paket', 'service-besar',
   'Paket — Service Besar AC', 'index.html#paket',
   'Kartu Service Besar AC pada Detail Layanan & Paket Perawatan',
   'paket/service-besar.jpg', 'Teknisi AClean service besar AC',
   1, 20, true, 'images/hero-teknisi-aclean.webp'),
  ('paket/freon-original', 'paket', 'freon-original',
   'Paket — Pengisian Freon Original', 'index.html#paket',
   'Kartu Pengisian Freon Original pada Detail Layanan & Paket Perawatan',
   'paket/freon-original.jpg', 'Pengisian freon original oleh teknisi AClean',
   1, 30, true, 'images/pengisian-freon-ac-original-daikin.jpg'),
  ('paket/pasang-baru', 'paket', 'pasang-baru',
   'Paket — Pemasangan AC Baru', 'index.html#paket',
   'Kartu Pemasangan AC Baru pada Detail Layanan & Paket Perawatan',
   'paket/pasang-baru.jpg', 'Pemasangan AC baru oleh AClean',
   1, 40, true, 'images/home-pasang.jpg'),
  ('paket/bongkar-pasang', 'paket', 'bongkar-pasang',
   'Paket — Bongkar Pasang AC', 'index.html#paket',
   'Kartu Bongkar Pasang AC pada Detail Layanan & Paket Perawatan',
   'paket/bongkar-pasang.jpg', 'Pengecekan AC sebelum bongkar pasang',
   1, 50, true, 'images/blog-maintenance.jpg'),
  ('paket/perawatan-berkala', 'paket', 'perawatan-berkala',
   'Paket — Perawatan Berkala', 'index.html#paket',
   'Kartu Perawatan Berkala pada Detail Layanan & Paket Perawatan',
   'paket/perawatan-berkala.jpg',
   'Teknisi bersertifikat untuk perawatan berkala AC',
   1, 60, true, 'images/daikin-training-teknisi.jpg'),
  ('halaman/ducting-proses', 'halaman', 'ducting-proses',
   'Halaman Ducting — Proses Pengerjaan', 'ducting-ac.html',
   'Visual empat tahap survei, fabrikasi, instalasi, dan balancing',
   'halaman/ducting-proses.jpg', 'Empat tahap pengerjaan ducting AC AClean',
   1, 65, true, 'images/ducting-aclean-process-v2.jpg')
on conflict (slug) do nothing;

-- Slot dari desain lama yang tidak lagi memiliki elemen gambar pada situs.
-- Baris dan berkas tetap disimpan agar mudah diaktifkan kembali bila desain
-- tersebut dipakai lagi.
update public.media_slot
set aktif = false, updated_at = now()
where slug in (
  'blog/ac-bocor',
  'blog/ac-tidak-dingin',
  'halaman/cuci-ac',
  'halaman/perbaikan-ac',
  'halaman/pasang-ac',
  'halaman/isi-freon',
  'halaman/bongkar-pasang-ac',
  'halaman/service-ac-central'
);
