# محتوای صفحات داخلی (توسط build.py اجرا می‌شود)

ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>'

# ---------------------------------------------------------------- کالکشن
collection_body = banner('page-collection', 'کالکشن ۱۴۰۵', 'کالکشن لباس عروس سپید',
    'از پرنسسی باشکوه تا پوشیده و مینیمال؛ همه با پرو خصوصی و رایگان.', [('خانه', 'index.html'), ('کالکشن', None)]) + '''
    <section class="bg-ivory pb-24 pt-6 md:pb-28" aria-label="لباس‌ها">
      <div class="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <!-- سایدبار فیلتر (در موبایل به‌صورت کشو باز می‌شود) -->
        <aside id="filters" class="fixed inset-0 z-[65] hidden overflow-y-auto bg-ivory p-6 lg:static lg:z-auto lg:block lg:overflow-visible lg:bg-transparent lg:p-0" aria-label="فیلتر لباس‌ها">
          <div class="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:rounded-2xl lg:bg-pearl lg:p-6">
            <div class="mb-6 flex items-center justify-between">
              <h2 class="text-lg font-bold">فیلترها</h2>
              <button data-reset class="text-sm font-semibold text-gold-text underline-offset-4 hover:underline">پاک کردن</button>
              <button id="filters-close" class="grid h-10 w-10 place-items-center rounded-full bg-pearl lg:hidden" aria-label="بستن فیلترها"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
            </div>
            <div class="border-b border-line pb-6">
              <h3 class="mb-3 text-sm font-bold">سبک لباس</h3>
              <div id="style-chips" class="flex flex-wrap gap-2" role="group" aria-label="سبک"></div>
            </div>
            <div class="border-b border-line py-6">
              <h3 class="mb-3 text-sm font-bold">رنگ</h3>
              <div id="color-chips" class="flex flex-wrap gap-2" role="group" aria-label="رنگ"></div>
            </div>
            <div class="border-b border-line py-6">
              <h3 class="mb-3 text-sm font-bold">نمایش قیمت</h3>
              <div class="grid grid-cols-2 gap-1 rounded-full border border-line bg-ivory p-1 text-sm font-semibold" role="group" aria-label="نمایش قیمت">
                <button class="rounded-full py-1.5 transition aria-pressed:bg-blush" data-price="rent" aria-pressed="true">اجاره</button>
                <button class="rounded-full py-1.5 transition aria-pressed:bg-blush" data-price="buy" aria-pressed="false">خرید</button>
              </div>
            </div>
            <div class="border-b border-line py-6">
              <h3 class="mb-3 text-sm font-bold">بودجه اجاره</h3>
              <label class="sr-only" for="f-budget">بودجه اجاره</label>
              <select id="f-budget" class="field !rounded-full !py-2">
                <option value="all">همه بودجه‌ها</option><option value="b1">تا ۲۰ میلیون</option><option value="b2">۲۰ تا ۳۰ میلیون</option><option value="b3">بیش از ۳۰ میلیون</option>
              </select>
            </div>
            <div class="pt-6"><button id="f-fav" class="filter-chip w-full justify-center" aria-pressed="false">🤍 فقط علاقه‌مندی‌ها</button></div>
            <div class="mt-6 rounded-xl bg-ivory p-4 text-sm text-ink-soft lg:bg-blush/40">مطمئن نیستی؟ <a href="index.html#quiz" class="font-semibold text-gold-text underline-offset-4 hover:underline">آزمون سبک</a> را امتحان کن.</div>
            <button id="filters-apply" class="btn-gold mt-6 w-full lg:hidden">نمایش لباس‌ها</button>
          </div>
        </aside>

        <div>
          <div class="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
            <span id="result-count" class="font-semibold" aria-live="polite"></span>
            <div class="flex items-center gap-2">
              <button id="filters-open" class="filter-chip lg:hidden" aria-controls="filters" aria-expanded="false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>فیلترها <span id="filter-badge" class="hidden rounded-full bg-gold px-1.5 text-[11px] text-ink-deep"></span></button>
              <label class="sr-only" for="f-sort">مرتب‌سازی</label>
              <select id="f-sort" class="rounded-full border border-line bg-ivory px-4 py-2 text-sm">
                <option value="new">جدیدترین</option><option value="cheap">اقتصادی‌ترین</option><option value="lux">لوکس‌ترین</option>
              </select>
            </div>
          </div>
          <div id="grid" class="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3"></div>
          <div id="empty" class="hidden py-20 text-center">
            <p class="text-xl font-bold">لباسی با این فیلترها پیدا نشد</p>
            <p class="lead">بیشتر از ۲۰۰ مدل در مزون داریم؛ در پرو حتماً لباس مخصوص خودت را پیدا می‌کنیم.</p>
            <button data-reset class="btn-line mt-8">نمایش همه لباس‌ها</button>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-pearl py-24 md:py-28" aria-labelledby="popular-title" data-slider>
      <div class="mx-auto max-w-7xl px-5 md:px-8">
''' + slider_head('انتخاب عروس‌های این فصل', 'پرطرفدارترین‌ها', 'popular-title') + '\n' + slider_row('popular-row', 'لباس‌های پرطرفدار') + '''
      </div>
    </section>

    <section class="bg-ivory py-20" aria-labelledby="quiz-band">
      <div class="reveal mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-[2rem] bg-gradient-to-l from-blush/60 to-pearl px-8 py-10 text-center md:flex-row md:text-start">
        <div><h2 id="quiz-band" class="text-2xl font-bold">نمی‌دانی کدام سبک مال توست؟</h2><p class="mt-2 text-ink-soft">با ۴ سؤال ساده، سبک تو و ۳ لباس مناسبت را پیدا می‌کنیم.</p></div>
        <a href="index.html#quiz" class="btn-gold shrink-0">آزمون لباس رؤیایی</a>
      </div>
    </section>
'''
page('collection.html', 'کالکشن لباس عروس | مزون عروس سپید',
     'کالکشن لباس عروس سپید: پرنسسی، مارمید، کلوش، بوهمیان، مینیمال و پوشیده. فیلتر بر اساس رنگ و بودجه، اجاره از ۱۸ میلیون تومان.',
     ['collection'], 'collection.html', collection_body)

