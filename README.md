# ozaib.ink — مدونة عربية احترافية

مدونة عربية مستقلة في الفكر والأدب والتقنية، مبنية بأحدث التقنيات مع دعم كامل للغة العربية (RTL).

## ✨ المميزات

### للمستخدم
- 📖 **مقالات عربية أصيلة** في الفلسفة، الأدب، التقنية، التنمية الذاتية، والخواطر
- 🌗 **الوضع الليلي/النهاري** مع تبديل سلس
- 🔍 **بحث متقدم** بفلترة متعددة (تصنيف، كاتب، وسوم، ترتيب)
- 📖 **وضع قراءة مريح** (تحكم بحجم الخط والخلفية)
- 💬 **نظام تعليقات** (بانتظار موافقة الإدارة)
- 👥 **صفحات الكُتّاب** المستقلة
- 📱 **PWA** - يعمل offline ويمكن تثبيته على الجهاز
- 📡 **RSS feed** للاشتراك في التحديثات

### للإدارة
- 🔐 **لوحة تحكم محمية** بكلمة مرور
- 📝 **محرر مقالات** مع معاينة Markdown مباشرة (3 أوضاع)
- 📸 **رفع الصور** بالسحب والإفلات (مع تحسين تلقائي)
- 🗂️ **إدارة كاملة**: مقالات، تصنيفات، كُتّاب، مشتركون، تعليقات
- 📊 **إحصائيات** ورسوم بيانية
- 📧 **تنزيل المشتركين** كـ CSV

## 🚀 التشغيل المحلي

```bash
# 1. تثبيت الاعتماديات
bun install

# 2. إعداد قاعدة البيانات
cp .env.example .env
# عدّل كلمات المرور في .env
bun run db:push

# 3. تهيئة البيانات الأولية (مقالات تجريبية)
bun run scripts/seed.ts

# 4. تشغيل السيرفر
bun run dev
```

افتح [http://localhost:3000](http://localhost:3000)

### الوصول للوحة التحكم
- أضف `#admin` للرابط: `http://localhost:3000/#admin`
- كلمة المرور من ملف `.env` (الافتراضية: `ozaib-admin-2024-secure`)

## 🏗️ النشر على Vercel

1. ارفع المشروع لـ GitHub
2. اربطه بـ [Vercel](https://vercel.com)
3. أضف متغيرات البيئة من `.env.example`
4. **غيّر كلمة المرور** قبل النشر!
5. اربط نطاق `ozaib.ink` في إعدادات Vercel

## 🛠️ التقنيات المستخدمة

| الفئة | التقنية |
|------|---------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (New York) |
| Database | Prisma ORM + SQLite |
| Fonts | Cairo + Amiri (Google Fonts) |
| Icons | lucide-react |
| Markdown | react-markdown |
| Image Processing | sharp |
| Analytics | Google Analytics 4 |

## 📁 بنية المشروع

```
src/
├── app/
│   ├── api/           # API routes
│   │   ├── admin/     # محمية بكلمة مرور
│   │   ├── posts/     # عام
│   │   ├── comments/  # عام
│   │   └── search/    # عام
│   ├── globals.css    # الأنماط العامة
│   ├── layout.tsx     # التخطيط الرئيسي
│   ├── page.tsx       # الصفحة الرئيسية (state-based routing)
│   ├── sitemap.ts     # sitemap.xml
│   ├── robots.ts      # robots.txt
│   └── feed.xml/      # RSS feed
├── components/
│   ├── admin/         # مكوّنات لوحة التحكم
│   └── blog/          # مكوّنات المدونة
└── lib/
    ├── auth.ts        # نظام المصادقة
    ├── db.ts          # Prisma client
    └── types.ts       # أنواع TypeScript

public/
├── uploads/           # الصور المرفوعة
├── sw.js              # Service Worker
└── manifest.json     # PWA manifest
```

## 🔒 الأمان

- ✅ Sessions محمية بـ HttpOnly cookies
- ✅ التحقق من الصلاحيات في كل API
- ✅ Security headers (XSS, CSRF, etc.)
- ✅ Rate limiting على APIs الحساسة
- ✅ التحقق من حجم ونوع الصور المرفوعة
- ⚠️ **غيّر كلمة المرور الافتراضية قبل النشر!**

## 📊 الميزات التقنية

### SEO
- Sitemap تلقائي
- robots.txt
- Open Graph meta tags
- Twitter Card
- RSS feed
- Canonical URLs
- دعم اللغة العربية (ar-AR)

### PWA
- Service Worker (offline support)
- Web App Manifest
- قابل للتثبيت على الأجهزة
- Works offline (آخر مقال تمت زيارته)

### Performance
- Next.js 16 Turbopack
- Image optimization (sharp)
- Lazy loading
- Code splitting
- Static generation حيث أمكن

## 📝 الرخصة

هذا المشروع خاص بـ ozaib.ink. جميع الحقوق محفوظة © 2024
