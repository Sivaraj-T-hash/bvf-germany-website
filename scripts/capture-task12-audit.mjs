import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = 'C:\\Users\\Sivaraj T\\.gemini\\antigravity\\brain\\f04d082f-10de-4add-87f3-a96dce0f1fd8\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
  } catch (e) {
    console.log('Failed to launch with msedge channel, trying default chromium...', e.message);
    browser = await chromium.launch({ headless: true });
  }

  // 1. Homepage Desktop 1440
  console.log('Capturing Homepage Desktop 1440...');
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('bvf_welcome_popup_seen', 'true');
    });
    await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);

    // Scroll through page to trigger animations
    await page.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight;
      for (let y = 0; y < scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    // Capture Navigation
    const navShotPath = path.join(outDir, 'audit-navigation-desktop-1440.png');
    const headerEl = await page.$('header');
    if (headerEl) {
      await headerEl.screenshot({ path: navShotPath });
      console.log('Saved:', navShotPath);
    }

    // Capture Full Homepage Desktop
    const hpDeskPath = path.join(outDir, 'audit-homepage-desktop-1440.png');
    await page.screenshot({ path: hpDeskPath, fullPage: true });
    console.log('Saved:', hpDeskPath);

    // Capture Founder Spotlight
    const founderHeading = page.locator('text=The Vision Behind BVF Germany');
    if (await founderHeading.count() > 0) {
      await founderHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const founderCard = await founderHeading.evaluateHandle(el => el.closest('.rounded-\\[34px\\]') || el.parentElement.parentElement);
      if (founderCard) {
        const founderShotPath = path.join(outDir, 'audit-founder-spotlight-1440.png');
        await founderCard.asElement().screenshot({ path: founderShotPath });
        console.log('Saved:', founderShotPath);
      }
    }

    // Capture Profile Evaluation Form
    const evalForm = await page.$('#profile-evaluation');
    if (evalForm) {
      await evalForm.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      const evalShotPath = path.join(outDir, 'audit-profile-eval-desktop-1440.png');
      await evalForm.screenshot({ path: evalShotPath });
      console.log('Saved:', evalShotPath);
    }

    await page.close();
  }

  // 2. Homepage Mobile 390
  console.log('Capturing Homepage Mobile 390...');
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('bvf_welcome_popup_seen', 'true');
    });
    await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight;
      for (let y = 0; y < scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    const hpMobPath = path.join(outDir, 'audit-homepage-mobile-390.png');
    await page.screenshot({ path: hpMobPath, fullPage: true });
    console.log('Saved:', hpMobPath);

    await page.close();
  }

  // 3. Pricing Page Desktop 1440
  console.log('Capturing Pricing Page Desktop 1440...');
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('bvf_welcome_popup_seen', 'true');
    });
    await page.goto('http://localhost:8080/pricing', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);

    await page.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight;
      for (let y = 0; y < scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    const pricingDeskPath = path.join(outDir, 'audit-pricing-desktop-1440.png');
    await page.screenshot({ path: pricingDeskPath, fullPage: true });
    console.log('Saved:', pricingDeskPath);

    await page.close();
  }

  // 4. Pricing Page Mobile 390
  console.log('Capturing Pricing Page Mobile 390...');
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => {
      window.sessionStorage.setItem('bvf_welcome_popup_seen', 'true');
    });
    await page.goto('http://localhost:8080/pricing', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(1000);

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

    await page.close();
  }

  await browser.close();
  console.log('All audit screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Audit capture error:', err);
  process.exit(1);
});
