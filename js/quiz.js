/* آزمون «لباس رؤیایی»: ۴ سؤال تصویری، یک سؤال در هر صفحه، نتیجه شخصی با ۳ لباس پیشنهادی */
'use strict';

const QUIZ = [
  {
    q: 'مراسمت کجا برگزار می‌شود؟',
    opts: [
      { icon: '🏛️', label: 'تالار', hint: 'نور شب و سالن بزرگ', pts: { princess: 2, mermaid: 2, aline: 1 } },
      { icon: '🌿', label: 'باغ', hint: 'درخت، چراغ‌های ریسه‌ای', pts: { aline: 2, boho: 2, minimal: 1 } },
      { icon: '🌅', label: 'فضای باز', hint: 'طبیعت، ساحل یا کوه', pts: { boho: 3, minimal: 1 } }
    ]
  },
  {
    q: 'دوست داری آن روز چه حسی داشته باشی؟',
    key: 'feel',
    opts: [
      { icon: '🌸', label: 'رمانتیک', hint: 'لطیف و پر از تور', feel: 'رمانتیک', pts: { aline: 2, boho: 1, mermaid: 1 } },
      { icon: '✨', label: 'لوکس', hint: 'باشکوه و پرزرق‌وبرق', feel: 'لوکس', pts: { princess: 2, mermaid: 2 } },
      { icon: '🤍', label: 'ساده و شیک', hint: 'کم، اما بی‌نقص', feel: 'ساده و شیک', pts: { minimal: 3, modest: 1 } }
    ]
  },
  {
    q: 'دوست داری لباست کدام را بیشتر نشان دهد؟',
    opts: [
      { icon: '⏳', label: 'قوس اندام و کمر', hint: 'فرم کشیده و تنگ', pts: { mermaid: 3 } },
      { icon: '👑', label: 'بالاتنه و شانه‌ها', hint: 'دامن پف‌دار و آزاد', pts: { princess: 2, aline: 2 } },
      { icon: '🕊️', label: 'پوشش و راحتی', hint: 'آستین‌بلند، یقه بسته', pts: { modest: 4 } },
      { icon: '🌾', label: 'قامت بلند و رها', hint: 'خطوط ساده و روان', pts: { minimal: 2, boho: 2 } }
    ]
  },
  {
    q: 'بودجه‌ات برای اجاره لباس چقدر است؟',
    key: 'budget',
    opts: [
      { icon: '💐', label: 'تا ۲۰ میلیون', hint: 'اقتصادی و شیک', max: 20000000 },
      { icon: '💎', label: '۲۰ تا ۳۰ میلیون', hint: 'محبوب‌ترین بازه', max: 30000000 },
      { icon: '👑', label: 'بیش از ۳۰ میلیون', hint: 'کالکشن ویژه', max: Infinity }
    ]
  }
];

