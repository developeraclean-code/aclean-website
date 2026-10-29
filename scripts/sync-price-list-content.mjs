import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'backlinks') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html') && !file.endsWith('__raw.html'));

function edit(file, replacements) {
  const full = path.join(root, file);
  let content = fs.readFileSync(full, 'utf8');
  let changed = false;
  for (const [from, to] of replacements) {
    const next = content.replaceAll(from, to);
    if (next !== content) changed = true;
    content = next;
  }
  if (changed) fs.writeFileSync(full, content);
}

function editMatching(predicate, replacements) {
  for (const full of htmlFiles.filter(predicate)) {
    edit(path.relative(root, full), replacements);
  }
}

// Tarif lama cleaning AC dan hasil perkalian tahunannya.
editMatching(() => true, [
  ['Rp 85.000', 'Rp 95.000'],
  ['Rp 85rb', 'Rp 95rb'],
  ['Rp 340.000/tahun', 'Rp 380.000/tahun'],
]);

// Artikel yang secara khusus masih menawarkan freon Rp450.000.
for (const file of [
  'blog/ac-bocor-penyebab-solusi.html',
  'blog/biaya-service-ac-tangerang-2026.html',
  'blog/freon-r32-vs-r410.html',
  'blog/jasa-service-ac-alam-sutera.html',
  'blog/jasa-service-ac-bintaro.html',
  'blog/jasa-service-ac-bsd.html',
  'blog/jasa-service-ac-gading-serpong.html',
  'blog/jasa-service-ac-graha-raya.html',
  'blog/jasa-service-ac-karawaci.html',
  'blog/kapan-harus-isi-freon-ac.html',
  'blog/kenapa-ac-tidak-dingin.html',
  'blog/tips-bongkar-pasang-ac-pindahan.html',
]) {
  edit(file, [['Rp 450.000', 'Rp 500.000']]);
}

edit('blog/daftar-harga-service-ac-2026.html', [
  ['<tr><td>Freon R-22</td><td>Rp 450.000</td><td>14 hari</td></tr>', '<tr><td>Freon R-22</td><td>Rp 500.000</td><td>14 hari</td></tr>'],
  ['<tr><td>AC 1/2 PK</td><td>Rp 450.000</td><td>Pasang + pipe 3m</td></tr>', '<tr><td>Jasa pasang AC 0,5–1 PK</td><td>Rp 400.000</td><td>Jasa saja; material terpisah</td></tr>'],
  ['Berikut adalah透明harga service AC terbaru di AClean Service. Semua harga sudah includ pajak dan biaya antar.', 'Berikut daftar harga jasa AClean yang bersumber dari price_list aktif. Material dan pekerjaan tambahan yang tidak tercantum dihitung terpisah setelah dikonfirmasi.'],
  ['<tr><td>Cleaning AC Split 2 PK</td><td>Rp 110.000</td><td>Indoor + Outdoor</td></tr>\n<tr><td>Cleaning AC Window</td><td>Rp 75.000</td><td>Full unit</td></tr>\n<tr><td>Cleaning AC Cassette</td><td>Rp 150.000</td><td>Per unit</td></tr>', '<tr><td>Cleaning AC Split 1,5–2,5 PK</td><td>Rp 100.000</td><td>Per unit</td></tr>\n<tr><td>Cleaning AC Cassette 2–6 PK</td><td>Rp 250.000–Rp 600.000</td><td>Sesuai kapasitas</td></tr>\n<tr><td>Cleaning AC Split Duct 1,6–6 PK</td><td>Rp 200.000–Rp 600.000</td><td>Sesuai kapasitas</td></tr>'],
  ['<tr><td>Service Kecil</td><td>Rp 100.000</td><td>Diagnosa + minor repair</td></tr>\n<tr><td>Service Sedang</td><td>Rp 200.000</td><td>Tanpa Bongkar</td></tr>\n<tr><td>Service Besar (Deep Clean)</td><td>Rp 400.000</td><td>Bongkar + deep cleaning</td></tr>\n<tr><td>Overhaul</td><td>Rp 600.000</td><td>Full dismantle + cleaning</td></tr>', '<tr><td>Cek &amp; Diagnosa</td><td>Rp 100.000</td><td>Per kunjungan</td></tr>\n<tr><td>Service Besar 0,5–1 PK</td><td>Rp 400.000</td><td>Per unit</td></tr>\n<tr><td>Service Besar 1,5–2 PK</td><td>Rp 450.000</td><td>Per unit</td></tr>\n<tr><td>Perbaikan PCB / Elektrik</td><td>Rp 250.000</td><td>Jasa; komponen terpisah</td></tr>'],
  ['<tr><td>Freon R-32</td><td>Rp 350.000</td><td>14 hari</td></tr>\n<tr><td>Freon R-410A</td><td>Rp 400.000</td><td>14 hari</td></tr>\n<tr><td>Freon R-22</td><td>Rp 500.000</td><td>14 hari</td></tr>\n<tr><td>Vacuum + Kuras</td><td>+Rp 150.000</td><td>Wajib untuk AC lama</td></tr>', '<tr><td>Freon R-32</td><td>Rp 500.000</td><td>Isi freon saja</td></tr>\n<tr><td>Freon R-410A</td><td>Rp 500.000</td><td>Isi freon saja</td></tr>\n<tr><td>Freon R-22</td><td>Rp 500.000</td><td>Isi freon saja</td></tr>\n<tr><td>Kuras Vacuum + Freon</td><td>Rp 650.000</td><td>Per unit</td></tr>'],
  ['<tr><td>AC 3/4 PK</td><td>Rp 500.000</td><td>Pasang + pipe 3m</td></tr>\n<tr><td>AC 1 PK</td><td>Rp 550.000</td><td>Pasang + pipe 3m</td></tr>\n<tr><td>AC 1.5 PK - 2 PK</td><td>Rp 650.000</td><td>Pasang + pipe 4m</td></tr>', '<tr><td>Jasa pasang AC 1,5–2 PK</td><td>Rp 450.000</td><td>Jasa saja; material terpisah</td></tr>\n<tr><td>Jasa pasang AC apartemen</td><td>Rp 350.000</td><td>Jasa saja; material terpisah</td></tr>'],
  ['<li>Harga sudah termasuk PPN dan alat kerja teknisi</li>', '<li>Harga jasa mengikuti price_list aktif; material dan pekerjaan tambahan dikonfirmasi terpisah</li>'],
  ['Biaya transport luar area akanhitung terpisah', 'Biaya transport luar area dihitung terpisah'],
  ['Tidak yakin layanan mana yang нужны?', 'Tidak yakin layanan mana yang dibutuhkan?'],
]);

