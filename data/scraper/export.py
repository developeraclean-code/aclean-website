#!/usr/bin/env python3
"""Gabungkan hasil scrape selka.id + tabel spesifikasi resmi Daikin -> ac-spec.json / .csv."""
import csv
import json
import os
import re
from datetime import date

os.chdir(os.path.dirname(os.path.abspath(__file__)))

TANGGAL = date.today().isoformat()

# Kolom yang benar-benar ada di tabel public.ac_spec (untuk INSERT/UPSERT).
KOLOM_DB = [
    "price_list_id", "sku", "model_indoor", "model_outdoor", "judul", "type_ac",
    "warna", "btu", "btu_range", "daya_watt", "daya_watt_range", "kapasitas_kw",
    "refrigerant", "cspf", "dimensi_indoor", "berat_indoor_kg", "dimensi_outdoor",
    "berat_outdoor_kg", "pipa_cair", "pipa_gas", "pipa_max_panjang_m",
    "pipa_max_tinggi_m", "bahan_koil", "made_in", "garansi", "luas_ruangan_m2",
    "fitur", "deskripsi", "spec_raw", "sumber", "sumber_url", "diambil_pada",
]
MATCHED = json.load(open("matched.json"))
UNITS = json.load(open("units.json"))

# ── Overlay dari tabel spesifikasi resmi daikin.co.id (dibaca dari gambar spec sheet) ──
# Sumber: /super-mini-split-ftc-y (JUL 25), /beta-inverter-ftke-y (JUN 25),
#         /alpha-inverter-ftkh-y (JAN 26), /zeta-inverter (APR 24)
OFFICIAL = {
    # seri: (model_outdoor, kw, pipa_max_panjang_m, pipa_max_tinggi_m)
    "STC15YV":  ("RC15YV14",   1.47, 15,  8),
    "STC25YV":  ("RC25YV14",   2.64, 20, 12),
    "STC35YV":  ("RC35YV14",   3.52, 20, 15),
    "STC50YV":  ("RC50YV14",   5.01, 30, 20),
    "STKE15YV": ("RKE15YV14",  1.47, 20, 15),
    "STKE20YV": ("RKE20YV14",  2.05, 20, 15),
    "STKE25YV": ("RKE25YV14",  2.64, 20, 15),
    "STKE35YV": ("RKE35YV14",  3.60, 20, 15),
    "STKE50YV": ("RKE50YV14",  5.28, 30, 20),
    "STKH15YV": ("RKH15YV14",  1.49, 20, 15),
    "STKH20YV": ("RKH20YV14",  1.99, 20, 15),
    "STKH25YV": ("RKH25YV14",  2.84, 20, 15),
    "STKH35YV": ("RKH35YV14",  3.55, 20, 15),
    "STKH50YV": ("RKH50YV14",  5.57, 30, 20),
    "STKH60YV": ("RKH60YV14",  6.59, 30, 20),
    "STKZ25":   ("RKZ25XVM4",  2.5,  None, None),
    "STKZ35":   ("RKZ35XVM4",  3.5,  None, None),
    "STKZ50":   ("RKZ50XVM4",  5.2,  None, None),
    "STKZ60":   ("RKZ60XVM4",  6.0,  None, None),
}

