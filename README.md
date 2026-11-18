# مزون عروس «سپید»

## صفحات
index (خانه) · collection (کالکشن با فیلتر) · dress (جزئیات لباس، مثلاً dress.html?id=3) · services (خدمات و پکیج‌ها) · about (درباره ما) · brides (عروس‌های ما) · contact (تماس) · booking (رزرو ۳ مرحله‌ای)

هدر و فوتر همه صفحات از `index.html` گرفته می‌شوند. اگر منو یا فوتر را در index تغییر دادی، این را اجرا کن تا بقیه صفحات هم به‌روز شوند:
```
python tools/build.py
```
محتوای صفحات داخلی در `tools/pages.py` است.

## اجرا
```
npm install
npx tailwindcss -i src/input.css -o dist/style.css --minify   # بیلد
npx tailwindcss -i src/input.css -o dist/style.css --watch    # حین توسعه
```
بعد `index.html` را با یک سرور محلی باز کن (مثلاً افزونه Live Server).

## عکس‌ها
در ویندوز روی `download-images.bat` دوبار کلیک کن. ۴۸ عکس انتخاب‌شده از Unsplash (لایسنس رایگان) با اندازه و نام درست، به‌صورت WebP با کیفیت ۸۰ در پوشه `images/` ذخیره می‌شوند.
اگر دانلود عکسی خطا داد، فقط اسکریپت را دوباره اجرا کن؛ عکس‌هایی که قبلاً ذخیره شده‌اند دوباره دانلود نمی‌شوند.
فهرست منبع عکس‌ها در `images/CREDITS.md` است. تا وقتی عکسی نباشد، جای آن پس‌زمینه تور نرم دیده می‌شود.
