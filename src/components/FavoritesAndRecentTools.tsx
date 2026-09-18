import React, { useState, useEffect } from 'react';
import { ALL_TOOLS, AppTool, DEFAULT_PINNED_TOOL_IDS } from '../data/allTools';
import { Language } from '../types';
import { ThreeDCard, ThreeDIcon } from './ThreeDIcon';
import {
  Star,
  Clock,
  Pin,
  PinOff,
  Sliders,
  X,
  Search,
  Check,
  Sparkles,
  Calculator,
  Plus
} from 'lucide-react';

interface FavoritesAndRecentToolsProps {
  pinnedToolIds: string[];
  onTogglePin: (toolId: string) => void;
  onSelectTool: (toolId: string) => void;
  lang: Language;
}

const RECENT_TOOLS_KEY = 'shala_recent_tools';

export const getRecentToolIds = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_TOOLS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return ['useful-bonus', 'useful-8thpay', 'peeo-increment'];
};

export const saveRecentToolId = (toolId: string) => {
  try {
    const existing = getRecentToolIds();
    const updated = [toolId, ...existing.filter(id => id !== toolId)].slice(0, 8);
    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
};

export const FavoritesAndRecentTools: React.FC<FavoritesAndRecentToolsProps> = ({
  pinnedToolIds,
  onTogglePin,
  onSelectTool,
  lang
}) => {
  const isHi = lang === 'hi';
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent'>('favorites');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'calculator' | 'peeo' | 'incharge' | 'teacher'>('all');
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentIds(getRecentToolIds());
  }, []);

  // Map toolId to icon
  const getToolIcon3D = (tool: AppTool): string => {
    if (tool.id.includes('bonus') || tool.id.includes('award') || tool.id.includes('inspire')) return 'award';
    if (tool.id.includes('8thpay') || tool.id.includes('salary') || tool.id.includes('calculator')) return 'calculator';
    if (tool.id.includes('excel') || tool.id.includes('qrcode')) return 'target';
    if (tool.id.includes('rules') || tool.id.includes('diary') || tool.id.includes('assembly') || tool.id.includes('library')) return 'book';
    if (tool.id.includes('timetable')) return 'calendar';
    if (tool.id.includes('increment') || tool.id.includes('growth')) return 'chart';
    if (tool.id.includes('mdm')) return 'utensils';
    if (tool.id.includes('transport')) return 'bus';
    if (tool.id.includes('exam')) return 'target';
    if (tool.id.includes('pti')) return 'award';
    if (tool.id.includes('class') || tool.id.includes('marksheet')) return 'graduation';
    if (tool.id.includes('anomaly') || tool.id.includes('satyapan') || tool.id.includes('pramanikaran')) return 'shield';
    if (tool.id.includes('incharge') || tool.id.includes('users')) return 'briefcase';
    return 'sparkles';
  };

  const getToolBgTint = (tool: AppTool): string => {
    if (tool.id.includes('bonus') || tool.id.includes('pti')) return 'bg-orange-50 dark:bg-orange-950/40';
    if (tool.id.includes('8thpay') || tool.id.includes('mdm') || tool.id.includes('timetable')) return 'bg-amber-50 dark:bg-amber-950/40';
    if (tool.id.includes('salary') || tool.id.includes('subject')) return 'bg-blue-50 dark:bg-blue-950/40';
    if (tool.id.includes('increment') || tool.id.includes('class') || tool.id.includes('excel')) return 'bg-emerald-50 dark:bg-emerald-950/40';
    if (tool.id.includes('transport') || tool.id.includes('library')) return 'bg-purple-50 dark:bg-purple-950/40';
    return 'bg-teal-50 dark:bg-teal-950/40';
  };

  // Find tool objects
  const pinnedTools = pinnedToolIds
    .map(id => ALL_TOOLS.find(t => t.id === id))
    .filter((t): t is AppTool => Boolean(t));

  const recentTools = recentIds
    .map(id => ALL_TOOLS.find(t => t.id === id))
    .filter((t): t is AppTool => Boolean(t));

  const currentDisplayTools = activeTab === 'favorites' ? pinnedTools : recentTools;

  // Filter tools in modal
  const filteredToolsForManage = ALL_TOOLS.filter(t => {
    const isCalc = t.id.includes('bonus') || t.id.includes('pay') || t.id.includes('salary') || t.id.includes('calc');
    let matchesCat = true;
    if (categoryFilter === 'calculator') matchesCat = isCalc;
    else if (categoryFilter === 'peeo') matchesCat = t.category === 'peeo';
    else if (categoryFilter === 'incharge') matchesCat = t.category === 'incharge';
    else if (categoryFilter === 'teacher') matchesCat = t.category === 'teacher';

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q ||
      t.title.toLowerCase().includes(q) ||
      t.titleHindi.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.descriptionHindi.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-2.5 animate-fadeIn">
      {/* SECTION HEADER & CONTROLS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* TABS: FAVORITES / RECENT */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                activeTab === 'favorites'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-slate-950 text-slate-950' : 'text-amber-500'}`} />
              <span>{isHi ? 'पसंदीदा टूल्स' : 'Favorites'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'favorites' ? 'bg-slate-950/15 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {pinnedTools.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('recent');
                setRecentIds(getRecentToolIds());
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] ${
                activeTab === 'recent'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isHi ? 'हालिया टूल्स' : 'Recent'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'recent' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {recentTools.length}
              </span>
            </button>
          </div>

          {/* MANAGE / PIN BUTTON */}
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer min-h-[36px] shrink-0"
            title={isHi ? 'कैलकुलेटर पिन या अनपिन करें' : 'Pin or unpin calculators'}
          >
            <Pin className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{isHi ? 'पिन प्रबंधित करें' : 'Manage Pins'}</span>
            <span className="sm:hidden">{isHi ? 'पिन' : 'Pin'}</span>
          </button>
        </div>
      </div>

      {/* 3D ICON CARDS GRID (3-column on mobile, up to 6 on desktop) */}
      {currentDisplayTools.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
          {currentDisplayTools.map((tool, idx) => (
            <div key={tool.id} className="relative group">
              <ThreeDCard
                onClick={() => {
                  saveRecentToolId(tool.id);
                  onSelectTool(tool.id);
                }}
                icon={getToolIcon3D(tool)}
                bgTint={getToolBgTint(tool)}
                label={isHi ? tool.titleHindi.split(' ')[0] + ' ' + (tool.titleHindi.split(' ')[1] || '') : tool.title}
                delayIndex={idx}
              />
              {activeTab === 'favorites' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(tool.id);
                  }}
                  className="absolute top-1 right-1 p-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-amber-500 hover:text-rose-500 shadow-xs border border-slate-200/60 dark:border-slate-700/60 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                  title={isHi ? 'अनपिन करें' : 'Unpin'}
                >
                  <PinOff className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            {activeTab === 'favorites'
              ? (isHi ? 'कोई टूल पिन नहीं किया गया है। अपने पसंदीदा कैलकुलेटर पिन करें!' : 'No tools pinned yet. Pin your most used calculators!')
              : (isHi ? 'कोई हालिया टूल नहीं है। किसी भी टूल को खोलें।' : 'No recent tools found.')}
          </p>
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHi ? 'कैलकुलेटर पिन करें' : 'Pin Calculators'}</span>
          </button>
        </div>
      )}

      {/* MANAGE PINS MODAL */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                  <Pin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
                    {isHi ? 'पसंदीदा कैलकुलेटर पिन करें' : 'Pin Favorite Calculators'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isHi ? 'शीर्ष पर तुरंत पहुँचने हेतु स्टार / पिन करें' : 'Pin your most used tools for quick 1-tap access'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isHi ? 'कैलकुलेटर या टूल खोजें...' : 'Search calculator or tool...'}
                  className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {[
                  { id: 'all', labelHi: 'सभी', labelEn: 'All' },
                  { id: 'calculator', labelHi: 'कैलकुलेटर', labelEn: 'Calculators' },
                  { id: 'peeo', labelHi: 'पीईईओ', labelEn: 'PEEO' },
                  { id: 'incharge', labelHi: 'प्रभारी', labelEn: 'Incharge' },
                  { id: 'teacher', labelHi: 'शिक्षक', labelEn: 'Teacher' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black shrink-0 transition-all cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {isHi ? cat.labelHi : cat.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* List of tools to toggle */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredToolsForManage.map(tool => {
                const isPinned = pinnedToolIds.includes(tool.id);
                return (
                  <div
                    key={tool.id}
                    className="pt-1.5 flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                        <ThreeDIcon name={getToolIcon3D(tool) as any} size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                          {isHi ? tool.titleHindi : tool.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {isHi ? tool.descriptionHindi : tool.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onTogglePin(tool.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shrink-0 cursor-pointer min-h-[34px] ${
                        isPinned
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {isPinned ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{isHi ? 'पिन है' : 'Pinned'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isHi ? 'पिन करें' : 'Pin'}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {isHi ? `${pinnedTools.length} टूल्स पिन किए गए हैं` : `${pinnedTools.length} tools pinned`}
              </span>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black hover:bg-slate-800 cursor-pointer"
              >
                {isHi ? 'पूर्ण (Done)' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
