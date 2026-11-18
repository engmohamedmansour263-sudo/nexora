'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { isCalculatorInputValid, type CalculatorDefinition } from '@/lib/calculators';
import { localizedCalculator } from '@/lib/calculator-translations';
import { ArrowLeft, Check, Copy, RotateCcw, Share2 } from 'lucide-react';

const ui: Record<string, Record<string,string>> = {
 en:{all:'All calculators',reset:'Reset values',results:'Your results',copy:'Copy results',estimate:'Results are estimates for general information. Verify important calculations independently.',invalid:'Enter valid values to calculate your result.',copied:'Copied',share:'Share results'},
 ar:{all:'كل الحاسبات',reset:'إعادة ضبط القيم',results:'النتائج',copy:'نسخ النتائج',estimate:'النتائج تقديرية وللمعلومات العامة. تحقق بشكل مستقل من الحسابات المهمة.',invalid:'أدخل قيمًا صحيحة لعرض النتيجة.',copied:'تم النسخ',share:'مشاركة النتائج'},
 hi:{all:'सभी कैलकुलेटर',reset:'मान रीसेट करें',results:'आपके परिणाम',copy:'परिणाम कॉपी करें',estimate:'परिणाम अनुमानित हैं। महत्वपूर्ण गणनाओं की स्वतंत्र रूप से जाँच करें।',invalid:'मान्य मान दर्ज करें।',copied:'कॉपी किया गया',share:'परिणाम साझा करें'},
 bn:{all:'সব ক্যালকুলেটর',reset:'মান রিসেট করুন',results:'আপনার ফলাফল',copy:'ফলাফল কপি করুন',estimate:'ফলাফল আনুমানিক। গুরুত্বপূর্ণ হিসাব যাচাই করুন।',invalid:'সঠিক মান দিন।',copied:'কপি হয়েছে',share:'ফলাফল শেয়ার করুন'},
 es:{all:'Todas las calculadoras',reset:'Restablecer valores',results:'Tus resultados',copy:'Copiar resultados',estimate:'Los resultados son estimaciones informativas. Verifica los cálculos importantes.',invalid:'Introduce valores válidos.',copied:'Copiado',share:'Compartir resultados'},
 pt:{all:'Todas as calculadoras',reset:'Redefinir valores',results:'Seus resultados',copy:'Copiar resultados',estimate:'Os resultados são estimativas informativas. Verifique os cálculos importantes.',invalid:'Insira valores válidos.',copied:'Copiado',share:'Compartilhar resultados'}
};
const fieldLabels: Record<string,Record<string,string>> = {
 ar:{value:'القيمة',percent:'النسبة المئوية',old:'القيمة الأصلية',next:'القيمة الجديدة',a:'القيمة أ',b:'القيمة ب',c:'القيمة ج / درجة الحرارة',numerator:'البسط',denominator:'المقام',base:'القاعدة',height:'الارتفاع',radius:'نصف القطر',length:'الطول',width:'العرض',weight:'الوزن',age:'العمر',sex:'معامل الجنس',distance:'المسافة',minutes:'الوقت بالدقائق',cost:'التكلفة',price:'السعر',markup:'نسبة الزيادة',discount:'الخصم',amount:'المبلغ',tax:'معدل الضريبة',fixed:'التكاليف الثابتة',variable:'التكلفة المتغيرة للوحدة',hours:'الساعات',rate:'الأجر بالساعة',principal:'المبلغ الابتدائي',years:'السنوات',periods:'مرات التركيب سنويًا',quantity:'الكمية',meters:'الطول',kg:'الوزن',mb:'حجم البيانات',size:'حجم الملف',speed:'سرعة التنزيل',weeks:'الأسابيع',days:'الأيام الإضافية',efficiency:'استهلاك الوقود',area:'مساحة الجدار',coverage:'التغطية لكل لتر',coats:'عدد الطبقات',waste:'نسبة الهدر',earned:'النقاط المحصلة',total:'إجمالي النقاط'},
 es:{value:'Valor',percent:'Porcentaje',old:'Valor original',next:'Valor nuevo',numerator:'Numerador',denominator:'Denominador',height:'Altura',radius:'Radio',length:'Longitud',width:'Ancho',weight:'Peso',age:'Edad',distance:'Distancia',cost:'Costo',price:'Precio',discount:'Descuento',amount:'Importe',tax:'Tasa de impuesto',hours:'Horas',rate:'Tarifa por hora',years:'Años',quantity:'Cantidad',speed:'Velocidad de descarga',weeks:'Semanas',days:'Días adicionales',area:'Área de pared',earned:'Puntos obtenidos',total:'Puntos totales'},
 pt:{value:'Valor',percent:'Porcentagem',old:'Valor original',next:'Novo valor',numerator:'Numerador',denominator:'Denominador',height:'Altura',radius:'Raio',length:'Comprimento',width:'Largura',weight:'Peso',age:'Idade',distance:'Distância',cost:'Custo',price:'Preço',discount:'Desconto',amount:'Valor',tax:'Taxa de imposto',hours:'Horas',rate:'Valor por hora',years:'Anos',quantity:'Quantidade',speed:'Velocidade de download',weeks:'Semanas',days:'Dias extras',area:'Área da parede',earned:'Pontos obtidos',total:'Pontos totais'},
 hi:{value:'मान',percent:'प्रतिशत',old:'पुराना मान',next:'नया मान',numerator:'अंश',denominator:'हर',height:'ऊँचाई',radius:'त्रिज्या',length:'लंबाई',width:'चौड़ाई',weight:'वज़न',age:'आयु',distance:'दूरी',cost:'लागत',price:'कीमत',discount:'छूट',amount:'राशि',tax:'कर दर',hours:'घंटे',rate:'प्रति घंटे की दर',years:'वर्ष',quantity:'मात्रा',weeks:'सप्ताह',days:'अतिरिक्त दिन',area:'दीवार का क्षेत्रफल',earned:'प्राप्त अंक',total:'कुल अंक'},
 bn:{value:'মান',percent:'শতাংশ',old:'পুরোনো মান',next:'নতুন মান',numerator:'লব',denominator:'হর',height:'উচ্চতা',radius:'ব্যাসার্ধ',length:'দৈর্ঘ্য',width:'প্রস্থ',weight:'ওজন',age:'বয়স',distance:'দূরত্ব',cost:'খরচ',price:'দাম',discount:'ছাড়',amount:'পরিমাণ',tax:'কর হার',hours:'ঘণ্টা',rate:'প্রতি ঘণ্টার হার',years:'বছর',quantity:'পরিমাণ',weeks:'সপ্তাহ',days:'অতিরিক্ত দিন',area:'দেয়ালের ক্ষেত্রফল',earned:'প্রাপ্ত নম্বর',total:'মোট নম্বর'}
};
const resultLabels: Record<string,Record<string,string>> = {
 en:{Result:'Result',Change:'Change',Average:'Average',Decimal:'Decimal',Area:'Area',Circumference:'Circumference',Perimeter:'Perimeter',Hypotenuse:'Hypotenuse',BMI:'BMI','Estimated BMR':'Estimated BMR','Daily target':'Daily target',Pace:'Pace',Profit:'Profit',Margin:'Margin','Selling price':'Selling price','You save':'You save','Final price':'Final price','Tax amount':'Tax amount',Total:'Total','Break-even units':'Break-even units','Gross pay':'Gross pay','Future value':'Future value',Feet:'Feet',Inches:'Inches',Pounds:'Pounds',Ounces:'Ounces',Fahrenheit:'Fahrenheit',Kelvin:'Kelvin',Bytes:'Bytes',Minutes:'Minutes',Seconds:'Seconds',Grade:'Grade','Price per unit':'Price per unit','Estimated fuel cost':'Estimated fuel cost','Average speed':'Average speed','Paint required':'Paint required','Material to buy':'Material to buy','Total duration':'Total duration','Estimated time':'Estimated time','Gigabytes (decimal)':'Gigabytes (decimal)'},
 hi:{Result:'परिणाम',Change:'परिवर्तन',Average:'औसत',Decimal:'दशमलव',Area:'क्षेत्रफल',Circumference:'परिधि',Perimeter:'परिमाप',Hypotenuse:'कर्ण',BMI:'BMI','Estimated BMR':'अनुमानित BMR','Daily target':'दैनिक लक्ष्य',Pace:'गति',Profit:'लाभ',Margin:'मार्जिन','Selling price':'विक्रय मूल्य','You save':'आपकी बचत','Final price':'अंतिम कीमत','Tax amount':'कर राशि',Total:'कुल','Break-even units':'ब्रेक-ईवन इकाइयाँ','Gross pay':'कुल वेतन','Future value':'भविष्य का मूल्य','Price per unit':'प्रति इकाई कीमत',Feet:'फीट',Inches:'इंच',Pounds:'पाउंड',Ounces:'औंस',Fahrenheit:'फ़ारेनहाइट',Kelvin:'केल्विन',Bytes:'बाइट',Minutes:'मिनट',Seconds:'सेकंड',Grade:'ग्रेड','Estimated fuel cost':'अनुमानित ईंधन लागत','Average speed':'औसत गति','Paint required':'आवश्यक पेंट','Material to buy':'खरीदने की सामग्री','Total duration':'कुल अवधि','Estimated time':'अनुमानित समय'},
 bn:{Result:'ফলাফল',Change:'পরিবর্তন',Average:'গড়',Decimal:'দশমিক',Area:'ক্ষেত্রফল',Circumference:'পরিধি',Perimeter:'পরিসীমা',Hypotenuse:'অতিভুজ',BMI:'BMI','Estimated BMR':'আনুমানিক BMR','Daily target':'দৈনিক লক্ষ্য',Pace:'গতি',Profit:'লাভ',Margin:'মার্জিন','Selling price':'বিক্রয়মূল্য','You save':'আপনার সাশ্রয়','Final price':'চূড়ান্ত মূল্য','Tax amount':'করের পরিমাণ',Total:'মোট','Break-even units':'ব্রেক-ইভেন ইউনিট','Gross pay':'মোট বেতন','Future value':'ভবিষ্যৎ মূল্য','Price per unit':'প্রতি ইউনিটের মূল্য',Feet:'ফুট',Inches:'ইঞ্চি',Pounds:'পাউন্ড',Ounces:'আউন্স',Fahrenheit:'ফারেনহাইট',Kelvin:'কেলভিন',Bytes:'বাইট',Minutes:'মিনিট',Seconds:'সেকেন্ড',Grade:'গ্রেড','Estimated fuel cost':'আনুমানিক জ্বালানি খরচ','Average speed':'গড় গতি','Paint required':'প্রয়োজনীয় রং','Material to buy':'কেনার উপকরণ','Total duration':'মোট সময়কাল','Estimated time':'আনুমানিক সময়'},
 ar:{Result:'النتيجة',Change:'التغير',Average:'المتوسط',Decimal:'العدد العشري',Area:'المساحة',Circumference:'المحيط',Perimeter:'المحيط',Hypotenuse:'الوتر',BMI:'مؤشر كتلة الجسم','Estimated BMR':'معدل الأيض الأساسي التقديري','Daily target':'الاحتياج اليومي',Pace:'الوتيرة',Profit:'الربح',Margin:'هامش الربح','Selling price':'سعر البيع','You save':'قيمة التوفير','Final price':'السعر النهائي','Tax amount':'قيمة الضريبة',Total:'الإجمالي','Break-even units':'وحدات التعادل','Gross pay':'إجمالي الأجر','Future value':'القيمة المستقبلية','Price per unit':'السعر لكل وحدة',Feet:'قدم',Inches:'بوصة',Pounds:'رطل',Ounces:'أونصة',Fahrenheit:'فهرنهايت',Kelvin:'كلفن',Bytes:'بايت',Minutes:'دقائق',Seconds:'ثوانٍ',Grade:'الدرجة'},
 es:{Result:'Resultado',Change:'Cambio',Average:'Promedio',Decimal:'Decimal',Area:'Área',Circumference:'Circunferencia',Perimeter:'Perímetro',Hypotenuse:'Hipotenusa',BMI:'IMC',Profit:'Beneficio',Margin:'Margen',Total:'Total',Feet:'Pies',Inches:'Pulgadas',Pounds:'Libras',Ounces:'Onzas',Minutes:'Minutos',Seconds:'Segundos',Grade:'Calificación'},
 pt:{Result:'Resultado',Change:'Variação',Average:'Média',Decimal:'Decimal',Area:'Área',Circumference:'Circunferência',Perimeter:'Perímetro',Hypotenuse:'Hipotenusa',BMI:'IMC',Profit:'Lucro',Margin:'Margem',Total:'Total',Feet:'Pés',Inches:'Polegadas',Pounds:'Libras',Ounces:'Onças',Minutes:'Minutos',Seconds:'Segundos',Grade:'Nota'}
};

