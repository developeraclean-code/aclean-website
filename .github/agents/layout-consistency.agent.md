---
name: layout-consistency
description: "Use when: reviewing or updating any HTML file to ensure layout consistency with AClean design system. Checks: CSS variables, fonts, colors, navigation, footer, Schema.org."
---

# Layout Consistency Agent

Ensure all AClean website pages maintain consistent design system.

## Design System Reference

### CSS Variables (WAJIB kullan)
```css
:root{
--primary:#1B3A7B;--primary-light:#2B55A8;--primary-dark:#0F2354;
--primary-50:#EBF0FA;--primary-100:#C6D4F0;
--accent:#F59E0B;--accent-light:#FCD34D;
--dark:#0F172A;--dark-700:#1E293B;--dark-600:#334155;
--gray-100:#F1F5F9;--gray-200:#E2E8F0;--gray-300:#CBD5E1;--gray-400:#94A3B8;--gray-500:#64748B;
--white:#FFFFFF;
--font-heading:'Plus Jakarta Sans',sans-serif;--font-body:'DM Sans',sans-serif;
}
```

### Required Components (Setiap halaman WAJIB ada):
1. **Navigation** - Fixed top, backdrop-filter blur, logo, nav-links, nav-cta
2. **Hero Section** - Badge, h1, sub, price, CTA buttons
3. **Stats** - 4-column grid (50rb+, 4rb+, 4.9★, 10+)
4. **Footer** - 4-column grid, WA float button
5. **Schema.org** - LocalBusiness JSON-LD

### Checking Steps:
- [ ] Fonts: Plus Jakarta Sans (headings), DM Sans (body)
- [ ] Colors match CSS variables above
- [ ] Navigation has dropdown for Layanan
- [ ] Footer has correct columns
- [ ] Schema.org LocalBusiness with telephone +6281289898937
- [ ] Mobile responsive breakpoints (768px, 1024px)
- [ ] WhatsApp float button
- [ ] Meta tags (description, OG, canonical)

### Mobile Menu Structure:
```html
<div class="mob-menu">
<a href="#beranda">Beranda</a>
<a href="service-ac-tangerang-selatan.html">Layanan</a>
<a href="#harga">Harga</a>
...</div>
```

## Output:
Berikan laporan checklist dengan ✅ atau ❌ untuk setiap point.