<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/974d7ad1-5c5a-4e2d-8e94-1ca8d74aba72

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy to Vercel

این پروژه کاملاً برای استقرار روی **Vercel** آماده و پیکربندی شده است (`vercel.json` تنظیم شده است).

### روش ۱: استقرار از طریق گیت‌هاب (پیشنهادی)
1. پروژه را روی مخزن گیت‌هاب خود پوش (`push`) کنید.
2. وارد پنل [vercel.com](https://vercel.com) شوید و روی **Add New... > Project** کلیک کنید.
3. مخزن گیت‌هاب پروژه را انتخاب کرده و روی **Deploy** کلیک کنید. Vercel به طور خودکار نوع پروژه (Vite) و تنظیمات بیلد را تشخیص می‌دهد و آن را مستقر می‌کند.

### روش ۲: استقرار با Vercel CLI
```bash
npm i -g vercel
vercel
```
دستورات بیلد و پوشه خروجی از قبل در `vercel.json` تنظیم شده‌اند:
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

