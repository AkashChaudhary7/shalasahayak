export interface SeoPageConfig {
  slug: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  category: 'salary' | 'shala-darpan' | 'paymanager' | 'shivira' | 'peeo' | 'mdm' | 'formats' | 'exam' | 'resources' | 'tools' | 'legal';
  categoryLabelHi: string;
  categoryLabelEn: string;
  introTextHi: string;
  introTextEn: string;
  lastUpdated: string;
  officialSource?: {
    deptHi: string;
    deptEn: string;
    circularNo?: string;
    verifiedDate?: string;
    portalUrl?: string;
  };
  breadcrumbs: { name: string; url: string }[];
  howToSteps?: { name: string; text: string }[];
  faqs: { question: string; answer: string }[];
  relatedTools: { title: string; url: string; badge?: string }[];
  toolMapping?: {
    type: string;
    id?: string;
    template?: string;
    category?: string;
    subtab?: string;
    subComponent?: string;
    blogId?: string;
  };
}

export const SEO_PAGES_CONFIG: Record<string, SeoPageConfig> = {
  // SALARY & PAY CLUSTER
  '7th-pay-calculator': {
    slug: '7th-pay-calculator',
    title: 'Rajasthan 7th Pay Calculator 2026 – Salary, DA & HRA | Shala Sahayak',
    description: 'राजस्थान 7वां वेतन कैलकुलेटर (7th Pay Calculator Rajasthan) – L-1 से L-16 तक बेसिक, 60% DA, HRA, SI व GPF कटौती अनुसार इन-हैंड सैलरी गणना व पे-स्लिप प्रिंट।',
    h1: 'राजस्थान 7वां वेतन कैलकुलेटर (Rajasthan 7th CPC Salary Calculator)',
    canonical: 'https://shalasahayak.in/7th-pay-calculator',
    category: 'salary',
    categoryLabelHi: 'वेतन व भत्ते',
    categoryLabelEn: 'Salary & Allowances',
    introTextHi: 'शाला सहायक का यह आधिकारिक वेतन कैलकुलेटर राजस्थान सिविल सेवा (पुनरीक्षित वेतन) नियम 2017 एवं वित्त विभाग के नवीनतम 60% महंगाई भत्ते (DA) आदेशानुसार राज्य कर्मचारियों, वरिष्ठ अध्यापकों, प्राध्यापकों एवं संस्था प्रधानों के मासिक वेतन की सटीक गणना करता है।',
    introTextEn: 'Calculate 7th CPC Rajasthan teacher and state employee salary with 60% DA, HRA (10%/20%), SI, GPF, and RGHS deductions with authentic PayManager pay slip generation.',
    lastUpdated: 'मार्च 2026 (वित्त विभाग राजस्थान 60% DA संसोधन)',
    officialSource: {
      deptHi: 'वित्त विभाग (नियम प्रभाग), राजस्थान सरकार',
      deptEn: 'Finance Department (Rules Division), Govt. of Rajasthan',
      circularNo: 'FD(Rules) / 2024-26 DA Revision Order',
      verifiedDate: 'मार्च 2026',
      portalUrl: 'https://finance.rajasthan.gov.in'
    },
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'उपयोगी टूल्स', url: 'https://shalasahayak.in/useful-tools' },
      { name: '7वां वेतन कैलकुलेटर', url: 'https://shalasahayak.in/7th-pay-calculator' }
    ],
    howToSteps: [
      { name: 'पे-लेवल चुनें', text: 'अपना 7th Pay Matrix लेवल चुनें (L-10 तृतीय श्रेणी, L-11 द्वितीय श्रेणी, L-12 प्राध्यापक, L-14/15 संस्था प्रधान)।' },
      { name: 'मूल वेतन (Basic Pay) दर्ज करें', text: 'वर्तमान पे-मैट्रिक्स अनुसार अपनी बेसिक पे चुनें या सीधे दर्ज करें।' },
      { name: 'HRA शहर श्रेणी का चयन करें', text: 'Y श्रेणी (10% - जयपुर, जोधपुर, कोटा, बीकानेर, अजमेर) अथवा Z श्रेणी (ग्रामीण व अन्य 20%) चुनें।' },
      { name: 'कटौतियां जांचें व पे-स्लिप प्रिंट करें', text: 'SI, GPF, RGHS व आयकर की कटौतियां स्वतः अपडेट होंगी। विभागीय मुहर सहित पे-स्लिप डाउनलोड करें।' }
    ],
    faqs: [
      {
        question: 'राजस्थान में वर्तमान महंगाई भत्ता (DA) कितना प्रतिशत लागू है?',
        answer: 'राजस्थान सरकार द्वारा वित्त विभाग के आदेशानुसार 1 जनवरी 2026 से महंगाई भत्ता (DA) 60% निर्धारित है।'
      },
      {
        question: 'परिवीक्षा काल (Probation Period) में फिक्स मानदेय पर क्या कोई कटौती होती है?',
        answer: 'परिवीक्षा काल के दौरान राज्य सरकार द्वारा निर्धारित फिक्स मानदेय देय होता है, जिसमें मुख्य रूप से RGHS और आवश्यकता अनुसार GPF/कटौती नियमानुसार लागू होती है।'
      },
      {
        question: 'क्या यह कैलकुलेटर PayManager के वेतन बिल से 100% मेल खाता है?',
        answer: 'हाँ, यह कैलकुलेटर राजस्थान सरकार के पेमैनेजर (PayManager) सॉफ्टवेयर के गणना नियमों एवं फॉर्मूलों पर आधारित है।'
      }
    ],
    relatedTools: [
      { title: '8वां वेतन आयोग कैलकुलेटर', url: '/useful-tools/8thpay', badge: '1.92x' },
      { title: 'दीपावली बोनस कैलकुलेटर', url: '/useful-tools/bonus', badge: '₹6,774' },
      { title: 'वार्षिक वेतन वृद्धि कैलकुलेटर', url: '/annual-increment-calculator', badge: '3%' }
    ],
    toolMapping: { type: 'useful-tools', subtab: 'salary' }
  },

  'rajasthan-salary-calculator': {
    slug: 'rajasthan-salary-calculator',
    title: 'Rajasthan Salary Calculator 2026 – PayManager Salary Slip | Shala Sahayak',
    description: 'राजस्थान शिक्षक एवं कर्मचारी वेतन कैलकुलेटर – पेमैनेजर आधारित वेतन पर्ची, सकल वेतन, कटौतियां व इन-हैंड सैलरी गणना।',
    h1: 'राजस्थान कर्मचारी वेतन कैलकुलेटर (Rajasthan Employee Salary Calculator)',
    canonical: 'https://shalasahayak.in/rajasthan-salary-calculator',
    category: 'salary',
    categoryLabelHi: 'वेतन गणना',
    categoryLabelEn: 'Salary Calculation',
    introTextHi: 'राजस्थान शिक्षा विभाग एवं राज्य सेवा के कार्मिकों हेतु पेमैनेजर स्टाइल वेतन गणना टूल।',
    introTextEn: 'Official PayManager style salary estimation tool for Rajasthan state government employees.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'वेतन कैलकुलेटर', url: 'https://shalasahayak.in/rajasthan-salary-calculator' }
    ],
    faqs: [
      { question: 'वेतन पर्ची कैसे प्रिंट करें?', answer: 'गणना के बाद नीचे दिए गए प्रिंट या पीडीएफ निर्यात बटन पर क्लिक करें।' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' },
      { title: 'डीए कैलकुलेटर', url: '/da-calculator' }
    ],
    toolMapping: { type: 'useful-tools', subtab: 'salary' }
  },

  'da-calculator': {
    slug: 'da-calculator',
    title: 'Rajasthan DA Calculator 2026 – Dearness Allowance 60% | Shala Sahayak',
    description: 'राजस्थान महंगाई भत्ता (DA) कैलकुलेटर – 60% डीए दर पर मूल वेतन अनुसार मासिक डीए राशि व एरियर गणना।',
    h1: 'राजस्थान महंगाई भत्ता (DA) कैलकुलेटर 2026',
    canonical: 'https://shalasahayak.in/da-calculator',
    category: 'salary',
    categoryLabelHi: 'वेतन व भत्ते',
    categoryLabelEn: 'Salary & Allowances',
    introTextHi: 'राजस्थान सरकार के कर्मचारियों एवं पेंशनर्स हेतु 60% महंगाई भत्ते (DA) की सटीक गणना व एरियर तालिका।',
    introTextEn: 'Accurate dearness allowance computation based on current 60% DA notifications in Rajasthan.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'डीए कैलकुलेटर', url: 'https://shalasahayak.in/da-calculator' }
    ],
    faqs: [
      { question: 'डीए की गणना किस फॉर्मूले से होती है?', answer: 'डीए = (मूल वेतन × वर्तमान डीए प्रतिशत) / 100.' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' },
      { title: 'HRA कैलकुलेटर', url: '/hra-calculator' }
    ],
    toolMapping: { type: 'useful-tools', subtab: 'salary' }
  },

  'hra-calculator': {
    slug: 'hra-calculator',
    title: 'Rajasthan HRA Calculator 2026 – House Rent Allowance | Shala Sahayak',
    description: 'राजस्थान मकान किराया भत्ता (HRA) कैलकुलेटर – Y श्रेणी (10%) एवं Z श्रेणी (20%) शहर वर्गीकरण अनुसार HRA गणना।',
    h1: 'राजस्थान मकान किराया भत्ता (HRA) कैलकुलेटर',
    canonical: 'https://shalasahayak.in/hra-calculator',
    category: 'salary',
    categoryLabelHi: 'वेतन व भत्ते',
    categoryLabelEn: 'Salary & Allowances',
    introTextHi: 'राजस्थान सेवा नियमों के तहत जयपुर, जोधपुर, कोटा, अजमेर व बीकानेर (Y श्रेणी) तथा अन्य ग्रामीण क्षेत्रों (Z श्रेणी) हेतु HRA गणना।',
    introTextEn: 'Calculate House Rent Allowance according to Rajasthan city classification categories Y and Z.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'HRA कैलकुलेटर', url: 'https://shalasahayak.in/hra-calculator' }
    ],
    faqs: [
      { question: 'राजस्थान में HRA की वर्तमान दरें क्या हैं?', answer: 'Y श्रेणी शहरों में मूल वेतन का 10% तथा Z श्रेणी (अन्य व ग्रामीण क्षेत्र) में 20% HRA देय होता है।' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' }
    ],
    toolMapping: { type: 'useful-tools', subtab: 'salary' }
  },

  'annual-increment-calculator': {
    slug: 'annual-increment-calculator',
    title: 'Rajasthan Annual Increment Calculator 2026 – 3% Pay Hike | Shala Sahayak',
    description: 'वार्षिक वेतन वृद्धि कैलकुलेटर – 1 जुलाई अथवा 1 जनवरी को 3% वेतन वृद्धि उपरांत नवीन बेसिक पे व पे-मैट्रिक्स सेल निर्धारण।',
    h1: 'राजस्थान वार्षिक वेतन वृद्धि कैलकुलेटर (Annual Increment Calculator)',
    canonical: 'https://shalasahayak.in/annual-increment-calculator',
    category: 'salary',
    categoryLabelHi: 'वेतन निर्धारण',
    categoryLabelEn: 'Pay Fixation',
    introTextHi: 'राजस्थान 7वें वेतन आयोग पे-मैट्रिक्स के तहत 1 जुलाई या 1 जनवरी को देय 3% वार्षिक वेतन वृद्धि (Increment) की सटीक गणना।',
    introTextEn: 'Determine your next basic pay cell in Rajasthan 7th CPC Matrix after 3% annual increment.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'वार्षिक वेतन वृद्धि', url: 'https://shalasahayak.in/annual-increment-calculator' }
    ],
    faqs: [
      { question: 'वार्षिक वेतन वृद्धि कब देय होती है?', answer: 'राजस्थान में 6 माह की न्यूनतम अहक सेवा पूर्ण होने पर वार्षिक वेतन वृद्धि 1 जुलाई अथवा 1 जनवरी को देय होती है।' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' }
    ],
    toolMapping: { type: 'tool', category: 'peeo', subtab: 'increment' }
  },

  // USEFUL TOOLS & CALCULATORS
  'useful-tools/8thpay': {
    slug: 'useful-tools/8thpay',
    title: '8वां वेतन आयोग कैलकुलेटर राजस्थान – संभावित वेतन व फ़िटमेंट फ़ैक्टर | Shala Sahayak',
    description: '8वें वेतन आयोग कैलकुलेटर (8th Pay Commission Calculator) – 1.92x से 3.00x फ़िटमेंट फ़ैक्टर पर 7वें व 8वें वेतन की तुलना, संभावित बेसिक पे व DA समायोजन।',
    h1: '8वां वेतन आयोग कैलकुलेटर एवं वेतन तुलना टूल',
    canonical: 'https://shalasahayak.in/useful-tools/8thpay',
    category: 'tools',
    categoryLabelHi: 'वेतन आयोग',
    categoryLabelEn: 'Pay Commission',
    introTextHi: 'केंद्रीय एवं राजस्थान राज्य कर्मचारियों हेतु प्रस्तावित 8वें वेतन आयोग के विभिन्न फ़िटमेंट फ़ैक्टर (1.92, 2.15, 2.57, 2.86 व 3.00) के आधार पर वेतन वृद्धि का सटीक विश्लेषण।',
    introTextEn: 'Interactive 8th Central Pay Commission projection engine for state employees and educators.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'उपयोगी टूल्स', url: 'https://shalasahayak.in/useful-tools' },
      { name: '8वां वेतन कैलकुलेटर', url: 'https://shalasahayak.in/useful-tools/8thpay' }
    ],
    faqs: [
      { question: '8वें वेतन आयोग में अनुमानित फ़िटमेंट फ़ैक्टर क्या हो सकता है?', answer: 'विशेषज्ञों व कर्मचारी संघों के अनुसार 1.92x से 2.57x के बीच फ़िटमेंट फ़ैक्टर प्रस्तावित होने की सर्वाधिक संभावना है।' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' },
      { title: 'दीपावली बोनस कैलकुलेटर', url: '/useful-tools/bonus' }
    ],
    toolMapping: { type: 'useful-tools', subtab: '8thpay' }
  },

  'useful-tools/bonus': {
    slug: 'useful-tools/bonus',
    title: 'दीपावली तदर्थ बोनस कैलकुलेटर राजस्थान (₹6,774 / ₹7,000) | Shala Sahayak',
    description: 'राजस्थान सरकार दीपावली बोनस कैलकुलेटर – L-1 से L-11 तक 30 व 31 दिन के आधार पर ₹6,774 बोनस, 75% नकद व 25% GPF की स्वतः गणना।',
    h1: 'राजस्थान दीपावली तदर्थ बोनस कैलकुलेटर (Diwali Bonus Calculator)',
    canonical: 'https://shalasahayak.in/useful-tools/bonus',
    category: 'tools',
    categoryLabelHi: 'बोनस',
    categoryLabelEn: 'Bonus',
    introTextHi: 'वित्त विभाग राजस्थान के परिपत्र अनुसार राज्य सेवा के अराजपत्रित कर्मचारियों एवं शिक्षकों हेतु ₹7,000 की सीलिंग पर 30 व 31 दिन के बोनस की गणना।',
    introTextEn: 'Calculate ad-hoc Diwali bonus for Rajasthan non-gazetted employees up to Pay Level L-11.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'उपयोगी टूल्स', url: 'https://shalasahayak.in/useful-tools' },
      { name: 'दीपावली बोनस कैलकुलेटर', url: 'https://shalasahayak.in/useful-tools/bonus' }
    ],
    faqs: [
      { question: 'दीपावली बोनस का भुगतान किस अनुपात में होता है?', answer: 'वित्त विभाग के नियमानुसार 75% राशि नकद वेतन के साथ देय होती है तथा 25% राशि कर्मचारी के GPF खाते में जमा होती है।' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' }
    ],
    toolMapping: { type: 'useful-tools', subtab: 'bonus' }
  },

  'qr-code-generator': {
    slug: 'qr-code-generator',
    title: 'स्कूल क्यूआर कोड जनरेटर – दस्तावेज़, नोटिस व लिंक | Shala Sahayak',
    description: 'राजस्थान विद्यालय क्यूआर कोड जनरेटर – स्कूल परिपत्र, प्रवेश लिंक, नोटिस बोर्ड व शाला दर्पण प्रविष्टियों हेतु कस्टमाइज़्ड QR कोड बनाएं व तुरंत डाउनलोड करें।',
    h1: 'विद्यालय दस्तावेज़ एवं नोटिस क्यूआर कोड जनरेटर',
    canonical: 'https://shalasahayak.in/qr-code-generator',
    category: 'tools',
    categoryLabelHi: 'डिजिटल टूल्स',
    categoryLabelEn: 'Digital Tools',
    introTextHi: 'विद्यालय के नोटिस बोर्ड, विद्यार्थी प्रवेश फॉर्म, व्हाट्सएप ग्रुप एवं आधिकारिक आदेशों को डिजिटल बनाने हेतु निःशुल्क क्यूआर कोड मेकर।',
    introTextEn: 'Create instant, high-resolution QR codes for school circulars, Google Drive documents, and notice boards.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'उपयोगी टूल्स', url: 'https://shalasahayak.in/useful-tools' },
      { name: 'क्यूआर कोड जनरेटर', url: 'https://shalasahayak.in/qr-code-generator' }
    ],
    faqs: [
      { question: 'क्या जनरेट किया गया क्यूआर कोड कभी एक्सपायर होता है?', answer: 'नहीं, यह स्टैण्डर्ड क्यूआर कोड है जो स्थायी रूप से कार्य करता है और कभी एक्सपायर नहीं होता।' }
    ],
    relatedTools: [
      { title: 'एक्सेल कृतिदेव कनवर्टर', url: '/useful-tools/excel' },
      { title: 'परीक्षा सीटिंग प्लान', url: '/exam-seating-plan' }
    ],
    toolMapping: { type: 'useful-tools', subtab: 'qrcode' }
  },

  'useful-tools/excel': {
    slug: 'useful-tools/excel',
    title: 'एक्सेल शीट कृतिदेव से यूनिकोड कनवर्टर (.xlsx / .csv) | Shala Sahayak',
    description: 'एक्सेल शीट कृतिदेव/देवलास/चाणक्य फॉन्ट से शुद्ध हिंदी मंगल/यूनिकोड में ऑटो-कन्वर्ट करें। .xlsx या .csv फाइल अपलोड करें, संपूर्ण वर्कशीट तुरंत बदलें व डाउनलोड करें।',
    h1: 'एक्सेल शीट कृतिदेव से यूनिकोड कनवर्टर (.xlsx / .csv)',
    canonical: 'https://shalasahayak.in/useful-tools/excel',
    category: 'tools',
    categoryLabelHi: 'फॉन्ट कनवर्टर',
    categoryLabelEn: 'Font Converter',
    introTextHi: 'शाला दर्पण, पेमैनेजर व परीक्षा मार्कशीट की एक्सेल फाइलों को बिना त्रुटि शुद्ध हिंदी मंगल यूनिकोड में बदलने का सबसे तेज टूल।',
    introTextEn: 'Bulk spreadsheet KrutiDev to Unicode font converter for school records and registers.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'उपयोगी टूल्स', url: 'https://shalasahayak.in/useful-tools' },
      { name: 'एक्सेल कृतिदेव कन्वर्टर', url: 'https://shalasahayak.in/useful-tools/excel' }
    ],
    faqs: [
      { question: 'क्या एक्सेल फाइल का फॉर्मेट सुरक्षित रहता है?', answer: 'हाँ, कॉलम, पंक्तियाँ एवं सेल संरचना पूरी तरह सुरक्षित रहती है केवल फॉन्ट यूनिकोड में बदलता है।' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' }
    ],
    toolMapping: { type: 'useful-tools', subtab: 'excel' }
  },

  // SHALA DARPAN CLUSTER
  'shala-darpan': {
    slug: 'shala-darpan',
    title: 'Shala Darpan Rajasthan – Portal, Staff Login & School Tools | Shala Sahayak',
    description: 'शाला दर्पण राजस्थान (Integrated Shala Darpan) – विद्यालय लॉगिन, स्टाफ कॉर्नर, विद्यार्थी प्रविष्टि, उपस्थिति व रिजल्ट मॉड्यूल की संपूर्ण मार्गदर्शिका।',
    h1: 'एकीकृत शाला दर्पण राजस्थान (Integrated Shala Darpan Guide)',
    canonical: 'https://shalasahayak.in/shala-darpan',
    category: 'shala-darpan',
    categoryLabelHi: 'शाला दर्पण',
    categoryLabelEn: 'Shala Darpan',
    introTextHi: 'राजस्थान स्कूल शिक्षा परिषद के एकीकृत शाala दर्पण पोर्टल के सभी मॉड्यूल, विद्यालय प्रविष्टियों व स्टाफ कॉर्नर कार्यों की प्रमाणित जानकारी।',
    introTextEn: 'Complete operational manual and helper toolkit for Integrated Shala Darpan Rajasthan portal.',
    lastUpdated: 'मार्च 2026',
    officialSource: {
      deptHi: 'स्कूल शिक्षा विभाग एवं राजस्थान स्कूल शिक्षा परिषद',
      deptEn: 'School Education Department, Govt. of Rajasthan',
      portalUrl: 'https://rajshaladarpan.rajasthan.gov.in'
    },
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'शाला दर्पण गाइड', url: 'https://shalasahayak.in/shala-darpan' }
    ],
    faqs: [
      { question: 'शाला दर्पण स्टाफ कॉर्नर पर लॉगिन कैसे करें?', answer: 'स्टाफ विंडो पर जाकर अपनी 7 अंकों की स्टाफ एनआईसी-एसडी आईडी और पासवर्ड दर्ज करके लॉगिन करें।' }
    ],
    relatedTools: [
      { title: 'शाला दर्पण लॉगिन गाइड', url: '/shala-darpan-login' },
      { title: 'स्टाफ लॉगिन गाइड', url: '/shala-darpan-staff-login' }
    ],
    toolMapping: { type: 'help', blogId: 'shaladarpan-staff-guide' }
  },

  'shala-darpan-login': {
    slug: 'shala-darpan-login',
    title: 'Shala Darpan Login Guide 2026 – School & Staff Corner | Shala Sahayak',
    description: 'शाला दर्पण लॉगिन कैसे करें – विद्यालय लॉगिन (School Login) एवं स्टाफ कॉर्नर (Staff Corner) में पासवर्ड रीसेट, टीसी जारी करने व प्रविष्टि की विधि।',
    h1: 'शाला दर्पण लॉगिन प्रक्रिया एवं समाधान (Shala Darpan Login Guide)',
    canonical: 'https://shalasahayak.in/shala-darpan-login',
    category: 'shala-darpan',
    categoryLabelHi: 'शाला दर्पण',
    categoryLabelEn: 'Shala Darpan',
    introTextHi: 'शाला दर्पण पोर्टल पर विद्यालय लॉगिन एवं स्टाफ लॉगिन के दौरान आने वाली तकनीकी समस्याओं का चरणबद्ध समाधान।',
    introTextEn: 'Step-by-step guide to log in to Shala Darpan School Login and Staff Window with password recovery steps.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'शाला दर्पण लॉगिन', url: 'https://shalasahayak.in/shala-darpan-login' }
    ],
    faqs: [
      { question: 'पासवर्ड भूल जाने पर क्या करें?', answer: 'स्टाफ लॉगिन पेज पर "Forgot Password" पर क्लिक करके पंजीकृत मोबाइल पर ओटीपी प्राप्त कर पासवर्ड रीसेट करें।' }
    ],
    relatedTools: [
      { title: 'शाला दर्पण हब', url: '/shala-darpan' }
    ],
    toolMapping: { type: 'help', blogId: 'shaladarpan-staff-guide' }
  },

  // PAYMANAGER CLUSTER
  'paymanager': {
    slug: 'paymanager',
    title: 'PayManager Rajasthan – Employee Login, Salary Slip & GA-55 | Shala Sahayak',
    description: 'पेमैनेजर राजस्थान (PayManager Portal) – कर्मचारी लॉगिन, मासिक सैलरी स्लिप डाउनलोड, GA-55 वार्षिक आयकर विवरण एवं बिल स्टेटस चेक करने की गाइड।',
    h1: 'पेमैनेजर राजस्थान (PayManager Portal & Employee Services)',
    canonical: 'https://shalasahayak.in/paymanager',
    category: 'paymanager',
    categoryLabelHi: 'पेमैनेजर',
    categoryLabelEn: 'PayManager',
    introTextHi: 'राजस्थान वित्त विभाग के पेमैनेजर पोर्टल पर कर्मचारी लॉगिन, मासिक वेतन पर्ची व कटौती विवरण की प्रमाणित जानकारी।',
    introTextEn: 'Employee self-service guidance for PayManager Rajasthan, pay slip download and tax records.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'पेमैनेजर गाइड', url: 'https://shalasahayak.in/paymanager' }
    ],
    faqs: [
      { question: 'GA-55 क्या होता है?', answer: 'GA-55 कर्मचारी का वार्षिक वेतन एवं कटौती विवरण होता है जो आयकर रिटर्न (ITR) दाखिल करने हेतु आवश्यक होता है।' }
    ],
    relatedTools: [
      { title: 'वेतन पर्ची डाउनलोड गाइड', url: '/paymanager-salary-slip' },
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' }
    ],
    toolMapping: { type: 'help', blogId: 'paymanager-guide' }
  },

  'paymanager-salary-slip': {
    slug: 'paymanager-salary-slip',
    title: 'PayManager Salary Slip Download Guide – Step by Step | Shala Sahayak',
    description: 'पेमैनेजर से मासिक वेतन पर्ची (Salary Slip) कैसे डाउनलोड करें – मोबाइल व कंप्यूटर पर पीडीएफ वेतन पर्ची प्राप्त करने की आसान विधि।',
    h1: 'पेमैनेजर वेतन पर्ची (Salary Slip) डाउनलोड गाइड',
    canonical: 'https://shalasahayak.in/paymanager-salary-slip',
    category: 'paymanager',
    categoryLabelHi: 'पेमैनेजर',
    categoryLabelEn: 'PayManager',
    introTextHi: 'कर्मचारी कॉर्नर में लॉगिन करके अपने किसी भी माह की सैलरी स्लिप पीडीएफ रूप में डाउनलोड करने की प्रक्रिया।',
    introTextEn: 'Step-by-step instructions to download official monthly salary slips from PayManager portal.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'पेमैनेजर', url: 'https://shalasahayak.in/paymanager' },
      { name: 'वेतन पर्ची डाउनलोड', url: 'https://shalasahayak.in/paymanager-salary-slip' }
    ],
    faqs: [
      { question: 'क्या बिना डीडीओ लॉगिन के वेतन पर्ची डाउनलोड हो सकती है?', answer: 'हाँ, प्रत्येक कर्मचारी Employee Corner के माध्यम से स्वयं अपनी वेतन पर्ची डाउनलोड कर सकता है।' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' }
    ],
    toolMapping: { type: 'help', blogId: 'paymanager-guide' }
  },

  // SHIVIRA CLUSTER
  'shivira-panchang': {
    slug: 'shivira-panchang',
    title: 'शिविरा पंचांग 2026-27 (Shivira Panchang) – अकादमिक कैलेंडर | Shala Sahayak',
    description: 'राजस्थान शिविरा पंचांग 2026-27 – माध्यमिक शिक्षा विभाग का आधिकारिक अकादमिक कैलेंडर, मासिक शैक्षणिक गतिविधियां, अवकाश तालिका व परीक्षा तिथियां।',
    h1: 'शिविरा पंचांग 2026-27 (Shivira Panchang Rajasthan)',
    canonical: 'https://shalasahayak.in/shivira-panchang',
    category: 'shivira',
    categoryLabelHi: 'शिविरा पंचांग',
    categoryLabelEn: 'Shivira Calendar',
    introTextHi: 'निदेशालय माध्यमिक शिक्षा राजस्थान, बीकानेर द्वारा जारी आधिकारिक शिविरा पंचांग 2026-27 के अनुसार समस्त मासिक उत्सव, शनिवार गतिविधियां एवं अवकाश।',
    introTextEn: 'Official Rajasthan secondary education department academic calendar and monthly activity timetable.',
    lastUpdated: 'सत्र 2026-27',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'शिविरा पंचांग', url: 'https://shalasahayak.in/shivira-panchang' }
    ],
    faqs: [
      { question: 'नो बैग डे (No Bag Day) किस दिन आयोजित होता है?', answer: 'शिविरा पंचांग अनुसार प्रत्येक शनिवार को विद्यालयों में नो बैग डे के अंतर्गत बाल सभा व विभिन्न थीम आधारित गतिविधियां होती हैं।' }
    ],
    relatedTools: [
      { title: 'पीईईओ टाइम टेबल', url: '/peeo-timetable' },
      { title: 'परीक्षा सीटिंग प्लान', url: '/exam-seating-plan' }
    ],
    toolMapping: { type: 'shivira' }
  },

  // PEEO CLUSTER
  'peeo-tools': {
    slug: 'peeo-tools',
    title: 'PEEO Tools Rajasthan – Order Generator, Timetable & Relieving | Shala Sahayak',
    description: 'पीईईओ टूल्स राजस्थान (PEEO Portal) – कार्यमुक्ति, कार्यग्रहण, आधिकारिक ड्यूटी आदेश जनरेटर, वर्कलोड व समय-सारणी प्रबंधन।',
    h1: 'पीईईओ टूल्स एवं आधिकारिक आदेश जनरेटर (PEEO Toolkit)',
    canonical: 'https://shalasahayak.in/peeo-tools',
    category: 'peeo',
    categoryLabelHi: 'पीईईओ पोर्टल',
    categoryLabelEn: 'PEEO Portal',
    introTextHi: 'पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं यूसीईईओ (UCEEO) हेतु विद्यालय प्रशासनिक कार्य, कार्मिक मैपिंग व आदेश जनरेशन टूलकिट।',
    introTextEn: 'Digital administrative hub for Panchayat Elementary Education Officers in Rajasthan.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'पीईईओ टूल्स', url: 'https://shalasahayak.in/peeo-tools' }
    ],
    faqs: [
      { question: 'पीईईओ आदेश जनरेटर से कौन-से आदेश तैयार किए जा सकते हैं?', answer: 'रिलीविंग ऑर्डर, जॉइनिंग रिपोर्ट, वीक्षक ड्यूटी आदेश, चुनाव व विभागीय ड्यूटी आदेश तुरंत तैयार होते हैं।' }
    ],
    relatedTools: [
      { title: 'पीईईओ आदेश जनरेटर', url: '/peeo-order-generator' },
      { title: 'पीईईओ टाइम टेबल', url: '/peeo-timetable' }
    ],
    toolMapping: { type: 'category', id: 'peeo' }
  },

  'peeo-order-generator': {
    slug: 'peeo-order-generator',
    title: 'PEEO Order Generator – Relieving, Joining & Duty Orders | Shala Sahayak',
    description: 'पीईईओ आदेश जनरेटर – अधीनस्थ विद्यालयों के शिक्षकों हेतु कार्यमुक्ति, कार्यग्रहण व प्रशासनिक आदेश एक क्लिक में विभागीय लेटरहेड पर जनरेट करें।',
    h1: 'पीईईओ आधिकारिक आदेश जनरेटर (PEEO Order Generator)',
    canonical: 'https://shalasahayak.in/peeo-order-generator',
    category: 'peeo',
    categoryLabelHi: 'पीईईओ पोर्टल',
    categoryLabelEn: 'PEEO Portal',
    introTextHi: 'विभागीय क्रमांक व मुहर सहित आधिकारिक भाषा में रिलीविंग, कार्यग्रहण एवं आकस्मिक आदेश प्रिंट तैयार करें।',
    introTextEn: 'Generate official departmental administrative, relieving, and duty orders instantly.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'पीईईओ टूल्स', url: 'https://shalasahayak.in/peeo-tools' },
      { name: 'आदेश जनरेटर', url: 'https://shalasahayak.in/peeo-order-generator' }
    ],
    faqs: [
      { question: 'क्या जनरेट किए गए आदेश में विद्यालय का लेटरहेड शामिल होता है?', answer: 'हाँ, स्कूल प्रोफाइल से विद्यालय का नाम, डाइस कोड व पीईईओ क्षेत्र स्वतः लेटरहेड पर आ जाता है।' }
    ],
    relatedTools: [
      { title: 'पीईईओ टूल्स हब', url: '/peeo-tools' }
    ],
    toolMapping: { type: 'category', id: 'peeo' }
  },

  // MDM CLUSTER
  'mdm': {
    slug: 'mdm',
    title: 'MDM Rajasthan (PM POSHAN) – Register & Cooking Calculator | Shala Sahayak',
    description: 'मिड-डे मील राजस्थान (PM POSHAN) – छात्र उपस्थिति अनुसार गेहूं, चावल, दाल व कन्वर्जन राशि की दैनिक व मासिक गणना एवं स्टॉक रजिस्टर।',
    h1: 'मिड-डे मील (PM POSHAN) एवं बाल गोपाल दूध योजना टूलकिट',
    canonical: 'https://shalasahayak.in/mdm',
    category: 'mdm',
    categoryLabelHi: 'एमडीएम प्रभारी',
    categoryLabelEn: 'MDM Incharge',
    introTextHi: 'राजस्थान प्राथमिक व उच्च प्राथमिक विद्यालयों हेतु पीएम पोषण योजना एवं बाल गोपाल योजना का संपूर्ण दैनिक व मासिक लेखा-जोखा।',
    introTextEn: 'Complete calculation and register management suite for PM POSHAN mid-day meal scheme.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'एमडीएम टूलकिट', url: 'https://shalasahayak.in/mdm' }
    ],
    faqs: [
      { question: 'कक्षा 1 से 5 और 6 से 8 के लिए खाद्यान्न मात्रा क्या है?', answer: 'कक्षा 1 से 5 हेतु 100 ग्राम प्रति छात्र तथा कक्षा 6 से 8 हेतु 150 ग्राम प्रति छात्र निर्धारित है।' }
    ],
    relatedTools: [
      { title: 'एमडीएम कैलकुलेटर', url: '/mdm-calculator' },
      { title: 'क्रीड़ा शुल्क मेकर', url: '/krida-shulk' }
    ],
    toolMapping: { type: 'tool', category: 'incharge', subtab: 'mdm' }
  },

  'mdm-calculator': {
    slug: 'mdm-calculator',
    title: 'MDM Calculator 2026 – Daily & Monthly Consumption | Shala Sahayak',
    description: 'एमडीएम कैलकुलेटर – प्राथमिक व उच्च प्राथमिक कक्षाओं के दैनिक उपभोग खाद्यान्न, तेल, मसाले व सब्जी की राशि का त्वरित हिसाब।',
    h1: 'एमडीएम खाद्यान्न एवं कन्वर्जन कॉस्ट कैलकुलेटर',
    canonical: 'https://shalasahayak.in/mdm-calculator',
    category: 'mdm',
    categoryLabelHi: 'एमडीएम प्रभारी',
    categoryLabelEn: 'MDM Incharge',
    introTextHi: 'दैनिक छात्र उपस्थिति दर्ज करते ही खाद्यान्न व कुकिंग लागत की सटीक गणना।',
    introTextEn: 'Calculate daily and monthly grain consumption and cooking conversion costs for school MDM.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'एमडीएम', url: 'https://shalasahayak.in/mdm' },
      { name: 'एमडीएम कैलकुलेटर', url: 'https://shalasahayak.in/mdm-calculator' }
    ],
    faqs: [
      { question: 'मासिक एमडीएम रिपोर्ट कैसे तैयार करें?', answer: 'दैनिक प्रविष्टियों के योग से मासिक विवरण स्वतः तैयार होता है जिसे सीधे प्रिंट किया जा सकता है।' }
    ],
    relatedTools: [
      { title: 'एमडीएम हब', url: '/mdm' }
    ],
    toolMapping: { type: 'tool', category: 'incharge', subtab: 'mdm' }
  },

  // EXAM CLUSTER
  'exam-tools': {
    slug: 'exam-tools',
    title: 'Exam Tools Rajasthan – Seating Plan, Door Slip & Marksheet | Shala Sahayak',
    description: 'विद्यालय परीक्षा प्रभारी टूलकिट – अर्धवार्षिक एवं वार्षिक बोर्ड परीक्षा बैठक व्यवस्था, डोर स्लिप, डेस्क स्लिप व वीक्षक ड्यूटी रोस्टर।',
    h1: 'विद्यालय परीक्षा प्रबंधन टूलकिट (School Examination Tools)',
    canonical: 'https://shalasahayak.in/exam-tools',
    category: 'exam',
    categoryLabelHi: 'परीक्षा प्रभारी',
    categoryLabelEn: 'Exam Incharge',
    introTextHi: 'कक्षा 1 से 12 तक की सभी आंतरिक व बोर्ड परीक्षाओं हेतु कमरा बैठक व्यवस्था, रोल नंबर आवंटन व मार्कशीट तैयार करने का डिजिटल टूल।',
    introTextEn: 'Generate multi-room exam seating plans, door slips, and invigilation rosters in seconds.',
    lastUpdated: 'सत्र 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'परीक्षा टूल्स', url: 'https://shalasahayak.in/exam-tools' }
    ],
    faqs: [
      { question: 'एक कमरे में दो कक्षाओं की बैठक व्यवस्था कैसे करें?', answer: 'सीटिंग प्लान जनरेटर में दोनों कक्षाओं के रोल नंबर दर्ज करें; सिस्टम स्वतः ज़िग-ज़ैग पैटर्न में बैठक तय कर देगा।' }
    ],
    relatedTools: [
      { title: 'परीक्षा बैठक व्यवस्था', url: '/exam-seating-plan' },
      { title: 'वीक्षक ड्यूटी रोस्टर', url: '/exam-duty-order' }
    ],
    toolMapping: { type: 'tool', category: 'incharge', subtab: 'exam' }
  },

  'exam-seating-plan': {
    slug: 'exam-seating-plan',
    title: 'Exam Seating Plan Generator – Room & Desk Arrangement | Shala Sahayak',
    description: 'परीक्षा बैठक व्यवस्था जनरेटर – कक्षावार रोल नंबर अनुसार कमरा बैठक व्यवस्था, डेस्क स्लिप व डोर स्लिप प्रिंट निकालें।',
    h1: 'परीक्षा बैठक व्यवस्था एवं डोर स्लिप जनरेटर',
    canonical: 'https://shalasahayak.in/exam-seating-plan',
    category: 'exam',
    categoryLabelHi: 'परीक्षा प्रभारी',
    categoryLabelEn: 'Exam Incharge',
    introTextHi: 'अर्धवार्षिक एवं वार्षिक परीक्षाओं में पारदर्शी व नकल-मुक्त बैठक व्यवस्था तैयार करें।',
    introTextEn: 'Create systematic room-wise and desk-wise exam seating plans with printable door slips.',
    lastUpdated: 'सत्र 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'परीक्षा टूल्स', url: 'https://shalasahayak.in/exam-tools' },
      { name: 'सीटिंग प्लान', url: 'https://shalasahayak.in/exam-seating-plan' }
    ],
    faqs: [
      { question: 'क्या डोर स्लिप सीधे A4 पेपर पर प्रिंट हो सकती है?', answer: 'हाँ, प्रत्येक कमरे की डोर स्लिप A4 फॉर्मेट में प्रिंट हेतु अनुकूलित है।' }
    ],
    relatedTools: [
      { title: 'परीक्षा टूल्स हब', url: '/exam-tools' }
    ],
    toolMapping: { type: 'tool', category: 'incharge', subtab: 'exam' }
  },

  // SCHOOL FORMATS CLUSTER
  'school-formats': {
    slug: 'school-formats',
    title: 'Rajasthan School Formats & Applications – Editable Templates | Shala Sahayak',
    description: 'राजस्थान विद्यालय एवं शिक्षक प्रपत्र (School Formats) – अवकाश प्रार्थना पत्र, कार्यमुक्ति, कार्यग्रहण, चरित्र प्रमाण पत्र व विभागीय प्रारूप।',
    h1: 'राजस्थान विद्यालय एवं शिक्षक प्रपत्र (Official School Formats)',
    canonical: 'https://shalasahayak.in/school-formats',
    category: 'formats',
    categoryLabelHi: 'प्रारूप व आवेदन',
    categoryLabelEn: 'Formats & Letters',
    introTextHi: 'राजकीय विद्यालयों के दैनिक कार्यों हेतु शुद्ध हिंदी में संपादित करने योग्य आधिकारिक प्रपत्र।',
    introTextEn: 'Curated repository of official school office formats, applications, and certificates.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'प्रारूप व आवेदन', url: 'https://shalasahayak.in/school-formats' }
    ],
    faqs: [
      { question: 'क्या इन प्रारूपों को वर्ड या पीडीएफ में डाउनलोड किया जा सकता है?', answer: 'हाँ, सभी प्रपत्रों को सीधे स्क्रीन पर भरकर प्रिंट या पीडीएफ में सेव किया जा सकता है।' }
    ],
    relatedTools: [
      { title: 'पीईईओ आदेश जनरेटर', url: '/peeo-order-generator' }
    ],
    toolMapping: { type: 'tool', category: 'portals', subtab: 'formats' }
  },

  // KRIDA SHULK
  'krida-shulk': {
    slug: 'krida-shulk',
    title: 'Krida Shulk Maker Rajasthan – Sports Fee Format Ka & Kha | Shala Sahayak',
    description: 'क्रीड़ा शुल्क प्रपत्र मेकर राजस्थान – कक्षा 6 से 12 तक छात्र संख्या अनुसार प्रारूप क व ख की स्वतः गणना एवं प्रिंट।',
    h1: 'क्रीड़ा शुल्क प्रपत्र मेकर (Sports Fee Generator)',
    canonical: 'https://shalasahayak.in/krida-shulk',
    category: 'tools',
    categoryLabelHi: 'पीटीआई टूल्स',
    categoryLabelEn: 'PTI Tools',
    introTextHi: 'राजस्थान शिक्षा विभाग के खेलकूद नियमों के अनुसार विद्यालय, जिला व राज्य क्रीड़ा कोष हेतु शुल्क विभाजन की स्वतः गणना।',
    introTextEn: 'Calculate school sports fee distributions for formats Ka and Kha with one click.',
    lastUpdated: 'मार्च 2026',
    breadcrumbs: [
      { name: 'होम', url: 'https://shalasahayak.in/' },
      { name: 'क्रीड़ा शुल्क मेकर', url: 'https://shalasahayak.in/krida-shulk' }
    ],
    faqs: [
      { question: 'कक्षावार क्रीड़ा शुल्क की दरें क्या हैं?', answer: 'उच्च प्राथमिक, माध्यमिक एवं उच्च माध्यमिक कक्षाओं हेतु विभागीय आदेशानुसार निर्धारित दरें लागू होती हैं।' }
    ],
    relatedTools: [
      { title: '7वां वेतन कैलकुलेटर', url: '/7th-pay-calculator' }
    ],
    toolMapping: { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'kridaShulk' }
  }
};

