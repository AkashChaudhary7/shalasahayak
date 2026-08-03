import React, { useState, useMemo } from 'react';
import helpGuidesData from '../data/helpGuidesData.json';
import { Language } from '../types';
import {
  Search,
  BookOpen,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Printer,
  X,
  FileText,
  Lightbulb,
  ChevronRight,
  HelpCircle,
  Globe
} from 'lucide-react';

export interface HelpStep {
  stepNum: number;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  tipHi?: string;
  tipEn?: string;
}

export interface HelpGuide {
  id: string;
  toolId: string;
  categoryKey: string;
  categoryHi: string;
  categoryEn: string;
  titleHi: string;
  titleEn: string;
  readTime: string;
  updatedDate: string;
  iconName?: string;
  summaryHi: string;
  summaryEn: string;
  overviewHi: string;
  overviewEn: string;
  prerequisitesHi?: string[];
  prerequisitesEn?: string[];
  keyBenefitsHi?: string[];
  keyBenefitsEn?: string[];
  steps: HelpStep[];
}

interface HelpGuidesWidgetProps {
  lang: Language;
  onOpenTool?: (toolId: string) => void;
}

export const HelpGuidesWidget: React.FC<HelpGuidesWidgetProps> = ({
  lang,
  onOpenTool
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeGuide, setActiveGuide] = useState<HelpGuide | null>(null);

  const guides = helpGuidesData as HelpGuide[];

  const categories = useMemo(() => {
    const map = new Map<string, { key: string; nameHi: string; nameEn: string }>();
    map.set('all', { key: 'all', nameHi: 'सभी गाइड', nameEn: 'All Guides' });
    
    guides.forEach(g => {
      if (!map.has(g.categoryKey)) {
        map.set(g.categoryKey, {
          key: g.categoryKey,
          nameHi: g.categoryHi,
          nameEn: g.categoryEn
        });
      }
    });
    
    return Array.from(map.values());
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      const matchesCategory = selectedCategory === 'all' || guide.categoryKey === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const titleMatch = guide.titleHi.toLowerCase().includes(q) || guide.titleEn.toLowerCase().includes(q);
      const summaryMatch = guide.summaryHi.toLowerCase().includes(q) || guide.summaryEn.toLowerCase().includes(q);
      const categoryMatch = guide.categoryHi.toLowerCase().includes(q) || guide.categoryEn.toLowerCase().includes(q);

      return matchesCategory && (titleMatch || summaryMatch || categoryMatch);
    });
  }, [guides, searchQuery, selectedCategory]);

  return (
    <div className="space-y-5 animate-fadeIn font-sans">
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white p-5 rounded-3xl border border-sky-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black border border-sky-400/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>नॉलेज बेस व गाइड लाइब्रेरी</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            उपयोग मार्गदर्शिकाएँ (Help Guides)
          </h2>
          <p className="text-xs text-sky-200/90 font-medium">
            शाला दर्पण प्रविष्टियाँ, पीईईओ आदेश व टूल्स उपयोग करने के सरल चरण।
          </p>
        </div>

        <div className="text-right shrink-0 hidden sm:block">
          <span className="text-2xl font-black font-mono text-amber-300">{guides.length}</span>
          <span className="block text-[10px] text-sky-200 font-bold uppercase">हेल्प गाइड्स</span>
        </div>
      </div>

      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="मार्गदर्शिका खोजें (उदा. पीईईओ आदेश, शिविरा, पे-मैट्रिक्स...)"
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none text-xs font-medium text-slate-800 dark:text-slate-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {lang === 'hi' ? cat.nameHi : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => setActiveGuide(guide)}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-500/50 transition-all cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                  {lang === 'hi' ? guide.categoryHi : guide.categoryEn}
                </span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>{guide.readTime}</span>
                </span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                {lang === 'hi' ? guide.titleHi : guide.titleEn}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {lang === 'hi' ? guide.summaryHi : guide.summaryEn}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
              <span className="flex items-center gap-1">
                <span>पूर्ण गाइड देखें</span>
                <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {guide.steps.length} चरण
              </span>
            </div>
          </div>
        ))}
      </div>

      {activeGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-auto">
            <div className="p-5 bg-gradient-to-r from-sky-900 to-indigo-950 text-white flex items-start justify-between gap-3 shrink-0">
              <div>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-sky-500/20 text-amber-300 border border-sky-400/30">
                  {activeGuide.categoryHi}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white mt-1">
                  {lang === 'hi' ? activeGuide.titleHi : activeGuide.titleEn}
                </h2>
              </div>
              <button
                onClick={() => setActiveGuide(null)}
                className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800">
                <p className="font-medium text-slate-700 dark:text-slate-200">
                  {lang === 'hi' ? activeGuide.overviewHi : activeGuide.overviewEn}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase">
                  चरण-दर-चरण प्रक्रिया
                </h3>
                {activeGuide.steps.map((s) => (
                  <div key={s.stepNum} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="font-bold text-sky-600 dark:text-sky-400">
                      चरण {s.stepNum}: {lang === 'hi' ? s.titleHi : s.titleEn}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {lang === 'hi' ? s.descriptionHi : s.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट करें</span>
              </button>
              {onOpenTool && (
                <button
                  onClick={() => {
                    onOpenTool(activeGuide.toolId);
                    setActiveGuide(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
                >
                  <span>टूल खोलें</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
