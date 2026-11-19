/* اسکریپت اصلی «سپید»: منو، اسکرول، انیمیشن‌ها، علاقه‌مندی، مقایسه، اسلایدر، لایت‌باکس، شمارش معکوس */
'use strict';

/* ---------- ابزارهای عمومی ---------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const fa = n => Number(n).toLocaleString('fa-IR');
const toman = n => (n >= 1e6 ? `${fa(n / 1e6)} میلیون تومان` : `${fa(n)} تومان`);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// localStorage همیشه داخل try/catch (حالت خصوصی مرورگر خطا می‌دهد)
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* بی‌صدا */ } }
};

// آیکون‌های مشترک
const ICON_HEART = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.4C1.4 7.6 3.7 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.3 0 5.6 3.1 4.3 6.6-1.8 4.8-9.3 9.4-9.3 9.4z" stroke="#9A7B43" stroke-width="1.5" stroke-linejoin="round"/></svg>';
const ICON_COMPARE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 3v18M16 3v18M3 8h5M16 16h5"/></svg>';

/* ---------- کارت لباس (در اسلایدر، نتیجه آزمون و صفحات بعدی استفاده می‌شود) ---------- */
function dressCard(d, i = 0, mode = 'row', price = 'rent') {
  const width = mode === 'grid' ? 'w-full' : 'row-card';
  return `
  <article class="dress-card group ${width}" data-id="${d.id}">
    <div class="dress-media ph ph-${(i % 4) + 1} aspect-[3/4] rounded-2xl">
      <img class="img-a" src="${d.img}" alt="${d.alt}" loading="lazy" decoding="async" width="900" height="1200" onerror="imgFallback(this)">
      <img class="img-b" src="${d.imgB}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="900" height="1200" onerror="imgFallback(this)">
      ${d.isNew ? '<span class="chip absolute top-4 start-4 z-10">جدید</span>' : ''}
      <button class="heart absolute top-3 end-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-ivory/95 shadow-silk transition hover:scale-105"
        data-fav="${d.id}" aria-pressed="false" aria-label="ذخیره لباس ${d.name} در علاقه‌مندی‌ها">${ICON_HEART}</button>
      <span class="absolute bottom-4 start-4 z-[1] rounded-full bg-ivory/90 px-4 py-1 text-base font-bold text-ink shadow-silk" aria-hidden="true">${d.name}</span>
    </div>
    <div class="flex items-start justify-between gap-3 px-1 pt-4">
      <div>
        <h3 class="text-lg font-bold"><a href="dress.html?id=${d.id}" class="hover:text-gold-text">لباس «${d.name}»</a></h3>
        <p class="text-sm text-ink-soft">${STYLES[d.style].label} · ${COLORS[d.color].label}</p>
        <p class="mt-1 text-[15px] font-semibold">${price === 'buy' ? `خرید ${toman(d.buy)}` : `اجاره از ${toman(d.rent)}`}</p>
      </div>
      <button class="mt-1 inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-soft transition hover:border-rose aria-pressed:border-gold aria-pressed:bg-blush aria-pressed:text-ink"
        data-compare="${d.id}" aria-pressed="false" aria-label="افزودن ${d.name} به مقایسه">${ICON_COMPARE} مقایسه</button>
    </div>
  </article>`;
}

/* ---------- نوار اعلان ---------- */
function initAnnouncement() {
  const bar = $('#announce');
  if (!bar) return;
  if (store.get('sepid-announce-closed', false)) { bar.remove(); return; }
  $('#announce-close').addEventListener('click', () => { bar.remove(); store.set('sepid-announce-closed', true); });
}

/* ---------- هدر چسبان و منوی موبایل ---------- */
function initHeader() {
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const menu = $('#mobile-menu');
  const toggle = $('#menu-toggle');
  if (!menu || !toggle) return;
  const close = () => { menu.classList.add('hidden'); toggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; toggle.focus(); };
  toggle.addEventListener('click', () => {
    menu.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    trapFocus(menu, close);
    $('a', menu).focus();
  });
  $('#menu-close').addEventListener('click', close);
  $$('a', menu).forEach(a => a.addEventListener('click', close));
}

