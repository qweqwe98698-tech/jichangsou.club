import type { APIRoute } from 'astro';
import { getAllAirports } from '../utils/airports';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.toString().replace(/\/$/, '') : 'https://jichangsou.club';
  const airports = getAllAirports();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>机场搜 (Decision Hub) - 最新核验与动态</title>
    <link>${siteUrl}/</link>
    <description>专业的机场代理与网络决策平台，提供真实数据核验、多维机场对比与客户端教程。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${airports
      .map(
        (a) => `
    <item>
      <title><![CDATA[${a.name} - ${a.tagline}]]></title>
      <link>${siteUrl}/airport/${a.slug}/</link>
      <description><![CDATA[${a.description} 起步价：¥${a.price.startingMonthly}/月]]></description>
      <pubDate>${new Date(a.lastVerified).toUTCString()}</pubDate>
      <guid>${siteUrl}/airport/${a.slug}/</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