# ---------------------------------------------------------------- جزئیات لباس
dress_body = '''    <section class="bg-ivory pb-20 pt-10 md:pb-28" aria-label="جزئیات لباس">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <nav aria-label="مسیر صفحه" class="mb-8 text-sm text-ink-soft"><a href="index.html" class="hover:text-ink">خانه</a> <span aria-hidden="true">/</span> <a href="collection.html" class="hover:text-ink">کالکشن</a> <span aria-hidden="true">/</span> <span id="crumb-name" aria-current="page" class="text-ink"></span></nav>
        <div id="dress-root"></div>
      </div>
    </section>
''' + TRUST.replace('bg-ivory', 'bg-pearl') + '''
    <section class="bg-ivory py-24 md:py-28" aria-labelledby="similar-title" data-slider>
      <div class="mx-auto max-w-7xl px-5 md:px-8">
''' + slider_head('شاید این‌ها را هم دوست داشته باشی', 'لباس‌های مشابه', 'similar-title') + '\n' + slider_row('similar-row', 'لباس‌های مشابه') + '''
      </div>
    </section>
'''
page('dress.html', 'جزئیات لباس عروس | مزون عروس سپید',
     'مشخصات کامل لباس عروس: پارچه، یقه، دنباله، سایز و قیمت اجاره و خرید. پرو اول رایگان در مزون سپید.',
     ['dress'], 'collection.html', dress_body, lightbox=True)

# ---------------------------------------------------------------- خدمات
def service_block(i, img, eyebrow, title, text, bullets, price, service):
    flip = 'md:[&>div:first-child]:order-2' if i % 2 else ''
    lis = ''.join(f'<li class="flex gap-2"><span class="text-rose" aria-hidden="true">✦</span>{b}</li>' for b in bullets)
    return f'''        <article class="reveal grid scroll-mt-28 items-center gap-8 md:grid-cols-2 md:gap-16 {flip}" id="{img}">
          <div class="ph ph-{(i % 4) + 1} aspect-[4/3] rounded-[1.75rem] shadow-silk"><img src="images/{img}.webp" alt="{title}" loading="lazy" onerror="imgFallback(this)"></div>
          <div>
            <p class="eyebrow">{eyebrow}</p>
            <h2 class="text-2xl font-bold md:text-3xl">{title}</h2>
            <p class="mt-4 text-ink-soft">{text}</p>
            <ul class="mt-6 grid gap-2 text-ink-soft">{lis}</ul>
            <div class="mt-8 flex flex-wrap items-center gap-4">
              <a href="booking.html?service={service}" class="btn-gold">رزرو پرو برای این خدمت</a>
              <span class="text-sm"><span class="text-ink-soft">از</span> <strong>{price}</strong></span>
            </div>
          </div>
        </article>'''

services = [
  ('service-rent', 'محبوب‌ترین', 'اجاره لباس عروس', 'بیش از ۲۰۰ مدل لباس عروس آماده پرو. لباس انتخابی‌ات دقیقاً روی اندام تو تنظیم می‌شود؛ انگار برای خودت دوخته شده.',
   ['تنظیم کامل سایز در دو جلسه', 'تحویل اتوشده همراه ژپون', 'شست‌وشوی بعد از مراسم با ما'], '۱۸ میلیون تومان', 'rent'),
  ('service-custom', 'فقط مال خودت', 'فروش و دوخت اختصاصی', 'از طرح اولیه تا آخرین دکمه، لباسی که فقط برای تو طراحی می‌شود و برای همیشه پیش تو می‌ماند.',
   ['جلسه طراحی و انتخاب پارچه', 'سه نوبت پرو در مراحل دوخت', 'زمان دوخت: ۶ تا ۱۰ هفته'], '۶۵ میلیون تومان', 'custom'),
  ('service-engagement', 'اولین قدم مشترک', 'لباس نامزدی و عقد', 'سبز زمردی، زرشکی، سرمه‌ای یا نقره‌ای؛ رنگ‌هایی که عروس‌های ایرانی برای نامزدی و عقد دوست دارند.',
   ['اجاره و دوخت', 'هماهنگ با رنگ کت داماد', 'مشاوره رنگ بر اساس رنگ پوست'], '۹ میلیون تومان', 'engage'),
  ('service-evening', 'شب‌های شاد قبل از عروسی', 'لباس شب و حنابندان', 'لباس‌هایی با رنگ‌های گرم و پارچه‌های خوش‌افت برای حنابندان، پاتختی و مهمانی‌های خانوادگی.',
   ['مدل‌های پوشیده و باز', 'اجاره برای یک یا دو شب', 'اکسسوری هماهنگ'], '۷ میلیون تومان', 'evening'),
  ('service-accessory', 'جزئیات کامل‌کننده', 'تور، تاج و اکسسوری', 'تور بلند یا کوتاه، تاج ظریف یا باشکوه، دستکش و ژپون؛ همه هماهنگ با لباسی که انتخاب کرده‌ای.',
   ['ست کامل هماهنگ با لباس', 'تور دست‌دوز سفارشی', 'اجاره یا خرید'], '۲ میلیون تومان', 'rent'),
  ('service-package', 'بدون هزینه پنهان', 'پکیج اقتصادی عروس', 'لباس عروس، تور، تاج و ژپون در یک پکیج با قیمت مشخص؛ برای عروسی که می‌خواهد خیالش از بودجه راحت باشد.',
   ['قیمت ثابت و شفاف', 'پرداخت در دو قسط', '۱۰٪ تخفیف عروس‌های بهار'], '۲۴ میلیون تومان', 'rent'),
]
packages = [
  ('اقتصادی', '۲۴ میلیون', ['لباس کلاسیک اجاره‌ای', 'تور و تاج', 'ژپون', 'یک جلسه تنظیم'], False),
  ('کلاسیک', '۳۸ میلیون', ['لباس ویژه اجاره‌ای', 'تور دست‌دوز و تاج', 'ژپون و کرست', 'دو جلسه تنظیم', 'لباس عقد (اجاره)'], True),
  ('رؤیایی', '۹۵ میلیون', ['دوخت اختصاصی لباس', 'تور و تاج سفارشی', 'کفش عروس', 'لباس حنابندان (اجاره)', 'آماده‌سازی روز مراسم'], False),
]
def pkg(name, price, items, hot):
    lis = ''.join(f'<li class="flex gap-2"><span class="text-gold-text" aria-hidden="true">✓</span>{x}</li>' for x in items)
    ring = 'ring-2 ring-gold md:-translate-y-4' if hot else ''
    badge = '<span class="chip absolute -top-3 start-1/2 -translate-x-1/2 !bg-gold !text-ink-deep">پیشنهاد ما</span>' if hot else ''
    return f'''<article class="reveal card relative flex flex-col p-8 {ring}">{badge}
            <h3 class="text-xl font-bold">پکیج {name}</h3>
            <p class="mt-4"><span class="text-3xl font-bold">{price}</span> <span class="text-ink-soft">تومان</span></p>
            <ul class="mt-6 flex-1 space-y-3 text-sm text-ink-soft">{lis}</ul>
            <a href="booking.html" class="{'btn-gold' if hot else 'btn-line'} mt-8">انتخاب این پکیج</a>
          </article>'''

