import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\Sivaraj T\\.gemini\\antigravity\\brain\\f04d082f-10de-4add-87f3-a96dce0f1fd8\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 780 },
];

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
  } catch (e) {
    console.log('Failed to launch with msedge channel, trying default chromium...', e.message);
    browser = await chromium.launch({ headless: true });
  }

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.addInitScript(() => {
      window.sessionStorage.setItem('bvf_welcome_popup_seen', 'true');
    });

    await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);

    const section = await page.$('#team');
    if (section) {
      // Scroll down progressively to trigger all whileInView observers
      await page.evaluate(async () => {
        const sec = document.querySelector('#team');
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        const startY = window.scrollY + rect.top;
        const totalHeight = rect.height;
        const steps = 6;
        for (let i = 0; i <= steps; i++) {
          window.scrollTo({ top: startY + (totalHeight * i) / steps, behavior: 'instant' });
          await new Promise((r) => setTimeout(r, 200));
        }
      });

      await page.waitForTimeout(1000);
      const shotPath = path.join(outDir, `team-${vp.name}.png`);
      await section.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);
    } else {
      console.warn(`Could not find #team for ${vp.name}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

run().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