/* ---------- تله فوکوس و بستن با Esc برای مودال‌ها ---------- */
function trapFocus(el, onClose) {
  const handler = e => {
    if (el.classList.contains('hidden')) { document.removeEventListener('keydown', handler); return; }
    if (e.key === 'Escape') { onClose(); document.removeEventListener('keydown', handler); return; }
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])', el).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', handler);
}

/* ---------- ظاهر شدن با اسکرول و شمارنده اعداد ---------- */
function initReveal() {
  const els = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-visible')); return; }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(e => io.observe(e));
}

function initCounters() {
  const els = $$('[data-count]');
  const run = el => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = fa(target) + suffix; return; }
    const t0 = performance.now(), dur = 1800;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fa(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
  }), { threshold: 0.6 });
  els.forEach(e => io.observe(e));
}

/* ---------- پارالاکس و ذرات طلایی هیرو ---------- */
function initHero() {
  const media = $('#hero-media');
  if (reduceMotion || !media) return;
  let ticking = false, heroLimit = window.innerHeight * 1.2;
  window.addEventListener('resize', () => { heroLimit = window.innerHeight * 1.2; });
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < heroLimit) media.style.transform = `translate3d(0, ${Math.round(y * 0.3)}px, 0)`;
      ticking = false;
    });
  }, { passive: true });

  // canvas سبک با حداکثر ۲۵ ذره
  const cv = $('#particles');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let w, h, running = true;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => { w = cv.offsetWidth; h = cv.offsetHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  resize();
  let rz;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(resize, 150); });
  // پرفورمنس: یک بار یک «ذره» طلایی روی canvas کوچک کشیده می‌شود و هر فریم فقط کپی می‌شود
  // (ساختن گرادیان برای هر ذره در هر فریم گران است)
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  const sc = sprite.getContext('2d');
  const sg = sc.createRadialGradient(32, 32, 0, 32, 32, 32);
  sg.addColorStop(0, 'rgba(184,151,90,1)'); sg.addColorStop(1, 'rgba(184,151,90,0)');
  sc.fillStyle = sg; sc.fillRect(0, 0, 64, 64);
  const count = window.innerWidth < 768 ? 12 : 25;          // در موبایل ذره کمتر
  const parts = Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h, r: 0.8 + Math.random() * 2.2,
    v: 0.12 + Math.random() * 0.3, d: Math.random() * Math.PI * 2, a: 0.25 + Math.random() * 0.5
  }));
  const draw = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y -= p.v; p.d += 0.01; p.x += Math.sin(p.d) * 0.25;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      const R = p.r * 4;
      ctx.globalAlpha = p.a;
      ctx.drawImage(sprite, p.x - R, p.y - R, R * 2, R * 2);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };
  // وقتی هیرو دیده نمی‌شود، انیمیشن متوقف شود
  new IntersectionObserver(([en]) => { const was = running; running = en.isIntersecting; if (running && !was) draw(); }).observe(cv);
  draw();
}

/* ---------- علاقه‌مندی‌ها (localStorage) ---------- */
let favs = new Set(store.get('sepid-favs', []));
function syncFavs() {
  $$('[data-fav]').forEach(b => b.setAttribute('aria-pressed', favs.has(+b.dataset.fav) ? 'true' : 'false'));
  $$('.fav-count').forEach(el => { el.textContent = fa(favs.size); el.classList.toggle('hidden', favs.size === 0); });
}
function initFavs() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    const id = +b.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    store.set('sepid-favs', [...favs]);
    syncFavs();
    toast(favs.has(id) ? 'به علاقه‌مندی‌هایت اضافه شد؛ در فرم رزرو هم می‌بینی‌اش 🤍' : 'از علاقه‌مندی‌ها برداشته شد');
  });
  syncFavs();
}

