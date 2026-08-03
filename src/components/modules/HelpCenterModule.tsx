import React, { useState, useEffect } from 'react';
import { Language, HelpGuide } from '../../types';
import helpGuidesRaw from '../../data/helpGuidesData.json';
import { ScreenshotMockup } from '../ScreenshotMockup';
import { TeacherResourceHub } from '../TeacherResourceHub';
import {
  BookOpen,
  Search,
  Share2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
  Building2,
  Utensils,
  Calendar,
  Calculator,
  QrCode,
  Briefcase,
  GraduationCap,
  ListFilter
} from 'lucide-react';

const helpGuides = helpGuidesRaw as HelpGuide[];

interface HelpCenterModuleProps {
  lang: Language;
  onNavigateToTool?: (toolId: string) => void;
  initialBlogId?: string | null;
}

export const HelpCenterModule: React.FC<HelpCenterModuleProps> = ({
  lang,
  onNavigateToTool,
  initialBlogId
}) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(initialBlogId || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Sync with URL query parameter ?help=guide-id if available
    const urlParams = new URLSearchParams(window.location.search);
    const helpParam = urlParams.get('help');
    if (helpParam) {
      setSelectedGuideId(helpParam);
    }
  }, []);

  const activeGuide = helpGuides.find(g => g.id === selectedGuideId);

  useEffect(() => {
    // Dynamically update document title, meta description, and JSON-LD schema for SEO
    if (activeGuide) {
      if (activeGuide.seoMeta?.titleTag) {
        document.title = activeGuide.seoMeta.titleTag;
      } else {
        document.title = `${lang === 'hi' ? activeGuide.titleHi : activeGuide.titleEn} | Shala Sahayak`;
      }

      const metaDescText = activeGuide.seoMeta?.metaDescription || (lang === 'hi' ? activeGuide.summaryHi : activeGuide.summaryEn);
      let metaDescEl = document.querySelector('meta[name="description"]');
      if (!metaDescEl) {
        metaDescEl = document.createElement('meta');
        metaDescEl.setAttribute('name', 'description');
        document.head.appendChild(metaDescEl);
      }
      metaDescEl.setAttribute('content', metaDescText);

      // JSON-LD HowTo Schema Markup for Google Search Rich Snippets
      let scriptEl = document.querySelector('script[id="json-ld-howto"]');
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.setAttribute('id', 'json-ld-howto');
        scriptEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptEl);
      }

      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': activeGuide.seoMeta?.h1Tag || activeGuide.titleHi,
        'description': activeGuide.summaryHi,
        'url': `https://shalasahayak.in/?help=${activeGuide.id}`,
        'step': activeGuide.steps.map((st) => ({
          '@type': 'HowToStep',
          'position': st.stepNum,
          'name': st.titleHi,
          'text': st.descriptionHi,
        })),
      };
      scriptEl.textContent = JSON.stringify(schemaData);
    } else {
      document.title = lang === 'hi' ? 'सहायता एवं अकादमिक गाइड केंद्र - Shala Sahayak' : 'Help & Educational Center - Shala Sahayak';
      const scriptEl = document.querySelector('script[id="json-ld-howto"]');
      if (scriptEl) {
        scriptEl.remove();
      }
    }
  }, [activeGuide, selectedGuideId, lang]);

  const handleSelectGuide = (id: string) => {
    setSelectedGuideId(id);
    const newUrl = `${window.location.pathname}?help=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedGuideId(null);
    const newUrl = window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleCopyGuideShareLink = (id: string) => {
    const shareUrl = `https://shalasahayak.in/?help=${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredGuides = helpGuides.filter(g => {
    const matchesCat = selectedCategory === 'all' || g.categoryKey === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesTitle =
      g.titleHi.toLowerCase().includes(query) || g.titleEn.toLowerCase().includes(query);
    const matchesSummary =
      g.summaryHi.toLowerCase().includes(query) || g.summaryEn.toLowerCase().includes(query);
    const matchesCategory =
      g.categoryHi.toLowerCase().includes(query) || g.categoryEn.toLowerCase().includes(query);

    return matchesCat && (matchesTitle || matchesSummary || matchesCategory);
  });

  const categoryOptions = [
    { key: 'all', labelHi: 'सभी मार्गदर्शिकाएं', labelEn: 'All Guides' },
    { key: 'peeo', labelHi: 'पीईईओ व संस्थाप्रधान', labelEn: 'PEEO & Admin' },
    { key: 'teacher', labelHi: 'शिक्षक टूलकिट', labelEn: 'Teacher Tools' },
    { key: 'incharge', labelHi: 'प्रभारी दायित्व', labelEn: 'Incharge Modules' },
    { key: 'portals', labelHi: 'पोर्टल्स व डिजिटल टूल', labelEn: 'Portals & Digital' },
    { key: 'general', labelHi: 'अकादमिक पंचांग', labelEn: 'Academic Calendar' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10 relative">
          <div className="flex items-start space-x-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 shrink-0">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 flex-wrap">
                <span>{lang === 'hi' ? 'सहायता एवं अकादमिक गाइड केंद्र' : 'Help & Educational Center'}</span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-slate-950 uppercase">
                  JSON Powered
                </span>
              </h2>
              <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
                {lang === 'hi'
                  ? 'शाला दर्पण, PEEO आदेश, एमडीएम रजिस्टर, 7th Pay Matrix व परीक्षा सीटिंग प्लान हेतु स्क्रीनशॉट मॉकअप सहित विस्तृत चरणबद्ध निर्देश'
                  : 'Step-by-step educational guides with interactive screenshot placeholders for every main app feature.'}
              </p>
            </div>
          </div>

          {selectedGuideId && (
            <button
              onClick={handleBackToList}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 border border-white/20 shrink-0"
            >
              <span>← {lang === 'hi' ? 'सभी मार्गदर्शिकाएं देखें' : 'All Guides'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SINGLE GUIDE DETAILED VIEW */}
      {activeGuide ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 sm:p-8 space-y-7 animate-fadeIn">
          
          {/* Guide Meta Header */}
          <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300 dark:border-emerald-800">
                {lang === 'hi' ? activeGuide.categoryHi : activeGuide.categoryEn}
              </span>

              <div className="flex items-center space-x-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>⏱ {activeGuide.readTime}</span>
                <span>•</span>
                <span>{lang === 'hi' ? `अद्यतन: ${activeGuide.updatedDate}` : `Updated: ${activeGuide.updatedDate}`}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 leading-snug">
              {activeGuide.seoMeta?.h1Tag || (lang === 'hi' ? activeGuide.titleHi : activeGuide.titleEn)}
            </h1>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              💡 <strong>{lang === 'hi' ? 'संक्षिप्त विवरण:' : 'Overview:'}</strong>{' '}
              {lang === 'hi' ? activeGuide.summaryHi : activeGuide.summaryEn}
            </p>
          </div>

          {/* Action Bar with Direct Try Tool Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 dark:text-amber-200">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                {lang === 'hi'
                  ? 'इस टूल का प्रत्यक्ष उपयोग करने हेतु नीचे बटन पर क्लिक करें:'
                  : 'Click below to launch and use this feature directly:'}
              </span>
            </div>

            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              {onNavigateToTool && (
                <button
                  onClick={() => onNavigateToTool(activeGuide.toolId)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'अभी टूल खोलें (Try Tool Now)' : 'Launch Tool Now'}</span>
                </button>
              )}

              <button
                onClick={() => handleCopyGuideShareLink(activeGuide.id)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="गाइड शेयर लिंक कॉपी करें"
              >
                {copiedId === activeGuide.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Share2 className="w-4 h-4 text-sky-600" />
                )}
                <span>{copiedId === activeGuide.id ? (lang === 'hi' ? 'कॉपी हुआ' : 'Copied') : (lang === 'hi' ? 'शेयर' : 'Share')}</span>
              </button>
            </div>
          </div>

          {/* Detailed Overview & Prerequisites */}
          {activeGuide.overviewHi && (
            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'विस्तृत विवरण एवं पृष्ठभूमि:' : 'Detailed Description:'}</span>
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {lang === 'hi' ? activeGuide.overviewHi : activeGuide.overviewEn}
              </p>

              {activeGuide.prerequisitesHi && activeGuide.prerequisitesHi.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                    📋 {lang === 'hi' ? 'पूर्व-आवश्यकताएं (Prerequisites):' : 'Prerequisites:'}
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-bold">
                    {(lang === 'hi' ? activeGuide.prerequisitesHi : activeGuide.prerequisitesEn)?.map((pre, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>{pre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Step-by-Step Instructions with Screenshot Placeholders */}
          <div className="space-y-6 pt-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5.5 h-5.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'चरणबद्ध मार्गदर्शिका (Step-by-Step Guide):' : 'Step-by-Step Instructions:'}</span>
            </h3>

            <div className="space-y-6">
              {activeGuide.steps.map((step) => {
                const stepTitle = lang === 'hi' ? step.titleHi : step.titleEn;
                const stepDesc = lang === 'hi' ? step.descriptionHi : step.descriptionEn;
                const stepTip = lang === 'hi' ? step.tipHi : step.tipEn;

                return (
                  <div
                    key={step.stepNum}
                    className="p-5 sm:p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 relative shadow-sm"
                  >
                    <div className="flex items-start space-x-3.5">
                      <span className="w-8 h-8 rounded-2xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                        {step.stepNum}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-black text-base text-slate-900 dark:text-slate-100">
                          {stepTitle}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-1 font-medium">
                          {stepDesc}
                        </p>
                      </div>
                    </div>

                    {/* Screenshot Mockup Placeholder Component */}
                    {step.screenshotPlaceholder && (
                      <div className="pl-0 sm:pl-11">
                        <ScreenshotMockup data={step.screenshotPlaceholder} lang={lang} />
                      </div>
                    )}

                    {/* Pro Tip Box */}
                    {stepTip && (
                      <div className="ml-0 sm:ml-11 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>{lang === 'hi' ? 'टिप / सलाह:' : 'Pro Tip:'}</strong> {stepTip}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Benefits Section */}
          <div className="p-5 sm:p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              🌟 {lang === 'hi' ? 'मुख्य लाभ व विशेषताएं (Key Benefits):' : 'Key Benefits & Features:'}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-extrabold">
              {(lang === 'hi' ? activeGuide.keyBenefitsHi : (activeGuide.keyBenefitsEn || activeGuide.keyBenefitsHi)).map((benefit, i) => (
                <li key={i} className="flex items-center space-x-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SEO Content Sections (H2/H3 subheadings, tables, lists, and FAQs) */}
          {activeGuide.contentSections && activeGuide.contentSections.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              {activeGuide.contentSections.map((sec, sIdx) => {
                const headingText = lang === 'hi' ? sec.headingHi : sec.headingEn;
                const bodyText = lang === 'hi' ? sec.contentHi : sec.contentEn;
                const headers = sec.tableData ? (lang === 'hi' ? sec.tableData.headersHi : sec.tableData.headersEn) : [];
                const rows = sec.tableData ? (lang === 'hi' ? sec.tableData.rowsHi : sec.tableData.rowsEn) : [];
                const listItems = lang === 'hi' ? sec.listItemsHi : sec.listItemsEn;

                return (
                  <article key={sIdx} className="space-y-3 bg-slate-50/60 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                    {sec.headingLevel === 'h2' ? (
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 border-b border-emerald-500/30 pb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span>{headingText}</span>
                      </h2>
                    ) : (
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-200 pt-1">
                        {headingText}
                      </h3>
                    )}

                    {bodyText && (
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                        {bodyText}
                      </p>
                    )}

                    {/* Table Data */}
                    {sec.tableData && headers.length > 0 && (
                      <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-emerald-900 text-white font-bold">
                            <tr>
                              {headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-3 border-b border-emerald-800">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                            {rows.map((r, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-900'}>
                                {r.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-3 text-slate-800 dark:text-slate-200 font-medium">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Bullet List / FAQ Items */}
                    {listItems && listItems.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        {listItems.map((item, iIdx) => (
                          <div key={iIdx} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed shadow-2xs whitespace-pre-line">
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        /* GUIDES LIST VIEW */
        <div className="space-y-6">
          
          {/* Master Pillar Hub Section */}
          <TeacherResourceHub
            lang={lang}
            onSelectCategory={(catId) => {
              if (onNavigateToTool) onNavigateToTool(catId);
              else window.location.hash = catId;
            }}
            onSelectTool={(toolId) => {
              if (onNavigateToTool) onNavigateToTool(toolId);
              else window.location.hash = toolId;
            }}
          />

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? 'विभाग एवं टूल्स सहायता ब्लॉग्स' : 'Help & Educational Blogs'}</span>
            </h3>
          </div>
          
          {/* Category Filters Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {categoryOptions.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat.key
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {lang === 'hi' ? cat.labelHi : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'मार्गदर्शिका में खोजें (उदा. PEEO आदेश, MDM रजिस्टर, परीक्षा बैठक, 7th Pay Matrix...)...'
                  : 'Search guides (e.g. PEEO Orders, MDM Register, Exam Seating, Pay Matrix)...'
              }
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>

          {/* Grid of Help Guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredGuides.map(guide => {
              const guideTitle = lang === 'hi' ? guide.titleHi : guide.titleEn;
              const guideSummary = lang === 'hi' ? guide.summaryHi : guide.summaryEn;
              const guideCategory = lang === 'hi' ? guide.categoryHi : guide.categoryEn;

              return (
                <div
                  key={guide.id}
                  onClick={() => handleSelectGuide(guide.id)}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300 dark:border-emerald-800">
                        {guideCategory}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">⏱ {guide.readTime}</span>
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {guideTitle}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {guideSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>{lang === 'hi' ? 'मार्गदर्शिका व स्क्रीनशॉट देखें' : 'View Guide & Screenshot'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleCopyGuideShareLink(guide.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      title="शेयर लिंक कॉपी करें"
                    >
                      {copiedId === guide.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGuides.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-sm font-bold">
                {lang === 'hi' ? 'कोई मेल खाती मार्गदर्शिका नहीं मिली' : 'No matching guides found'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                {lang === 'hi' ? 'फ़िल्टर साफ़ करें' : 'Clear Filters'}
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
