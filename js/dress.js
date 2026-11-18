/* صفحه جزئیات لباس: گالری با زوم، قیمت اجاره/خرید، مشخصات، لباس‌های مشابه */
'use strict';

function initDress() {
  const root = $('#dress-root');
  if (!root) return;
  const id = +new URLSearchParams(location.search).get('id') || 1;
  const d = DRESSES.find(x => x.id === id);
  if (!d) {
    root.innerHTML = `<div class="py-32 text-center"><h1 class="section-title">این لباس پیدا نشد</h1>
      <p class="lead">شاید از کالکشن خارج شده باشد. بیا بقیه لباس‌ها را ببینیم.</p>
      <a href="collection.html" class="btn-gold mt-8">برگشت به کالکشن</a></div>`;
    return;
  }
  const st = STYLES[d.style], col = COLORS[d.color];
  document.title = `لباس عروس ${st.label} «${d.name}» | مزون عروس سپید`;
  $('meta[name="description"]').setAttribute('content', `لباس عروس ${st.label} «${d.name}» به رنگ ${col.label}، پارچه ${d.fabric}. اجاره از ${toman(d.rent)}، پرو اول رایگان در مزون سپید.`);
  $('#crumb-name').textContent = `«${d.name}»`;

  // اسکیما محصول برای سئو
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: `لباس عروس ${d.name}`, image: d.img,
    description: `${st.desc}. ${d.fabric}`, brand: { '@type': 'Brand', name: 'سپید' },
    offers: { '@type': 'Offer', priceCurrency: 'IRR', price: d.rent * 10, availability: 'https://schema.org/InStock' }
  });
  document.head.appendChild(ld);

  const shots = [
    { src: d.img, alt: d.alt },
    { src: d.imgB, alt: `جزئیات پارچه و تور لباس ${d.name}` },
    { src: `images/style-${d.style}.webp`, alt: `نمونه سبک ${st.label} روی عروس` }
  ];
  const skinNote = d.color === 'ivory' ? ' این رنگ گرم با پوست گندمی بیشتر عروس‌های ایرانی هماهنگ است.' : '';

  root.innerHTML = `
  <div class="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
    <div class="flex flex-col-reverse gap-4 md:flex-row md:items-start">
      <div class="flex gap-3 md:flex-col" aria-label="عکس‌های لباس">
        ${shots.map((s, i) => `
          <button class="ph ph-${i + 1} aspect-[3/4] w-20 shrink-0 rounded-xl ring-gold ring-offset-2 ring-offset-ivory transition aria-pressed:ring-2 md:w-24"
            aria-pressed="${i === 0}" data-shot="${i}" aria-label="نمایش عکس ${fa(i + 1)}">
            <img src="${s.src}" alt="" loading="lazy" onerror="imgFallback(this)"></button>`).join('')}
      </div>
      <div id="zoom" class="ph ph-1 relative aspect-[3/4] w-full min-w-0 flex-1 cursor-zoom-in overflow-hidden rounded-[1.75rem] shadow-silk" tabindex="0" role="button" aria-label="نمایش تمام‌صفحه عکس">
        <img id="main-img" src="${d.img}" alt="${d.alt}" fetchpriority="high" class="transition-transform duration-300 ease-silk" onerror="imgFallback(this)">
        ${d.isNew ? '<span class="chip absolute top-5 start-5 z-[1]">جدید</span>' : ''}
        <span class="pointer-events-none absolute bottom-5 end-5 z-[1] hidden rounded-full bg-ivory/85 px-3 py-1 text-xs text-ink-soft backdrop-blur md:block">برای زوم، موس را روی عکس ببر</span>
      </div>
    </div>

    <div class="lg:pt-4">
      <p class="eyebrow">${st.label} · ${col.label}</p>
      <h1 class="text-[30px] font-bold leading-snug md:text-[40px]">لباس عروس «${d.name}»</h1>
      <p class="mt-2 flex items-center gap-2 text-sm text-ink-soft"><span class="text-gold-deep" aria-hidden="true">★★★★★</span> محبوب عروس‌های ${d.style === 'modest' ? 'باحجاب' : 'این فصل'}</p>
      <p class="mt-5 text-ink-soft">${st.desc}. ${col.note}.${skinNote}</p>

      <div class="mt-8 rounded-2xl bg-pearl p-5">
        <div class="mb-4 grid grid-cols-2 gap-1 rounded-full bg-ivory p-1 text-sm font-semibold" role="group" aria-label="نوع خرید">
          <button class="rounded-full py-2 transition aria-pressed:bg-blush" data-mode="rent" aria-pressed="true">اجاره</button>
          <button class="rounded-full py-2 transition aria-pressed:bg-blush" data-mode="buy" aria-pressed="false">خرید و دوخت</button>
        </div>
        <p class="text-sm text-ink-soft" id="price-label">قیمت اجاره (با تنظیم کامل روی اندام تو)</p>
        <p class="text-3xl font-bold" id="price" aria-live="polite">${toman(d.rent)}</p>
        <p class="mt-2 text-sm text-ink-soft">بیعانه فقط ۳۰٪ · بقیه در روز تحویل</p>
      </div>

      <dl class="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
        <div><dt class="text-ink-soft">پارچه</dt><dd class="font-semibold">${d.fabric}</dd></div>
        <div><dt class="text-ink-soft">یقه</dt><dd class="font-semibold">${d.neckline}</dd></div>
        <div><dt class="text-ink-soft">دنباله</dt><dd class="font-semibold">${d.train}</dd></div>
        <div><dt class="text-ink-soft">سایزهای موجود</dt><dd class="font-semibold">${d.sizes}</dd></div>
        <div><dt class="text-ink-soft">رنگ</dt><dd class="flex items-center gap-2 font-semibold"><span class="h-4 w-4 rounded-full border border-ink/15" style="background:${col.hex}" aria-hidden="true"></span>${col.label}</dd></div>
        <div><dt class="text-ink-soft">وضعیت</dt><dd class="flex items-center gap-2 font-semibold"><span class="h-2 w-2 rounded-full bg-sage" aria-hidden="true"></span>موجود برای پرو</dd></div>
      </dl>

      <label class="mt-8 block text-sm font-semibold" for="size">سایزت</label>
      <select id="size" class="mt-2 w-full rounded-xl border border-line bg-ivory px-4 py-3">
        <option value="">هنوز نمی‌دانم؛ در پرو اندازه بگیرید</option>
        ${['۳۴', '۳۶', '۳۸', '۴۰', '۴۲', '۴۴', '۴۶', '۴۸'].map(s => `<option>${s}</option>`).join('')}
      </select>

      <div class="mt-8 flex gap-3">
        <a href="booking.html?dresses=${d.id}" class="btn-gold flex-1">رزرو پرو با این لباس</a>
        <button class="heart grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-line bg-ivory transition hover:border-rose" data-fav="${d.id}" aria-pressed="false" aria-label="ذخیره در علاقه‌مندی‌ها">${ICON_HEART}</button>
        <button class="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full border border-line bg-ivory text-ink-soft transition hover:border-rose aria-pressed:border-gold aria-pressed:bg-blush" data-compare="${d.id}" aria-pressed="false" aria-label="افزودن به مقایسه">${ICON_COMPARE}</button>
      </div>
      <p class="mt-3 text-center text-sm text-ink-soft">پرو اول رایگان، بدون هیچ تعهدی</p>
      <a href="https://wa.me/989120000000?text=${encodeURIComponent(`سلام، درباره لباس «${d.name}» سؤال داشتم`)}" rel="noopener" class="btn-line mt-4 w-full">درباره این لباس در واتساپ بپرس</a>

      <ul class="mt-8 grid gap-3 border-t border-line pt-6 text-sm text-ink-soft">
        <li class="flex gap-2"><span class="text-rose" aria-hidden="true">✦</span>تنظیم کامل روی اندام تو، بدون هزینه اضافه</li>
        <li class="flex gap-2"><span class="text-rose" aria-hidden="true">✦</span>تحویل اتوشده همراه ژپون، یک روز قبل از مراسم</li>
        <li class="flex gap-2"><span class="text-rose" aria-hidden="true">✦</span>تا ۳۰ روز قبل از مراسم، بیعانه کامل برمی‌گردد</li>
      </ul>
    </div>
  </div>`;

  let current = 0;
  const zoom = $('#zoom');
  const main = () => $('#main-img');

  // تعویض عکس اصلی
  $$('[data-shot]').forEach(b => b.addEventListener('click', () => {
    current = +b.dataset.shot;
    const s = shots[current];
    $$('[data-shot]').forEach(x => x.setAttribute('aria-pressed', x === b));
    const old = main(); if (old) old.remove();
    zoom.insertAdjacentHTML('afterbegin', `<img id="main-img" src="${s.src}" alt="${s.alt}" class="transition-transform duration-300 ease-silk" onerror="imgFallback(this)">`);
  }));

  // زوم با موس (دسکتاپ)
  zoom.addEventListener('mousemove', e => {
    const img = main(); if (!img) return;
    const r = zoom.getBoundingClientRect();
    img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    img.style.transform = 'scale(2)';
  });
  zoom.addEventListener('mouseleave', () => { const img = main(); if (img) img.style.transform = ''; });

  // نمایش تمام‌صفحه با کشیدن انگشت و Esc
  const box = $('#lightbox'), fig = $('#lb-figure'), cap = $('#lb-caption');
  const show = i => {
    current = (i + shots.length) % shots.length;
    fig.className = `ph ph-${current + 1} relative mx-auto aspect-[3/4] h-[72vh] rounded-2xl`;
    fig.innerHTML = `<img src="${shots[current].src}" alt="${shots[current].alt}" class="absolute inset-0 h-full w-full object-cover" onerror="imgFallback(this)">`;
    cap.textContent = `${shots[current].alt} — ${fa(current + 1)} از ${fa(shots.length)}`;
  };
  const close = () => { box.classList.add('hidden'); document.body.style.overflow = ''; zoom.focus(); };
  const open = () => { show(current); box.classList.remove('hidden'); document.body.style.overflow = 'hidden'; Sepid.trapFocus(box, close); $('#lb-close').focus(); };
  zoom.addEventListener('click', open);
  zoom.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  $('#lb-close').addEventListener('click', close);
  $('#lb-next').addEventListener('click', () => show(current + 1));
  $('#lb-prev').addEventListener('click', () => show(current - 1));
  box.addEventListener('click', e => { if (e.target === box) close(); });
  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(dx > 0 ? current + 1 : current - 1);
    x0 = null;
  });

  // قیمت اجاره / خرید
  $$('[data-mode]').forEach(b => b.addEventListener('click', () => {
    const buy = b.dataset.mode === 'buy';
    $$('[data-mode]').forEach(x => x.setAttribute('aria-pressed', x === b));
    $('#price').textContent = toman(buy ? d.buy : d.rent);
    $('#price-label').textContent = buy ? 'قیمت خرید و دوخت اختصاصی با سایز تو' : 'قیمت اجاره (با تنظیم کامل روی اندام تو)';
  }));

  // همه دکمه‌های رزرو صفحه، همین لباس را با خود ببرند
  $$('a[href="booking.html"]').forEach(a => a.setAttribute('href', `booking.html?dresses=${d.id}`));

  // لباس‌های مشابه: اول همان سبک، بعد قیمت نزدیک
  const similar = DRESSES.filter(x => x.id !== d.id)
    .sort((a, b) => ((b.style === d.style) - (a.style === d.style)) || Math.abs(a.rent - d.rent) - Math.abs(b.rent - d.rent))
    .slice(0, 8);
  $('#similar-row').innerHTML = similar.map((x, i) => dressCard(x, i)).join('');

  syncFavs();
  window.syncCompare && window.syncCompare();
  Sepid.initSlider($('#similar-row').closest('[data-slider]'));
}

document.addEventListener('DOMContentLoaded', initDress);
