import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Printer, 
  RotateCcw, 
  ChevronDown, 
  CheckCircle2, 
  HelpCircle, 
  Coins, 
  Building2, 
  Percent, 
  Info,
  DollarSign
} from 'lucide-react';
import { Language } from '../../types';
import { RAJASTHAN_PAY_MATRIX, getRghsDeduction, getSiStandardSlab, getGpfMinimumSlab } from '../../data/payMatrix';

interface PayCommission8CalculatorProps {
  lang: Language;
  onPrint?: () => void;
}

export const FITMENT_OPTIONS = [
  { value: '1.92', label: '1.92x (न्यूनतम प्रस्तावित / Min Rumor)', desc: 'न्यूनतम बेसिक ₹34,000 के आधार पर' },
  { value: '2.00', label: '2.00x (मानक 2x फ़ैक्टर / Standard)', desc: 'सीधा दोगुना मूल वेतन' },
  { value: '2.15', label: '2.15x (संभावित पे-मैट्रिक्स / Likely)', desc: 'अधिकांश कर्मचारी संगठनों की शुरुआती अपेक्षा' },
  { value: '2.22', label: '2.22x (चर्चित 8वां CPC फ़ैक्टर / Most Discussed)', desc: 'सोशल मीडिया व मीडिया में सबसे ज्यादा चर्चित' },
  { value: '2.57', label: '2.57x (7वें वेतन आयोग समतुल्य / 7th CPC Replica)', desc: '7वें वेतन आयोग जैसा 2.57 गुना फ़िटमेंट' },
  { value: '2.86', label: '2.86x (कर्मचारी महासंघ की मांग / Union Demand)', desc: 'अखिल भारतीय कर्मचारी संगठनों की औपचारिक मांग' },
  { value: '3.00', label: '3.00x (अधिकतम अनुमान / Max Projection)', desc: 'उच्चतम संभावित 3 गुना गुणक' },
  { value: 'custom', label: '✏️ कस्टम फ़िटमेंट फ़ैक्टर (Custom)', desc: 'अपनी पसंद का कोई भी फ़ैक्टर दर्ज करें' }
];

