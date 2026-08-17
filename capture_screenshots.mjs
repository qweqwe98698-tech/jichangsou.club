import { chromium } from 'playwright';
import path from 'path';

const targetDir = 'C:\\Users\\Pro User\\.gemini\\antigravity\\brain\\e6455741-cc83-4740-8ccb-84197ccf158d';

async function capture() {
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
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
