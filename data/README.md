# Data Spesifikasi Unit AC

Spesifikasi detail untuk unit AC yang dijual AClean (`jual-ac.html`).

## Isi

| File | Keterangan |
|---|---|
| `ac-spec.json` | Data lengkap, termasuk `spec_raw` (semua field mentah dari sumber) |
| `ac-spec.csv` | Versi datar untuk dibuka di Excel/Sheets (tanpa `spec_raw`) |
| `scraper/` | Script yang dipakai untuk mengambil & menyusun datanya |

Data yang sama sudah dimasukkan ke tabel Supabase **`public.ac_spec`**, satu baris per
baris `ac_price_list` (`ac_spec.price_list_id` → `ac_price_list.id`, unique).

RLS mengikuti pola `ac_price_list`: `anon` hanya bisa membaca spec milik unit yang
`is_active = true`; `authenticated` baca semua; ubah/hapus hanya role `Owner`.

## Cakupan

37 unit aktif (22 Daikin + 15 Gree) → **36 unit sudah punya spesifikasi**.

| Sumber | Jumlah |
|---|---|
| selka.id | 15 |
| selka.id + overlay spec sheet resmi daikin.co.id | 19 |
| daikin.co.id saja (tidak ada di selka.id) | 2 — STKE20YV, STKZ71 |

**Belum ada data: `STKH71YV` (ALPHA Inverter 3 PK, `price_list_id` 85).**
Model ini tidak ada di selka.id, tidak ada di spec sheet resmi ALPHA daikin.co.id
(edisi Jan 2026 berhenti di STKH60YV / 2.5 PK), dan tidak ketemu di pencarian web.
Perlu dicek ulang apakah kode serinya benar atau unit ini masih dijual.

## Catatan penting saat membaca datanya

- **Urutan dimensi tidak seragam.** Baris dari selka.id memakai label
  "p x t x l" dalam **cm**; baris dari daikin.co.id dalam **mm** dan sudah
  diberi keterangan urutannya di nilai stringnya. Nilai apa adanya dari sumber
  disimpan di `spec_raw` supaya bisa dicek ulang.
- **`sumber_url` sering tidak nyambung dengan isinya.** selka.id memakai ulang URL
  lama untuk produk baru — misalnya FTKH25YV14 (ALPHA) ada di URL bertuliskan
  `...ftkc25qv...smile-thailand...`. Pencocokan model dilakukan dari isi halaman
  (field "Produk SKU"), bukan dari URL. Semua 34 pencocokan sudah diverifikasi:
  kolom "Daya PK" di selka cocok 100% dengan `kapasitas` di katalog AClean.
- **Kolom overlay dari Daikin** (`model_outdoor`, `kapasitas_kw`,
  `pipa_max_panjang_m`, `pipa_max_tinggi_m`) hanya diisi untuk seri Daikin yang
  spec sheet resminya sudah dibaca. Unit Gree tidak punya nilai ini karena
  gree.id tidak memuatnya.
- **`cspf` kosong di 8 baris** karena sumbernya memang tidak mencantumkan.
- **Harga selka.id sengaja tidak diambil.** Harga jual tetap hanya dari
  `ac_price_list`.

## Cara memperbarui

```bash
cd data/scraper
./fetch_pages.sh urls-split.txt   # unduh halaman produk selka.id
python3 parse.py                  # HTML -> parsed.json
python3 match.py                  # cocokkan dengan units.json -> matched.json
python3 export.py                 # -> ac-spec.json + ac-spec.csv
```

`units.json` adalah snapshot `ac_price_list` saat pengambilan. Kalau daftar unit
di Supabase berubah, perbarui dulu file itu sebelum menjalankan `match.py`.
Nilai spec sheet resmi Daikin di-hardcode di `export.py` (dict `OFFICIAL` dan
`DARI_DAIKIN`) karena daikin.co.id memuat spesifikasinya sebagai **gambar**,
bukan teks — jadi tidak bisa di-scrape otomatis dan harus dibaca manual saat
Daikin merilis spec sheet baru.

Diambil: 17 Agustus 2026.

---

# Skema database (per 18 Agustus 2026)

Website membaca **satu** sumber saja: view `public.ac_katalog`.

```
ac_price_list  ──┐
 (identitas unit,│   ac_katalog  ←── dibaca jual-ac.html (anon)
  harga, aktif)  │   (LEFT JOIN)
                 │
ac_spec        ──┘
 (spesifikasi teknis, opsional)
```

