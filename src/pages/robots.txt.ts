import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.toString().replace(/\/$/, '') : 'https://jichangsou.club';
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap-index.xml
`;
  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
