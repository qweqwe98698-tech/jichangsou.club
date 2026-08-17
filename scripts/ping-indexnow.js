import fs from 'fs';
import path from 'path';

const sitemapPath = path.resolve('dist/sitemap-0.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('sitemap-0.xml not found. Please run "npm run build" first.');
  process.exit(1);
}

const xml = fs.readFileSync(sitemapPath, 'utf-8');
const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
const urlList = urlMatches.map((m) => m.replace(/<\/?loc>/g, ''));

const indexNowPayload = {
  host: 'jichangsou.club',
  key: '4a6c8b9d2e1f4837a5c90123456789ab',
  keyLocation: 'https://jichangsou.club/4a6c8b9d2e1f4837a5c90123456789ab.txt',
  urlList: urlList,
};

console.log(`Successfully generated IndexNow payload with ${urlList.length} canonical URLs.`);
console.log(`Endpoint: https://api.indexnow.org/indexnow`);
console.log(`Payload preview:`, JSON.stringify({ ...indexNowPayload, urlList: urlList.slice(0, 3) }, null, 2));

// Save payload for CI/CD or deployment triggers
fs.writeFileSync(path.resolve('dist/indexnow-payload.json'), JSON.stringify(indexNowPayload, null, 2));
console.log('Saved dist/indexnow-payload.json for deployment triggers.');
