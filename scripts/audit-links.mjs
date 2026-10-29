import fs from 'node:fs';
import path from 'node:path';

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

function resolveLocal(sourceFile, rawHref) {
  const href = rawHref.trim();
  if (!href || href.includes('${') || href.startsWith('#') || /^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(href)) return null;
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return null;
  let target = clean.startsWith('/') ? path.join(root, clean.slice(1)) : path.resolve(path.dirname(sourceFile), clean);
  if (clean.endsWith('/')) target = path.join(target, 'index.html');
  if (!path.extname(target)) target = path.join(target, 'index.html');
  return target;
}

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
    const target = resolveLocal(file, match[1]);
    if (target && !fs.existsSync(target)) {
      failures.push(`${path.relative(root, file)} -> ${match[1]}`);
    }
  }
}

if (failures.length) {
  console.error(`Audit link lokal gagal (${failures.length} link):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Audit link lokal lulus untuk ${htmlFiles.length} halaman HTML.`);