**Aturan pentingnya:** identitas unit — brand, seri, nama varian, kapasitas, harga —
hanya ada di `ac_price_list`. `ac_spec` cuma menyimpan `price_list_id` + data
spesifikasi teknis. Dulu keempat kolom itu disalin ke `ac_spec` dan berisiko basi;
sekarang sudah dihapus.

| Objek | Fungsi | Akses anon |
|---|---|---|
| `ac_katalog` | View gabungan, dibaca website | ✅ baca (hanya unit aktif) |
| `ac_spec_belum_lengkap` | Daftar unit yang datanya belum lengkap | ❌ ditolak |
| `ac_price_list` | Identitas + harga unit | ✅ baca (hanya unit aktif) |
| `ac_spec` | Spesifikasi teknis | ✅ baca (ikut induknya) |

View memakai `security_invoker = true`, jadi RLS tabel asal tetap berlaku —
pengunjung otomatis hanya melihat unit dengan `is_active = true`.
Kolom `updated_at` di kedua tabel kini terisi otomatis lewat trigger.

## Cara menambah unit AC baru

**Langkah 1 — tambahkan unitnya** (lewat admin webapp, atau SQL):

```sql
insert into public.ac_price_list
  (brand, seri, nama_varian, tipe, kapasitas,
   harga_unit, harga_inc_pasang, is_active)
values
  ('Daikin', 'STKH71YV', 'ALPHA Inverter', 'Split Inverter', '3 PK',
   14000000, 16500000, true);
```

Sampai di sini unit **sudah langsung tampil di website** — lengkap dengan harga,
tombol keranjang, dan masuk ke structured data. Merek baru pun otomatis muncul
sebagai tombol filter; tidak ada kode yang perlu diubah.

**Langkah 2 — tambahkan spesifikasinya** (opsional, kapan saja menyusul):

```sql
insert into public.ac_spec
  (price_list_id, sku, model_indoor, model_outdoor, type_ac, warna,
   btu, btu_range, daya_watt, daya_watt_range, kapasitas_kw, refrigerant, cspf,
   dimensi_indoor, berat_indoor_kg, dimensi_outdoor, berat_outdoor_kg,
   pipa_cair, pipa_gas, pipa_max_panjang_m, pipa_max_tinggi_m,
   made_in, garansi, luas_ruangan_m2, fitur, sumber, sumber_url, diambil_pada)
values
  ((select id from public.ac_price_list where seri = 'STKH71YV'),
   'FTKH71YV14', 'FTKH71YV14', 'RKH71YV14', 'AC Inverter', 'Putih',
   24200, '24.200 (4.100 - 25.900) BTU/h', 2140, '2.140 (220 - 2.800) Watt',
   7.1, 'R-32', 6.41,
   '110 x 30 x 24 cm', 15, '85 x 60 x 30 cm', 36,
   '1/4', '1/2', 30, 20,
   'Indonesia', '5 Tahun Sparepart, 5 Tahun Kompresor, 3 Tahun Jasa', 45,
   array['Contoh fitur - penjelasannya.']::text[],
   'daikin.co.id', 'https://www.daikin.co.id/alpha-inverter-ftkh-y', current_date)
on conflict (price_list_id) do update set
  btu = excluded.btu, daya_watt = excluded.daya_watt, cspf = excluded.cspf;
```

Semua kolom boleh `null` kecuali `price_list_id`. Yang kosong otomatis
disembunyikan di tampilan — tidak akan muncul tanda pengganti.

**Langkah 3 — periksa kelengkapannya:**

```sql
select * from public.ac_spec_belum_lengkap;
```

## Structured data (SEO)

`jual-ac.html` membangkitkan JSON-LD `ItemList` berisi `Product` + `Offer`
langsung dari data katalog, jadi **tidak ada yang perlu dirawat terpisah** —
unit baru otomatis ikut terbit.

Dua hal yang sengaja diputuskan:

- **Tanpa `aggregateRating` / `review`.** Mencantumkan rating yang tidak
  benar-benar ada melanggar pedoman Google dan berisiko penalti. Kalau nanti
  ada ulasan pelanggan sungguhan, barulah bagian ini ditambahkan.
- **Tanpa `priceValidUntil`.** Google menyarankannya, tapi mengarang tanggal
  berlaku lebih buruk daripada tidak mencantumkan; ketiadaannya hanya
  memunculkan peringatan ringan, bukan error.

