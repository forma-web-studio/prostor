import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};
const root = resolve(option('--dir', 'dist'));
const jsonTarget = option('--json', '');
const keyRoutes = ['index.html', 'projects/index.html', 'projects/svet-i-dub/index.html', 'projects/dom-u-sada/index.html', 'services/index.html', 'contact/index.html'];
const compressible = new Set(['.html', '.css', '.js', '.svg', '.txt', '.json', '.xml']);
const imageExtensions = new Set(['.avif', '.webp', '.jpg', '.jpeg', '.png', '.gif', '.svg']);

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes:true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));
  return nested.flat();
};

const sizeRecord = (buffer) => ({
  raw:buffer.byteLength,
  gzip:gzipSync(buffer, { level:9 }).byteLength,
  brotli:brotliCompressSync(buffer, { params:{ [constants.BROTLI_PARAM_QUALITY]:11 } }).byteLength,
});

const files = await walk(root);
const records = [];
for (const file of files) {
  const extension = extname(file).toLowerCase();
  const buffer = await readFile(file);
  records.push({
    path:relative(root, file).split(sep).join('/'),
    extension,
    ...(compressible.has(extension) ? sizeRecord(buffer) : { raw:buffer.byteLength }),
  });
}
const byPath = new Map(records.map((record) => [record.path, record]));
const totals = (extensions) => records.filter((record) => extensions.has(record.extension)).reduce((sum, record) => ({
  raw:sum.raw + record.raw,
  gzip:sum.gzip + (record.gzip ?? 0),
  brotli:sum.brotli + (record.brotli ?? 0),
}), { raw:0, gzip:0, brotli:0 });

const normalizeReference = (value) => {
  const clean = value.replace(/^https?:\/\/[^/]+/i, '').split(/[?#]/, 1)[0];
  const astroIndex = clean.indexOf('/_astro/');
  if (astroIndex >= 0) return clean.slice(astroIndex + 1);
  const ogIndex = clean.indexOf('/og/');
  if (ogIndex >= 0) return clean.slice(ogIndex + 1);
  return clean.replace(/^\/+/, '');
};

const routes = [];
for (const route of keyRoutes) {
  const htmlPath = join(root, route);
  try { await stat(htmlPath); } catch { continue; }
  const html = await readFile(htmlPath, 'utf8');
  const references = new Set();
  for (const match of html.matchAll(/(?:src|href|srcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',').flatMap((part) => part.trim().split(/\s+/).slice(0, 1))) {
      const normalized = normalizeReference(candidate);
      if (byPath.has(normalized)) references.add(normalized);
    }
  }
  const assets = [...references].map((path) => byPath.get(path));
  routes.push({
    route:route === 'index.html' ? '/' : `/${route.replace(/index\.html$/, '')}`,
    document:byPath.get(route),
    css:assets.filter((asset) => asset.extension === '.css'),
    js:assets.filter((asset) => asset.extension === '.js'),
    images:assets.filter((asset) => imageExtensions.has(asset.extension)),
    declaredTransferBytes:assets.reduce((sum, asset) => sum + asset.raw, byPath.get(route)?.raw ?? 0),
  });
}

const report = {
  generatedAt:new Date().toISOString(),
  root,
  totals:{
    html:totals(new Set(['.html'])),
    css:totals(new Set(['.css'])),
    js:totals(new Set(['.js'])),
  },
  initialJsGzip:records.filter((record) => record.extension === '.js').reduce((sum, record) => sum + (record.gzip ?? 0), 0),
  largeImageVariants:records.filter((record) => imageExtensions.has(record.extension) && record.raw >= 100_000).sort((a, b) => b.raw - a.raw),
  routes,
};

if (jsonTarget) {
  const target = resolve(jsonTarget);
  await mkdir(dirname(target), { recursive:true });
  await writeFile(target, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(JSON.stringify(report, null, 2));