// Complete result-label coverage for every supported locale.
Object.assign(resultLabels.ar, {
  'Estimated fuel cost':'تكلفة الوقود التقديرية','Average speed':'متوسط السرعة','Paint required':'كمية الطلاء المطلوبة',
  'Material to buy':'كمية المواد المطلوبة','Total duration':'المدة الإجمالية','Estimated time':'الوقت التقديري',
  'Gigabytes (decimal)':'جيجابايت (نظام عشري)'
});
Object.assign(resultLabels.es, {
  'Estimated BMR':'Tasa metabólica basal estimada','Daily target':'Objetivo diario','Pace':'Ritmo','Selling price':'Precio de venta',
  'You save':'Ahorras','Final price':'Precio final','Tax amount':'Importe del impuesto','Break-even units':'Unidades de equilibrio',
  'Gross pay':'Salario bruto','Future value':'Valor futuro','Fahrenheit':'Fahrenheit','Kelvin':'Kelvin','Bytes':'Bytes',
  'Price per unit':'Precio por unidad','Estimated fuel cost':'Coste estimado de combustible','Average speed':'Velocidad media',
  'Paint required':'Pintura necesaria','Material to buy':'Material necesario','Total duration':'Duración total',
  'Estimated time':'Tiempo estimado','Gigabytes (decimal)':'Gigabytes (decimal)'
});
Object.assign(resultLabels.pt, {
  'Estimated BMR':'Taxa metabólica basal estimada','Daily target':'Meta diária','Pace':'Ritmo','Selling price':'Preço de venda',
  'You save':'Você economiza','Final price':'Preço final','Tax amount':'Valor do imposto','Break-even units':'Unidades de equilíbrio',
  'Gross pay':'Salário bruto','Future value':'Valor futuro','Fahrenheit':'Fahrenheit','Kelvin':'Kelvin','Bytes':'Bytes',
  'Price per unit':'Preço por unidade','Estimated fuel cost':'Custo estimado de combustível','Average speed':'Velocidade média',
  'Paint required':'Tinta necessária','Material to buy':'Material a comprar','Total duration':'Duração total',
  'Estimated time':'Tempo estimado','Gigabytes (decimal)':'Gigabytes (decimal)'
});
const categoryLabels: Record<string,Record<string,string>> = {
 ar:{Math:'الرياضيات',Health:'الصحة واللياقة',Business:'الأعمال والمال',Conversions:'تحويل الوحدات',Technology:'التقنية',Time:'الوقت والتاريخ',Travel:'السفر','Home & Build':'المنزل والبناء',Education:'التعليم'},
 hi:{Math:'गणित',Health:'स्वास्थ्य',Business:'व्यवसाय',Conversions:'रूपांतरण',Technology:'तकनीक',Time:'समय',Travel:'यात्रा','Home & Build':'घर और निर्माण',Education:'शिक्षा'},
 bn:{Math:'গণিত',Health:'স্বাস্থ্য',Business:'ব্যবসা',Conversions:'রূপান্তর',Technology:'প্রযুক্তি',Time:'সময়',Travel:'ভ্রমণ','Home & Build':'বাড়ি ও নির্মাণ',Education:'শিক্ষা'},
 es:{Math:'Matemáticas',Health:'Salud',Business:'Negocios',Conversions:'Conversiones',Technology:'Tecnología',Time:'Tiempo',Travel:'Viajes','Home & Build':'Hogar y construcción',Education:'Educación'},
 pt:{Math:'Matemática',Health:'Saúde',Business:'Negócios',Conversions:'Conversões',Technology:'Tecnologia',Time:'Tempo',Travel:'Viagem','Home & Build':'Casa e construção',Education:'Educação'}
};

