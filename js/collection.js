/* صفحه کالکشن: فیلتر بدون رفرش (سبک، رنگ، بودجه، اجاره/خرید، علاقه‌مندی) با انیمیشن fade */
'use strict';

function initCollection() {
  const grid = $('#grid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const state = {
    style: STYLES[params.get('style')] ? params.get('style') : 'all',
    color: COLORS[params.get('color')] ? params.get('color') : 'all',
    budget: params.get('budget') || 'all',
    price: params.get('price') === 'buy' ? 'buy' : 'rent',
    sort: params.get('sort') || 'new',
    fav: params.get('fav') === '1'
  };

  // ساخت چیپ‌های سبک و رنگ
  $('#style-chips').innerHTML = [['all', 'همه سبک‌ها'], ...Object.entries(STYLES).map(([k, v]) => [k, v.label])]
    .map(([k, l]) => `<button class="filter-chip" data-style="${k}" aria-pressed="false">${l}</button>`).join('');
  $('#color-chips').innerHTML = [['all', 'همه رنگ‌ها', ''], ...Object.entries(COLORS).map(([k, v]) => [k, v.label, v.hex])]
    .map(([k, l, hex]) => `<button class="filter-chip" data-color="${k}" aria-pressed="false" title="${k === 'all' ? '' : COLORS[k].note}">
      ${hex ? `<span class="h-4 w-4 rounded-full border border-ink/15" style="background:${hex}" aria-hidden="true"></span>` : ''}${l}</button>`).join('');

  const budgets = { all: [0, Infinity], b1: [0, 20000000], b2: [20000000, 30000000], b3: [30000000, Infinity] };
  const budgetSel = $('#f-budget'), sortSel = $('#f-sort'), favBtn = $('#f-fav');

  const filtered = () => {
    let list = DRESSES.filter(d =>
      (state.style === 'all' || d.style === state.style) &&
      (state.color === 'all' || d.color === state.color) &&
      (!state.fav || favs.has(d.id)) &&
      (() => { const [a, b] = budgets[state.budget] || budgets.all; return d.rent > a && d.rent <= b; })());
    const key = state.price;
    if (state.sort === 'cheap') list.sort((a, b) => a[key] - b[key]);
    else if (state.sort === 'lux') list.sort((a, b) => b[key] - a[key]);
    else list.sort((a, b) => (b.isNew - a.isNew) || a.id - b.id);
    return list;
  };

  const syncUI = () => {
    $$('[data-style]').forEach(b => b.setAttribute('aria-pressed', b.dataset.style === state.style));
    $$('[data-color]').forEach(b => b.setAttribute('aria-pressed', b.dataset.color === state.color));
    $$('[data-price]').forEach(b => b.setAttribute('aria-pressed', b.dataset.price === state.price));
    budgetSel.value = state.budget;
    sortSel.value = state.sort;
    favBtn.setAttribute('aria-pressed', state.fav);
    // تعداد فیلترهای فعال روی دکمه موبایل
    const active = ['style', 'color', 'budget'].filter(k => state[k] !== 'all').length + (state.fav ? 1 : 0);
    const badge = $('#filter-badge');
    if (badge) { badge.textContent = fa(active); badge.classList.toggle('hidden', !active); }
    const st = state.style !== 'all' ? STYLES[state.style] : null;
    $('#page-lead').textContent = st ? st.desc : 'از پرنسسی باشکوه تا پوشیده و مینیمال؛ همه با پرو خصوصی و رایگان.';
    $('#page-title').textContent = st ? `لباس عروس ${st.label}` : 'کالکشن لباس عروس سپید';
  };

  const writeUrl = () => {
    const q = new URLSearchParams();
    if (state.style !== 'all') q.set('style', state.style);
    if (state.color !== 'all') q.set('color', state.color);
    if (state.budget !== 'all') q.set('budget', state.budget);
    if (state.price === 'buy') q.set('price', 'buy');
    if (state.sort !== 'new') q.set('sort', state.sort);
    if (state.fav) q.set('fav', '1');
    try { history.replaceState(null, '', `${location.pathname}${q.toString() ? '?' + q : ''}`); } catch (e) { /* بی‌صدا */ }
  };

  let first = true;
  const render = () => {
    syncUI();
    const list = filtered();
    const paint = () => {
      grid.innerHTML = list.map((d, i) => dressCard(d, i, 'grid', state.price)).join('');
      $('#empty').classList.toggle('hidden', list.length > 0);
      $('#result-count').textContent = `${fa(list.length)} لباس`;
      const ap = $('#filters-apply'); if (ap) ap.textContent = `نمایش ${fa(list.length)} لباس`;
      syncFavs();
      window.syncCompare && window.syncCompare();
      grid.style.opacity = '1';
    };
    if (first || reduceMotion) { paint(); first = false; return; }
    grid.style.opacity = '0';
    setTimeout(paint, 280);
    writeUrl();
  };

  document.addEventListener('click', e => {
    const s = e.target.closest('[data-style]'), c = e.target.closest('[data-color]'), p = e.target.closest('[data-price]');
    if (s) { state.style = s.dataset.style; render(); }
    if (c) { state.color = c.dataset.color; render(); }
    if (p) { state.price = p.dataset.price; render(); }
  });
  budgetSel.addEventListener('change', () => { state.budget = budgetSel.value; render(); });
  sortSel.addEventListener('change', () => { state.sort = sortSel.value; render(); });
  favBtn.addEventListener('click', () => { state.fav = !state.fav; render(); });
  $$('[data-reset]').forEach(b => b.addEventListener('click', () => {
    Object.assign(state, { style: 'all', color: 'all', budget: 'all', sort: 'new', fav: false });
    render();
  }));
  // اگر کاربر در حالت «فقط علاقه‌مندی» قلبی را بردارد، لیست به‌روز شود
  document.addEventListener('click', e => { if (state.fav && e.target.closest('[data-fav]')) setTimeout(render, 50); });

  render();

  // کشوی فیلتر در موبایل
  const panel = $('#filters'), openBtn = $('#filters-open');
  const closePanel = () => { panel.classList.add('hidden'); document.body.style.overflow = ''; openBtn.setAttribute('aria-expanded', 'false'); openBtn.focus(); };
  openBtn.addEventListener('click', () => {
    panel.classList.remove('hidden'); document.body.style.overflow = 'hidden';
    openBtn.setAttribute('aria-expanded', 'true');
    Sepid.trapFocus(panel, closePanel); $('#filters-close').focus();
  });
  $('#filters-close').addEventListener('click', closePanel);
  $('#filters-apply').addEventListener('click', closePanel);
  // اگر صفحه از موبایل به دسکتاپ بزرگ شد، قفل اسکرول برداشته شود
  window.matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches) { panel.classList.add('hidden'); document.body.style.overflow = ''; } });

  // ردیف افقی «پرطرفدارترین‌ها»
  const pop = $('#popular-row');
  if (pop) {
    pop.innerHTML = [9, 3, 1, 12, 10, 5, 8, 4].map(id => DRESSES.find(d => d.id === id)).map((d, i) => dressCard(d, i)).join('');
    syncFavs();
    Sepid.initSlider(pop.closest('[data-slider]'));
  }
}

document.addEventListener('DOMContentLoaded', initCollection);
