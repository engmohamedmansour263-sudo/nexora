import type { CalculatorDefinition } from "@/lib/calculators";

const translations = {
  "ar": {
    "percentage": {
      "name": "حاسبة النسبة المئوية",
      "description": "احسب نسبة من قيمة أو قارن بين قيمتين."
    },
    "percentage-change": {
      "name": "التغير المئوي",
      "description": "احسب مقدار الزيادة أو الانخفاض بين قيمتين."
    },
    "average": {
      "name": "حاسبة المتوسط",
      "description": "احسب المتوسط الحسابي لثلاث قيم."
    },
    "fraction-to-decimal": {
      "name": "تحويل الكسر إلى عدد عشري",
      "description": "حوّل الكسر إلى قيمة عشرية."
    },
    "triangle-area": {
      "name": "مساحة المثلث",
      "description": "احسب مساحة المثلث باستخدام القاعدة والارتفاع."
    },
    "circle": {
      "name": "حاسبة الدائرة",
      "description": "احسب مساحة الدائرة ومحيطها."
    },
    "rectangle": {
      "name": "حاسبة المستطيل",
      "description": "احسب مساحة المستطيل ومحيطه."
    },
    "pythagorean": {
      "name": "نظرية فيثاغورس",
      "description": "احسب طول الوتر في مثلث قائم الزاوية."
    },
    "bmi": {
      "name": "حاسبة مؤشر كتلة الجسم",
      "description": "قدّر مؤشر كتلة الجسم من الوزن والطول."
    },
    "calorie-estimate": {
      "name": "تقدير السعرات اليومية",
      "description": "قدّر معدل الأيض الأساسي باستخدام معادلة مبسطة."
    },
    "water-intake": {
      "name": "احتياج الماء اليومي",
      "description": "قدّر كمية الماء اليومية بناءً على وزن الجسم."
    },
    "pace": {
      "name": "حاسبة وتيرة الجري",
      "description": "احسب الزمن لكل كيلومتر من المسافة والوقت."
    },
    "profit-margin": {
      "name": "هامش الربح",
      "description": "احسب الربح وهامش الربح من التكلفة وسعر البيع."
    },
    "markup": {
      "name": "حاسبة نسبة الزيادة",
      "description": "احسب سعر البيع بناءً على التكلفة ونسبة الزيادة."
    },
    "discount": {
      "name": "حاسبة الخصم",
      "description": "احسب السعر النهائي بعد تطبيق الخصم."
    },
    "sales-tax": {
      "name": "حاسبة ضريبة المبيعات",
      "description": "أضف الضريبة إلى المبلغ قبل الضريبة."
    },
    "break-even": {
      "name": "وحدات نقطة التعادل",
      "description": "قدّر عدد الوحدات اللازمة لتغطية التكاليف الثابتة."
    },
    "hourly-pay": {
      "name": "حاسبة الأجر بالساعة",
      "description": "احسب إجمالي الأجر من ساعات العمل ومعدل الساعة."
    },
    "compound-growth": {
      "name": "النمو المركب",
      "description": "قدّر النمو المستقبلي مع التركيب الدوري."
    },
    "unit-price": {
      "name": "مقارنة سعر الوحدة",
      "description": "قارن تكلفة الوحدة بين المنتجات."
    },
    "length-converter": {
      "name": "محول الطول",
      "description": "حوّل الأمتار إلى أقدام وبوصات."
    },
    "weight-converter": {
      "name": "محول الوزن",
      "description": "حوّل الكيلوغرامات إلى أرطال وأونصات."
    },
    "temperature": {
      "name": "محول درجة الحرارة",
      "description": "حوّل الدرجة المئوية إلى فهرنهايت وكلفن."
    },
    "data-storage": {
      "name": "محول سعة البيانات",
      "description": "حوّل الميغابايت إلى غيغابايت وبايت."
    },
    "download-time": {
      "name": "وقت التنزيل",
      "description": "قدّر مدة تنزيل ملف حسب حجمه وسرعة الاتصال."
    },
    "date-difference": {
      "name": "حاسبة مدة التاريخ",
      "description": "احسب عدد الأيام من الأسابيع والأيام."
    },
    "time-converter": {
      "name": "محول الوقت",
      "description": "حوّل الساعات إلى دقائق وثوانٍ."
    },
    "fuel-cost": {
      "name": "تكلفة وقود الرحلة",
      "description": "قدّر تكلفة الوقود اللازمة للرحلة."
    },
    "travel-speed": {
      "name": "متوسط السرعة",
      "description": "احسب متوسط السرعة من المسافة ووقت السفر."
    },
    "paint": {
      "name": "حاسبة الطلاء",
      "description": "قدّر كمية الطلاء المطلوبة لمساحة الجدار."
    },
    "flooring": {
      "name": "حاسبة الأرضيات",
      "description": "قدّر كمية مواد الأرضيات مع إضافة نسبة هدر."
    },
    "grade": {
      "name": "النسبة المئوية للدرجات",
      "description": "احسب الدرجة كنسبة مئوية من إجمالي النقاط."
    }
  },
  "hi": {
    "percentage": {
      "name": "प्रतिशत कैलकुलेटर",
      "description": "किसी संख्या का प्रतिशत निकालें या दो मानों की तुलना करें।"
    },
    "percentage-change": {
      "name": "प्रतिशत परिवर्तन",
      "description": "दो मानों के बीच वृद्धि या कमी मापें।"
    },
    "average": {
      "name": "औसत कैलकुलेटर",
      "description": "तीन मानों का अंकगणितीय औसत निकालें।"
    },
    "fraction-to-decimal": {
      "name": "भिन्न से दशमलव",
      "description": "भिन्न को दशमलव संख्या में बदलें।"
    },
    "triangle-area": {
      "name": "त्रिभुज का क्षेत्रफल",
      "description": "आधार और ऊँचाई से त्रिभुज का क्षेत्रफल निकालें।"
    },
    "circle": {
      "name": "वृत्त कैलकुलेटर",
      "description": "वृत्त का क्षेत्रफल और परिधि निकालें।"
    },
    "rectangle": {
      "name": "आयत कैलकुलेटर",
      "description": "आयत का क्षेत्रफल और परिमाप निकालें।"
    },
    "pythagorean": {
      "name": "पाइथागोरस प्रमेय",
      "description": "समकोण त्रिभुज का कर्ण निकालें।"
    },
    "bmi": {
      "name": "BMI कैलकुलेटर",
      "description": "वज़न और ऊँचाई से बॉडी मास इंडेक्स का अनुमान लगाएँ।"
    },
    "calorie-estimate": {
      "name": "दैनिक कैलोरी अनुमान",
      "description": "सरल सूत्र से बेसल मेटाबॉलिक रेट का अनुमान लगाएँ।"
    },
    "water-intake": {
      "name": "दैनिक पानी की आवश्यकता",
      "description": "शरीर के वज़न के आधार पर रोज़ाना पानी की मात्रा जानें।"
    },
    "pace": {
      "name": "रनिंग पेस कैलकुलेटर",
      "description": "दूरी और समय से प्रति किलोमीटर की गति निकालें।"
    },
    "profit-margin": {
      "name": "लाभ मार्जिन",
      "description": "लागत और बिक्री मूल्य से लाभ और मार्जिन निकालें।"
    },
    "markup": {
      "name": "मार्कअप कैलकुलेटर",
      "description": "लागत और मार्कअप से बिक्री मूल्य निकालें।"
    },
    "discount": {
      "name": "छूट कैलकुलेटर",
      "description": "छूट के बाद अंतिम कीमत निकालें।"
    },
    "sales-tax": {
      "name": "बिक्री कर कैलकुलेटर",
      "description": "कर से पहले की राशि में टैक्स जोड़ें।"
    },
    "break-even": {
      "name": "ब्रेक-ईवन यूनिट",
      "description": "निश्चित लागत पूरी करने के लिए आवश्यक इकाइयों का अनुमान लगाएँ।"
    },
    "hourly-pay": {
      "name": "प्रति घंटा वेतन",
      "description": "काम के घंटे और प्रति घंटे की दर से कुल वेतन निकालें।"
    },
    "compound-growth": {
      "name": "चक्रवृद्धि वृद्धि",
      "description": "नियमित चक्रवृद्धि के साथ भविष्य की वृद्धि का अनुमान लगाएँ।"
    },
    "unit-price": {
      "name": "प्रति इकाई कीमत तुलना",
      "description": "किसी उत्पाद की प्रति इकाई कीमत की तुलना करें।"
    },
    "length-converter": {
      "name": "लंबाई कन्वर्टर",
      "description": "मीटर को फीट और इंच में बदलें।"
    },
    "weight-converter": {
      "name": "वज़न कन्वर्टर",
      "description": "किलोग्राम को पाउंड और औंस में बदलें।"
    },
    "temperature": {
      "name": "तापमान कन्वर्टर",
      "description": "सेल्सियस को फ़ारेनहाइट और केल्विन में बदलें।"
    },
    "data-storage": {
      "name": "डेटा स्टोरेज कन्वर्टर",
      "description": "मेगाबाइट को गीगाबाइट और बाइट में बदलें।"
    },
    "download-time": {
      "name": "डाउनलोड समय",
      "description": "फ़ाइल आकार और इंटरनेट गति से डाउनलोड समय का अनुमान लगाएँ।"
    },
    "date-difference": {
      "name": "तारीख अवधि कैलकुलेटर",
      "description": "हफ्तों और दिनों से कुल दिनों की गणना करें।"
    },
    "time-converter": {
      "name": "समय कन्वर्टर",
      "description": "घंटों को मिनट और सेकंड में बदलें।"
    },
    "fuel-cost": {
      "name": "यात्रा ईंधन लागत",
      "description": "यात्रा के लिए ईंधन लागत का अनुमान लगाएँ।"
    },
    "travel-speed": {
      "name": "औसत गति",
      "description": "दूरी और यात्रा समय से औसत गति निकालें।"
    },
    "paint": {
      "name": "पेंट कैलकुलेटर",
      "description": "दीवार के क्षेत्रफल के लिए आवश्यक पेंट का अनुमान लगाएँ।"
    },
    "flooring": {
      "name": "फ़्लोरिंग कैलकुलेटर",
      "description": "बर्बादी की अतिरिक्त मात्रा सहित फ़्लोरिंग सामग्री का अनुमान लगाएँ।"
    },
    "grade": {
      "name": "ग्रेड प्रतिशत",
      "description": "अंकों को कुल अंकों के प्रतिशत के रूप में निकालें।"
    }
  },
  "bn": {
    "percentage": {
      "name": "শতাংশ ক্যালকুলেটর",
      "description": "কোনো সংখ্যার শতাংশ বের করুন বা দুটি মানের তুলনা করুন।"
    },
    "percentage-change": {
      "name": "শতাংশ পরিবর্তন",
      "description": "দুটি মানের মধ্যে বৃদ্ধি বা হ্রাস পরিমাপ করুন।"
    },
    "average": {
      "name": "গড় ক্যালকুলেটর",
      "description": "তিনটি মানের গাণিতিক গড় বের করুন।"
    },
    "fraction-to-decimal": {
      "name": "ভগ্নাংশ থেকে দশমিক",
      "description": "ভগ্নাংশকে দশমিক সংখ্যায় রূপান্তর করুন।"
    },
    "triangle-area": {
      "name": "ত্রিভুজের ক্ষেত্রফল",
      "description": "ভূমি ও উচ্চতা থেকে ত্রিভুজের ক্ষেত্রফল বের করুন।"
    },
    "circle": {
      "name": "বৃত্ত ক্যালকুলেটর",
      "description": "বৃত্তের ক্ষেত্রফল ও পরিধি বের করুন।"
    },
    "rectangle": {
      "name": "আয়তক্ষেত্র ক্যালকুলেটর",
      "description": "আয়তক্ষেত্রের ক্ষেত্রফল ও পরিসীমা বের করুন।"
    },
    "pythagorean": {
      "name": "পিথাগোরাসের উপপাদ্য",
      "description": "সমকোণী ত্রিভুজের অতিভুজ বের করুন।"
    },
    "bmi": {
      "name": "BMI ক্যালকুলেটর",
      "description": "ওজন ও উচ্চতা থেকে বডি মাস ইনডেক্স অনুমান করুন।"
    },
    "calorie-estimate": {
      "name": "দৈনিক ক্যালরি অনুমান",
      "description": "সহজ সূত্রে বেসাল মেটাবলিক রেট অনুমান করুন।"
    },
    "water-intake": {
      "name": "দৈনিক পানির চাহিদা",
      "description": "শরীরের ওজন অনুযায়ী দৈনিক পানির লক্ষ্য হিসাব করুন।"
    },
    "pace": {
      "name": "দৌড়ের গতি ক্যালকুলেটর",
      "description": "দূরত্ব ও সময় থেকে প্রতি কিলোমিটারের গতি বের করুন।"
    },
    "profit-margin": {
      "name": "লাভের মার্জিন",
      "description": "খরচ ও বিক্রয়মূল্য থেকে লাভ ও মার্জিন হিসাব করুন।"
    },
    "markup": {
      "name": "মার্কআপ ক্যালকুলেটর",
      "description": "খরচ ও মার্কআপ থেকে বিক্রয়মূল্য বের করুন।"
    },
    "discount": {
      "name": "ছাড় ক্যালকুলেটর",
      "description": "ছাড়ের পর চূড়ান্ত মূল্য বের করুন।"
    },
    "sales-tax": {
      "name": "বিক্রয় কর ক্যালকুলেটর",
      "description": "কর-পূর্ব পরিমাণের সঙ্গে কর যোগ করুন।"
    },
    "break-even": {
      "name": "ব্রেক-ইভেন ইউনিট",
      "description": "স্থায়ী খরচ পূরণে প্রয়োজনীয় ইউনিট অনুমান করুন।"
    },
    "hourly-pay": {
      "name": "ঘণ্টাভিত্তিক বেতন",
      "description": "কাজের সময় ও ঘণ্টাপ্রতি হার থেকে মোট বেতন হিসাব করুন।"
    },
    "compound-growth": {
      "name": "চক্রবৃদ্ধি বৃদ্ধি",
      "description": "নিয়মিত চক্রবৃদ্ধিতে ভবিষ্যৎ বৃদ্ধি অনুমান করুন।"
    },
    "unit-price": {
      "name": "প্রতি ইউনিট মূল্য তুলনা",
      "description": "পণ্যের প্রতি ইউনিটের মূল্য তুলনা করুন।"
    },
    "length-converter": {
      "name": "দৈর্ঘ্য রূপান্তরক",
      "description": "মিটারকে ফুট ও ইঞ্চিতে রূপান্তর করুন।"
    },
    "weight-converter": {
      "name": "ওজন রূপান্তরক",
      "description": "কিলোগ্রামকে পাউন্ড ও আউন্সে রূপান্তর করুন।"
    },
    "temperature": {
      "name": "তাপমাত্রা রূপান্তরক",
      "description": "সেলসিয়াসকে ফারেনহাইট ও কেলভিনে রূপান্তর করুন।"
    },
    "data-storage": {
      "name": "ডেটা স্টোরেজ রূপান্তরক",
      "description": "মেগাবাইটকে গিগাবাইট ও বাইটে রূপান্তর করুন।"
    },
    "download-time": {
      "name": "ডাউনলোডের সময়",
      "description": "ফাইলের আকার ও গতির ভিত্তিতে ডাউনলোডের সময় অনুমান করুন।"
    },
    "date-difference": {
      "name": "তারিখের সময়কাল",
      "description": "সপ্তাহ ও দিন থেকে মোট দিনের সংখ্যা বের করুন।"
    },
    "time-converter": {
      "name": "সময় রূপান্তরক",
      "description": "ঘণ্টাকে মিনিট ও সেকেন্ডে রূপান্তর করুন।"
    },
    "fuel-cost": {
      "name": "ভ্রমণের জ্বালানি খরচ",
      "description": "ভ্রমণের জন্য জ্বালানির খরচ অনুমান করুন।"
    },
    "travel-speed": {
      "name": "গড় গতি",
      "description": "দূরত্ব ও ভ্রমণের সময় থেকে গড় গতি বের করুন।"
    },
    "paint": {
      "name": "রংয়ের পরিমাণ ক্যালকুলেটর",
      "description": "দেয়ালের ক্ষেত্রফলের জন্য প্রয়োজনীয় রং অনুমান করুন।"
    },
    "flooring": {
      "name": "মেঝের উপকরণ ক্যালকুলেটর",
      "description": "অতিরিক্ত অপচয়সহ মেঝের উপকরণের পরিমাণ অনুমান করুন।"
    },
    "grade": {
      "name": "গ্রেড শতাংশ",
      "description": "প্রাপ্ত নম্বরকে মোট নম্বরের শতাংশে হিসাব করুন।"
    }
  },
  "es": {
    "percentage": {
      "name": "Calculadora de porcentaje",
      "description": "Calcula un porcentaje de una cantidad o compara dos valores."
    },
    "percentage-change": {
      "name": "Cambio porcentual",
      "description": "Mide el aumento o la disminución entre dos valores."
    },
    "average": {
      "name": "Calculadora de promedio",
      "description": "Calcula la media aritmética de tres valores."
    },
    "fraction-to-decimal": {
      "name": "Fracción a decimal",
      "description": "Convierte una fracción en un número decimal."
    },
    "triangle-area": {
      "name": "Área del triángulo",
      "description": "Calcula el área de un triángulo con la base y la altura."
    },
    "circle": {
      "name": "Calculadora de círculo",
      "description": "Calcula el área y la circunferencia de un círculo."
    },
    "rectangle": {
      "name": "Calculadora de rectángulo",
      "description": "Calcula el área y el perímetro de un rectángulo."
    },
    "pythagorean": {
      "name": "Teorema de Pitágoras",
      "description": "Calcula la hipotenusa de un triángulo rectángulo."
    },
    "bmi": {
      "name": "Calculadora de IMC",
      "description": "Estima el índice de masa corporal a partir del peso y la altura."
    },
    "calorie-estimate": {
      "name": "Estimación de calorías diarias",
      "description": "Estima la tasa metabólica basal con una fórmula simplificada."
    },
    "water-intake": {
      "name": "Consumo diario de agua",
      "description": "Estima un objetivo diario de agua según el peso corporal."
    },
    "pace": {
      "name": "Ritmo de carrera",
      "description": "Calcula el ritmo por kilómetro según la distancia y el tiempo."
    },
    "profit-margin": {
      "name": "Margen de beneficio",
      "description": "Calcula el beneficio y el margen a partir del coste y el precio."
    },
    "markup": {
      "name": "Calculadora de margen sobre coste",
      "description": "Calcula el precio de venta según el coste y el recargo."
    },
    "discount": {
      "name": "Calculadora de descuentos",
      "description": "Calcula el precio final después de aplicar un descuento."
    },
    "sales-tax": {
      "name": "Calculadora de impuesto sobre ventas",
      "description": "Añade el impuesto a un importe antes de impuestos."
    },
    "break-even": {
      "name": "Unidades de punto de equilibrio",
      "description": "Estima las unidades necesarias para cubrir los costes fijos."
    },
    "hourly-pay": {
      "name": "Calculadora de pago por hora",
      "description": "Calcula el salario bruto según las horas y la tarifa."
    },
    "compound-growth": {
      "name": "Crecimiento compuesto",
      "description": "Proyecta el crecimiento con capitalización periódica."
    },
    "unit-price": {
      "name": "Comparador de precio unitario",
      "description": "Compara el precio por unidad de un producto."
    },
    "length-converter": {
      "name": "Conversor de longitud",
      "description": "Convierte metros a pies y pulgadas."
    },
    "weight-converter": {
      "name": "Conversor de peso",
      "description": "Convierte kilogramos a libras y onzas."
    },
    "temperature": {
      "name": "Conversor de temperatura",
      "description": "Convierte Celsius a Fahrenheit y Kelvin."
    },
    "data-storage": {
      "name": "Conversor de almacenamiento",
      "description": "Convierte megabytes a gigabytes y bytes."
    },
    "download-time": {
      "name": "Tiempo de descarga",
      "description": "Estima la duración de una descarga según el tamaño y la velocidad."
    },
    "date-difference": {
      "name": "Duración entre semanas y días",
      "description": "Calcula los días totales a partir de semanas y días."
    },
    "time-converter": {
      "name": "Conversor de tiempo",
      "description": "Convierte horas a minutos y segundos."
    },
    "fuel-cost": {
      "name": "Coste de combustible del viaje",
      "description": "Estima el coste del combustible para un trayecto."
    },
    "travel-speed": {
      "name": "Velocidad media",
      "description": "Calcula la velocidad media según la distancia y el tiempo."
    },
    "paint": {
      "name": "Calculadora de pintura",
      "description": "Estima la pintura necesaria para una superficie de pared."
    },
    "flooring": {
      "name": "Calculadora de suelo",
      "description": "Estima el material para el suelo con margen de desperdicio."
    },
    "grade": {
      "name": "Porcentaje de calificación",
      "description": "Calcula una puntuación como porcentaje del total."
    }
  },
  "pt": {
    "percentage": {
      "name": "Calculadora de porcentagem",
      "description": "Calcule uma porcentagem de um valor ou compare dois valores."
    },
    "percentage-change": {
      "name": "Variação percentual",
      "description": "Meça o aumento ou a redução entre dois valores."
    },
    "average": {
      "name": "Calculadora de média",
      "description": "Calcule a média aritmética de três valores."
    },
    "fraction-to-decimal": {
      "name": "Fração para decimal",
      "description": "Converta uma fração em número decimal."
    },
    "triangle-area": {
      "name": "Área do triângulo",
      "description": "Calcule a área do triângulo usando base e altura."
    },
    "circle": {
      "name": "Calculadora de círculo",
      "description": "Calcule a área e a circunferência de um círculo."
    },
    "rectangle": {
      "name": "Calculadora de retângulo",
      "description": "Calcule a área e o perímetro de um retângulo."
    },
    "pythagorean": {
      "name": "Teorema de Pitágoras",
      "description": "Encontre a hipotenusa de um triângulo retângulo."
    },
    "bmi": {
      "name": "Calculadora de IMC",
      "description": "Estime o índice de massa corporal com peso e altura."
    },
    "calorie-estimate": {
      "name": "Estimativa de calorias diárias",
      "description": "Estime a taxa metabólica basal usando uma fórmula simplificada."
    },
    "water-intake": {
      "name": "Consumo diário de água",
      "description": "Estime uma meta diária de água com base no peso corporal."
    },
    "pace": {
      "name": "Ritmo de corrida",
      "description": "Calcule o ritmo por quilômetro com distância e tempo."
    },
    "profit-margin": {
      "name": "Margem de lucro",
      "description": "Calcule o lucro e a margem com custo e preço de venda."
    },
    "markup": {
      "name": "Calculadora de acréscimo",
      "description": "Calcule o preço de venda com base no custo e no acréscimo."
    },
    "discount": {
      "name": "Calculadora de desconto",
      "description": "Encontre o preço final após aplicar um desconto."
    },
    "sales-tax": {
      "name": "Calculadora de imposto sobre vendas",
      "description": "Adicione o imposto ao valor antes dos tributos."
    },
    "break-even": {
      "name": "Unidades do ponto de equilíbrio",
      "description": "Estime as unidades necessárias para cobrir os custos fixos."
    },
    "hourly-pay": {
      "name": "Calculadora de pagamento por hora",
      "description": "Calcule o pagamento bruto com horas e valor por hora."
    },
    "compound-growth": {
      "name": "Crescimento composto",
      "description": "Projete o crescimento com capitalização periódica."
    },
    "unit-price": {
      "name": "Comparador de preço unitário",
      "description": "Compare o preço por unidade de um produto."
    },
    "length-converter": {
      "name": "Conversor de comprimento",
      "description": "Converta metros em pés e polegadas."
    },
    "weight-converter": {
      "name": "Conversor de peso",
      "description": "Converta quilogramas em libras e onças."
    },
    "temperature": {
      "name": "Conversor de temperatura",
      "description": "Converta Celsius em Fahrenheit e Kelvin."
    },
    "data-storage": {
      "name": "Conversor de armazenamento de dados",
      "description": "Converta megabytes em gigabytes e bytes."
    },
    "download-time": {
      "name": "Tempo de download",
      "description": "Estime a duração do download pelo tamanho do arquivo e velocidade."
    },
    "date-difference": {
      "name": "Duração em semanas e dias",
      "description": "Calcule o total de dias a partir de semanas e dias."
    },
    "time-converter": {
      "name": "Conversor de tempo",
      "description": "Converta horas em minutos e segundos."
    },
    "fuel-cost": {
      "name": "Custo de combustível da viagem",
      "description": "Estime o custo de combustível de uma viagem."
    },
    "travel-speed": {
      "name": "Velocidade média",
      "description": "Calcule a velocidade média com distância e tempo de viagem."
    },
    "paint": {
      "name": "Calculadora de tinta",
      "description": "Estime a quantidade de tinta necessária para uma parede."
    },
    "flooring": {
      "name": "Calculadora de piso",
      "description": "Estime o material para o piso incluindo uma margem de sobra."
    },
    "grade": {
      "name": "Percentual da nota",
      "description": "Calcule a pontuação como porcentagem do total."
    }
  }
} as const;

export function localizedCalculator(calculator: CalculatorDefinition, locale: string) {
  const translated = translations[locale as keyof typeof translations]?.[calculator.slug as keyof typeof translations.ar];
  return { ...calculator, name: translated?.name ?? calculator.name, description: translated?.description ?? calculator.description };
}
