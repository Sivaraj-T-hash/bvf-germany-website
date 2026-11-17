import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\Sivaraj T\\.gemini\\antigravity\\brain\\f04d082f-10de-4add-87f3-a96dce0f1fd8\\screenshots';

async function run() {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => {
    window.sessionStorage.setItem('bvf_welcome_popup_seen', 'true');
  });
  console.log('Navigating to /pricing for mobile-390...');
  await page.goto('http://localhost:8080/pricing', { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(1500);

  await page.evaluate(async () => {
    const scrollHeight = document.body.scrollHeight;
    for (let y = 0; y < scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);

  const pricingMobPath = path.join(outDir, 'audit-pricing-mobile-390.png');
  await page.screenshot({ path: pricingMobPath, fullPage: true });
  console.log('Saved:', pricingMobPath);

  await browser.close();
}

run().catch((err) => {
  console.error('Mobile pricing capture error:', err);
  process.exit(1);
});
