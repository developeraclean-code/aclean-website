# AClean — Planning Iklan Google Ads & Meta Ads

Dokumen strategi paid ads untuk 5 kategori layanan inti. Fokus: **lead WhatsApp berkualitas** dengan ROI/ROAS sehat di area Tangerang Selatan.

- **Brand:** AClean — Jasa Service AC Profesional
- **Area layanan:** Tangerang Selatan (BSD, Alam Sutera, Bintaro, Gading Serpong, Serpong, Karawaci, Graha Raya) + Jakarta Selatan sebagian
- **WA / CTA utama:** wa.me/6281289898937
- **USP:** Teknisi bersertifikat Daikin · Sparepart original · Garansi resmi 30 hari · Riwayat unit tersimpan · Survei gratis (ducting)
- **Harga jangkar:** Cuci AC dari Rp95.000 · Bongkar-pasang dari Rp250.000 · Pasang AC dari Rp400.000

---

## 1. Prioritas & Alokasi Budget

Diurutkan berdasarkan **intent beli (bawah funnel) vs nilai transaksi**. Ini panduan alokasi budget bulanan Google Ads (search) — sesuaikan dengan angka riil kamu.

| Prioritas | Kategori | Intent | Nilai/Job | % Budget Search | Alasan |
|---|---|---|---|---|---|
| 1 | **Service / Cuci AC** | Sangat tinggi | Kecil-sedang (repeat) | 30% | Volume terbesar, murah per lead, pintu masuk pelanggan repeat |
| 2 | **Perbaikan AC** | Darurat/tinggi | Sedang | 25% | Orang butuh cepat → konversi tinggi, kompetisi bid worth it |
| 3 | **Bongkar Pasang AC** | Tinggi | Sedang | 20% | Momen pindahan/renovasi, konversi bagus |
| 4 | **Pasang AC** | Tinggi | Besar | 15% | Ticket besar, sering barengan beli unit |
| 5 | **Ducting AC** | Sedang (riset) | Sangat besar | 10% | Volume kecil, sales cycle panjang, 1 closing = untung besar |

**Anggaran awal disarankan:** mulai Rp75.000–150.000/hari/kampanye untuk 2–3 kampanye prioritas (jangan sebar tipis ke 5 sekaligus). Naikkan setelah data konversi masuk (≥15–20 konversi/kampanye).

---

## 2. Struktur Akun Google Ads

Prinsip: **1 kategori = 1 Campaign**, tiap Campaign berisi Ad Group per tema kata kunci, tiap Ad Group diarahkan ke **landing page paling relevan** (bukan homepage). Landing page sudah tersedia → Quality Score tinggi → CPC lebih murah.

| Campaign | Ad Group | Landing Page |
|---|---|---|
| **SRV — Service AC** | Cuci AC / Service AC | `cuci-ac.html`, `service-ac-bsd.html`, `service-ac-alam-sutera.html`, dst (per lokasi) |
| | Isi Freon | `isi-freon.html` |
| **RPR — Perbaikan AC** | Perbaikan / AC tidak dingin | `perbaikan-ac.html` ✅ (landing khusus intent — sudah dibuat) |
| **BPS — Bongkar Pasang** | Bongkar pasang / pindah AC | `bongkar-pasang-ac.html`, `bongkar-pasang-ac-bsd.html`, `-bintaro`, `-alam-sutera` |
| **INS — Pasang AC** | Pasang AC baru | `pasang-ac.html` |
| **DCT — Ducting AC** | Ducting AC / PU Board | `ducting-ac.html`, `ducting-ac-bsd.html`, `ducting-ac-bintaro-alam-sutera.html` |

**Setelan global tiap kampanye:**
- Tipe: **Search** (murni; jangan aktifkan "Search Partners" & "Display Network" di awal — boros).
- Lokasi: radius sekitar Tangsel + pilih kota target. **Setelan lokasi wajib "Presence: people in your targeted locations"** (bukan "interest") supaya tidak bayar klik luar area.
- Bahasa: Indonesia.
- Jadwal iklan: aktifkan penuh, tapi bid +10–20% jam 07.00–21.00 (jam orang cari tukang AC).
- Perangkat: mobile prioritas (mayoritas klik WA dari HP).