/* ---------- مقایسه تا ۳ لباس ---------- */
let compare = [];
function initCompare() {
  const bar = $('#compare-bar'), modal = $('#compare-modal');
  if (!bar || !modal) return;
  const sync = () => {
    $$('[data-compare]').forEach(b => b.setAttribute('aria-pressed', compare.includes(+b.dataset.compare) ? 'true' : 'false'));
    bar.classList.toggle('hidden', compare.length === 0);
    $('#compare-count').textContent = fa(compare.length);
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-compare]');
    if (!b) return;
    const id = +b.dataset.compare;
    if (compare.includes(id)) compare = compare.filter(x => x !== id);
    else if (compare.length >= 3) { toast('حداکثر ۳ لباس را می‌توانی کنار هم ببینی'); return; }
    else compare.push(id);
    sync();
  });
  $('#compare-clear').addEventListener('click', () => { compare = []; sync(); });

  const close = () => { modal.classList.add('hidden'); document.body.style.overflow = ''; $('#compare-open').focus(); };
  $('#compare-open').addEventListener('click', () => {
    const list = compare.map(id => DRESSES.find(d => d.id === id));
    const rows = [
      ['سبک', d => STYLES[d.style].label], ['رنگ', d => COLORS[d.color].label], ['پارچه', d => d.fabric],
      ['یقه', d => d.neckline], ['دنباله', d => d.train], ['سایز', d => d.sizes],
      ['اجاره', d => toman(d.rent)], ['خرید', d => toman(d.buy)]
    ];
    $('#compare-body').innerHTML = `
      <div class="grid gap-4" style="grid-template-columns: repeat(${list.length}, minmax(0,1fr))">
        ${list.map((d, i) => `
          <div class="text-center">
            <div class="ph ph-${(i % 4) + 1} mx-auto aspect-[3/4] w-full max-w-[180px] rounded-xl"><img src="${d.img}" alt="${d.alt}" onerror="imgFallback(this)"></div>
            <h3 class="mt-3 font-bold">«${d.name}»</h3>
          </div>`).join('')}
      </div>
      <dl class="mt-6 divide-y divide-line text-sm">
        ${rows.map(([k, f]) => `
          <div class="py-3">
            <dt class="mb-1 text-xs font-semibold text-ink-soft">${k}</dt>
            <dd class="grid gap-4" style="grid-template-columns: repeat(${list.length}, minmax(0,1fr))">${list.map(d => `<span class="text-center">${f(d)}</span>`).join('')}</dd>
          </div>`).join('')}
      </dl>
      <a href="booking.html?dresses=${compare.join(',')}" class="btn-gold mt-6 w-full">همه را در پرو امتحان کن</a>`;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    trapFocus(modal, close);
    $('#compare-close').focus();
  });
  $('#compare-close').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  sync();
  window.syncCompare = sync;
}

