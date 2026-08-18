#!/usr/bin/env python3
"""Cocokkan 37 SKU AClean (ac_price_list) dengan halaman produk selka.id yang sudah di-parse."""
import json
import os
import re

os.chdir(os.path.dirname(os.path.abspath(__file__)))

UNITS = json.load(open("units.json"))
PARSED = json.load(open("parsed.json"))


def norm(s):
    return re.sub(r"[^A-Z0-9]", "", (s or "").upper())


# indeks halaman selka: kunci = SKU dinormalisasi + potongan model dari judul
index = {}
for p in PARSED:
    sku = p["spec"].get("Produk SKU", "")
    keys = set()
    for part in re.split(r"[/,]", sku):
        if norm(part):
            keys.add(norm(part))
    # model dari judul: token kedua, mis. "DAIKIN FTKH25YV14 AC SPLIT ..."
    for tok in re.findall(r"\b([A-Z]{3,4}-?\d{2}[A-Z0-9-]*)\b", (p["judul"] or "").upper()):
        keys.add(norm(tok))
    for k in keys:
        index.setdefault(k, p)


def daikin_indoor(seri):
    """STKH25YV (kode set) -> kandidat kode indoor FTKH25YV14 dst."""
    m = re.match(r"^ST([A-Z]*)(\d+)(.*)$", seri.upper())
    if not m:
        return []
    fam, cap, tail = m.groups()
    out = []
    for suffix in ("YV14", "XVM4", "V14", ""):
        out.append(norm("FT" + fam + cap + suffix))
    if tail:
        out.append(norm("FT" + fam + cap + tail + "14"))
        out.append(norm("FT" + fam + cap + tail))
    return out


def candidates(u):
    seri = (u["seri"] or "").upper()
    c = [norm(seri)]
    if u["brand"] == "Daikin":
        c += daikin_indoor(seri)
    else:
        c.append(norm(seri.replace("/", "")))
        # GWC-05N1/A -> GWC-05N1 / GWC-05N1A
        c.append(norm(seri.split("/")[0]))
        c.append(norm(seri.replace("/A", "A")))
    seen, out = set(), []
    for x in c:
        if x and x not in seen:
            seen.add(x)
            out.append(x)
    return out


matched, missing = [], []
for u in UNITS:
    hit = None
    for c in candidates(u):
        if c in index:
            hit = index[c]
            break
    if hit:
        matched.append((u, hit))
    else:
        missing.append(u)

print("COCOK : %d / %d" % (len(matched), len(UNITS)))
for u, p in matched:
    print("  %-6s %-14s %-7s -> %s" % (u["brand"], u["seri"], u["kapasitas"],
                                       p["spec"].get("Produk SKU")))
print("\nTIDAK KETEMU : %d" % len(missing))
for u in missing:
    print("  %-6s %-14s %-7s  %s" % (u["brand"], u["seri"], u["kapasitas"], u["nama_varian"]))

json.dump([{"unit": u, "selka": p} for u, p in matched], open("matched.json", "w"),
          ensure_ascii=False, indent=1)
json.dump(missing, open("missing.json", "w"), ensure_ascii=False, indent=1)