---

## 3. Kata Kunci per Kategori

Gunakan **Phrase match `"..."`** dan **Exact `[...]`** sebagai basis (lebih terkontrol). Hindari Broad match di awal sampai punya negative list kuat. Tambahkan **varian lokasi** ke tiap keyword utama (bsd, alam sutera, bintaro, gading serpong, serpong, tangerang selatan).

### 3.1 Service / Cuci AC
```
"service ac"            "cuci ac"              "service ac terdekat"
"jasa service ac"       "cuci ac panggilan"    "service ac bsd"
"service ac tangerang"  "cuci ac alam sutera"  "service ac gading serpong"
[service ac bsd]        [cuci ac bsd]          [jasa service ac tangerang selatan]
"tukang service ac"     "biaya cuci ac"        "harga service ac"
```

### 3.2 Perbaikan AC
```
"perbaikan ac"          "ac tidak dingin"       "ac bocor"
"service ac rusak"      "ac mati total"         "ac keluar air"
"tukang ac panggilan"   "ac kurang dingin"      "perbaikan ac tangerang"
[ac tidak dingin bsd]   [perbaikan ac alam sutera]   "ac bunyi berisik"
"jasa perbaikan ac"     "ac panas tidak dingin" "ganti kompresor ac"
```

### 3.3 Bongkar Pasang AC
```
"bongkar pasang ac"     "jasa bongkar pasang ac"   "pindah ac"
"jasa pindah ac"        "bongkar ac pindahan"      "bongkar pasang ac bsd"
"pasang ac pindahan"    "biaya bongkar pasang ac"  [bongkar pasang ac bintaro]
"pindah ac panggilan"   "bongkar pasang ac alam sutera"
```

### 3.4 Pasang AC
```
"pasang ac"             "jasa pasang ac"        "pasang ac baru"
"pasang ac panggilan"   "biaya pasang ac"       "pasang ac bsd"
"tukang pasang ac"      "instalasi ac"          "pasang ac tangerang selatan"
[pasang ac baru bsd]    "pasang ac gading serpong"   "jasa instalasi ac"
```

### 3.5 Ducting AC
```
"ducting ac"            "jasa ducting ac"       "instalasi ducting ac"
"ducting ac pu board"   "kontraktor ducting ac" "ducting ac bsd"
"pasang ducting ac"     "biaya ducting ac"      "ducting ac gedung"
[jasa ducting ac tangerang]   "ducting ac cafe restoran"   "ducting ac kantor"
```

### 3.6 Negative Keywords (WAJIB — hemat budget)
Buat 1 **Negative Keyword List** dipakai di semua kampanye:
```
gratis, lowongan, loker, kerja, gaji, tutorial, cara, diy, sendiri,
bekas, second, jual sparepart, harga sparepart eceran, sekolah, kursus,
pdf, skripsi, adalah, arti, pengertian, wikipedia, modul, training,
part number, remote ac, kapasitor ac beli, dinamo ac,
sanken, sharp remote, manual book
```
Plus negative merek/produk yang tidak kamu jual, dan kota di luar jangkauan (mis. `surabaya, bandung, bekasi, depok` bila tak dilayani).

---

## 4. Iklan Google (Responsive Search Ads)

Tiap Ad Group: isi **15 headline + 4 description**. Sematkan (pin) 1–2 headline berisi layanan+lokasi di posisi 1. Sisipkan `{KeyWord:Service AC AClean}` bila mau dynamic. Semua diakhiri CTA WhatsApp.