services_body = banner('page-services', 'هر آنچه برای روزت لازم داری', 'خدمات مزون سپید',
    'از اجاره و دوخت اختصاصی تا تور و تاج؛ با قیمت شفاف و بدون غافلگیری.', [('خانه', 'index.html'), ('خدمات', None)]) + '''
    <section class="bg-ivory pb-24 pt-8 md:pb-32" aria-label="فهرست خدمات">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <nav class="snap-row !gap-2 reveal" aria-label="پرش به خدمت">''' + ''.join(
    f'<a href="#{s[0]}" class="filter-chip">{s[2]}</a>' for s in services) + '''<a href="#packages" class="filter-chip">پکیج‌ها</a></nav>
        <div class="mt-16 space-y-24 md:space-y-32">
''' + '\n'.join(service_block(i, *s) for i, s in enumerate(services)) + '''
        </div>
      </div>
    </section>

    <section id="packages" class="scroll-mt-24 bg-pearl py-24 md:py-32" aria-labelledby="pk-title">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <div class="reveal text-center"><p class="eyebrow">قیمت شفاف، بدون هزینه پنهان</p><h2 id="pk-title" class="section-title">پکیج‌های عروس</h2>
          <p class="lead">هر پکیج را می‌توانی در پرو بر اساس سلیقه‌ات تغییر دهی.</p></div>
        <div class="mt-16 grid gap-6 md:grid-cols-3 md:items-start">
          ''' + '\n          '.join(pkg(*p) for p in packages) + '''
        </div>
      </div>
    </section>
''' + JOURNEY + CALC.replace('bg-pearl py-24', 'bg-ivory py-24') + FAQ + cta('روز مهمت نزدیکه؛<br><span class="font-bold">بیا با هم لباست را پیدا کنیم</span>', 'نوبت پرو خصوصی‌ات را همین حالا رزرو کن؛ کمتر از یک دقیقه طول می‌کشد.')
page('services.html', 'خدمات و پکیج‌های عروس | مزون عروس سپید',
     'اجاره لباس عروس، دوخت اختصاصی، لباس نامزدی و عقد، لباس شب و حنابندان، تور و تاج و پکیج اقتصادی عروس با قیمت شفاف.',
     ['calculator'], 'services.html', services_body)

# ---------------------------------------------------------------- درباره ما
values = [('🕊️', 'آرامش', 'هیچ‌کس عجله‌ات نمی‌کند. پرو تو، وقت توست.'),
          ('🤍', 'صداقت در قیمت', 'قیمت را از اول می‌گوییم؛ بدون هزینه پنهان.'),
          ('🪡', 'دقت در دوخت', 'هر لباس تا آخرین کوک زیر دست طراح است.'),
          ('🌸', 'احترام به سلیقه تو', 'پیشنهاد می‌دهیم، اما تصمیم همیشه با توست.')]
timeline = [('۱۳۹۳', 'یک میز خیاطی کوچک', 'سپید با دوخت لباس عروس برای دوستان و آشنایان شروع شد.'),
            ('۱۳۹۶', 'اولین مزون', 'فضای پرو خصوصی و کارگاه دوخت در خیابان ولیعصر افتتاح شد.'),
            ('۱۳۹۹', 'کالکشن پوشیده', 'لباس‌های آستین‌بلند و یقه بسته با همان شکوه به کالکشن اضافه شد.'),
            ('۱۴۰۵', '۸۵۰ عروس خوشحال', 'امروز با بیش از ۲۰۰ مدل و تیمی هفت‌نفره در کنار عروس‌ها هستیم.')]