edit('blog/biaya-service-ac-tangerang-2026.html', [
  ['<tr><td>Cleaning AC Deep Clean</td><td><strong>Rp 150.000/unit</strong></td><td>Rp 150.000 - Rp 250.000</td></tr>\n<tr><td>Service Besar (Overhaul)</td><td><strong>Rp 400.000/unit</strong></td><td>Rp 350.000 - Rp 600.000</td></tr>', '<tr><td>Service Besar 0,5–1 PK</td><td><strong>Rp 400.000/unit</strong></td><td>Rp 350.000 - Rp 600.000</td></tr>\n<tr><td>Service Besar 1,5–2 PK</td><td><strong>Rp 450.000/unit</strong></td><td>Rp 400.000 - Rp 650.000</td></tr>'],
  ['<tr><td>Pemasangan AC Baru</td><td><strong>Hubungi kami</strong></td><td>Rp 500.000 - Rp 1.500.000</td></tr>', '<tr><td>Jasa Pemasangan AC Baru</td><td><strong>Rp 400.000–Rp 450.000</strong></td><td>Material terpisah</td></tr>'],
  ['<tr><td>Bongkar Pasang AC</td><td><strong>Hubungi kami</strong></td><td>Rp 400.000 - Rp 1.000.000</td></tr>', '<tr><td>Relokasi AC Lengkap</td><td><strong>Mulai Rp 550.000</strong></td><td>Material terpisah</td></tr>'],
  ['<tr><td>Perawatan Berkala (Central)</td><td><strong>Rp 100.000/PK</strong></td><td>Rp 100.000 - Rp 200.000/PK</td></tr>', '<tr><td>Kontrak Perawatan Central</td><td><strong>Penawaran setelah survei</strong></td><td>Sesuai jumlah dan kapasitas unit</td></tr>'],
  ['Untuk AC cassette, standing floor, atau central, hubungi kami untuk penawaran khusus.', 'Cleaning cassette Rp 250.000–Rp 600.000 dan standing floor Rp 250.000–Rp 500.000 sesuai kapasitas. Sistem central/VRV memerlukan survei.'],
]);

// Landing page area: bongkar-pasang lengkap adalah bongkar unit kecil Rp150.000
// + pasang kembali indoor/outdoor Rp400.000 = mulai Rp550.000.
editMatching((file) => /service-ac-.*\.html$/.test(file), [
  ['<div class="nm">Bongkar Pasang</div>\n        <div class="pr">Rp 350.000/unit</div>', '<div class="nm">Bongkar Pasang</div>\n        <div class="pr">Mulai Rp 550.000/unit</div>'],
  ['<tr><td>Bongkar Pasang AC</td><td>Mulai Rp 200.000</td><td>Pindah lokasi</td></tr>', '<tr><td>Bongkar Pasang AC</td><td>Mulai Rp 550.000</td><td>Bongkar unit + pasang kembali; material terpisah</td></tr>'],
  ['<tr><td>Bongkar Pasang</td><td>Mulai Rp 200.000</td><td>AC pindahan</td></tr>', '<tr><td>Bongkar Pasang</td><td>Mulai Rp 550.000</td><td>Bongkar unit + pasang kembali; material terpisah</td></tr>'],
  ['<tr><td>Isi Freon R-22</td><td>Mulai Rp 400.000</td><td>Per unit</td></tr>', '<tr><td>Isi Freon R-22</td><td>Rp 500.000</td><td>Per unit</td></tr>'],
  ['Termasuk instalasi pipa, kabel, dan bracket outdoor.', 'Harga tersebut hanya untuk jasa pemasangan unit; pipa, kabel, vacuum, dan bracket dihitung terpisah.'],
  ['Termasuk instalasi pipa, kabel, dan bracket outdoor rapi.', 'Harga tersebut hanya untuk jasa pemasangan unit; pipa, kabel, vacuum, dan bracket dihitung terpisah.'],
  ['Termasuk instalasi pipa dan kabel rapi.', 'Harga tersebut hanya untuk jasa pemasangan unit; pipa, kabel, vacuum, dan bracket dihitung terpisah.'],
  ['Harga pasang mulai Rp 400.000/unit termasuk material standar.', 'Harga jasa pasang mulai Rp 400.000/unit; material instalasi dihitung terpisah sesuai kebutuhan.'],
  ['Harga instalasi mulai Rp 400.000/unit, sudah termasuk bracket, pipa standar, dan kabel listrik.', 'Harga jasa instalasi mulai Rp 400.000/unit; bracket, pipa, kabel, dan vacuum dihitung terpisah.'],
  ['<td>Mulai Rp 400.000</td><td>Termasuk instalasi</td>', '<td>Rp 400.000</td><td>Jasa pemasangan saja</td>'],
  ['<td>Mulai Rp 450.000</td><td>Termasuk instalasi</td>', '<td>Rp 450.000</td><td>Jasa pemasangan saja</td>'],
]);

// Halaman pemasangan utama: price_list menyatakan "hanya pemasangan saja".
edit('pasang-ac.html', [
  ['Pipa &amp; kabel standar termasuk', 'Jasa pemasangan unit saja'],
  ['Harga sudah termasuk jasa pemasangan, pipa standar 2 meter, kabel, dan bracket outdoor. Tidak ada biaya tersembunyi.', 'Harga berikut hanya untuk jasa pemasangan unit indoor dan outdoor. Pipa, kabel, vacuum, bracket, dan material lain dihitung terpisah sesuai kebutuhan.'],
  ['<li>Pipa standar 2 meter included</li>', '<li>Pipa dihitung terpisah sesuai jenis dan panjang aktual</li>'],
  ['<li>Kabel &amp; bracket outdoor included</li>', '<li>Kabel dan bracket outdoor dihitung terpisah</li>'],
  ['<li>Pipa standar 3 meter included</li>', '<li>Pipa dihitung terpisah sesuai jenis dan panjang aktual</li>'],
  ['<li>Kabel, bracket &amp; isolasi included</li>', '<li>Kabel, bracket, dan isolasi dihitung terpisah</li>'],
  ['Apakah harga sudah termasuk pipa dan kabel?</h3><p style="font-size:14px;color:var(--gray-500);line-height:1.7;">Ya, harga sudah termasuk pipa standar 2–3 meter, kabel, bracket outdoor, dan bahan instalasi dasar. Jika pipa perlu lebih panjang, akan ada biaya tambahan yang kami informasikan sebelumnya.', 'Apakah harga sudah termasuk pipa dan kabel?</h3><p style="font-size:14px;color:var(--gray-500);line-height:1.7;">Belum. Harga Rp 400.000–Rp 450.000 adalah jasa pemasangan unit saja. Pipa, kabel, vacuum, bracket outdoor, dan material lain dihitung terpisah berdasarkan kebutuhan aktual dan diinformasikan sebelum pekerjaan dimulai.'],
]);

