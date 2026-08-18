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
