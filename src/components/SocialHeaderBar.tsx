import React from 'react';

export const SocialHeaderBar: React.FC = () => {
  const socialPlatforms = [
    {
      id: 'telegram',
      name: 'Telegram Channel',
      label: 'टेलीग्राम ग्रुप',
      url: 'https://t.me/shalasahayak_in',
      iconSvg: (
        <svg viewBox="0 0 100 100" fill="none" className="w-7.5 h-7.5 sm:w-8 sm:h-8 drop-shadow-md">
          <circle cx="50" cy="50" r="42" fill="url(#tgGrad)" />
          <path d="M25 50L75 28L63 76L48 60L39 68L41 55L69 36L34 52L25 50Z" fill="white" />
          <defs>
            <linearGradient id="tgGrad" x1="10" y1="10" x2="90" y2="90">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'youtube',
      name: 'YouTube Channel',
      label: 'यूट्यूब चैनल',
      url: 'https://youtube.com/@shalasahayak_in',
      iconSvg: (
        <svg viewBox="0 0 100 100" fill="none" className="w-7.5 h-7.5 sm:w-8 sm:h-8 drop-shadow-md">
          <rect x="12" y="24" width="76" height="52" rx="16" fill="url(#ytGrad)" />
          <polygon points="42,36 68,50 42,64" fill="white" />
          <defs>
            <linearGradient id="ytGrad" x1="12" y1="24" x2="88" y2="76">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="100%" stopColor="#CC0000" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      label: 'ट्विटर (X)',
      url: 'https://x.com/shalasahayak',
      iconSvg: (
        <svg viewBox="0 0 100 100" fill="none" className="w-7.5 h-7.5 sm:w-8 sm:h-8 drop-shadow-md">
          <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#twGrad)" />
          <path d="M30 28L45 50L30 72H37L48 55L59 72H70L54 48L68 28H61L51 43L41 28H30Z" fill="white" />
          <defs>
            <linearGradient id="twGrad" x1="10" y1="10" x2="90" y2="90">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'facebook',
      name: 'Facebook Page',
      label: 'फेसबुक',
      url: 'https://www.facebook.com/profile.php?id=61592405834954',
      iconSvg: (
        <svg viewBox="0 0 100 100" fill="none" className="w-7.5 h-7.5 sm:w-8 sm:h-8 drop-shadow-md">
          <circle cx="50" cy="50" r="42" fill="url(#fbGrad)" />
          <path d="M56 32H63V20H52C42 20 38 26 38 36V45H30V56H38V80H50V56H60L62 45H50V38C50 34 52 32 56 32Z" fill="white" />
          <defs>
            <linearGradient id="fbGrad" x1="10" y1="10" x2="90" y2="90">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'instagram',
      name: 'Instagram Page',
      label: 'इंस्टाग्राम',
      url: 'https://www.instagram.com/shalasahayak.in/',
      iconSvg: (
        <svg viewBox="0 0 100 100" fill="none" className="w-7.5 h-7.5 sm:w-8 sm:h-8 drop-shadow-md">
          <rect x="10" y="10" width="80" height="80" rx="22" fill="url(#igGrad)" />
          <rect x="28" y="28" width="44" height="44" rx="12" stroke="white" strokeWidth="6" fill="none" />
          <circle cx="50" cy="50" r="12" stroke="white" strokeWidth="6" fill="none" />
          <circle cx="62" cy="38" r="4" fill="white" />
          <defs>
            <linearGradient id="igGrad" x1="10" y1="90" x2="90" y2="10">
              <stop offset="0%" stopColor="#FACE15" />
              <stop offset="40%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl py-3 px-3.5 text-slate-800 dark:text-slate-200 shadow-sm my-2">
      <div className="max-w-md md:max-w-5xl lg:max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        
        {/* Label and Live Status */}
        <div className="flex items-center space-x-2 shrink-0 justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-black text-slate-800 dark:text-white tracking-wide">
            आधिकारिक सोशल मीडिया चैनल (Official Channels)
          </span>
        </div>

        {/* 3D Prominent Social Icons Row */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap overflow-x-auto scrollbar-none py-0.5">
          {socialPlatforms.map((plat) => (
            <a
              key={plat.id}
              href={plat.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${plat.name} (${plat.label})`}
              aria-label={`${plat.name} ${plat.label}`}
              className="flex items-center justify-center p-2 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/80 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs shrink-0"
            >
              <div className="shrink-0">{plat.iconSvg}</div>
              <span className="sr-only">{plat.name}</span>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
};
