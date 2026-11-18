/** کانفیگ Tailwind سایت مزون عروس «سپید» — طبق بخش ۹ دستورالعمل */
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ivory: '#F7EFE2', pearl: '#EFE4D2', blush: '#EBD4CB',
        rose: '#C9A39A', gold: { DEFAULT: '#B8975A', deep: '#9A7B43', text: '#7E6232' },
        sage: '#A8B5A0', // ink-soft کمی تیره‌تر شد تا روی pearl هم کنتراست 4.5:1 داشته باشد
        ink: { DEFAULT: '#3B3330', soft: '#6E625D', deep: '#2B2422' },
        line: '#E2D4BF', error: '#B5564B'
      },
      fontFamily: { sans: ['Vazirmatn', 'Tahoma', 'sans-serif'] },
      transitionTimingFunction: { silk: 'cubic-bezier(0.22,1,0.36,1)' },
      boxShadow: {
        silk: '0 20px 60px -20px rgba(184,151,90,0.25)',
        'silk-lg': '0 30px 80px -25px rgba(184,151,90,0.35)'
      }
    }
  }
}
