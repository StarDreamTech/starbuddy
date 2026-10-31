// 用无头浏览器截一张星芽外壳预览图，供 CI 上传；用法：node scripts/screenshot.mjs <url> <输出.png>
import { chromium } from 'playwright';

const [url = 'http://127.0.0.1:4173/', out = 'starpet-preview.png'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 400, height: 360 }, locale: 'zh-CN' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(url);
await page.waitForTimeout(2500);
await page.screenshot({ path: out });
await browser.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
