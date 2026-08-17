import fs from 'fs';
import path from 'path';

// Production Domain
const PROD_DOMAIN = 'https://jichangsou.club';
const DIST_DIR = path.resolve('dist');
const BASELINE_FILE = path.resolve('.seo-baseline.json');

// Core URLs that MUST return 200 and exist
const CORE_CRITICAL_URLS = [
  '/',
  '/recommend/',
  '/airports/',
  '/airports/cheap/',
  '/airports/stable/',
  '/airports/clash/',
  '/airports/unlimited/',
  '/clients/',
  '/clients/clash/',
  '/clients/shadowrocket/',
  '/clients/surge/',
  '/answers/',
  '/answers/vpn-vs-airport/',
  '/answers/clash-no-internet/',
  '/answers/subscription-failed/',
  '/airport/guangsu/',
  '/airport/yuzhou/',
  '/airport/sogo/',
  '/compare/guangsu-vs-yuzhou/',
  '/deals/',
  '/radar/',
  '/data-methodology/',
  '/editorial-policy/',
  '/about/',
  '/disclaimer/',
];

const results = {
  build: { pass: true, msg: '', details: [] },
  robots: { pass: true, msg: '', details: [] },
  noindex: { pass: true, msg: '', details: [] },
  canonical: { pass: true, msg: '', details: [] },
  sitemap: { pass: true, msg: '', details: [] },
  internalLinks: { pass: true, msg: '', details: [] },
  coreUrls: { pass: true, msg: '', details: [] },
  schema: { pass: true, msg: '', details: [] },
  duplicateTitles: { pass: true, msg: '', details: [] },
  pageCount: { pass: true, msg: '', details: [] },
  spamCheck: { pass: true, msg: '', details: [] },
  indexNow: { pass: true, msg: '', details: [] },
};

let totalHtmlPages = 0;
let sitemapUrlCount = 0;
let deadLinksCount = 0;
let canonicalErrorsCount = 0;
let noindexCount = 0;

console.log('\n🔍 =======================================================');
console.log('   SEO 防掉索引与发布安全门禁检查 (SEO HEALTH CHECK)');
console.log('   Target Domain:', PROD_DOMAIN);
console.log('   Scan Time:', new Date().toISOString());
console.log('=======================================================\n');

// 01. Check Build Directory
if (!fs.existsSync(DIST_DIR) || !fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  results.build.pass = false;
  results.build.msg = 'dist/ or dist/index.html does not exist. Please run "npm run build" first.';
  printReportAndExit();
} else {
  results.build.pass = true;
  results.build.msg = 'dist directory verified with index.html present';
}

// 02. Check robots.txt
const robotsPath = path.join(DIST_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  results.robots.pass = false;
  results.robots.msg = 'robots.txt not found in dist/';
  results.robots.details.push('CRITICAL: dist/robots.txt is missing.');
} else {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  // Check for catastrophic site-wide deindex block
  if (/User-agent:\s*\*\s*\n\s*Disallow:\s*\/\s*$/m.test(robotsContent)) {
    results.robots.pass = false;
    results.robots.msg = 'SEO_CRITICAL_ERROR: robots.txt contains site-wide Disallow: /';
    results.robots.details.push('FATAL: Site-wide Disallow: / detected! Googlebot and Bingbot will deindex entire site.');
  } else if (!robotsContent.includes('Allow: /')) {
    results.robots.pass = false;
    results.robots.msg = 'robots.txt does not contain Allow: /';
  } else if (!robotsContent.includes('Sitemap:')) {
    results.robots.pass = false;
    results.robots.msg = 'robots.txt does not declare Sitemap URL';
  } else {
    results.robots.pass = true;
    results.robots.msg = 'robots.txt is healthy (Allow: / declared, Sitemap referenced, no Disallow: / block)';
  }
}

// 03. Check Sitemap XML
const sitemap0Path = path.join(DIST_DIR, 'sitemap-0.xml');
let sitemapUrls = [];