edit('index.html', [
  ['Pemasangan AC baru profesional semua merk. Termasuk instalasi pipa, kabel & outdoor bracket.', 'Pemasangan AC baru profesional semua merek. Harga jasa pemasangan; pipa, kabel, vacuum, dan bracket dihitung terpisah.'],
  ['Mulai Rp 250.000</span><span class="un">/unit</span>', 'Mulai Rp 150.000</span><span class="un">/unit bongkar</span>'],
]);

edit('isi-freon.html', [
  ['Cek kebocoran gratis.', 'Pengecekan tersedia terpisah.'],
  ['Cek Kebocoran Gratis', 'Pengecekan Terpisah'],
  ['Harga ditentukan berdasarkan jenis freon dan kapasitas AC. Cek kebocoran selalu kami lakukan sebelum pengisian.', 'Harga Rp 500.000 adalah untuk isi freon saja. Diagnosa, test press, vacuum, dan perbaikan kebocoran merupakan layanan terpisah dan dikonfirmasi sebelum dikerjakan.'],
  ['<h3>Cek Kebocoran</h3><p>Kami cek kebocoran pipa freon dulu sebelum pengisian agar tidak sia-sia.</p><div class="price-vector-value">Rp 550.000 <small>/unit</small></div>', '<h3>Test Press Unit</h3><p>Pengujian tekanan untuk membantu menemukan indikasi kebocoran. Perbaikan dan material dihitung terpisah.</p><div class="price-vector-value">Rp 550.000 <small>/unit</small></div>'],
  ['<strong>Cek kebocoran sebelum isi</strong><small>Tekanan disesuaikan dengan tipe refrigerant AC</small>', '<strong>Pemeriksaan sebelum pengisian</strong><small>Diagnosa atau test press dikonfirmasi sebagai layanan terpisah</small>'],
  ['Jika bocor, kami repair dulu agar freon tidak cepat habis lagi.', 'Jika ditemukan indikasi bocor, biaya perbaikan kami informasikan untuk persetujuan sebelum dikerjakan.'],
]);

edit('service-ac-tangerang-selatan.html', [
  ['Isi freon sesuai tipe: R32, R410A, R22. Cek kebocoran gratis sebelum pengisian.', 'Isi freon sesuai tipe: R32, R410A, atau R22. Harga untuk isi freon saja; pemeriksaan dan perbaikan terpisah.'],
  ['<li>Cek kebocoran gratis</li>', '<li>Diagnosa atau test press tersedia terpisah</li>'],
]);

edit('perbaikan-ac.html', [
  ['<ul class="sc-feat"><li>Deteksi &amp; perbaikan kebocoran freon</li><li>Isi freon original (R32 / R410)</li><li>Test tekanan &amp; suhu</li><li>Garansi perbaikan</li></ul>', '<ul class="sc-feat"><li>Isi freon original (R22 / R32 / R410A)</li><li>Harga untuk isi freon saja</li><li>Diagnosa, test press, dan vacuum terpisah</li><li>Perbaikan dan sparepart dikonfirmasi dulu</li></ul>'],
  ['<h3>Ganti Sparepart</h3>\n          <p>Penggantian komponen rusak — kapasitor, modul PCB, thermistor, hingga kompresor.</p>\n          <div class="sc-price"><span class="amt">Rp 350.000</span><span class="un">/mulai</span></div>', '<h3>Jasa Pemasangan Sparepart</h3>\n          <p>Jasa pemasangan komponen pengganti. Harga sparepart dikonfirmasi terpisah sebelum pekerjaan.</p>\n          <div class="sc-price"><span class="amt">Rp 250.000</span><span class="un">/jasa</span></div>'],
  ['penggantian sparepart seperti kapasitor atau modul mulai Rp 350.000 tergantung komponen', 'jasa pemasangan sparepart Rp 250.000 dengan harga komponen dikonfirmasi terpisah'],
  ['penggantian sparepart seperti kapasitor atau modul mulai <strong>Rp 350.000</strong> tergantung komponen', 'jasa pemasangan sparepart <strong>Rp 250.000</strong> dengan harga komponen dikonfirmasi terpisah'],
]);

for (const file of ['blog/freon-r32-vs-r410.html', 'blog/kapan-harus-isi-freon-ac.html']) {
  edit(file, [
    ['Freon + cek tekanan + garansi', 'Isi freon saja'],
    ['Harga Rp 500.000 sudah termasuk pengecekan kebocoran, vacuum, dan garansi 14 hari.', 'Harga Rp 500.000 adalah untuk isi freon saja. Kuras vacuum + freon Rp 650.000 dan test press Rp 550.000 merupakan layanan terpisah.'],
    ['Harga Rp 500.000 sudah termasuk pengecekan tekanan, deteksi kebocoran, vacuum, dan garansi 14 hari.', 'Harga Rp 500.000 adalah untuk isi freon saja. Kuras vacuum + freon Rp 650.000 dan test press Rp 550.000 merupakan layanan terpisah.'],
  ]);
}

// FAQ harus membedakan bongkar unit dari relokasi lengkap.
edit('faq.html', [
  ['Biaya bongkar pasang AC di AClean mulai dari Rp 150.000 per unit untuk AC ½PK-1PK. Harga sudah termasuk pembongkaran unit lama, pemindahan ke lokasi baru, dan pemasangan kembali. Untuk jarak jauh atau pekerjaan yang memerlukan tambahan material, hubungi kami untuk konsultasi.', 'Biaya bongkar unit mulai Rp 150.000 untuk 0,5–1 PK dan Rp 200.000 untuk 1,5–2,5 PK. Relokasi lengkap mulai Rp 550.000, terdiri dari bongkar unit Rp 150.000 ditambah pemasangan kembali indoor dan outdoor Rp 400.000. Vacuum, pipa, kabel, bracket, dan material lain dihitung terpisah.'],
  ['Biaya bongkar pasang AC di AClean mulai dari <strong>Rp 150.000 per unit</strong> untuk AC ½PK-1PK. Harga sudah termasuk pembongkaran unit lama, pemindahan ke lokasi baru, dan pemasangan kembali. Untuk jarak jauh atau pekerjaan yang memerlukan tambahan material, hubungi kami untuk konsultasi.', 'Biaya bongkar unit mulai <strong>Rp 150.000</strong> untuk 0,5–1 PK dan <strong>Rp 200.000</strong> untuk 1,5–2,5 PK. Relokasi lengkap mulai <strong>Rp 550.000</strong>, terdiri dari bongkar unit Rp 150.000 ditambah pemasangan kembali indoor dan outdoor Rp 400.000. Vacuum dan material dihitung terpisah.'],
]);