/* ---------- اسلایدرهای افقی: دکمه، کشیدن با موس، نوار پیشرفت ---------- */
function initSliders() {
  const row = $('#new-collection');
  if (row) row.innerHTML = DRESSES.filter(d => d.isNew).map((d, i) => dressCard(d, i)).join('');
  $$('[data-slider]').forEach(initSlider);
}
function initSlider(wrap) {
  if (wrap._slider) { wrap._slider(); return; }
  const track = $('.snap-row', wrap);
  if (!track) return;
  const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300);
  const go = dir => {
    // اگر ردیف «سنجاق» شده باشد، دکمه‌ها خود صفحه را جابه‌جا می‌کنند تا با اسکرول هماهنگ بماند
    if (wrap._pin && wrap._pin.active) { window.scrollBy({ top: -dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  // در RTL «بعدی» یعنی اسکرول به سمت چپ (مقدار منفی)
  const next = $('[data-next]', wrap), prev = $('[data-prev]', wrap);
  next && next.addEventListener('click', () => go(-1));
  prev && prev.addEventListener('click', () => go(1));

  // نوار پیشرفت و غیرفعال شدن دکمه‌ها در دو سر
  // پرفورمنس: نوار فقط با transform جابه‌جا می‌شود (بدون layout) و هر مقدار فقط وقتی عوض شد نوشته می‌شود
  const thumb = $('[data-progress]', wrap);
  const ui = { ratio: -1, hidden: null, prev: null, next: null };
  const update = () => {
    const pin = wrap._pin;
    let max, pos, ratio;
    if (pin && pin.active) { max = pin.dist; pos = pin.pos; ratio = pin.ratio; }   // بدون خواندن layout
    else {
      max = track.scrollWidth - track.clientWidth;
      pos = Math.abs(track.scrollLeft);                     // در RTL مقدار scrollLeft منفی است
      ratio = max > 0 ? track.clientWidth / track.scrollWidth : 1;
    }
    if (thumb) {
      if (ratio !== ui.ratio) { ui.ratio = ratio; thumb.style.width = `${ratio * 100}%`; }
      const hide = max <= 4;
      if (hide !== ui.hidden) { ui.hidden = hide; thumb.parentElement.classList.toggle('invisible', hide); }
      // درصد translate نسبت به عرض خود نوار است؛ در RTL حرکت رو به جلو = به سمت چپ (منفی)
      const shift = max > 0 && ratio > 0 ? (pos / max) * (1 - ratio) / ratio * 100 : 0;
      thumb.style.transform = `translate3d(${-shift}%,0,0)`;
    }
    const atStart = pos <= 4, atEnd = pos >= max - 4;
    if (prev && atStart !== ui.prev) { ui.prev = atStart; prev.disabled = atStart; }
    if (next && atEnd !== ui.next) { ui.next = atEnd; next.disabled = atEnd; }
  };
  let uRaf = 0;
  const queueUpdate = () => { if (!uRaf) uRaf = requestAnimationFrame(() => { uRaf = 0; update(); }); };
  track.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate);

  // کشیدن با موس در دسکتاپ (در موبایل اسکرول لمسی خود مرورگر کار می‌کند)
  let down = false, moved = false, x0 = 0, s0 = 0;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || (wrap._pin && wrap._pin.active)) return;
    down = true; moved = false; x0 = e.clientX; s0 = track.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('is-dragging'); }
    if (moved) { track.scrollLeft = s0 - dx; e.preventDefault(); }
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    track.classList.remove('is-dragging');
  });
  // بعد از کشیدن، کلیک روی کارت اجرا نشود
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  track.addEventListener('dragstart', e => e.preventDefault());
  // کلیدهای جهت وقتی ردیف فوکوس دارد
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  });
  enableWheelScroll(track);
  wrap._pin = pinSlider(wrap, track, update);
  wrap._slider = () => { wrap._pin && wrap._pin.recalc(); update(); };
  update();
}

/* ---------- ردیف سنجاقی: با اسکرول عمودی صفحه، محصولات به همان اندازه افقی حرکت می‌کنند ----------
   ردیف وسط صفحه ثابت می‌ماند، هر پیکسل اسکرول = یک پیکسل حرکت افقی، و بعد از آخرین محصول صفحه ادامه می‌یابد.
   فقط برای موس/تاچ‌پد (دسکتاپ و لپ‌تاپ). در موبایل همان کشیدن با انگشت کار می‌کند.

   پرفورمنس (دلیل روان بودن):
   - ردیف با transform: translate3d جابه‌جا می‌شود، نه scrollLeft؛ یعنی کارت GPU آن را حرکت می‌دهد
     و مرورگر در هر فریم هیچ layout یا paint جدیدی انجام نمی‌دهد.
   - هیچ نرم‌کننده (lerp) جداگانه‌ای نیست: اسکرول خود مرورگر نرم است و دو بار نرم کردن حس تأخیر و لگ می‌دهد.
     transform دقیقاً در همان فریمِ رویداد scroll نوشته می‌شود، پس ردیف با صفحه هم‌زمان است.
   - در رویداد scroll هیچ اندازه‌ای خوانده نمی‌شود؛ اندازه‌ها فقط وقتی چیدمان عوض شد (ResizeObserver) محاسبه می‌شوند. */
const PIN_MQ = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
const CAN_CLIP = !!(window.CSS && CSS.supports && CSS.supports('overflow-x', 'clip'));
const pins = new Set();
let pinRaf = 0;
const recalcAllPins = () => { if (!pinRaf) pinRaf = requestAnimationFrame(() => { pinRaf = 0; pins.forEach(p => p.recalc()); }); };
// هر تغییر ارتفاع صفحه (بارگذاری عکس، بستن نوار اعلان، فیلتر و...) نقطه شروع را جابه‌جا می‌کند
if ('ResizeObserver' in window) new ResizeObserver(recalcAllPins).observe(document.body);
window.addEventListener('resize', recalcAllPins);
window.addEventListener('load', recalcAllPins);
PIN_MQ.addEventListener && PIN_MQ.addEventListener('change', recalcAllPins);