# ── Unit yang tidak ada di selka.id: diisi dari tabel spesifikasi resmi daikin.co.id ──
DARI_DAIKIN = {
    "STKE20YV": {
        "sku": "FTKE20YV14",
        "model_indoor": "FTKE20YV14",
        "model_outdoor": "RKE20YV14",
        "judul": "DAIKIN FTKE20YV14 AC SPLIT 3/4 PK BETA INVERTER",
        "type_ac": "AC Inverter",
        "btu": 7000, "btu_range": "7.000 (3.400 - 8.200) BTU/h",
        "daya_watt": 615, "daya_watt_range": "615 (245 - 750) Watt",
        "kapasitas_kw": 2.05,
        "cspf": 4.90,
        "refrigerant": "R-32",
        "dimensi_indoor": "730 x 280 x 219 mm (P x T x L)",
        "dimensi_outdoor": "650 x 460 x 240 mm (P x T x L)",
        "pipa_cair": "1/4", "pipa_gas": "3/8",
        "pipa_max_panjang_m": 20, "pipa_max_tinggi_m": 15,
        "made_in": "Indonesia",
        "spec_raw": {
            "Set": "STKE20YV", "Indoor": "FTKE20YV14", "Outdoor": "RKE20YV14",
            "PK": "0.75", "Btu/h": "7,000 (3,400-8,200)", "Kw": "2.05",
            "Daya Listrik (Min. - Max.)": "615 (245-750) W", "CSPF Rating": "4.90 (4★)",
            "Indoor Unit Dimensi (HxWxD)": "280 x 730 x 219 mm",
            "Outdoor Dimensi (HxWxD)": "460 x 650 x 240 mm",
            "Ukuran Pipa Cair": "1/4 inch", "Ukuran Pipa Gas": "3/8 inch",
            "Maksimal Pipa Panjang": "20 m", "Maksimal Pipa Tinggi": "15 m",
            "Nilai TKDN + BMP": "38.18%",
        },
        "sumber": "daikin.co.id",
        "sumber_url": "https://www.daikin.co.id/beta-inverter-ftke-y",
    },
    "STKZ71": {
        "sku": "FTKZ71XVM4",
        "model_indoor": "FTKZ71XVM4",
        "model_outdoor": "RKZ71XVM4",
        "judul": "DAIKIN FTKZ71XVM4 AC SPLIT 3 PK ZETA INVERTER",
        "type_ac": "AC Inverter",
        "btu": 24200, "btu_range": "24.200 (4.100 - 25.900) BTU/h",
        "daya_watt": 2140, "daya_watt_range": "2.140 (220 - 2.800) Watt",
        "kapasitas_kw": 7.1,
        "cspf": 6.41,
        "refrigerant": "R32",
        "dimensi_indoor": "1.100 x 300 x 240 mm (P x T x L)",
        "berat_indoor_kg": 15,
        "dimensi_outdoor": "845 x 595 x 300 mm (P x T x L)",
        "berat_outdoor_kg": 36,
        "warna": "Two Tone White (B-613) / Light Gray (B-617)",
        "spec_raw": {
            "Set": "STKZ71XV", "Indoor": "FTKZ71XVM4", "Outdoor": "RKZ71XVM4",
            "PK": "3", "Btu/h": "24,200 (4,100 - 25,900)", "Kw": "7.1 (1.2 - 7.6)",
            "Daya Listrik (Min. - Max.)": "2,140 (220 - 2,800) W", "CSPF": "6.41",
            "Tingkat Tekanan Suara Indoor (H/M/L/SL)": "49 / 42 / 37 / 30 dB(A)",
            "Tingkat Tekanan Suara Outdoor": "52 / 49 dB(A)",
            "Indoor Dimensi (HxWxD)": "300 x 1,100 x 240 mm",
            "Indoor Berat Mesin": "15 kg",
            "Front Panel": "Two Tone White (B-613) Light Gray (B-617)",
            "Indoor Air Flow Rate H/M/L/SL (m³/min)": "22.1 / 17.0 / 12.9 / 10.1",
            "Fan Speed": "5 Steps, Quite, Auto",
            "Air Direction Control": "Right, Left, Horizontal, Downwards",
            "Air Filter": "Removable, Washable, Mildew Proof",
            "Outdoor Dimensi (HxWxD)": "595 x 845 x 300 mm",
            "Outdoor Berat Mesin": "36 kg",
            "Outdoor Casing Color": "Ivory White",
            "Outdoor Air Flow Rate H/SL (m³/min)": "45.1 / 37.9",
            "Compressor Type": "Hermetically Sealed Swing Type",
            "Refrigerant": "R32",
        },
        "sumber": "daikin.co.id",
        "sumber_url": "https://www.daikin.co.id/zeta-inverter",
    },
}

ANGKA = r"([\d.,]+)"


def num(s):
    if s is None:
        return None
    s = s.replace(".", "").replace(",", ".") if re.search(r"\d\.\d{3}", s) else s.replace(",", ".")
    try:
        v = float(s)
    except ValueError:
        return None
    return int(v) if v == int(v) else v


def first_num(text):
    if not text:
        return None
    m = re.search(ANGKA, text)
    return num(m.group(1)) if m else None


