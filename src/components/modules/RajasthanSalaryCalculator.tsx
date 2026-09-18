import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Building2, 
  Printer, 
  RotateCcw, 
  Coins, 
  HelpCircle, 
  CheckCircle2, 
  Download, 
  Share2, 
  ShieldCheck, 
  FileText,
  Percent,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Language } from '../../types';
import { 
  RAJASTHAN_PAY_MATRIX, 
  getRghsDeduction, 
  getSiStandardSlab, 
  getGpfMinimumSlab 
} from '../../data/payMatrix';
import { 
  printDepartmentalReport, 
  downloadDepartmentalPdf, 
  CalculatorPdfOptions 
} from '../../services/unifiedPdfExportService';

interface RajasthanSalaryCalculatorProps {
  lang: Language;
}

// Fixed Remuneration during 2 years probation in Rajasthan
export const RAJASTHAN_PROBATION_RATES: Record<string, number> = {
  'L-1': 12400,
  'L-2': 12600,
  'L-3': 12800,
  'L-4': 13500,
  'L-5': 14600,
  'L-6': 15100,
  'L-7': 15800,
  'L-8': 18500,
  'L-9': 20300,
  'L-10': 23700,
  'L-11': 26500,
  'L-12': 31100,
  'L-13': 33400,
  'L-14': 39300,
  'L-15': 42700,
  'L-16': 47200,
};

export const SI_SLABS = [
  { minPay: 0, maxPay: 22000, standard: 800, step1: 1200, step2: 2200 },
  { minPay: 22001, maxPay: 28500, standard: 1200, step1: 2200, step2: 3000 },
  { minPay: 28501, maxPay: 38500, standard: 2200, step1: 3000, step2: 5000 },
  { minPay: 38501, maxPay: 51500, standard: 3000, step1: 5000, step2: 7000 },
  { minPay: 51501, maxPay: 72000, standard: 5000, step1: 7000, step2: 7000 },
  { minPay: 72001, maxPay: 9999999, standard: 7000, step1: 7000, step2: 7000 },
];