edit('perbaikan-ac.html', [
  ['Perbaikan AC tidak dingin + isi freon mulai Rp 250.000', 'Penanganan AC tidak dingin dengan isi freon mulai Rp 500.000'],
  ['Perbaikan AC tidak dingin + isi freon mulai <strong>Rp 250.000</strong>', 'Penanganan AC tidak dingin dengan isi freon mulai <strong>Rp 500.000</strong>'],
  ['<div class="sc-price"><span class="amt">Rp 250.000</span><span class="un">/mulai</span></div>', '<div class="sc-price"><span class="amt">Rp 500.000</span><span class="un">/mulai</span></div>'],
  ['<p>Penanganan AC tidak dingin: cek kebocoran, perbaikan, dan pengisian freon original.</p>', '<p>Pengisian freon original untuk AC tidak dingin. Biaya pengecekan, perbaikan kebocoran, dan sparepart dihitung terpisah.</p>'],
]);

// Halaman bongkar-pasang utama memakai tiga item resmi dari price_list.
edit('bongkar-pasang-ac.html', [
  ['Mulai Rp 250.000.', 'Mulai Rp 150.000.'],
  ['Mulai Rp 250.000.', 'Mulai Rp 150.000.'],
  ['"priceRange": "Rp 250.000 – Rp 500.000"', '"priceRange": "Rp 150.000 – Rp 550.000"'],
  ['{"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bongkar AC Saja"}, "price": "250000", "priceCurrency": "IDR"},', '{"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bongkar AC 0,5–1 PK"}, "price": "150000", "priceCurrency": "IDR"},'],
  ['{"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bongkar + Pasang Kembali"}, "price": "450000", "priceCurrency": "IDR"},', '{"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bongkar AC 1,5–2,5 PK"}, "price": "200000", "priceCurrency": "IDR"},'],
  ['{"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Bongkar + Pasang Renovasi"}, "price": "500000", "priceCurrency": "IDR"}', '{"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Relokasi Lengkap AC 0,5–1 PK"}, "price": "550000", "priceCurrency": "IDR"}'],
  ['Biaya bongkar pasang AC di AClean mulai dari Rp 250.000 untuk bongkar saja, Rp 450.000 untuk paket bongkar + pasang kembali (sudah termasuk freon lama), dan Rp 500.000 untuk paket khusus renovasi. Harga belum termasuk pipa tambahan dan freon baru jika diperlukan.', 'Biaya bongkar unit adalah Rp 150.000 untuk 0,5–1 PK dan Rp 200.000 untuk 1,5–2,5 PK. Relokasi lengkap mulai Rp 550.000, yaitu bongkar unit Rp 150.000 ditambah pemasangan kembali indoor dan outdoor Rp 400.000. Vacuum dan material dihitung terpisah.'],
  ['<span class="hero-price-main">Rp 250.000 <small>/ unit</small></span>', '<span class="hero-price-main">Rp 150.000 <small>/ unit</small></span>'],
  ['Pilih paket sesuai kebutuhan — semua harga sudah termasuk penyimpanan freon', 'Harga mengikuti setiap komponen aktif pada daftar harga resmi AClean'],
  ['<h3>Bongkar Saja</h3>', '<h3>Bongkar AC 0,5–1 PK</h3>'],
  ['<div class="sc-price"><span class="amt">Rp 250.000</span><span class="un">/unit</span></div>', '<div class="sc-price"><span class="amt">Rp 150.000</span><span class="un">/unit</span></div>'],
  ['<h3>Bongkar + Pasang Kembali</h3>', '<h3>Bongkar AC 1,5–2,5 PK</h3>'],
  ['<p>AC dibongkar dan dipasang kembali di lokasi yang sama atau berbeda. Termasuk pipa dan kabel standar.</p>', '<p>Jasa bongkar unit AC kapasitas 1,5–2,5 PK untuk dipindahkan atau disimpan.</p>'],
  ['<div class="sc-price"><span class="amt">Rp 450.000</span><span class="un">/unit</span></div>', '<div class="sc-price"><span class="amt">Rp 200.000</span><span class="un">/unit</span></div>'],
  ['<ul class="sc-feat"><li>Bongkar + pasang sekaligus</li><li>Freon diisi kembali (freon lama)</li><li>Pipa 2 meter included</li><li>Test run setelah pemasangan</li><li>Garansi instalasi 1 bulan</li></ul>', '<ul class="sc-feat"><li>Freon diamankan sebelum unit dilepas</li><li>Unit indoor dan outdoor dilepas</li><li>Pipa existing dirapikan</li><li>Belum termasuk pemasangan kembali</li><li>Material tidak termasuk</li></ul>'],
  ['<h3>Bongkar + Pasang Renovasi</h3>', '<h3>Relokasi Lengkap AC</h3>'],
  ['<p>Khusus untuk renovasi — AC dibongkar, disimpan selama renovasi, kemudian dipasang kembali.</p>', '<p>Bongkar unit 0,5–1 PK lalu pasang kembali indoor dan outdoor di lokasi baru.</p>'],
  ['<div class="sc-price"><span class="amt">Rp 500.000</span><span class="un">/unit</span></div>', '<div class="sc-price"><span class="amt">Rp 550.000</span><span class="un">/mulai</span></div>'],
  ['<ul class="sc-feat"><li>Bongkar aman untuk renovasi</li><li>Konsultasi posisi baru gratis</li><li>Pasang kembali setelah renovasi</li><li>Isi freon ulang jika perlu</li><li>Garansi instalasi 1 bulan</li></ul>', '<ul class="sc-feat"><li>Bongkar unit kecil Rp 150.000</li><li>Pasang kembali indoor Rp 200.000</li><li>Pasang kembali outdoor Rp 200.000</li><li>Vacuum opsional Rp 50.000</li><li>Pipa, kabel, bracket, dan freon terpisah</li></ul>'],
  ['Biaya bongkar pasang AC di AClean mulai dari <strong>Rp 250.000</strong> untuk bongkar saja, <strong>Rp 450.000</strong> untuk paket bongkar + pasang kembali (sudah termasuk freon lama), dan <strong>Rp 500.000</strong> untuk paket khusus renovasi. Harga belum termasuk pipa tambahan dan freon baru jika diperlukan.', 'Biaya bongkar unit adalah <strong>Rp 150.000</strong> untuk 0,5–1 PK dan <strong>Rp 200.000</strong> untuk 1,5–2,5 PK. Relokasi lengkap mulai <strong>Rp 550.000</strong>. Vacuum, pipa, kabel, bracket, dan freon dihitung terpisah.'],
  ['Bisa. AClean memiliki <strong>paket khusus renovasi Rp 500.000 per unit</strong>. AC dibongkar dengan freon disimpan, kemudian dipasang kembali setelah renovasi selesai. Kami juga memberikan konsultasi posisi baru gratis agar AC lebih optimal setelah renovasi.', 'Bisa. Biaya renovasi dihitung dari komponen pekerjaan pada pricelist: bongkar unit Rp 150.000–Rp 200.000 dan pemasangan kembali indoor + outdoor Rp 400.000. Vacuum dan material ditambahkan hanya jika diperlukan.'],
]);

