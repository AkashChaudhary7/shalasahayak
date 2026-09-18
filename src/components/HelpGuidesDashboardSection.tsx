import React from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  FileText, 
  Calculator, 
  Award, 
  Coins, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';
import { ALL_HELP_GUIDES, getHelpGuideById } from '../data/helpGuides';

interface HelpGuidesDashboardSectionProps {
  lang: Language;
  onOpenGuide: (guideId: string) => void;
  onViewAllGuides: () => void;
  onNavigateToTool?: (toolId: string) => void;
}

export const HelpGuidesDashboardSection: React.FC<HelpGuidesDashboardSectionProps> = ({
  lang,
  onOpenGuide,
  onViewAllGuides,
  onNavigateToTool
}) => {
  const isHi = lang === 'hi';

  // Curated list of high-impact guides for tools requested
  const featuredGuideIds = [
    'useful-8thpay-guide',
    'paymatrix-guide',
    'useful-bonus-guide',
    'useful-excel-guide',
    'teacher-mdm-guide',
    'incharge-exam-guide'
  ];

  const featuredGuides = featuredGuideIds
    .map(id => getHelpGuideById(id))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <section 
      id="help-and-guide-section"
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              {isHi ? 'सहायता एवं मार्गदर्शिका केंद्र (Help & Guides)' : 'Help & User Guides Center'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi 
                ? 'प्रत्येक टूल के लिए विस्तृत, प्रमाणित व चरणबद्ध सरकारी नियमों की गाइड'
                : 'In-depth, SEO-optimized guides & official circulars for every tool'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAllGuides}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span>{isHi ? 'सभी 25+ गाइड्स देखें' : 'View All 25+ Guides'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Featured Guides Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {featuredGuides.map((guide) => {
          return (
            <article
              key={guide.id}
              className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500/60 dark:hover:border-emerald-600 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                {/* Category Badge */}
                <div className="flex items-center justify-between gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/70">
                    {isHi ? guide.categoryHi : guide.categoryEn}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {guide.readTime}
                  </span>
                </div>

                {/* Title */}
                <h4 
                  onClick={() => onOpenGuide(guide.id)}
                  className="text-sm font-black text-slate-900 dark:text-slate-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  {isHi ? guide.titleHi : guide.titleEn}
                </h4>

                {/* Summary */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {isHi ? guide.summaryHi : guide.summaryEn}
                </p>
              </div>

              {/* Action Buttons: Read Guide (New Page) + Tool Action Link */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onOpenGuide(guide.id)}
                  className="text-xs font-black text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{isHi ? 'विस्तृत गाइड पढ़ें' : 'Read Guide'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {guide.toolId && onNavigateToTool && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTool(guide.toolId)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                    title={isHi ? 'सीधे संबंधित टूल खोलें' : 'Open related tool'}
                  >
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                    <span>{isHi ? 'टूल खोलें' : 'Try Tool'}</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