export const RajasthanSalaryCalculator: React.FC<RajasthanSalaryCalculatorProps> = ({ lang }) => {
  const isHi = lang === 'hi';

  // Status: Regular vs Probationer Trainee
  const [employeeStatus, setEmployeeStatus] = useState<'regular' | 'probation'>('regular');
  const [selectedLevel, setSelectedLevel] = useState<string>('L-10');
  const [selectedCellIndex, setSelectedCellIndex] = useState<number>(0);
  const [customBasicPay, setCustomBasicPay] = useState<number>(33800);
  const [useCustomBasic, setUseCustomBasic] = useState<boolean>(false);

  // Allowances Parameters
  const [daPercent, setDaPercent] = useState<number>(60); // Current Rajasthan DA = 60%
  const [cityCategory, setCityCategory] = useState<'Z' | 'Y' | 'none' | 'custom'>('Z');
  const [customHraPercent, setCustomHraPercent] = useState<number>(10);
  const [ccaAmount, setCcaAmount] = useState<number>(0); // City compensatory allowance if Jaipur
  const [specialPay, setSpecialPay] = useState<number>(0);
  const [hardshipAllowance, setHardshipAllowance] = useState<number>(0);

  // Deductions Parameters (Strictly Rajasthan Rules)
  const [siOption, setSiOption] = useState<'standard' | 'step1' | 'step2' | 'zero'>('standard');
  const [customSiAmount, setCustomSiAmount] = useState<number>(2200);
  const [gpfAmount, setGpfAmount] = useState<number>(2100);
  const [rghsAmount, setRghsAmount] = useState<number>(440);
  const [incomeTax, setIncomeTax] = useState<number>(2000);
  const [hitkariNidhi, setHitkariNidhi] = useState<number>(0); // E.g. ₹500 in Oct or monthly split
  const [licenseFee, setLicenseFee] = useState<number>(0); // Govt quarter rent
  const [otherDeduction, setOtherDeduction] = useState<number>(0);

  // Pay slip meta info
  const [employeeName, setEmployeeName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('अध्यापक लेवल-2 (Teacher L-2)');
  const [schoolOffice, setSchoolOffice] = useState<string>('रा.उ.मा.वि. (Govt. Sr. Sec. School)');

  // Pay matrix level data
  const currentLevelData = useMemo(() => {
    return RAJASTHAN_PAY_MATRIX.find(p => p.level === selectedLevel) || RAJASTHAN_PAY_MATRIX[3];
  }, [selectedLevel]);

  // Sync basic pay when level changes
  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl);
    setSelectedCellIndex(0);
    const found = RAJASTHAN_PAY_MATRIX.find(p => p.level === lvl);
    if (found && found.cells.length > 0) {
      const basic = found.cells[0];
      setCustomBasicPay(basic);
      autoApplySlabs(basic, lvl);
    }
  };

  const handleCellChange = (cellIdx: number) => {
    setSelectedCellIndex(cellIdx);
    if (currentLevelData.cells[cellIdx]) {
      const basic = currentLevelData.cells[cellIdx];
      setCustomBasicPay(basic);
      autoApplySlabs(basic, selectedLevel);
    }
  };

  const autoApplySlabs = (basic: number, lvl: string) => {
    setGpfAmount(getGpfMinimumSlab(basic));
    setRghsAmount(getRghsDeduction(lvl));
    const si = getSiStandardSlab(basic);
    setCustomSiAmount(si);
  };

  // Active Basic Pay Calculation
  const activeBasicPay = useMemo(() => {
    if (employeeStatus === 'probation') {
      return RAJASTHAN_PROBATION_RATES[selectedLevel] || 23700;
    }
    if (useCustomBasic) {
      return customBasicPay;
    }
    return currentLevelData.cells[selectedCellIndex] || currentLevelData.cells[0] || 33800;
  }, [employeeStatus, selectedLevel, useCustomBasic, customBasicPay, currentLevelData, selectedCellIndex]);

  // HRA Rate Calculation
  const activeHraPercent = useMemo(() => {
    if (employeeStatus === 'probation') return 0;
    if (cityCategory === 'none') return 0;
    if (cityCategory === 'Y') return 20; // Jaipur, Jodhpur, Kota, Ajmer, Bikaner (20%)
    if (cityCategory === 'Z') return 10; // Rest of Rajasthan (10%)
    return customHraPercent || 0;
  }, [employeeStatus, cityCategory, customHraPercent]);

  // Active SI Slabs Calculation
  const activeSiAmount = useMemo(() => {
    if (employeeStatus === 'probation') return 0; // No SI during probation
    if (siOption === 'zero') return 0;
    
    // Find matching slab
    const slab = SI_SLABS.find(s => activeBasicPay >= s.minPay && activeBasicPay <= s.maxPay) || SI_SLABS[SI_SLABS.length - 1];
    if (siOption === 'step1') return slab.step1;
    if (siOption === 'step2') return slab.step2;
    return slab.standard;
  }, [employeeStatus, siOption, activeBasicPay]);

  // Calculated Allowances
  const daAmount = useMemo(() => {
    if (employeeStatus === 'probation') return 0;
    return Math.round((activeBasicPay * daPercent) / 100);
  }, [employeeStatus, activeBasicPay, daPercent]);

  const hraAmount = useMemo(() => {
    if (employeeStatus === 'probation') return 0;
    return Math.round((activeBasicPay * activeHraPercent) / 100);
  }, [employeeStatus, activeBasicPay, activeHraPercent]);

  const grossEarnings = activeBasicPay + daAmount + hraAmount + ccaAmount + specialPay + hardshipAllowance;

  // Calculated Deductions
  const activeGpf = employeeStatus === 'probation' ? 0 : gpfAmount;
  const activeRghs = rghsAmount;
  const totalDeductions = activeSiAmount + activeGpf + activeRghs + incomeTax + hitkariNidhi + licenseFee + otherDeduction;

  // Net In-Hand Salary
  const netInHandSalary = Math.max(0, grossEarnings - totalDeductions);

  const handleReset = () => {
    setEmployeeStatus('regular');
    setSelectedLevel('L-10');
    setSelectedCellIndex(0);
    setUseCustomBasic(false);
    setCustomBasicPay(33800);
    setDaPercent(60);
    setCityCategory('Z');
    setCcaAmount(0);
    setSpecialPay(0);
    setHardshipAllowance(0);
    setSiOption('standard');
    setIncomeTax(2000);
    setHitkariNidhi(0);
    setLicenseFee(0);
    setOtherDeduction(0);
    autoApplySlabs(33800, 'L-10');
  };

  const [isExporting, setIsExporting] = useState(false);

  const buildDepartmentalPdfConfig = (): CalculatorPdfOptions => {
    return {
      reportTitleHi: 'राजस्थान 7वां वेतन आयोग वेतन निर्धारण एवं मासिक वेतन पर्ची',
      reportTitleEn: 'Government of Rajasthan 7th CPC Salary Fixation & Monthly Pay Slip',
      orderReference: `FD/RAJ/7CPC/${selectedLevel}/${new Date().getFullYear()}`,
      employeeDetails: {
        name: employeeName || 'राजकीय शिक्षक / कार्मिक',
        designation: designation || `${selectedLevel} श्रेणी शिक्षक / कार्मिक`,
        payLevel: selectedLevel,
        employeeId: 'RJ-EDU-' + Math.floor(100000 + Math.random() * 900000),
        cityCategory: cityCategory === 'Y' ? 'Y-City (20% HRA - जयपुर, जोधपुर, कोटा आदि)' : cityCategory === 'Z' ? 'Z-City (10% HRA - ग्रामीण व अन्य)' : 'HRA 0%'
      },
      summaryCards: [
        { label: 'सकल वेतन (Gross)', value: `₹${grossEarnings.toLocaleString('en-IN')}`, color: 'emerald' },
        { label: 'कुल कटौतियां (Deductions)', value: `₹${totalDeductions.toLocaleString('en-IN')}`, color: 'amber' },
        { label: 'शुद्ध देय वेतन (Net In-Hand)', value: `₹${netInHandSalary.toLocaleString('en-IN')}`, color: 'blue' }
      ],
      sections: [
        {
          title: 'परिलब्धियां एवं भत्ते (EARNINGS & ALLOWANCES)',
          rows: [
            { label: 'मूल वेतन (Basic Pay)', value: `₹${activeBasicPay.toLocaleString('en-IN')}` },
            { label: 'महंगाई भत्ता (DA @ 60%)', value: `₹${daAmount.toLocaleString('en-IN')}` },
            { label: `मकान किराया भत्ता (HRA @ ${activeHraPercent}%)`, value: `₹${hraAmount.toLocaleString('en-IN')}` },
            ...(ccaAmount > 0 ? [{ label: 'नगर क्षतिपूर्ति भत्ता (CCA)', value: `₹${ccaAmount.toLocaleString('en-IN')}` }] : []),
            ...(specialPay > 0 ? [{ label: 'विशेष भत्ता (Special Allowance)', value: `₹${specialPay.toLocaleString('en-IN')}` }] : []),
            { label: 'कुल सकल परिलब्धियां (GROSS EARNINGS)', value: `₹${grossEarnings.toLocaleString('en-IN')}`, highlight: true, type: 'earning' as const }
          ]
        },
        {
          title: 'कटौतियां एवं जीपीएफ/एसआई अंशदान (DEDUCTIONS & RECOVERIES)',
          rows: [
            { label: 'राज्य बीमा प्रीमियम (State Insurance - SI)', value: `₹${activeSiAmount.toLocaleString('en-IN')}`, type: 'deduction' as const },
            { label: 'सामान्य प्रावधायी निधि (GPF / GPF-2004)', value: `₹${activeGpf.toLocaleString('en-IN')}`, type: 'deduction' as const },
            { label: 'राजस्थान गवर्नमेंट हेल्थ स्कीम (RGHS)', value: `₹${activeRghs.toLocaleString('en-IN')}`, type: 'deduction' as const },
            { label: 'आयकर कटौती (Income Tax TDS)', value: `₹${incomeTax.toLocaleString('en-IN')}`, type: 'deduction' as const },
            ...(hitkariNidhi > 0 ? [{ label: 'हितकारी निधि कटौती', value: `₹${hitkariNidhi.toLocaleString('en-IN')}`, type: 'deduction' as const }] : []),
            ...(licenseFee > 0 ? [{ label: 'सरकारी आवास लाइसेंस फीस', value: `₹${licenseFee.toLocaleString('en-IN')}`, type: 'deduction' as const }] : []),
            ...(otherDeduction > 0 ? [{ label: 'अन्य विभागीय कटौतियां', value: `₹${otherDeduction.toLocaleString('en-IN')}`, type: 'deduction' as const }] : []),
            { label: 'कुल कटौतियां (TOTAL DEDUCTIONS)', value: `₹${totalDeductions.toLocaleString('en-IN')}`, highlight: true, type: 'deduction' as const }
          ]
        },
        {
          title: 'शुद्ध बैंक खाता भुगतान (NET PAYABLE TO BANK ACCOUNT)',
          rows: [
            { label: 'कर्मचारी बैंक खाते में देय शुद्ध राशि (NET PAYABLE)', value: `₹${netInHandSalary.toLocaleString('en-IN')}`, highlight: true, type: 'earning' as const },
            { label: 'वार्षिक कुल अनुमानित आय (Annual Gross Projected)', value: `₹${(grossEarnings * 12).toLocaleString('en-IN')}` },
            { label: 'वार्षिक कुल शुद्ध आय (Annual Net Projected)', value: `₹${(netInHandSalary * 12).toLocaleString('en-IN')}` }
          ]
        }
      ],
      notes: [
        'यह गणना राजस्थान सिविल सेवा (पुनरीक्षित वेतन) नियम 2017 एवं वित्त विभाग के 60% DA आदेशानुसार है।',
        'पे-मैनेजर (PayManager) पोर्टल पर मासिक वेतन बिल निर्माण व ई-वेतन पर्ची से मिलान हेतु पूर्णतया प्रामाणिक है।'
      ],
      signatories: [
        { title: 'हस्ताक्षर कार्मिक (Employee Sign)' },
        { title: 'हस्ताक्षर आहरण एवं संवितरण अधिकारी (DDO / PEEO Sign & Seal)' }
      ]
    };
  };

  const handlePrintSlip = () => {
    printDepartmentalReport(buildDepartmentalPdfConfig());
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await downloadDepartmentalPdf(buildDepartmentalPdfConfig(), `Rajasthan_PaySlip_${selectedLevel}_${activeBasicPay}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <Calculator className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight">
                {isHi ? 'राजस्थान 7वां वेतन आयोग सैलरी कैलकुलेटर' : 'Rajasthan 7th CPC Salary Calculator'}
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-xs">
                {isHi ? 'पे-मैनेजर नियमानुसार' : 'PayManager Rules'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/90 font-medium mt-1">
              {isHi 
                ? 'राजस्थान सेवा नियम (RSR), पे-मैट्रिक्स (L-1 से L-16), 60% डीए, HRA (10% / 20%), SI व GPF स्लैब आधारित गणना'
                : 'Strictly based on Rajasthan Service Rules (RSR), 7th Pay Matrix (L-1 to L-16), 60% DA, HRA, SI, GPF & RGHS'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? 'रीसेट' : 'Reset'}</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-black transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer border border-white/20 disabled:opacity-50"
            title="Download Departmental PDF"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{isExporting ? 'डाउनलोडिंग...' : (isHi ? 'PDF डाउनलोड' : 'Export PDF')}</span>
          </button>
          <button
            onClick={handlePrintSlip}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isHi ? 'विभागीय प्रिंट' : 'Print Slip'}</span>
          </button>
        </div>
      </div>

      {/* Employee Status Selector: Regular vs Probationer Trainee */}
      <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-xs font-black text-slate-700 dark:text-slate-300 ml-2">
          {isHi ? 'कार्मिक की सेवा स्थिति (Service Status):' : 'Employee Service Status:'}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEmployeeStatus('regular')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              employeeStatus === 'regular'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isHi ? '✓ नियमित कार्मिक (Regular Pay)' : 'Regular Pay'}
          </button>
          <button
            onClick={() => setEmployeeStatus('probation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              employeeStatus === 'probation'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isHi ? '⏳ परिवीक्षाधीन (Probationer Trainee)' : 'Probationer Trainee'}
          </button>
        </div>
      </div>

      {/* 2-Column Grid: Inputs & Live Rajasthan Pay Slip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Detailed Configuration */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Pay Scale & Basic Pay */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
              <span>{isHi ? '1. पद एवं मूल वेतन (Level & Basic Pay)' : '1. Pay Level & Basic'}</span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                {selectedLevel}
              </span>
            </h3>

            {/* Level Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{isHi ? 'पे-लेवल चुनें (Pay Matrix Level L-1 to L-16)' : 'Select Pay Level'}</span>
              </label>
              <select
                value={selectedLevel}
                onChange={e => handleLevelChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {RAJASTHAN_PAY_MATRIX.map(pm => (
                  <option key={pm.level} value={pm.level}>
                    {pm.level} — {pm.designationExamples[0]} (Entry: ₹{pm.cells[0].toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Probation Mode Notice or Cell Selector */}
            {employeeStatus === 'probation' ? (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1">
                <span className="text-xs font-black text-amber-900 dark:text-amber-300 block">
                  {isHi ? 'राजस्थान परिवीक्षा काल (2 वर्ष) नियत पारिश्रमिक:' : 'Rajasthan Probation Fixed Remuneration:'}
                </span>
                <p className="text-xl font-black text-amber-700 dark:text-amber-400">
                  ₹{(RAJASTHAN_PROBATION_RATES[selectedLevel] || 23700).toLocaleString('en-IN')} / माह
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  {isHi 
                    ? '*परिवीक्षा अवधि में केवल नियत वेतन मिलता है। कोई डीए या एचआरए देय नहीं होता। केवल RGHS कटौती होती है।'
                    : '*During 2 years probation, fixed salary is paid with no DA or HRA. Only RGHS/GPF deductions apply.'}
                </p>
              </div>
            ) : (
              <>
                {/* Pay Matrix Cell Selector */}
                {!useCustomBasic ? (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>{isHi ? 'पे-मैट्रिक्स सेल (वेतन वृद्धि वर्ष / Cell)' : 'Pay Matrix Cell'}</span>
                      <button
                        type="button"
                        onClick={() => setUseCustomBasic(true)}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-extrabold hover:underline cursor-pointer"
                      >
                        {isHi ? 'कस्टम बेसिक दर्ज करें' : 'Enter Custom Basic'}
                      </button>
                    </label>
                    <select
                      value={selectedCellIndex}
                      onChange={e => handleCellChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {currentLevelData.cells.map((cellPay, idx) => (
                        <option key={idx} value={idx}>
                          सेल {idx + 1}: ₹{cellPay.toLocaleString('en-IN')} {idx === 0 ? '(आरंभिक वेतन)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>{isHi ? 'कस्टम मूल वेतन (Basic Pay ₹)' : 'Custom Basic Pay (₹)'}</span>
                      <button
                        type="button"
                        onClick={() => setUseCustomBasic(false)}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-extrabold hover:underline cursor-pointer"
                      >
                        {isHi ? 'पे-मैट्रिक्स सेल से चुनें' : 'Use Matrix Cell'}
                      </button>
                    </label>
                    <input
                      type="number"
                      step={100}
                      value={customBasicPay}
                      onChange={e => {
                        const val = Number(e.target.value) || 0;
                        setCustomBasicPay(val);
                        autoApplySlabs(val, selectedLevel);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-black text-base text-slate-900 dark:text-slate-100"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Allowances: DA, HRA, CCA */}
          {employeeStatus === 'regular' && (
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                {isHi ? '2. भत्ते (Allowances: DA & HRA)' : '2. Allowances (DA & HRA)'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* DA Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>{isHi ? 'महंगाई भत्ता (DA %)' : 'Dearness Allowance (DA %)'}</span>
                    <span className="text-[11px] text-amber-600 font-bold">{daPercent}%</span>
                  </label>
                  <div className="flex gap-1.5">
                    {[53, 58, 60].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setDaPercent(v)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
                          daPercent === v
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {v}% {v === 60 ? '(लागू)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Category / HRA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>{isHi ? 'शहर श्रेणी (HRA)' : 'City Category (HRA)'}</span>
                    <span className="text-[11px] text-purple-600 font-bold">{activeHraPercent}%</span>
                  </label>
                  <select
                    value={cityCategory}
                    onChange={e => setCityCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  >
                    <option value="Z">Z-श्रेणी: 10% HRA (ग्रामीण एवं अन्य जिले / All Other)</option>
                    <option value="Y">Y-श्रेणी: 20% HRA (जयपुर, जोधपुर, कोटा, अजमेर, बीकानेर)</option>
                    <option value="none">0% HRA (शासकीय आवास / Govt Quarter)</option>
                    <option value="custom">कस्टम HRA % (Custom)</option>
                  </select>
                </div>
              </div>

              {cityCategory === 'custom' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isHi ? 'कस्टम मकान किराया भत्ता (HRA %):' : 'Custom HRA %:'}
                  </label>
                  <input
                    type="number"
                    value={customHraPercent}
                    onChange={e => setCustomHraPercent(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              )}

              {/* Other Allowances Accordion / Inputs */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                    {isHi ? 'विशेष वेतन / भत्ता (₹)' : 'Special Pay (₹)'}
                  </label>
                  <input
                    type="number"
                    value={specialPay}
                    onChange={e => setSpecialPay(Number(e.target.value) || 0)}
                    placeholder="₹0"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                    {isHi ? 'CCA नगर क्षतिपूरक भत्ता (₹)' : 'CCA Allowance (₹)'}
                  </label>
                  <input
                    type="number"
                    value={ccaAmount}
                    onChange={e => setCcaAmount(Number(e.target.value) || 0)}
                    placeholder="₹0"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Deductions (Strict Rajasthan Slabs) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
              <span>{isHi ? '3. राजस्थान कटौतियां (Rajasthan Deductions)' : '3. Deductions (SI, GPF, RGHS)'}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h3>

            {employeeStatus === 'regular' && (
              <>
                {/* State Insurance (SI / राज्य बीमा) with Step-Up option */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isHi ? 'राज्य बीमा (SI) प्रीमियम स्लैब' : 'State Insurance (SI) Premium'}
                    </label>
                    <span className="text-xs font-black text-rose-600">₹{activeSiAmount}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSiOption('standard')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        siOption === 'standard'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isHi ? 'मानक (Standard)' : 'Standard'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSiOption('step1')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        siOption === 'step1'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isHi ? '1-स्टेप आगे (+1 Step)' : '+1 Step Up'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSiOption('step2')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        siOption === 'step2'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isHi ? '2-स्टेप आगे (+2 Step)' : '+2 Step Up'}
                    </button>
                  </div>
                </div>

                {/* GPF Contribution */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isHi ? 'सामान्य भविष्य निधि (GPF-SAB / 2021 नियम)' : 'GPF Contribution (Min Slab: Rules 2021)'}
                    </label>
                    <span className="text-xs font-black text-rose-600">₹{gpfAmount}</span>
                  </div>
                  <input
                    type="number"
                    step={100}
                    value={gpfAmount}
                    onChange={e => setGpfAmount(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-black text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-[10px] text-slate-500">
                    {isHi ? `*आपके वेतन अनुसार न्यूनतम स्लैब: ₹${getGpfMinimumSlab(activeBasicPay)} (ऐच्छिक अधिक राशि संभव)` : `*Minimum slab for basic: ₹${getGpfMinimumSlab(activeBasicPay)}`}
                  </span>
                </div>
              </>
            )}

            {/* RGHS Health Scheme (Applicable in both Regular & Probation) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isHi ? 'आरजीएचएस (RGHS - राजस्थान स्वास्थ्य योजना)' : 'RGHS Health Scheme Slab'}
                </label>
                <span className="text-xs font-black text-rose-600">₹{rghsAmount}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {[220, 440, 658, 875].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRghsAmount(amt)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      rghsAmount === amt
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Income Tax & Other */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {isHi ? 'मासिक आयकर (TDS / IT)' : 'Income Tax / TDS'}
                </label>
                <input
                  type="number"
                  value={incomeTax}
                  onChange={e => setIncomeTax(Number(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {isHi ? 'हितकारी निधि / अन्य (₹)' : 'Hitkari / Other (₹)'}
                </label>
                <input
                  type="number"
                  value={hitkariNidhi}
                  onChange={e => setHitkariNidhi(Number(e.target.value) || 0)}
                  placeholder="₹0"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right: Live Rajasthan PayManager Style Pay Slip */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Quick Net In-Hand Summary Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-100 block">
              {isHi ? '💰 शुद्ध देय वेतन (Net In-Hand Salary)' : '💰 Net Take-Home Salary'}
            </span>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tight">
                ₹{netInHandSalary.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
                {employeeStatus === 'probation' ? (isHi ? 'परिवीक्षा काल' : 'Probation') : (isHi ? 'नियमित 7वां वेतन' : 'Regular 7th CPC')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-xs font-bold">
              <div>
                <span className="text-emerald-200 block text-[11px]">{isHi ? 'कुल परिलब्धियां (Gross):' : 'Gross Earnings:'}</span>
                <span className="text-base font-black">₹{grossEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="text-rose-200 block text-[11px]">{isHi ? 'कुल कटौतियां (Deductions):' : 'Total Deductions:'}</span>
                <span className="text-base font-black text-rose-200">-₹{totalDeductions.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Authentic Rajasthan PayManager Style Pay Slip Print Area */}
          <div id="rajasthan-salary-slip" className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 font-sans print:border-none print:shadow-none">
            {/* Slip Header */}
            <div className="text-center border-b-2 border-slate-900 dark:border-slate-100 pb-3 space-y-0.5">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                GOVERNMENT OF RAJASTHAN • FINANCE DEPARTMENT
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {isHi ? 'मासिक वेतन विवरण पर्ची (PAY SLIP)' : 'MONTHLY SALARY BILL SLIP'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                {isHi ? 'शिक्षा विभाग राजस्थान • 7वां वेतन आयोग' : 'Department of Education, Rajasthan'}
              </p>
            </div>

            {/* Employee Details Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs py-1 border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-[10.5px] text-slate-400 font-semibold block">{isHi ? 'पद/लेवल:' : 'Designation / Level:'}</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">{selectedLevel} ({currentLevelData.designationExamples[0]})</span>
              </div>
              <div>
                <span className="text-[10.5px] text-slate-400 font-semibold block">{isHi ? 'सेवा स्थिति:' : 'Status:'}</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">
                  {employeeStatus === 'probation' ? (isHi ? 'परिवीक्षाधीन (Probation)' : 'Probationer') : (isHi ? 'स्थाई / नियमित' : 'Regular')}
                </span>
              </div>
              <div>
                <span className="text-[10.5px] text-slate-400 font-semibold block">{isHi ? 'शहर श्रेणी (HRA):' : 'City / HRA:'}</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100">
                  {cityCategory === 'Y' ? 'Y-Class (20%)' : cityCategory === 'Z' ? 'Z-Class (10%)' : '0%'}
                </span>
              </div>
            </div>

            {/* Inner / Outer 2-Column Table: Earnings vs Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              
              {/* Left Column: Earnings (परिलब्धियां) */}
              <div className="border rounded-2xl border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 border-b border-slate-200 dark:border-slate-800 font-black text-xs text-emerald-900 dark:text-emerald-300 flex justify-between">
                  <span>{isHi ? 'परिलब्धियां (Earnings)' : 'Earnings'}</span>
                  <span>राशि (₹)</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold p-1">
                  <div className="flex justify-between py-1.5 px-2">
                    <span className="text-slate-700 dark:text-slate-300">{isHi ? 'मूल वेतन (Basic Pay)' : 'Basic Pay'}</span>
                    <span className="font-black text-slate-900 dark:text-slate-100">₹{activeBasicPay.toLocaleString('en-IN')}</span>
                  </div>
                  {employeeStatus === 'regular' && (
                    <>
                      <div className="flex justify-between py-1.5 px-2">
                        <span className="text-slate-700 dark:text-slate-300">{isHi ? `महंगाई भत्ता (DA ${daPercent}%)` : `DA (${daPercent}%)`}</span>
                        <span className="font-black text-slate-900 dark:text-slate-100">₹{daAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1.5 px-2">
                        <span className="text-slate-700 dark:text-slate-300">{isHi ? `मकान किराया (HRA ${activeHraPercent}%)` : `HRA (${activeHraPercent}%)`}</span>
                        <span className="font-black text-slate-900 dark:text-slate-100">₹{hraAmount.toLocaleString('en-IN')}</span>
                      </div>
                      {ccaAmount > 0 && (
                        <div className="flex justify-between py-1.5 px-2">
                          <span className="text-slate-700 dark:text-slate-300">नगर क्षतिपूरक (CCA)</span>
                          <span className="font-black text-slate-900 dark:text-slate-100">₹{ccaAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {specialPay > 0 && (
                        <div className="flex justify-between py-1.5 px-2">
                          <span className="text-slate-700 dark:text-slate-300">विशेष वेतन (Special Pay)</span>
                          <span className="font-black text-slate-900 dark:text-slate-100">₹{specialPay.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-black text-xs text-slate-900 dark:text-slate-100">
                  <span>{isHi ? 'सकल वेतन (Gross Pay)' : 'Total Gross'}</span>
                  <span>₹{grossEarnings.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Right Column: Deductions (कटौतियां) */}
              <div className="border rounded-2xl border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-rose-50 dark:bg-rose-950/40 px-3 py-2 border-b border-slate-200 dark:border-slate-800 font-black text-xs text-rose-900 dark:text-rose-300 flex justify-between">
                  <span>{isHi ? 'कटौतियां (Deductions)' : 'Deductions'}</span>
                  <span>राशि (₹)</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold p-1">
                  {employeeStatus === 'regular' && (
                    <>
                      <div className="flex justify-between py-1.5 px-2">
                        <span className="text-slate-700 dark:text-slate-300">राज्य बीमा (SI)</span>
                        <span className="font-black text-rose-600">₹{activeSiAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between py-1.5 px-2">
                        <span className="text-slate-700 dark:text-slate-300">GPF-SAB (भविष्य निधि)</span>
                        <span className="font-black text-rose-600">₹{activeGpf.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between py-1.5 px-2">
                    <span className="text-slate-700 dark:text-slate-300">आरजीएचएस (RGHS)</span>
                    <span className="font-black text-rose-600">₹{activeRghs.toLocaleString('en-IN')}</span>
                  </div>
                  {incomeTax > 0 && (
                    <div className="flex justify-between py-1.5 px-2">
                      <span className="text-slate-700 dark:text-slate-300">आयकर (Income Tax/TDS)</span>
                      <span className="font-black text-rose-600">₹{incomeTax.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {hitkariNidhi > 0 && (
                    <div className="flex justify-between py-1.5 px-2">
                      <span className="text-slate-700 dark:text-slate-300">हितकारी निधि (Hitkari)</span>
                      <span className="font-black text-rose-600">₹{hitkariNidhi.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-black text-xs text-rose-700 dark:text-rose-400">
                  <span>{isHi ? 'कुल कटौतियां (Total Deduct)' : 'Total Deductions'}</span>
                  <span>₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            {/* Bottom Net In Hand Row in Pay Slip */}
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between font-black text-sm text-emerald-950 dark:text-emerald-100">
              <span>{isHi ? 'शुद्ध बैंक खाता भुगतान (NET PAYABLE TO BANK):' : 'NET PAYABLE TO BANK:'}</span>
              <span className="text-lg text-emerald-700 dark:text-emerald-300">₹{netInHandSalary.toLocaleString('en-IN')}</span>
            </div>

            {/* Footer Signatures for Print */}
            <div className="hidden print:grid grid-cols-2 pt-12 text-xs font-black text-slate-800">
              <div>हस्ताक्षर कार्मिक (Employee Sign)</div>
              <div className="text-right">हस्ताक्षर आहरण एवं संवितरण अधिकारी (DDO Sign & Seal)</div>
            </div>
          </div>

          {/* Annual Projection Summary Box */}
          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block">
                {isHi ? 'वार्षिक अनुमानित आय (Annual Projected Gross)' : 'Annual Projected Gross:'}
              </span>
              <span className="font-black text-base text-slate-900 dark:text-slate-100">
                ₹{(grossEarnings * 12).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 block">
                {isHi ? 'वार्षिक कुल इन-हैंड (Annual Net)' : 'Annual Net Take-Home:'}
              </span>
              <span className="font-black text-base text-emerald-600 dark:text-emerald-400">
                ₹{(netInHandSalary * 12).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Quick Departmental Action Bar */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-200" />
              <span>{isExporting ? 'PDF तैयार हो रहा है...' : (isHi ? 'विभागीय वेतन पर्ची PDF डाउनलोड' : 'Download Departmental Pay Slip PDF')}</span>
            </button>
            <button
              onClick={handlePrintSlip}
              className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{isHi ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
