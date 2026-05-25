export interface QuizQuestion {
  id: number;
  questionEn: string;
  questionHi: string;
  audioEn: string;
  audioHi: string;
  imageSvg: string; // inline SVG placeholder representations for high-fidelity visual matching
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
}

export interface Trade {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  questions: QuizQuestion[];
}

export interface Scheme {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  benefitsEn: string;
  benefitsHi: string;
  eligibilityEn: string;
  eligibilityHi: string;
  tagsEn: string[];
  tagsHi: string[];
  logoType: 'loan' | 'tool' | 'training';
}

export interface Job {
  id: string;
  titleEn: string;
  titleHi: string;
  employer: string;
  locationEn: string;
  locationHi: string;
  salaryEn: string;
  salaryHi: string;
  tradeId: string;
  phone: string;
}

export const tradesData: Trade[] = [
  {
    id: "tailoring",
    nameEn: "Tailoring & Sewing",
    nameHi: "सिलाई और कढ़ाई",
    icon: "Scissors",
    questions: [
      {
        id: 1,
        questionEn: "Which tool is used for measuring fabric correctly?",
        questionHi: "कपड़े को सही तरीके से मापने के लिए किस उपकरण का उपयोग किया जाता है?",
        audioEn: "Which tool is used for measuring fabric correctly? Measuring tape, scissors, or needle?",
        audioHi: "कपड़े को सही तरीके से मापने के लिए किस उपकरण का उपयोग किया जाता है? नापने वाला फीता, कैंची, या सुई?",
        imageSvg: `<svg viewBox="0 0 100 60" class="w-full h-24 bg-teal-50 rounded-lg p-2"><path d="M10 30h80M20 25v10M30 25v10M40 25v10M50 25v10M60 25v10M70 25v10M80 25v10" stroke="#0D5C75" stroke-width="4" stroke-linecap="round"/><text x="50" y="52" fill="#0D5C75" font-size="10" text-anchor="middle" font-weight="bold">Measuring Tape (इंची टेप)</text></svg>`,
        optionsEn: ["Measuring Tape", "Scissors", "Needle"],
        optionsHi: ["नापने वाला फीता (इंची टेप)", "कैंची", "सुई"],
        correctIndex: 0
      },
      {
        id: 2,
        questionEn: "What is this thread holder called in a sewing machine?",
        questionHi: "सिलाई मशीन में धागे को पकड़ने वाले इस पुर्जे को क्या कहते हैं?",
        audioEn: "What is this thread holder called? Bobbin, Wheel, or Pedal?",
        audioHi: "धागे को पकड़ने वाले इस पुर्जे को क्या कहते हैं? बॉबिन, पहिया, या पैडल?",
        imageSvg: `<svg viewBox="0 0 100 60" class="w-full h-24 bg-teal-50 rounded-lg p-2"><circle cx="50" cy="30" r="18" fill="none" stroke="#D4AF37" stroke-width="6"/><circle cx="50" cy="30" r="8" fill="#0D5C75"/><line x1="38" y1="30" x2="62" y2="30" stroke="#fff" stroke-width="2"/><text x="50" y="56" fill="#0D5C75" font-size="8" text-anchor="middle" font-weight="bold">Bobbin (बॉबिन / फिरकी)</text></svg>`,
        optionsEn: ["Bobbin / Spool", "Hand Wheel", "Machine Needle"],
        optionsHi: ["बॉबिन / फिरकी", "हाथ का पहिया", "मशीन की सुई"],
        correctIndex: 0
      },
      {
        id: 3,
        questionEn: "Identify this type of stitch usually used for borders and design.",
        questionHi: "किनारे की डिज़ाइन और सजावट के लिए उपयोग होने वाले इस टांके को पहचानें।",
        audioEn: "Identify this stitch: Running stitch, Zig-zag stitch, or Cross stitch?",
        audioHi: "इस टांके को पहचानें: सीधी सिलाई, टेढ़ी-मेढ़ी (ज़िग-ज़ैग) सिलाई, या क्रॉस टांका?",
        imageSvg: `<svg viewBox="0 0 100 60" class="w-full h-24 bg-teal-50 rounded-lg p-2"><path d="M10 20 l15 20 l15-20 l15 20 l15-20 l15 20" fill="none" stroke="#0D5C75" stroke-width="4" stroke-dasharray="2,2" stroke-linecap="round"/><text x="50" y="54" fill="#0D5C75" font-size="8" text-anchor="middle" font-weight="bold">Zig-zag Stitch (ज़िग-ज़ैग सिलाई)</text></svg>`,
        optionsEn: ["Running Stitch", "Zig-zag Stitch", "Cross Stitch"],
        optionsHi: ["सीधी सिलाई", "टेढ़ी-मेढ़ी (ज़िग-ज़ैग) सिलाई", "क्रॉस टांका"],
        correctIndex: 1
      }
    ]
  },
  {
    id: "beauty",
    nameEn: "Beauty & Wellness",
    nameHi: "ब्यूटी पार्लर व सिलाई-श्रृंगार",
    icon: "Sparkles",
    questions: [
      {
        id: 1,
        questionEn: "Which tool is used for eyebrow hair removal?",
        questionHi: "भौंहों (आइब्रो) के बाल हटाने के लिए किस धागे/उपकरण का उपयोग किया जाता है?",
        audioEn: "Which tool is used for eyebrow hair removal? Threading spool, Hair brush, or Lipstick?",
        audioHi: "भौंहों के बाल हटाने के लिए किस उपकरण का उपयोग किया जाता है? थ्रेडिंग धागा, कंघी, या लिपस्टिक?",
        imageSvg: `<svg viewBox="0 0 100 60" class="w-full h-24 bg-teal-50 rounded-lg p-2"><path d="M30 40 L70 20 M30 20 L70 40" stroke="#0D5C75" stroke-width="3"/><circle cx="50" cy="30" r="6" fill="#D4AF37"/><text x="50" y="54" fill="#0D5C75" font-size="8" text-anchor="middle" font-weight="bold">Threading Thread (थ्रेडिंग धागा)</text></svg>`,
        optionsEn: ["Threading Thread", "Hair Brush", "Lipstick Brush"],
        optionsHi: ["थ्रेडिंग धागा", "बालों का ब्रश", "लिपस्टिक ब्रश"],
        correctIndex: 0
      },
      {
        id: 2,
        questionEn: "Identify this beauty blender used for makeup application.",
        questionHi: "चेहरे पर मेकअप मिलाने/लगाने के लिए इस स्पंज को क्या कहते हैं?",
        audioEn: "Identify this beauty sponge: Blender sponge, Scissors, or Hair roller?",
        audioHi: "मेकअप लगाने के लिए इस स्पंज को क्या कहते हैं? ब्लेंडर स्पंज, कैंची, या हेयर रोलर?",
        imageSvg: `<svg viewBox="0 0 100 60" class="w-full h-24 bg-teal-50 rounded-lg p-2"><path d="M50 15 C40 25 35 35 35 45 C35 52 42 55 50 55 C58 55 65 52 65 45 C65 35 60 25 50 15 Z" fill="#D4AF37" opacity="0.8"/><text x="50" y="10" fill="#0D5C75" font-size="8" text-anchor="middle" font-weight="bold">Beauty Blender (मेकअप स्पंज)</text></svg>`,
        optionsEn: ["Blender Sponge", "Face Scrubber", "Eyeliner Pen"],
        optionsHi: ["मेकअप स्पंज (ब्लेंडर)", "फेस स्क्रबर", "आईलाइनर पेन"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "foodprep",
    nameEn: "Food Prep & Catering",
    nameHi: "खाद्य तैयारी व कैटरिंग",
    icon: "Utensils",
    questions: [
      {
        id: 1,
        questionEn: "Which kitchen tool is used for rolling out flatbread (rotis)?",
        questionHi: "रोटी या चपाती बेलने के लिए रसोई के किस उपकरण का उपयोग किया जाता है?",
        audioEn: "Which tool is used for rolling out rotis? Rolling Pin, Knife, or Frying Pan?",
        audioHi: "रोटी बेलने के लिए किसका उपयोग किया जाता है? बेलन, चाकू, या कड़ाही?",
        imageSvg: `<svg viewBox="0 0 100 60" class="w-full h-24 bg-teal-50 rounded-lg p-2"><rect x="15" y="27" width="70" height="6" rx="3" fill="#D4AF37"/><rect x="5" y="29" width="10" height="2" rx="1" fill="#0D5C75"/><rect x="85" y="29" width="10" height="2" rx="1" fill="#0D5C75"/><text x="50" y="50" fill="#0D5C75" font-size="8" text-anchor="middle" font-weight="bold">Rolling Pin (बेलन)</text></svg>`,
        optionsEn: ["Rolling Pin (Belan)", "Knife", "Frying Pan (Kadhai)"],
        optionsHi: ["बेलन (Rolling Pin)", "चाकू", "कड़ाही"],
        correctIndex: 0
      },
      {
        id: 2,
        questionEn: "Which spice is added to Indian curries to give them a yellow color?",
        questionHi: "भारतीय करी/सब्जी को पीला रंग देने के लिए कौन सा मसाला डाला जाता है?",
        audioEn: "Which spice gives food a yellow color? Turmeric, Salt, or Red Chili?",
        audioHi: "सब्जी को पीला रंग देने के लिए कौन सा मसाला डाला जाता है? हल्दी, नमक, या लाल मिर्च?",
        imageSvg: `<svg viewBox="0 0 100 60" class="w-full h-24 bg-teal-50 rounded-lg p-2"><path d="M30 45 C35 30 45 30 50 45 Z" fill="#E5A93B"/><circle cx="50" cy="45" r="10" fill="#E5A93B"/><text x="50" y="20" fill="#0D5C75" font-size="10" text-anchor="middle" font-weight="bold">Turmeric (हल्दी)</text></svg>`,
        optionsEn: ["Turmeric (Haldi)", "Salt", "Red Chili Powder"],
        optionsHi: ["हल्दी (Haldi)", "नमक", "लाल मिर्च पाउडर"],
        correctIndex: 0
      }
    ]
  }
];

export const schemesData: Scheme[] = [
  {
    id: "pmv",
    titleEn: "PM Vishwakarma Scheme",
    titleHi: "पीएम विश्वकर्मा योजना",
    descriptionEn: "Support for traditional artisans and craftspeople. Offers identity cards, skill upgradation, toolkit incentive, and collateral-free credit.",
    descriptionHi: "पारंपरिक कारीगरों और शिल्पकारों के लिए सहायता। पहचान पत्र, कौशल उन्नयन, टूलकिट प्रोत्साहन और बिना गारंटी के ऋण प्रदान करता है।",
    benefitsEn: "₹15,000 Toolkit Grant + Collateral-Free Loans up to ₹3,00,000 at 5% interest.",
    benefitsHi: "₹15,000 टूलकिट अनुदान + 5% ब्याज पर ₹3,00,000 तक बिना गारंटी का ऋण।",
    eligibilityEn: "Self-employed artisans in 18 specified trades, including Tailors.",
    eligibilityHi: "दर्जी सहित 18 निर्दिष्ट व्यवसायों में स्व-नियोजित कारीगर।",
    tagsEn: ["Grant", "Tool Kit", "Low Interest Loan"],
    tagsHi: ["अनुदान", "टूल किट", "कम ब्याज ऋण"],
    logoType: "tool"
  },
  {
    id: "mudra",
    titleEn: "Mudra Loan (Shishu & Kishor)",
    titleHi: "मुद्रा योजना (शिशु और किशोर ऋण)",
    descriptionEn: "Government-backed loans for starting or expanding small businesses. Perfect for setting up home boutique, food shop, or parlour.",
    descriptionHi: "छोटे व्यवसाय शुरू करने या बढ़ाने के लिए सरकारी ऋण। बुटीक, ब्यूटी पार्लर या टिफिन सेंटर खोलने के लिए उत्तम।",
    benefitsEn: "Loans from ₹50,000 up to ₹5 Lakhs with minimal paper documentation.",
    benefitsHi: "न्यूनतम दस्तावेजों के साथ ₹50,000 से लेकर ₹5 लाख तक का ऋण।",
    eligibilityEn: "Women entrepreneurs running or starting micro/small businesses.",
    eligibilityHi: "सूक्ष्म/लघु व्यवसाय शुरू करने या चलाने वाली महिला उद्यमी।",
    tagsEn: ["Business Capital", "No Security Required"],
    tagsHi: ["व्यवसाय पूंजी", "कोई सुरक्षा आवश्यक नहीं"],
    logoType: "loan"
  },
  {
    id: "svanidhi",
    titleEn: "PM SVANidhi Scheme",
    titleHi: "पीएम स्वनिधि योजना",
    descriptionEn: "Micro-credit scheme for street vendors and small home-based food preparers to restart/grow their businesses.",
    descriptionHi: "रेहड़ी-पटरी वालों और घर पर भोजन बनाने वाली महिलाओं के लिए सूक्ष्म ऋण योजना।",
    benefitsEn: "First loan of ₹10,000, 7% interest subsidy, cashback on digital transactions.",
    benefitsHi: "₹10,000 का प्रारंभिक ऋण, 7% ब्याज सब्सिडी, डिजिटल लेनदेन पर कैशबैक।",
    eligibilityEn: "Street food makers, home-catering providers, and small stall owners.",
    eligibilityHi: "सड़क किनारे भोजन बनाने वाले, होम-कैटरिंग प्रदाता और छोटे स्टॉल मालिक।",
    tagsEn: ["Working Capital", "Subsidized Interest"],
    tagsHi: ["कार्यशील पूंजी", "रियायती ब्याज"],
    logoType: "training"
  }
];

export const jobsData: Job[] = [
  {
    id: "job1",
    titleEn: "Urgent: 5 Tailors for Boutique",
    titleHi: "आवश्यकता: बुटीक के लिए 5 महिला दर्जी",
    employer: "Radha Boutique & Designer wear",
    locationEn: "Sector 15, Near Metro Station",
    locationHi: "सेक्टर 15, मेट्रो स्टेशन के पास",
    salaryEn: "₹12,000 - ₹18,000 / month",
    salaryHi: "₹12,000 - ₹18,000 / प्रति माह",
    tradeId: "tailoring",
    phone: "+91 98765 43210"
  },
  {
    id: "job2",
    titleEn: "Bridal Makeup Artist Assistant",
    titleHi: "ब्राइडल मेकअप आर्टिस्ट सहायक",
    employer: "Golden Glow Beauty Parlour",
    locationEn: "Rampur Chauraha, Main Bazaar",
    locationHi: "रामपुर चौराहा, मुख्य बाज़ार",
    salaryEn: "₹8,000 - ₹15,000 / month",
    salaryHi: "₹8,000 - ₹15,000 / प्रति माह",
    tradeId: "beauty",
    phone: "+91 87654 32109"
  },
  {
    id: "job3",
    titleEn: "Home Cook for Catering Service",
    titleHi: "कैटरिंग सेवा के लिए घरेलू रसोइया/कुक",
    employer: "Annapurna Rasoi Services",
    locationEn: "Civil Lines, Near Temple",
    locationHi: "सिविल लाइन्स, मंदिर के पास",
    salaryEn: "₹10,000 - ₹14,000 / month",
    salaryHi: "₹10,000 - ₹14,000 / प्रति माह",
    tradeId: "foodprep",
    phone: "+91 76543 21098"
  },
  {
    id: "job4",
    titleEn: "Need Blouse Stitching Specialist",
    titleHi: "ब्लाउज सिलाई विशेषज्ञ की आवश्यकता",
    employer: "She Creations Tailoring Hub",
    locationEn: "Malviya Nagar Market",
    locationHi: "मालवीय नगर बाजार",
    salaryEn: "₹15,000 - ₹20,000 / month",
    salaryHi: "₹15,000 - ₹20,000 / प्रति माह",
    tradeId: "tailoring",
    phone: "+91 65432 10987"
  }
];
