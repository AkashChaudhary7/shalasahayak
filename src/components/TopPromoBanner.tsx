import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Bell, Megaphone, Sparkles, X, ExternalLink, Layers, CheckCircle2 } from 'lucide-react';

interface TopPromoBannerProps {
  lang: 'hi' | 'en';
  onNavigateToTool?: (toolId: string) => void;
}

export const TopPromoBanner: React.FC<TopPromoBannerProps> = ({ lang, onNavigateToTool }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isCompactTicker, setIsCompactTicker] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  const promoCards = [
    {
      id: 'telegram_group',
      categoryHi: 'कम्युनिटी ग्रुप',
      categoryEn: 'Community Group',
      eyebrowHi: 'कम्युनिटी व आधिकारिक अपडेट',
      eyebrowEn: 'Official Community & Updates',
      titleHi: 'शाला सहायक टेलीग्राम व व्हाट्सएप ग्रुप से जुड़ें!',
      titleEn: 'Join Shala Sahayak Telegram & WhatsApp Group!',
      subtitleHi: '50,000+ शिक्षकों एवं PEEOs का सबसे भरोसेमंद नेटवर्क',
      subtitleEn: 'Trusted network of 50,000+ Rajasthan Teachers',
      ctaHi: 'ग्रुप जॉइन करें',
      ctaEn: 'Join Group Now',
      actionType: 'external',
      dateStr: '07 अगस्त 2026',
      url: 'https://t.me/shalasahayak_in',
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-16 sm:h-16 drop-shadow-md">
          <circle cx="60" cy="60" r="50" fill="url(#tgGradApp)" />
          <circle cx="60" cy="60" r="42" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M30 60L90 34L76 90L60 72L48 81L51 65L83 43L41 62L30 60Z" fill="white" />
          <defs>
            <linearGradient id="tgGradApp" x1="10" y1="10" x2="110" y2="110">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'shivira_calendar',
      categoryHi: 'अकादमिक पंचांग',
      categoryEn: 'Academic Calendar',
      eyebrowHi: 'राजकीय अकादमिक पंचांग 2026-27',
      eyebrowEn: 'Academic Calendar 2026-27',
      titleHi: 'शिविरा पंचांग एवं अवकाश तालिका देखें!',
      titleEn: 'Explore Shivira Calendar & Holiday List!',
      subtitleHi: 'मासिक शैक्षणिक गतिविधियां, परीक्षा तिथियां व तिथिवार नियम',
      subtitleEn: 'Monthly academic events, exam dates & rules',
      ctaHi: 'पंचांग खोलें',
      ctaEn: 'Open Calendar',
      actionType: 'internal',
      toolId: 'shivira',
      dateStr: '05 अगस्त 2026',
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-16 sm:h-16 drop-shadow-md">
          <rect x="22" y="22" width="76" height="80" rx="18" fill="url(#calGradApp)" />
          <path d="M22 42H98V22C98 19.337 95.863 17 93.2 17H26.8C24.137 17 22 19.337 22 22V42Z" fill="#044E3B" />
          <rect x="38" y="10" width="10" height="15" rx="5" fill="#FCD34D" />
          <rect x="72" y="10" width="10" height="15" rx="5" fill="#FCD34D" />
          <circle cx="42" cy="60" r="6" fill="#34D399" />
          <circle cx="60" cy="60" r="6" fill="#34D399" />
          <circle cx="78" cy="60" r="6" fill="#FCD34D" />
          <circle cx="42" cy="80" r="6" fill="#34D399" />
          <circle cx="60" cy="80" r="6" fill="#F87171" />
          <circle cx="78" cy="80" r="6" fill="#34D399" />
          <defs>
            <linearGradient id="calGradApp" x1="22" y1="22" x2="98" y2="102">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'peeo_orders',
      categoryHi: 'प्रशासनिक आदेश',
      categoryEn: 'Official Orders',
      eyebrowHi: 'प्रशासनिक आदेश जनरेटर',
      eyebrowEn: 'PEEO Official Order Generator',
      titleHi: '10 सेकंड में पीईईओ आदेश व कार्यमुक्ति पत्र बनाएं!',
      titleEn: 'Generate PEEO Orders & Relieving Letters!',
      subtitleHi: 'ड्यूटी आदेश, रिलीविंग ऑर्डर व सत्यापन पत्र तैयार करें',
      subtitleEn: 'Instant official order generation with seal',
      ctaHi: 'आदेश तैयार करें',
      ctaEn: 'Generate Order',
      actionType: 'internal',
      toolId: 'peeo-orders',
      dateStr: '01 अगस्त 2026',
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-16 sm:h-16 drop-shadow-md">
          <circle cx="60" cy="54" r="38" fill="url(#orderGradApp)" />
          <path d="M60 28L67 45H85L71 56L76 73L60 62L44 73L49 56L35 45H53L60 28Z" fill="#FCD34D" />
          <rect x="50" y="88" width="20" height="18" rx="5" fill="#E11D48" />
          <rect x="36" y="100" width="48" height="10" rx="5" fill="#BE123C" />
          <defs>
            <linearGradient id="orderGradApp" x1="22" y1="16" x2="98" y2="92">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'mdm_milk',
      categoryHi: 'एमडीएम योजना',
      categoryEn: 'MDM Scheme',
      eyebrowHi: 'मिड-डे मील व बाल गोपाल योजना',
      eyebrowEn: 'MDM & Bal Gopal Milk Calculator',
      titleHi: 'दैनिक दूध व खाद्यान्न हिसाब ऑटो-कैलकुलेटर!',
      titleEn: 'Daily MDM Milk & Grain Auto Calculator!',
      subtitleHi: 'गेहूं, चावल, दूध पाउडर मात्रा एवं कुकिंग कॉस्ट शीट जनरेट करें',
      subtitleEn: 'Automated MDM consumption and cooking cost',
      ctaHi: 'हिसाब निकालें',
      ctaEn: 'Calculate MDM',
      actionType: 'internal',
      toolId: 'mdm',
      dateStr: '28 जुलाई 2026',
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-16 sm:h-16 drop-shadow-md">
          <rect x="24" y="28" width="72" height="72" rx="20" fill="url(#mdmGradApp)" />
          <circle cx="60" cy="58" r="22" fill="#FEF3C7" />
          <path d="M52 58C52 52 68 52 68 58C68 64 52 64 52 58Z" fill="#F59E0B" />
          <path d="M60 38V78" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          <path d="M40 58H80" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
          <defs>
            <linearGradient id="mdmGradApp" x1="24" y1="28" x2="96" y2="100">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'pay_matrix',
      categoryHi: 'वेतन गणना',
      categoryEn: 'Pay Calculation',
      eyebrowHi: '7वां वेतन आयोग व एसीपी',
      eyebrowEn: '7th Pay Matrix & ACP Fixation',
      titleHi: 'बेसिक पे, एसीपी व वेतन स्थिरीकरण गणना करें!',
      titleEn: '7th Pay Fixation & Salary Calculator!',
      subtitleHi: 'पे-बैंड, मैट्रिक्स लेवल एवं काल्पनिक वेतन वृद्धि हिसाब',
      subtitleEn: 'Calculate Pay Band, Matrix Level & Increments',
      ctaHi: 'वेतन गणना करें',
      ctaEn: 'Calculate Pay',
      actionType: 'internal',
      toolId: 'peeo-paymatrix',
      dateStr: '25 जुलाई 2026',
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-16 sm:h-16 drop-shadow-md">
          <rect x="22" y="22" width="76" height="76" rx="20" fill="url(#payGradApp)" />
          <rect x="34" y="34" width="52" height="18" rx="6" fill="#0F172A" />
          <text x="78" y="47" fill="#4ADE80" fontSize="11" fontFamily="sans-serif" fontWeight="900" textAnchor="end">₹ 78,500</text>
          <circle cx="44" cy="65" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="60" cy="65" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="76" cy="65" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="44" cy="80" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="60" cy="80" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="76" cy="80" r="5" fill="#4ADE80" />
          <defs>
            <linearGradient id="payGradApp" x1="22" y1="22" x2="98" y2="98">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  // Auto-slide every 5 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoCards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [promoCards.length, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? promoCards.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promoCards.length);
  };

  const handleAction = (card: typeof promoCards[0]) => {
    if (card.actionType === 'external' && card.url) {
      window.open(card.url, '_blank', 'noopener,noreferrer');
    } else if (card.actionType === 'internal' && card.toolId && onNavigateToTool) {
      onNavigateToTool(card.toolId);
    }
  };

  const activeCard = promoCards[currentIndex];

  return (
    <div className="hidden sm:block w-full my-2 px-1 sm:px-2 max-w-md md:max-w-5xl lg:max-w-6xl mx-auto">
      
      {/* NOTIFICATION TICKER & UPDATE BANNER CONTAINER */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/30 shadow-sm hover:shadow-md transition-all duration-300"
      >
        
        {/* NOTIFICATION BAR TOP STRIP */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-3 py-2 flex items-center justify-between text-xs font-bold gap-2">
          
          {/* Left Title with Pulsing Live Dot */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="relative flex items-center justify-center p-1 rounded-lg bg-emerald-500/20 text-amber-300">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <span className="font-black text-[11px] sm:text-xs tracking-wide text-emerald-100 uppercase flex items-center gap-1">
              <span>{lang === 'hi' ? 'नवीनतम सूचनाएं एवं अपडेट्स' : 'Live News & Updates'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-[10px] text-emerald-200">
                {currentIndex + 1}/{promoCards.length}
              </span>
            </span>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setIsCompactTicker(!isCompactTicker)}
              className="px-2 py-0.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-700 text-[10px] font-extrabold text-emerald-200 border border-emerald-700/50 transition-colors flex items-center gap-1 cursor-pointer"
              title={isCompactTicker ? 'विस्तृत देखें' : 'संक्षिप्त करें'}
            >
              <Layers className="w-3 h-3" />
              <span className="hidden sm:inline">
                {isCompactTicker ? (lang === 'hi' ? 'विस्तृत' : 'Expand') : (lang === 'hi' ? 'संक्षिप्त' : 'Compact')}
              </span>
            </button>

            <button
              onClick={() => setShowAllModal(true)}
              className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'hi' ? 'सभी देखें' : 'View All'}</span>
            </button>

            <div className="flex items-center space-x-0.5 pl-1 border-l border-emerald-700/60">
              <button
                onClick={handlePrev}
                className="p-1 rounded hover:bg-emerald-700 text-emerald-200 transition-colors cursor-pointer"
                title="पिछला अपडेट"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded hover:bg-emerald-700 text-emerald-200 transition-colors cursor-pointer"
                title="अगला अपडेट"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* NOTIFICATION CONTENT AREA */}
        {isCompactTicker ? (
          /* COMPACT SINGLE-LINE TICKER BANNER MODE */
          <div className="p-2.5 px-3 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-2 text-xs font-semibold animate-fadeIn">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                {lang === 'hi' ? activeCard.categoryHi : activeCard.categoryEn}
              </span>
              <p className="text-slate-800 dark:text-slate-100 font-bold truncate text-xs sm:text-sm">
                {lang === 'hi' ? activeCard.titleHi : activeCard.titleEn}
              </p>
            </div>

            <button
              onClick={() => handleAction(activeCard)}
              className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <span>{lang === 'hi' ? activeCard.ctaHi : activeCard.ctaEn}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        ) : (
          /* DETAILED NOTIFICATION BANNER CARD MODE */
          <div className="p-3.5 sm:p-4 text-slate-900 dark:text-slate-100 flex items-center justify-between gap-3 relative min-h-[105px]">
            
            {/* Ambient background blur */}
            <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl pointer-events-none"></div>

            {/* Left Content Area */}
            <div className="flex-1 space-y-1.5 z-10 pr-1">
              
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-1.5">
                  <Megaphone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'hi' ? activeCard.eyebrowHi : activeCard.eyebrowEn}</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">
                  {activeCard.dateStr}
                </span>
              </div>

              <h2 className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {lang === 'hi' ? activeCard.titleHi : activeCard.titleEn}
              </h2>

              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1 max-w-xl">
                {lang === 'hi' ? activeCard.subtitleHi : activeCard.subtitleEn}
              </p>

              <div className="pt-1">
                <button
                  onClick={() => handleAction(activeCard)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs border border-emerald-800 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{lang === 'hi' ? activeCard.ctaHi : activeCard.ctaEn}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>

            </div>

            {/* Right Graphic */}
            <div className="shrink-0 z-10 flex items-center justify-center p-0.5">
              <div className="p-1.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 shadow-2xs">
                {activeCard.graphic}
              </div>
            </div>

          </div>
        )}

        {/* PROGRESS INDICATOR DOTS */}
        <div className="bg-slate-100/70 dark:bg-slate-950/90 py-1 px-3 flex items-center justify-center gap-1.5 border-t border-slate-200/60 dark:border-slate-800">
          {promoCards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? 'w-5 bg-emerald-600 dark:bg-emerald-400' : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

      </div>

      {/* ALL UPDATES POPUP MODAL */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 text-amber-300">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {lang === 'hi' ? 'सभी महत्वपूर्ण सूचनाएं व अपडेट्स' : 'All Notifications & Updates'}
                  </h3>
                  <p className="text-[11px] text-emerald-200 font-medium">
                    {lang === 'hi' ? 'शाला सहायक के नवीनतम फीचर्स एवं लिंक्स' : 'Latest features & community links'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAllModal(false)}
                className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable List */}
            <div className="p-3.5 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
              {promoCards.map((card, idx) => (
                <div key={card.id} className="pt-2.5 first:pt-0 flex items-start space-x-3">
                  <div className="shrink-0 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {card.graphic}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {lang === 'hi' ? card.categoryHi : card.categoryEn}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{card.dateStr}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {lang === 'hi' ? card.titleHi : card.titleEn}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {lang === 'hi' ? card.subtitleHi : card.subtitleEn}
                    </p>

                    <div className="mt-2">
                      <button
                        onClick={() => {
                          setShowAllModal(false);
                          handleAction(card);
                        }}
                        className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center space-x-1 cursor-pointer transition-transform active:scale-95"
                      >
                        <span>{lang === 'hi' ? card.ctaHi : card.ctaEn}</span>
                        {card.actionType === 'external' ? (
                          <ExternalLink className="w-3 h-3 text-amber-300" />
                        ) : (
                          <ArrowRight className="w-3 h-3 text-amber-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                onClick={() => setShowAllModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