team = [('م', 'مریم', 'مؤسس و طراح ارشد'), ('س', 'سارا', 'مشاور سبک و رنگ'), ('ن', 'نرگس', 'سرپرست کارگاه دوخت')]
about_body = banner('page-about', 'داستان سپید', 'از یک میز خیاطی کوچک،<br><span class="font-bold">تا ۸۵۰ لبخند</span>',
    'ما باور داریم هر عروس لایق لباسی است که فقط مال خودش باشد.', [('خانه', 'index.html'), ('درباره ما', None)]) + '''
    <section class="bg-ivory py-24 md:py-32" aria-labelledby="story-title">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:gap-20 md:px-8">
        <div class="reveal relative">
          <div class="ph ph-1 aspect-[6/7] rounded-[2rem]"><img src="images/about.webp" alt="فضای آرام مزون سپید" loading="lazy" onerror="imgFallback(this)"></div>
          <div class="ph ph-2 absolute -bottom-8 -start-4 hidden aspect-square w-40 rounded-2xl border-4 border-ivory shadow-silk md:block"><img src="images/about-detail.webp" alt="جزئیات سنگ‌دوزی لباس عروس" loading="lazy" onerror="imgFallback(this)"></div>
        </div>
        <div class="reveal">
          <p class="eyebrow">قصه ما</p>
          <h2 id="story-title" class="section-title text-start">لباسی که با حوصله دوخته می‌شود</h2>
          <p class="mt-6 text-ink-soft">سپید سال ۱۳۹۳ از یک میز خیاطی کوچک شروع شد. اولین لباس را برای یک دوست دوختیم و وقتی اشک شوق مادرش را دیدیم، فهمیدیم این کار برایمان فقط یک شغل نیست.</p>
          <p class="mt-4 text-ink-soft">امروز هم همان‌طور کار می‌کنیم: پرو بی‌عجله در اتاق خصوصی، گوش دادن به رؤیای تو و دوختی که تا آخرین دکمه با حوصله انجام می‌شود.</p>
          <p class="mt-4 text-ink-soft">کارگاه دوخت ما داخل خود مزون است؛ یعنی لباس تو هیچ‌وقت از جلوی چشم طراح دور نمی‌شود.</p>
          <dl class="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8 text-center">
            <div class="flex flex-col-reverse"><dt class="text-sm text-ink-soft">عروس خوشحال</dt><dd class="text-3xl font-bold md:text-4xl" data-count="850" data-suffix="+">۸۵۰+</dd></div>
            <div class="flex flex-col-reverse"><dt class="text-sm text-ink-soft">مدل لباس</dt><dd class="text-3xl font-bold md:text-4xl" data-count="200" data-suffix="+">۲۰۰+</dd></div>
            <div class="flex flex-col-reverse"><dt class="text-sm text-ink-soft">سال سابقه</dt><dd class="text-3xl font-bold md:text-4xl" data-count="12">۱۲</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <section class="bg-pearl py-24 md:py-32" aria-labelledby="values-title">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="reveal text-center"><p class="eyebrow">آنچه به آن پایبندیم</p><h2 id="values-title" class="section-title">ارزش‌های سپید</h2></div>
        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">''' + ''.join(
    f'''<article class="reveal card p-7 text-center"><span class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush/60 text-3xl" aria-hidden="true">{e}</span><h3 class="mt-5 text-lg font-bold">{t}</h3><p class="mt-2 text-sm text-ink-soft">{d}</p></article>''' for e, t, d in values) + '''</div>
      </div>
    </section>

    <section class="bg-ivory py-24 md:py-32" aria-labelledby="tl-title">
      <div class="mx-auto max-w-3xl px-5 md:px-8">
        <div class="reveal text-center"><p class="eyebrow">۱۲ سال، قدم‌به‌قدم</p><h2 id="tl-title" class="section-title">مسیر سپید</h2></div>
        <ol class="relative mt-14 space-y-10 border-s border-rose/50 ps-8">''' + ''.join(
    f'''<li class="reveal relative"><span class="absolute -start-[41px] top-1 h-4 w-4 rounded-full border-2 border-ivory bg-gold" aria-hidden="true"></span><p class="text-sm font-bold text-gold-text">{y}</p><h3 class="mt-1 text-lg font-bold">{t}</h3><p class="mt-1 text-ink-soft">{d}</p></li>''' for y, t, d in timeline) + '''</ol>
      </div>
    </section>

    <section class="bg-pearl py-24 md:py-32" aria-labelledby="work-title">
      <div class="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 md:gap-20 md:px-8">
        <div class="reveal order-2 md:order-1">
          <p class="eyebrow">کارگاه دوخت</p>
          <h2 id="work-title" class="section-title text-start">هر کوک، زیر نظر طراح</h2>
          <p class="mt-6 text-ink-soft">پارچه‌ها را خودمان انتخاب می‌کنیم: ساتن ابریشمی، کرپ ایتالیایی و تورهای فرانسوی. تورها و سنگ‌دوزی‌ها با دست کار می‌شوند.</p>
          <ul class="mt-6 grid gap-2 text-ink-soft">
            <li class="flex gap-2"><span class="text-rose" aria-hidden="true">✦</span>تنظیم سایز در خود مزون، بدون ارسال بیرون</li>
            <li class="flex gap-2"><span class="text-rose" aria-hidden="true">✦</span>شست‌وشو و بخار تخصصی بعد از هر مراسم</li>
            <li class="flex gap-2"><span class="text-rose" aria-hidden="true">✦</span>نگهداری لباس‌ها در کاور ضدنور</li>
          </ul>
        </div>
        <div class="reveal order-1 grid grid-cols-2 gap-4 md:order-2">
          <div class="ph ph-2 aspect-[3/4] rounded-2xl"><img src="images/service-custom.webp" alt="دوخت دستی لباس عروس" loading="lazy" onerror="imgFallback(this)"></div>
          <div class="ph ph-3 mt-10 aspect-[3/4] rounded-2xl"><img src="images/about-fitting.webp" alt="لباس عروس روی مانکن آماده پرو" loading="lazy" onerror="imgFallback(this)"></div>
        </div>
      </div>
    </section>

    <section class="bg-ivory py-24 md:py-32" aria-labelledby="team-title">
      <div class="mx-auto max-w-5xl px-5 md:px-8">
        <div class="reveal text-center"><p class="eyebrow">کسانی که کنارت هستند</p><h2 id="team-title" class="section-title">تیم سپید</h2><p class="lead">نام‌ها نمونه هستند.</p></div>
        <div class="mt-14 grid gap-6 sm:grid-cols-3">''' + ''.join(
    f'''<article class="reveal card p-8 text-center"><span class="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-blush to-pearl text-4xl font-light text-ink" aria-hidden="true">{m}</span><h3 class="mt-5 text-lg font-bold">{n}</h3><p class="text-sm text-ink-soft">{r}</p></article>''' for m, n, r in team) + '''</div>
      </div>
    </section>
''' + cta('دوست داریم قصه تو را هم بشنویم', 'یک فنجان چای، یک اتاق پرو خصوصی و کلی حوصله منتظر توست.')
page('about.html', 'درباره ما | مزون عروس سپید',
     'داستان مزون عروس سپید از ۱۳۹۳ تا امروز: کارگاه دوخت داخلی، پرو خصوصی و بی‌عجله، و بیش از ۸۵۰ عروس خوشحال.',
     [], 'about.html', about_body)

