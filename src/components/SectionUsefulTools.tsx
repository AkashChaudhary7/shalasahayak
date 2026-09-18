import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  ArrowLeft, 
  LayoutGrid,
  Sparkles,
  BookOpen,
  ChevronRight,
  Home,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SchoolProfile, Language } from '../types';
import { ThreeDCard } from './ThreeDIcon';
import { PayCommission8Calculator } from './modules/PayCommission8Calculator';
import { RajasthanSalaryCalculator } from './modules/RajasthanSalaryCalculator';
import { ExcelSheetUnicodeModule } from './modules/ExcelSheetUnicodeModule';
import { DiwaliBonusCalculator } from './modules/DiwaliBonusCalculator';
import { UsefulToolsRulesGuide } from './modules/UsefulToolsRulesGuide';
import { QrCodeGeneratorModule } from './modules/QrCodeGeneratorModule';

export type UsefulToolsSubTab = '8thpay' | 'salary' | 'bonus' | 'excel' | 'qrcode' | 'rules';

interface SectionUsefulToolsProps {
  schoolProfile?: SchoolProfile;
  lang: Language;
  initialSubTab?: UsefulToolsSubTab | null;
  onBack?: () => void;
  onSelectTool?: (subtab: UsefulToolsSubTab | null) => void;
  onNavigateToGuide?: (guideId: string) => void;
}

