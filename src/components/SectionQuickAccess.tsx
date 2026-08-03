import React, { useState } from 'react';
import { RAJASTHAN_GOVT_PORTALS } from '../data/portalsAndFormats';
import { SchoolProfile, Language } from '../types';
import { ThreeDCard } from './ThreeDIcon';
import { InteractiveFormatsModule } from './modules/InteractiveFormatsModule';
import { AdminPinLock } from './AdminPinLock';
import {
  ExternalLink,
  Calculator,
  Search,
  Plus,
  Globe,
  Sparkles,
  Printer
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
      let hash = `portals-${activeSubTab}`;
      if (activeSubTab === 'calculator') hash = 'salary-calculator';
      else if (activeSubTab === 'formats') hash = 'interactive-formats';
      else if (activeSubTab === 'portals') hash = 'quick';
      
      const expectedHash = `#${hash}`;
      if (window.location.hash !== expectedHash) {
        window.location.hash = expectedHash;
      }
    } else {
      const currentHash = window.location.hash.replace('#', '');
      const validHashes = [
        'quick', 'portals', 'dashboard', 'salary-calculator', 'interactive-formats'
      ];
      if (!validHashes.includes(currentHash) && !currentHash.startsWith('portals-') && currentHash !== '') {
        if (window.location.hash !== '#quick') {
          window.location.hash = '#quick';
        }
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

  // Salary Calculator
  const [basicPay, setBasicPay] = useState(46500);
  const [daPercent, setDaPercent] = useState(50);
  const [hraPercent, setHraPercent] = useState(9);
  const [siDeduction, setSiDeduction] = useState(3000);
  const [gpfDeduction, setGpfDeduction] = useState(3625);

  const daAmount = Math.round((basicPay * daPercent) / 100);
  const hraAmount = Math.round((basicPay * hraPercent) / 100);
  const grossSalary = basicPay + daAmount + hraAmount;
  const npsDeduction = Math.round(((basicPay + daAmount) * 10) / 100);
  const totalDeductions = npsDeduction + siDeduction + gpfDeduction;
  const netSalary = grossSalary - totalDeductions;

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
      <html>
        <head>
          <title>7th Pay Salary Statement</title>
          <style>
            body { font-family: sans-serif; padding: 30px; line-height: 1.6; }
            .card { max-width: 500px; margin: 0 auto; border: 2px solid #047857; padding: 25px; border-radius: 12px; }
            h2 { color: #047857; border-bottom: 2px solid #047857; padding-bottom: 8px; margin-top: 0; }
            .row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
            .bold { font-weight: bold; }
            .total { font-size: 18px; color: #047857; font-weight: bold; border-top: 2px solid #047857; pt: 10px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>7th Pay Salary Calculation Sheet</h2>
            <div class="row"><span class="bold">Basic Pay (मूल वेतन):</span><span>₹ ${basicPay.toLocaleString('en-IN')}</span></div>
            <div class="row"><span>Dearness Allowance (${daPercent}% DA):</span><span>₹ ${daAmount.toLocaleString('en-IN')}</span></div>
            <div class="row"><span>House Rent Allowance (${hraPercent}% HRA):</span><span>₹ ${hraAmount.toLocaleString('en-IN')}</span></div>
            <div class="row bold" style="background:#f0fdf4; padding:6px; border-radius:6px;"><span>Gross Monthly Salary:</span><span>₹ ${grossSalary.toLocaleString('en-IN')}</span></div>
            <hr />
            <div class="row"><span>NPS / Pension Deduction:</span><span>₹ ${npsDeduction.toLocaleString('en-IN')}</span></div>
            <div class="row"><span>State Insurance (SI):</span><span>₹ ${siDeduction.toLocaleString('en-IN')}</span></div>
            <div class="row"><span>GPF / RGHS Deduction:</span><span>₹ ${gpfDeduction.toLocaleString('en-IN')}</span></div>
            <div class="row bold" style="color:#b91c1c;"><span>Total Monthly Deductions:</span><span>₹ ${totalDeductions.toLocaleString('en-IN')}</span></div>
            <hr />
            <div class="row total"><span>Net Payable Salary:</span><span>₹ ${netSalary.toLocaleString('en-IN')}</span></div>
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
        titleHi: 'महत्वपूर्ण सरकारी पोर्टल लिंक्स',
        titleEn: 'Rajasthan Govt Education Portals',
        iconName: 'link',
        color: 'bg-emerald-50 dark:bg-emerald-950/40'
      },
      {
        id: 'calculator' as const,
        titleHi: '7वां वेतन आयोग वेतन कैलकुलेटर',
        titleEn: '7th Pay Commission Salary Calculator',
        iconName: 'calculator',
        color: 'bg-amber-50 dark:bg-amber-950/40'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2 mt-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
            <span>{lang === 'hi' ? 'त्वरित पहुँच प्रभाग' : 'Quick Access Division'}</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {lang === 'hi' 
              ? 'राजकीय विद्यालय प्रबंधन हेतु सहायक उपयोगी पोर्टल्स एवं वेतन गणना सॉफ्टवेयर।' 
              : 'Direct portals directories and allowance ledger systems.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto">
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
          moduleTitle={lang === 'hi' ? '7वां वेतन कैलकुलेटर एवं वेतन स्थिरीकरण' : '7th Pay Matrix & Salary Calculator'}
          moduleSubtitle={lang === 'hi' ? 'राजस्थान राज्य कर्मचारियों हेतु वेतन, कटौती एवं एसीपी हिसाब' : 'Salary, ACP & deductions calculator for Rajasthan Govt staff'}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span>7th Pay Matrix Salary Calculator (7वां वेतन आयोग)</span>
                </h3>
                <p className="text-xs text-slate-500">राजस्थान राज्य कर्मचारियों हेतु प्रतिमाह वेतन एवं कटौती गणना</p>
              </div>

              <button
                onClick={handlePrintSalaryPdf}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>Export Salary PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Basic Pay / मूल वेतन (₹)</label>
                <input
                  type="number"
                  value={basicPay}
                  onChange={e => setBasicPay(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">DA Rate / महँगाई भत्ता (%)</label>
                <input
                  type="number"
                  value={daPercent}
                  onChange={e => setDaPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">HRA (%)</label>
                <select
                  value={hraPercent}
                  onChange={e => setHraPercent(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                >
                  <option value={9}>9% (Z Category)</option>
                  <option value={18}>18% (Y Category / Jaipur)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SI Premium (₹)</label>
                <input
                  type="number"
                  value={siDeduction}
                  onChange={e => setSiDeduction(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">GPF/RGHS (₹)</label>
                <input
                  type="number"
                  value={gpfDeduction}
                  onChange={e => setGpfDeduction(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            {/* Result Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white space-y-2.5 text-xs shadow-lg">
              <div className="flex justify-between border-b border-emerald-700/50 pb-2">
                <span>Gross Monthly Salary (मूल + DA + HRA):</span>
                <span className="font-bold text-amber-300 font-mono text-sm">₹ {grossSalary.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-700/50 pb-2">
                <span>Total Deductions (NPS/GPF + SI + RGHS):</span>
                <span className="font-bold text-rose-300 font-mono text-sm">₹ {totalDeductions.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-1 text-emerald-300">
                <span>Take Home Net Payable (खाते में):</span>
                <span className="font-mono text-lg text-amber-300">₹ {netSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>
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
