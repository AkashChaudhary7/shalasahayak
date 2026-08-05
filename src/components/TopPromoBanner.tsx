import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface TopPromoBannerProps {
  lang: 'hi' | 'en';
  onNavigateToTool?: (toolId: string) => void;
}

export const TopPromoBanner: React.FC<TopPromoBannerProps> = ({ lang, onNavigateToTool }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const promoCards = [
    {
      id: 'telegram_group',
      eyebrowHi: 'कम्युनिटी व आधिकारिक अपडेट',
      eyebrowEn: 'Official Community & Updates',
      titleHi: 'शाला सहायक टेलीग्राम व व्हाट्सएप ग्रुप से जुड़ें!',
      titleEn: 'Join Shala Sahayak Telegram & WhatsApp Group!',
      subtitleHi: '50,000+ शिक्षकों एवं PEEOs का सबसे भरोसेमंद नेटवर्क',
      subtitleEn: 'Trusted network of 50,000+ Rajasthan Teachers',
      ctaHi: 'ग्रुप जॉइन करें',
      ctaEn: 'Join Group Now',
      actionType: 'external',
      url: 'https://t.me/shalasahayak_in',
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-20 sm:h-20 drop-shadow-md">
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
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-20 sm:h-20 drop-shadow-md">
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
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-20 sm:h-20 drop-shadow-md">
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
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-20 sm:h-20 drop-shadow-md">
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
      graphic: (
        <svg viewBox="0 0 120 120" fill="none" className="w-10 h-10 sm:w-20 sm:h-20 drop-shadow-md">
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
    }, 5000);
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
    <div className="w-full mt-0 mb-2 px-3 sm:px-4 max-w-md md:max-w-5xl lg:max-w-6xl mx-auto">
      
      {/* UNIFORM APP-BACKGROUND BANNER CARD CONTAINER */}
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md transition-all duration-300 group"
      >
        
        {/* App-Consistent Slide Post Content Canvas */}
        <div className="p-4 sm:p-5 text-slate-900 dark:text-slate-100 min-h-[130px] sm:min-h-[140px] flex items-center justify-between gap-3 relative">
          
          {/* Subtle Ambient Tint Backdrop Circle */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 blur-2xl pointer-events-none"></div>

          {/* Left Content Area */}
          <div className="flex-1 space-y-1.5 z-10 pr-2">
            
            {/* Consistent Eyebrow Badge */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{lang === 'hi' ? activeCard.eyebrowHi : activeCard.eyebrowEn}</span>
              </span>
            </div>

            {/* Consistent High-Impact Headline */}
            <h2 className="text-sm sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight">
              {lang === 'hi' ? activeCard.titleHi : activeCard.titleEn}
            </h2>

            {/* Consistent Subtitle */}
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1 max-w-lg hidden sm:block">
              {lang === 'hi' ? activeCard.subtitleHi : activeCard.subtitleEn}
            </p>

            {/* Consistent App-Style CTA Button */}
            <div className="pt-1">
              <button
                onClick={() => handleAction(activeCard)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs border border-emerald-800 transition-all duration-200 hover:scale-102 active:scale-95 cursor-pointer"
              >
                <span>{lang === 'hi' ? activeCard.ctaHi : activeCard.ctaEn}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>

          </div>

          {/* Right Vector Graphic Showcase */}
          <div className="shrink-0 z-10 flex items-center justify-center p-1 relative">
            <div className="relative p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 hover:scale-105 transition-transform duration-300">
              {activeCard.graphic}
            </div>
          </div>

          {/* Carousel Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-emerald-700 hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-700 transition-all cursor-pointer z-20 opacity-0 group-hover:opacity-100 hover:scale-110"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Carousel Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-emerald-700 hover:text-white text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-md border border-slate-200 dark:border-slate-700 transition-all cursor-pointer z-20 opacity-0 group-hover:opacity-100 hover:scale-110"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

        </div>

        {/* Carousel Indicator Dots Bar - Matching App Background */}
        <div className="bg-slate-50 dark:bg-slate-950/80 py-1.5 px-3 flex items-center justify-center gap-2 border-t border-slate-100 dark:border-slate-800">
          {promoCards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? 'w-6 bg-emerald-600 dark:bg-emerald-500 shadow-xs' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