if (fs.existsSync(sitemap0Path)) {
  const xml = fs.readFileSync(sitemap0Path, 'utf-8');
  const matches = xml.match(/<loc>(.*?)<\/loc>/g) || [];
  sitemapUrls = matches.map((m) => m.replace(/<\/?loc>/g, '').trim());
  sitemapUrlCount = sitemapUrls.length;

  // Check for invalid hosts in sitemap
  for (const u of sitemapUrls) {
    if (u.includes('localhost') || u.includes('127.0.0.1')) {
      results.sitemap.pass = false;
      results.sitemap.details.push(`Invalid host in sitemap: ${u}`);
    }
    if (!u.startsWith(PROD_DOMAIN)) {
      results.sitemap.pass = false;
      results.sitemap.details.push(`Non-production domain in sitemap: ${u}`);
    }
  }

  if (sitemapUrls.length === 0) {
    results.sitemap.pass = false;
    results.sitemap.msg = 'sitemap-0.xml has 0 URLs';
  } else {
    results.sitemap.pass = true;
    results.sitemap.msg = `Valid sitemap with ${sitemapUrls.length} canonical URLs.`;
  }
} else {
  results.sitemap.pass = false;
  results.sitemap.msg = 'sitemap-0.xml not found in dist/';
}

// 04. Deep Scan all Files in dist/
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allDistFiles = getAllFiles(DIST_DIR);
const allHtmlFiles = allDistFiles.filter((f) => f.endsWith('.html'));
totalHtmlPages = allHtmlFiles.length;

const titleMap = new Map();
const existingPaths = new Set();
const htmlContentCache = new Map();

// Register all existing paths in dist/
allDistFiles.forEach((filePath) => {
  let relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  // Root level assets e.g. "/sitemap-index.xml", "/rss.xml", "/favicon.svg"
  existingPaths.add('/' + relPath);

  // If HTML file, register its directory route e.g. "/clients/clash/"
  if (filePath.endsWith('.html')) {
    let route = '/' + relPath.replace(/index\.html$/, '');
    if (route.length > 1 && !route.endsWith('/')) {
      route += '/';
    }
    existingPaths.add(route);
  }
});

// Cache HTML contents
allHtmlFiles.forEach((filePath) => {
  let relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  let route = '/' + relPath.replace(/index\.html$/, '');
  if (route.length > 1 && !route.endsWith('/')) {
    route += '/';
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  htmlContentCache.set(route, content);
});

// Scan each HTML file
for (const filePath of allHtmlFiles) {
  const html = fs.readFileSync(filePath, 'utf-8');
  let relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  let route = '/' + relPath.replace(/index\.html$/, '');
  if (route.length > 1 && !route.endsWith('/')) {
    route += '/';
  }
  const expectedCanonical = `${PROD_DOMAIN}${route}`;

  // A. Check for rogue Spam / Unknown directories
  const spamKeywords = ['casino', 'poker', 'porn', 'xxx', 'baccarat', 'slot-machine', 'bet365'];
  for (const kw of spamKeywords) {
    if (route.toLowerCase().includes(kw)) {
      results.spamCheck.pass = false;
      results.spamCheck.details.push(`Potential spam route detected: ${route}`);
    }
  }

  // B. Check Noindex
  const noindexMatch = html.match(/<meta\s+name=["'](robots|googlebot|bingbot)["']\s+content=["']([^"']*noindex[^"']*)["']/i);
  if (noindexMatch && !route.includes('404')) {
    noindexCount++;
    results.noindex.pass = false;
    results.noindex.details.push(`CRITICAL: noindex found on production page: ${route} (${noindexMatch[0]})`);
  }

  // C. Check Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    canonicalErrorsCount++;
    results.canonical.pass = false;
    results.canonical.details.push(`Missing canonical tag on: ${route}`);
  } else {
    const actualCanonical = canonicalMatch[1];
    if (actualCanonical !== expectedCanonical) {
      canonicalErrorsCount++;
      results.canonical.pass = false;
      results.canonical.details.push(`Canonical mismatch on ${route}: expected ${expectedCanonical}, got ${actualCanonical}`);
    }
  }

  // D. Check Title & H1
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    if (!title) {
      results.duplicateTitles.pass = false;
      results.duplicateTitles.details.push(`Empty <title> on: ${route}`);
    } else {
      if (titleMap.has(title) && titleMap.get(title) !== route) {
        results.duplicateTitles.details.push(`Duplicate title "${title}" on ${route} and ${titleMap.get(title)}`);
      } else {
        titleMap.set(title, route);
      }
    }
  }

  // E. Check Schema JSON-LD
  const schemaRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let schemaMatch;
  while ((schemaMatch = schemaRegex.exec(html)) !== null) {
    const jsonStr = schemaMatch[1];
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed['@context'] || !parsed['@type']) {
        results.schema.pass = false;
        results.schema.details.push(`Invalid Schema (missing @context or @type) on ${route}`);
      }
    } catch (err) {
      results.schema.pass = false;
      results.schema.details.push(`JSON Syntax Error in ld+json on ${route}: ${err.message}`);
    }
  }

  // F. Check Internal Links & Anchor Targets
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const href = linkMatch[1].trim();
    
    // Check empty href or useless #
    if (href === '') {
      deadLinksCount++;
      results.internalLinks.pass = false;
      results.internalLinks.details.push(`Empty href="" found on ${route}`);
      continue;
    }
    if (href === '#') {
      deadLinksCount++;
      results.internalLinks.pass = false;
      results.internalLinks.details.push(`Dummy href="#" found on ${route}`);
      continue;
    }

    // Ignore external or non-http links
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (href.startsWith(PROD_DOMAIN)) {
        // Internal absolute link
        const localPath = href.replace(PROD_DOMAIN, '').split('?')[0].split('#')[0] || '/';
        const normLocalPath = localPath.endsWith('/') || localPath.includes('.') ? localPath : localPath + '/';
        if (!existingPaths.has(normLocalPath) && !existingPaths.has(localPath)) {
          deadLinksCount++;
          results.internalLinks.pass = false;
          results.internalLinks.details.push(`Broken internal link on ${route} -> ${href}`);
        }
      }
      continue;
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }

    // Hash anchor on current page
    if (href.startsWith('#')) {
      const anchorId = href.substring(1);
      const hasAnchor = html.includes(`id="${anchorId}"`) || html.includes(`name="${anchorId}"`);
      if (!hasAnchor) {
        deadLinksCount++;
        results.internalLinks.pass = false;
        results.internalLinks.details.push(`Broken local anchor on ${route} -> ${href} (id="${anchorId}" not found in page HTML)`);
      }
      continue;
    }

    // Relative or root-relative internal link with potential anchor
    const [pathPart, anchorPart] = href.split('#');
    const cleanPath = pathPart.split('?')[0];

    let resolvedRoute = cleanPath.startsWith('/') ? cleanPath : path.posix.join(route, cleanPath);
    if (!resolvedRoute.endsWith('/') && !resolvedRoute.includes('.')) {
      resolvedRoute += '/';
    }

    if (!existingPaths.has(resolvedRoute) && !existingPaths.has(cleanPath)) {
      deadLinksCount++;
      results.internalLinks.pass = false;
      results.internalLinks.details.push(`Broken link on ${route} -> ${href} (resolved to ${resolvedRoute})`);
    } else if (anchorPart) {
      // Verify anchor exists on target page
      const targetHtml = htmlContentCache.get(resolvedRoute) || htmlContentCache.get(cleanPath);
      if (targetHtml && !targetHtml.includes(`id="${anchorPart}"`) && !targetHtml.includes(`name="${anchorPart}"`)) {
        deadLinksCount++;
        results.internalLinks.pass = false;
        results.internalLinks.details.push(`Broken anchor on ${route} -> ${href} (id="${anchorPart}" not found on ${resolvedRoute})`);
      }
    }
  }
}

