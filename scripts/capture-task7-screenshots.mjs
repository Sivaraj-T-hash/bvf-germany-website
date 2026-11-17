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

    const section = await page.$('#student-stories');
    if (section) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      const shotPath = path.join(outDir, `student-stories-${vp.name}.png`);
      await section.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);
    } else {
      console.warn(`Could not find #student-stories for ${vp.name}`);
    }

    // Also let's capture the founder section to verify high contrast
    if (vp.name === 'desktop-1440') {
      const founderSection = await page.$('section:has-text("The Vision Behind BVF Germany")');
      if (founderSection) {
        const shotPath = path.join(outDir, `founder-contrast-verified-desktop.png`);
        await founderSection.screenshot({ path: shotPath });
        console.log(`Saved screenshot: ${shotPath}`);
      }
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
