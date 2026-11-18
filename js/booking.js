/* فرم رزرو ۳ مرحله‌ای: خدمت و لباس ← روز و ساعت (تقویم شمسی) ← اطلاعات تماس ← صفحه تشکر */
'use strict';

const SERVICES = [
  { id: 'rent', label: 'اجاره لباس عروس', note: 'پرو و انتخاب از ۲۰۰+ مدل' },
  { id: 'custom', label: 'خرید و دوخت اختصاصی', note: 'طراحی و دوخت با سایز تو' },
  { id: 'engage', label: 'لباس نامزدی و عقد', note: 'رنگی و شیک' },
  { id: 'evening', label: 'لباس شب و حنابندان', note: 'برای شب‌های قبل از عروسی' }
];
const SLOTS = ['۱۰:۰۰', '۱۱:۳۰', '۱۳:۰۰', '۱۴:۳۰', '۱۶:۰۰', '۱۷:۳۰', '۱۹:۰۰'];
const SLOT_HOURS = [[10, 0], [11, 30], [13, 0], [14, 30], [16, 0], [17, 30], [19, 0]];
const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

// تبدیل اعداد فارسی/عربی به انگلیسی برای اعتبارسنجی موبایل
const toEnDigits = s => s.replace(/[۰-۹]/g, c => '۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).replace(/[٠-٩]/g, c => '٠١٢٣٤٥٦٧٨٩'.indexOf(c));
const jParts = date => {
  const p = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
  const g = t => +p.find(x => x.type === t).value;
  return { y: g('year'), m: g('month'), d: g('day') };
};
const jLabel = date => { const j = jParts(date); return `${fa(j.d)} ${Sepid.JALALI_MONTHS[j.m - 1]} ${fa(j.y).replace(/٬/g, '')}`; };
const weekdayName = date => new Intl.DateTimeFormat('fa-IR', { weekday: 'long' }).format(date);

function initBooking() {
  const form = $('#booking-form');
  if (!form) return;
  const params = new URLSearchParams(location.search);
  const fromUrl = (params.get('dresses') || '').split(',').map(Number).filter(id => DRESSES.some(d => d.id === id));
  const state = {
    step: 1,
    service: SERVICES.some(x => x.id === params.get('service')) ? params.get('service') : 'rent',
    dresses: new Set(fromUrl),
    date: null, slot: null
  };

  /* ---------- مرحله ۱: خدمت و لباس‌ها ---------- */
  $('#services').innerHTML = SERVICES.map((s, i) => `
    <label class="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-ivory p-4 transition hover:border-rose has-[:checked]:border-gold has-[:checked]:bg-blush/40">
      <input type="radio" name="service" value="${s.id}" ${s.id === state.service ? 'checked' : ''} class="mt-1.5 accent-[#9A7B43]">
      <span><span class="block font-bold">${s.label}</span><span class="text-sm text-ink-soft">${s.note}</span></span>
    </label>`).join('');

  const candidates = [...new Set([...fromUrl, ...favs])].map(id => DRESSES.find(d => d.id === id)).filter(Boolean);
  const dressBox = $('#dress-picks');
  if (candidates.length) {
    dressBox.innerHTML = `<div class="snap-row" tabindex="0" aria-label="لباس‌های ذخیره‌شده">${candidates.map((d, i) => `
      <label class="block w-36 cursor-pointer">
        <span class="ph ph-${(i % 4) + 1} relative block aspect-[3/4] rounded-xl ring-gold ring-offset-2 ring-offset-ivory has-[:checked]:ring-2">
          <img src="${d.img}" alt="${d.alt}" loading="lazy" onerror="imgFallback(this)">
          <input type="checkbox" value="${d.id}" ${state.dresses.has(d.id) ? 'checked' : ''} class="absolute top-2 end-2 z-[1] h-5 w-5 accent-[#9A7B43]" aria-label="انتخاب ${d.name} برای پرو">
        </span>
        <span class="mt-2 block text-sm font-semibold">«${d.name}»</span>
        <span class="block text-xs text-ink-soft">${STYLES[d.style].label}</span>
      </label>`).join('')}</div>`;
  } else {
    dressBox.innerHTML = `<p class="rounded-2xl border border-dashed border-line p-5 text-sm text-ink-soft">هنوز لباسی ذخیره نکرده‌ای؛ اشکالی ندارد! در پرو با هم انتخاب می‌کنیم. اگر بخواهی، از <a href="collection.html" class="font-semibold text-gold-text underline-offset-4 hover:underline">کالکشن</a> لباس‌های دلخواهت را قلب بزن.</p>`;
  }
  Sepid.enableWheelScroll($('.snap-row', dressBox));
  dressBox.addEventListener('change', e => {
    if (e.target.type !== 'checkbox') return;
    const id = +e.target.value;
    e.target.checked ? state.dresses.add(id) : state.dresses.delete(id);
    if (state.dresses.size > 5) { e.target.checked = false; state.dresses.delete(id); Sepid.toast('در هر پرو تا ۵ لباس را امتحان می‌کنیم'); }
    summary();
  });
  $('#services').addEventListener('change', e => { state.service = e.target.value; summary(); });

  /* ---------- مرحله ۲: تقویم شمسی و ساعت ---------- */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 35 }, (_, i) => { const x = new Date(today); x.setDate(today.getDate() + i); return x; });
  const lead = (today.getDay() + 1) % 7; // شنبه = ستون اول
  const firstJ = jParts(days[0]), lastJ = jParts(days[days.length - 1]);
  $('#cal-title').textContent = firstJ.m === lastJ.m
    ? `${Sepid.JALALI_MONTHS[firstJ.m - 1]} ${fa(firstJ.y).replace(/٬/g, '')}`
    : `${Sepid.JALALI_MONTHS[firstJ.m - 1]} و ${Sepid.JALALI_MONTHS[lastJ.m - 1]} ${fa(lastJ.y).replace(/٬/g, '')}`;
  // ظرفیت پرشده به‌صورت ثابت و قابل‌پیش‌بینی (نمونه)
  const taken = (date, i) => ((jParts(date).d * 7 + i * 3) % 5 === 0);
  $('#calendar').innerHTML = WEEKDAYS.map(w => `<span class="py-2 text-center text-xs font-semibold text-ink-soft">${w}</span>`).join('') +
    Array.from({ length: lead }, () => '<span></span>').join('') +
    days.map((date, i) => {
      const j = jParts(date), friday = date.getDay() === 5, full = !friday && i > 0 && SLOT_HOURS.every((_, k) => taken(date, k));
      const disabled = friday || i === 0 || full;
      return `<button type="button" class="day relative aspect-square rounded-xl text-sm transition ${disabled ? 'cursor-not-allowed text-ink-soft/50' : 'bg-ivory hover:bg-blush/50'} aria-pressed:bg-gold aria-pressed:font-bold aria-pressed:text-ink-deep"
        data-day="${i}" ${disabled ? 'disabled' : ''} aria-pressed="false" aria-label="${weekdayName(date)} ${jLabel(date)}${friday ? '، تعطیل' : i === 0 ? '، امروز' : full ? '، تکمیل' : ''}">
        ${fa(j.d)}${j.d === 1 || i === 0 ? `<span class="absolute inset-x-0 bottom-0.5 text-[9px] leading-none">${Sepid.JALALI_MONTHS[j.m - 1]}</span>` : ''}
      </button>`;
    }).join('');

  const renderSlots = () => {
    const box = $('#slots');
    if (state.date === null) { box.innerHTML = '<p class="text-sm text-ink-soft">اول یک روز انتخاب کن تا ساعت‌های خالی را ببینی.</p>'; return; }
    const date = days[state.date];
    $('#slots-title').textContent = `ساعت‌های خالی ${weekdayName(date)} ${jLabel(date)}`;
    box.innerHTML = `<div class="grid grid-cols-3 gap-2 sm:grid-cols-4">${SLOTS.map((s, k) => {
      const busy = taken(date, k);
      return `<button type="button" class="rounded-full border px-3 py-2 text-sm transition ${busy ? 'cursor-not-allowed border-line text-ink-soft/50 line-through' : 'border-line bg-ivory hover:border-rose'} aria-pressed:border-gold aria-pressed:bg-blush aria-pressed:font-bold"
        data-slot="${k}" ${busy ? 'disabled' : ''} aria-pressed="${state.slot === k}" aria-label="ساعت ${s}${busy ? '، پر شده' : ''}">${s}</button>`;
    }).join('')}</div>`;
  };
  $('#calendar').addEventListener('click', e => {
    const b = e.target.closest('[data-day]'); if (!b) return;
    state.date = +b.dataset.day; state.slot = null;
    $$('[data-day]').forEach(x => x.setAttribute('aria-pressed', x === b));
    renderSlots(); summary(); clearErr(2);
  });
  $('#slots').addEventListener('click', e => {
    const b = e.target.closest('[data-slot]'); if (!b) return;
    state.slot = +b.dataset.slot;
    $$('[data-slot]').forEach(x => x.setAttribute('aria-pressed', x === b));
    summary(); clearErr(2);
  });
  renderSlots();

  /* ---------- مرحله ۳: اطلاعات تماس با اعتبارسنجی زنده ---------- */
  const tj = Sepid.jalaliToday();
  $('#w-year').innerHTML = '<option value="">سال</option>' + [0, 1].map(i => `<option value="${tj.y + i}">${fa(tj.y + i).replace(/٬/g, '')}</option>`).join('');
  $('#w-month').innerHTML = '<option value="">ماه</option>' + Sepid.JALALI_MONTHS.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('');
  $('#w-day').innerHTML = '<option value="">روز</option>' + Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${fa(i + 1)}</option>`).join('');

  const nameEl = $('#f-name'), mobileEl = $('#f-mobile');
  const setFieldErr = (el, msg) => {
    const err = $(`#${el.id}-err`);
    err.textContent = msg || '';
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.classList.toggle('!border-error', !!msg);
  };
  const checkName = () => { const ok = nameEl.value.trim().length >= 2; setFieldErr(nameEl, ok ? '' : 'لطفاً نامت را بنویس تا بدانیم چطور صدایت کنیم.'); return ok; };
  const checkMobile = () => {
    const v = toEnDigits(mobileEl.value).replace(/[\s-]/g, '');
    let msg = '';
    if (!v) msg = 'شماره موبایلت را وارد کن تا وقت پرو را تأیید کنیم.';
    else if (!/^09/.test(v)) msg = 'شماره موبایل باید با ۰۹ شروع شود.';
    else if (!/^09\d{9}$/.test(v)) msg = `شماره موبایل ۱۱ رقم است؛ الان ${fa(v.replace(/\D/g, '').length)} رقم نوشته‌ای.`;
    setFieldErr(mobileEl, msg);
    $('#f-mobile-ok').classList.toggle('hidden', !!msg);
    return !msg;
  };
  nameEl.addEventListener('blur', checkName);
  nameEl.addEventListener('input', () => { if (nameEl.getAttribute('aria-invalid') === 'true') checkName(); summary(); });
  mobileEl.addEventListener('input', () => { if (toEnDigits(mobileEl.value).replace(/\D/g, '').length >= 11 || mobileEl.getAttribute('aria-invalid') === 'true') checkMobile(); });
  mobileEl.addEventListener('blur', checkMobile);

  /* ---------- جابه‌جایی بین مرحله‌ها ---------- */
  const stepErr = n => $(`#step${n}-err`);
  const clearErr = n => { stepErr(n).textContent = ''; };
  const go = n => {
    state.step = n;
    $$('[data-step]').forEach(p => p.classList.toggle('hidden', +p.dataset.step !== n));
    $$('[data-step-dot]').forEach(dot => {
      const k = +dot.dataset.stepDot;
      dot.dataset.state = k < n ? 'done' : k === n ? 'current' : 'todo';
      dot.toggleAttribute('aria-current', k === n);
    });
    $('#step-bar').style.width = `${((n - 1) / 2) * 100}%`;
    const head = $(`[data-step="${n}"] h2`);
    head && head.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };
  $$('[data-next-step]').forEach(b => b.addEventListener('click', () => {
    if (state.step === 2 && (state.date === null || state.slot === null)) {
      stepErr(2).textContent = state.date === null ? 'لطفاً یک روز از تقویم انتخاب کن.' : 'حالا یکی از ساعت‌های خالی را انتخاب کن.';
      return;
    }
    go(state.step + 1);
  }));
  $$('[data-prev-step]').forEach(b => b.addEventListener('click', () => go(state.step - 1)));

  /* ---------- خلاصه کناری ---------- */
  const summary = () => {
    const srv = SERVICES.find(s => s.id === state.service);
    const date = state.date !== null ? days[state.date] : null;
    $('#sum-service').textContent = srv.label;
    $('#sum-date').textContent = date ? `${weekdayName(date)} ${jLabel(date)}${state.slot !== null ? `، ساعت ${SLOTS[state.slot]}` : ''}` : 'هنوز انتخاب نشده';
    $('#sum-dresses').textContent = state.dresses.size
      ? [...state.dresses].map(id => `«${DRESSES.find(d => d.id === id).name}»`).join('، ')
      : 'در پرو با هم انتخاب می‌کنیم';
  };
  summary();

  /* ---------- ثبت نهایی ---------- */
  form.addEventListener('submit', e => {
    e.preventDefault();
    const okName = checkName(), okMobile = checkMobile();
    if (!okName || !okMobile) { (okName ? mobileEl : nameEl).focus(); stepErr(3).textContent = 'فقط نام و موبایل لازم است؛ لطفاً آن‌ها را کامل کن.'; return; }
    stepErr(3).textContent = '';
    const date = days[state.date], [hh, mm] = SLOT_HOURS[state.slot];
    const code = `SP-${fa(Math.floor(1000 + Math.random() * 9000)).replace(/٬/g, '')}`;
    const booking = {
      code, name: nameEl.value.trim(), mobile: toEnDigits(mobileEl.value).replace(/\D/g, ''),
      service: state.service, dresses: [...state.dresses], dateLabel: `${weekdayName(date)} ${jLabel(date)}`, time: SLOTS[state.slot]
    };
    store.set('sepid-booking', booking);
    thankYou(booking, date, hh, mm);
  });

  function thankYou(b, date, hh, mm) {
    $('#booking-flow').classList.add('hidden');
    const ty = $('#thank-you');
    const pad = n => String(n).padStart(2, '0');
    const start = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(hh)}${pad(mm)}00`;
    const endH = hh + 1 + (mm === 30 ? 1 : 0), endM = mm === 30 ? 0 : 30;
    const end = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(endH)}${pad(endM)}00`;
    const title = 'پرو لباس عروس در مزون سپید';
    const details = `کد پیگیری: ${b.code}`;
    const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&ctz=Asia/Tehran&details=${encodeURIComponent(details)}&location=${encodeURIComponent('تهران، خیابان ولیعصر، پلاک ۱۲۰')}`;
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Sepid//FA\r\nBEGIN:VEVENT\r\nUID:${b.code}@sepid\r\nDTSTART;TZID=Asia/Tehran:${start}\r\nDTEND;TZID=Asia/Tehran:${end}\r\nSUMMARY:${title}\r\nDESCRIPTION:${details}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const dressNames = b.dresses.map(id => `«${DRESSES.find(d => d.id === id).name}»`).join('، ');
    ty.innerHTML = `
      <div class="text-center">
        <span class="mx-auto grid h-20 w-20 place-items-center rounded-full bg-sage/40" aria-hidden="true">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#3B3330" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path class="draw-check" d="M5 12.5l4.5 4.5L19 7.5"/></svg>
        </span>
        <h2 class="mt-6 text-[28px] font-bold md:text-4xl" tabindex="-1" id="ty-title">${b.name} عزیز، نوبتت ثبت شد 🤍</h2>
        <p class="lead">تا چند ساعت دیگر برای تأیید نهایی با شماره <span dir="ltr">${b.mobile.replace(/\d/g, n => '۰۱۲۳۴۵۶۷۸۹'[n])}</span> تماس می‌گیریم.</p>
      </div>
      <div class="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
        <div class="rounded-2xl bg-pearl p-6">
          <p class="text-sm text-ink-soft">کد پیگیری</p>
          <p class="text-2xl font-bold tracking-wider" dir="ltr">${b.code}</p>
          <dl class="mt-5 space-y-3 text-sm">
            <div><dt class="text-ink-soft">زمان پرو</dt><dd class="font-semibold">${b.dateLabel}، ساعت ${b.time}</dd></div>
            <div><dt class="text-ink-soft">خدمت</dt><dd class="font-semibold">${SERVICES.find(s => s.id === b.service).label}</dd></div>
            <div><dt class="text-ink-soft">لباس‌ها</dt><dd class="font-semibold">${dressNames || 'در پرو با هم انتخاب می‌کنیم'}</dd></div>
          </dl>
          <div class="mt-6 grid gap-2">
            <a href="${gcal}" rel="noopener" class="btn-gold !py-3">افزودن به تقویم گوگل</a>
            <a href="data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}" download="sepid-${b.code}.ics" class="btn-line !py-3">افزودن به تقویم گوشی</a>
          </div>
        </div>
        <div class="rounded-2xl border border-line p-6">
          <h3 class="font-bold">چه چیزی با خودت بیاوری؟</h3>
          <ul class="mt-4 space-y-3 text-sm text-ink-soft">
            <li class="flex gap-2"><span class="text-gold-text" aria-hidden="true">✓</span>کفشی با پاشنه‌ای شبیه کفش روز مراسم</li>
            <li class="flex gap-2"><span class="text-gold-text" aria-hidden="true">✓</span>لباس زیر بدون درز و هم‌رنگ پوست</li>
            <li class="flex gap-2"><span class="text-gold-text" aria-hidden="true">✓</span>عکس مدل‌هایی که دوست داری (اسکرین‌شات هم خوب است)</li>
            <li class="flex gap-2"><span class="text-gold-text" aria-hidden="true">✓</span>تاریخ دقیق و نشانی تالار یا باغ</li>
            <li class="flex gap-2"><span class="text-gold-text" aria-hidden="true">✓</span>حداکثر ۳ همراه عزیز برای نظر دادن</li>
          </ul>
          <p class="mt-5 rounded-xl bg-blush/40 p-3 text-xs leading-6">اگر برنامه‌ات عوض شد، با یک پیام در واتساپ نوبتت را جابه‌جا می‌کنیم؛ بدون هیچ هزینه‌ای.</p>
        </div>
      </div>
      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <a href="https://wa.me/989120000000?text=${encodeURIComponent(`سلام، نوبت پرو با کد ${b.code} ثبت کردم`)}" rel="noopener" class="btn-line">پیام در واتساپ</a>
        <a href="collection.html" class="btn-line">دیدن لباس‌های بیشتر</a>
      </div>`;
    ty.classList.remove('hidden');
    $('#ty-title').focus();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  go(1);
  window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', initBooking);
