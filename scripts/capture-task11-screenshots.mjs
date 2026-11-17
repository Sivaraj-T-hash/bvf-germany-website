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

    // Hide fixed elements during screenshot capture
    await page.evaluate(() => {
      const header = document.querySelector('header');
      if (header) header.style.display = 'none';
      const whatsapp = document.querySelector('[data-whatsapp-float], #whatsapp-float, .whatsapp-float, a[href*="whatsapp"]');
      if (whatsapp && whatsapp.closest('.fixed')) {
        whatsapp.closest('.fixed').style.display = 'none';
      }
    });

    // 1. Capture Pricing Teaser
    const pricingSec = await page.$('#pricing-teaser');
    if (pricingSec) {
      await pricingSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const shotPath = path.join(outDir, `pricing-teaser-${vp.name}.png`);
      await pricingSec.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);
    }

    // 2. Capture Homepage FAQs
    const faqSec = await page.$('#faqs');
    if (faqSec) {
      await faqSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const shotPath = path.join(outDir, `homepage-faqs-${vp.name}.png`);
      await faqSec.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);
    }

    // 3. Capture Profile Evaluation Section
    const evalSec = await page.$('#profile-evaluation');
    if (evalSec) {
      await evalSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      const shotPath = path.join(outDir, `profile-eval-${vp.name}.png`);
      await evalSec.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('All Task 11 screenshots captured successfully.');
}

run().catch((err) => {
  console.error('Screenshot error:', err);
  process.exit(1);
});