### 4.1 Service / Cuci AC — RSA
**Headlines (15):**
```
Service AC BSD & Alam Sutera        Cuci AC Mulai Rp95.000
Teknisi AC Bersertifikat Daikin     Garansi Resmi 30 Hari
Jasa Service AC Tangerang Selatan   Panggilan Hari Ini Juga
AC Dingin Lagi, Dijamin             Sparepart Original 100%
Booking Cepat via WhatsApp          Teknisi Datang Tepat Waktu
Cuci AC Panggilan Profesional       Harga Transparan Tanpa Nego
Riwayat Unit AC Tersimpan Rapi      Melayani BSD, Serpong, Bintaro
Rating Pelanggan Puas ⭐⭐⭐⭐⭐
```
**Descriptions (4):**
```
Cuci AC mulai Rp95.000. Teknisi berpengalaman, sparepart original, garansi resmi 30 hari.
Melayani BSD, Alam Sutera, Gading Serpong & sekitarnya. Booking via WhatsApp, teknisi datang tepat waktu.
AC kotor bikin boros listrik & tidak sehat. Bersihkan sekarang, dingin maksimal kembali.
Harga transparan, tanpa biaya tersembunyi. Chat WA sekarang untuk jadwal hari ini.
```

### 4.2 Perbaikan AC — RSA
**Headlines:**
```
AC Tidak Dingin? Kami Perbaiki      Teknisi AC Datang Hari Ini
Perbaikan AC Tangerang Selatan      AC Bocor, Mati, Berisik?
Cek & Diagnosa oleh Ahli            Garansi Perbaikan Resmi
Sparepart Original Bergaransi       Panggilan Cepat via WhatsApp
Service AC Rusak BSD & Serpong      Solusi AC Ngadat Segera
Biaya Jelas Sebelum Dikerjakan      Teknisi Bersertifikat & Sopan
Isi Freon Original Daikin           AC Dingin Lagi, Dijamin
Melayani Alam Sutera & Bintaro
```
**Descriptions:**
```
AC tidak dingin, bocor, atau mati total? Teknisi ahli datang cepat, diagnosa akurat, garansi resmi.
Biaya diinformasikan sebelum dikerjakan — tanpa kejutan. Sparepart original bergaransi.
Melayani BSD, Alam Sutera, Gading Serpong, Bintaro. Chat WhatsApp sekarang, dijadwalkan hari ini.
Teknisi bersertifikat Daikin, berpengalaman menangani semua merek AC. AC dingin lagi, dijamin.
```

### 4.3 Bongkar Pasang AC — RSA
**Headlines:**
```
Jasa Bongkar Pasang AC Tangsel      Pindahan? AC Aman Dipindah
Freon Disimpan, Tidak Terbuang      Bongkar Pasang Mulai Rp250.000
Teknisi Rapi & Profesional          Garansi Pemasangan Resmi
Bongkar Pasang AC BSD & Bintaro     Untuk Pindahan & Renovasi
Booking Jadwal via WhatsApp         Semua Merek & Tipe AC
Pengerjaan Cepat & Bersih           Harga Transparan
```
**Descriptions:**
```
Pindahan atau renovasi? Freon disimpan aman & tidak terbuang. Bongkar pasang AC mulai Rp250.000.
Teknisi rapi, pengerjaan bersih, garansi pemasangan. Melayani BSD, Alam Sutera, Bintaro, Serpong.
Semua merek AC ditangani teknisi berpengalaman. Chat WhatsApp untuk atur jadwal pindah AC Anda.
Harga transparan tanpa biaya tersembunyi. Booking cepat, teknisi datang tepat waktu.
```

### 4.4 Pasang AC — RSA
**Headlines:**
```
Jasa Pasang AC Baru Tangsel         Pasang AC Mulai Rp400.000
Instalasi Rapi & Bergaransi         Semua Merek AC Dilayani
Teknisi Bersertifikat Daikin        Garansi Instalasi 1 Bulan
Pasang AC BSD & Gading Serpong      Pemasangan Cepat Hari Ini
Konsultasi Titik Pasang Gratis      Booking via WhatsApp
Hasil Rapi, Bocor? Kami Tanggung    Pipa & Bracket Berkualitas
```
**Descriptions:**
```
Pasang AC baru semua merek, instalasi rapi & bergaransi 1 bulan. Mulai Rp400.000.
Teknisi bersertifikat, pengerjaan bersih & profesional. Melayani BSD, Alam Sutera, Serpong.
Konsultasi titik pasang gratis via WhatsApp. Dijadwalkan cepat, teknisi datang tepat waktu.
Material berkualitas, hasil rapi. Chat WA sekarang untuk penawaran pasang AC Anda.
```