const completeFieldLabels: Record<string,Record<string,string>> = {
  "en": {
    "value": "Value",
    "percent": "Percentage",
    "old": "Original value",
    "next": "New value",
    "a": "Side / value A",
    "b": "Side / value B",
    "c": "Value C / Temperature",
    "numerator": "Numerator",
    "denominator": "Denominator",
    "base": "Base",
    "height": "Height",
    "radius": "Radius",
    "length": "Length",
    "width": "Width",
    "weight": "Weight",
    "age": "Age",
    "sex": "Sex factor (male 5 / female -161)",
    "distance": "Distance",
    "minutes": "Time in minutes",
    "cost": "Cost",
    "price": "Price",
    "markup": "Markup",
    "discount": "Discount",
    "amount": "Amount",
    "tax": "Tax rate",
    "fixed": "Fixed costs",
    "variable": "Variable cost per unit",
    "hours": "Hours",
    "rate": "Hourly rate",
    "principal": "Starting amount",
    "years": "Years",
    "periods": "Compounds per year",
    "quantity": "Quantity",
    "meters": "Length",
    "kg": "Weight",
    "mb": "Data size",
    "size": "File size",
    "speed": "Download speed",
    "weeks": "Weeks",
    "days": "Extra days",
    "efficiency": "Fuel use",
    "area": "Wall area",
    "coverage": "Coverage per litre",
    "coats": "Number of coats",
    "waste": "Extra allowance",
    "earned": "Points earned",
    "total": "Total points"
  },
  "es": {
    "a": "Valor A",
    "b": "Valor B",
    "c": "Valor C / Temperatura",
    "base": "Base",
    "sex": "Factor de sexo",
    "minutes": "Tiempo en minutos",
    "markup": "Recargo",
    "fixed": "Costes fijos",
    "variable": "Coste variable por unidad",
    "principal": "Importe inicial",
    "periods": "Capitalizaciones por año",
    "meters": "Longitud",
    "kg": "Peso",
    "mb": "Tamaño de datos",
    "size": "Tamaño del archivo",
    "efficiency": "Consumo de combustible",
    "coverage": "Cobertura por litro",
    "coats": "Número de capas",
    "waste": "Margen adicional"
  },
  "pt": {
    "a": "Valor A",
    "b": "Valor B",
    "c": "Valor C / Temperatura",
    "base": "Base",
    "sex": "Fator de sexo",
    "minutes": "Tempo em minutos",
    "markup": "Acréscimo",
    "fixed": "Custos fixos",
    "variable": "Custo variável por unidade",
    "principal": "Valor inicial",
    "periods": "Capitalizações por ano",
    "meters": "Comprimento",
    "kg": "Peso",
    "mb": "Tamanho dos dados",
    "size": "Tamanho do arquivo",
    "efficiency": "Consumo de combustível",
    "coverage": "Cobertura por litro",
    "coats": "Número de demãos",
    "waste": "Margem extra"
  },
  "hi": {
    "a": "मान A",
    "b": "मान B",
    "c": "मान C / तापमान",
    "base": "आधार",
    "sex": "लिंग गुणांक",
    "minutes": "समय मिनट में",
    "markup": "मार्कअप",
    "fixed": "निश्चित लागत",
    "variable": "प्रति इकाई परिवर्तनीय लागत",
    "principal": "प्रारंभिक राशि",
    "periods": "प्रति वर्ष चक्रवृद्धि अवधि",
    "meters": "लंबाई",
    "kg": "वज़न",
    "mb": "डेटा आकार",
    "size": "फ़ाइल आकार",
    "efficiency": "ईंधन खपत",
    "coverage": "प्रति लीटर कवरेज",
    "coats": "परतों की संख्या",
    "waste": "अतिरिक्त मात्रा"
  },
  "bn": {
    "a": "মান A",
    "b": "মান B",
    "c": "মান C / তাপমাত্রা",
    "base": "ভূমি",
    "sex": "লিঙ্গের গুণক",
    "minutes": "সময় (মিনিট)",
    "markup": "মার্কআপ",
    "fixed": "স্থায়ী খরচ",
    "variable": "প্রতি ইউনিট পরিবর্তনশীল খরচ",
    "principal": "প্রাথমিক পরিমাণ",
    "periods": "প্রতি বছরে চক্রবৃদ্ধির সংখ্যা",
    "meters": "দৈর্ঘ্য",
    "kg": "ওজন",
    "mb": "ডেটার আকার",
    "size": "ফাইলের আকার",
    "efficiency": "জ্বালানি ব্যবহার",
    "coverage": "প্রতি লিটারে কভারেজ",
    "coats": "প্রলেপের সংখ্যা",
    "waste": "অতিরিক্ত পরিমাণ"
  },
  "ar": {
    "a": "القيمة أ",
    "b": "القيمة ب",
    "c": "القيمة ج / درجة الحرارة",
    "base": "القاعدة",
    "sex": "معامل الجنس (ذكر 5 / أنثى -161)",
    "minutes": "الوقت بالدقائق",
    "markup": "نسبة الزيادة",
    "fixed": "التكاليف الثابتة",
    "variable": "التكلفة المتغيرة للوحدة",
    "principal": "المبلغ الابتدائي",
    "periods": "مرات التركيب سنويًا",
    "meters": "الطول",
    "kg": "الوزن",
    "mb": "حجم البيانات",
    "size": "حجم الملف",
    "efficiency": "استهلاك الوقود",
    "coverage": "التغطية لكل لتر",
    "coats": "عدد الطبقات",
    "waste": "نسبة الهدر"
  }
};

