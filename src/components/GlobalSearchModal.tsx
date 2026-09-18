import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  Calculator,
  BookOpen,
  FileText,
  Settings,
  Globe,
  ArrowRight,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Layers,
  Check
} from 'lucide-react';
import { Language, SchoolProfile } from '../types';

export interface SearchItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: 'calculator' | 'guide' | 'format' | 'portal' | 'setting' | 'peeo' | 'exam';
  categoryLabelHi: string;
  categoryLabelEn: string;
  keywords: string[];
  descriptionHi: string;
  descriptionEn: string;
  routePath?: string;
  actionType: 'nav' | 'external' | 'setting';
  url?: string;
  badge?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onNavigate: (path: string) => void;
  onOpenSettings?: () => void;
  onToggleLang?: () => void;
  onToggleDarkMode?: () => void;
}

// Full Search Directory covering Tools, Calculators, Guides, Formats & Portals
const SEARCH_DIRECTORY: SearchItem[] = [
  // Calculators & Tools
  {
    id: 'salary-calc',
    titleHi: 'राजस्थान 7वां वेतन कैलकुलेटर (PayManager)',
    titleEn: 'Rajasthan 7th CPC Salary Calculator',
    category: 'calculator',
    categoryLabelHi: 'कैलकुलेटर',
    categoryLabelEn: 'Calculator',
    keywords: ['salary', 'paymanager', '7th pay', 'da 60%', 'hra', 'rsr', 'gpf', 'si', 'वेतन', 'पेमैनेजर', 'डीए', 'सातवां वेतन', 'कटौती', 'पे-स्लिप'],
    descriptionHi: 'पे-लेवल L-1 से L-16, 60% डीए, HRA (10%/20%), SI व GPF कटौतियों के साथ शुद्ध वेतन गणना व पे-स्लिप प्रिंट।',
    descriptionEn: 'Calculate 7th CPC Rajasthan salary with 60% DA, HRA, GPF, SI and print salary slip.',
    routePath: '/7th-pay-calculator',
    actionType: 'nav',
    badge: 'DA 60%'
  },
  {
    id: '8th-pay-calc',
    titleHi: '8वां वेतन आयोग कैलकुलेटर व फ़िटमेंट फ़ैक्टर',
    titleEn: '8th Pay Commission Calculator & Fitment Factor',
    category: 'calculator',
    categoryLabelHi: 'कैलकुलेटर',
    categoryLabelEn: 'Calculator',
    keywords: ['8th pay', 'fitment factor', '8th cpc', 'pay matrix', 'आठवां वेतन', 'वेतन आयोग', 'फ़िटमेंट'],
    descriptionHi: '1.92x से 3.00x फ़िटमेंट फ़ैक्टर पर 7वें व 8वें वेतन की तुलना व अनुमानित वृद्धि।',
    descriptionEn: 'Compare 7th vs 8th CPC emoluments with fitment factor projections.',
    routePath: '/useful-tools/8thpay',
    actionType: 'nav',
    badge: '1.92x - 3.00x'
  },
  {
    id: 'diwali-bonus-calc',
    titleHi: 'दीपावली तदर्थ बोनस कैलकुलेटर (₹6,774)',
    titleEn: 'Diwali Ad-hoc Bonus Calculator',
    category: 'calculator',
    categoryLabelHi: 'कैलकुलेटर',
    categoryLabelEn: 'Calculator',
    keywords: ['bonus', 'diwali bonus', 'ad-hoc', '6774', '7000', 'बोनस', 'दीपावली', 'तदर्थ'],
    descriptionHi: 'पे-लेवल L-1 से L-11 तक ₹7,000 सीलिंग पर ₹6,774 बोनस, 75% नकद व 25% GPF गणना।',
    descriptionEn: 'Compute Diwali bonus for state employees with 75% cash and 25% GPF split.',
    routePath: '/useful-tools/bonus',
    actionType: 'nav',
    badge: '₹6,774'
  },
  {
    id: 'qr-code-gen',
    titleHi: 'स्कूल क्यूआर कोड जनरेटर (Notice & Links)',
    titleEn: 'School QR Code Generator',
    category: 'calculator',
    categoryLabelHi: 'टूल्स',
    categoryLabelEn: 'Tool',
    keywords: ['qr code', 'qrcode', 'notice', 'scanner', 'क्यूआर कोड', 'सर्कुलर', 'नोटिस'],
    descriptionHi: 'स्कूल परिपत्र, प्रवेश लिंक व नोटिस बोर्ड घोषणाओं हेतु कस्टमाइज़्ड QR कोड बनाएं व डाउनलोड करें।',
    descriptionEn: 'Generate and download QR codes for school documents, admissions and notice boards.',
    routePath: '/qr-code-generator',
    actionType: 'nav',
    badge: 'नया'
  },
  {
    id: 'excel-unicode',
    titleHi: 'एक्सेल शीट कृतिदेव से यूनिकोड कन्वर्टर',
    titleEn: 'Excel Sheet KrutiDev to Unicode Converter',
    category: 'calculator',
    categoryLabelHi: 'टूल्स',
    categoryLabelEn: 'Tool',
    keywords: ['excel', 'krutidev', 'unicode', 'mangal', 'font converter', 'एक्सेल', 'कृतिदेव', 'यूनिकोड'],
    descriptionHi: '.xlsx या .csv फाइल से कृतिदेव फॉन्ट को शुद्ध हिंदी मंगल यूनिकोड में ऑटो-कन्वर्ट करें।',
    descriptionEn: 'Upload spreadsheet and auto-convert KrutiDev to pure Hindi Unicode.',
    routePath: '/useful-tools/excel',
    actionType: 'nav'
  },
  {
    id: 'mdm-calc',
    titleHi: 'एमडीएम (MDM) खाद्यान्न व कुकिंग कन्वर्जन कैलकुलेटर',
    titleEn: 'MDM Grain & Cooking Cost Calculator',
    category: 'calculator',
    categoryLabelHi: 'एमडीएम',
    categoryLabelEn: 'MDM',
    keywords: ['mdm', 'mid day meal', 'cooking conversion', 'wheat', 'rice', 'एमडीएम', 'मध्याह्न भोजन', 'गेहूं', 'चावल', 'कुकिंग'],
    descriptionHi: 'छात्र उपस्थिति अनुसार गेहूं, चावल व कन्वर्जन राशि की दैनिक व मासिक गणना।',
    descriptionEn: 'Daily and monthly grain and cooking cost calculations for PM POSHAN.',
    routePath: '/mdm-calculator',
    actionType: 'nav'
  },
  {
    id: 'krida-shulk',
    titleHi: 'क्रीड़ा शुल्क प्रपत्र मेकर (प्रारूप क व ख)',
    titleEn: 'Sports Fee Maker (Format Ka & Kha)',
    category: 'calculator',
    categoryLabelHi: 'पीटीआई',
    categoryLabelEn: 'PTI',
    keywords: ['krida shulk', 'sports fee', 'pti', 'क्रीड़ा शुल्क', 'खेलकूद', 'प्रारूप क'],
    descriptionHi: 'कक्षा 6 से 12 तक छात्र संख्या अनुसार क्रीड़ा शुल्क की ऑटो-गणना व अधिकृत प्रारूप प्रिंट।',
    descriptionEn: 'Calculate school sports fund shares and print departmental format.',
    routePath: '/krida-shulk',
    actionType: 'nav'
  },
  {
    id: 'exam-seating',
    titleHi: 'परीक्षा बैठक व्यवस्था व रूम सीटिंग प्लान जनरेटर',
    titleEn: 'Exam Seating Arrangement & Door Slip Generator',
    category: 'exam',
    categoryLabelHi: 'परीक्षा',
    categoryLabelEn: 'Exam',
    keywords: ['exam seating', 'seating plan', 'door slip', 'roll number', 'परीक्षा सीटिंग', 'बैठक व्यवस्था', 'डोर स्लिप'],
    descriptionHi: 'कक्षावार रोल नंबर अनुसार कमरा बैठक व्यवस्था, डेस्क स्लिप व डोर स्लिप प्रिंट निकालें।',
    descriptionEn: 'Generate multi-class exam seating plans, desk stickers and door slips.',
    routePath: '/exam-seating-plan',
    actionType: 'nav'
  },
  {
    id: 'exam-roster',
    titleHi: 'वीक्षक ड्यूटी रोस्टर (Invigilator Roster)',
    titleEn: 'Exam Invigilator Duty Roster',
    category: 'exam',
    categoryLabelHi: 'परीक्षा',
    categoryLabelEn: 'Exam',
    keywords: ['invigilator', 'duty roster', 'exam duty', 'वीक्षक', 'परीक्षा ड्यूटी'],
    descriptionHi: 'शिक्षकों की पारीवार व दिनांकवार वीक्षक ड्यूटी आवंटन व नोटिस प्रिंट।',
    descriptionEn: 'Assign and balance teacher invigilation exam duties.',
    routePath: '/exam-duty-order',
    actionType: 'nav'
  },
  {
    id: 'peeo-orders',
    titleHi: 'पीईईओ आधिकारिक आदेश व ड्यूटी जनरेटर',
    titleEn: 'PEEO Official Order & Duty Generator',
    category: 'peeo',
    categoryLabelHi: 'पीईईओ',
    categoryLabelEn: 'PEEO',
    keywords: ['peeo order', 'relieving', 'joining', 'duty order', 'पीईईओ', 'कार्यमुक्ति', 'कार्यग्रहण'],
    descriptionHi: 'अधीनस्थ विद्यालयों हेतु कार्यमुक्ति, रिलीविंग, कार्यग्रहण व प्रशासनिक आदेश जनरेटर।',
    descriptionEn: 'Draft official PEEO relieving, joining, and administrative orders.',
    routePath: '/peeo-order-generator',
    actionType: 'nav'
  },
  {
    id: 'peeo-timetable',
    titleHi: 'पीईईओ एवं स्कूल समय-सारणी (Timetable Generator)',
    titleEn: 'School Timetable & Workload Generator',
    category: 'peeo',
    categoryLabelHi: 'पीईईओ',
    categoryLabelEn: 'PEEO',
    keywords: ['timetable', 'workload', 'period', 'समय सारणी', 'कालखंड', 'वर्कलोड'],
    descriptionHi: 'शिविरा नियमानुसार शिक्षक वर्कलोड व कक्षावार टाइम टेबल तैयार करें।',
    descriptionEn: 'Generate clash-free teacher and class period timetables.',
    routePath: '/peeo-timetable',
    actionType: 'nav'
  },

  // Guides & Documentation
  {
    id: 'guide-salary',
    titleHi: 'गाइड: राजस्थान वेतन व 60% डीए गणना नियम',
    titleEn: 'Guide: Rajasthan Salary & 60% DA Rules',
    category: 'guide',
    categoryLabelHi: 'मार्गदर्शिका',
    categoryLabelEn: 'Guide',
    keywords: ['salary guide', 'da rules', 'rsr rules', 'वेतन नियम', 'डीए आदेश', 'गाइड'],
    descriptionHi: 'पे-मैट्रिक्स L-1 से L-16, डीए, HRA, SI, GPF व आयकर की चरणबद्ध सरकारी मार्गदर्शिका।',
    descriptionEn: 'Step-by-step rules guide for Rajasthan teacher pay calculations.',
    routePath: '/help?help=paymatrix-guide',
    actionType: 'nav'
  },
  {
    id: 'guide-8thpay',
    titleHi: 'गाइड: 8वां वेतन आयोग फ़िटमेंट व वेतन वृद्धि विश्लेषण',
    titleEn: 'Guide: 8th Pay Commission Fitment & Projections',
    category: 'guide',
    categoryLabelHi: 'मार्गदर्शिका',
    categoryLabelEn: 'Guide',
    keywords: ['8th pay guide', 'fitment guide', '8वां वेतन गाइड'],
    descriptionHi: '1.92x से 3.00x संभावित फ़िटमेंट फ़ैक्टर व कर्मचारी महासंघ की मांगों का आधिकारिक विश्लेषण।',
    descriptionEn: 'In-depth analysis of 8th CPC proposals and fitment factor calculations.',
    routePath: '/help?help=useful-8thpay-guide',
    actionType: 'nav'
  },
  {
    id: 'guide-bonus',
    titleHi: 'गाइड: दीपावली तदर्थ बोनस ₹6,774 व 75:25 नियम',
    titleEn: 'Guide: Diwali Bonus ₹6,774 & 75:25 Split Rules',
    category: 'guide',
    categoryLabelHi: 'मार्गदर्शिका',
    categoryLabelEn: 'Guide',
    keywords: ['bonus guide', 'diwali rules', 'बोनस नियम गाइड'],
    descriptionHi: 'वित्त विभाग परिपत्र अनुसार बोनस पात्रता, गणना सूत्र एवं 75% नकद / 25% GPF जमा नियम।',
    descriptionEn: 'Finance Department circulars for Diwali bonus calculation and disbursement.',
    routePath: '/help?help=useful-bonus-guide',
    actionType: 'nav'
  },
  {
    id: 'guide-excel',
    titleHi: 'गाइड: एक्सेल शीट कृतिदेव से यूनिकोड रूपांतरण',
    titleEn: 'Guide: Excel KrutiDev to Unicode Conversion',
    category: 'guide',
    categoryLabelHi: 'मार्गदर्शिका',
    categoryLabelEn: 'Guide',
    keywords: ['excel guide', 'krutidev guide', 'फॉन्ट गाइड'],
    descriptionHi: 'शाला दर्पण, पेमैनेजर व परीक्षा मार्कशीट की एक्सेल फाइलों को बिना त्रुटि यूनिकोड में बदलने की विधि।',
    descriptionEn: 'Guide on converting legacy KrutiDev spreadsheet data to clean Unicode.',
    routePath: '/help?help=useful-excel-guide',
    actionType: 'nav'
  },

  // Portals & Calendars
  {
    id: 'portal-shivira',
    titleHi: 'शिविरा पंचांग 2026-27 (Shivira Panchang)',
    titleEn: 'Shivira Panchang 2026-27 Academic Calendar',
    category: 'portal',
    categoryLabelHi: 'पंचांग',
    categoryLabelEn: 'Calendar',
    keywords: ['shivira', 'panchang', 'holidays', 'academic calendar', 'शिविरा', 'पंचांग', 'अवकाश', 'कैलेंडर'],
    descriptionHi: 'राजस्थान शिक्षा विभाग का आधिकारिक अकादमिक पंचांग, मासिक अवकाश व कार्यदिवस सूची।',
    descriptionEn: 'Official Rajasthan school academic calendar, holidays, and working days.',
    routePath: '/shivira-panchang',
    actionType: 'nav',
    badge: '2026-27'
  },
  {
    id: 'portal-shaladarpan',
    titleHi: 'शाला दर्पण पोर्टल व स्टाफ लॉगिन गाइड',
    titleEn: 'Shala Darpan Portal & Staff Login Guide',
    category: 'portal',
    categoryLabelHi: 'पोर्टल',
    categoryLabelEn: 'Portal',
    keywords: ['shala darpan', 'rajshaladarpan', 'staff login', 'school login', 'शाला दर्पण', 'स्टाफ लॉगिन'],
    descriptionHi: 'शाला दर्पण स्टाफ कॉर्नर, विद्यालय लॉगिन, विद्यार्थी प्रविष्टि व टीसी मॉड्यूल।',
    descriptionEn: 'Direct guidance for Shala Darpan staff login, student entry and portal tasks.',
    routePath: '/shala-darpan-login',
    actionType: 'nav'
  },
  {
    id: 'portal-paymanager',
    titleHi: 'पेमैनेजर पोर्टल (PayManager Rajasthan)',
    titleEn: 'PayManager Rajasthan Portal & Salary Slip',
    category: 'portal',
    categoryLabelHi: 'पोर्टल',
    categoryLabelEn: 'Portal',
    keywords: ['paymanager', 'salary slip', 'ga55', 'income tax', 'पेमैनेजर', 'वेतन पर्ची', 'जीए 55'],
    descriptionHi: 'पेमैनेजर कर्मचारी लॉगिन, मासिक सैलरी स्लिप डाउनलोड व GA-55 विवरण।',
    descriptionEn: 'PayManager employee login, monthly pay slip download and GA-55 details.',
    routePath: '/paymanager-salary-slip',
    actionType: 'nav'
  },

  // Formats & Downloads
  {
    id: 'format-hub',
    titleHi: 'राजस्थान विद्यालय प्रारूप व आवेदन प्रपत्र (Formats)',
    titleEn: 'Rajasthan School Formats & Application Templates',
    category: 'format',
    categoryLabelHi: 'फॉर्मेट',
    categoryLabelEn: 'Format',
    keywords: ['formats', 'application', 'leave application', 'joining report', 'प्रारूप', 'प्रपत्र', 'अवकाश आवेदन'],
    descriptionHi: 'आकस्मिक अवकाश, बाल्य देखभाल अवकाश, कार्यग्रहण, रिलीविंग व विभागीय प्रपत्र।',
    descriptionEn: 'Official editable formats for school leaves, applications and certificates.',
    routePath: '/school-formats',
    actionType: 'nav'
  },

  // Application Settings
  {
    id: 'setting-profile',
    titleHi: 'विद्यालय प्रोफाइल एवं सेटिंग्स (School Profile)',
    titleEn: 'School Profile & Settings',
    category: 'setting',
    categoryLabelHi: 'सेटिंग',
    categoryLabelEn: 'Setting',
    keywords: ['school profile', 'settings', 'udise', 'peeo name', 'स्कूल प्रोफाइल', 'सेटिंग्स', 'डाइस कोड'],
    descriptionHi: 'विद्यालय का नाम, यू-डाइस कोड, पीईईओ क्षेत्र व संस्था प्रधान का नाम सेट करें।',
    descriptionEn: 'Configure school name, UDISE code, PEEO cluster and headmaster details.',
    actionType: 'setting'
  }
];