Harga yang diterbitkan adalah `harga_unit` (Unit Only) — sesuai tampilan
default halaman. `availability` diisi `InStock` karena katalog hanya memuat
unit `is_active = true`; ubah kalau ketersediaan stok perlu dibedakan.

---

# Keamanan kode akses admin

Diperbaiki 18 Agustus 2026.

**Masalahnya:** `admin-order.html` dilayani publik dan memuat `ADMIN_PIN_HASH`
— SHA-256 tanpa salt dari kode akses admin. Siapa pun bisa mengunduh filenya,
mengambil hash, lalu memecahkannya offline. Kode aksesnya kata umum + angka
berurutan, jadi pecah dalam hitungan detik. Kode akses itu juga tertulis polos
di badan fungsi `check_admin_pass`.

**Yang sudah dikerjakan:**

| Lapisan | Sebelum | Sesudah |
|---|---|---|
| Penyimpanan | teks polos di badan fungsi | bcrypt cost 12 di `admin_credential` |
| Akses tabel hash | — | RLS aktif tanpa policy; anon ditolak |
| Verifikasi | perbandingan `=` teks polos | `crypt()` bcrypt |
| Percobaan gagal | tanpa batas | kunci 15 menit setelah 10 gagal, per IP |
| Hash di file publik | ada | dihapus; verifikasi via RPC `admin_login` |
| Hak anon | bisa panggil semua fungsi | hanya `admin_login` |

Catatan teknis: PostgREST menjalankan tiap request dalam satu transaksi, jadi
`raise exception` membatalkan pencatatan percobaan gagal. Karena itu
`admin_login` mengembalikan `false`, bukan melempar exception — supaya
hitungannya benar-benar tersimpan. Percobaan pertama menghitung 12 kegagalan
tanpa efek apa pun sebelum sebabnya ketahuan.

## Rotasi kode akses — sudah dilakukan

Kode akses lama dirotasi pada 18 Agustus 2026 dan sudah tidak berlaku.

Ternyata kode ini **hanya dipakai `admin-order.html`**. Admin webapp di repo
`VSC ACleanWebapp` memakai Supabase Auth (`auth.uid()` / `auth.role()`) dan
tidak memanggil satu pun RPC ber-`admin_pass`, jadi rotasi tidak memutus apa
pun. Tidak ada file yang perlu diubah — `admin-order.html` membaca kode dari
yang diketik saat login, bukan dari file.

Untuk mengganti lagi di kemudian hari, jalankan di SQL Editor Supabase:

```sql
select public.rotate_admin_pass('kode-lama', 'kode-baru-minimal-12-karakter');
```

Kalau kode lama terlanjur lupa, setel ulang langsung (perlu akses SQL Editor):

```sql
update public.admin_credential
   set pass_hash = extensions.crypt('kode-baru', extensions.gen_salt('bf', 12)),
       updated_at = now()
 where id = 1;
```

Kalau terlanjur terkunci karena salah berkali-kali, hapus penghitungnya:

```sql
delete from public.rate_limit_counters where bucket_key like 'admin_login:%';
```

## Yang belum ditangani

Kode akses tunggal yang dikirim dari browser tetap bukan autentikasi yang
sesungguhnya — tidak ada identitas per orang, tidak ada pencabutan akses, dan
kode itu ada di `sessionStorage`. Perbaikan sebenarnya adalah memakai Supabase
Auth (login per akun) lalu mengganti pemeriksaan `admin_pass` dengan policy RLS
berbasis peran. Itu pekerjaan terpisah yang menyentuh kedua repo.

---

# Sistem foto situs (media_slot + Supabase Storage)

Dibangun 18 Agustus 2026, menggantikan penyimpanan base64 di `website_settings`.

## Alurnya

```
Panel admin (tab Foto Layanan)
   |  kode akses admin
   v
Edge Function media-upload      <- memegang service role
   |  verifikasi + validasi     <- browser TIDAK boleh menulis ke Storage
   v
Supabase Storage bucket "web"   path tetap, mis. layanan/diagnosa.jpg
   |
   v
order.html  <img src=".../public/web/layanan/diagnosa.jpg">
            URL tidak pernah berubah -> HTML tidak perlu di-deploy ulang
```

Perubahan foto tampil di situs **maksimal 5 menit** (`cache-control: max-age=300`).

