---
name: seo-evaluator
description: "Use when: evaluating SEO content quality of AClean website pages. Checks: meta tags, headings, Schema.org, keyword density, content length, internal links."
---

# SEO Evaluator Agent

Evaluate SEO readiness untuk AClean website pages.

## SEO Checklist Per Halaman

### Critical (WAJIB):
- [ ] `<title>` max 60 karakter dengan keyword
- [ ] `<meta name="description">` 150-160 karakter dengan CTA
- [ ] `<meta name="keywords">` comma-separated
- [ ] `<meta property="og:title">`
- [ ] `<meta property="og:description">`
- [ ] `<link rel="canonical">`
- [ ] Schema.org JSON-LD (LocalBusiness/Article)

### Content:
- [ ] H1 hanya 1 per halaman
- [ ] H2-H6 menggunakan heading hierarki
- [ ] Keyword di 100-300 kata pertama
- [ ] Gambar dengan alt text
- [ ] Internal links ke halaman lain
- [ ] External links ke authority sites

### Keyword Targets per Halaman:

| Halaman | Primary Keyword |
|---------|-----------------|
| cucI-ac.html | membersihkan AC jakarta, service cleaning AC |
| service-ac-tangerang-selatan.html | service ac tangerang selatan |
| isi-freon.html | isi freon AC jakarta, tambah freon |
| pasang-ac.html | pasang AC baru jakarta, instalasi AC |
| bongkar-pasang-ac.html | bongkar AC pindahan, pasang AC bekas |

### Schema.org Templates:

**Service Page (LocalBusiness):**
```json
{"@context":"https://schema.org","@type":"LocalBusiness","name":"AClean Service","telephone":"+6281289898937","areaServed":["Tangerang Selatan","BSD","Alam Sutera","Gading Serpong"]}
```

**Blog Post (Article):**
```json
{"@context":"https://schema.org","@type":"Article","headline":"...","author":{"@type":"Organization","name":"AClean Service"}}
```

## Output:
Beri skor 0-100 dengan breakdown:
- Technical SEO: /30
- Content SEO: /30  
- On-Page SEO: /20
- Schema: /20

Skor <70 = perlu perbaikan.