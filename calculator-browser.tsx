'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpRight, Calculator } from 'lucide-react';
import { calculators, categories } from '@/lib/calculators';
import { localizedCalculator } from '@/lib/calculator-translations';

const copy: Record<string, {
  search: string; all: string; empty: string; showing: string; of: string;
  category: Record<string, string>;
}> = {
  en: { search: 'Search calculators by name or category…', all: 'All', empty: 'No calculators found. Try another search.', showing: 'Showing', of: 'of', category: { Math: 'Math', Health: 'Health', Business: 'Business', Conversions: 'Conversions', Technology: 'Technology', Time: 'Time', Travel: 'Travel', 'Home & Build': 'Home & Build', Education: 'Education' } },
  ar: { search: 'ابحث عن حاسبة بالاسم أو المجال…', all: 'الكل', empty: 'لم نعثر على حاسبات. جرّب عبارة بحث أخرى.', showing: 'عرض', of: 'من', category: { Math: 'الرياضيات', Health: 'الصحة واللياقة', Business: 'الأعمال والمال', Conversions: 'تحويل الوحدات', Technology: 'التقنية', Time: 'الوقت والتاريخ', Travel: 'السفر', 'Home & Build': 'المنزل والبناء', Education: 'التعليم' } },
  hi: { search: 'नाम या श्रेणी से कैलकुलेटर खोजें…', all: 'सभी', empty: 'कोई कैलकुलेटर नहीं मिला। फिर से खोजें।', showing: 'दिखाए जा रहे हैं', of: 'में से', category: { Math: 'गणित', Health: 'स्वास्थ्य', Business: 'व्यवसाय', Conversions: 'रूपांतरण', Technology: 'तकनीक', Time: 'समय', Travel: 'यात्रा', 'Home & Build': 'घर और निर्माण', Education: 'शिक्षा' } },
  bn: { search: 'নাম বা বিভাগ দিয়ে ক্যালকুলেটর খুঁজুন…', all: 'সব', empty: 'কোনো ক্যালকুলেটর পাওয়া যায়নি। আবার খুঁজুন।', showing: 'দেখানো হচ্ছে', of: 'এর মধ্যে', category: { Math: 'গণিত', Health: 'স্বাস্থ্য', Business: 'ব্যবসা', Conversions: 'রূপান্তর', Technology: 'প্রযুক্তি', Time: 'সময়', Travel: 'ভ্রমণ', 'Home & Build': 'বাড়ি ও নির্মাণ', Education: 'শিক্ষা' } },
  es: { search: 'Buscar calculadoras por nombre o categoría…', all: 'Todas', empty: 'No se encontraron calculadoras. Prueba otra búsqueda.', showing: 'Mostrando', of: 'de', category: { Math: 'Matemáticas', Health: 'Salud', Business: 'Negocios', Conversions: 'Conversiones', Technology: 'Tecnología', Time: 'Tiempo', Travel: 'Viajes', 'Home & Build': 'Hogar y construcción', Education: 'Educación' } },
  pt: { search: 'Pesquisar calculadoras por nome ou categoria…', all: 'Todas', empty: 'Nenhuma calculadora encontrada. Tente outra busca.', showing: 'Exibindo', of: 'de', category: { Math: 'Matemática', Health: 'Saúde', Business: 'Negócios', Conversions: 'Conversões', Technology: 'Tecnologia', Time: 'Tempo', Travel: 'Viagem', 'Home & Build': 'Casa e construção', Education: 'Educação' } },
};

export default function CalculatorBrowser({ locale, initialQuery = '', initialCategory = 'All' }: { locale: string; initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : 'All');
  const t = copy[locale] ?? copy.en;
  const isRtl = locale === 'ar';
  const localized = useMemo(() => calculators.map((calculator) => localizedCalculator(calculator, locale)), [locale]);
  const filtered = useMemo(() => localized.filter((calculator) =>
    (category === 'All' || calculator.category === category) &&
    `${calculator.name} ${calculator.description} ${calculator.category}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale))
  ), [query, category, localized, locale]);

  return <section dir={isRtl ? 'rtl' : 'ltr'} aria-label={locale === 'ar' ? 'كتالوج الحاسبات' : 'Calculator catalog'}>
    <div className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 focus-within:border-violet-400/60">
      <Search size={19} aria-hidden="true" className="shrink-0 text-zinc-500" />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} aria-label={t.search} className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600" />
      {query && <button type="button" onClick={() => setQuery('')} className="text-xs text-violet-300 hover:text-white">×</button>}
    </div>
    <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter calculators by category">
      {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs transition ${category === item ? 'border-violet-400 bg-violet-500/20 text-violet-200' : 'border-white/10 text-zinc-400 hover:border-white/30'}`}>
        {item === 'All' ? t.all : (t.category[item] ?? item)}
      </button>)}
    </div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((calculator) => <Link key={calculator.slug} href={`/${locale}/calculators/${calculator.slug}`} className="group rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-1 hover:border-violet-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400">
        <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300"><Calculator size={19} /></span><ArrowUpRight size={17} aria-hidden="true" className="text-zinc-600 group-hover:text-violet-300" /></div>
        <div className="mt-5 text-base font-semibold">{calculator.name}</div>
        <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">{calculator.description}</p>
        <div className="mt-4 text-xs text-violet-300">{t.category[calculator.category] ?? calculator.category}</div>
      </Link>)}
    </div>
    {filtered.length === 0 && <p className="py-16 text-center text-zinc-500" role="status">{t.empty}</p>}
    <p className="mt-6 text-xs text-zinc-500" aria-live="polite">{t.showing} {filtered.length} {t.of} {calculators.length}</p>
  </section>;
}