def dari_selka(unit, p):
    sp = p["spec"]
    rec = {
        "price_list_id": unit["id"],
        "brand": unit["brand"],
        "seri": unit["seri"],
        "nama_varian": unit["nama_varian"],
        "kapasitas": unit["kapasitas"],
        "sku": sp.get("Produk SKU"),
        "model_indoor": sp.get("Produk SKU"),
        "model_outdoor": None,
        "judul": p["judul"],
        "type_ac": sp.get("Type"),
        "warna": sp.get("Warna"),
        "btu": first_num(sp.get("Kapasitas Pendinginan")),
        "btu_range": sp.get("Kapasitas Pendinginan"),
        "daya_watt": first_num(sp.get("Daya Listrik (Watt)")),
        "daya_watt_range": sp.get("Daya Listrik (Watt)"),
        "kapasitas_kw": None,
        "refrigerant": sp.get("Tipe Refrigrant"),
        "cspf": first_num(sp.get("CSPF Rating")),
        "dimensi_indoor": sp.get("Dimensi (p x t x l)"),
        "berat_indoor_kg": first_num(sp.get("Berat")),
        "dimensi_outdoor": sp.get("Dimensi Ou. (p x t x l)"),
        "berat_outdoor_kg": first_num(sp.get("Berat Outdoor")),
        "pipa_cair": None,
        "pipa_gas": None,
        "pipa_max_panjang_m": None,
        "pipa_max_tinggi_m": None,
        "bahan_koil": sp.get("Bahan Evaporator & Kondensor"),
        "made_in": (sp.get("Made In") or "").strip().title() or None,
        "garansi": sp.get("Garansi Produk"),
        "luas_ruangan_m2": None,
        "fitur": p.get("fitur") or [],
        "deskripsi": p.get("deskripsi") or None,
        "spec_raw": sp,
        "sumber": "selka.id",
        "sumber_url": p.get("url"),
        "diambil_pada": TANGGAL,
    }

    pipa = p.get("pipa_hidden") or sp.get("Ukuran Pipa Cair & Gas (Inch)") or ""
    frac = re.findall(r"\d+/\d+", pipa)
    if len(frac) >= 2:
        rec["pipa_cair"], rec["pipa_gas"] = frac[0], frac[1]

    for f in rec["fitur"]:
        m = re.search(r"sampai\s+(\d+)\s*m2", f, re.I)
        if m:
            rec["luas_ruangan_m2"] = int(m.group(1))
            break
    return rec


def main():
    by_seri = {u["seri"]: u for u in UNITS}
    rows = []

    for m in MATCHED:
        rows.append(dari_selka(m["unit"], m["selka"]))

    for seri, extra in DARI_DAIKIN.items():
        u = by_seri[seri]
        rec = {
            "price_list_id": u["id"], "brand": u["brand"], "seri": seri,
            "nama_varian": u["nama_varian"], "kapasitas": u["kapasitas"],
            "model_outdoor": None, "warna": None, "berat_indoor_kg": None,
            "berat_outdoor_kg": None, "bahan_koil": None, "garansi": None,
            "luas_ruangan_m2": None, "fitur": [], "deskripsi": None,
            "made_in": None, "pipa_cair": None, "pipa_gas": None,
            "pipa_max_panjang_m": None, "pipa_max_tinggi_m": None,
            "diambil_pada": TANGGAL,
        }
        rec.update(extra)
        rows.append(rec)

    # overlay data resmi Daikin (model outdoor, kW, batas pipa)
    for r in rows:
        o = OFFICIAL.get(r["seri"])
        if not o:
            continue
        outdoor, kw, pj, tg = o
        tambahan = False
        for key, val in (("model_outdoor", outdoor), ("kapasitas_kw", kw),
                         ("pipa_max_panjang_m", pj), ("pipa_max_tinggi_m", tg)):
            if val is not None and r.get(key) is None:
                r[key] = val
                tambahan = True
        if tambahan and r["sumber"] == "selka.id":
            r["sumber"] = "selka.id + daikin.co.id"

    urut = {u["id"]: i for i, u in enumerate(UNITS)}
    rows.sort(key=lambda r: urut[r["price_list_id"]])

    json.dump(rows, open("ac-spec.json", "w"), ensure_ascii=False, indent=1)

    # Catatan skema: kolom brand/seri/nama_varian/kapasitas TIDAK ada di tabel
    # ac_spec (identitas unit hanya di ac_price_list). Empat kolom itu tetap
    # ditulis ke JSON/CSV supaya file ini enak dibaca manusia, tapi jangan
    # dimasukkan saat INSERT ke database — lihat KOLOM_DB.
    kolom = ["price_list_id", "brand", "seri", "nama_varian", "kapasitas", "sku",
             "model_indoor", "model_outdoor", "judul", "type_ac", "warna", "btu",
             "btu_range", "daya_watt", "daya_watt_range", "kapasitas_kw", "refrigerant",
             "cspf", "dimensi_indoor", "berat_indoor_kg", "dimensi_outdoor",
             "berat_outdoor_kg", "pipa_cair", "pipa_gas", "pipa_max_panjang_m",
             "pipa_max_tinggi_m", "bahan_koil", "made_in", "garansi", "luas_ruangan_m2",
             "fitur", "deskripsi", "sumber", "sumber_url", "diambil_pada"]
    with open("ac-spec.csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.DictWriter(fh, fieldnames=kolom, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            row = dict(r)
            row["fitur"] = " | ".join(r["fitur"])
            w.writerow(row)

    print("total baris:", len(rows))
    kosong = [k for k in kolom if sum(1 for r in rows if r.get(k) in (None, "", [])) > 0]
    for k in kosong:
        n = sum(1 for r in rows if r.get(k) in (None, "", []))
        print("  kosong %2d/%d : %s" % (n, len(rows), k))


if __name__ == "__main__":
    main()
