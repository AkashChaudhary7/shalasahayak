import React, { useState } from 'react';
import { RAJASTHAN_GOVT_PORTALS } from '../data/portalsAndFormats';
import { SchoolProfile, Language } from '../types';
import { ThreeDCard } from './ThreeDIcon';
import { InteractiveFormatsModule } from './modules/InteractiveFormatsModule';
import { AdminPinLock } from './AdminPinLock';
import {
  RAJASTHAN_PAY_MATRIX,
  getRghsDeduction,
  getSiStandardSlab,
  getGpfMinimumSlab,
  calculate8thPayEstimate
} from '../data/payMatrix';
import {
  ExternalLink,
  Calculator,
  Search,
  Plus,
  Globe,
  Sparkles,
  Printer,
  TrendingUp,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface SectionQuickAccessProps {
  schoolProfile?: SchoolProfile;
  lang: Language;
  initialSubTab?: 'portals' | 'calculator' | 'formats' | null;
  onBack?: () => void;
}

export const SectionQuickAccess: React.FC<SectionQuickAccessProps> = ({ schoolProfile, lang, initialSubTab = null, onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<'portals' | 'calculator' | 'formats' | null>(initialSubTab);
  const [portalSearch, setPortalSearch] = useState('');
  
  const getFaviconUrl = (url: string) => {
    try {
      const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/im);
      if (match && match[1]) {
        return `https://www.google.com/s2/favicons?sz=128&domain=${match[1]}`;
      }
    } catch (e) {
      // ignore
    }
    return '';
  };

  // Custom portals state
  const [customPortals, setCustomPortals] = useState<{ id: string; name: string; url: string; badge: string }[]>([]);
  const [showAddPortal, setShowAddPortal] = useState(false);
  const [newPortalName, setNewPortalName] = useState('');
  const [newPortalUrl, setNewPortalUrl] = useState('https://');

  React.useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  React.useEffect(() => {
    if (activeSubTab) {
      let path = `/portals-${activeSubTab}`;
      if (activeSubTab === 'calculator') path = '/portals-calculator/salary';
      else if (activeSubTab === 'formats') path = '/portals-formats/download';
      else if (activeSubTab === 'portals') path = '/quick';
      
      if (window.location.pathname !== path) {
        window.history.pushState(null, '', path);
      }
    }
  }, [activeSubTab]);

  const allPortals = [
    ...customPortals.map(cp => ({
      id: cp.id,
      name: cp.name,
      nameHindi: cp.name,
      url: cp.url,
      badge: cp.badge || 'CUSTOM',
      description: 'User Added Portal Link',
      descriptionHindi: 'उपयोगकर्ता द्वारा जोड़ा गया पोर्टल लिंक'
    })),
    ...RAJASTHAN_GOVT_PORTALS
  ];

  const filteredPortals = allPortals.filter(p =>
    p.name.toLowerCase().includes(portalSearch.toLowerCase()) ||
    p.nameHindi.toLowerCase().includes(portalSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(portalSearch.toLowerCase()) ||
    p.descriptionHindi.toLowerCase().includes(portalSearch.toLowerCase()) ||
    (p.badge && p.badge.toLowerCase().includes(portalSearch.toLowerCase()))
  );

  const handleAddPortalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortalName || !newPortalUrl) return;
    setCustomPortals([
      ...customPortals,
      { id: Date.now().toString(), name: newPortalName, url: newPortalUrl, badge: 'MY LINK' }
    ]);
    setNewPortalName('');
    setNewPortalUrl('https://');
    setShowAddPortal(false);
  };

  // Salary Calculator State
  const [selectedLevel, setSelectedLevel] = useState('L-10');
  const [basicPay, setBasicPay] = useState(33800);
  const [daPercent, setDaPercent] = useState(60); // Current latest Rajasthan DA (60%)
  const [hraPercent, setHraPercent] = useState(10);
  const [pensionScheme, setPensionScheme] = useState<'OPS' | 'NPS'>('OPS');
  const [siDeduction, setSiDeduction] = useState(2200);
  const [gpfDeduction, setGpfDeduction] = useState(2100);
  const [rghsDeduction, setRghsDeduction] = useState(440);
  const [show8thPay, setShow8thPay] = useState(false);
  const [fitmentFactor, setFitmentFactor] = useState(1.92);

  // Auto-update slabs when Level or Basic Pay changes
  const handleLevelChange = (lvl: string) => {
    setSelectedLevel(lvl);
    const lvlObj = RAJASTHAN_PAY_MATRIX.find(l => l.level === lvl);
    if (lvlObj && lvlObj.cells.length > 0) {
      const newBasic = lvlObj.cells[0];
      setBasicPay(newBasic);
      setRghsDeduction(getRghsDeduction(lvl));
      setSiDeduction(getSiStandardSlab(newBasic));
      setGpfDeduction(getGpfMinimumSlab(newBasic));
    }
  };

  const handleBasicPayChange = (val: number) => {
    setBasicPay(val);
    setSiDeduction(getSiStandardSlab(val));
    setGpfDeduction(getGpfMinimumSlab(val));
  };

  const daAmount = Math.round((basicPay * daPercent) / 100);
  const hraAmount = Math.round((basicPay * hraPercent) / 100);
  const grossSalary = basicPay + daAmount + hraAmount;
  const npsDeduction = pensionScheme === 'NPS' ? Math.round(((basicPay + daAmount) * 10) / 100) : 0;
  const totalDeductions = (pensionScheme === 'NPS' ? npsDeduction : gpfDeduction) + siDeduction + rghsDeduction;
  const netSalary = grossSalary - totalDeductions;

  // 8th Pay Projection
  const estimate8th = calculate8thPayEstimate(basicPay, fitmentFactor);

  // Format Copy State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyFormat = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintSalaryPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rajasthan 7th & 8th Pay Salary Statement</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; line-height: 1.5; color: #1e293b; background: #fff; }
            .card { max-width: 650px; margin: 0 auto; border: 2px solid #047857; padding: 25px; border-radius: 12px; }
            .header { text-align: center; border-bottom: 2px solid #047857; padding-bottom: 12px; margin-bottom: 15px; }
            h2 { color: #047857; margin: 0 0 4px 0; font-size: 20px; }
            .subhead { font-size: 13px; color: #475569; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .col { background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .col-title { font-weight: bold; color: #047857; margin-bottom: 8px; font-size: 14px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
            .row { display: flex; justify-content: space-between; margin: 6px 0; font-size: 13px; }
            .bold { font-weight: bold; }
            .total-gross { background: #ecfdf5; padding: 8px; border-radius: 6px; font-weight: bold; color: #065f46; margin-top: 8px; }
            .total-ded { background: #fff1f2; padding: 8px; border-radius: 6px; font-weight: bold; color: #9f1239; margin-top: 8px; }
            .net-pay { font-size: 18px; color: #047857; font-weight: bold; border-top: 2px solid #047857; padding-top: 12px; margin-top: 15px; display: flex; justify-content: space-between; }
            .notice { font-size: 11px; color: #64748b; margin-top: 15px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h2>राजस्थान राज्य कर्मचारी वेतन विवरण (7th Pay Commission)</h2>
              <div class="subhead">पे मैट्रिक्स लेवल: ${selectedLevel} | मूल वेतन: ₹${basicPay.toLocaleString('en-IN')} | पेंशन योजना: ${pensionScheme}</div>
            </div>

            <div class="grid">
              <div class="col">
                <div class="col-title">वेतन परिलब्धियां (Earnings)</div>
                <div class="row"><span>मूल वेतन (Basic Pay):</span><span class="bold">₹ ${basicPay.toLocaleString('en-IN')}</span></div>
                <div class="row"><span>महँगाई भत्ता (${daPercent}% DA):</span><span class="bold">₹ ${daAmount.toLocaleString('en-IN')}</span></div>
                <div class="row"><span>मकान किराया (${hraPercent}% HRA):</span><span class="bold">₹ ${hraAmount.toLocaleString('en-IN')}</span></div>
                <div class="row total-gross"><span>कुल मासिक वेतन (Gross):</span><span>₹ ${grossSalary.toLocaleString('en-IN')}</span></div>
              </div>

              <div class="col">
                <div class="col-title">मासिक कटौतियां (Deductions)</div>
                <div class="row"><span>${pensionScheme === 'NPS' ? 'NPS (10% Basic+DA)' : 'जीपीएफ (GPF Slabs)'}:</span><span class="bold">₹ ${(pensionScheme === 'NPS' ? npsDeduction : gpfDeduction).toLocaleString('en-IN')}</span></div>
                <div class="row"><span>राज्य बीमा प्रीमियम (SI):</span><span class="bold">₹ ${siDeduction.toLocaleString('en-IN')}</span></div>
                <div class="row"><span>आरजीएचएस कटौती (RGHS):</span><span class="bold">₹ ${rghsDeduction.toLocaleString('en-IN')}</span></div>
                <div class="row total-ded"><span>कुल मासिक कटौती:</span><span>₹ ${totalDeductions.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div class="net-pay">
              <span>खाते में देय शुद्ध वेतन (Net Take-Home):</span>
              <span>₹ ${netSalary.toLocaleString('en-IN')}</span>
            </div>

            ${show8thPay ? `
            <div style="margin-top:15px; padding:12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; font-size:12px;">
              <strong style="color:#1d4ed8;">8वां वेतन आयोग संभावित आकलन (Fitment: ${fitmentFactor}):</strong>
              <div style="display:flex; justify-content:space-between; margin-top:4px;">
                <span>अनुमानित मूल वेतन: <b>₹ ${estimate8th.projectedBasic.toLocaleString('en-IN')}</b></span>
                <span>अनुमानित सकल वेतन: <b>₹ ${estimate8th.projectedGross.toLocaleString('en-IN')}</b></span>
                <span style="color:#059669; font-weight:bold;">मासिक लाभ: +₹ ${estimate8th.gainAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            ` : ''}

            <div class="notice">
              * यह विवरण राजस्थान सिविल सेवा (पुनरीक्षित वेतन) नियम 2017 एवं अद्यतन 2026 डीए दरों के अनुसार तैयार किया गया है।
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (activeSubTab === null) {
    const options = [
      {
        id: 'portals' as const,
        titleHi: 'सरकारी पोर्टल लिंक्स',
        titleEn: 'Gov Education Portals',
        iconName: 'link',
        color: 'bg-emerald-50 dark:bg-emerald-950/40'
      },
      {
        id: 'calculator' as const,
        titleHi: '7वां वेतन कैलकुलेटर',
        titleEn: '7th Pay Calculator',
        iconName: 'calculator',
        color: 'bg-amber-50 dark:bg-amber-950/40'
      }
    ];

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1 sm:space-y-2 mt-2 sm:mt-4">
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 animate-pulse" />
            <span>{lang === 'hi' ? 'त्वरित पहुँच' : 'Quick Access'}</span>
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 max-w-md mx-auto">
            {lang === 'hi' 
              ? 'राजकीय विद्यालय प्रबंधन हेतु सहायक उपयोगी पोर्टल्स एवं वेतन गणना सॉफ्टवेयर।' 
              : 'Direct portals directories and allowance ledger systems.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 max-w-2xl mx-auto">
          {options.map((opt) => (
            <ThreeDCard
              key={opt.id}
              onClick={() => setActiveSubTab(opt.id)}
              icon={opt.iconName}
              bgTint={opt.color}
              label={lang === 'hi' ? opt.titleHi : opt.titleEn}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* 1. RAJASTHAN GOVT PORTALS DIRECTORY */}
      {activeSubTab === 'portals' && (
        <div className="space-y-4">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'राजकीय एवं उपयोगी वेब पोर्टल' : 'Official Web Portals'}</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  {lang === 'hi' ? 'सीधे पोर्टल प्रवेश हेतु संबंधित आइकॉन पर क्लिक करें' : 'Click on any icon to launch the official portal directly'}
                </p>
              </div>

              {/* Portal Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={portalSearch}
                  onChange={e => setPortalSearch(e.target.value)}
                  placeholder={lang === 'hi' ? 'पोर्टल खोजें...' : 'Search portal...'}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Add Custom Portal Form */}
            {showAddPortal && (
              <form onSubmit={handleAddPortalSubmit} className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 space-y-3 text-xs animate-fadeIn">
                <h4 className="font-bold text-slate-800 dark:text-slate-100">{lang === 'hi' ? 'नया कस्टम पोर्टल लिंक जोड़ें:' : 'Add Custom Portal Link:'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder={lang === 'hi' ? 'पोर्टल का नाम (उदा. शाला दर्पण)' : 'Portal Name (e.g., Shala Darpan)'}
                    value={newPortalName}
                    onChange={e => setNewPortalName(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  />
                  <input
                    type="url"
                    required
                    placeholder="URL (https://...)"
                    value={newPortalUrl}
                    onChange={e => setNewPortalUrl(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPortal(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold"
                  >
                    {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                  >
                    {lang === 'hi' ? 'पोर्टल लिंक सहेजें' : 'Save Portal'}
                  </button>
                </div>
              </form>
            )}

            {/* Grid View of Portals as Sleek App Launch 3D Icons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
              {filteredPortals.map(portal => {
                const favUrl = getFaviconUrl(portal.url);
                const isCustom = !RAJASTHAN_GOVT_PORTALS.some(p => p.id === portal.id);

                const iconEl = (
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center p-1.5 shadow-inner transition-colors">
                    <img
                      src={favUrl}
                      alt={portal.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23059669' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='2' y1='12' x2='22' y2='12'%3E%3C/line%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'%3E%3C/path%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                );

                return (
                  <div key={portal.id} className="relative group">
                    {isCustom && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCustomPortals(customPortals.filter(cp => cp.id !== portal.id));
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-[10px] font-black shadow-md z-20 transition-colors cursor-pointer"
                        title={lang === 'hi' ? 'हटाएं' : 'Delete'}
                      >
                        ×
                      </button>
                    )}

                    <ThreeDCard
                      onClick={() => window.open(portal.url, '_blank', 'noopener,noreferrer')}
                      icon={iconEl}
                      bgTint="bg-slate-50 dark:bg-slate-800/40"
                      label={lang === 'hi' ? portal.nameHindi : portal.name}
                    />
                  </div>
                );
              })}

              {/* Direct Add Portal Option Card */}
              <ThreeDCard
                onClick={() => setShowAddPortal(!showAddPortal)}
                icon={<Plus className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />}
                bgTint="bg-slate-100/50 dark:bg-slate-800/20"
                label={lang === 'hi' ? 'पोर्टल जोड़ें' : 'Add Portal'}
                className="border-dashed border-2 hover:border-emerald-400 dark:hover:border-emerald-700"
              />
            </div>
          </div>

        </div>
      )}

      {/* 2. PAY & SALARY CALCULATOR */}
      {activeSubTab === 'calculator' && (
        <AdminPinLock
          lang={lang}
          moduleTitle={lang === 'hi' ? '7वां व 8वां वेतन कैलकुलेटर एवं वेतन स्थिरीकरण' : '7th & 8th Pay Matrix & Salary Calculator'}
          moduleSubtitle={lang === 'hi' ? 'राजस्थान राज्य कर्मचारियों हेतु वेतन, कटौती, डीए 2026 एवं 8th Pay संभावित आकलन' : 'Salary, ACP, latest 2026 DA & 8th Pay Commission projection'}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>7th Pay Matrix Salary Calculator (7वां वेतनमान राजस्थान)</span>
                </h3>
                <p className="text-xs text-slate-500">अद्यतन 2026 डीए दरों एवं कटौतियों (GPF/NPS, SI, RGHS) सहित</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShow8thPay(!show8thPay)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 border transition-all cursor-pointer ${
                    show8thPay
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{show8thPay ? '8th Pay Active' : '8th Pay Projection'}</span>
                </button>

                <button
                  onClick={handlePrintSalaryPdf}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            {/* Pay Level Selection & Preset */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  पे मैट्रिक्स लेवल चुनें (Pay Matrix Level):
                </label>
                <select
                  value={selectedLevel}
                  onChange={e => handleLevelChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-100"
                >
                  {RAJASTHAN_PAY_MATRIX.map(lvl => (
                    <option key={lvl.level} value={lvl.level}>
                      {lvl.level} - {lvl.designationExamples[0]} (प्रारंभिक ₹{lvl.cells[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  पेंशन योजना (Pension Scheme):
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPensionScheme('OPS')}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold border text-xs transition-all cursor-pointer ${
                      pensionScheme === 'OPS'
                        ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    OPS (पुरानी पेंशन / GPF)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPensionScheme('NPS')}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold border text-xs transition-all cursor-pointer ${
                      pensionScheme === 'NPS'
                        ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    NPS (10% मूल+डीए)
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Pay & DA Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Basic Pay / मूल वेतन (₹)</label>
                <input
                  type="number"
                  value={basicPay}
                  onChange={e => handleBasicPayChange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  DA Rate / महँगाई भत्ता (%)
                </label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="number"
                    value={daPercent}
                    onChange={e => setDaPercent(Number(e.target.value))}
                    className="w-20 px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setDaPercent(53)}
                    className={`px-2 py-1.5 rounded-lg font-bold text-[11px] border cursor-pointer ${daPercent === 53 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}
                  >
                    53%
                  </button>
                  <button
                    type="button"
                    onClick={() => setDaPercent(58)}
                    className={`px-2 py-1.5 rounded-lg font-bold text-[11px] border cursor-pointer ${daPercent === 58 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}
                  >
                    58%
                  </button>
                  <button
                    type="button"
                    onClick={() => setDaPercent(60)}
                    className={`px-2 py-1.5 rounded-lg font-bold text-[11px] border cursor-pointer ${daPercent === 60 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}
                  >
                    60% (वर्तमान)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">मकान किराया भत्ता HRA (%)</label>
                <select
                  value={hraPercent}
                  onChange={e => setHraPercent(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value={10}>10% (Z श्रेणी - ग्रामीण व अधिकांश कस्बे)</option>
                  <option value={20}>20% (Y श्रेणी - जयपुर, जोधपुर, कोटा, बीकानेर, अजमेर)</option>
                </select>
              </div>
            </div>

            {/* Deductions Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {pensionScheme === 'NPS' ? 'NPS कटौती (10% Basic+DA)' : 'जीपीएफ कटौती (GPF Slab)'} (₹)
                </label>
                <input
                  type="number"
                  value={pensionScheme === 'NPS' ? npsDeduction : gpfDeduction}
                  onChange={e => {
                    if (pensionScheme !== 'NPS') setGpfDeduction(Number(e.target.value));
                  }}
                  disabled={pensionScheme === 'NPS'}
                  className={`w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono ${pensionScheme === 'NPS' ? 'opacity-80' : ''}`}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">राज्य बीमा (SI Premium ₹)</label>
                <input
                  type="number"
                  value={siDeduction}
                  onChange={e => setSiDeduction(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">RGHS स्वास्थ्य योजना (₹)</label>
                <input
                  type="number"
                  value={rghsDeduction}
                  onChange={e => setRghsDeduction(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            {/* Result Breakdown Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white space-y-2.5 text-xs shadow-lg">
              <div className="flex justify-between border-b border-emerald-700/50 pb-2">
                <span>सकल मासिक वेतन / Gross Salary (मूल + DA + HRA):</span>
                <span className="font-bold text-amber-300 font-mono text-sm">₹ {grossSalary.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-700/50 pb-2">
                <span>कुल मासिक कटौतियां (पेंशन/GPF + SI + RGHS):</span>
                <span className="font-bold text-rose-300 font-mono text-sm">-₹ {totalDeductions.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 text-emerald-300">
                <span>खाते में देय शुद्ध वेतन (Net Take-Home):</span>
                <span className="font-mono text-xl text-amber-300">₹ {netSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* 8th Pay Commission Projection Box */}
            {show8thPay && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs space-y-3 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200 text-sm">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>8वें वेतन आयोग संभावित आकलन (8th Pay Commission Projection)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">फ़िटमेंट फ़ैक्टर:</span>
                    <button
                      type="button"
                      onClick={() => setFitmentFactor(1.92)}
                      className={`px-2 py-0.5 rounded font-bold cursor-pointer ${fitmentFactor === 1.92 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300'}`}
                    >
                      1.92
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitmentFactor(2.00)}
                      className={`px-2 py-0.5 rounded font-bold cursor-pointer ${fitmentFactor === 2.00 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300'}`}
                    >
                      2.00
                    </button>
                    <button
                      type="button"
                      onClick={() => setFitmentFactor(2.15)}
                      className={`px-2 py-0.5 rounded font-bold cursor-pointer ${fitmentFactor === 2.15 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300'}`}
                    >
                      2.15
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60">
                    <div className="text-[11px] text-slate-500">अनुमानित नया मूल वेतन</div>
                    <div className="font-bold font-mono text-sm text-blue-700 dark:text-blue-300">
                      ₹ {estimate8th.projectedBasic.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60">
                    <div className="text-[11px] text-slate-500">प्रारंभिक DA (3%)</div>
                    <div className="font-bold font-mono text-sm text-slate-700 dark:text-slate-300">
                      ₹ {estimate8th.projectedDa.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60">
                    <div className="text-[11px] text-slate-500">अनुमानित नया सकल</div>
                    <div className="font-bold font-mono text-sm text-emerald-600 dark:text-emerald-400">
                      ₹ {estimate8th.projectedGross.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/60">
                    <div className="text-[11px] text-slate-500">संभावित मासिक वृद्धि</div>
                    <div className="font-bold font-mono text-sm text-amber-600 dark:text-amber-400">
                      +₹ {estimate8th.gainAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AdminPinLock>
      )}

      {/* 3. DEPARTMENTAL FORMATS */}
      {activeSubTab === 'formats' && (
        <InteractiveFormatsModule
          schoolProfile={schoolProfile}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

    </div>
  );
};
