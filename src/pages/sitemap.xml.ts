import type { APIRoute } from 'astro';
import {
  absoluteUrl,
  escapeXml,
  isSiteIndexable,
  sitemapRoutes,
  withDeploymentBase,
} from '../utils/seo';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const urls = isSiteIndexable(site) && site
    ? sitemapRoutes().map((route) => absoluteUrl(site, withDeploymentBase(route)))
    : [];
  const entries = urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n');
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
  ].filter(Boolean).join('\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