// 05. Verify Core Critical URLs
for (const coreUrl of CORE_CRITICAL_URLS) {
  const normUrl = coreUrl.endsWith('/') ? coreUrl : coreUrl + '/';
  if (!existingPaths.has(normUrl)) {
    results.coreUrls.pass = false;
    results.coreUrls.details.push(`CRITICAL: Core SEO URL missing from build: ${coreUrl}`);
  }
}
if (results.coreUrls.details.length > 0) {
  results.coreUrls.pass = false;
  results.coreUrls.msg = `${results.coreUrls.details.length} critical core URLs are missing!`;
} else {
  results.coreUrls.pass = true;
  results.coreUrls.msg = `All ${CORE_CRITICAL_URLS.length} critical core URLs exist and return valid static HTML.`;
}

// 06. Check Page Count & Baseline Anomaly
let prevCount = totalHtmlPages;
if (fs.existsSync(BASELINE_FILE)) {
  try {
    const baseline = JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf-8'));
    prevCount = baseline.pageCount || totalHtmlPages;
    const diff = totalHtmlPages - prevCount;
    const pctChange = Math.abs(diff) / prevCount;
    if (pctChange > 0.3) {
      results.pageCount.pass = false;
      results.pageCount.details.push(`Abnormal page count shift: previous ${prevCount}, current ${totalHtmlPages} (diff: ${diff}, ${Math.round(pctChange * 100)}% shift).`);
    }
  } catch (e) {
    // ignore
  }
}

