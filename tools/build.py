# سازنده صفحات داخلی سپید: هدر، فوتر و بخش‌های مشترک را از index.html برمی‌دارد تا همه صفحات یکدست بمانند
import re, json
import os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..') + '/'
idx = open(ROOT + 'index.html', encoding='utf-8').read()

def cut(a, b, s=idx):
    i = s.index(a); j = s.index(b, i)
    return s[i:j]

TOP = cut('  <a href="#main" class="sr-only', '  <main id="main">')
BOTTOM = cut('  </main>', '  <!-- لایت‌باکس گالری -->').replace('  </main>\n', '', 1)
LIGHTBOX = cut('  <!-- لایت‌باکس گالری -->', '  <!-- پیام کوتاه -->')
TOAST = cut('  <!-- پیام کوتاه -->', '</body>')
CALC = cut('    <!-- ۱۱. ماشین‌حساب پکیج -->', '    <!-- ۱۲.')
JOURNEY = cut('    <!-- ۱۰. مسیر', '    <!-- ۱۱.')
FAQ = cut('    <!-- ۱۳. سؤالات متداول -->', '    <!-- ۱۴.')
TRUST = cut('    <!-- ۴. نوار اعتماد -->', '    <!-- ۵.')
_t = idx.index('        <!-- اسلایدر نظرات (نمونه) -->')
TESTI = idx[_t: idx.index('\n      </div>\n    </section>', _t)]
MOBILE_BAR = cut('  <!-- نوار چسبان پایین موبایل -->', '  <!-- نوار مقایسه -->')

def head(title, desc, scripts, extra=''):
    js = '\n'.join(f'  <script src="js/{s}.js" defer></script>' for s in scripts)
    return f'''<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#F7EFE2">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fa_IR">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="images/hero.webp">
  <link rel="preload" href="fonts/Vazirmatn-Variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="dist/style.css">
{extra}  <script src="js/images.js"></script>
  <script src="js/data.js" defer></script>
  <script src="js/main.js" defer></script>
{js}
</head>
<body class="pb-20 md:pb-0">
'''

def chrome_top(active):
    t = TOP
    if active:
        t = t.replace(f'class="nav-link transition hover:text-gold-text" href="{active}"',
                      f'class="nav-link transition hover:text-gold-text" href="{active}" aria-current="page"')
    return t

def banner(img, eyebrow, title, lead, crumbs):
    cr = ' <span aria-hidden="true">/</span> '.join(
        [f'<a href="{h}" class="hover:text-ink">{l}</a>' if h else f'<span aria-current="page" class="text-ink">{l}</span>' for l, h in crumbs])
    return f'''    <section class="relative -mt-[72px] overflow-hidden" aria-labelledby="page-title">
      <div class="ph ph-3 absolute inset-0"><img src="images/{img}.webp" alt="" fetchpriority="high" onerror="imgFallback(this)"></div>
      <div class="absolute inset-0 bg-gradient-to-l from-ivory via-ivory/85 to-ivory/30" aria-hidden="true"></div>
      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory to-transparent" aria-hidden="true"></div>
      <div class="relative mx-auto max-w-7xl px-5 pb-16 pt-36 md:px-8 md:pb-24 md:pt-44">
        <nav aria-label="مسیر صفحه" class="mb-6 text-sm text-ink-soft">{cr}</nav>
        <p class="eyebrow">{eyebrow}</p>
        <h1 id="page-title" class="max-w-2xl text-[32px] font-light leading-snug md:text-[52px]">{title}</h1>
        <p id="page-lead" class="mt-5 max-w-xl text-ink-soft md:text-lg">{lead}</p>
      </div>
    </section>
'''

CTA_BAND = '''    <section class="relative overflow-hidden py-24 md:py-28" aria-labelledby="cta-band-title">
      <div class="ph ph-3 absolute inset-0"><img src="images/cta-bg.webp" alt="" loading="lazy" class="blur-[2px]" onerror="imgFallback(this)"></div>
      <div class="absolute inset-0 bg-blush/75" aria-hidden="true"></div>
      <div class="reveal relative mx-auto max-w-2xl px-5 text-center">
        <h2 id="cta-band-title" class="text-[26px] font-light leading-snug md:text-[40px]">__T__</h2>
        <p class="mx-auto mt-4 max-w-lg">__L__</p>
        <div class="mt-8 flex flex-col items-center gap-2"><a href="booking.html" class="btn-gold">نوبت پروم رو رزرو کن</a><span class="text-sm">پرو اول رایگان، بدون هیچ تعهدی</span></div>
      </div>
    </section>
'''
def cta(t, l): return CTA_BAND.replace('__T__', t).replace('__L__', l)

def page(fname, title, desc, scripts, active, body, lightbox=False, mobile_bar=True, extra_head=''):
    bottom = BOTTOM if mobile_bar else BOTTOM.replace(MOBILE_BAR, '')
    html = head(title, desc, scripts, extra_head) + chrome_top(active) + '  <main id="main">\n' + body + '  </main>\n' + bottom + (LIGHTBOX if lightbox else '') + TOAST + '</body>\n</html>\n'
    if not mobile_bar: html = html.replace('<body class="pb-20 md:pb-0">', '<body>')
    open(ROOT + fname, 'w', encoding='utf-8').write(html)
    print('wrote', fname, len(html))

def slider_head(eyebrow, title, tid):
    return f'''        <div class="reveal flex flex-wrap items-end justify-between gap-6">
          <div><p class="eyebrow">{eyebrow}</p><h2 id="{tid}" class="section-title text-start">{title}</h2></div>
          <div class="flex gap-2">
            <button data-prev class="slider-btn" aria-label="قبلی"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></button>
            <button data-next class="slider-btn" aria-label="بعدی"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></button>
          </div>
        </div>'''

def slider_row(rid, label):
    return f'''        <div id="{rid}" class="snap-row reveal mt-12" tabindex="0" aria-label="{label}؛ برای دیدن بیشتر به چپ بکش"></div>
        <div class="slider-track" aria-hidden="true"><span class="slider-thumb" data-progress></span></div>'''

exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pages.py'), encoding='utf-8').read())
