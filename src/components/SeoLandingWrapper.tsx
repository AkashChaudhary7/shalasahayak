import React, { useState } from 'react';
import { SeoPageConfig } from '../data/seoConfig';
import { 
  Home, 
  ChevronRight, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  ChevronDown,
  Info
} from 'lucide-react';
import { Language } from '../types';

interface SeoLandingWrapperProps {
  config: SeoPageConfig;
  lang: Language;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const SeoLandingWrapper: React.FC<SeoLandingWrapperProps> = ({
  config,
  lang,
  onNavigate,
  children
}) => {
  const isHi = lang === 'hi';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <article className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Crawlable Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="px-1 py-1">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {config.breadcrumbs.map((crumb, idx) => {
            const isLast = idx === config.breadcrumbs.length - 1;
            return (
              <li key={crumb.url} className="flex items-center gap-1.5">
                {idx === 0 && <Home className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                {isLast ? (
                  <span className="font-bold text-slate-900 dark:text-slate-100" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <a
                    href={crumb.url}
                    onClick={(e) => {
                      e.preventDefault();
                      const path = new URL(crumb.url).pathname;
                      onNavigate(path);
                    }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    {crumb.name}
                  </a>
                )}
                {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* 2. Authoritative Page Header with single H1 */}
      <header className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white shadow-xl relative overflow-hidden space-y-3">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 font-bold border border-white/10 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            {isHi ? config.categoryLabelHi : config.categoryLabelEn}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-100 font-semibold text-[11px] border border-emerald-400/20">
            {isHi ? `अद्यतन: ${config.lastUpdated}` : `Updated: ${config.lastUpdated}`}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug">
          {config.h1}
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-4xl font-normal">
          {isHi ? config.introTextHi : config.introTextEn}
        </p>

        {config.officialSource && (
          <div className="pt-2 border-t border-white/15 flex items-center justify-between flex-wrap gap-2 text-xs text-emerald-200/80 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                {isHi ? `प्रमाणित स्रोत: ${config.officialSource.deptHi}` : `Verified: ${config.officialSource.deptEn}`}
                {config.officialSource.circularNo ? ` (${config.officialSource.circularNo})` : ''}
              </span>
            </div>
            {config.officialSource.portalUrl && (
              <a
                href={config.officialSource.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-300 hover:text-white underline flex items-center gap-1"
              >
                विभागीय पोर्टल <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </header>

      {/* 3. The Core Interactive Tool */}
      <section aria-label="Interactive Tool Application" className="space-y-4">
        {children}
      </section>

      {/* 4. How-To Step by Step Instructions (Crawlable for Google HowTo Schema) */}
      {config.howToSteps && config.howToSteps.length > 0 && (
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              {isHi ? 'उपयोग विधि एवं चरणबद्ध निर्देश' : 'How to Use & Step-by-Step Instructions'}
            </h2>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {config.howToSteps.map((step, idx) => (
              <li 
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-xs">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {step.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 5. FAQs Section (Crawlable for FAQPage Schema) */}
      {config.faqs && config.faqs.length > 0 && (
        <section className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              {isHi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQs)' : 'Frequently Asked Questions (FAQs)'}
            </h2>
          </div>

          <div className="space-y-2.5">
            {config.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Related Tools & Guides Internal Links */}
      {config.relatedTools && config.relatedTools.length > 0 && (
        <section className="p-5 sm:p-6 rounded-3xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isHi ? 'संबंधित टूल्स एवं मार्गदर्शिकाएं' : 'Related Tools & Guides'}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {config.relatedTools.map((tool, idx) => (
              <a
                key={idx}
                href={tool.url}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(tool.url);
                }}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center gap-2 shadow-2xs"
              >
                <span>{tool.title}</span>
                {tool.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black">
                    {tool.badge}
                  </span>
                )}
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 7. Official E-E-A-T Disclaimer */}
      <footer className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <b>विधिक अस्वीकरण (Official Disclaimer):</b> शाला सहायक (shalasahayak.in) राजस्थान के शिक्षकों एवं विद्यालय कार्मिकों हेतु एक स्वतंत्र डिजिटल सहायता टूलकिट है। यह किसी भी सरकारी विभाग की आधिकारिक वेबसाइट नहीं है। सभी गणनाएं राज्य वित्त विभाग एवं सेवा नियमों के नवीनतम परिपत्रों पर आधारित हैं। किसी भी संशय की स्थिति में मूल सरकारी राजपत्र व परिपत्र ही मान्य होंगे।
        </div>
      </footer>
    </article>
  );
};
