#!/usr/bin/env python3
"""Parse halaman produk selka.id -> JSON (judul, SKU, tabel spesifikasi, fitur, deskripsi)."""
import html as ihtml
import json
import os
import re
import sys

PAGES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pages")


def clean(s):
    s = re.sub(r"<[^>]+>", " ", s)
    s = ihtml.unescape(s)
    s = s.replace("⌀", "⌀").replace("\xa0", " ")
    return re.sub(r"\s+", " ", s).strip()


def parse(path):
    raw = open(path, encoding="utf-8", errors="replace").read()
    if 'detail-table-specification' not in raw:
        return None

    d = {"file": os.path.basename(path)}

    m = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', raw, re.I)
    d["url"] = m.group(1) if m else None

    m = re.search(r"<h1[^>]*>(.*?)</h1>", raw, re.S | re.I)
    d["judul"] = clean(m.group(1)) if m else None

    # tabel spesifikasi
    tbl = re.search(r'<table[^>]*class="detail-table-specification".*?</table>', raw, re.S | re.I)
    spec = {}
    order = []
    if tbl:
        for k, v in re.findall(
            r'<td[^>]*class="spec-key"[^>]*>(.*?)</td>\s*<td[^>]*class="spec-value"[^>]*>(.*?)</td>',
            tbl.group(0), re.S | re.I):
            key = clean(k)
            val = clean(v)
            # buang ekor rating bintang "(...)"
            val = re.sub(r"\(\s*\)\s*$", "", val).strip()
            if not key or key in ("Customer Reviews", "Most Viewed Rank"):
                continue
            if key not in spec:
                order.append(key)
            spec[key] = val
    d["spec"] = spec
    d["spec_order"] = order

    # field tersembunyi
    for hid, name in (("hid_detail_pk", "pk_hidden"), ("hid_detail_pipe_size", "pipa_hidden")):
        m = re.search(r'id="%s"\s+value="([^"]*)"' % hid, raw)
        if m:
            d[name] = m.group(1).strip()

    # fitur / keunggulan
    fitur = []
    m = re.search(r"Apa Saja fitur Keren.*?<ul>(.*?)</ul>", raw, re.S | re.I)
    if m:
        fitur = [clean(li) for li in re.findall(r"<li>(.*?)</li>", m.group(1), re.S | re.I)]
    d["fitur"] = [f for f in fitur if f]

    # deskripsi produk resmi: blok .detail-product-description (bukan teks review pelanggan)
    m = re.search(r'<div class="detail-product-description-title">Deskripsi Produk</div>(.*?)</div>',
                  raw, re.S | re.I)
    d["deskripsi"] = clean(m.group(1)) or None if m else None

    return d


def main():
    out = []
    for fn in sorted(os.listdir(PAGES)):
        if not fn.endswith(".html"):
            continue
        rec = parse(os.path.join(PAGES, fn))
        if rec:
            out.append(rec)
    json.dump(out, open("parsed.json", "w"), ensure_ascii=False, indent=1)
    print("parsed:", len(out))
    for r in out:
        print(" ", (r["spec"].get("Produk SKU") or "?").ljust(14), "|", (r["judul"] or "")[:78])


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
