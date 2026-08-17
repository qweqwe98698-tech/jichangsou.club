import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const distDir = path.resolve('dist');
const targetDir = 'C:\\Users\\Pro User\\.gemini\\antigravity\\brain\\e6455741-cc83-4740-8ccb-84197ccf158d';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

function startServer(port = 4567) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      let filePath = path.join(distDir, reqPath);

      if (!fs.existsSync(filePath)) {
        if (fs.existsSync(filePath + '.html')) {
          filePath += '.html';
        } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
          filePath = path.join(filePath, 'index.html');
        } else {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
      }

      const ext = path.extname(filePath);
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(port, () => {
      console.log(`Preview server running at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer(4567);
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Screenshot (1440px)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:4567/', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({
    path: path.join(targetDir, 'homepage_desktop.png'),
    fullPage: true,
  });
  console.log('Saved desktop screenshot to homepage_desktop.png');

  // 2. Mobile Screenshot (390px)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:4567/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: path.join(targetDir, 'homepage_mobile_390px.png'),
    fullPage: true,
  });
  console.log('Saved mobile screenshot to homepage_mobile_390px.png');

  await browser.close();
  server.close();
  console.log('Capture completed successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