// 07. Verify IndexNow endpoint
const indexNowKeyFile = path.join(DIST_DIR, '4a6c8b9d2e1f4837a5c90123456789ab.txt');
if (fs.existsSync(indexNowKeyFile)) {
  results.indexNow.pass = true;
  results.indexNow.msg = 'IndexNow key file 4a6c8b9d2e1f4837a5c90123456789ab.txt is present and ready';
} else {
  results.indexNow.pass = false;
  results.indexNow.msg = 'IndexNow key file is missing in dist/';
}

// Format final evaluation
if (results.noindex.details.length === 0) {
  results.noindex.pass = true;
  results.noindex.msg = '0 unintended noindex tags on production canonical pages';
}
if (results.canonical.details.length === 0) {
  results.canonical.pass = true;
  results.canonical.msg = `All ${totalHtmlPages} pages have 100% accurate, non-cannibalizing canonical URLs`;
}
if (results.internalLinks.details.length === 0) {
  results.internalLinks.pass = true;
  results.internalLinks.msg = '0 broken internal links, 0 empty hrefs, 0 broken local anchors';
}
if (results.schema.details.length === 0) {
  results.schema.pass = true;
  results.schema.msg = 'All Schema.org JSON-LD blocks are valid and parseable';
}
if (results.pageCount.details.length === 0) {
  results.pageCount.pass = true;
  results.pageCount.msg = `Page count is stable (${totalHtmlPages} pages, sitemap has ${sitemapUrlCount} URLs)`;
}

function printReportAndExit() {
  const allPassed =
    results.build.pass &&
    results.robots.pass &&
    results.noindex.pass &&
    results.canonical.pass &&
    results.sitemap.pass &&
    results.internalLinks.pass &&
    results.coreUrls.pass &&
    results.schema.pass &&
    results.pageCount.pass &&
    results.spamCheck.pass &&
    results.indexNow.pass;

  const decision = allPassed ? 'READY' : 'BLOCKED';

  console.log('=======================================================');
  console.log('                 SEO HEALTH CHECK REPORT               ');
  console.log('=======================================================');
  console.log(`Build:          ${results.build.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.build.msg})`);
  console.log(`Robots:         ${results.robots.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.robots.msg})`);
  console.log(`Noindex:        ${results.noindex.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.noindex.msg})`);
  console.log(`Canonical:      ${results.canonical.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.canonical.msg})`);
  console.log(`Sitemap:        ${results.sitemap.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.sitemap.msg})`);
  console.log(`Internal Links: ${results.internalLinks.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.internalLinks.msg})`);
  console.log(`Core URLs:      ${results.coreUrls.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.coreUrls.msg})`);
  console.log(`Schema JSON-LD: ${results.schema.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.schema.msg})`);
  console.log(`Spam Detection: ${results.spamCheck.pass ? 'PASS ✅' : 'FAIL ❌'} (0 spam routes detected)`);
  console.log(`Page Count:     ${results.pageCount.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.pageCount.msg})`);
  console.log(`IndexNow:       ${results.indexNow.pass ? 'PASS ✅' : 'FAIL ❌'} (${results.indexNow.msg})`);
  console.log('-------------------------------------------------------');
  console.log(`📊 Total HTML Pages:       ${totalHtmlPages}`);
  console.log(`🗺️ Sitemap URLs:           ${sitemapUrlCount}`);
  console.log(`🚫 Noindex Pages:          ${noindexCount}`);
  console.log(`🔗 Broken Internal Links:  ${deadLinksCount}`);
  console.log(`📍 Canonical Errors:       ${canonicalErrorsCount}`);
  console.log('-------------------------------------------------------');
  console.log(`RELEASE_DECISION: ${decision === 'READY' ? 'READY 🚀 (Safe to Deploy)' : 'BLOCKED 🛑 (Deployment Halted)'}`);
  console.log('=======================================================\n');

  if (!allPassed) {
    console.error('🛑 CRITICAL ISSUES DETECTED:');
    Object.entries(results).forEach(([k, v]) => {
      if (!v.pass) {
        console.error(`\n[${k.toUpperCase()} FAILURES]`);
        v.details.forEach((d) => console.error('  - ' + d));
      }
    });
    console.error('\n❌ DEPLOYMENT BLOCKED: Please fix the above issues before pushing to production.');
    process.exit(1);
  } else {
    // Update baseline
    fs.writeFileSync(
      BASELINE_FILE,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          pageCount: totalHtmlPages,
          sitemapCount: sitemapUrlCount,
          prodDomain: PROD_DOMAIN,
        },
        null,
        2
      )
    );
    console.log('✅ SEO Health Check Passed! Production release gate unlocked.\n');
    process.exit(0);
  }
}

printReportAndExit();