### 4.5 Ducting AC — RSA
**Headlines:**
```
Jasa Ducting AC PU Board            Design, Build & Install
Ducting AC Tangerang Selatan        Survei Lokasi Gratis
PU Board: Ringan & Anti Jamur       Insulasi Lebih Baik & Rapi
Untuk Kantor, Cafe & Gedung         Kontraktor Ducting Terpercaya
Konsultasi & Penawaran Gratis       Pengerjaan Profesional
Ducting AC BSD & Serpong            Hubungi via WhatsApp
```
**Descriptions:**
```
Jasa ducting AC PU Board: lebih ringan, insulasi lebih baik, anti jamur. Design, fabrikasi & instalasi.
Untuk kantor, cafe, restoran & gedung. Survei lokasi gratis, penawaran transparan.
Ditangani tim berpengalaman di Tangerang Selatan. Chat WhatsApp untuk konsultasi & jadwal survei.
Hasil rapi & profesional. Konsultasi kebutuhan ducting Anda sekarang — gratis, tanpa komitmen.
```

### 4.6 Aset Iklan (Extensions) — pasang di semua kampanye
- **Sitelink:** Service AC · Bongkar Pasang · Pasang AC Baru · Ducting AC (arahkan ke landing page masing-masing)
- **Callout:** Garansi Resmi 30 Hari · Sparepart Original · Teknisi Bersertifikat · Survei/Konsultasi Gratis · Harga Transparan
- **Structured snippet** (Services): Cuci AC, Isi Freon, Perbaikan AC, Bongkar Pasang, Instalasi, Ducting
- **Call extension:** nomor telepon bisnis (jam kerja)
- **Location extension:** hubungkan Google Business Profile bila ada
- **Price extension:** Cuci AC dari Rp95.000 · Bongkar Pasang dari Rp250.000 · Pasang AC dari Rp400.000
- **Promotion** (opsional): diskon cuci AC borongan / paket maintenance

---

## 5. Konversi & Pelacakan ROI (paling penting)

Tanpa tracking, ROI tidak bisa diukur → optimasi buta. Setup wajib:

1. **Google Tag / GA4** terpasang di semua landing page.
2. **Konversi utama = klik tombol WhatsApp** (`wa.me/6281289898937`). Buat event konversi "WA_Click" di GA4 → import ke Google Ads.
3. Konversi sekunder: klik nomor telepon (`tel:`), submit form order (`order.html`).
4. Beri nilai konversi estimasi agar bisa hitung ROAS (mis. WA_Click = Rp30.000 nilai proxy, atau lebih baik pakai nilai rata-rata job).
5. **UTM** di URL landing dari iklan (`?utm_source=google&utm_medium=cpc&utm_campaign=service-ac`).
6. **Google Business Profile aktif** — banyak pencarian "service ac terdekat" → Local Pack, gratis, komplemen ads.
7. Buat **template pesan WA** yang menangkap sumber (mis. tombol WA membawa teks "Halo, saya dari iklan Service AC BSD…") agar tim tahu lead dari kampanye mana.

**Metrik yang dipantau mingguan:** CTR (>5% search bagus), Conversion Rate (klik→WA), Cost/Conversion, dan biaya per **job closing** riil (dari tim sales). Target akhir: **Cost per closing < margin 1 job**.

---

## 6. Bidding Strategy

- **Minggu 1–2 (belajar):** pakai **Maximize Clicks** dengan **max CPC cap** (mis. Rp3.000–6.000) untuk kumpulkan data + isi funnel. Atau **Manual CPC** bila mau kontrol penuh.
- **Setelah ≥15–20 konversi/kampanye:** pindah ke **Maximize Conversions**, lalu **Target CPA** setelah stabil (set tCPA ≈ Cost/Conversion rata-rata yang sehat).
- Perbaikan AC & Service AC: berani bid lebih tinggi (intent darurat, konversi cepat).
- Ducting: bid lebih rendah + andalkan long-tail (volume kecil, jangan boros).

