import type { APIRoute } from 'astro';
import { absoluteUrl, isSiteIndexable, withDeploymentBase } from '../utils/seo';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const indexable = isSiteIndexable(site);
  const base = import.meta.env.BASE_URL;
  const body = indexable && site
    ? [
        'User-agent: *',
        `Allow: ${base}`,
        `Sitemap: ${absoluteUrl(site, withDeploymentBase('/sitemap.xml'), false)}`,
      ]
    : ['User-agent: *', 'Disallow: /'];

  return new Response(`${body.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
