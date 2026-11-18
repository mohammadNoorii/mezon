/* داده‌های مزون «سپید» — یک منبع واحد برای کالکشن، آزمون سبک و صفحه جزئیات */
'use strict';

// سبک‌های لباس (کلید = نام فایل عکس style-*.webp)
const STYLES = {
  princess: { label: 'پرنسسی', desc: 'دامن پف‌دار و باشکوه، برای ورود رؤیایی به تالار' },
  mermaid:  { label: 'مارمید', desc: 'تنگ تا زانو و باز در پایین؛ قوس اندام را زیبا نشان می‌دهد' },
  aline:    { label: 'کلوش', desc: 'فرم A ملایم که تقریباً به همه اندام‌ها می‌آید' },
  boho:     { label: 'بوهمیان', desc: 'سبک، رها و پر از تور؛ مخصوص باغ و طبیعت' },
  minimal:  { label: 'مینیمال', desc: 'خطوط ساده و پارچه خوش‌افت؛ شیک بدون شلوغی' },
  modest:   { label: 'پوشیده', desc: 'آستین‌بلند و یقه بسته، با همان ظرافت و شکوه' }
};

// رنگ‌ها با روانشناسی هر کدام (برای فیلتر و متن محصول)
const COLORS = {
  snow:      { label: 'سفید برفی', hex: '#FFFFFF', note: 'برای عروسی که شکوه بی‌زمان می‌خواهد' },
  ivory:     { label: 'آف‌وایت / عاجی', hex: '#F6EFE2', note: 'گرم‌تر و هماهنگ با پوست گندمی' },
  champagne: { label: 'شامپاینی', hex: '#E9D8B8', note: 'مدرن و لوکس؛ مناسب تالار شب و نور زرد' },
  blush:     { label: 'صورتی بلاش', hex: '#EBD4CB', note: 'رمانتیک و جسور؛ برای عکاسی فضای باز' }
};

// ۱۲ لباس کالکشن — قیمت‌ها به تومان
const DRESSES = [
  { id: 1,  name: 'مهتاب',   style: 'princess', color: 'ivory',     rent: 18000000, buy: 68000000,  isNew: true,  fabric: 'ساتن ابریشمی و تور فرانسوی', neckline: 'دلبری', train: 'بلند، ۱۵۰ سانتی‌متر', sizes: '۳۴ تا ۴۴' },
  { id: 2,  name: 'حریر',    style: 'minimal',  color: 'snow',      rent: 19500000, buy: 72000000,  isNew: true,  fabric: 'کرپ ایتالیایی', neckline: 'قایقی', train: 'کوتاه', sizes: '۳۶ تا ۴۶' },
  { id: 3,  name: 'نیلوفر',  style: 'mermaid',  color: 'champagne', rent: 26000000, buy: 95000000,  isNew: true,  fabric: 'تور گیپور و آستر شامپاینی', neckline: 'هفت', train: 'متوسط، ۱۰۰ سانتی‌متر', sizes: '۳۴ تا ۴۲' },
  { id: 4,  name: 'ترمه',    style: 'modest',   color: 'ivory',     rent: 22000000, buy: 84000000,  isNew: true,  fabric: 'میکادو و تور دست‌دوز', neckline: 'یقه بسته', train: 'بلند، ۱۲۰ سانتی‌متر', sizes: '۳۶ تا ۵۰' },
  { id: 5,  name: 'شبنم',    style: 'boho',     color: 'blush',     rent: 18500000, buy: 64000000,  isNew: true,  fabric: 'شیفون و تور گلدار', neckline: 'هفت باز', train: 'کوتاه', sizes: '۳۴ تا ۴۴' },
  { id: 6,  name: 'آوا',     style: 'aline',    color: 'snow',      rent: 21000000, buy: 78000000,  isNew: true,  fabric: 'ارگانزا و تور', neckline: 'دلبری', train: 'متوسط، ۹۰ سانتی‌متر', sizes: '۳۶ تا ۴۸' },
  { id: 7,  name: 'رها',     style: 'boho',     color: 'ivory',     rent: 20000000, buy: 70000000,  isNew: false, fabric: 'تور ماکرامه', neckline: 'آستین افتاده', train: 'کوتاه', sizes: '۳۴ تا ۴۴' },
  { id: 8,  name: 'یاس',     style: 'aline',    color: 'ivory',     rent: 24000000, buy: 88000000,  isNew: false, fabric: 'ساتن مات', neckline: 'یقه گرد', train: 'متوسط، ۱۰۰ سانتی‌متر', sizes: '۳۶ تا ۴۸' },
  { id: 9,  name: 'ستاره',   style: 'princess', color: 'snow',      rent: 34000000, buy: 128000000, isNew: false, fabric: 'تور سنگ‌دوزی شده', neckline: 'دکلته', train: 'سلطنتی، ۲۵۰ سانتی‌متر', sizes: '۳۴ تا ۴۴' },
  { id: 10, name: 'پرنیان',  style: 'mermaid',  color: 'ivory',     rent: 31000000, buy: 115000000, isNew: false, fabric: 'کرپ و تور دانتل', neckline: 'یقه خشتی', train: 'بلند، ۱۵۰ سانتی‌متر', sizes: '۳۴ تا ۴۲' },
  { id: 11, name: 'آیلین',   style: 'minimal',  color: 'champagne', rent: 23000000, buy: 82000000,  isNew: false, fabric: 'ساتن براق', neckline: 'یقه‌دار ظریف', train: 'متوسط، ۸۰ سانتی‌متر', sizes: '۳۶ تا ۴۶' },
  { id: 12, name: 'مروارید', style: 'modest',   color: 'snow',      rent: 28000000, buy: 105000000, isNew: false, fabric: 'تور مرواریددوزی و آستر ساتن', neckline: 'یقه بسته', train: 'بلند، ۱۸۰ سانتی‌متر', sizes: '۳۶ تا ۵۲' }
].map(d => ({
  ...d,
  img: `images/dress-${String(d.id).padStart(2, '0')}.webp`,
  imgB: `images/dress-${String(d.id).padStart(2, '0')}-b.webp`,
  alt: `لباس عروس ${STYLES[d.style].label} «${d.name}» به رنگ ${COLORS[d.color].label}`
}));