export default function CalculatorForm({calculator,locale}:{calculator:CalculatorDefinition;locale:string}) {
 const initial=useMemo(()=>Object.fromEntries(calculator.fields.map(f=>[f.key,f.initial])),[calculator]);
 const [values,setValues]=useState<Record<string,number>>(initial); const [notice,setNotice]=useState('');
 const t=ui[locale]??ui.en; const rtl=locale==='ar'; const localized=localizedCalculator(calculator,locale); const labels={...completeFieldLabels[locale],...fieldLabels[locale]};
 const valid=isCalculatorInputValid(calculator,values);
 const results=valid?calculator.calculate(values):[]; const fmt=(n:number)=>new Intl.NumberFormat(locale,{maximumFractionDigits:2}).format(n);
 const text=results.map(r=>`${resultLabels[locale]?.[r.label]??r.label}: ${fmt(r.value)} ${r.unit??''}`).join('\n');
 async function copy(){try{await navigator.clipboard.writeText(text);setNotice(t.copied)}catch{setNotice('')}}
 async function share(){if(navigator.share){try{await navigator.share({title:localized.name,text,url:window.location.href})}catch{/* cancelled */}}else await copy()}
 return <div dir={rtl?'rtl':'ltr'} className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_.9fr]">
  <section className="rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8"><Link href={`/${locale}/calculators`} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} className={rtl?'rotate-180':''}/>{t.all}</Link>
   <div className="mt-7 text-xs font-semibold uppercase tracking-[.18em] text-violet-300">{categoryLabels[locale]?.[calculator.category]??calculator.category}</div><h1 className="mt-3 text-3xl font-semibold">{localized.name}</h1><p className="mt-3 leading-7 text-zinc-400">{localized.description}</p>
   <div className="mt-8 space-y-5">{calculator.fields.map(f=><label key={f.key} className="block"><span className="mb-2 flex justify-between gap-3 text-sm text-zinc-300"><span>{labels[f.key]??f.label}</span>{f.unit&&<span className="text-zinc-500">{f.unit}</span>}</span><input type="number" inputMode="decimal" min={f.min} step={f.step??'any'} value={Number.isNaN(values[f.key])?'':values[f.key]} onChange={e=>{setValues(v=>({...v,[f.key]:e.target.value===''?Number.NaN:Number(e.target.value)}));setNotice('')}} aria-label={labels[f.key]??f.label} className="w-full rounded-xl border border-white/10 bg-[#101116] px-4 py-3 text-base outline-none transition focus:border-violet-400"/></label>)}</div>
   <button type="button" onClick={()=>{setValues(initial);setNotice('')}} className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:border-white/30"><RotateCcw size={15}/>{t.reset}</button>
  </section>
  <aside aria-live="polite" className="h-fit rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-[#181a23] p-6 sm:p-8 lg:sticky lg:top-8"><div className="text-sm font-medium text-violet-200">{t.results}</div>
   {!valid?<p className="mt-6 text-sm leading-6 text-amber-200">{t.invalid}</p>:<div className="mt-6 space-y-5">{results.map(r=><div key={r.label} className="border-b border-white/10 pb-5 last:border-0"><div className="text-sm text-zinc-400">{resultLabels[locale]?.[r.label]??r.label}</div><div className="mt-2 break-words text-3xl font-semibold tabular-nums">{fmt(r.value)} <span className="text-base font-normal text-zinc-400">{r.unit}</span></div></div>)}</div>}
   <p className="mt-5 text-xs leading-5 text-zinc-500">{t.estimate}</p><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={copy} disabled={!valid} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:border-violet-300/50 disabled:opacity-40"><Copy size={14}/>{t.copy}</button><button type="button" onClick={share} disabled={!valid} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-200 hover:border-violet-300/50 disabled:opacity-40"><Share2 size={14}/>{t.share}</button></div>{notice&&<p className="mt-3 flex items-center gap-2 text-xs text-emerald-300"><Check size={14}/>{notice}</p>}
  </aside>
 </div>;
}