// Tiga landing page bongkar-pasang area memakai struktur kartu yang sama.
for (const file of [
  'bongkar-pasang-ac-alam-sutera.html',
  'bongkar-pasang-ac-bintaro.html',
  'bongkar-pasang-ac-bsd.html',
]) {
  edit(file, [
    ['"priceRange": "Rp 250.000 – Rp 500.000"', '"priceRange": "Rp 150.000 – Rp 550.000"'],
    ['Semua paket sudah termasuk recovery freon, pipa 2 meter, test run, dan garansi instalasi.', 'Harga jasa mengikuti pricelist aktif. Vacuum, pipa, kabel, bracket, dan material dihitung terpisah.'],
    ['Harga tetap, tidak ada biaya tersembunyi. Semua paket sudah termasuk freon recovery, pipa 2 meter, dan garansi instalasi.', 'Harga jasa mengikuti pricelist aktif. Vacuum, pipa, kabel, bracket, dan material dihitung terpisah.'],
    ['<h3>Bongkar Saja</h3>\n      <div class="price">Rp 250.000</div>', '<h3>Bongkar AC 0,5–1 PK</h3>\n      <div class="price">Rp 150.000</div>'],
    ['<h3>Bongkar + Pasang</h3>\n      <div class="price">Rp 450.000</div>', '<h3>Bongkar AC 1,5–2,5 PK</h3>\n      <div class="price">Rp 200.000</div>'],
    ['<li>Bongkar + pasang di lokasi baru</li>', '<li>Unit indoor &amp; outdoor dilepas</li>'],
    ['<li>Freon diisi kembali</li>', '<li>Freon diamankan sebelum unit dilepas</li>'],
    ['<li>Pipa 2 meter sudah termasuk</li>', '<li>Pemasangan kembali &amp; material terpisah</li>'],
    ['<h3>Paket Renovasi</h3>\n      <div class="price">Rp 500.000</div>', '<h3>Relokasi Lengkap AC</h3>\n      <div class="price">Mulai Rp 550.000</div>'],
    ['<li>Bongkar + simpan saat renovasi</li>', '<li>Bongkar unit kecil Rp 150.000</li>'],
    ['<li>Pasang kembali setelah renovasi</li>', '<li>Pasang kembali indoor + outdoor Rp 400.000</li>'],
    ['<li>Konsultasi posisi gratis</li>', '<li>Vacuum &amp; material terpisah</li>'],
  ]);
}

edit('blog/biaya-bongkar-pasang-ac-2026.html', [
  ['Harga bongkar saja Rp 250.000, bongkar+pasang Rp 450.000, renovasi Rp 500.000.', 'Bongkar unit Rp 150.000–Rp 200.000; relokasi lengkap mulai Rp 550.000.'],
  ['Harga bongkar saja Rp 250.000, bongkar+pasang Rp 450.000.', 'Bongkar unit Rp 150.000–Rp 200.000; relokasi lengkap mulai Rp 550.000.'],
  ['Biaya bongkar pasang AC di Tangerang Selatan berkisar antara <strong>Rp 250.000 – Rp 500.000 per unit</strong> tergantung paket yang dipilih, belum termasuk biaya pipa dan freon tambahan jika diperlukan.', 'Biaya bongkar unit adalah <strong>Rp 150.000–Rp 200.000 per unit</strong>. Relokasi lengkap mulai <strong>Rp 550.000</strong>; vacuum dan material dihitung terpisah.'],
  ['<td class="price">Rp 250.000</td>', '<td class="price">Rp 150.000–Rp 200.000</td>'],
  ['<td class="price">Rp 450.000</td>', '<td class="price">Mulai Rp 550.000</td>'],
  ['Bongkar + pasang di lokasi baru, freon diisi kembali, pipa 2m, test run, garansi 1 bulan', 'Bongkar unit kecil Rp 150.000 + pemasangan kembali indoor dan outdoor Rp 400.000; material terpisah'],
  ['<td><strong>Bongkar + Pasang Renovasi</strong><br><span style="font-size:12px;color:var(--gray-400)">Khusus renovasi rumah</span></td>\n        <td class="price">Rp 500.000</td>\n        <td>Bongkar, simpan selama renovasi, pasang kembali, konsultasi posisi baru gratis, garansi 1 bulan</td>', '<td><strong>Vacuum AC</strong><br><span style="font-size:12px;color:var(--gray-400)">Opsional saat pemasangan kembali</span></td>\n        <td class="price">Rp 50.000</td>\n        <td>Jasa vacuum untuk AC 0,5–2,5 PK; freon dan material tidak termasuk</td>'],
  ['Setiap paket sudah termasuk pipa standar 2 meter. Jika lokasi baru membutuhkan pipa lebih panjang, biaya tambahan sekitar <strong>Rp 35.000–50.000 per meter</strong> tergantung jenis pipa (standar atau premium).', 'Pipa tidak termasuk harga jasa. Harga pipa aktif adalah <strong>Rp 150.000/meter untuk 1 PK, Rp 170.000/meter untuk 2 PK, dan Rp 240.000/meter untuk 2,5 PK</strong>.'],
  ['Freon R-32 (untuk AC inverter modern): Rp 450.000–600.000', 'Freon R-32 (untuk AC inverter modern): Rp 500.000'],
  ['Freon R-410A: Rp 500.000–650.000', 'Freon R-410A: Rp 500.000'],
  ['Freon R-22 (AC lama): Rp 300.000–400.000', 'Freon R-22 (AC lama): Rp 500.000'],
  ['Biaya tambahan sekitar <strong>Rp 25.000–40.000 per meter</strong>.', 'Biaya kabel aktif adalah <strong>Rp 35.000/meter untuk 3×1,5 dan Rp 45.000/meter untuk 3×2,5</strong>.'],
  ['bracket baru dikenakan biaya <strong>Rp 150.000–200.000 per set</strong>', 'bracket baru dikenakan biaya <strong>Rp 150.000 per set</strong>'],
]);