# ---------------------------------------------------------------- عروس‌های ما
gal = [('01', 'aspect-[3/4]', 'عروس در باغ با دسته گل', 'garden'), ('02', 'aspect-square', 'زوج در باغ', 'garden'),
       ('03', 'aspect-[4/5]', 'دسته گل عروس در دست', 'hall'), ('04', 'aspect-[3/5]', 'عروس در غروب', 'outdoor'),
       ('05', 'aspect-square', 'لحظه شاد زوج', 'outdoor'), ('06', 'aspect-[3/4]', 'زوج با دسته گل', 'hall'),
       ('07', 'aspect-[4/5]', 'عروس با تور بلند در نور', 'hall'), ('08', 'aspect-[3/4]', 'عروس با تور در طبیعت', 'outdoor'),
       ('09', 'aspect-square', 'عروس کنار دریاچه', 'outdoor'), ('10', 'aspect-[3/4]', 'زوج در ساحل', 'outdoor'),
       ('11', 'aspect-square', 'عروس در فضای باز', 'garden'), ('12', 'aspect-[4/5]', 'عروس با لباس مارمید', 'hall'),
       ('13', 'aspect-[3/4]', 'عروس میان درختان', 'garden'), ('14', 'aspect-square', 'دنباله بلند لباس', 'hall'),
       ('15', 'aspect-[3/4]', 'عروس در نور شب', 'hall')]
gal_html = '\n'.join(
    f'''          <button data-lightbox data-tag="{t}" data-src="images/gallery-{n}.webp" data-caption="{c}" class="ph ph-{(i % 4) + 1} block {a} w-full rounded-2xl"><img src="images/gallery-{n}.webp" alt="{c}" loading="lazy" onerror="imgFallback(this)"></button>'''
    for i, (n, a, c, t) in enumerate(gal))
extra_testi = '''            <figure class="card w-[85%] p-7 sm:w-[48%] lg:w-[32%]"><div class="flex items-center justify-between"><span class="text-gold-deep" aria-label="۵ ستاره">★★★★★</span><span class="chip">نمونه</span></div><blockquote class="mt-4 text-ink-soft">«برای حنابندان هم لباس گرفتم؛ رنگ زرشکی‌اش را همه تعریف کردند.»</blockquote><figcaption class="mt-5 text-sm"><strong>زهرا</strong> · <span class="text-ink-soft">۲ اردیبهشت ۱۴۰۵</span></figcaption></figure>
            <figure class="card w-[85%] p-7 sm:w-[48%] lg:w-[32%]"><div class="flex items-center justify-between"><span class="text-gold-deep" aria-label="۵ ستاره">★★★★★</span><span class="chip">نمونه</span></div><blockquote class="mt-4 text-ink-soft">«مشاور رنگ گفت آف‌وایت به پوستم بیشتر می‌آید؛ در عکس‌ها کاملاً معلوم بود.»</blockquote><figcaption class="mt-5 text-sm"><strong>نازنین</strong> · <span class="text-ink-soft">۱۵ فروردین ۱۴۰۵</span></figcaption></figure>
'''
testi = TESTI.replace('          </div>\n          <div class="slider-track"', extra_testi + '          </div>\n          <div class="slider-track"')
brides_body = banner('page-brides', 'لحظه‌هایی که ماندند', 'عروس‌های سپید',
    'بیش از ۸۵۰ عروس روز مهمشان را با لباس سپید جشن گرفته‌اند. اینجا گوشه‌ای از آن لحظه‌هاست.', [('خانه', 'index.html'), ('عروس‌های ما', None)]) + '''
    <section class="border-y border-line bg-ivory" aria-label="آمار">
      <dl class="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-5 py-10 text-center">
        <div class="flex flex-col-reverse"><dt class="text-sm text-ink-soft">عروس خوشحال</dt><dd class="text-3xl font-bold md:text-4xl" data-count="850" data-suffix="+">۸۵۰+</dd></div>
        <div class="flex flex-col-reverse"><dt class="text-sm text-ink-soft">امتیاز از ۵</dt><dd class="text-3xl font-bold md:text-4xl">۴٫۹</dd></div>
        <div class="flex flex-col-reverse"><dt class="text-sm text-ink-soft">پیشنهاد به دوستان</dt><dd class="text-3xl font-bold md:text-4xl" data-count="96" data-suffix="٪">۹۶٪</dd></div>
      </dl>
    </section>

    <section class="bg-ivory py-20 md:py-28" aria-labelledby="gal-title">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="reveal flex flex-wrap items-end justify-between gap-6">
          <div><p class="eyebrow">گالری مراسم</p><h2 id="gal-title" class="section-title text-start">از تالار تا باغ</h2></div>
          <div class="snap-row !gap-2 !pb-0" role="group" aria-label="فیلتر مکان مراسم">
            <button class="filter-chip" data-gal="all" aria-pressed="true">همه</button>
            <button class="filter-chip" data-gal="hall" aria-pressed="false">تالار</button>
            <button class="filter-chip" data-gal="garden" aria-pressed="false">باغ</button>
            <button class="filter-chip" data-gal="outdoor" aria-pressed="false">فضای باز</button>
          </div>
        </div>
        <div id="gallery" class="masonry mt-12 transition-opacity duration-300">
''' + gal_html + '''
        </div>
      </div>
    </section>

    <section class="bg-pearl py-24 md:py-28" aria-label="نظرات عروس‌ها">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
''' + testi + '''
      </div>
    </section>

    <section class="bg-ivory py-20" aria-labelledby="ig-title">
      <div class="reveal mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-[2rem] bg-gradient-to-l from-blush/60 to-pearl px-8 py-10 text-center md:flex-row md:text-start">
        <div><h2 id="ig-title" class="text-2xl font-bold">عکس‌های تازه را در اینستاگرام ببین</h2><p class="mt-2 text-ink-soft">هر هفته عروس‌های جدید، پشت صحنه کارگاه و مدل‌های تازه.</p></div>
        <a href="https://instagram.com/" rel="noopener" class="btn-line shrink-0">صفحه اینستاگرام سپید</a>
      </div>
    </section>
''' + cta('عروس بعدی سپید، تو هستی؟', 'وقت پرو خصوصی‌ات را رزرو کن تا لباس روز مهمت را با هم پیدا کنیم.') + '''
    <script>
      // فیلتر گالری بر اساس مکان مراسم
      document.addEventListener('DOMContentLoaded', () => {
        const g = document.getElementById('gallery');
        document.querySelectorAll('[data-gal]').forEach(b => b.addEventListener('click', () => {
          document.querySelectorAll('[data-gal]').forEach(x => x.setAttribute('aria-pressed', x === b));
          g.style.opacity = '0';
          setTimeout(() => {
            g.querySelectorAll('[data-lightbox]').forEach(it => { it.hidden = b.dataset.gal !== 'all' && it.dataset.tag !== b.dataset.gal; });
            g.style.opacity = '1';
          }, 250);
        }));
      });
    </script>
'''
page('brides.html', 'عروس‌های ما | مزون عروس سپید',
     'گالری عروس‌های مزون سپید در تالار، باغ و فضای باز، همراه نظرات عروس‌ها درباره پرو، دوخت و قیمت.',
     [], 'brides.html', brides_body, lightbox=True)

