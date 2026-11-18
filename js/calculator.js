/* ماشین‌حساب پکیج: قیمت تقریبی زنده به تومان — شفافی قیمت = اعتماد */
'use strict';

const CALC = {
  base: {
    rent: { classic: 18000000, special: 26000000, luxe: 38000000 },
    buy:  { classic: 65000000, special: 90000000, luxe: 130000000 }
  },
  extras: [
    { id: 'veil',     label: 'تور و تاج', price: 4500000 },
    { id: 'jupon',    label: 'ژپون و کرست', price: 2200000 },
    { id: 'shoes',    label: 'کفش عروس', price: 3800000 },
    { id: 'aqd',      label: 'لباس عقد / نامزدی (اجاره)', price: 9000000 },
    { id: 'henna',    label: 'لباس حنابندان (اجاره)', price: 7000000 },
    { id: 'dayof',    label: 'اتو و آماده‌سازی روز مراسم', price: 1500000 }
  ]
};

function initCalculator() {
  const root = $('#calculator');
  if (!root) return;
  const extrasBox = $('#calc-extras', root);
  extrasBox.innerHTML = CALC.extras.map(x => `
    <label class="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-ivory px-4 py-3 transition hover:border-rose has-[:checked]:border-gold has-[:checked]:bg-blush/40">
      <span class="flex items-center gap-3">
        <input type="checkbox" value="${x.id}" class="h-4 w-4 accent-[#9A7B43]">
        <span>${x.label}</span>
      </span>
      <span class="text-sm text-ink-soft">${toman(x.price)}</span>
    </label>`).join('');

  const out = $('#calc-total', root), detail = $('#calc-detail', root);
  let shown = 0;
  const animateTo = val => {
    if (reduceMotion) { out.textContent = toman(val); shown = val; return; }
    const from = shown, t0 = performance.now(), dur = 600;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      const v = Math.round((from + (val - from) * e) / 100000) * 100000;
      out.textContent = toman(v);
      if (p < 1) requestAnimationFrame(step); else shown = val;
    };
    requestAnimationFrame(step);
  };

  const calc = () => {
    const mode = $('input[name="calc-mode"]:checked', root).value;
    const tier = $('input[name="calc-tier"]:checked', root).value;
    const picked = $$('#calc-extras input:checked', root).map(i => CALC.extras.find(x => x.id === i.value));
    const total = CALC.base[mode][tier] + picked.reduce((s, x) => s + x.price, 0);
    animateTo(total);
    detail.textContent = `لباس ${mode === 'rent' ? 'اجاره‌ای' : 'خرید و دوخت'}${picked.length ? ` + ${fa(picked.length)} خدمت اضافه` : ''}`;
  };
  root.addEventListener('change', calc);
  calc();
}

document.addEventListener('DOMContentLoaded', initCalculator);
