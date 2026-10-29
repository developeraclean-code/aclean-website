import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'backlinks') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html') && !file.endsWith('__raw.html'));
const failures = [];

const forbidden = [
  [/Rp\s*85(?:\.000|rb)/i, 'tarif cleaning lama Rp85.000'],
  [/Cek Kebocoran Gratis/i, 'klaim cek kebocoran gratis'],
  [/paket khusus renovasi (?:seharga )?Rp\s*500\.000/i, 'paket renovasi lama Rp500.000'],
  [/Kuras vacuum \+Rp\s*150\.000/i, 'selisih vacuum yang bisa disalahartikan sebagai harga final'],
  [/Cleaning AC Split 2 PK<\/td><td>Rp\s*110\.000/i, 'tarif cleaning 2 PK lama'],
  [/Cleaning AC Window<\/td><td>Rp\s*75\.000/i, 'tarif cleaning window yang tidak ada di price_list'],
  [/Freon R-(?:32|410A)<\/td><td>Rp\s*(?:350|400|450)\.000/i, 'tarif freon lama'],
  [/Service Besar 1[,.]5[–-]2(?:[,.]5)? PK<\/td><td><strong>Rp\s*500\.000/i, 'service besar harus Rp450.000'],
  [/3 unit(?: AC)? \(?Rp\s*270\.000/i, 'diskon borongan di luar price_list'],
  [/5 unit(?: AC)? \(?Rp\s*445\.000/i, 'diskon borongan di luar price_list'],
  [/Perawatan Berkala<\/td><td>Rp\s*100\.000\/PK/i, 'tarif kontrak di luar price_list'],
  [/Perbaikan AC Bocor.{0,120}Rp\s*150\.000/is, 'tarif perbaikan bocor di luar price_list'],
];

for (const file of htmlFiles) {
  const rel = path.relative(root, file);
  const content = fs.readFileSync(file, 'utf8');
  for (const [pattern, message] of forbidden) {
    if (pattern.test(content)) failures.push(`${rel}: ${message}`);
  }

  const scripts = [...content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((match, index) => {
    const attrs = match[1];
    if (/\bsrc\s*=|application\/ld\+json|type\s*=\s*["'](?:application\/json|module)["']/i.test(attrs)) return;
    try {
      new vm.Script(match[2], { filename: `${rel}:inline-script-${index + 1}` });
    } catch (error) {
      failures.push(`${rel}: JavaScript tidak valid (${error.message})`);
    }
  });
}

const order = fs.readFileSync(path.join(root, 'order.html'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'admin-order.html'), 'utf8');
const sql = fs.readFileSync(path.join(root, 'data/supabase-pricing-source.sql'), 'utf8');

for (const [label, content, needles] of [
  ['order.html', order, ["CATALOG_VERSION = 'v3'", 'get_website_pricing', 'applyCanonicalPricing']],
  ['admin-order.html', admin, ["CATALOG_VERSION = 'v3'", 'get_website_pricing', 'admin_save_website_prices']],
  ['data/supabase-pricing-source.sql', sql, ['create or replace function public.get_website_pricing()', 'create or replace function public.admin_save_website_prices']],
]) {
  for (const needle of needles) {
    if (!content.includes(needle)) failures.push(`${label}: penanda sumber harga hilang: ${needle}`);
  }
}

if (failures.length) {
  console.error(`Audit harga gagal (${failures.length} temuan):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Audit harga lulus: ${htmlFiles.length} halaman HTML, inline JavaScript, order, admin, dan RPC tervalidasi.`);