edit('blog/bongkar-ac-untuk-renovasi.html', [
  ['<strong>Paket Bongkar Renovasi:</strong> Rp 500.000/unit — termasuk bongkar + pasang kembali + konsultasi posisi baru gratis + garansi instalasi 1 bulan', '<strong>Relokasi lengkap:</strong> mulai Rp 550.000/unit — bongkar unit kecil Rp 150.000 + pemasangan kembali indoor dan outdoor Rp 400.000; vacuum dan material terpisah'],
  ['<strong>Bongkar saja</strong> (jika pasangnya nanti sendiri atau pakai jasa lain): Rp 250.000/unit', '<strong>Bongkar saja:</strong> Rp 150.000/unit untuk 0,5–1 PK atau Rp 200.000/unit untuk 1,5–2,5 PK'],
  ['Pipa tambahan (jika posisi baru berbeda jauh): Rp 35.000–50.000/meter', 'Pipa tambahan: Rp 150.000/meter (1 PK), Rp 170.000/meter (2 PK), atau Rp 240.000/meter (2,5 PK)'],
  ['Pengeboran dinding baru: sudah termasuk dalam paket', 'Pekerjaan tambahan seperti pengeboran dinding dihitung setelah pemeriksaan lokasi'],
  ['Bracket baru jika diperlukan: Rp 150.000–200.000/set', 'Bracket baru jika diperlukan: Rp 150.000/set'],
]);

// AC central/split duct memakai tarif per kapasitas dari price_list, bukan tarif per-PK buatan.
edit('service-ac-central.html', [
  ['"priceRange": "Rp 300.000 – Rp 5.000.000"', '"priceRange": "Rp 100.000 – Rp 600.000"'],
  ['<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 100.000/PK</span></div>', '<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 200.000/unit</span></div>'],
  ['<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 300.000</span></div>', '<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 250.000</span></div>'],
  ['<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 350.000</span></div>', '<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 250.000</span></div>'],
  ['<tr><td>Cleaning AC Central / Split Duct</td><td>Mulai Rp 100.000</td><td>Per PK</td></tr>', '<tr><td>Cleaning AC Split Duct</td><td>Rp 200.000–Rp 600.000</td><td>Per unit, sesuai kapasitas 1,6–6 PK</td></tr>'],
  ['<tr><td>Cleaning AC Cassette</td><td>Rp 300.000 - 500.000</td><td>Per unit</td></tr>', '<tr><td>Cleaning AC Cassette</td><td>Rp 250.000–Rp 600.000</td><td>Per unit, sesuai kapasitas 2–6 PK</td></tr>'],
  ['<tr><td>Cleaning AC Standing Floor</td><td>Rp 350.000 - 600.000</td><td>Per unit</td></tr>', '<tr><td>Cleaning AC Standing Floor</td><td>Rp 250.000–Rp 500.000</td><td>Per unit, sesuai kapasitas 2–5 PK</td></tr>'],
  ['<div class="sc-con"><h3>Perbaikan AC Central</h3><p>Diagnosa dan perbaikan AC central, VRV, dan sistem ducting.</p>\n<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 200.000</span></div>', '<div class="sc-con"><h3>Diagnosa AC Central</h3><p>Pemeriksaan awal AC central, VRV, dan sistem ducting. Biaya perbaikan dikonfirmasi setelah diagnosa.</p>\n<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 100.000</span></div>'],
  ['<div class="sc-con"><h3>Isi Freon AC Central</h3><p>Pengisian freon R410A, R32 untuk AC central.</p>\n<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 250.000/PK</span></div>', '<div class="sc-con"><h3>Isi Freon</h3><p>Pengisian freon R410A atau R32. Kebutuhan sistem central dikonfirmasi setelah pemeriksaan.</p>\n<div class="sc-price"><span class="amt">Isi freon saja</span><span class="un">Rp 500.000/unit</span></div>'],
  ['<div class="sc-price"><span class="amt">Mulai</span><span class="un">Rp 75.000/PK/bln</span></div>', '<div class="sc-price"><span class="amt">Harga</span><span class="un">Setelah survei</span></div>'],
  ['<tr><td>Isi Freon AC Central</td><td>Mulai Rp 250.000</td><td>Per PK (R410A)</td></tr>', '<tr><td>Isi Freon R22 / R32 / R410A</td><td>Rp 500.000</td><td>Isi freon saja; sistem central perlu pemeriksaan</td></tr>'],
  ['<tr><td>Maintenance Kontrak Bulanan</td><td>Mulai Rp 75.000</td><td>Per PK per bulan</td></tr>', '<tr><td>Maintenance Kontrak Bulanan</td><td>Penawaran setelah survei</td><td>Sesuai jumlah dan kapasitas unit</td></tr>'],
  ['<tr><td>Perbaikan / Service</td><td>Mulai Rp 200.000</td><td>Sesuai kerusakan</td></tr>', '<tr><td>Cek &amp; Diagnosa</td><td>Rp 100.000</td><td>Biaya perbaikan dan komponen dikonfirmasi terpisah</td></tr>'],
]);