function pinSlider(wrap, track, onUpdate) {
  const pinEl = wrap.tagName === 'SECTION' ? wrap.firstElementChild : wrap;
  if (!pinEl) return null;
  const spacer = document.createElement('div');
  spacer.setAttribute('aria-hidden', 'true');
  pinEl.after(spacer);
  // کارت‌هایی که از کادر بیرون می‌زنند با overflow: clip بریده می‌شوند (clip برخلاف hidden، sticky را خراب نمی‌کند)
  const clipEl = track.closest('section') || wrap;
  const st = { active: false, start: 0, dist: 0, pos: 0, ratio: 1, sig: '' };

  const headerH = () => { const h = $('.site-header'); return h ? h.getBoundingClientRect().height : 0; };
  const setX = v => {
    if (v === st.pos) return;
    st.pos = v;
    track.style.transform = v ? `translate3d(${v}px,0,0)` : '';   // RTL: مثبت = ردیف به راست می‌رود و کارت‌های چپ دیده می‌شوند
    onUpdate && onUpdate();
  };
  const onScroll = () => {
    if (!st.active) return;
    setX(Math.round(Math.min(st.dist, Math.max(0, window.scrollY - st.start))));
  };

  st.recalc = () => {
    // اول همه چیز به حالت عادی برمی‌گردد تا اندازه واقعی ردیف خوانده شود (همه در یک فریم، بدون پرش دیده‌شدنی)
    track.classList.remove('is-pinned');
    track.style.transform = '';
    pinEl.style.position = pinEl.style.top = pinEl.style.zIndex = '';
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const active = PIN_MQ.matches && !reduceMotion && CAN_CLIP && max > 4;
    if (!active) {
      spacer.style.height = '0px';
      clipEl.style.overflowX = '';
      if (st.active) { st.active = false; st.pos = -1; setX(0); } else st.pos = 0;
      onUpdate && onUpdate();
      return;
    }
    st.ratio = track.clientWidth / track.scrollWidth;
    st.dist = max;
    track.scrollLeft = 0;
    clipEl.style.overflowX = 'clip';
    track.classList.add('is-pinned');
    spacer.style.height = `${max}px`;
    // ردیف محصولات دقیقاً وسط فضای زیر هدر قرار بگیرد
    const hh = headerH(), avail = window.innerHeight - hh;
    const pinRect = pinEl.getBoundingClientRect(), trRect = track.getBoundingClientRect();
    const offsetInPin = trRect.top - pinRect.top;
    const top = Math.round(hh + (avail - trRect.height) / 2 - offsetInPin);
    pinEl.style.position = 'sticky';
    pinEl.style.top = `${top}px`;
    pinEl.style.zIndex = '1';
    // نقطه شروع: جایی که لبه بالای ردیف به موقعیت سنجاق می‌رسد
    const spacerTop = spacer.getBoundingClientRect().top + window.scrollY;
    st.start = spacerTop - pinEl.offsetHeight - top;
    st.active = true;
    const v = Math.round(Math.min(st.dist, Math.max(0, window.scrollY - st.start)));
    st.pos = -1;                       // transform دوباره نوشته شود
    setX(v);
    onUpdate && onUpdate();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  pins.add(st);
  st.recalc();
  return st;
}

/* ---------- اسکرول چرخ موس روی ردیف محصولات = حرکت افقی ----------
   فقط وقتی موس روی خود ردیف است کار می‌کند. وقتی ردیف به انتها رسید،
   اسکرول به صفحه برمی‌گردد تا کاربر گیر نیفتد. */
function enableWheelScroll(track) {
  if (!track || track._wheel) return;
  track._wheel = true;
  let idle, centeringUntil = 0;
  const headerH = () => { const h = $('.site-header'); return h ? h.getBoundingClientRect().height : 0; };
  track.addEventListener('wheel', e => {
    if (e.ctrlKey || track.classList.contains('is-pinned')) return; // ردیف سنجاقی با اسکرول صفحه کار می‌کند
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;   // اسکرول افقی تاچ‌پد را خود مرورگر انجام می‌دهد
    const delta = e.deltaY;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 4) return;                                    // ردیفی که جای اسکرول ندارد
    const pos = Math.abs(track.scrollLeft);                  // در RTL مقدار scrollLeft منفی است
    const forward = delta > 0;                               // چرخ به پایین = محصول بعدی
    if ((forward && pos >= max - 2) || (!forward && pos <= 2)) return; // سر ردیف: صفحه اسکرول شود

    // قدم اول: اگر ردیف کامل در صفحه نیست، اول ردیف را وسط صفحه بیاور
    const r = track.getBoundingClientRect(), top = headerH(), room = window.innerHeight - top;
    if (Date.now() < centeringUntil) { e.preventDefault(); return; }
    if (r.height <= room && (r.top < top - 2 || r.bottom > window.innerHeight + 2)) {
      e.preventDefault();
      const target = window.scrollY + r.top - top - (room - r.height) / 2;
      window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
      centeringUntil = Date.now() + (reduceMotion ? 0 : 450);
      return;
    }

    // قدم دوم: حرکت افقی محصولات
    e.preventDefault();
    const px = e.deltaMode === 1 ? delta * 40 : e.deltaMode === 2 ? delta * track.clientWidth : delta;
    track.classList.add('is-wheeling');                      // موقع چرخش، snap موقتاً خاموش
    track.scrollLeft -= px;                                  // در RTL «بعدی» یعنی به سمت چپ
    clearTimeout(idle);
    idle = setTimeout(() => track.classList.remove('is-wheeling'), 180);
  }, { passive: false });
}