## Kenapa lewat Edge Function

Panel admin memakai anon key, dan anon key itu publik. Kalau bucket diberi izin
tulis untuk anon, siapa pun bisa menimpa gambar situs. Karena itu semua
penulisan dipusatkan di Edge Function yang memegang service role dan baru
bekerja setelah kode akses admin diverifikasi. Sudah diuji: anon yang mencoba
`POST` langsung ke Storage ditolak `403 row-level security`.

Path juga ditentukan server dari tabel `media_slot`, bukan dari pengirim —
percobaan mengirim slug `../../rahasia` ditolak `404`.

## Menambah kelompok gambar baru (blog, project, dll)

Tidak perlu mengubah kode. Cukup sisipkan baris — panel admin langsung
menampilkannya:

```sql
insert into public.media_slot
  (slug, kelompok, ref, judul, halaman, keterangan, path, alt, urutan)
values
  ('blog/tips-hemat-listrik', 'blog', 'tips-hemat-listrik',
   'Tips Hemat Listrik AC', 'blog/tips-hemat-listrik.html',
   'Gambar utama artikel', 'blog/tips-hemat-listrik.jpg',
   'Ilustrasi tips hemat listrik AC', 10);
```

Lalu di HTML halamannya, pakai URL tetap:

```html
<img src="https://apsbeppcmsxeldnejibz.supabase.co/storage/v1/object/public/web/blog/tips-hemat-listrik.jpg"
     alt="Ilustrasi tips hemat listrik AC" loading="lazy">
```

## Catatan

- **File lokal tetap disimpan sebagai cadangan.** `order.html` memakai
  `images/order-*.jpg` kalau Storage tidak terjangkau. Sudah diuji dengan
  mematikan Storage secara paksa: 10 foto jatuh ke file lokal dan tetap tampil.
- **Ekstensi path selalu `.jpg`** walau yang diunggah PNG/WebP. Yang menentukan
  tampilan adalah header `Content-Type`, jadi tetap benar di browser. Ini
  disengaja supaya URL di HTML tidak pernah berubah.
- **Baris `img_*` di `website_settings` sudah tidak dipakai** (±564 KB base64).
  Belum dihapus supaya bisa dikembalikan kalau ada masalah. Hapus dengan:
  `delete from public.website_settings where key like 'img\_%';`
- Dua slot lama tanpa layanan (`bongkar-pasang`, `cuci-besar`) tidak ikut
  dimigrasikan karena layanannya sudah tidak ada di katalog.

---

# Login admin per orang (Supabase Auth)

Ditambahkan 19 Agustus 2026. **Kode akses bersama sengaja masih berfungsi**
supaya panel tidak mendadak terkunci; cabut setelah login baru terbukti dipakai.

## Yang berubah

| | Kode akses bersama | Login akun |
|---|---|---|
| Identitas | tidak ada | email per orang |
| Jejak siapa berbuat apa | tidak ada | tercatat di `admin_audit` |
| Cabut akses 1 orang | harus ganti kode semua | `aktif = false` |

## Tabel & fungsi

- `admin_user` — daftar admin. Mencabut akses: `update admin_user set aktif=false where email='...'`.
  Terverifikasi berlaku **seketika**, bahkan untuk token yang masih hidup.
- `admin_audit` — jejak login & tindakan. Lihat: `select * from admin_riwayat(50);`
- `is_admin()` — mengecek email di token sesi ada di `admin_user` dan aktif.
- `check_admin_pass()` — menerima **sesi yang sah ATAU kode akses lama**.

## Menambah / mengganti admin

Lewat Edge Function `admin-provision` (butuh kode akses bersama):

```bash
curl -X POST "https://apsbeppcmsxeldnejibz.supabase.co/functions/v1/admin-provision" \
  -H "apikey: <ANON_KEY>" -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"kode_akses":"<kode bersama>","email":"orang@aclean.id",
       "sandi":"minimal-12-karakter","nama":"Nama Orang","peran":"admin"}'
```

Peran: `owner`, `admin`, atau `staf`. Email yang sudah ada akan diperbarui sandinya.

## Kalau login baru sudah lancar

Cabut jalur kode bersama dengan menghapus blok "Jalur lama" di
`check_admin_pass`, lalu hapus kotak PIN di `admin-order.html`.
Jangan lakukan sebelum yakin — itu satu-satunya jaring pengaman yang tersisa.