// Koreksi sisa harga lama dan deskripsi yang berpotensi dianggap sebagai paket.
editMatching(() => true, [
  ['<tr><td>Cleaning AC Cassette</td><td>Rp 300.000</td><td>2–3 PK</td></tr>', '<tr><td>Cleaning AC Cassette</td><td>Rp 250.000–Rp 300.000</td><td>2–3 PK</td></tr>'],
  ['<tr><td>Cleaning AC Cassette</td><td>Rp 300.000</td><td>2-3 PK</td></tr>', '<tr><td>Cleaning AC Cassette</td><td>Rp 250.000–Rp 300.000</td><td>2–3 PK</td></tr>'],
  ['Solusi: Deep Cleaning Rp 95.000', 'Solusi: Cleaning AC Rp 95.000'],
  ['<tr><td>Perbaikan AC Bocor</td><td>Mulai Rp 150.000</td><td>Cek drain + evaporator</td></tr>', '<tr><td>Diagnosa AC Bocor</td><td>Rp 100.000</td><td>Perbaikan dan material dikonfirmasi terpisah</td></tr>'],
  ['Solusi: Perbaikan AC Bocor Rp 150.000', 'Solusi: Diagnosa AC Bocor Rp 100.000; perbaikan terpisah'],
  ['<tr><td>Perbaikan AC Bocor</td><td>Mulai Rp 150.000</td><td>1-2 jam</td></tr>', '<tr><td>Diagnosa AC Bocor</td><td>Rp 100.000</td><td>Perbaikan dikonfirmasi terpisah</td></tr>'],
  ['<div class="nm">AC Inverter Service</div>\n        <div class="pr">Rp 120.000/unit</div>', '<div class="nm">Cleaning AC Inverter 0,5–1 PK</div>\n        <div class="pr">Rp 95.000/unit</div>'],
  ['3 unit Rp 270.000', '3 unit Rp 285.000'],
  ['5 unit Rp 445.000', '5 unit Rp 475.000'],
  [' (hemat Rp 15.000)', ''],
  [' (hemat Rp 30.000)', ''],
  ['Termasuk bracket &amp; pipa standar 3-5 meter', 'Jasa saja; material terpisah'],
  ['Termasuk bracket & pipa standar 3-5 meter', 'Jasa saja; material terpisah'],
]);

edit('faq.html', [
  ['Biaya cleaning AC di AClean Service mulai dari Rp 95.000 per unit untuk AC split 0.5-2 PK. Harga sudah termasuk pembersihan indoor, outdoor, filter, saluran drain, dan pengecekan suhu. Untuk AC cassette atau central, harga dihitung per PK mulai Rp 100.000/PK.', 'Biaya cleaning AC split adalah Rp 95.000 per unit untuk 0,5–1 PK dan Rp 100.000 untuk 1,5–2,5 PK. Cleaning cassette Rp 250.000–Rp 600.000 dan split duct Rp 200.000–Rp 600.000 sesuai kapasitas.'],
  ['Biaya cleaning AC di AClean Service mulai dari <strong>Rp 95.000 per unit</strong> untuk AC split 0.5-2 PK. Harga sudah termasuk pembersihan indoor, outdoor, filter, saluran drain, dan pengecekan suhu. Untuk AC cassette atau central, harga dihitung per PK mulai Rp 100.000/PK.', 'Biaya cleaning AC split adalah <strong>Rp 95.000</strong> per unit untuk 0,5–1 PK dan <strong>Rp 100.000</strong> untuk 1,5–2,5 PK. Cleaning cassette Rp 250.000–Rp 600.000 dan split duct Rp 200.000–Rp 600.000 sesuai kapasitas.'],
]);

edit('bongkar-pasang-ac.html', [
  ['Bisa. AClean memiliki paket khusus renovasi seharga Rp 500.000 per unit. AC dibongkar dengan freon disimpan, kemudian dipasang kembali setelah renovasi selesai. Kami juga memberikan konsultasi posisi baru gratis agar AC lebih optimal setelah renovasi.', 'Bisa. Biaya renovasi mengikuti komponen aktif: bongkar unit Rp 150.000–Rp 200.000 dan pemasangan kembali indoor + outdoor Rp 400.000. Vacuum dan material ditambahkan hanya jika diperlukan.'],
]);

edit('index.html', [
  ['Pengisian freon R32 & R410A. Cek kebocoran gratis, freon original, AC kembali dingin optimal.', 'Pengisian freon R32 & R410A original. Harga untuk isi freon saja; pemeriksaan atau perbaikan dihitung terpisah.'],
  ['<li>Kuras vacuum +Rp 150.000</li>', '<li>Kuras vacuum + freon Rp 650.000</li>'],
]);

editMatching(() => true, [
  ['<tr><td>Cleaning AC Cassette 2–3 PK</td><td>Rp 300.000</td><td>Per unit</td></tr>', '<tr><td>Cleaning AC Cassette 2–3 PK</td><td>Rp 250.000–Rp 300.000</td><td>Sesuai kapasitas</td></tr>'],
  ['<tr><td>Penggantian Kapasitor</td><td>Mulai Rp 200.000</td><td>Sparepart original</td></tr>', '<tr><td>Kapasitor AC 0,5–1,5 PK + Pasang</td><td>Rp 400.000</td><td>Sparepart + jasa pasang</td></tr>'],
  ['<tr><td>Pemasangan / Bongkar Pasang AC</td><td>Hubungi kami</td><td>2-4 jam</td></tr>', '<tr><td>Jasa Pasang / Relokasi AC</td><td>Rp 400.000 / mulai Rp 550.000</td><td>Material terpisah</td></tr>'],
  ['Mulai Rp 500.000', 'Rp 500.000'],
  ['Mulai Rp 500K', 'Rp 500K'],
  ['Freon original + cek kebocoran + garansi', 'Isi freon saja'],
  ['Freon + cek kebocoran + vacuum + garansi', 'Isi freon saja'],
]);

edit('faq.html', [
  ['Biaya pengisian freon original di AClean mulai dari <strong>Rp 500.000 per unit</strong>. Kami menggunakan freon original Daikin R-32 untuk menjamin kualitas dan keawetan. Harga sudah termasuk pengecekan tekanan dan kebocoran.', 'Biaya isi freon R22, R32, atau R410A adalah <strong>Rp 500.000 per unit</strong> untuk isi freon saja. Diagnosa, test press, vacuum, perbaikan kebocoran, dan material lain dihitung terpisah.'],
]);

edit('blog/kapan-harus-isi-freon-ac.html', [
  ['Harga sudah termasuk deteksi kebocoran, vacuum, dan garansi.', 'Harga isi freon tidak mencakup deteksi kebocoran, vacuum, atau perbaikan. Layanan tersebut dikonfirmasi terpisah.'],
]);