/* ---------- آکاردئون سؤالات متداول ---------- */
function initFaq() {
  $$('.acc-item').forEach(item => {
    const btn = $('button', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
  });
}

/* ---------- لایت‌باکس گالری ---------- */
function initLightbox() {
  const all = $$('[data-lightbox]');
  if (!all.length || !$('#lightbox')) return;
  const box = $('#lightbox'), fig = $('#lb-figure'), cap = $('#lb-caption');
  let items = all, idx = 0, lastFocus;
  const show = i => {
    idx = (i + items.length) % items.length;
    const it = items[idx];
    // object-contain و بدون نسبت ثابت: عکس مربعی یا افقی هم کامل دیده می‌شود
    fig.innerHTML = `<img src="${it.dataset.src}" alt="${it.dataset.caption}" class="block h-auto max-h-[72vh] w-auto max-w-[92vw] rounded-2xl object-contain" onerror="imgFallback(this)">`;
    fig.className = 'relative mx-auto';
    cap.textContent = `${it.dataset.caption} — ${fa(idx + 1)} از ${fa(items.length)}`;
  };
  const close = () => { box.classList.add('hidden'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  all.forEach(it => it.addEventListener('click', () => {
    items = all.filter(x => x.offsetParent !== null); // فقط عکس‌های دیده‌شده (بعد از فیلتر)
    lastFocus = it; show(items.indexOf(it));
    box.classList.remove('hidden'); document.body.style.overflow = 'hidden';
    trapFocus(box, close); $('#lb-close').focus();
  }));
  $('#lb-close').addEventListener('click', close);
  $('#lb-next').addEventListener('click', () => show(idx + 1));
  $('#lb-prev').addEventListener('click', () => show(idx - 1));
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (box.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') show(idx + 1);   // در RTL چپ = بعدی
    if (e.key === 'ArrowRight') show(idx - 1);
  });
  let x0 = null;
  box.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(dx > 0 ? idx + 1 : idx - 1);
    x0 = null;
  });
}

