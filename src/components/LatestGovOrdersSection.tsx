import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Coins, 
  Building,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Language } from '../types';

export interface GovOrder {
  id: string;
  category: 'da' | 'increment' | 'bonus' | 'pay_commission' | string;
  categoryLabelHi: string;
  categoryLabelEn: string;
  titleHi: string;
  titleEn: string;
  orderNumber?: string;
  departmentHi: string;
  departmentEn: string;
  orderDate: string;
  effectiveDate?: string;
  summaryHi: string;
  summaryEn: string;
  impactHi?: string;
  impactEn?: string;
  sources?: Array<{ title: string; url: string }>;
  toolActionSubtab?: 'salary' | 'bonus' | '8thpay' | 'rules' | string;
}

interface LatestGovOrdersSectionProps {
  lang: Language;
  onNavigateToTool?: (toolSubtab: string) => void;
}

export const LatestGovOrdersSection: React.FC<LatestGovOrdersSectionProps> = ({
  lang,
  onNavigateToTool,
}) => {
  const isHi = lang === 'hi';
  const [orders, setOrders] = useState<GovOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isGrounded, setIsGrounded] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [searchSources, setSearchSources] = useState<Array<{ title: string; url: string }>>([]);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const fetchOrders = async (topic = activeFilter, isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setErrorNotice(null);

    try {
      const res = await fetch('/api/government-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, refresh: isManual }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        setIsGrounded(!!data.groundedWithSearch);
        setLastUpdated(data.lastUpdated || new Date().toISOString());
        if (Array.isArray(data.searchSources)) {
          setSearchSources(data.searchSources);
        }
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err: any) {
      console.error('Failed to fetch government orders:', err);
      setErrorNotice(isHi ? 'ताज़ा आदेश लोड करने में समस्या आई, पूर्व सत्यापित परिपत्र प्रदर्शित हैं।' : 'Could not refresh orders live; showing verified archive.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders(activeFilter);
  }, [activeFilter]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'da':
        return <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'bonus':
        return <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'pay_commission':
        return <Coins className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case 'da':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'bonus':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'pay_commission':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  const filterTabs = [
    { id: 'all', labelHi: 'सभी आदेश', labelEn: 'All Circulars' },
    { id: 'da', labelHi: 'महंगाई भत्ता (DA)', labelEn: 'Dearness Allowance' },
    { id: 'increment', labelHi: 'वेतन वृद्धि', labelEn: 'Annual Increment' },
    { id: 'bonus', labelHi: 'दीपावली बोनस', labelEn: 'Diwali Bonus' },
    { id: 'pay_commission', labelHi: '8वां वेतन आयोग', labelEn: '8th Pay Commission' },
  ];

  return (
    <section 
      id="latest-gov-orders-section"
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4"
    >
      {/* Header with Search Grounding Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {isHi ? 'नवीनतम सरकारी आदेश एवं परिपत्र' : 'Latest Government Orders & Circulars'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi 
                  ? 'राजस्थान वित्त विभाग एवं स्कूल शिक्षा विभाग के ताज़ा परिपत्र (DA, वेतन वृद्धि व बोनस)'
                  : 'Recent Rajasthan Finance & Education circulars on DA, increment & bonus'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Search Grounded Status & Refresh Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div 
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
              isGrounded
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {isGrounded ? (
              <>
                <Search className="w-3 h-3 text-blue-500 animate-pulse" />
                <span>{isHi ? 'Google Search ग्राउंडेड' : 'Google Search Grounded'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isHi ? 'प्रमाणित अभिलेख' : 'Verified Archives'}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => fetchOrders(activeFilter, true)}
            disabled={refreshing || loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title={isHi ? 'Google Search से ताज़ा आदेश जांचें' : 'Search latest orders via Google Search'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">{isHi ? 'ताज़ा खोजें' : 'Refresh Live'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 border min-h-[36px] ${
              activeFilter === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            {isHi ? tab.labelHi : tab.labelEn}
          </button>
        ))}
      </div>

      {errorNotice && (
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-bold">
            {isHi ? 'Google Search द्वारा ताज़ा राजस्थान परिपत्र खोजे जा रहे हैं...' : 'Searching latest Rajasthan circulars via Google Search...'}
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-6 text-center text-slate-500 text-xs">
          {isHi ? 'चयनित श्रेणी में कोई परिपत्र उपलब्ध नहीं है।' : 'No circulars found for selected category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Badge & Date */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1 ${getCategoryBadgeClass(order.category)}`}>
                    {getCategoryIcon(order.category)}
                    <span>{isHi ? order.categoryLabelHi : order.categoryLabelEn}</span>
                  </span>
                  {order.orderDate && (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{order.orderDate}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-snug">
                  {isHi ? order.titleHi : order.titleEn}
                </h4>

                {/* Department & Order Number */}
                <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{isHi ? order.departmentHi : order.departmentEn}</span>
                  </span>
                  {order.orderNumber && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                      {order.orderNumber}
                    </span>
                  )}
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isHi ? order.summaryHi : order.summaryEn}
                </p>

                {/* Teacher Financial Impact Note */}
                {(order.impactHi || order.impactEn) && (
                  <div className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-emerald-900 dark:text-emerald-200 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">{isHi ? 'कार्मिक लाभ: ' : 'Benefit Impact: '}</strong>
                      <span>{isHi ? order.impactHi : order.impactEn}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons & Source Links */}
              <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-2 flex-wrap">
                {/* Tool Launcher Link */}
                {order.toolActionSubtab && onNavigateToTool && (
                  <button
                    type="button"
                    onClick={() => onNavigateToTool(order.toolActionSubtab!)}
                    className="text-xs font-black text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {order.toolActionSubtab === 'salary' 
                        ? (isHi ? 'वेतन कैलकुलेटर में जांचें' : 'Calculate in Salary Calc')
                        : order.toolActionSubtab === 'bonus'
                        ? (isHi ? 'बोनस कैलकुलेटर खोलें' : 'Calculate in Bonus Calc')
                        : (isHi ? '8वां वेतन कैलकुलेटर' : '8th Pay Calculator')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* External Verified Source Link */}
                {order.sources && order.sources.length > 0 && (
                  <div className="flex items-center gap-2 ml-auto">
                    {order.sources.slice(0, 2).map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        title={src.title}
                      >
                        <span className="truncate max-w-[150px]">{src.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Grounding Source Citations Footer */}
      {searchSources.length > 0 && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {isHi ? 'सत्यापित स्रोत:' : 'Grounding Sources:'}
            </span>
            {searchSources.slice(0, 3).map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{src.title}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
          {lastUpdated && (
            <span className="text-[10px] text-slate-400 self-end sm:self-auto">
              {isHi ? 'अपडेट: ' : 'Updated: '} {new Date(lastUpdated).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </section>
  );
};