function initQuiz() {
  const root = $('#quiz');
  if (!root) return;
  const stage = $('#quiz-stage', root), bar = $('#quiz-bar', root), stepLbl = $('#quiz-step', root), back = $('#quiz-back', root);
  let step = 0;
  const answers = [];

  const renderQ = () => {
    const item = QUIZ[step];
    bar.style.width = `${(step / QUIZ.length) * 100}%`;
    stepLbl.textContent = `سؤال ${fa(step + 1)} از ${fa(QUIZ.length)}`;
    back.classList.toggle('invisible', step === 0);
    stage.innerHTML = `
      <h3 class="mb-8 text-center text-xl font-bold md:text-2xl" tabindex="-1" id="quiz-q">${item.q}</h3>
      <div class="grid gap-4 ${item.opts.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}">
        ${item.opts.map((o, i) => `
          <button class="quiz-opt" data-opt="${i}" aria-pressed="${answers[step] === i}">
            <span class="grid h-16 w-16 place-items-center rounded-full bg-pearl text-3xl" aria-hidden="true">${o.icon}</span>
            <span class="font-bold">${o.label}</span>
            <span class="text-sm text-ink-soft">${o.hint}</span>
          </button>`).join('')}
      </div>`;
    stage.classList.remove('is-visible');
    requestAnimationFrame(() => stage.classList.add('is-visible'));
  };

  stage.addEventListener('click', e => {
    const b = e.target.closest('[data-opt]');
    if (!b) return;
    answers[step] = +b.dataset.opt;
    $$('[data-opt]', stage).forEach(x => x.setAttribute('aria-pressed', x === b));
    setTimeout(() => {
      step++;
      step < QUIZ.length ? renderQ() : renderResult();
      $('#quiz-q') && $('#quiz-q').focus({ preventScroll: true });
    }, reduceMotion ? 0 : 380);
  });
  back.addEventListener('click', () => { if (step > 0) { step--; renderQ(); } });

  const renderResult = () => {
    bar.style.width = '100%';
    stepLbl.textContent = 'نتیجه آزمون';
    back.classList.add('invisible');

    // جمع امتیاز سبک‌ها
    const score = {};
    QUIZ.forEach((item, i) => Object.entries(item.opts[answers[i]].pts || {}).forEach(([k, v]) => { score[k] = (score[k] || 0) + v; }));
    const ranked = Object.keys(STYLES).sort((a, b) => (score[b] || 0) - (score[a] || 0));
    const top = ranked[0];
    const feel = QUIZ[1].opts[answers[1]].feel;
    const max = QUIZ[3].opts[answers[3]].max;

    // انتخاب ۳ لباس: اول سبک اصلی، بعد سبک دوم، با رعایت بودجه
    const fits = d => d.rent <= max;
    const picks = [];
    // حداقل یک لباس از سبک اصلی، حتی اگر کمی بالاتر از بودجه باشد (تا نتیجه با پیشنهادها هم‌خوان باشد)
    if (!DRESSES.some(d => d.style === top && fits(d))) picks.push(DRESSES.filter(d => d.style === top).sort((a, b) => a.rent - b.rent)[0]);
    for (const s of ranked) {
      DRESSES.filter(d => d.style === s && fits(d)).sort((a, b) => b.rent - a.rent).forEach(d => { if (picks.length < 3 && !picks.includes(d)) picks.push(d); });
      if (picks.length >= 3) break;
    }
    DRESSES.slice().sort((a, b) => a.rent - b.rent).forEach(d => { if (picks.length < 3 && !picks.includes(d)) picks.push(d); });

    stage.innerHTML = `
      <div class="text-center">
        <p class="eyebrow">سبک تو</p>
        <h3 class="text-2xl font-bold md:text-3xl" tabindex="-1" id="quiz-q">سبک تو «${STYLES[top].label} ${feel}» است</h3>
        <p class="lead">${STYLES[top].desc}. این سه لباس را برایت کنار گذاشتیم:</p>
      </div>
      <div class="mt-10 flex flex-wrap justify-center gap-5 [&>article]:w-full sm:[&>article]:w-[46%] lg:[&>article]:w-[30%]">
        ${picks.map(dressCard).join('')}
      </div>
      <div class="mt-10 flex flex-col items-center gap-3">
        <a href="booking.html?dresses=${picks.map(d => d.id).join(',')}" class="btn-gold">این ۳ لباس را در پرو امتحان کن</a>
        <p class="text-sm text-ink-soft">پرو اول رایگان، بدون هیچ تعهدی</p>
        <button id="quiz-restart" class="text-sm font-semibold text-gold-text underline-offset-4 hover:underline">دوباره امتحان کن</button>
      </div>`;
    syncFavs();
    window.syncCompare && window.syncCompare();
    $('#quiz-restart').addEventListener('click', () => { step = 0; answers.length = 0; renderQ(); });
    petals(root);
  };

  renderQ();
}

// باران گلبرگ ملایم برای لحظه نتیجه
function petals(root) {
  if (reduceMotion) return;
  const layer = $('#quiz-petals', root);
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * 0.8}s`;
    p.style.background = Math.random() > 0.5 ? '#EBD4CB' : '#E9D8B8';
    layer.appendChild(p);
    setTimeout(() => p.remove(), 4200);
  }
}

document.addEventListener('DOMContentLoaded', initQuiz);
