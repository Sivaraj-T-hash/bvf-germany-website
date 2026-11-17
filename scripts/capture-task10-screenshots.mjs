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
    
    // Wait for articles to load from store
    await page.waitForSelector('#knowledge-hub article', { timeout: 10000 });

    const section = await page.$('#knowledge-hub');
    if (section) {
      // Progressively scroll each card and the bottom CTA into view to trigger whileInView
      await page.evaluate(async () => {
        const sec = document.querySelector('#knowledge-hub');
        if (!sec) return;
        sec.scrollIntoView({ behavior: 'instant', block: 'start' });
        await new Promise((r) => setTimeout(r, 200));

        const articles = sec.querySelectorAll('article');
        for (const article of articles) {
          article.scrollIntoView({ behavior: 'instant', block: 'center' });
          await new Promise((r) => setTimeout(r, 300));
        }

        const bottomCta = sec.querySelector('a[href="/blog"]');
        if (bottomCta) {
          bottomCta.scrollIntoView({ behavior: 'instant', block: 'center' });
          await new Promise((r) => setTimeout(r, 300));
        }

        // Hide floating elements (header and whatsapp widget) so they don't overlay the section capture
        const header = document.querySelector('header');
        if (header) header.style.display = 'none';

        const whatsapp = document.querySelector('[data-whatsapp-float], #whatsapp-float, .whatsapp-float, a[href*="whatsapp"]');
        if (whatsapp && whatsapp.closest('.fixed')) {
          whatsapp.closest('.fixed').style.display = 'none';
        }
      });

      await page.waitForTimeout(600);
      const shotPath = path.join(outDir, `knowledge-hub-${vp.name}.png`);
      await section.screenshot({ path: shotPath });
      console.log(`Saved screenshot: ${shotPath}`);
    } else {
      console.warn(`Could not find #knowledge-hub for ${vp.name}`);
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