---

## 7. Meta Ads (Instagram/Facebook)

Meta ≠ Google. Di Google orang **sudah mencari** (harvest demand). Di Meta kamu **menciptakan/menstimulasi** demand + retargeting. Fokus Meta: **awareness lokal + lead form/WA + retargeting pengunjung web**.

### 7.1 Struktur Kampanye Meta
| Objective | Fungsi | Catatan |
|---|---|---|
| **Leads (Click-to-WhatsApp)** | Kampanye utama — CTA "Kirim Pesan" langsung ke WA | Paling cocok untuk layanan panggilan |
| **Engagement/Awareness** | Bangun brand lokal + kumpulkan audiens video-viewer | Konten edukasi/before-after |
| **Retargeting** | Iklankan ke pengunjung web (Pixel) & penonton video 50% | Konversi termurah — WAJIB pasang Meta Pixel |

### 7.2 Targeting (Audience)
- **Lokasi:** radius pin BSD/Alam Sutera/Serpong/Bintaro (mis. +5–10 km). Ini kunci — jangan seluruh Indonesia.
- **Usia:** 25–55, semua gender (pengambil keputusan rumah/pemilik usaha).
- **Detailed targeting (untuk cold):** pemilik rumah, real estate baru, interior/renovasi, HVAC, pengelola cafe/kantor (untuk ducting). Untuk B2B ducting: jabatan pemilik usaha/manajer.
- **Lookalike** 1–3% dari daftar pelanggan WA / pengunjung web (setelah Pixel matang).
- **Retargeting:** pengunjung landing 30–90 hari + penonton video ≥50%.

### 7.3 Angle Kreatif per Kategori (yang bekerja di Meta)
Meta = visual. **Video/foto before-after** mengalahkan gambar statis biasa.

- **Service/Cuci AC:** Reel/video before-after unit indoor kotor→bersih + air kotor mengalir. Hook: *"AC di rumah kamu terakhir dicuci kapan? 👀"*
- **Perbaikan AC:** Carousel gejala → solusi. Hook: *"AC nyala tapi nggak dingin? Ini 3 penyebabnya."*
- **Bongkar Pasang:** Video proses rapi + "freon tidak dibuang". Hook: *"Mau pindahan? Jangan asal cabut AC — freon bisa hilang & rugi."*
- **Pasang AC:** Foto hasil instalasi rapi + garansi. Hook: *"Beli AC baru? Pemasangan rapi menentukan awet-tidaknya."*
- **Ducting:** Foto proyek PU Board profesional (kantor/cafe). Hook: *"Ducting AC rapi untuk kantor & cafe — ringan, anti jamur, insulasi lebih baik."*

### 7.4 Contoh Copy Meta (Click-to-WhatsApp)

**Cuci AC:**
> 🧊 AC kurang dingin & boros listrik? Waktunya cuci AC!
> Cuci AC profesional mulai **Rp95.000** — teknisi bersertifikat, sparepart original, **garansi resmi 30 hari**.
> 📍 Melayani BSD, Alam Sutera, Gading Serpong & sekitarnya.
> 👉 Klik "Kirim Pesan" — teknisi bisa datang hari ini juga.
> _#ServiceACBSD #CuciAC #AClean_

**Perbaikan AC:**
> ❄️ AC tidak dingin, bocor, atau bunyi berisik?
> Jangan didiamkan — bisa makin parah & boros. Teknisi ahli AClean datang cepat, diagnosa akurat, **biaya jelas sebelum dikerjakan**.
> ✅ Sparepart original · Garansi resmi · Semua merek
> 👉 Chat sekarang, dijadwalkan hari ini.

**Ducting AC (B2B):**
> 🏢 Butuh ducting AC untuk kantor, cafe, atau gedung?
> AClean kerjakan **design, fabrikasi & instalasi ducting PU Board** — lebih ringan, insulasi lebih baik, anti jamur.
> 📐 **Survei lokasi GRATIS.**
> 👉 Konsultasikan kebutuhan Anda — klik "Kirim Pesan".

