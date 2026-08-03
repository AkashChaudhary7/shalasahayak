import React, { useState } from 'react';
import { ALL_TOOLS, AppTool } from '../data/allTools';
import { Language } from '../types';
import { ThreeDIcon, ThreeDCard } from './ThreeDIcon';
import {
  Pin,
  PinOff,
  Plus,
  Check,
  Search,
  SlidersHorizontal,
  X,
  Bookmark,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface QuickViewSectionProps {
  pinnedToolIds: string[];
  onTogglePin: (toolId: string) => void;
  onSelectTool: (category: 'peeo' | 'teacher' | 'incharge' | 'portals', subtab: string) => void;
  lang: Language;
}

export const QuickViewSection: React.FC<QuickViewSectionProps> = ({
  pinnedToolIds,
  onTogglePin,
  onSelectTool,
  lang
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'teacher' | 'incharge' | 'peeo'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map icon name to 3D tactile icon
  const renderToolIcon = (iconName: string, size: number = 36) => {
    switch (iconName) {
      case 'GraduationCap': return <ThreeDIcon name="graduation" size={size} />;
      case 'ShieldAlert': return <ThreeDIcon name="lock" size={size} />;
      case 'Monitor': return <ThreeDIcon name="calculator" size={size} />;
      case 'BookOpen': return <ThreeDIcon name="book" size={size} />;
      case 'FileText': return <ThreeDIcon name="coupon" size={size} />;
      case 'Image': return <ThreeDIcon name="coupon" size={size} />;
      case 'Utensils': return <ThreeDIcon name="utensils" size={size} />;
      case 'Layers': return <ThreeDIcon name="target" size={size} />;
      case 'Bus': return <ThreeDIcon name="bus" size={size} />;
      case 'Award': return <ThreeDIcon name="award" size={size} />;
      case 'TrendingUp': return <ThreeDIcon name="chart" size={size} />;
      case 'Calendar': return <ThreeDIcon name="calendar" size={size} />;
      case 'Users': return <ThreeDIcon name="briefcase" size={size} />;
      case 'Clock': return <ThreeDIcon name="bell" size={size} />;
      case 'Send': return <ThreeDIcon name="coupon" size={size} />;
      case 'FileCheck': return <ThreeDIcon name="shield" size={size} />;
      case 'ExternalLink': return <ThreeDIcon name="link" size={size} />;
      case 'Calculator': return <ThreeDIcon name="calculator" size={size} />;
      default: return <ThreeDIcon name="sparkles" size={size} />;
    }
  };

  // Get pinned tool objects
  const pinnedTools = ALL_TOOLS.filter(t => pinnedToolIds.includes(t.id));

  // Filter tools for the customize modal
  const filteredTools = ALL_TOOLS.filter(tool => {
    const matchesCategory = activeCategoryFilter === 'all' || tool.category === activeCategoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      tool.title.toLowerCase().includes(q) ||
      tool.titleHindi.includes(q) ||
      tool.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeLabel = (cat: string) => {
    if (cat === 'teacher') return lang === 'hi' ? 'शिक्षक' : 'Teacher';
    if (cat === 'incharge') return lang === 'hi' ? 'प्रभारी' : 'Incharge';
    if (cat === 'peeo') return lang === 'hi' ? 'पीईईओ' : 'PEEO';
    return lang === 'hi' ? 'पोर्टल' : 'Portal';
  };

  const getCategoryBadgeStyle = (cat: string) => {
    if (cat === 'teacher') return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200';
    if (cat === 'incharge') return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200';
    if (cat === 'peeo') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200';
  };

  return (
    <div className="space-y-3">
      {/* Quick View Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30">
            <Bookmark className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <h3 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>{lang === 'hi' ? 'त्वरित पहुँच (Quick View)' : 'Pinned Quick Tools'}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                {pinnedTools.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'बार-बार उपयोग में आने वाले टूल्स यहाँ पिन करें' : 'Frequently accessed Teacher & Incharge tools'}
            </p>
          </div>
        </div>

        {/* Pin Tools Customizer Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200/80 dark:border-emerald-800/80 transition-all active:scale-95 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'अनुकूलित करें' : 'Customize'}</span>
        </button>
      </div>

      {/* Pinned Tools Grid - Compact 1/3 to 1/4 Scale */}
      {pinnedTools.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {pinnedTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.category, tool.subtab)}
              className="relative p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1 h-20 group"
            >
              <div className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 group-hover:scale-110 transition-transform">
                {renderToolIcon(tool.iconName, 22)}
              </div>

              <span className="text-[10px] sm:text-[10.5px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight px-0.5">
                {lang === 'hi' ? tool.titleHindi : tool.title}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(tool.id);
                }}
                title={lang === 'hi' ? 'पिन हटाएं' : 'Unpin tool'}
                className="absolute top-1 right-1 z-10 p-1 rounded-full bg-slate-100 dark:bg-slate-800/90 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-slate-200/60 dark:border-slate-700/80 transition-all cursor-pointer opacity-70 hover:opacity-100"
              >
                <Pin className="w-2.5 h-2.5 fill-amber-400 text-amber-500 rotate-45" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
          <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            {lang === 'hi' ? 'कोई टूल्स पिन नहीं किए गए हैं' : 'No tools pinned to Quick View'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs inline-flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'hi' ? 'पसंदीदा टूल्स पिन करें' : 'Pin Favorite Tools'}</span>
          </button>
        </div>
      )}

      {/* CUSTOMIZE PINNED TOOLS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-emerald-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-amber-300 fill-amber-300" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-amber-300">
                    {lang === 'hi' ? 'क्विक-व्यू टूल्स चुनें' : 'Customize Quick View Tools'}
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    {lang === 'hi' ? 'मुख्य डैशबोर्ड पर पिन करने के लिए टूल्स पर टिक करें' : 'Select tools to pin on your main home dashboard'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs & Search Bar */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'टूल खोजें...' : 'Search tools...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-1">
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategoryFilter === 'all'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lang === 'hi' ? 'सभी' : 'All'} ({ALL_TOOLS.length})
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('teacher')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategoryFilter === 'teacher'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lang === 'hi' ? 'शिक्षक' : 'Teacher Tools'}
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('incharge')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategoryFilter === 'incharge'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lang === 'hi' ? 'प्रभारी' : 'Incharge Modules'}
                </button>

                <button
                  onClick={() => setActiveCategoryFilter('peeo')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategoryFilter === 'peeo'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lang === 'hi' ? 'पीईईओ' : 'PEEO Tools'}
                </button>
              </div>
            </div>

            {/* List of Available Tools */}
            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {filteredTools.map((tool) => {
                const isPinned = pinnedToolIds.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    onClick={() => onTogglePin(tool.id)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isPinned
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${tool.colorBg} flex items-center justify-center shrink-0`}>
                        {renderToolIcon(tool.iconName, 32)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate">
                            {lang === 'hi' ? tool.titleHindi : tool.title}
                          </h4>
                          <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${getCategoryBadgeStyle(tool.category)} shrink-0`}>
                            {getCategoryBadgeLabel(tool.category)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {lang === 'hi' ? tool.descriptionHindi : tool.description}
                        </p>
                      </div>
                    </div>

                    {/* Checkbox / Pin Icon */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(tool.id);
                      }}
                      className={`p-2 rounded-xl transition-colors shrink-0 ${
                        isPinned
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {isPinned ? (
                        <Pin className="w-4 h-4 fill-slate-950 rotate-45" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {pinnedToolIds.length} {lang === 'hi' ? 'टूल्स पिन किए गए' : 'tools pinned'}
              </span>

              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>{lang === 'hi' ? 'पूर्ण करें' : 'Done'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