export const SectionUsefulTools: React.FC<SectionUsefulToolsProps> = ({
  schoolProfile,
  lang,
  initialSubTab = null,
  onBack,
  onSelectTool,
  onNavigateToGuide
}) => {
  const isHi = lang === 'hi';
  const [activeSubTab, setActiveSubTab] = useState<UsefulToolsSubTab | null>(initialSubTab ?? null);

  useEffect(() => {
    setActiveSubTab(initialSubTab ?? null);
  }, [initialSubTab]);

  useEffect(() => {
    // Update browser URL query or history state cleanly
    const path = activeSubTab ? `/useful-tools/${activeSubTab}` : '/useful-tools';
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    // Dispatch popstate event to trigger DynamicModuleSeo update immediately
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [activeSubTab]);

  const handleSelectTool = (subtab: UsefulToolsSubTab | null) => {
    setActiveSubTab(subtab);
    if (onSelectTool) {
      onSelectTool(subtab);
    }
  };

  const toolHelpGuideMap: Record<UsefulToolsSubTab, { guideId: string; titleHi: string; titleEn: string; descHi: string }> = {
    '8thpay': {
      guideId: 'useful-8thpay-guide',
      titleHi: '8वें वेतन आयोग विस्तृत गणना व फ़िटमेंट फ़ैक्टर गाइड',
      titleEn: '8th Pay Commission Complete Calculation & Fitment Guide',
      descHi: '1.92x से 3.00x फ़िटमेंट फ़ैक्टर, बेसिक पे वृद्धि व कर्मचारी संघ मांगों का विस्तृत विश्लेषण'
    },
    'salary': {
      guideId: 'paymatrix-guide',
      titleHi: 'राजस्थान 7वां वेतन एवं 60% DA गणना नियम गाइड',
      titleEn: 'Rajasthan 7th CPC Salary & 60% DA Rules Guide',
      descHi: 'पे-लेवल L-1 से L-16, वर्तमान 60% डीए, HRA (10%/20%), SI व GPF-2004 कटौतियों के सरकारी नियम'
    },
    'bonus': {
      guideId: 'useful-bonus-guide',
      titleHi: 'दीपावली तदर्थ बोनस ₹6,774 व 75:25 नियम गाइड',
      titleEn: 'Diwali Ad-hoc Bonus ₹6,774 & 75:25 Split Guide',
      descHi: 'पे-लेवल L-1 से L-11 तक ₹7,000 सीलिंग पर 75% नकद व 25% GPF जमा का वित्त विभाग परिपत्र'
    },
    'excel': {
      guideId: 'useful-excel-guide',
      titleHi: 'एक्सेल शीट कृतिदेव से यूनिकोड कनवर्टर गाइड',
      titleEn: 'Excel Sheet KrutiDev to Unicode Converter Guide',
      descHi: '.xlsx या .csv फाइलों में कृतिदेव/देवलास फॉन्ट को शुद्ध हिंदी मंगल यूनिकोड में बदलने के नियम'
    },
    'qrcode': {
      guideId: 'useful-qrcode-guide',
      titleHi: 'स्कूल क्यूआर कोड जनरेटर एवं उपयोग मार्गदर्शिका',
      titleEn: 'School QR Code Generator & Notice Guide',
      descHi: 'स्कूल नोटिस बोर्ड, परिपत्र व प्रवेश लिंक हेतु कस्टमाइज्ड क्यूआर कोड निर्माण व उपयोग'
    },
    'rules': {
      guideId: 'paymatrix-guide',
      titleHi: 'राजस्थान सिविल सेवा नियम (RSR) व वेतन आदेश गाइड',
      titleEn: 'Rajasthan Service Rules (RSR) & Salary Orders Guide',
      descHi: 'वार्षिक वेतन वृद्धि, एसीपी स्थिरीकरण, परिवीक्षा अवधि एवं वित्त विभाग नियम पुस्तिका'
    }
  };

  const toolsList = [
    {
      id: '8thpay' as UsefulToolsSubTab,
      labelHi: '8वां वेतन आयोग',
      labelEn: '8th Pay Commission',
      fullLabelHi: '8वां वेतन आयोग कैलकुलेटर',
      fullLabelEn: '8th Pay Commission Calculator',
      icon3D: 'coin',
      badge: isHi ? 'फ़िटमेंट 1.92-3.00x' : 'Fitment 1.92-3.00x',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
      bgTint: 'bg-amber-50 dark:bg-amber-950/40',
      descHi: 'कस्टम इनपुट व चर्चित फ़िटमेंट फ़ैक्टर के साथ 7वें व 8वें वेतन की तुलना व अंतर',
      descEn: 'Compare 7th vs 8th CPC salary with fitment factor projections'
    },
    {
      id: 'salary' as UsefulToolsSubTab,
      labelHi: 'राजस्थान वेतन (RSR)',
      labelEn: 'Rajasthan Salary',
      fullLabelHi: 'राजस्थान वेतन कैलकुलेटर (PayManager)',
      fullLabelEn: 'Rajasthan PayManager Salary Calculator',
      icon3D: 'calculator',
      badge: isHi ? 'DA 60% • HRA 10/20%' : 'DA 60% • HRA 10/20%',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300',
      bgTint: 'bg-blue-50 dark:bg-blue-950/40',
      descHi: 'राजस्थान 7वां वेतन पे-मैट्रिक्स (L1-L16), 60% डीए, HRA (10%/20%), SI व GPF स्लैब',
      descEn: 'Strictly Rajasthan pay rules, matrix L-1 to L-16, 60% DA, SI & GPF slabs'
    },
    {
      id: 'bonus' as UsefulToolsSubTab,
      labelHi: 'दीपावली बोनस',
      labelEn: 'Diwali Bonus',
      fullLabelHi: 'दीपावली तदर्थ बोनस कैलकुलेटर',
      fullLabelEn: 'Diwali Ad-hoc Bonus Calculator',
      icon3D: 'award',
      badge: isHi ? 'L-1 से L-11 तक • ₹6,774' : 'L-1 to L-11 • ₹6,774',
      badgeColor: 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300',
      bgTint: 'bg-orange-50 dark:bg-orange-950/40',
      descHi: 'केवल 4 आसान प्रश्न • अधिकतम ₹6,774 • 75% नकद वेतन खाते में व 25% जीपीएफ जमा',
      descEn: 'Quick 4 questions • Max ₹6,774 • 75% Cash in bank & 25% GPF split'
    },
    {
      id: 'qrcode' as UsefulToolsSubTab,
      labelHi: 'क्यूआर कोड जनरेटर',
      labelEn: 'QR Code Generator',
      fullLabelHi: 'स्कूल क्यूआर कोड जनरेटर (Notice & Link)',
      fullLabelEn: 'School QR Code Generator',
      icon3D: 'star',
      badge: isHi ? 'दस्तावेज़ व नोटिस' : 'Notice & Docs',
      badgeColor: 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300',
      bgTint: 'bg-teal-50 dark:bg-teal-950/40',
      descHi: 'स्कूल परिपत्र, प्रवेश लिंक व नोटिस बोर्ड घोषणाओं हेतु कस्टमाइज़्ड QR कोड बनाएं व डाउनलोड करें',
      descEn: 'Generate and download QR codes for school documents, circulars & notice boards'
    },
    {
      id: 'excel' as UsefulToolsSubTab,
      labelHi: 'एक्सेल शीट (कृतिदेव)',
      labelEn: 'Excel KrutiDev',
      fullLabelHi: 'एक्सेल शीट (कृतिदेव यूनिकोड कन्वर्टर)',
      fullLabelEn: 'Excel Sheet KrutiDev to Unicode',
      icon3D: 'target',
      badge: isHi ? 'ऑटो कन्वर्टर' : 'Auto Converter',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300',
      bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
      descHi: '.xlsx/.csv अपलोड करें • कृतिदेव/देवलास से शुद्ध हिंदी यूनिकोड में बदलें व डाउनलोड करें',
      descEn: 'Upload xlsx/csv, auto-convert KrutiDev to pure Hindi Unicode, edit & download'
    },
    {
      id: 'rules' as UsefulToolsSubTab,
      labelHi: 'नियम व गाइड',
      labelEn: 'Rules & Guide',
      fullLabelHi: 'राजस्थान सरकार नियम व चरणबद्ध गाइड',
      fullLabelEn: 'Rajasthan Govt Rules & Step-by-Step Guide',
      icon3D: 'book',
      badge: isHi ? 'शासनादेश व मैनुअल' : 'Circulars & Manual',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300',
      bgTint: 'bg-purple-50 dark:bg-purple-950/40',
      descHi: 'वित्त विभाग शासनादेश, RSR पे-रूल्स, 60% डीए, HRA, बोनस व सम्पूर्ण टूल्स गाइड',
      descEn: 'Rajasthan Finance Dept circulars, RSR rules, orders & step-by-step guides'
    }
  ];

  const currentToolObj = toolsList.find(t => t.id === activeSubTab);

  return (
    <div className="space-y-3 sm:space-y-4 animate-fadeIn">
      
      {/* VIEW 1: 3D ICON CARDS GRID (When activeSubTab is null / Overview) - EXACTLY LIKE PEEO */}
      {!activeSubTab && (
        <div className="space-y-3 sm:space-y-4 animate-fadeIn">
          {/* Banner */}
          <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-md">
            <h3 className="font-black text-sm sm:text-base text-amber-300">
              <span className="sm:hidden">{isHi ? 'उपयोगी टूल्स' : 'Useful Tools'}</span>
              <span className="hidden sm:inline">{isHi ? 'उपयोगी टूल्स एवं कैलकुलेटर्स' : 'Useful Tools & Calculators'}</span>
            </h3>
            <p className="hidden sm:block text-xs text-emerald-200 mt-1">
              {isHi ? 'उपलब्ध सुविधा का चयन करने हेतु नीचे दिए गए आइकॉन पर क्लिक करें' : 'Click on any square 3D card below to open in full page'}
            </p>
          </div>

          {/* SIGNATURE 3-COLUMN ICON-BASED BOXES GRID ON MOBILE AND DESKTOP */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {toolsList.map((tool, idx) => (
              <ThreeDCard
                key={tool.id}
                onClick={() => handleSelectTool(tool.id)}
                icon={tool.icon3D}
                bgTint={tool.bgTint}
                label={isHi ? tool.labelHi : tool.labelEn}
                delayIndex={idx}
                description={isHi ? tool.descHi : tool.descEn}
              />
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: DEDICATED TOOL PAGE (When activeSubTab is selected) */}
      {activeSubTab && (
        <div className="space-y-3 sm:space-y-4 animate-fadeIn">
          
          {/* SEO BREADCRUMB NAVIGATION */}
          <nav aria-label="Breadcrumb" className="px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar">
            <button 
              type="button" 
              onClick={() => {
                if (onBack) onBack();
                else handleSelectTool(null);
              }}
              className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer shrink-0"
            >
              <Home className="w-3 h-3" />
              <span>{isHi ? 'होम' : 'Home'}</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <button 
              type="button" 
              onClick={() => handleSelectTool(null)}
              className="hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer shrink-0"
            >
              <span>{isHi ? 'उपयोगी टूल्स' : 'Useful Tools'}</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-slate-900 dark:text-slate-100 font-black shrink-0">
              {isHi ? currentToolObj?.labelHi : currentToolObj?.labelEn}
            </span>
          </nav>

          {/* INTERLINKED HELP & GUIDE BANNER */}
          {toolHelpGuideMap[activeSubTab] && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
                    <span>{isHi ? toolHelpGuideMap[activeSubTab].titleHi : toolHelpGuideMap[activeSubTab].titleEn}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-200/70 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold">
                      {isHi ? 'विस्तृत गाइड' : 'Help Guide'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {toolHelpGuideMap[activeSubTab].descHi}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const guideId = toolHelpGuideMap[activeSubTab].guideId;
                  if (onNavigateToGuide) {
                    onNavigateToGuide(guideId);
                  } else {
                    const newUrl = `/help?help=${guideId}`;
                    window.history.pushState(null, '', newUrl);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
                className="self-end sm:self-center px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
              >
                <span>{isHi ? 'गाइड व नियम पढ़ें' : 'Read Guide'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile-Friendly Quick-Switch Pills Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1.5 no-scrollbar">
            <button
              type="button"
              onClick={() => handleSelectTool(null)}
              className="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 border min-h-[38px] flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              title={isHi ? 'सभी टूल्स ग्रिड पर लौटें' : 'Back to tools grid'}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
              <span>{isHi ? 'सभी टूल्स' : 'All Tools'}</span>
            </button>

            {toolsList.map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTool(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 border min-h-[38px] flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{isHi ? tab.labelHi : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Module Component Container */}
          <div className="bg-white/40 dark:bg-slate-950/40 rounded-3xl">
            {activeSubTab === '8thpay' && (
              <PayCommission8Calculator lang={lang} />
            )}

            {activeSubTab === 'salary' && (
              <RajasthanSalaryCalculator lang={lang} />
            )}

            {activeSubTab === 'bonus' && (
              <DiwaliBonusCalculator lang={lang} />
            )}

            {activeSubTab === 'qrcode' && (
              <QrCodeGeneratorModule 
                schoolProfile={schoolProfile || {}} 
                lang={lang} 
                onBack={() => handleSelectTool(null)} 
              />
            )}

            {activeSubTab === 'excel' && (
              <ExcelSheetUnicodeModule lang={lang} />
            )}

            {activeSubTab === 'rules' && (
              <UsefulToolsRulesGuide 
                lang={lang} 
                onNavigateToTab={(tab) => handleSelectTool(tab)}
              />
            )}
          </div>

        </div>
      )}

    </div>
  );
};