### 7.5 Budget Meta
Mulai Rp50.000–100.000/hari untuk 1 kampanye Leads WA + Rp30.000/hari retargeting. Uji 3–4 kreatif per ad set (biarkan algoritma pilih pemenang), matikan yang CPL-nya buruk setelah 3–4 hari.

---

## 8. Landing Page & Aset Iklan Siap Pakai

**Landing page `perbaikan-ac.html` sudah dibuat** ✅ — berisi gejala umum (tidak dingin/bocor/mati/berisik), proses diagnosa transparan, harga, testimoni, FAQ, schema HowTo+FAQ, dan tombol WA di atas lipatan. Sudah didaftarkan di `sitemap.xml` + ditautkan dari nav & footer `index.html`. **Landing relevan = Quality Score naik = CPC turun 20–40%.**

**Aset iklan siap impor** ada di folder [docs/ads/](ads/):
- `google-keywords.csv` — 67 keyword (Phrase+Exact) per kategori, siap impor ke Google Ads Editor.
- `google-negative-keywords.txt` — daftar negative keyword untuk shared library.
- `google-rsa.csv` — Responsive Search Ads (15 headline + 4 desc) semua sudah divalidasi ≤30/≤90 karakter.
- `meta-ads-copy.md` — copy Meta/Instagram per kategori + angle kreatif.

Opsional berikutnya: buat landing khusus `isi-freon.html` diperkaya untuk ad group Isi Freon (saat ini menumpang; halaman `isi-freon.html` sudah ada dan bisa dipakai).

---

## 9. Langkah Eksekusi (Checklist Urut)

**Minggu 0 — Persiapan**
- [ ] Pasang GA4 + Google Tag di semua landing page
- [ ] Set konversi "Klik WhatsApp" & impor ke Google Ads
- [ ] Pasang Meta Pixel + event Lead
- [ ] Verifikasi/optimasi Google Business Profile
- [ ] Siapkan template pesan WA per kategori (auto-isi sumber lead)
- [ ] Siapkan 3–4 aset video/foto before-after untuk Meta

**Minggu 1 — Launch Google Ads**
- [ ] Buat 3 kampanye prioritas dulu: Service AC, Perbaikan AC, Bongkar Pasang
- [ ] Isi keyword (Phrase+Exact) + Negative Keyword List
- [ ] RSA 15 headline + 4 desc per ad group, semua extension terpasang
- [ ] Lokasi "Presence", bahasa ID, bid Maximize Clicks + CPC cap
- [ ] Arahkan tiap ad group ke landing page yang benar + UTM

**Minggu 2 — Launch Meta**
- [ ] Kampanye Leads Click-to-WA (Cuci AC + Perbaikan AC)
- [ ] Kampanye Retargeting pengunjung web
- [ ] 3–4 kreatif per ad set

**Minggu 3–4 — Optimasi**
- [ ] Search Terms Report → tambah keyword bagus, buang yang jelek jadi negative
- [ ] Pause ad/keyword CPA tinggi, naikkan budget yang menang
- [ ] Pindah bidding ke Maximize Conversions (bila ≥15 konversi)
- [ ] Tambah kampanye Pasang AC & Ducting bila 3 kampanye awal sehat
- [ ] Review Cost per closing riil dari tim → sesuaikan alokasi budget §1

**Rutin mingguan:** cek Search Terms, tambah negatives, refresh kreatif Meta yang lelah (frequency >2.5), bandingkan CPL antar kanal, geser budget ke pemenang.

---

## 10. Ringkasan Prinsip ROI
1. **Google = panen intent** (orang sudah mau beli) → prioritas budget di sini.
2. **Meta = ciptakan demand + retargeting** → visual before-after + WA langsung.
3. **Landing page relevan per kategori/lokasi** = Quality Score → CPC murah (aset kamu sudah kuat di sini).
4. **Ukur klik WA sebagai konversi**, lalu ukur **closing riil** — optimasi ke biaya per closing, bukan sekadar CPC.
5. **Negative keywords + lokasi "Presence"** = anti boros.
6. Mulai fokus (2–3 kampanye), scaling setelah data, jangan sebar tipis.
