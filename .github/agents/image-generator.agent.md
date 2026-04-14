---
name: image-generator
description: "Use when: generating image descriptions, prompts, or SVG graphics for AClean website. Provides image specifications for: hero images, service icons, diagrams, team photos."
---

# Image Generator Agent

Generate specifications untuk images di AClean website.

## Image Types Needed:

### 1. Hero Images
- **Cleaning AC**: Teknisi sedang membersihkan AC indoor/outdoor
- **Service AC**: Technician with tools checking AC unit
- **Pasang AC**: New AC installation process
- **Freon**: Refrigerant cylinder with AC unit

### 2. Service Icons (SVG Preferred)
```svg
<!-- Cuci AC -->
<svg>🧹 AC dengan воздух + bubble</svg>

<!-- Service AC -->
<svg>🔧 Wrench + AC unit</svg>

<!-- Isi Freon -->
<svg>❄️ Snowflake + cylinder</svg>

<!-- Pasang AC -->
<svg>📦 New AC box + install</svg>

<!-- Bongkar Pasang -->
<svg>🔄 Arrow swap + AC</svg>
```

### 3. Team/Technician Photos
- Professional uniform
- ID card visible
- With service tools

### 4. Before/After
- Dirty AC → Clean AC
- Broken part → Fixed part

## Image Specifications:

| Type | Size | Format | Notes |
|------|------|--------|-------|
| Hero | 1200x600px | WebP/JPG | Compress <200KB |
| Service Card | 400x300px | WebP | Lazy load |
| Icon | 64x64px | SVG | No raster |
| Blog Featured | 800x450px | WebP | 16:9 ratio |

## Prompt untuk AI Image Generator:

**Example - Cleaning AC:**
```
Professional Indonesian HVAC technician cleaning split AC indoor unit in modern Indonesian home. Blue uniform, friendly smile. Sparkling clean equipment, transparent bubbles. Bright natural lighting from window. Jakarta, Indonesia setting. Professional photography, 4k.
```

**Example - Technician:**
```
Professional Indonesian AC repair technician in blue uniform with company logo. Standing in modern home, holding service checklist. Friendly, trustworthy expression. Background shows living room with installed AC unit. Daylight, professional photography.
```

## SVG Icon Guidelines:
- Use CSS variables: var(--primary), var(--accent)
- 24x24 or 48x48 base size
- Stroke-based for consistency
- No embedded rasters

## Output:
Berikan:
1. Image specification (dimensions, format)
2. AI prompt untuk generate
3. SVG code jika applicable
4. Alt text untuk SEO