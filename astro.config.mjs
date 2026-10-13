import { defineConfig } from 'astro/config';

function normalizeBasePath(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === '/') return '/';
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`;
}

function readSiteUrl(value) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const url = new URL(trimmed);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('SITE_URL must use http or https.');
  }
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('SITE_URL must be an origin without credentials, path, query, or hash. Use BASE_PATH for a subdirectory.');
  }
  return url.origin;
}

const base = normalizeBasePath(process.env.BASE_PATH || '/');
const site = readSiteUrl(process.env.SITE_URL);
const indexSetting = process.env.SITE_INDEXABLE?.trim().toLowerCase();

if (indexSetting && !['true', 'false'].includes(indexSetting)) {
  throw new Error('SITE_INDEXABLE must be either true or false.');
}
if (indexSetting === 'true' && !site) {
  throw new Error('SITE_INDEXABLE=true requires an explicit SITE_URL.');
}

export default defineConfig({
  output: 'static',
  site,
  base,
  trailingSlash: 'always',
  compressHTML: true,
});