/**
 * Fuzzy Search Scoring Algorithm:
 * Evaluates match strength based on exact match, substring, word prefixes, and character sequence distance
 */
function calculateFuzzyScore(query: string, item: SearchItem): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const targetTexts = [
    item.titleHi.toLowerCase(),
    item.titleEn.toLowerCase(),
    item.descriptionHi.toLowerCase(),
    item.descriptionEn.toLowerCase(),
    ...item.keywords.map(k => k.toLowerCase())
  ];

  let maxScore = 0;

  for (const text of targetTexts) {
    let score = 0;

    // Exact match
    if (text === q) {
      score += 150;
    }
    // Starts with query
    else if (text.startsWith(q)) {
      score += 100;
    }
    // Substring match
    else if (text.includes(q)) {
      score += 70;
    } else {
      // Fuzzy character sequence matching (e.g. "sd" matches "shala darpan")
      let qIdx = 0;
      let consecutive = 0;
      let matchedChars = 0;

      for (let i = 0; i < text.length && qIdx < q.length; i++) {
        if (text[i] === q[qIdx]) {
          qIdx++;
          matchedChars++;
          consecutive++;
          score += 5 + consecutive * 2;
        } else {
          consecutive = 0;
        }
      }

      if (qIdx === q.length) {
        score += 30;
      } else {
        score = 0; // Did not match all characters in sequence
      }
    }

    if (score > maxScore) {
      maxScore = score;
    }
  }

  return maxScore;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  lang,
  onNavigate,
  onOpenSettings,
  onToggleLang,
  onToggleDarkMode
}) => {
  const isHi = lang === 'hi';
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via synthetic click on search button if available
          const btn = document.getElementById('global-search-trigger-btn');
          btn?.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter and rank search results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    let items = SEARCH_DIRECTORY;
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    if (!q) {
      // Default recommended / popular items
      return items.slice(0, 10);
    }

    const scored = items.map(item => ({
      item,
      score: calculateFuzzyScore(q, item)
    })).filter(x => x.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored.map(x => x.item);
  }, [query, selectedCategory]);

  // Handle keyboard navigation in result list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.actionType === 'setting') {
      if (onOpenSettings) onOpenSettings();
    } else if (item.actionType === 'external' && item.url) {
      window.open(item.url, '_blank');
    } else if (item.routePath) {
      onNavigate(item.routePath);
    }
  };

  if (!isOpen) return null;

  const categories = [
    { id: 'all', labelHi: 'सभी (All)', labelEn: 'All' },
    { id: 'calculator', labelHi: 'कैलकुलेटर (Calculators)', labelEn: 'Calculators' },
    { id: 'guide', labelHi: 'गाइड (Guides)', labelEn: 'Guides' },
    { id: 'exam', labelHi: 'परीक्षा (Exam)', labelEn: 'Exam' },
    { id: 'peeo', labelHi: 'पीईईओ (PEEO)', labelEn: 'PEEO' },
    { id: 'portal', labelHi: 'पोर्टल (Portals)', labelEn: 'Portals' },
    { id: 'format', labelHi: 'प्रारूप (Formats)', labelEn: 'Formats' }
  ];

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-start justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mt-6 sm:mt-12 flex flex-col max-h-[85vh] animate-scaleUp"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={isHi ? 'खोजें: 7वां वेतन, 8वां वेतन, बोनस, शिविरा, सीटिंग प्लान, QR कोड...' : 'Search 40+ tools, calculators, guides & settings...'}
            className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {isHi ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 sm:p-3 space-y-1.5 max-h-[50vh]">
          {results.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                {isHi ? `"${query}" हेतु कोई परिणाम नहीं मिला` : `No results found for "${query}"`}
              </p>
              <p className="text-xs text-slate-400">
                {isHi ? 'वेतन, बोनस, एमडीएम, शिविरा या परीक्षा लिखकर पुनः प्रयास करें।' : 'Try searching for salary, bonus, mdm, shivira or exam.'}
              </p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/60 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.category === 'calculator'
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : item.category === 'guide'
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                        : item.category === 'peeo'
                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        : item.category === 'exam'
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        : item.category === 'setting'
                        ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {item.category === 'calculator' && <Calculator className="w-4 h-4" />}
                      {item.category === 'guide' && <BookOpen className="w-4 h-4" />}
                      {item.category === 'peeo' && <ShieldCheck className="w-4 h-4" />}
                      {item.category === 'exam' && <GraduationCap className="w-4 h-4" />}
                      {item.category === 'portal' && <Globe className="w-4 h-4" />}
                      {item.category === 'format' && <FileText className="w-4 h-4" />}
                      {item.category === 'setting' && <Settings className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                          {isHi ? item.titleHi : item.titleEn}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {isHi ? item.descriptionHi : item.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-slate-400">
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1 text-emerald-600' : ''}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Search Modal Footer Shortcuts */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border text-[10px]">↓</kbd>
              {isHi ? 'नेविगेट' : 'Navigate'}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border text-[10px]">↵</kbd>
              {isHi ? 'खोलें' : 'Open'}
            </span>
          </div>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            {isHi ? `${results.length} टूल्स व मार्गदर्शिकाएं` : `${results.length} items`}
          </span>
        </div>
      </div>
    </div>
  );
};
