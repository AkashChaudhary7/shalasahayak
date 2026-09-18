import React, { useState, useMemo } from 'react';
import { 
  Gift, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Share2, 
  HelpCircle, 
  Coins, 
  Building2, 
  Info,
  Calendar,
  User,
  BadgePercent,
  FileText,
  RotateCcw,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Language } from '../../types';
import { 
  printDepartmentalReport, 
  downloadDepartmentalPdf, 
  CalculatorPdfOptions 
} from '../../services/unifiedPdfExportService';
import { Printer, Download } from 'lucide-react';

interface DiwaliBonusCalculatorProps {
  lang: Language;
}

export const DiwaliBonusCalculator: React.FC<DiwaliBonusCalculatorProps> = ({ lang }) => {
  const isHi = lang === 'hi';

  // Form State according to exact Rajasthan Govt order specifications
  const [employeeCategory, setEmployeeCategory] = useState<string>('');
  const [payLevel, setPayLevel] = useState<string>('');
  const [isStateServiceOfficer, setIsStateServiceOfficer] = useState<string>('');
  const [statusOn31March, setStatusOn31March] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>('');
  const [probationExempt, setProbationExempt] = useState<boolean>(true);
  const [probationCompletionDate, setProbationCompletionDate] = useState<string>('');
  const [actualEmoluments, setActualEmoluments] = useState<string>('7000');
  const [hasEol, setHasEol] = useState<string>('no');
  const [eolDays, setEolDays] = useState<string>('0');
  const [continuingOn1April, setContinuingOn1April] = useState<string>('');

  // UI state
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const buildBonusPdfConfig = (): CalculatorPdfOptions => {
    if (!evaluation) return {} as CalculatorPdfOptions;
    return {
      reportTitleHi: 'राजस्थान राज्य कर्मचारियों हेतु दीपावली तदर्थ बोनस स्वीकृति विवरण प्रपत्र',
      reportTitleEn: 'Government of Rajasthan Ad-hoc Diwali Bonus Sanction Statement',
      orderReference: `FD/RAJ/RULES/BONUS/2026-27`,
      employeeDetails: {
        name: 'संबंधित कार्मिक',
        designation: employeeCategory || 'अराजपत्रित कार्मिक',
        payLevel: payLevel || 'L-10',
        employeeId: 'RJ-BONUS-' + Math.floor(100000 + Math.random() * 900000),
        cityCategory: 'राजस्थान राज्य सेवा (अराजपत्रित)'
      },
      summaryCards: [
        { label: 'कुल स्वीकृत बोनस', value: `₹${evaluation.totalBonus.toLocaleString('en-IN')}`, color: 'emerald' },
        { label: '75% नकद वेतन खाता', value: `₹${evaluation.cashShare.toLocaleString('en-IN')}`, color: 'blue' },
        { label: '25% जीपीएफ जमा', value: `₹${evaluation.gpfShare.toLocaleString('en-IN')}`, color: 'amber' }
      ],
      sections: [
        {
          title: 'पात्रता एवं सेवा अवधि विवरण (ELIGIBILITY & SERVICE DETAILS)',
          rows: [
            { label: 'कर्मचारी पद / श्रेणी', value: employeeCategory || 'अराजपत्रित कर्मचारी' },
            { label: 'वर्तमान 7वां वेतन पे-लेवल', value: payLevel || 'लागू' },
            { label: '31 मार्च को सेवा स्थिति', value: statusOn31March === 'in_service' ? 'सक्रिय सेवारत (Active In-Service)' : statusOn31March },
            { label: 'कुल अर्हकारी सेवा अवधि', value: `${evaluation.serviceMonths} माह (${evaluation.netQualifyingDays} दिन)` },
            { label: 'गणना हेतु परिलब्धियां (अधिकतम ₹7,000 सीलिंग)', value: `₹${evaluation.cappedEmoluments.toLocaleString('en-IN')}` }
          ]
        },
        {
          title: 'बोनस वितरण एवं भुगतान अनुपात (75:25 SPLIT)',
          rows: [
            { label: 'मानक सूत्र (Formula: Emoluments × 30 ÷ 31)', value: '(₹7,000 × 30) ÷ 31 = ₹6,774' },
            { label: 'कुल देय तदर्थ बोनस (Total Sanctioned)', value: `₹${evaluation.totalBonus.toLocaleString('en-IN')}`, isHighlight: true, type: 'earning' as const },
            { label: '75% नकद राशि (बैंक वेतन खाते में डीबीटी)', value: `₹${evaluation.cashShare.toLocaleString('en-IN')}`, isHighlight: true, type: 'earning' as const },
            { label: '25% राशि (सामान्य प्रावधायी निधि GPF/GPF-2004 खाते में जमा)', value: `₹${evaluation.gpfShare.toLocaleString('en-IN')}`, isHighlight: true, type: 'deduction' as const }
          ]
        }
      ],
      notes: [
        'यह गणना राजस्थान वित्त विभाग (नियम प्रभाग) द्वारा जारी वार्षिक तदर्थ बोनस परिपत्र एवं ₹7,000 अधिकतम परिलब्धि सीलिंग पर आधारित है।',
        'पे-लेवल L-1 से L-11 तक के सभी पात्र अराजपत्रित कार्मिकों हेतु पे-मैनेजर बोनस इनर/आउटर बिल बनाने हेतु मान्य है।'
      ],
      signatories: [
        { title: 'हस्ताक्षर कार्मिक (Employee Sign)' },
        { title: 'हस्ताक्षर आहरण एवं संवितरण अधिकारी (DDO / PEEO Sign & Seal)' }
      ]
    };
  };

  const handlePrintDepartmental = () => {
    printDepartmentalReport(buildBonusPdfConfig());
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await downloadDepartmentalPdf(buildBonusPdfConfig(), `Rajasthan_Diwali_Bonus_${payLevel}_6774.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  // Auto-sync employee category to pay level when convenient
  const handleCategoryChange = (cat: string) => {
    setEmployeeCategory(cat);
    if (cat === 'teacher_gr3' && !payLevel) {
      setPayLevel('L-10');
      setIsStateServiceOfficer('no');
    } else if (cat === 'teacher_gr2' && !payLevel) {
      setPayLevel('L-11');
      setIsStateServiceOfficer('no');
    } else if (cat === 'clerk_assistant' && !payLevel) {
      setPayLevel('L-5');
      setIsStateServiceOfficer('no');
    } else if (cat === 'class4' && !payLevel) {
      setPayLevel('L-1');
      setIsStateServiceOfficer('no');
    } else if (cat === 'lecturer' && !payLevel) {
      setPayLevel('L-12');
      setIsStateServiceOfficer('no');
    } else if (cat === 'principal' && !payLevel) {
      setPayLevel('L-16');
      setIsStateServiceOfficer('yes');
    } else if (cat === 'state_officer') {
      setIsStateServiceOfficer('yes');
    }
  };

  // Eligibility and Calculation Engine
  const evaluation = useMemo(() => {
    if (!hasCalculated) return null;

    const reasons: { text: string; type: 'error' | 'warning' | 'info' }[] = [];
    let isEligible = true;

    // 1. Check State Service Officer Exclusion
    if (isStateServiceOfficer === 'yes') {
      isEligible = false;
      reasons.push({
        text: isHi
          ? 'राज्य सेवा के अधिकारी (State Service Officers / Gazetted Officers) राजस्थान सरकार के आदेशानुसार तदर्थ बोनस हेतु पात्र नहीं हैं।'
          : 'State Service Officers / Gazetted Officers are excluded from ad-hoc bonus as per Rajasthan Government rules.',
        type: 'error'
      });
    }

    // 2. Check Pay Level (Strictly up to L-11 only)
    if (payLevel) {
      const levelMatch = payLevel.match(/\d+/);
      const lvlNum = levelMatch ? parseInt(levelMatch[0], 10) : 0;
      if (lvlNum > 11 || payLevel.startsWith('L-12') || payLevel.startsWith('L-13') || payLevel.startsWith('L-14') || payLevel.startsWith('L-15') || payLevel.startsWith('L-16') || payLevel.startsWith('L-17')) {
        isEligible = false;
        reasons.push({
          text: isHi
            ? `पे-लेवल ${payLevel} (ग्रेड पे 4800 या अधिक) बोनस के दायरे से बाहर है। राजस्थान वित्त विभाग के नियमानुसार तदर्थ बोनस केवल पे-लेवल L-1 से L-11 तक के अराजपत्रित कर्मचारियों को ही देय है।`
            : `Pay Level ${payLevel} is above the eligibility ceiling. Ad-hoc bonus is restricted to Pay Levels L-1 to L-11 only.`,
          type: 'error'
        });
      }
    } else {
      isEligible = false;
      reasons.push({
        text: isHi ? 'कृपया मान्य वर्तमान Pay Level का चयन करें।' : 'Please select a valid Pay Level.',
        type: 'error'
      });
    }

    // 3. Status on 31 March 2026
    if (statusOn31March === 'resigned') {
      isEligible = false;
      reasons.push({
        text: isHi
          ? '31 मार्च 2026 से पूर्व सेवा त्याग (Resigned) करने वाले कर्मचारी बोनस हेतु पात्र नहीं हैं।'
          : 'Employees who resigned prior to 31 March 2026 are not eligible for bonus.',
        type: 'error'
      });
    } else if (statusOn31March === 'retired_before') {
      isEligible = false;
      reasons.push({
        text: isHi
          ? '31 मार्च 2026 से पूर्व सेवानिवृत्त कर्मचारी वित्तीय वर्ष के अंतिम दिन सेवा में न होने के कारण पात्र नहीं हैं।'
          : 'Employees retired before 31 March 2026 are not in service at year end.',
        type: 'error'
      });
    } else if (statusOn31March === 'suspended') {
      reasons.push({
        text: isHi
          ? 'निलंबन (Suspension) की स्थिति में बोनस की राशि विभागीय जांच/निर्णय लंबित रहने तक रोकी (Withheld) रखी जाती है। दोषमुक्त होने पर देय होगा।'
          : 'For suspended employees, bonus is held in abeyance pending completion of disciplinary proceedings.',
        type: 'warning'
      });
    }

    // 4. Continuing on 1 April 2026 Check
    if (continuingOn1April === 'no_resigned') {
      isEligible = false;
      reasons.push({
        text: isHi
          ? '1 अप्रैल 2026 को सेवा में निरंतरता न होने पर बोनस देय नहीं होता।'
          : 'Continuing service on 1 April 2026 is required.',
        type: 'error'
      });
    }

    // 5. Date & Service Period Calculation (Financial Year 2025-26: 01-04-2025 to 31-03-2026)
    const fyStart = new Date('2025-04-01');
    const fyEnd = new Date('2026-03-31');

    let effectiveStartDate = fyStart;

    // Check joining date
    if (joiningDate) {
      const joinD = new Date(joiningDate);
      if (!isNaN(joinD.getTime()) && joinD > fyStart) {
        effectiveStartDate = joinD;
      }
    }

    // Check probation completion date
    // If user is a probationer who completed probation during 2025-26
    if (!probationExempt) {
      if (!probationCompletionDate) {
        // Still in probation throughout
        isEligible = false;
        reasons.push({
          text: isHi
            ? 'परिवीक्षा काल (Probationer Trainee) में नियत पारिश्रमिक (Fixed Remuneration) पर कार्यरत अवधि बोनस हेतु अर्हकारी सेवा में नहीं गिनी जाती है। पूर्ण वर्ष प्रोबेशन में होने के कारण बोनस देय नहीं है।'
            : 'Probationer trainee period on fixed remuneration is not counted as qualifying service. Ineligible while on probation.',
          type: 'error'
        });
      } else {
        const probEnd = new Date(probationCompletionDate);
        if (!isNaN(probEnd.getTime())) {
          if (probEnd > fyEnd) {
            isEligible = false;
            reasons.push({
              text: isHi
                ? '31 मार्च 2026 तक प्रोबेशन पूर्ण न होने के कारण नियमित सेवा अवधि उपलब्ध नहीं है।'
                : 'Probation not completed on or before 31 March 2026.',
              type: 'error'
            });
          } else if (probEnd > effectiveStartDate) {
            // Service counts from day after probation completion
            effectiveStartDate = probEnd;
          }
        }
      }
    }

    // Calculate qualifying days in FY 2025-26
    let qualifyingDays = 0;
    if (effectiveStartDate <= fyEnd) {
      const diffTime = fyEnd.getTime() - effectiveStartDate.getTime();
      qualifyingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    }

    // Deduct EOL / Leave Without Pay days
    const deductedEol = hasEol === 'yes' ? Math.max(0, parseInt(eolDays, 10) || 0) : 0;
    const netQualifyingDays = Math.max(0, qualifyingDays - deductedEol);

    // Convert to service months according to Rajasthan Govt rule:
    // Minimum 6 months continuous service required
    // Fraction of half month (15 days) or more is rounded to 1 month
    const rawMonths = netQualifyingDays / 30.416; // approximate days per month
    let serviceMonths = 0;

    if (netQualifyingDays >= 360) {
      serviceMonths = 12;
    } else {
      // 15 days or more count as 1 full month
      const fullMonths = Math.floor(netQualifyingDays / 30);
      const remainingDays = netQualifyingDays % 30;
      serviceMonths = remainingDays >= 15 ? fullMonths + 1 : fullMonths;
      if (serviceMonths > 12) serviceMonths = 12;
    }

    // Check minimum 6 months rule
    if (serviceMonths < 6) {
      isEligible = false;
      reasons.push({
        text: isHi
          ? `वित्तीय वर्ष 2025-26 में कुल अर्हकारी सेवा ${netQualifyingDays} दिन (${serviceMonths} माह) है। राजस्थान सरकार के नियमानुसार बोनस हेतु न्यूनतम 6 माह (180 दिन) की अर्हकारी सेवा अनिवार्य है।`
          : `Qualifying service is only ${netQualifyingDays} days (${serviceMonths} months). Minimum 6 months is required.`,
        type: 'error'
      });
    }

    // Emoluments calculation
    const enteredEmoluments = parseFloat(actualEmoluments) || 7000;
    const cappedEmoluments = Math.min(7000, Math.max(0, enteredEmoluments));

    // Full 12-Month bonus cap calculation:
    // Formula: (Emoluments × 30) ÷ 31
    // (7000 × 30) / 31 = 6774.19 -> ₹6,774
    const fullYearBonus = Math.round((cappedEmoluments * 30) / 31);

    // Pro-rata Calculation: (serviceMonths / 12) * fullYearBonus
    let totalBonus = 0;
    if (isEligible) {
      if (serviceMonths >= 12) {
        totalBonus = fullYearBonus;
      } else {
        totalBonus = Math.round((serviceMonths / 12) * fullYearBonus);
      }
    }

    // 75% Cash and 25% GPF Split
    const cashShare = Math.round((totalBonus * 75) / 100);
    const gpfShare = totalBonus - cashShare;

    return {
      isEligible,
      reasons,
      netQualifyingDays,
      serviceMonths,
      deductedEol,
      enteredEmoluments,
      cappedEmoluments,
      fullYearBonus,
      totalBonus,
      cashShare,
      gpfShare
    };
  }, [
    hasCalculated,
    employeeCategory,
    payLevel,
    isStateServiceOfficer,
    statusOn31March,
    joiningDate,
    probationExempt,
    probationCompletionDate,
    actualEmoluments,
    hasEol,
    eolDays,
    continuingOn1April,
    isHi
  ]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  const handleReset = () => {
    setHasCalculated(false);
    setEmployeeCategory('');
    setPayLevel('');
    setIsStateServiceOfficer('');
    setStatusOn31March('');
    setJoiningDate('');
    setProbationExempt(true);
    setProbationCompletionDate('');
    setActualEmoluments('7000');
    setHasEol('no');
    setEolDays('0');
    setContinuingOn1April('');
  };

  const handleCopyResult = () => {
    if (!evaluation) return;
    const text = isHi
      ? `🎁 राजस्थान सरकार दीपावली तदर्थ बोनस गणना 2026-27 (Provisional)\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• पद / श्रेणी: ${employeeCategory || 'अराजपत्रित'}\n• वर्तमान Pay Level: ${payLevel}\n• अर्हकारी सेवा: ${evaluation.serviceMonths} माह (${evaluation.netQualifyingDays} दिन)\n• गणना हेतु वेतन (Capped): ₹${evaluation.cappedEmoluments.toLocaleString('en-IN')}\n• कुल स्वीकृत बोनस: ₹${evaluation.totalBonus.toLocaleString('en-IN')}\n• 75% नकद (बैंक वेतन खाता): ₹${evaluation.cashShare.toLocaleString('en-IN')}\n• 25% जीपीएफ जमा (GPF/GPF-2004): ₹${evaluation.gpfShare.toLocaleString('en-IN')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n(राजस्थान वित्त विभाग के नवीनतम प्रमाणित बोनस आदेश पैटर्न पर आधारित)`
      : `🎁 Rajasthan Govt Diwali Ad-hoc Bonus 2026-27 (Provisional)\n• Pay Level: ${payLevel}\n• Qualifying Service: ${evaluation.serviceMonths} months (${evaluation.netQualifyingDays} days)\n• Emoluments Capped: ₹${evaluation.cappedEmoluments}\n• Total Bonus: ₹${evaluation.totalBonus.toLocaleString('en-IN')}\n• 75% Cash: ₹${evaluation.cashShare.toLocaleString('en-IN')}\n• 25% GPF: ₹${evaluation.gpfShare.toLocaleString('en-IN')}\n(As per Rajasthan Finance Dept ad-hoc bonus guidelines)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-fadeIn pb-8">
      
      {/* 1. TOP OFFICIAL NOTIFICATION ALERT BOX - EXACT PROMPT WORDING */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 shadow-sm flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-[13px] leading-relaxed font-medium">
          <strong className="font-black text-amber-800 dark:text-amber-300 block sm:inline mr-1">
            महत्वपूर्ण:
          </strong>
          यह Calculator 2026-27 के लिए उपलब्ध नवीनतम verified Rajasthan Government ad-hoc bonus order के pattern पर आधारित provisional calculation करता है। 2026-27 का अलग official bonus order जारी होने पर उसमें कोई बदलाव होने पर Calculator को update करना आवश्यक होगा।
        </div>
      </div>

      {/* Main Calculation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        
        {/* Section Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shadow-inner">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                <span>👤 कर्मचारी की जानकारी</span>
              </h2>
              <p className="text-[11px] text-emerald-200 font-medium mt-0.5">
                {isHi ? 'राजस्थान तदर्थ बोनस पात्रता एवं सटीक राशि गणना' : 'Rajasthan Ad-hoc Bonus Eligibility & Calculator'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 shadow-sm">
            अधिकतम ₹6,774
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCalculate} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          
          {/* 1. कर्मचारी / पद की श्रेणी */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
              कर्मचारी / पद की श्रेणी
            </label>
            <div className="relative">
              <select
                value={employeeCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="">— चयन करें —</option>
                <option value="teacher_gr3">तृतीय श्रेणी अध्यापक (Grade III Teacher / REET)</option>
                <option value="teacher_gr2">वरिष्ठ अध्यापक / द्वितीय श्रेणी शिक्षक (Grade II Teacher)</option>
                <option value="clerk_assistant">कनिष्ठ सहायक / एलडीसी / यूडीसी (Junior Assistant / Clerk)</option>
                <option value="class4">चतुर्थ श्रेणी कर्मचारी / सहायक (Class IV Staff / Peon)</option>
                <option value="pti">शारीरिक शिक्षक / पीटीआई (PTI Grade III / II)</option>
                <option value="librarian">पुस्तकालय अध्यक्ष (Librarian Grade III / II)</option>
                <option value="lab_assistant">प्रयोगशाला सहायक (Lab Assistant)</option>
                <option value="other_nongazetted">अन्य अराजपत्रित कर्मचारी (Other Non-Gazetted Staff)</option>
                <option value="lecturer">स्कूल व्याख्याता / प्राध्यापक (School Lecturer - L-12) [अपात्र]</option>
                <option value="principal">उप-प्रधानाचार्य / प्रधानाचार्य (HM / Principal - L-14/16) [अपात्र]</option>
                <option value="state_officer">राज्य सेवा अधिकारी (State Service Officer) [अपात्र]</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              यह केवल सुविधा के लिए है। Final eligibility Pay Level एवं अन्य नियमों से तय होगी।
            </p>
          </div>

          {/* 2. वर्तमान Pay Level */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                वर्तमान Pay Level <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                पात्रता: L-1 से L-11 तक
              </span>
            </div>
            <div className="relative">
              <select
                value={payLevel}
                onChange={(e) => setPayLevel(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="">— Pay Level चुनें —</option>
                <optgroup label="पात्र पे-लेवल (Eligible L-1 to L-11)">
                  <option value="L-1">L-1 (Grade Pay 1700 - Class IV)</option>
                  <option value="L-2">L-2 (Grade Pay 1750)</option>
                  <option value="L-3">L-3 (Grade Pay 1900)</option>
                  <option value="L-4">L-4 (Grade Pay 2000)</option>
                  <option value="L-5">L-5 (Grade Pay 2400 - Jr Assistant / LDC)</option>
                  <option value="L-6">L-6 (Grade Pay 2800)</option>
                  <option value="L-7">L-7 (Grade Pay 2800 Special)</option>
                  <option value="L-8">L-8 (Grade Pay 2800 - Jr Accountant / Lab Asst)</option>
                  <option value="L-9">L-9 (Grade Pay 3200)</option>
                  <option value="L-10">L-10 (Grade Pay 3600 - तृतीय श्रेणी शिक्षक / Grade III Teacher)</option>
                  <option value="L-11">L-11 (Grade Pay 4200 - वरिष्ठ अध्यापक / Senior Teacher Grade II)</option>
                </optgroup>
                <optgroup label="अपात्र पे-लेवल (Ineligible L-12 and above)">
                  <option value="L-12">L-12 (Grade Pay 4800 - स्कूल व्याख्याता / School Lecturer)</option>
                  <option value="L-13">L-13 (Grade Pay 5400)</option>
                  <option value="L-14">L-14 (Grade Pay 5400 - उप-प्रधानाचार्य / Vice Principal)</option>
                  <option value="L-15">L-15 (Grade Pay 6000)</option>
                  <option value="L-16">L-16 (Grade Pay 6600 - प्रधानाचार्य / Principal)</option>
                  <option value="L-17+">L-17+ (उच्च पद / Higher Administrative Scales)</option>
                </optgroup>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              पुराने Grade Pay वाले कर्मचारी नीचे actual/old pay details के अनुसार manual verification करें।
            </p>
          </div>

          {/* 3. क्या आप State Service के Officer हैं? */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
              क्या आप State Service के Officer हैं? <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={isStateServiceOfficer}
                onChange={(e) => setIsStateServiceOfficer(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="">— चयन करें —</option>
                <option value="no">नहीं (Subordinate / Ministerial / Non-Gazetted Staff)</option>
                <option value="yes">हाँ (State Service / Gazetted Officer) [बोनस से बहिष्कृत]</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              L-12 या कम होने पर भी State Service Officer exclusion की जांच जरूरी है।
            </p>
          </div>

          {/* 4. 31 March 2026 को कर्मचारी की स्थिति */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
              31 March 2026 को कर्मचारी की स्थिति <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={statusOn31March}
                onChange={(e) => setStatusOn31March(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="">— स्थिति चुनें —</option>
                <option value="in_service">सेवारत (In Active Service on 31-03-2026)</option>
                <option value="deputation">प्रतिनियुक्ति पर (On Deputation on 31-03-2026)</option>
                <option value="retired_on_31_march">31 मार्च 2026 को सेवानिवृत्त हुए (Retired on 31-03-2026 Afternoon)</option>
                <option value="retired_before">31 मार्च 2026 से पूर्व सेवानिवृत्त (Retired before 31-03-2026)</option>
                <option value="suspended">निलंबित (Under Suspension on 31-03-2026)</option>
                <option value="resigned">सेवा त्याग / त्यागपत्र (Resigned before 31-03-2026)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              31 मार्च को सेवा में विद्यमान होना पात्रता की अनिवार्य शर्त है।
            </p>
          </div>

          {/* 5. Government Service Joining Date */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
              Government Service Joining Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              पहली/वर्तमान eligible government service की joining date डालें।
            </p>
          </div>

          {/* 6. Probation सफलतापूर्वक पूर्ण होने की तारीख */}
          <div className="space-y-2 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                Probation सफलतापूर्वक पूर्ण होने की तारीख
              </label>
              <button
                type="button"
                onClick={() => setProbationExempt(!probationExempt)}
                className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {probationExempt ? 'तारीख दर्ज करें' : 'लागू नहीं / पूर्व पूर्ण'}
              </button>
            </div>

            {probationExempt ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>प्रोबेशन 01-04-2025 से पूर्व पूर्ण / नियमित सेवा</span>
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-200/80 dark:bg-emerald-800/80 text-emerald-950 dark:text-emerald-100">
                  पूर्ण 12 माह सेवा
                </span>
              </div>
            ) : (
              <div className="space-y-1.5 animate-fadeIn">
                <input
                  type="date"
                  value={probationCompletionDate}
                  onChange={(e) => setProbationCompletionDate(e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
                />
                <p className="text-[10.5px] text-amber-700 dark:text-amber-400 font-semibold">
                  नोट: प्रोबेशन पूर्ण होने की तारीख से 31 मार्च 2026 तक की अवधि ही अर्हकारी सेवा मानी जाएगी।
                </p>
              </div>
            )}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              यदि probation लागू नहीं है तो joining date के अनुसार स्थिति जांचें।
            </p>
          </div>

          {/* 7. 31 March 2026 के Actual Eligible Emoluments (₹) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                31 March 2026 के Actual Eligible Emoluments (₹) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                अधिकतम मान्य सीमा: ₹7,000
              </span>
            </div>
            <input
              type="number"
              min={0}
              max={200000}
              value={actualEmoluments}
              onChange={(e) => setActualEmoluments(e.target.value)}
              placeholder="उदाहरण: 7000"
              required
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Basic Pay + Personal Pay + Deputation Allowance + DA डालें। HRA/CCA जैसे अन्य allowances शामिल न करें। Calculation में अधिकतम ₹7,000 ही लिया जाएगा।
            </p>
          </div>

          {/* 8. क्या 2025-26 में EOL / Leave Without Pay हुआ? */}
          <div className="space-y-2 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
                क्या 2025-26 में EOL / Leave Without Pay हुआ?
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setHasEol('no');
                  setEolDays('0');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-center space-x-1.5 min-h-[38px] ${
                  hasEol === 'no'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                <span>नहीं</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setHasEol('yes');
                  if (eolDays === '0') setEolDays('15');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-center space-x-1.5 min-h-[38px] ${
                  hasEol === 'yes'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                <span>हाँ (दिन घटाएं)</span>
              </button>
            </div>

            {hasEol === 'yes' && (
              <div className="flex items-center space-x-2 pt-1 animate-fadeIn">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 shrink-0">
                  अवैतनिक दिनों की संख्या:
                </span>
                <input
                  type="number"
                  min={0}
                  max={365}
                  value={eolDays}
                  onChange={(e) => setEolDays(e.target.value)}
                  placeholder="उदा. 15"
                  className="w-24 px-3 py-1.5 text-xs font-black rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
                <span className="text-xs text-slate-500">दिन</span>
              </div>
            )}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              EOL/LWP eligibility period से exclude होता है।
            </p>
          </div>

          {/* 9. क्या 1 April 2026 को भी Service में Continuing थे? */}
          <div className="space-y-1">
            <label className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200">
              क्या 1 April 2026 को भी Service में Continuing थे? <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={continuingOn1April}
                onChange={(e) => setContinuingOn1April(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="">— चयन करें —</option>
                <option value="yes">हाँ (Continuing in Service on 01-04-2026)</option>
                <option value="retired_special">नहीं (31 मार्च 2026 को सेवानिवृत्त हुए - विशेष प्रावधान)</option>
                <option value="no_resigned">नहीं (01-04-2026 से पूर्व सेवा समाप्त / त्यागपत्र)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Calculation का आधार: 2025-26 financial year के लिए eligibility period 01-04-2025 से 31-03-2026 तक मानी गई है। Probationer Trainee period eligible service में नहीं जोड़ा जाएगा। 6 से 12 महीने तक service पर pro-rata bonus मिलेगा।
            </p>
          </div>

          {/* Action Buttons: Calculate Button */}
          <div className="pt-3 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white text-sm sm:text-base font-black shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>🧮</span>
              <span>Diwali Bonus Calculate करें</span>
            </button>

            {hasCalculated && (
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black transition-all cursor-pointer flex items-center gap-1"
                title="रीसेट करें"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">रीसेट</span>
              </button>
            )}
          </div>

        </form>

      </div>

      {/* 2. CALCULATION RESULTS DISPLAY */}
      {evaluation && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Eligibility Verdict Banner */}
          {!evaluation.isEligible ? (
            <div className="p-4 sm:p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200 shadow-md space-y-2.5">
              <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-black text-sm sm:text-base">
                <XCircle className="w-5 h-5 shrink-0" />
                <span>तदर्थ बोनस हेतु अपात्र (Not Eligible for Ad-hoc Bonus)</span>
              </div>
              <div className="space-y-1.5 pl-7 text-xs sm:text-[13px] font-medium leading-relaxed">
                {evaluation.reasons.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="font-bold text-rose-600">•</span>
                    <span>{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              
              {/* Primary Approved Bonus Card */}
              <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-[-20px] top-[-20px] w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  
                  {/* Top Status Badges */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-amber-300" />
                      <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide">
                        स्वीकृत दीपावली तदर्थ बोनस (Approved Bonus)
                      </span>
                    </div>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                      {evaluation.serviceMonths} माह सेवा ({evaluation.netQualifyingDays} दिन)
                    </span>
                  </div>

                  {/* Big Total Bonus Amount */}
                  <div className="pt-1">
                    <span className="text-xs text-emerald-100 font-bold block">
                      कुल देय तदर्थ बोनस राशि (Total Bonus Payable):
                    </span>
                    <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                      <span>₹{evaluation.totalBonus.toLocaleString('en-IN')}</span>
                      {evaluation.serviceMonths < 12 && (
                        <span className="text-xs sm:text-sm font-semibold text-emerald-200">
                          (Pro-rata {evaluation.serviceMonths}/12)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 75% Cash vs 25% GPF Split Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/20">
                    
                    {/* 75% Cash in Bank Account */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
                      <div className="flex items-center justify-between text-emerald-100">
                        <span className="text-xs font-black">75% नकद (वेतन खाते में)</span>
                        <Coins className="w-4 h-4 text-amber-300" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white mt-1">
                        ₹{evaluation.cashShare.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-emerald-100/90 font-medium mt-1">
                        दीपावली पर्व से पूर्व सीधे बैंक खाते में भुगतान
                      </div>
                    </div>

                    {/* 25% GPF / GPF-2004 Account */}
                    <div className="p-3 sm:p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-inner">
                      <div className="flex items-center justify-between text-emerald-100">
                        <span className="text-xs font-black">25% जीपीएफ जमा (GPF Account)</span>
                        <Building2 className="w-4 h-4 text-amber-300" />
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white mt-1">
                        ₹{evaluation.gpfShare.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-emerald-100/90 font-medium mt-1">
                        GPF / GPF-2004 खाते में अग्रिम जमा
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Itemized Calculation Summary Table */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <h3 className="font-black text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>गणना का विवरण एवं सूत्र (Calculation Breakdown)</span>
                  </h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                    FD Pattern Verified
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-semibold">
                  <div className="py-2 flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>पद / पे-लेवल (Pay Level):</span>
                    <span className="font-black text-slate-900 dark:text-slate-100">{payLevel}</span>
                  </div>

                  <div className="py-2 flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>दर्ज परिलब्धियां (Actual Emoluments):</span>
                    <span className="font-black text-slate-900 dark:text-slate-100">₹{evaluation.enteredEmoluments.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="py-2 flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>गणना हेतु मान्य वेतन सीमा (Max Cap):</span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">₹{evaluation.cappedEmoluments.toLocaleString('en-IN')} (अधिरोपित अधिकतम)</span>
                  </div>

                  <div className="py-2 flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>वित्तीय वर्ष में कुल अर्हकारी सेवा:</span>
                    <span className="font-black text-slate-900 dark:text-slate-100">{evaluation.netQualifyingDays} दिन ({evaluation.serviceMonths} माह)</span>
                  </div>

                  {evaluation.deductedEol > 0 && (
                    <div className="py-2 flex items-center justify-between text-amber-700 dark:text-amber-400">
                      <span>अवैतनिक अवकाश (EOL) कटौती:</span>
                      <span className="font-black">-{evaluation.deductedEol} दिन</span>
                    </div>
                  )}

                  <div className="py-2 flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>मानक परिकलन सूत्र (30/31 दिन):</span>
                    <span className="font-black text-slate-900 dark:text-slate-100">(₹7,000 × 30) ÷ 31 = ₹6,774</span>
                  </div>

                  <div className="py-2 flex items-center justify-between text-slate-800 dark:text-slate-200 font-black">
                    <span>कुल स्वीकृत बोनस (Total Bonus):</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">₹{evaluation.totalBonus.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Share, Copy & Departmental Export Buttons */}
                <div className="pt-3 flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isExporting}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                    title="Download Departmental PDF"
                  >
                    <Download className="w-4 h-4 text-emerald-200" />
                    <span>{isExporting ? 'डाउनलोडिंग...' : 'विभागीय प्रपत्र PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintDepartmental}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
                    title="Print Departmental Report"
                  >
                    <Printer className="w-4 h-4 text-amber-300" />
                    <span>विभागीय प्रिंट</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyResult}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black flex items-center justify-center space-x-2 hover:bg-slate-800 cursor-pointer shadow-sm active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                        <span>कॉपी हो गया!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>बोनस विवरण कॉपी</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
