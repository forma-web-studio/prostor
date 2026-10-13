const rawIndexSetting = import.meta.env.SITE_INDEXABLE;
const indexSetting = rawIndexSetting === undefined
  ? undefined
  : String(rawIndexSetting).trim().toLowerCase();

export function isSiteIndexable(site: URL | undefined): boolean {
  return indexSetting === 'true' && Boolean(site);
}

export function normalizePagePath(pathname: string): string {
  if (pathname === '/') return pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function absoluteUrl(site: URL, pathname: string, trailingSlash = true): string {
  return new URL(trailingSlash ? normalizePagePath(pathname) : pathname, site).href;
}

export function sitemapRoutes(): string[] {
  return [
    '/',
    '/projects/',
    '/projects/svet-i-dub/',
    '/projects/dom-u-sada/',
    '/projects/tishina-goroda/',
    '/projects/liniya-lesa/',
    '/services/',
    '/services/planning/',
    '/services/design/',
    '/services/supply/',
    '/services/supervision/',
    '/services/consultation/',
    '/studio/',
    '/contact/',
    '/privacy/',
  ];
}

export function withDeploymentBase(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${pathname}`.replace(/\/{2,}/g, '/');
}

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