/* ---------- شمارش معکوس تا عروسی (تاریخ شمسی) ---------- */
// تبدیل شمسی به میلادی بدون کتابخانه
function jalaliToGregorian(jy, jm, jd) {
  jy += 1595;
  let days = -355668 + 365 * jy + ~~(jy / 33) * 8 + ~~(((jy % 33) + 3) / 4) + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * ~~(days / 146097);
  days %= 146097;
  if (days > 36524) { gy += 100 * ~~(--days / 36524); days %= 36524; if (days >= 365) days++; }
  gy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) { gy += ~~((days - 1) / 365); days = (days - 1) % 365; }
  let gd = days + 1;
  const m = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm;
  for (gm = 0; gm < 13 && gd > m[gm]; gm++) gd -= m[gm];
  return [gy, gm, gd];
}
const JALALI_MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const jalaliToday = () => {
  const parts = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
  const g = t => +parts.find(p => p.type === t).value;
  return { y: g('year'), m: g('month'), d: g('day') };
};

function initCountdown() {
  const form = $('#countdown-form');
  if (!form) return;
  const ySel = $('#cd-year'), mSel = $('#cd-month'), dSel = $('#cd-day'), out = $('#countdown-out');
  const today = jalaliToday();
  ySel.innerHTML = [0, 1, 2].map(i => `<option value="${today.y + i}">${fa(today.y + i).replace(/٬/g, '')}</option>`).join('');
  mSel.innerHTML = JALALI_MONTHS.map((n, i) => `<option value="${i + 1}">${n}</option>`).join('');
  const fillDays = () => {
    const m = +mSel.value, len = m <= 6 ? 31 : m <= 11 ? 30 : 29;
    const cur = +dSel.value || 1;
    dSel.innerHTML = Array.from({ length: len }, (_, i) => `<option value="${i + 1}">${fa(i + 1)}</option>`).join('');
    dSel.value = Math.min(cur, len);
  };
  mSel.addEventListener('change', fillDays);

  let timer;
  const render = target => {
    clearInterval(timer);
    // پرفورمنس: جعبه‌ها یک بار ساخته می‌شوند و هر ثانیه فقط عددها عوض می‌شوند
    const labels = ['روز', 'ساعت', 'دقیقه', 'ثانیه'];
    out.innerHTML = labels.map(l =>
      `<div class="min-w-[70px] rounded-2xl bg-ivory/90 px-3 py-3 shadow-silk"><span class="block text-2xl font-bold md:text-3xl" data-cd></span><span class="text-xs text-ink-soft">${l}</span></div>`).join('');
    const nums = $$('[data-cd]', out);
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { out.innerHTML = '<p class="text-lg font-semibold">مبارک باشد! 🤍 امروز روز توست.</p>'; clearInterval(timer); return; }
      const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, mi = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
      [d, h, mi, s].forEach((v, i) => { const t = fa(v); if (nums[i].textContent !== t) nums[i].textContent = t; });
    };
    tick();
    timer = setInterval(tick, 1000);
  };

  const saved = store.get('sepid-wedding', null);
  if (saved) { ySel.value = saved.y; mSel.value = saved.m; fillDays(); dSel.value = saved.d; }
  else { mSel.value = Math.min(today.m + 4, 12); fillDays(); }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const y = +ySel.value, m = +mSel.value, d = +dSel.value;
    const [gy, gm, gd] = jalaliToGregorian(y, m, d);
    const target = new Date(gy, gm - 1, gd, 18, 0, 0).getTime();
    if (target < Date.now()) { out.innerHTML = '<p class="text-error">این تاریخ گذشته است؛ لطفاً روزی در آینده انتخاب کن.</p>'; return; }
    store.set('sepid-wedding', { y, m, d });
    render(target);
  });
  if (saved) form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit'));
}

/* ---------- پیام کوتاه (toast) ---------- */
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('opacity-0', 'translate-y-4');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.add('opacity-0', 'translate-y-4'), 2600);
}

/* ---------- شروع ---------- */
window.Sepid = { dressCard, initSlider, enableWheelScroll, syncFavs, trapFocus, toast, jalaliToGregorian, jalaliToday, JALALI_MONTHS };
document.addEventListener('DOMContentLoaded', () => {
  initAnnouncement();
  initHeader();
  initSliders();
  initFavs();
  initCompare();
  initReveal();
  initCounters();
  initHero();
  initFaq();
  initLightbox();
  initCountdown();
  $('#year') && ($('#year').textContent = fa(jalaliToday().y).replace(/٬/g, ''));
});