export const PayCommission8Calculator: React.FC<PayCommission8CalculatorProps> = ({ lang }) => {
  const isHi = lang === 'hi';

  // 1. Current 7th CPC Inputs
  const [selectedLevel, setSelectedLevel] = useState<string>('L-10');
  const [basicPay, setBasicPay] = useState<number>(38000);
  const [daPercent, setDaPercent] = useState<number>(60); // Current DA in Rajasthan (60%)
  const [hraPercent, setHraPercent] = useState<number>(10); // 10% (Z) or 20% (Y) or custom
  const [customHraPercent, setCustomHraPercent] = useState<string>('10');
  const [hraType, setHraType] = useState<'10' | '20' | 'custom'>('10');
  const [specialAllowance, setSpecialAllowance] = useState<number>(0);

  // Current Deductions (Rajasthan Defaults)
  const [gpfDeduction, setGpfDeduction] = useState<number>(() => getGpfMinimumSlab(38000));
  const [siDeduction, setSiDeduction] = useState<number>(() => getSiStandardSlab(38000));
  const [rghsDeduction, setRghsDeduction] = useState<number>(() => getRghsDeduction('L-10'));
  const [taxDeduction, setTaxDeduction] = useState<number>(2000);
  const [otherDeduction, setOtherDeduction] = useState<number>(0);

  // 2. 8th CPC Rumor Fitment Factor
  const [fitmentFactorType, setFitmentFactorType] = useState<string>('2.22');
  const [customFitmentFactor, setCustomFitmentFactor] = useState<number>(2.22);

  // 3. 8th CPC Projected Parameters
  const [projectedDaPercent, setProjectedDaPercent] = useState<number>(3); // Initial 0-3%
  const [projectedHraType, setProjectedHraType] = useState<'same' | '10' | '20' | 'custom'>('same');
  const [customProjectedHra, setCustomProjectedHra] = useState<number>(9);
  const [autoProjectDeductions, setAutoProjectDeductions] = useState<boolean>(true);
  const [custom8thGpf, setCustom8thGpf] = useState<number>(0);
  const [custom8thSi, setCustom8thSi] = useState<number>(0);
  const [custom8thRghs, setCustom8thRghs] = useState<number>(0);
  const [custom8thTax, setCustom8thTax] = useState<number>(0);

  // When Level or Basic Pay changes, auto-update standard deductions
  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl);
    const found = RAJASTHAN_PAY_MATRIX.find(p => p.level === lvl);
    if (found && found.cells.length > 0) {
      const newBasic = found.cells[0];
      setBasicPay(newBasic);
      setGpfDeduction(getGpfMinimumSlab(newBasic));
      setSiDeduction(getSiStandardSlab(newBasic));
      setRghsDeduction(getRghsDeduction(lvl));
    }
  };

  const handleBasicChange = (val: number) => {
    setBasicPay(val);
    setGpfDeduction(getGpfMinimumSlab(val));
    setSiDeduction(getSiStandardSlab(val));
    setRghsDeduction(getRghsDeduction(selectedLevel));
  };

  const handleHraTypeChange = (type: '10' | '20' | 'custom') => {
    setHraType(type);
    if (type === '10') setHraPercent(10);
    else if (type === '20') setHraPercent(20);
    else setHraPercent(Number(customHraPercent) || 0);
  };

  // Active Fitment Factor
  const activeFitmentFactor = useMemo(() => {
    if (fitmentFactorType === 'custom') {
      return Number(customFitmentFactor) || 1.92;
    }
    return Number(fitmentFactorType) || 2.22;
  }, [fitmentFactorType, customFitmentFactor]);

  // Current (7th CPC) Calculations
  const currentDaAmount = Math.round((basicPay * daPercent) / 100);
  const currentHraAmount = Math.round((basicPay * hraPercent) / 100);
  const currentGross = basicPay + currentDaAmount + currentHraAmount + specialAllowance;
  const currentTotalDeductions = gpfDeduction + siDeduction + rghsDeduction + taxDeduction + otherDeduction;
  const currentNetPay = Math.max(0, currentGross - currentTotalDeductions);

  // Projected (8th CPC) Calculations
  const projectedBasic = useMemo(() => {
    const raw = basicPay * activeFitmentFactor;
    // Round up to nearest 100 as per Pay Commission rounding rules
    return Math.ceil(raw / 100) * 100;
  }, [basicPay, activeFitmentFactor]);

  const activeProjectedHraPercent = useMemo(() => {
    if (projectedHraType === 'same') return hraPercent;
    if (projectedHraType === '10') return 10;
    if (projectedHraType === '20') return 20;
    return Number(customProjectedHra) || 9;
  }, [projectedHraType, hraPercent, customProjectedHra]);

  const projectedDaAmount = Math.round((projectedBasic * projectedDaPercent) / 100);
  const projectedHraAmount = Math.round((projectedBasic * activeProjectedHraPercent) / 100);
  const projectedGross = projectedBasic + projectedDaAmount + projectedHraAmount + specialAllowance;

  // Projected Deductions
  const projectedGpf = useMemo(() => {
    if (!autoProjectDeductions) return custom8thGpf;
    // Scale GPF roughly with new basic pay slab
    return Math.round(gpfDeduction * (projectedBasic / basicPay));
  }, [autoProjectDeductions, custom8thGpf, gpfDeduction, projectedBasic, basicPay]);

  const projectedSi = useMemo(() => {
    if (!autoProjectDeductions) return custom8thSi;
    return Math.round(siDeduction * (projectedBasic / basicPay));
  }, [autoProjectDeductions, custom8thSi, siDeduction, projectedBasic, basicPay]);

  const projectedRghs = useMemo(() => {
    if (!autoProjectDeductions) return custom8thRghs;
    return rghsDeduction; // Standard health slab
  }, [autoProjectDeductions, custom8thRghs, rghsDeduction]);

  const projectedTax = useMemo(() => {
    if (!autoProjectDeductions) return custom8thTax;
    // Tax increases slightly due to higher slab
    return Math.round(taxDeduction * 1.5);
  }, [autoProjectDeductions, custom8thTax, taxDeduction]);

  const projectedTotalDeductions = projectedGpf + projectedSi + projectedRghs + projectedTax + otherDeduction;
  const projectedNetPay = Math.max(0, projectedGross - projectedTotalDeductions);

  // Differences & Increases
  const basicDifference = projectedBasic - basicPay;
  const basicPercentIncrease = ((basicDifference / basicPay) * 100).toFixed(1);

  const grossDifference = projectedGross - currentGross;
  const grossPercentIncrease = ((grossDifference / currentGross) * 100).toFixed(1);

  const netDifference = projectedNetPay - currentNetPay;
  const netPercentIncrease = currentNetPay > 0 ? ((netDifference / currentNetPay) * 100).toFixed(1) : '0';
  const annualNetGain = netDifference * 12;

  const handleReset = () => {
    setSelectedLevel('L-10');
    setBasicPay(38000);
    setDaPercent(53);
    setHraType('9');
    setHraPercent(9);
    setSpecialAllowance(0);
    setFitmentFactorType('2.22');
    setCustomFitmentFactor(2.22);
    setProjectedDaPercent(3);
    setProjectedHraType('same');
    setAutoProjectDeductions(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white shadow-xl border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <Coins className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight">
                {isHi ? '8वां वेतन आयोग (8th CPC) वेतन तुलना कैलकुलेटर' : '8th Pay Commission Salary Comparison Calculator'}
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                {isHi ? 'प्रोजेक्शन व तुलना' : 'Interactive Projection'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-1">
              {isHi 
                ? 'कस्टम इनपुट, चर्चित फ़िटमेंट फ़ैक्टर (1.92x से 3.00x) के साथ वर्तमान 7वें व संभावित 8वें वेतन की पूर्ण तुलना'
                : 'Customizable inputs, rumored 8th CPC fitment factors, and side-by-side net salary comparison'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? 'रीसेट' : 'Reset'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isHi ? 'तुलना पर्ची प्रिंट' : 'Print Comparison'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Inputs (Left) & Results Comparison (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: All Custom User-Based Inputs */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Card 1: Current 7th CPC Settings */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {isHi ? 'वर्तमान 7वां वेतन आयोग विवरण (Current 7th CPC)' : 'Current 7th CPC Parameters'}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                {selectedLevel}
              </span>
            </div>

            {/* Quick Level Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{isHi ? 'पे मैट्रिक्स लेवल (Level L-1 to L-16)' : 'Pay Matrix Level'}</span>
                <span className="text-[11px] text-slate-500">{isHi ? 'राजस्थान 7वां वेतन' : 'Rajasthan Pay Scale'}</span>
              </label>
              <select
                value={selectedLevel}
                onChange={e => handleLevelChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {RAJASTHAN_PAY_MATRIX.map(pm => (
                  <option key={pm.level} value={pm.level}>
                    {pm.level} — {pm.designationExamples[0]} (Entry: ₹{pm.cells[0].toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>

            {/* Basic Pay Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{isHi ? 'वर्तमान मूल वेतन (Current Basic Pay ₹)' : 'Current Basic Pay (₹)'}</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {isHi ? 'मैन्युअल बदलें' : 'Custom Input Allowed'}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
                <input
                  type="number"
                  step={100}
                  value={basicPay}
                  onChange={e => handleBasicChange(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Current DA % and HRA % */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* DA */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>{isHi ? 'वर्तमान डीए (DA %)' : 'Current DA (%)'}</span>
                  <span className="text-[10.5px] text-amber-600 dark:text-amber-400 font-bold">{daPercent}%</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={daPercent}
                    onChange={e => setDaPercent(Number(e.target.value) || 0)}
                    className="w-20 px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs text-center text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex gap-1 flex-1">
                    {[50, 53, 55].map(daVal => (
                      <button
                        key={daVal}
                        type="button"
                        onClick={() => setDaPercent(daVal)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          daPercent === daVal
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {daVal}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* HRA */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>{isHi ? 'एचआरए (HRA %)' : 'HRA (%)'}</span>
                  <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold">{hraPercent}%</span>
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => handleHraTypeChange('10')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      hraType === '10'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    10% (Z)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHraTypeChange('20')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      hraType === '20'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    20% (Y)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHraTypeChange('custom')}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      hraType === 'custom'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Custom
                  </button>
                </div>
                {hraType === 'custom' && (
                  <input
                    type="number"
                    value={customHraPercent}
                    onChange={e => {
                      setCustomHraPercent(e.target.value);
                      setHraPercent(Number(e.target.value) || 0);
                    }}
                    placeholder="Custom HRA %"
                    className="w-full mt-1 px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                )}
              </div>
            </div>

            {/* Deductions Breakdown Toggle / Inputs */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                {isHi ? 'वर्तमान कटौतियां (Current Deductions ₹)' : 'Current Monthly Deductions (₹)'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">GPF-SAB</span>
                  <input
                    type="number"
                    value={gpfDeduction}
                    onChange={e => setGpfDeduction(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">SI (राज्य बीमा)</span>
                  <input
                    type="number"
                    value={siDeduction}
                    onChange={e => setSiDeduction(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">RGHS (स्वास्थ्य)</span>
                  <input
                    type="number"
                    value={rghsDeduction}
                    onChange={e => setRghsDeduction(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block">आयकर (TDS/Tax)</span>
                  <input
                    type="number"
                    value={taxDeduction}
                    onChange={e => setTaxDeduction(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Card 2: 8th CPC Rumored Fitment Factor Selector */}
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/60 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-amber-200 dark:border-amber-900/40 pb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <span>{isHi ? '8वां वेतन आयोग फ़िटमेंट फ़ैक्टर (Fitment Factor)' : '8th CPC Fitment Factor'}</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h3>
                <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  {isHi ? 'चर्चित फ़िटमेंट फ़ैक्टर चुनें या अपना कस्टम गुणक दर्ज करें' : 'Select rumored multiplier or enter custom factor'}
                </p>
              </div>
            </div>

            {/* Dropdown Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isHi ? 'प्रस्तावित/चर्चित फ़िटमेंट फ़ैक्टर चुनें' : 'Choose Proposed/Rumored Factor'}
              </label>
              <select
                value={fitmentFactorType}
                onChange={e => setFitmentFactorType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-amber-400 dark:border-amber-700 bg-white dark:bg-slate-900 font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs"
              >
                {FITMENT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* If Custom Selected, show exact input */}
            {fitmentFactorType === 'custom' && (
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-400 dark:border-amber-700 space-y-1 animate-fadeIn">
                <label className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  {isHi ? 'कस्टम फ़िटमेंट गुणक दर्ज करें (e.g., 2.15, 2.28, 2.65):' : 'Enter Custom Fitment Multiplier:'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="5.0"
                  value={customFitmentFactor}
                  onChange={e => setCustomFitmentFactor(Number(e.target.value) || 1.92)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-500 bg-amber-50/50 dark:bg-slate-800 font-black text-base text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            )}

            {/* Active Factor Indicator */}
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  {isHi ? 'लागू फ़िटमेंट गुणक:' : 'Active Multiplier:'}
                </span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  {basicPay.toLocaleString('en-IN')} × <span className="text-amber-600 dark:text-amber-400">{activeFitmentFactor}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                  {isHi ? 'नया बेसिक (पूर्णांक ₹100)' : 'Projected Basic'}
                </span>
                <span className="font-black text-base sm:text-lg text-emerald-700 dark:text-emerald-400">
                  ₹{projectedBasic.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Additional 8th CPC Assumptions */}
            <div className="pt-2 border-t border-amber-200/80 dark:border-amber-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isHi ? '8वें वेतन आयोग का शुरुआती डीए (DA %)' : '8th CPC Starting DA (%)'}
                </label>
                <div className="flex items-center space-x-1">
                  {[0, 3, 4].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setProjectedDaPercent(v)}
                      className={`px-2 py-0.5 rounded text-xs font-bold border transition-colors cursor-pointer ${
                        projectedDaPercent === v
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={projectedDaPercent}
                    onChange={e => setProjectedDaPercent(Number(e.target.value) || 0)}
                    className="w-12 px-1 py-0.5 text-xs text-center font-bold border rounded bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isHi 
                  ? '*नए वेतन आयोग लागू होने पर अमूमन डीए 0% या 3% से शुरू होता है और पूर्व डीए मूल वेतन में समाहित हो जाता है।' 
                  : '*Under a new Pay Commission, existing DA is merged into the new basic pay and starting DA resets to 0–3%.'}
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Comparison Table & Net In-Hand Gain Analytics */}
        <div className="lg:col-span-6 space-y-5">
          
          {/* Main Comparison Header Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Current In-Hand */}
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                {isHi ? 'वर्तमान नेट इन-हैंड (7th CPC)' : 'Current In-Hand (7th CPC)'}
              </span>
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                ₹{currentNetPay.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-slate-400 block">
                {isHi ? `ग्रॉस: ₹${currentGross.toLocaleString('en-IN')}` : `Gross: ₹${currentGross.toLocaleString('en-IN')}`}
              </span>
            </div>

            {/* Projected 8th In-Hand */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-700 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block flex items-center justify-between">
                <span>{isHi ? '8वां वेतन अनुमानित नेट' : '8th CPC Projected Net'}</span>
                <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-black">
                  +{netPercentIncrease}%
                </span>
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300">
                ₹{projectedNetPay.toLocaleString('en-IN')}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                {isHi ? `ग्रॉस: ₹${projectedGross.toLocaleString('en-IN')}` : `Gross: ₹${projectedGross.toLocaleString('en-IN')}`}
              </span>
            </div>
          </div>

          {/* NET MONTHLY & ANNUAL DIFFERENCE HIGHLIGHT */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                {isHi ? '✨ अनुमानित मासिक इन-हैंड वृद्धि (Monthly In-Hand Gain)' : '✨ Projected Monthly Net Gain'}
              </span>
              <span className="text-xs font-black bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
                {activeFitmentFactor}x
              </span>
            </div>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-black tracking-tight">
                  +₹{netDifference.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-extrabold text-slate-800">
                  {isHi ? '/ प्रति माह अतिरिक्त' : '/ month extra'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-800 block">
                  {isHi ? 'वार्षिक कुल लाभ (Annual Gain):' : 'Annual Total Gain:'}
                </span>
                <span className="font-black text-base text-slate-950">
                  +₹{annualNetGain.toLocaleString('en-IN')} / वर्ष
                </span>
              </div>
            </div>
          </div>

          {/* Full Side-by-Side Detailed Comparison Table */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center justify-between">
              <span>{isHi ? 'वेतन अवयव तुलना चार्ट (Salary Breakdown Comparison)' : 'Side-by-Side Salary Component Comparison'}</span>
              <span className="text-[11px] text-slate-500 font-semibold">{isHi ? 'मासिक राशि (₹)' : 'Monthly (₹)'}</span>
            </h4>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-black">
                    <th className="py-2.5 px-3">{isHi ? 'वेतन घटक (Component)' : 'Component'}</th>
                    <th className="py-2.5 px-3 text-right">{isHi ? 'वर्तमान 7वां (₹)' : 'Current 7th (₹)'}</th>
                    <th className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">{isHi ? '8वां वेतन (₹)' : '8th CPC (₹)'}</th>
                    <th className="py-2.5 px-3 text-right text-amber-600 dark:text-amber-400 font-black">{isHi ? 'अंतर / वृद्धि' : 'Difference'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-800 dark:text-slate-200">
                  {/* Basic Pay */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{isHi ? 'मूल वेतन (Basic Pay)' : 'Basic Pay'}</span>
                    </td>
                    <td className="py-2 px-3 text-right">₹{basicPay.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400 font-black">₹{projectedBasic.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right text-emerald-600 font-black">+₹{basicDifference.toLocaleString('en-IN')} (+{basicPercentIncrease}%)</td>
                  </tr>

                  {/* DA */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>{isHi ? `महंगाई भत्ता (DA ${daPercent}% vs ${projectedDaPercent}%)` : `DA (${daPercent}% vs ${projectedDaPercent}%)`}</span>
                    </td>
                    <td className="py-2 px-3 text-right">₹{currentDaAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">₹{projectedDaAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right text-slate-500 text-[11px]">{isHi ? 'बेसिक में समाहित' : 'Merged in Basic'}</td>
                  </tr>

                  {/* HRA */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2 px-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>{isHi ? `मकान किराया (HRA ${hraPercent}%)` : `HRA (${hraPercent}%)`}</span>
                    </td>
                    <td className="py-2 px-3 text-right">₹{currentHraAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right text-emerald-600 dark:text-emerald-400">₹{projectedHraAmount.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right text-emerald-600">+₹{(projectedHraAmount - currentHraAmount).toLocaleString('en-IN')}</td>
                  </tr>

                  {/* Gross Salary Row */}
                  <tr className="bg-slate-100/70 dark:bg-slate-800/80 font-black text-slate-900 dark:text-slate-100">
                    <td className="py-2.5 px-3">{isHi ? 'कुल सकल वेतन (Gross Salary)' : 'Gross Salary'}</td>
                    <td className="py-2.5 px-3 text-right">₹{currentGross.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">₹{projectedGross.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-300">+₹{grossDifference.toLocaleString('en-IN')} (+{grossPercentIncrease}%)</td>
                  </tr>

                  {/* Deductions (GPF + SI + RGHS + Tax) */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400">
                    <td className="py-2 px-3">{isHi ? 'कुल कटौतियां (Deductions: GPF, SI, RGHS, Tax)' : 'Total Deductions (GPF, SI, RGHS, Tax)'}</td>
                    <td className="py-2 px-3 text-right text-rose-600">-₹{currentTotalDeductions.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right text-rose-600">-₹{projectedTotalDeductions.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-3 text-right text-slate-500">-₹{(projectedTotalDeductions - currentTotalDeductions).toLocaleString('en-IN')}</td>
                  </tr>

                  {/* Net In-Hand Row */}
                  <tr className="bg-emerald-50 dark:bg-emerald-950/60 font-black text-emerald-950 dark:text-emerald-100 text-sm border-t-2 border-emerald-500">
                    <td className="py-3 px-3">{isHi ? 'शुद्ध इन-हैंड वेतन (Net In-Hand)' : 'Net In-Hand Salary'}</td>
                    <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200 font-bold">₹{currentNetPay.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-emerald-700 dark:text-emerald-300 font-black">₹{projectedNetPay.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right text-amber-600 dark:text-amber-400 font-black">+₹{netDifference.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                {isHi
                  ? 'नोट: यह गणना 8वें वेतन आयोग की प्रचलित चर्चाओं एवं विभिन्न फ़िटमेंट फ़ैक्टर (1.92x से 3.00x) के आधार पर एक अनुमानित तुलना है। अंतिम आदेश केंद्र एवं राजस्थान राज्य सरकार द्वारा अधिसूचना जारी होने पर ही मान्य होंगे।'
                  : 'Note: This calculation provides projected estimates based on rumored 8th CPC fitment multipliers. Final pay matrix and allowances will depend on official Government of Rajasthan / Central notifications.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