# ---------------------------------------------------------------- تماس
cards = [('تلفن مزون', '۰۲۱-۱۲۳۴۵۶۷۸', 'tel:+982112345678', 'M4 5c0 8.3 6.7 15 15 15l1.5-3.5-4-2-2 2a11 11 0 01-7-7l2-2-2-4z'),
         ('واتساپ', 'پاسخ در کمتر از یک ساعت', 'https://wa.me/989120000000', 'M12 3a9 9 0 00-7.8 13.5L3 21l4.6-1.2A9 9 0 1012 3z'),
         ('اینستاگرام', '@sepid.bridal (نمونه)', 'https://instagram.com/', 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8z'),
         ('نشانی', 'تهران، خیابان ولیعصر، پلاک ۱۲۰', 'https://neshan.org/maps', 'M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 100-5 2.5 2.5 0 000 5z')]
contact_body = banner('page-contact', 'خوشحال می‌شویم صدایت را بشنویم', 'تماس با سپید',
    'سؤالی داری؟ از هر راهی که راحت‌تری با ما در تماس باش.', [('خانه', 'index.html'), ('تماس', None)]) + '''
    <section class="bg-ivory pb-24 pt-6 md:pb-32" aria-label="راه‌های ارتباط">
      <div class="mx-auto max-w-7xl px-5 md:px-8">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">''' + ''.join(
    f'''<a href="{h}" rel="noopener" class="reveal card group flex items-center gap-4 p-6 transition duration-500 ease-silk hover:-translate-y-1"><span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush/60 transition group-hover:bg-blush"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3B3330" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true"><path d="{p}"/></svg></span><span><span class="block font-bold">{t}</span><span class="text-sm text-ink-soft">{v}</span></span></a>''' for t, v, h, p in cards) + '''</div>

        <div class="mt-16 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <form id="contact-form" class="reveal card p-6 md:p-10" novalidate>
            <h2 class="text-2xl font-bold">برایمان پیام بگذار</h2>
            <p class="mt-2 text-sm text-ink-soft">در ساعات کاری، حداکثر تا ۲ ساعت بعد جواب می‌دهیم.</p>
            <div class="mt-8 grid gap-5 sm:grid-cols-2">
              <div><label class="field-label" for="c-name">نام شما <span class="text-error" aria-hidden="true">*</span></label><input id="c-name" class="field" autocomplete="name" required aria-describedby="c-name-err"><span id="c-name-err" class="field-err" aria-live="polite"></span></div>
              <div><label class="field-label" for="c-mobile">شماره موبایل <span class="text-error" aria-hidden="true">*</span></label><input id="c-mobile" class="field" inputmode="tel" dir="ltr" placeholder="۰۹۱۲۳۴۵۶۷۸۹" autocomplete="tel" required aria-describedby="c-mobile-err"><span id="c-mobile-err" class="field-err" aria-live="polite"></span></div>
            </div>
            <label class="field-label mt-2" for="c-topic">موضوع</label>
            <select id="c-topic" class="field"><option>سؤال درباره لباس‌ها</option><option>قیمت و پکیج‌ها</option><option>دوخت اختصاصی</option><option>تغییر نوبت پرو</option><option>موضوع دیگر</option></select>
            <label class="field-label mt-5" for="c-msg">پیام شما</label>
            <textarea id="c-msg" rows="5" class="field" placeholder="مثلاً: برای عروسی اردیبهشت لباس پوشیده می‌خواهم…"></textarea>
            <button class="btn-gold mt-8 w-full sm:w-auto">ارسال پیام</button>
            <p id="c-ok" class="mt-5 hidden rounded-xl bg-sage/30 p-4 text-sm" role="status"></p>
          </form>
          <div class="reveal space-y-6">
            <div class="rounded-2xl bg-pearl p-7">
              <h2 class="text-lg font-bold">ساعات کاری</h2>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between border-b border-line pb-3"><dt>شنبه تا چهارشنبه</dt><dd class="font-semibold">۱۰ تا ۲۰</dd></div>
                <div class="flex justify-between border-b border-line pb-3"><dt>پنج‌شنبه</dt><dd class="font-semibold">۱۰ تا ۲۰</dd></div>
                <div class="flex justify-between"><dt>جمعه و تعطیلات رسمی</dt><dd class="font-semibold text-ink-soft">تعطیل</dd></div>
              </dl>
              <p class="mt-5 rounded-xl bg-ivory p-3 text-xs leading-6 text-ink-soft">برای پرو، رزرو قبلی لازم است تا اتاق خصوصی برایت آماده باشد.</p>
            </div>
            <a href="https://neshan.org/maps" rel="noopener" class="ph ph-4 group block aspect-[16/10] overflow-hidden rounded-2xl" aria-label="مسیریابی مزون سپید در نقشه نشان">
              <img src="images/page-contact.webp" alt="ورودی مزون سپید" loading="lazy" class="transition duration-700 ease-silk group-hover:scale-105" onerror="imgFallback(this)">
              <span class="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl bg-ivory/90 px-4 py-3 text-sm font-semibold backdrop-blur">📍 مسیریابی با نشان یا بلد <span aria-hidden="true">←</span></span>
            </a>
            <p class="text-sm text-ink-soft">نزدیک‌ترین ایستگاه مترو: میدان ولیعصر، ۵ دقیقه پیاده · پارکینگ عمومی روبه‌روی ساختمان (نشانی نمونه است).</p>
          </div>
        </div>
      </div>
    </section>
''' + FAQ + '''
    <script>
      // فرم تماس: فقط نام و موبایل اجباری؛ پیام مؤدب فارسی برای خطا
      document.addEventListener('DOMContentLoaded', () => {
        const f = document.getElementById('contact-form');
        const en = s => s.replace(/[۰-۹]/g, c => '۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c));
        const err = (id, m) => { const el = document.getElementById(id); el.setAttribute('aria-invalid', m ? 'true' : 'false'); el.classList.toggle('!border-error', !!m); document.getElementById(id + '-err').textContent = m; return !m; };
        const vName = () => err('c-name', document.getElementById('c-name').value.trim().length < 2 ? 'لطفاً نامت را بنویس.' : '');
        const vMob = () => { const v = en(document.getElementById('c-mobile').value).replace(/[\\s-]/g, ''); return err('c-mobile', !v ? 'شماره موبایلت را وارد کن تا جوابت را بدهیم.' : !/^09\\d{9}$/.test(v) ? 'شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.' : ''); };
        document.getElementById('c-name').addEventListener('blur', vName);
        document.getElementById('c-mobile').addEventListener('blur', vMob);
        f.addEventListener('submit', e => {
          e.preventDefault();
          const a = vName(), b = vMob();
          if (!a || !b) { (a ? document.getElementById('c-mobile') : document.getElementById('c-name')).focus(); return; }
          const ok = document.getElementById('c-ok');
          ok.textContent = `ممنون ${document.getElementById('c-name').value.trim()} عزیز؛ پیامت رسید و به‌زودی با تو تماس می‌گیریم. 🤍`;
          ok.classList.remove('hidden');
          f.querySelectorAll('input, textarea').forEach(x => { x.value = ''; });
        });
      });
    </script>
'''
page('contact.html', 'تماس با ما | مزون عروس سپید',
     'تماس با مزون عروس سپید: تلفن، واتساپ، اینستاگرام، نشانی و ساعات کاری (شنبه تا پنج‌شنبه ۱۰ تا ۲۰). فرم پیام آنلاین.',
     [], 'contact.html', contact_body)

# ---------------------------------------------------------------- رزرو
steps = [('1', 'خدمت و لباس'), ('2', 'روز و ساعت'), ('3', 'اطلاعات تماس')]
booking_body = '''    <section class="bg-gradient-to-b from-pearl to-ivory pb-24 pt-10 md:pb-32" aria-labelledby="bk-title">
      <div class="mx-auto max-w-6xl px-5 md:px-8">
        <nav aria-label="مسیر صفحه" class="mb-6 text-sm text-ink-soft"><a href="index.html" class="hover:text-ink">خانه</a> <span aria-hidden="true">/</span> <span aria-current="page" class="text-ink">رزرو وقت پرو</span></nav>
        <div id="booking-flow">
          <div class="text-center">
            <p class="eyebrow">پرو اول رایگان، بدون هیچ تعهدی</p>
            <h1 id="bk-title" class="text-[30px] font-light md:text-[46px]">وقت پرو خصوصی‌ات را <span class="font-bold">رزرو کن</span></h1>
            <p class="lead">سه قدم کوتاه؛ کمتر از یک دقیقه.</p>
          </div>

          <ol class="relative mx-auto mt-10 flex max-w-md justify-between" aria-label="مراحل رزرو">
            <span class="absolute inset-x-5 top-5 h-px bg-line" aria-hidden="true"><span id="step-bar" class="absolute inset-y-0 start-0 bg-gold transition-all duration-700 ease-silk" style="width:0"></span></span>''' + ''.join(
    f'''<li class="relative flex flex-col items-center gap-2 text-xs font-semibold"><span class="step-dot" data-step-dot="{n}" data-state="{'current' if n == '1' else 'todo'}">{['۱','۲','۳'][int(n)-1]}</span>{t}</li>''' for n, t in steps) + '''</ol>

          <div class="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <form id="booking-form" class="card scroll-mt-28 p-6 md:p-10" novalidate>
              <!-- مرحله ۱ -->
              <fieldset data-step="1">
                <h2 class="text-xl font-bold outline-none" tabindex="-1">برای چه کاری می‌آیی؟</h2>
                <div id="services" class="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="نوع خدمت"></div>
                <h3 class="mt-10 font-bold">لباس‌هایی که دوست داری در پرو امتحان کنی <span class="text-sm font-normal text-ink-soft">(اختیاری، تا ۵ لباس)</span></h3>
                <div id="dress-picks" class="mt-4"></div>
                <span id="step1-err" class="field-err" aria-live="polite"></span>
                <div class="mt-8 flex justify-end"><button type="button" class="btn-gold" data-next-step>مرحله بعد: انتخاب روز ''' + ARROW + '''</button></div>
              </fieldset>

              <!-- مرحله ۲ -->
              <fieldset data-step="2" class="hidden">
                <h2 class="text-xl font-bold outline-none" tabindex="-1">کدام روز برایت بهتر است؟</h2>
                <p class="mt-2 text-sm text-ink-soft">جمعه‌ها تعطیل هستیم. روزهای کم‌رنگ پر شده‌اند.</p>
                <div class="mt-6 rounded-2xl border border-line p-4">
                  <p id="cal-title" class="mb-3 text-center font-bold"></p>
                  <div id="calendar" class="grid grid-cols-7 gap-1.5"></div>
                </div>
                <h3 id="slots-title" class="mt-8 font-bold">ساعت‌های خالی</h3>
                <div id="slots" class="mt-4" aria-live="polite"></div>
                <span id="step2-err" class="field-err" aria-live="polite"></span>
                <div class="mt-8 flex justify-between gap-3"><button type="button" class="btn-line" data-prev-step>قبلی</button><button type="button" class="btn-gold" data-next-step>مرحله آخر ''' + ARROW + '''</button></div>
              </fieldset>

              <!-- مرحله ۳ -->
              <fieldset data-step="3" class="hidden">
                <h2 class="text-xl font-bold outline-none" tabindex="-1">آخرین قدم: چطور با تو تماس بگیریم؟</h2>
                <p class="mt-2 text-sm text-ink-soft">فقط نام و موبایل لازم است؛ بقیه اختیاری است.</p>
                <div class="mt-8 grid gap-5 sm:grid-cols-2">
                  <div><label class="field-label" for="f-name">نام و نام خانوادگی <span class="text-error" aria-hidden="true">*</span></label><input id="f-name" class="field" autocomplete="name" required aria-describedby="f-name-err"><span id="f-name-err" class="field-err" aria-live="polite"></span></div>
                  <div><label class="field-label" for="f-mobile">شماره موبایل <span class="text-error" aria-hidden="true">*</span></label>
                    <div class="relative"><input id="f-mobile" class="field pe-10" inputmode="tel" dir="ltr" placeholder="۰۹۱۲۳۴۵۶۷۸۹" autocomplete="tel" required aria-describedby="f-mobile-err"><span id="f-mobile-ok" class="absolute end-3 top-1/2 hidden -translate-y-1/2 text-sage" aria-hidden="true">✓</span></div>
                    <span id="f-mobile-err" class="field-err" aria-live="polite"></span></div>
                </div>
                <fieldset class="mt-2">
                  <legend class="field-label">تاریخ عروسی <span class="font-normal text-ink-soft">(اختیاری)</span></legend>
                  <div class="grid grid-cols-3 gap-3">
                    <label class="sr-only" for="w-day">روز</label><select id="w-day" class="field"></select>
                    <label class="sr-only" for="w-month">ماه</label><select id="w-month" class="field"></select>
                    <label class="sr-only" for="w-year">سال</label><select id="w-year" class="field"></select>
                  </div>
                </fieldset>
                <div class="mt-5 grid gap-5 sm:grid-cols-2">
                  <div><label class="field-label" for="f-company">با چند همراه می‌آیی؟</label><select id="f-company" class="field"><option>تنها</option><option>۱ نفر</option><option>۲ نفر</option><option>۳ نفر</option></select></div>
                  <div><label class="field-label" for="f-how">از کجا با ما آشنا شدی؟</label><select id="f-how" class="field"><option>اینستاگرام</option><option>معرفی دوستان</option><option>جستجوی گوگل</option><option>دیوار</option><option>سایر</option></select></div>
                </div>
                <label class="field-label mt-5" for="f-note">نکته‌ای که بهتر است بدانیم؟</label>
                <textarea id="f-note" rows="3" class="field" placeholder="مثلاً: لباس پوشیده می‌خواهم یا مراسمم در باغ است"></textarea>
                <span id="step3-err" class="field-err" aria-live="polite"></span>
                <div class="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row"><button type="button" class="btn-line" data-prev-step>قبلی</button><button type="submit" class="btn-gold">نوبت پروم رو رزرو کن</button></div>
                <p class="mt-4 text-center text-xs text-ink-soft sm:text-end">اطلاعاتت فقط برای هماهنگی پرو استفاده می‌شود و به کسی داده نمی‌شود.</p>
              </fieldset>
            </form>

            <aside class="card sticky top-24 p-6" aria-label="خلاصه رزرو">
              <h2 class="font-bold">خلاصه نوبت تو</h2>
              <dl class="mt-5 space-y-4 text-sm">
                <div><dt class="text-ink-soft">خدمت</dt><dd id="sum-service" class="font-semibold"></dd></div>
                <div><dt class="text-ink-soft">زمان پرو</dt><dd id="sum-date" class="font-semibold"></dd></div>
                <div><dt class="text-ink-soft">لباس‌ها</dt><dd id="sum-dresses" class="font-semibold"></dd></div>
              </dl>
              <ul class="mt-6 space-y-2 border-t border-line pt-5 text-xs text-ink-soft">
                <li class="flex gap-2"><span class="text-sage" aria-hidden="true">●</span>پرو اول رایگان و بدون تعهد</li>
                <li class="flex gap-2"><span class="text-sage" aria-hidden="true">●</span>اتاق پرو خصوصی، حدود ۷۵ دقیقه</li>
                <li class="flex gap-2"><span class="text-sage" aria-hidden="true">●</span>جابه‌جایی نوبت با یک پیام</li>
              </ul>
              <a href="https://wa.me/989120000000" rel="noopener" class="mt-6 block text-center text-sm font-semibold text-gold-text underline-offset-4 hover:underline">سؤالی داری؟ در واتساپ بپرس</a>
            </aside>
          </div>
        </div>
        <div id="thank-you" class="hidden"></div>
      </div>
    </section>
'''
page('booking.html', 'رزرو وقت پرو | مزون عروس سپید',
     'رزرو آنلاین وقت پرو خصوصی در مزون عروس سپید در سه قدم: انتخاب خدمت و لباس، روز و ساعت از تقویم شمسی و اطلاعات تماس. پرو اول رایگان.',
     ['booking'], None, booking_body, mobile_bar=False)
