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

// Proactively post to Bing & IndexNow APIs
async function postIndexNow(endpoint, label) {
  try {
    console.log(`Sending IndexNow payload to ${label} (${endpoint})...`);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(indexNowPayload),
    });
    console.log(`[${label}] Status: ${res.status} ${res.statusText}`);
    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`✅ [${label}] Successfully accepted all ${urlList.length} URLs!`);
    } else {
      console.log(`⚠️ [${label}] Status: ${res.status}`);
    }
  } catch (err) {
    console.warn(`⚠️ [${label}] Network notice: ${err.message}`);
  }
}

await postIndexNow('https://www.bing.com/indexnow', 'Bing Direct');
await postIndexNow('https://api.indexnow.org/indexnow', 'IndexNow Protocol Hub');
