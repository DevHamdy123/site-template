# site-template — ملاحظات التطوير (داخلي)

أساس مواقع العملاء (Next.js 16 + Tailwind 4 + TypeScript + Zod). عربي RTL، موبايل أولًا.

## تشغيل
```bash
npm install
npm run dev        # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
```

## فحص الشاشات (موبايل/تاب/كمبيوتر)
```bash
npx playwright install chromium     # مرة واحدة
npm run build && npm start          # في ترمنال
npm run check:screens               # في ترمنال تاني: سكرين شوتس في ./screenshots + فحص السكرول الأفقي
```

## القاعدة الذهبية
> ملفات **Core** ما بتتعدّلش في مواقع العملاء. العميل ليه `src/client/` و `public/images/` بس.

| مكان | النوع | بيتغير لكل عميل؟ |
|---|---|---|
| `src/client/site.config.ts` | الاسم، الثيم، الأقسام، التواصل، الـ features | نعم |
| `src/client/items.ts` | المنتجات/الخدمات/المنيو | نعم |
| `public/images/` | صور العميل | نعم |
| `src/client/components/` | أقسام خاصة بعميل واحد (لما نحتاجها) | نعم |
| `src/config/*`, `src/components/*`, `src/lib/*`, `src/app/*` | Core | لا |

## الهيكل
```
src/app/            الصفحات (layout يحقن الثيم، page يرسم الأقسام من الكونفيج)
src/config/         schema (Zod) + themes + sections-registry
src/client/         ★ ملفات العميل
src/components/ui/  عناصر عامة (Container, Section)
src/components/     الأقسام (Hero, Items...) تُضاف خطوة بخطوة
src/lib/data/       طبقة البيانات (getItems...) — المكوّنات لا تقرأ الملف مباشرة
tests/              Vitest
```

## عميل جديد
```bash
git clone <site-template-repo> cafe-x && cd cafe-x
git remote rename origin upstream
git remote add origin <repo-العميل>
# عدّل src/client/* و public/images/ فقط
git fetch upstream && git merge upstream/main   # لجلب تحسينات الأساس لاحقًا
```

## إضافة قسم/ميزة جديدة (في الأساس)
1. فرع `feature/اسم-الميزة` ← PR ← Preview ← دمج في `main` ← tag نسخة.
2. أضف اسم القسم في `SECTION_TYPES` (config/schema.ts) وابنِ المكوّن، وسجّله في `sections-registry.ts`.
3. الميزات الاختيارية تتفعّل من `features` في الكونفيج (الافتراضي `false`).

## الثيمات
`src/config/themes.ts` فيه `warm` و `midnight` و `fresh`. غيّر `theme: themes.warm` في `site.config.ts` وشوف الفرق.
