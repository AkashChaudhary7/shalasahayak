import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  Gift, 
  Coins, 
  FileSpreadsheet, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  Info, 
  Sparkles, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../../types';
import { UsefulToolsSubTab } from '../SectionUsefulTools';

interface UsefulToolsRulesGuideProps {
  lang: Language;
  onNavigateToTab?: (tab: UsefulToolsSubTab) => void;
}

export const UsefulToolsRulesGuide: React.FC<UsefulToolsRulesGuideProps> = ({ 
  lang,
  onNavigateToTab 
}) => {
  const isHi = lang === 'hi';
  const [activeCategory, setActiveCategory] = useState<'all' | 'bonus' | 'salary' | '8thpay' | 'excel'>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('bonus-rules');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white shadow-xl border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0 shadow-inner">
            <BookOpen className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight">
                {isHi ? 'राजस्थान सरकार नियम, शासनादेश एवं टूल्स गाइड' : 'Rajasthan Govt Rules & Tools User Manual'}
              </h2>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                {isHi ? 'अद्यतन सितम्बर 2026' : 'Updated Sep 2026'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-1">
              {isHi 
                ? 'राजस्थान सेवा नियम (RSR), वित्त विभाग परिपत्र, 8वां वेतन आयोग विश्लेषण व प्रत्येक टूल के उपयोग की चरणबद्ध गाइड'
                : 'Rajasthan Service Rules, Finance Dept Circulars, 8th CPC analysis & step-by-step user tutorials'}
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isHi ? 'सभी नियम व गाइड' : 'All Rules'}
          </button>
          <button
            onClick={() => setActiveCategory('bonus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === 'bonus'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isHi ? 'तदर्थ बोनस' : 'Bonus'}
          </button>
          <button
            onClick={() => setActiveCategory('salary')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === 'salary'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isHi ? 'वेतन (RSR)' : 'Salary'}
          </button>
          <button
            onClick={() => setActiveCategory('8thpay')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === '8thpay'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isHi ? '8वां वेतन' : '8th CPC'}
          </button>
          <button
            onClick={() => setActiveCategory('excel')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === 'excel'
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isHi ? 'एक्सेल शीट' : 'Excel Sheet'}
          </button>
        </div>
      </div>

      {/* QUICK LAUNCH CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('bonus')}
          className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 border border-orange-200 dark:border-orange-800/60 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-600 text-white">
              {isHi ? 'नया टूल' : 'New Tool'}
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors">
            {isHi ? 'दीपावली बोनस कैलकुलेटर' : 'Diwali Bonus Calculator'}
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isHi ? 'अधिकतम ₹6,774 • 75% नकद + 25% GPF विभाजन एवं कार्यालय आदेश जनरेटर' : 'Max ₹6,774 • 75% Cash + 25% GPF split & sanction order draft'}
          </p>
          <div className="flex items-center text-orange-600 dark:text-orange-400 font-bold text-xs mt-3">
            <span>{isHi ? 'टूल खोलें' : 'Open Tool'}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('salary')}
          className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/60 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              RSR Pay
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
            {isHi ? 'राजस्थान वेतन कैलकुलेटर (RSR)' : 'Rajasthan Salary Calculator'}
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isHi ? 'पे-मैट्रिक्स L1-L16, डीए 60%, HRA (10%/20%), SI, GPF व RGHS स्लैब' : 'L1-L16 Pay Matrix, 60% DA, 10%/20% HRA, SI, GPF & RGHS deductions'}
          </p>
          <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-xs mt-3">
            <span>{isHi ? 'टूल खोलें' : 'Open Tool'}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('8thpay')}
          className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/40 dark:to-emerald-950/40 border border-amber-200 dark:border-amber-800/60 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              8th CPC
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
            {isHi ? '8वां वेतन आयोग कैलकुलेटर' : '8th Pay Commission Calc'}
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isHi ? 'चर्चित फ़िटमेंट फ़ैक्टर (1.92x - 3.00x), साइड-बाय-साइड तुलना व मासिक वृद्धि' : 'Fitment factor dropdown (1.92x-3.00x), side-by-side comparison & net gain'}
          </p>
          <div className="flex items-center text-amber-600 dark:text-amber-400 font-bold text-xs mt-3">
            <span>{isHi ? 'टूल खोलें' : 'Open Tool'}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigateToTab && onNavigateToTab('excel')}
          className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/60 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Unicode
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
            {isHi ? 'एक्सेल कृतिदेव यूनिकोड' : 'Excel KrutiDev to Unicode'}
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isHi ? 'xlsx/csv अपलोड करें, कृतिदेव को हिंदी में बदलें, सेल एडिट करें व डाउनलोड करें' : 'Upload xlsx/csv, auto-convert KrutiDev to Hindi, inline edit & download'}
          </p>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-xs mt-3">
            <span>{isHi ? 'टूल खोलें' : 'Open Tool'}</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE RULES AND STEP-BY-STEP GUIDES ACCORDION */}
      <div className="space-y-4">

        {/* SECTION 1: DIWALI BONUS RULES & STEP-BY-STEP */}
        {(activeCategory === 'all' || activeCategory === 'bonus') && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('bonus-rules')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {isHi ? '1. दीपावली तदर्थ बोनस नियम एवं चरणबद्ध उपयोग गाइड' : '1. Diwali Ad-hoc Bonus Rules & User Guide'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHi ? 'वित्त (नियम) विभाग राजस्थान सरकार आदेश • अधिकतम ₹6,774 व 75/25 विभाजन' : 'Rajasthan Finance Dept circulars, ₹6,774 max limit & 75/25 split'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'bonus-rules' ? 'rotate-90' : ''}`} />
            </button>

            {expandedSection === 'bonus-rules' && (
              <div className="p-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                
                {/* Rule Highlights Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 space-y-1.5">
                    <h5 className="font-extrabold text-orange-900 dark:text-orange-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-orange-600" />
                      <span>{isHi ? 'पात्रता एवं पे-लेवल सीमा' : 'Eligibility & Pay Level'}</span>
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                      {isHi 
                        ? 'राजस्थान सिविल सेवा (पुनरीक्षित वेतन) नियम, 2017 के अंतर्गत पे-लेवल L-1 से L-11 तक के समस्त अराजपत्रित राज्य कर्मचारी, पंचायत समिति एवं जिला परिषद कार्मिक पात्र हैं। पे-लेवल L-12 एवं उच्चतर अपात्र हैं।'
                        : 'Eligible for all non-gazetted state employees drawing pay in Pay Level L-1 to L-11. Level L-12 and above are not eligible.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 space-y-1.5">
                    <h5 className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-600" />
                      <span>{isHi ? 'गणना सूत्र एवं परिलब्धियां सीलिंग' : 'Formula & Emoluments Cap'}</span>
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                      {isHi 
                        ? 'बोनस हेतु अधिकतम परिलब्धियां ₹7,000 प्रति माह निर्धारित हैं। 30 दिवस के बोनस की गणना formula: (₹7,000 × 30) ÷ 31 = ₹6,774.19 (पूर्णांकित ₹6,774)। वित्तीय वर्ष में न्यूनतम 6 माह की अर्हक सेवा अनिवार्य है।'
                        : 'Emoluments ceiling is ₹7,000/month. 30 days bonus: (7000 * 30) / 31 = ₹6,774. Minimum 6 months continuous service is mandatory.'}
                    </p>
                  </div>
                </div>

                {/* 75% Cash and 25% GPF details */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                  <h5 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>{isHi ? 'भुगतान एवं जीपीएफ विभाजन (Disbursement Bifurcation):' : 'Payment Bifurcation:'}</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-black flex items-center justify-center shrink-0">
                        75%
                      </div>
                      <div>
                        <span className="font-extrabold text-emerald-900 dark:text-emerald-300">{isHi ? 'नकद भुगतान (Cash Payment):' : 'Cash in Bank:'}</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">अधिकतम ₹5,081 कर्मचारी के वेतन बचत खाते में सीधे स्थानांतरित होता है।</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-black flex items-center justify-center shrink-0">
                        25%
                      </div>
                      <div>
                        <span className="font-extrabold text-amber-900 dark:text-amber-300">{isHi ? 'जीपीएफ जमा (GPF Deposit):' : 'GPF Credit:'}</span>
                        <p className="text-slate-600 dark:text-slate-400 mt-0.5">अधिकतम ₹1,693 कर्मचारी के GPF अथवा GPF-2004 खाते में जमा की जाती है।</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Guide for Using Diwali Bonus Calculator */}
                <div className="space-y-2 pt-2">
                  <h5 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    <span>{isHi ? 'दीपावली बोनस कैलकुलेटर का उपयोग कैसे करें (चरणबद्ध गाइड):' : 'Step-by-Step How to Use Diwali Bonus Calculator:'}</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                    <li><strong>कार्मिक विवरण भरें:</strong> अपना नाम, पदनाम, विद्यालय/कार्यालय एवं GPF/PRAN संख्या दर्ज करें।</li>
                    <li><strong>पे-लेवल चुनें:</strong> ड्रॉपडाउन से अपना पे-लेवल (L-1 से L-11) चुनें। यदि आप परिवीक्षाधीन (Probationer) हैं, तो प्रोबेशनर टॉगल करें (नियत वेतन होने से बोनस अपात्र)।</li>
                    <li><strong>सेवा अवधि व अवकाश दर्ज करें:</strong> वित्तीय वर्ष में पूरे 12 माह सेवा होने पर 12 माह चुनें। यदि वर्ष में नियुक्ति हुई है तो 6 से 11 माह चुनें। असाधारण अवकाश (EOL/LWP) होने पर दिन दर्ज करें ताकि शुद्ध सेवा माह स्वतः समायोजित हो सकें।</li>
                    <li><strong>परिणाम देखें:</strong> कैलकुलेटर तुरंत कुल देय बोनस राशि, 75% नकद हिस्सा और 25% जीपीएफ जमा हिस्सा प्रदर्शित कर देगा।</li>
                    <li><strong>स्वीकृति आदेश (Sanction Order) प्रिंट करें:</strong> "स्वीकृति आदेश पत्र देखें" बटन दबाकर राजस्थान वित्त विभाग के प्रारूप अनुसार विधिवत कार्यालय आदेश का प्रिंट निकालें या PayManager हेतु विवरण कॉपी करें।</li>
                  </ol>
                </div>

              </div>
            )}
          </div>
        )}

        {/* SECTION 2: RAJASTHAN SALARY (RSR) RULES & STEP-BY-STEP */}
        {(activeCategory === 'all' || activeCategory === 'salary') && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('salary-rules')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {isHi ? '2. राजस्थान वेतन (RSR व PayManager) नियम एवं दरें' : '2. Rajasthan Salary Rules (RSR & PayManager)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHi ? 'DA 60%, HRA (10%/20%), राज्य बीमा (SI), GPF-2004 व RGHS कटौती स्लैब' : 'DA 60%, 10%/20% HRA, SI Slabs, GPF & RGHS deductions'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'salary-rules' ? 'rotate-90' : ''}`} />
            </button>

            {expandedSection === 'salary-rules' && (
              <div className="p-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                
                {/* Allowance and Deductions Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold">
                      <tr>
                        <th className="p-2.5">मद (Head)</th>
                        <th className="p-2.5">वर्तमान दर (Rate as of 2026)</th>
                        <th className="p-2.5">नियम / शासनादेश संदर्भ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr>
                        <td className="p-2.5 font-bold">महंगाई भत्ता (DA)</td>
                        <td className="p-2.5 font-extrabold text-emerald-600">60%</td>
                        <td className="p-2.5 text-slate-500">वित्त विभाग आदेशानुसार मूल वेतन पर देय</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">मकान किराया भत्ता (HRA)</td>
                        <td className="p-2.5">
                          <strong>20% (Y श्रेणी):</strong> जयपुर, जोधपुर, कोटा, बीकानेर, अजमेर<br />
                          <strong>10% (Z श्रेणी):</strong> अन्य सभी शहर, कस्बे व ग्रामीण क्षेत्र
                        </td>
                        <td className="p-2.5 text-slate-500">सरकारी आवास आवंटन न होने की स्थिति में</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">राज्य बीमा (SI)</td>
                        <td className="p-2.5">
                          पे-स्लैब अनुसार: ₹800, ₹1,200, ₹2,200, ₹3,000, ₹5,000, ₹7,000<br />
                          (अधिकतम दो आगामी उच्चतर स्लैब की कटौती का विकल्प)
                        </td>
                        <td className="p-2.5 text-slate-500">राज्य बीमा नियम 11 (मार्च माह के वेतन से लागू)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">सामान्य प्रावधायी निधि (GPF-2004)</td>
                        <td className="p-2.5">
                          पे-लेवल अनुसार न्यूनतम स्लैब: ₹1,050 से ₹4,800+ प्रति माह
                        </td>
                        <td className="p-2.5 text-slate-500">01.01.2004 के पश्चात नियुक्त कार्मिकों पर लागू</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">आरजीएचएस (RGHS)</td>
                        <td className="p-2.5">
                          पे-मैट्रिक्स स्लैब: ₹265 (L-1 to L-5), ₹440 (L-6 to L-9), ₹658 (L-10 to L-15), ₹875 (L-16+)
                        </td>
                        <td className="p-2.5 text-slate-500">कैशलेस ओपीडी एवं आईपीडी स्वास्थ्य सुरक्षा</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold">परिवीक्षाधीन (Probationer)</td>
                        <td className="p-2.5">
                          L-10 (₹23,700), L-11 (₹26,500), L-12 (₹31,100), L-14 (₹39,300) नियत पारिश्रमिक
                        </td>
                        <td className="p-2.5 text-slate-500">कोई DA/HRA देय नहीं; केवल RGHS कटौती अनिवार्य</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Step-by-Step Guide */}
                <div className="space-y-2 pt-2">
                  <h5 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>{isHi ? 'राजस्थान वेतन कैलकुलेटर का उपयोग कैसे करें:' : 'How to Use Rajasthan Salary Calculator:'}</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                    <li><strong>पे-लेवल और मूल वेतन चुनें:</strong> अपना पे-लेवल (L-1 से L-16) चुनें और मैट्रिक्स अनुसार बेसिक पे सेलेक्ट करें या कस्टम दर्ज करें।</li>
                    <li><strong>परिवीक्षा काल (Probationer):</strong> यदि 2 वर्ष के प्रोबेशन पर हैं, तो "परिवीक्षाधीन" चेक करें; फिक्स मानदेय दरें स्वतः लोड हो जाएंगी।</li>
                    <li><strong>शहर HRA श्रेणी:</strong> 5 बड़े शहरों में पदस्थापित होने पर Y श्रेणी (20%) और ग्रामीण/अन्य शहर में होने पर Z श्रेणी (10%) चुनें।</li>
                    <li><strong>कटौतियां (SI, GPF, RGHS):</strong> अपने मूल वेतन अनुसार स्वतः आई मानक कटौतियों को सत्यापित करें। यदि आपने SI में ऐच्छिक अगली उच्चतर स्लैब ले रखी है, तो ड्रॉपडाउन से उसे चुनें।</li>
                    <li><strong>वेतन पर्ची (Pay Slip) प्रिंट करें:</strong> पूरा ग्रॉस वेतन (Gross), कुल कटौतियां (Deductions) और शुद्ध इन-हैंड (Net Pay) देखकर विधिवत पे-स्लिप जनरेट व प्रिंट करें।</li>
                  </ol>
                </div>

              </div>
            )}
          </div>
        )}

        {/* SECTION 3: 8TH PAY COMMISSION CALCULATOR GUIDE */}
        {(activeCategory === 'all' || activeCategory === '8thpay') && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('8thpay-rules')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {isHi ? '3. 8वां वेतन आयोग (8th CPC) फ़िटमेंट फ़ैक्टर व गणना विश्लेषण' : '3. 8th Pay Commission Fitment Factor & Analysis'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHi ? '1.92x से 3.00x चर्चित फ़िटमेंट फ़ैक्टर • 7वें वेतन से 8वें वेतन की तुलना व वृद्धि' : 'Fitment factor scenarios (1.92x-3.00x), 7th to 8th CPC comparison'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === '8thpay-rules' ? 'rotate-90' : ''}`} />
            </button>

            {expandedSection === '8thpay-rules' && (
              <div className="p-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                
                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                  <p>
                    <strong>8वें वेतन आयोग का गठन एवं पृष्ठभूमि:</strong> 7वें वेतन आयोग की 10-वर्षीय अवधि (2016-2026) पूर्ण होने के उपरांत केंद्र एवं राजस्थान सहित समस्त राज्य सरकारों में 8वें वेतन आयोग की संस्तुतियों पर कर्मचारी संघों द्वारा ज्ञापन प्रस्तुत किए जा रहे हैं।
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800">
                      <span className="font-bold text-amber-900 dark:text-amber-300 block">1.92x (रूढ़िवादी - Conservative)</span>
                      <span className="text-[10px] text-slate-500">डीए समामेलन (50%+) उपरांत न्यूनतम मूल वृद्धि हेतु।</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 block">2.22x - 2.57x (अपेक्षित - Expected)</span>
                      <span className="text-[10px] text-slate-500">7वें वेतन आयोग के 2.57x समतुल्य संतुलित फ़िटमेंट फ़ैक्टर।</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800">
                      <span className="font-bold text-rose-900 dark:text-rose-300 block">2.86x - 3.00x (कर्मचारी संघ मांग)</span>
                      <span className="text-[10px] text-slate-500">न्यूनतम मूल वेतन ₹34,500 से ₹54,000 करने का प्रस्ताव।</span>
                    </div>
                  </div>
                </div>

                {/* Step-by-step tutorial */}
                <div className="space-y-2 pt-1">
                  <h5 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>{isHi ? '8वें वेतन कैलकुलेटर का उपयोग कैसे करें:' : 'How to Use 8th CPC Calculator:'}</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                    <li><strong>7th Basic Pay दर्ज करें:</strong> अपना वर्तमान 7वें वेतन का मूल वेतन (जैसे ₹38,700, ₹44,900) दर्ज करें।</li>
                    <li><strong>फ़िटमेंट फ़ैक्टर चुनें:</strong> विभिन्न संभावित परिदृश्यों (1.92x, 2.08x, 2.22x, 2.57x, 2.86x, 3.00x या कस्टम) में से चुनें।</li>
                    <li><strong>तुलना तालिका देखें:</strong> 7वें वेतन के वास्तविक भुगतान (मूल वेतन + 60% डीए + HRA) और 8वें वेतन की अनुमानित नवीन पे-संरचना की आमने-सामने तुलना करें।</li>
                    <li><strong>शुद्ध लाभ देखें:</strong> मासिक टेक-होम वेतन में कितने रुपयों की अतिरिक्त वृद्धि होगी तथा वार्षिक संचयी लाभ कितना होगा, यह स्पष्ट ग्राफिक्स में देखें।</li>
                  </ol>
                </div>

              </div>
            )}
          </div>
        )}

        {/* SECTION 4: EXCEL KRUTIDEV TO UNICODE CONVERTER GUIDE */}
        {(activeCategory === 'all' || activeCategory === 'excel') && (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('excel-rules')}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {isHi ? '4. एक्सेल शीट कृतिदेव / देवलास से यूनिकोड कन्वर्टर गाइड' : '4. Excel KrutiDev/DevLys to Unicode Converter Guide'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHi ? 'शिक्षा विभाग की पुरानी फाइलों को शुद्ध हिंदी में बदलना, संपादन एवं UTF-8 डाउनलोड' : 'Convert legacy staff/student files to Hindi Unicode, edit & download'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'excel-rules' ? 'rotate-90' : ''}`} />
            </button>

            {expandedSection === 'excel-rules' && (
              <div className="p-5 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-4 text-xs">
                
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-2">
                  <h5 className="font-extrabold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{isHi ? 'समस्या एवं समाधान (Why this tool is essential):' : 'Why this tool is essential:'}</span>
                  </h5>
                  <p>
                    राजस्थान शिक्षा विभाग, बोर्ड ऑफ सेकेंडरी एजुकेशन (BSER) तथा शाला दर्पण के कई पुराने प्रपत्र, अंकतालिकाएं एवं कार्मिक सूचियां <strong>KrutiDev 010</strong> अथवा <strong>DevLys 010</strong> फॉन्ट में टाइप की गई होती हैं। जब इन फाइलों को मोबाइल, टैबलेट या बिना फॉन्ट वाले कंप्यूटर पर खोला जाता है, तो हिंदी के स्थान पर <em>"jkes'oj izlkn 'kekZ"</em> जैसे अनपढ़े अक्षर दिखाई देते हैं।
                  </p>
                  <p>
                    यह मॉड्यूल इन गैर-यूनिकोड अक्षरों की संयुक्त बनावट, रेफ (Z), छोटी-इ की मात्रा (f) के व्युत्क्रम को पहचानकर स्वचालित रूप से अंतर्राष्ट्रीय <strong>Hindi Devanagari Unicode (मंगल/चाणक्य UTF-8)</strong> में परिवर्तित कर देता है।
                  </p>
                </div>

                {/* Step-by-Step Guide */}
                <div className="space-y-2 pt-1">
                  <h5 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isHi ? 'एक्सेल कन्वर्टर का उपयोग कैसे करें:' : 'How to Use Excel Converter:'}</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                    <li><strong>फाइल अपलोड करें:</strong> अपने फोन या कंप्यूटर से कोई भी <code>.xlsx</code>, <code>.xls</code> या <code>.csv</code> फाइल ड्रैग या सेलेक्ट करें। (या तुरंत टेस्ट करने हेतु "नमूना कृतिदेव शीट लोड करें" दबाएं)।</li>
                    <li><strong>स्वतः रूपांतरण:</strong> अपलोड होते ही सिस्टम प्रत्येक कॉलम का विश्लेषण कर गैर-यूनिकोड शब्दों को शुद्ध हिंदी देवनागरी में बदल देता है। संख्याएं व अंग्रेजी नाम सुरक्षित रहते हैं।</li>
                    <li><strong>व्यू टॉगल करें:</strong> आप "शुद्ध हिंदी यूनिकोड" और "मूल गैर-यूनिकोड" के बीच स्विच करके रूपांतरण का मिलान कर सकते हैं।</li>
                    <li><strong>इनलाइन सेल संपादन (Edit):</strong> किसी भी सेल पर डबल क्लिक या एडिट पेंसिल दबाकर सीधे स्प्रेडशीट में नया नाम या डेटा संशोधित कर सकते हैं।</li>
                    <li><strong>डाउनलोड करें:</strong> "एक्सेल (.xlsx) डाउनलोड" या "CSV डाउनलोड" बटन दबाएं। फाइल में UTF-8 BOM स्वतः एम्बेड होता है, जिससे माइक्रोसॉफ्ट एक्सेल, गूगल शीट्स व फोन में हिंदी अक्षर बिना किसी त्रुटि के खुलते हैं।</li>
                  </ol>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* FOOTER ASSISTANCE BANNER */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {isHi 
              ? 'सभी नियम एवं गणनाएं राजस्थान सरकार वित्त (नियम) प्रभाग परिपत्रों के पूर्णतः अनुरूप हैं।' 
              : 'All calculations conform strictly to Rajasthan Finance Department circulars and rules.'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            {isHi ? '↑ पृष्ठ के शीर्ष पर जाएं' : '↑ Back to Top'}
          </button>
        </div>
      </div>

    </div>
  );
};