for (const file of ['service-ac-discovery-bintaro.html', 'service-ac-the-green-bsd.html']) {
  edit(file, [
    ['<p class="p">Instalasi AC baru lengkap pipa, kabel, bracket outdoor.</p>', '<p class="p">Jasa pemasangan unit saja; pipa, kabel, vacuum, dan bracket dihitung terpisah.</p>'],
    ['<p class="p">Instalasi AC inverter eco-friendly untuk rumah The Green.</p>', '<p class="p">Jasa pemasangan unit saja; pipa, kabel, vacuum, dan bracket dihitung terpisah.</p>'],
    ['<h3>Perbaikan AC Bocor</h3>\n      <p class="p">Drain tersumbat, evaporator kotor, atau instalasi miring.</p>\n      <div class="pr">Rp 150.000', '<h3>Diagnosa AC Bocor</h3>\n      <p class="p">Pemeriksaan penyebab bocor; biaya perbaikan dikonfirmasi terpisah.</p>\n      <div class="pr">Rp 100.000'],
    ['<h3>Perbaikan AC Bocor</h3>\n      <p class="p">Drain tersumbat, evaporator kotor, instalasi miring.</p>\n      <div class="pr">Rp 150.000', '<h3>Diagnosa AC Bocor</h3>\n      <p class="p">Pemeriksaan penyebab bocor; biaya perbaikan dikonfirmasi terpisah.</p>\n      <div class="pr">Rp 100.000'],
    ['<h3>Bongkar Pasang</h3>\n      <p class="p">Pindahan atau renovasi rumah di klaster Discovery.</p>\n      <div class="pr">Rp 200.000', '<h3>Relokasi Lengkap</h3>\n      <p class="p">Bongkar unit kecil dan pasang kembali; material terpisah.</p>\n      <div class="pr">Mulai Rp 550.000'],
    ['<h3>Bongkar Pasang</h3>\n      <p class="p">Pindahan atau renovasi rumah di klaster The Green.</p>\n      <div class="pr">Rp 200.000', '<h3>Relokasi Lengkap</h3>\n      <p class="p">Bongkar unit kecil dan pasang kembali; material terpisah.</p>\n      <div class="pr">Mulai Rp 550.000'],
  ]);
}

for (const file of ['service-ac-graha-raya-kencana.html', 'service-ac-paramount-gading-serpong.html']) {
  edit(file, [
    ['3 unit (Rp 270.000), 5 unit (Rp 445.000)', '3 unit (Rp 285.000), 5 unit (Rp 475.000)'],
    ['3 unit AC Rp 270.000, 5 unit AC Rp 445.000', '3 unit AC Rp 285.000, 5 unit AC Rp 475.000'],
  ]);
}

edit('blog/jasa-service-ac-alam-sutera.html', [
  ['<tr><td>Pemasangan AC Baru</td><td>Hubungi kami</td><td>2-4 jam</td></tr>', '<tr><td>Jasa Pemasangan AC Baru</td><td>Rp 400.000–Rp 450.000</td><td>Material terpisah</td></tr>'],
  ['<tr><td>Bongkar Pasang AC</td><td>Hubungi kami</td><td>2-3 jam</td></tr>', '<tr><td>Relokasi AC Lengkap</td><td>Mulai Rp 550.000</td><td>Material terpisah</td></tr>'],
  ['<tr><td>Perawatan Berkala</td><td>Rp 100.000/PK</td><td>Tergantung unit</td></tr>', '<tr><td>Kontrak Perawatan Berkala</td><td>Penawaran setelah survei</td><td>Sesuai jumlah dan kapasitas unit</td></tr>'],
  ['Rp 400.000–Rp 500.000', 'Rp 400.000–Rp 450.000'],
]);

edit('blog/biaya-service-ac-tangerang-2026.html', [
  ['<tr><td>Service Besar 1,5–2 PK</td><td><strong>Rp 500.000/unit</strong></td>', '<tr><td>Service Besar 1,5–2 PK</td><td><strong>Rp 450.000/unit</strong></td>'],
  ['<tr><td>Jasa Pemasangan AC Baru</td><td><strong>Rp 400.000–Rp 500.000</strong></td>', '<tr><td>Jasa Pemasangan AC Baru</td><td><strong>Rp 400.000–Rp 450.000</strong></td>'],
]);

editMatching((file) => /service-ac-.*\.html$/.test(file), [
  ['Rp 500.000/set lengkap', 'Rp 500.000/unit untuk isi freon saja'],
  ['Rp 500.000/set', 'Rp 500.000/unit untuk isi freon saja'],
]);

edit('blog/kapan-harus-isi-freon-ac.html', [
  ['<tr><td>R-22 (stok terbatas)</td><td><strong>Hubungi kami</strong></td><td>Khusus AC model lama</td></tr>', '<tr><td>R-22</td><td><strong>Rp 500.000/unit</strong></td><td>Isi freon saja</td></tr>'],
]);

for (const file of ['blog/jasa-service-ac-bsd.html', 'blog/jasa-service-ac-gading-serpong.html']) {
  edit(file, [
    ['<tr><td>Pemasangan AC Baru</td><td><strong>Hubungi kami</strong></td><td>Jasa saja; material terpisah</td></tr>', '<tr><td>Jasa Pemasangan AC Baru</td><td><strong>Rp 400.000–Rp 450.000</strong></td><td>Jasa saja; material terpisah</td></tr>'],
    ['<tr><td>Pemasangan AC Baru</td><td><strong>Hubungi kami</strong></td><td>2-4 jam</td></tr>', '<tr><td>Jasa Pemasangan AC Baru</td><td><strong>Rp 400.000–Rp 450.000</strong></td><td>Material terpisah</td></tr>'],
    ['<tr><td>Bongkar Pasang AC</td><td><strong>Hubungi kami</strong></td><td>Pindah unit ke lokasi baru</td></tr>', '<tr><td>Relokasi AC Lengkap</td><td><strong>Mulai Rp 550.000</strong></td><td>Material terpisah</td></tr>'],
    ['<tr><td>Bongkar Pasang AC</td><td><strong>Hubungi kami</strong></td><td>2-3 jam</td></tr>', '<tr><td>Relokasi AC Lengkap</td><td><strong>Mulai Rp 550.000</strong></td><td>Material terpisah</td></tr>'],
  ]);
}

edit('perbaikan-ac.html', [
  ['Penanganan AC tidak dingin dengan isi freon mulai Rp 500.000', 'Isi freon untuk AC tidak dingin Rp 500.000; diagnosa dan perbaikan terpisah'],
  ['Penanganan AC tidak dingin dengan isi freon mulai <strong>Rp 500.000</strong>', 'Isi freon untuk AC tidak dingin <strong>Rp 500.000</strong>; diagnosa dan perbaikan terpisah'],
  ['<span class="amt">Rp 500.000</span><span class="un">/mulai</span>', '<span class="amt">Rp 500.000</span><span class="un">/isi freon saja</span>'],
]);

console.log('Sinkronisasi konten harga selesai.');