/**
 * Helper to get SEO config for a given route slug or pathname
 */
export function getSeoPageConfig(route: string): SeoPageConfig | undefined {
  const cleanRoute = route.replace(/^\//, '').replace(/\/$/, '').toLowerCase();
  
  if (SEO_PAGES_CONFIG[cleanRoute]) {
    return SEO_PAGES_CONFIG[cleanRoute];
  }

  // Check aliases
  const aliasMap: Record<string, string> = {
    'useful-tools': '7th-pay-calculator',
    '8thpay': 'useful-tools/8thpay',
    'bonus': 'useful-tools/bonus',
    'diwali-bonus': 'useful-tools/bonus',
    'salary': '7th-pay-calculator',
    'salary-calc': '7th-pay-calculator',
    'salary-calculator': '7th-pay-calculator',
    'excel': 'useful-tools/excel',
    'excel-sheet': 'useful-tools/excel',
    'qrcode': 'qr-code-generator',
    'peeo': 'peeo-tools',
    'peeo-order': 'peeo-order-generator',
    'peeo-relieving-order': 'peeo-order-generator',
    'peeo-duty-order': 'peeo-order-generator',
    'peeo-timetable/generator': 'peeo-tools',
    'peeo-increment/calculator': 'annual-increment-calculator',
    'staff-increment': 'annual-increment-calculator',
    'mid-day-meal': 'mdm',
    'incharge-mdm': 'mdm',
    'formats': 'school-formats',
    'school-office-formats': 'school-formats',
    'teacher-formats': 'school-formats',
    'peeo-formats': 'school-formats',
    'exam': 'exam-tools',
    'door-slip-generator': 'exam-seating-plan',
    'incharge-exam': 'exam-tools',
    'shivira': 'shivira-panchang',
    'shivira-panchang-2026-27': 'shivira-panchang',
    'rajasthan-school-calendar-2026-27': 'shivira-panchang',
    'rajasthan-school-holidays-2026-27': 'shivira-panchang',
    'shala-darpan-staff-login': 'shala-darpan-login',
    'shala-darpan-school-login': 'shala-darpan-login',
    'paymanager-login': 'paymanager',
    'rajasthan-7th-pay-matrix': '7th-pay-calculator',
    'pay-fixation-calculator': 'annual-increment-calculator'
  };

  if (aliasMap[cleanRoute] && SEO_PAGES_CONFIG[aliasMap[cleanRoute]]) {
    return SEO_PAGES_CONFIG[aliasMap[cleanRoute]];
  }

  return undefined;
}
