import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const url = process.argv[2] ?? 'http://localhost:4173';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const started = Date.now();
  await page.goto(url);
  await page.getByTestId('presentation-player').waitFor();
  await page.waitForFunction(() => document.querySelector('[data-testid="presentation-player"]')?.getAttribute('data-phase') === 'paused');
  await page.waitForTimeout(500);
  const metrics = await page.evaluate(() => ({
    domNodes: document.querySelectorAll('*').length,
    thumbnails: document.querySelectorAll('.slide-card [data-slide-frame]').length,
    documentHeight: document.documentElement.scrollHeight,
    sidebarHeight: document.querySelector('.slide-sidebar').getBoundingClientRect().height,
    listHeight: document.querySelector('.slide-list').clientHeight,
    listScrollHeight: document.querySelector('.slide-list').scrollHeight,
    transferredBytes: performance.getEntriesByType('resource').reduce((total, resource) => total + resource.encodedBodySize, 0),
    mediaRequests: performance.getEntriesByType('resource').filter(resource => resource.name.includes('/media/')).length,
  }));
  metrics.readyMs = Date.now() - started;
  console.log(JSON.stringify(metrics, null, 2));
  if (process.argv[3]) await writeFile(process.argv[3], JSON.stringify(metrics, null, 2) + '\n');
} finally { await browser.close(); }
